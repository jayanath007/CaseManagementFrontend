import {
  Component, OnInit, Output, EventEmitter, Inject, SystemJsNgModuleLoader,
  NgModuleFactory, ViewContainerRef, ChangeDetectorRef, Injector
} from '@angular/core';
import { CONFIRM_PROMISE, MODULE_PATH } from '../../models/tokens';

@Component({
  selector: 'dps-overlay-loader',
  templateUrl: './overlay-loader.component.html',
  styleUrls: ['./overlay-loader.component.scss'],
})
export class OverlayLoaderComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Output() loaded = new EventEmitter();
  @Output() error = new EventEmitter();

  constructor( @Inject(MODULE_PATH) private modulePath, private loader: SystemJsNgModuleLoader,
    private viewContainerRef: ViewContainerRef, private cd: ChangeDetectorRef, private injector: Injector) { }

  ngOnInit() {
    setTimeout(() => this.loadModule());
  }

  loadModule() {
    this.loader.load(this.modulePath).then((moduleFactory: NgModuleFactory<any>) => {
      this.loaded.emit();
      const moduleRef = moduleFactory.create(this.injector);
      const entryComponent = moduleRef.instance.overlayComponent;
      const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(entryComponent);
      this.viewContainerRef.clear();
      const compRef = this.viewContainerRef.createComponent<any>(compFactory, null, moduleRef.injector, null, moduleRef);
      if (!!compRef.instance.close) {
        const subscription = compRef.instance.close.subscribe((result) => {
          this.close.emit(result);
          subscription.unsubscribe();
        });
      }
      this.cd.detectChanges();
    }, (error) => {
      console.error(error);
      this.error.emit(error);
    });
  }

  onClose(event) {
    this.close.emit(this.modulePath);
  }

}
