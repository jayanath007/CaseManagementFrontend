import {
  MatIconModule, MatButtonModule, MatInputModule, MatProgressBarModule,
  MatTabsModule, MAT_DATE_LOCALE, MatListModule, MatPaginatorModule, MatCheckboxModule
} from '@angular/material';
import { EChitAuthorisationsLayoutComponent } from './components/e-chit-authorisations-layout/e-chit-authorisations-layout.component';
import { AuthorisationsGridRowComponent } from './components/authorisations-grid-row/authorisations-grid-row.component';
import { EChitAuthorisationsEffects } from '../e-chit-authorisations-core/effects/e-chit-authorisations-effects';
import { EChitAuthorisationsCoreModule } from '../e-chit-authorisations-core/e-chit-authorisations-core.module';
import { AuthorisationsGridComponent } from './components/authorisations-grid/authorisations-grid.component';
import { AuthorisationsRouterHostComponent } from './containers/authorisations-router-host.component';
import { AuthorisationsManagerComponent } from './containers/authorisations-manager.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptorService } from '../auth';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EChitAuthorisationsCoreModule,
    GridFilterDesktopModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatInputModule,
    MatProgressBarModule,
    MatListModule,
    MatPaginatorModule,
    MatCheckboxModule,
    EffectsModule.forFeature([EChitAuthorisationsEffects]),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
  ],
  declarations: [
    AuthorisationsManagerComponent,
    AuthorisationsRouterHostComponent,
    EChitAuthorisationsLayoutComponent,
    AuthorisationsGridComponent,
    AuthorisationsGridRowComponent,
  ],
  entryComponents: [
    AuthorisationsRouterHostComponent,
  ]
})
export class EChitAuthorisationsDesktopModule {
  popupComponent = AuthorisationsRouterHostComponent;
}
