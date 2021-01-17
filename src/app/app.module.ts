
import { ErrorDataUploadService } from './shared/services/error-data-upload.service';
import { ErrorLoggerService } from './shared/services/error-logger.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, SystemJsNgModuleLoader, ErrorHandler } from '@angular/core';
import { ShellDesktopModule } from './shell-desktop/shell-desktop.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer, } from '@ngrx/router-store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { CoreModule } from './core/core.module';
import { AuthModule, AuthConfigs } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { DpsRouterStateSerializer } from './shared/utills/routing';
import 'hammerjs';
import { RouterModule } from '@angular/router';
import { ContactsAndPeopleCoreModule } from './contacts-and-people-core/contacts-and-people-core.module';
import { ServiceEndpointConfig } from './core/configs/service-configs';
import { LayoutDesktopModule } from './layout-desktop/layout-desktop.module';
import { WorkflowDesktopModule } from './workflow-desktop/workflow-desktop.module';

import { AppComponent } from './app.component';
import { AppInsightsModule } from 'ng2-appinsights';
import { MAT_DATE_LOCALE } from '@angular/material';
import { ScreenEditCoreModule } from './screen-edit-core/screen-edit-core.module';
import { LoginComponent } from './auth/components/login/login.component';
// import { CivilTimeRecordingDesktopComponent } from './civil-time-recording-desktop/civil-time-recording-desktop.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // CivilTimeRecordingDesktopComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ShellDesktopModule,
    CoreModule.forRoot(),
    AuthModule.forRoot(),
    WorkflowDesktopModule.forRoot(),
    LayoutDesktopModule.forRoot(),
    ContactsAndPeopleCoreModule.forRoot(),
    ScreenEditCoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot(),
    AppInsightsModule,
    // InitialSettingsDesktopModule,
  ],
  providers: [
    SystemJsNgModuleLoader,
    { provide: RouterStateSerializer, useClass: DpsRouterStateSerializer },
    { provide: ErrorHandler, useClass: ErrorLoggerService },
    ServiceEndpointConfig,
    ErrorDataUploadService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  exports: [RouterModule, HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
