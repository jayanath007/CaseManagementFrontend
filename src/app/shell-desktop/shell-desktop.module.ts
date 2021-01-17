import { NgModule, SystemJsNgModuleLoader } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { SystemJsPopupLoaderService } from './services/system-js-popup-loader.service';
import { MatDialogModule, MatProgressBarModule } from '@angular/material';
import { PopupLoaderComponent } from './components/popup-loader/popup-loader.component';
import { ModulePreloadStrategy } from './services/module-preload-strategy';
import { OverlayModuleLoaderService } from './services/overlay-module-loader.service';
import { OverlayLoaderComponent } from './components/overlay-loader/overlay-loader.component';
import { ViewStateObserverService } from './services/view-state-observer.service';
import { UrlPopupService } from './services/url-popup.service';
import { ShellTranslationsService } from './services/shell-translations.service';
import { OverlayContainerLoaderComponent } from './containers/overlay-container-loader.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,  // use in the system-js-popup service to laod application wide popups
    MatProgressBarModule, // use in the popup loader
    OverlayModule, // use to laod overlay module such as app settings
    PortalModule // use in overlays
  ],

  declarations: [PopupLoaderComponent, OverlayLoaderComponent, OverlayContainerLoaderComponent],
  providers: [
    SystemJsPopupLoaderService,
    ModulePreloadStrategy,
    OverlayModuleLoaderService,
    ViewStateObserverService,
    UrlPopupService,
    ShellTranslationsService,
  ],
  entryComponents: [PopupLoaderComponent, OverlayLoaderComponent, OverlayContainerLoaderComponent]
})
export class ShellDesktopModule { }
