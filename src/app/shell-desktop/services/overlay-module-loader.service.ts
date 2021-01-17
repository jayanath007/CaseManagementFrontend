
import { take } from 'rxjs/operators';

import {
  Injectable, SystemJsNgModuleLoader, Injector,
  NgModuleFactory, ComponentFactoryResolver, ReflectiveInjector,
  InjectionToken, ViewContainerRef, ApplicationRef
} from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';


import { OverlayLoaderComponent } from '../components/overlay-loader/overlay-loader.component';
import { OverlayContainerLoaderComponent } from '../containers/overlay-container-loader.component';



import { APP_ID, BRANCH_ID, FILE_ID } from '../../core/lib/workflow-tokens';
import { OvelayModules, DesktopPopups } from '../models/enums';
import { CONFIRM_PROMISE, MODULE_PATH } from '../models/tokens';
import { ScreenViewBoostrapComponent } from '../../core/lib/screen-view';

@Injectable()
export class OverlayModuleLoaderService {

  constructor(private loader: SystemJsNgModuleLoader, private injector: Injector,
    private componentResolver: ComponentFactoryResolver, private overlay: Overlay, private appRef: ApplicationRef) { }
  private visibleModules = new Map<string, { overlayRef: OverlayRef, subs: any }>();

  public loadModule(modulePath: string): Promise<NgModuleFactory<any>> {
    return this.loader.load(modulePath)
      .then((moduleFactory: NgModuleFactory<any>) => {
        return moduleFactory;
      });
  }

  createOvelayComponent(modulePath, config: OverlayConfig) {

    const closeOverlay = () => {
      const { overlayRef, subs } = this.visibleModules.get(modulePath);
      overlayRef.detach();
      overlayRef.dispose();
      subs.unsubscribe();
      this.visibleModules.delete(modulePath);
    };

    if (this.visibleModules.has(modulePath)) {
      closeOverlay();
      return false;
    }

    const inputProviders = [
      { provide: MODULE_PATH, useValue: modulePath },
      { provide: CONFIRM_PROMISE, useValue: modulePath },
    ];

    const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.injector);
    const ref = this.overlay.create(config);
    const compRef = ref.attach(new ComponentPortal(OverlayLoaderComponent, null, injector));

    const subscription = compRef.instance.close.subscribe((data) => {
      closeOverlay();
    });
    this.visibleModules.set(modulePath, { overlayRef: ref, subs: subscription });
    return compRef.instance.close;
  }

  // loadAppAppSettingsOverlay() {
  //   const config = new OverlayConfig();
  //   config.positionStrategy = this.overlay.position()
  //     .global()
  //     .height('calc(100% - 50px)')
  //     .right('0px')
  //     .top('50px');
  //   return this.createOvelayComponent(OvelayModules.AppSettings, config);
  // }

  private initMainComponent(moduleFactory: NgModuleFactory<any>, containerRef: ViewContainerRef) {
    const moduleRef = moduleFactory.create(this.injector);
    const entryComponent = moduleRef.instance.mainComponent;
    const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(entryComponent);
    const compRef = containerRef.createComponent(compFactory, null, moduleRef.injector, null, moduleRef);
    this.appRef.tick();
    return compRef;
  }

  public loadNotificationModule(notificationModule: ViewContainerRef) {
    return this.loadModule(OvelayModules.Notifications)
      .then((moduleFactory: NgModuleFactory<any>) => {
        return this.initMainComponent(moduleFactory, notificationModule);
      });
  }
  public loadAzureStorageModule(azureStorageModule: ViewContainerRef) {
    return this.loadModule(OvelayModules.AzureStorage)
      .then((moduleFactory: NgModuleFactory<any>) => {
        return this.initMainComponent(moduleFactory, azureStorageModule);
      });
  }

  public preloadWorkflowCore() {
    return this.getWorkflowModule();
  }

  public getWorkflowModule() {
    return this.loadModule(OvelayModules.Workflow);
  }

  public createWorkflowSessionInstance(inputProviders = [], injector: Injector = this.injector) {
    const config = new OverlayConfig({ hasBackdrop: false, panelClass: 'dps-hidden-container' });
    config.positionStrategy = this.overlay.position()
      .global()
      .left('0px')
      .top('0px');
    return this.createOvelayContainer(OvelayModules.Workflow, config, inputProviders, injector);
  }

  public loadScreenViewModule(screenViewModule: ViewContainerRef, token, data) {

    return this.loadModule(DesktopPopups.ScreenView)
      .then((moduleFactory: NgModuleFactory<any>) => {
        const moduleRef = moduleFactory.create(this.injector);
        const entryComponent = moduleRef.instance.boostrapComponent;
        const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory<ScreenViewBoostrapComponent>(entryComponent);
        const component = screenViewModule.createComponent(compFactory, null, moduleRef.injector, null, moduleRef);
        component.instance.token = token;
        component.instance.inputData = data;
        this.appRef.tick();
        setTimeout(() => {
        }, 100);

      });
  }

  createOvelayContainer(modulePath, config: OverlayConfig, inputProviders = [], injector: Injector = this.injector) {
    return new Promise<{ overlayRef: OverlayRef, compRef: any }>((resolve, reject) => {
      inputProviders = inputProviders.concat([
        { provide: MODULE_PATH, useValue: modulePath },
      ]);
      const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
      const _injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, injector);
      const ref = this.overlay.create(config);
      const compRef = ref.attach(new ComponentPortal(OverlayContainerLoaderComponent, null, _injector));
      compRef.instance.loaded.pipe(take(1)).subscribe(() => {
        resolve({ overlayRef: ref, compRef });
      });
      compRef.instance.error.pipe(take(1)).subscribe((error) => {
        reject(error);
      });
    });


  }
}
