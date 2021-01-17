import { NgModule, ModuleWithProviders, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule, ActionReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule,
  MatToolbarModule,
  MatListModule,
  MatOptionModule,
  MatRadioModule,
  MatDialog
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { AzureAuthService } from './services/azure-auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthValidationComponent } from './containers/auth-validation/auth-validation.component';
import { AuthRoutingModule } from './auth-routing.module';
import { reducers } from './reducers';
import { AuthEffects } from './effects/auth.effects';
import * as configTokens from './services/config.token';
import { AuthInfoStateService } from './services/auth-info-state.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthUserService } from './services/auth-user-service';
import { TokenExpireMessageComponent } from './components/token-expire-message/token-expire-message.component';
import { ExceptionInterceptor } from './../shared/services/exception-interceptor.service';
import { environment } from '../../environments/environment';
import { storeLogger } from 'ngrx-store-logger';
import { DEFAULT_HOME_URL } from '../layout-desktop/models/tokens';
import { IS_GOOGLE } from '../shared';
import { AzureTokenFlowV2Service } from './services/azure-token-flow-v2.service';
import { AuthTokenFlowService } from './services/auth-token-flow.service';
import { GoogleTokenFlowService } from './services/google-token-flow.service';
import { AppConfig } from '../core/configs/app-config';

export const AuthConfigs = configTokens;
export function logger(reducer: ActionReducer<any>): any {
  // default, no options
  return storeLogger()(reducer);
}
export const metaReducers = environment.production ? [] : [logger];

export function apiFactoryIS_GOOGLE(_ngZone: NgZone, appConfig: AppConfig, dialog: MatDialog,
  azureTokenFlowV2Service: AzureTokenFlowV2Service,
  authTokenFlowService: AuthTokenFlowService,
  googleTokenFlowService: GoogleTokenFlowService, httpClient: HttpClient) {

  return new AzureAuthService(_ngZone, appConfig, dialog,
    azureTokenFlowV2Service,
    authTokenFlowService, googleTokenFlowService, httpClient).isGoogle();

}

export function apiFactoryDEFAULT_HOME_URL(_ngZone: NgZone, appConfig: AppConfig, dialog: MatDialog,
  azureTokenFlowV2Service: AzureTokenFlowV2Service,
  authTokenFlowService: AuthTokenFlowService,
  googleTokenFlowService: GoogleTokenFlowService, httpClient: HttpClient) {

  return new AzureAuthService(_ngZone, appConfig, dialog,
    azureTokenFlowV2Service,
    authTokenFlowService, googleTokenFlowService, httpClient).isDefaultHome();

}

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatOptionModule,
    MatRadioModule
  ],
  declarations: [TokenExpireMessageComponent],
  entryComponents: [TokenExpireMessageComponent]
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: RootAuthModule,
      providers: [AzureAuthService, AuthGuardService, AuthInfoStateService, AuthUserService,
        {
          provide: DEFAULT_HOME_URL,
          // useValue: '/main/(desktop:desktop/(main:matter-search/home/index//mail:mail/home/index/(inbox:inbox)//dashboard:tmp))'
          useFactory: apiFactoryDEFAULT_HOME_URL,
          deps: [NgZone, AppConfig, MatDialog, AzureTokenFlowV2Service,
            AuthTokenFlowService, GoogleTokenFlowService, HttpClient]
        },
        {
          provide: IS_GOOGLE,
          // useValue: true,
          useFactory: apiFactoryIS_GOOGLE,
          deps: [NgZone, AppConfig, MatDialog, AzureTokenFlowV2Service,
            AuthTokenFlowService, GoogleTokenFlowService, HttpClient]
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptorService,
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ExceptionInterceptor,
          multi: true,
        },
      ],
    };
  }
}

@NgModule({
  imports: [
    AuthModule,
    AuthRoutingModule,
    StoreModule.forFeature('auth', reducers), // , { metaReducers }
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: [AuthValidationComponent],
})
export class RootAuthModule { }
