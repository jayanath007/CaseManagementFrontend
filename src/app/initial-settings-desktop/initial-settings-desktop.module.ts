import { FormsModule } from '@angular/forms';

import { NgModule, AfterViewInit } from '@angular/core';
import {
    MatTabsModule, MatSelectModule, MatIconModule
    , MatListModule
    , MatButtonModule,
    MatChipsModule, MatToolbarModule, MatProgressBarModule, MatSnackBarModule
} from '@angular/material';
import { CommonModule } from '@angular/common';


import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InitialSettingsLayoutComponent } from './components/initial-settings-layout/initial-settings-layout.component';
import { InitialSettingsRouterHostComponent } from './containers/initial-settings-router-host.component';
import { InitialSettingsManagerComponent } from './containers/initial-settings-manager.component';


import { AuthInterceptorService } from '../auth';

import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
// import { AppSettingsOverlayComponent } from './containers/app-settings-overlay.component';
import { SharedModule } from '../shared/shared.module';
import { CkEditorModule } from '../ck-editor/ck-editor.module';
import { InitialSettingsPopupComponent } from './containers/initial-settings-popup.component';
import { InitialSettingsService } from '../initial-settings-core/services/initial-settings.service';
import { InitialSettingsCoreModule } from '../initial-settings-core/initial-settings-core.module';

@NgModule({
    imports: [FormsModule,
        MatIconModule,
        CommonModule,
        InitialSettingsCoreModule,
        MatProgressBarModule,
        HttpClientModule,
        MatChipsModule,
        SharedModule,
        MatSelectModule,
        MatListModule,
        MatButtonModule,
        MatToolbarModule,
        MatSnackBarModule],

    exports: [InitialSettingsManagerComponent,
        InitialSettingsLayoutComponent,
        InitialSettingsPopupComponent,
        InitialSettingsRouterHostComponent],
    declarations: [
        InitialSettingsManagerComponent,
        InitialSettingsLayoutComponent,
        InitialSettingsPopupComponent,
        InitialSettingsRouterHostComponent

    ],
    providers: [
        InitialSettingsService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ExceptionInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        }],
    entryComponents: [InitialSettingsPopupComponent]
})

export class InitialSettingsDesktopModule {
    popupComponent = InitialSettingsPopupComponent;
}
