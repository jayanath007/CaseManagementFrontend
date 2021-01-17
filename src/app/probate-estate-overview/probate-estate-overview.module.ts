import { reducers } from './reducers';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { AuthInterceptorService } from '../auth';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProbateEstateOverviewEffects } from './effects/estate-overview.effects';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { ProbateEstateOverviewService } from './services/probate-estate-overview.service';
import { EstateOverviewManagerComponent } from './containers/estate-overview-manager.component';
import { AddEditEstateLayoutComponent } from './components/add-edit-estate-layout/add-edit-estate-layout.component';
import { EstateOverviewRouterHostComponent } from './containers/estate-overview-router-host.component';
import {
  DateAdapter,
  MatCheckboxModule, MatDatepickerModule, MatExpansionModule, MatFormFieldModule, MatGridListModule,
  MatIconModule, MatInputModule, MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatTableModule,
  MatTabsModule, MatToolbarModule, MatTooltipModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material';
import { AllInputTypesComponent } from './components/all-input-types/all-input-types.component';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatListModule,
    MatTabsModule,
    MatTableModule,
    MatSidenavModule,
    MatGridListModule,
    MatProgressBarModule,
    MatFormFieldModule,
    StoreModule.forFeature('dpsProbateEstateOverview', reducers),
    EffectsModule.forFeature([ProbateEstateOverviewEffects]),
  ],
  declarations: [
    EstateOverviewManagerComponent,
    EstateOverviewRouterHostComponent,
    AddEditEstateLayoutComponent,
    AllInputTypesComponent,
  ],
  providers: [
    ProbateEstateOverviewService,
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
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
  entryComponents: [EstateOverviewRouterHostComponent]
})
export class ProbateEstateOverviewModule {
  popupComponent = EstateOverviewRouterHostComponent;
}
