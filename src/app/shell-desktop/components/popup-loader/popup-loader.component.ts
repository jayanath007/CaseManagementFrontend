import { Component, OnInit, Inject, ViewContainerRef, ChangeDetectorRef, Injector } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SystemJsPopupLoaderService } from '../../services/system-js-popup-loader.service';
import { LoaderConfig } from '../../services/loader-config';

@Component({
  selector: 'dps-popup-loader',
  templateUrl: './popup-loader.component.html',
  styleUrls: ['./popup-loader.component.scss'],
})
export class PopupLoaderComponent implements OnInit {

  loaded = false;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private viewContainerRef: ViewContainerRef,
    private dialogRef: MatDialogRef<PopupLoaderComponent>, private cd: ChangeDetectorRef, private injector: Injector) { }

  ngOnInit() {
    this.loadModule();
  }

  private loadModule() {
    setTimeout(() =>
      this.config.load().then(moduleFactory => {
        const moduleRef = moduleFactory.create(this.injector);
        const entryComponent = moduleRef.instance.popupComponent;
        const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(entryComponent);
        this.viewContainerRef.clear();
        this.viewContainerRef.createComponent(compFactory, null, moduleRef.injector, null, moduleRef);
        this.loaded = true;
        this.cd.detectChanges();
      })
    );
  }

  private get config(): LoaderConfig {
    return this.data.config;
  }

}
