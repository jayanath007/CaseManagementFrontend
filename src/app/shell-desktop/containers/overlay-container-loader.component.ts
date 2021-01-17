import {
  Component, OnInit, Output, EventEmitter, Inject, SystemJsNgModuleLoader,
  NgModuleFactory, ViewContainerRef, ChangeDetectorRef, Injector
} from '@angular/core';
import { CONFIRM_PROMISE, MODULE_PATH } from '../models/tokens';

@Component({
  selector: 'dps-overlay-container-loader',
  template: ` `,
  styles: []
})
export class OverlayContainerLoaderComponent implements OnInit {

  @Output() loaded = new EventEmitter();
  @Output() error = new EventEmitter();

  constructor( @Inject(MODULE_PATH) private modulePath, private loader: SystemJsNgModuleLoader,
    private viewContainerRef: ViewContainerRef, private cd: ChangeDetectorRef, private injector: Injector) { }

  ngOnInit() {
    setTimeout(() => this.loadModule());
  }

  loadModule() {
    this.loader.load(this.modulePath).then((moduleFactory: NgModuleFactory<any>) => {
      const moduleRef = moduleFactory.create(this.injector);
      const entryComponent = moduleRef.instance.overlayContainer;
      const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(entryComponent);
      this.viewContainerRef.clear();
      const compRef = this.viewContainerRef.createComponent<any>(compFactory, null, moduleRef.injector, null, moduleRef);
      this.cd.detectChanges();
      this.loaded.emit();
    }, (error) => {
      console.error(error);
      this.error.emit(error);
    });
  }

}
