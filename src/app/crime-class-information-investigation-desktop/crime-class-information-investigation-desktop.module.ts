import { MatIconModule } from '@angular/material/icon';
import { EffectsModule } from '@ngrx/effects';
import {
  MatButtonModule, MatSelectModule,
  MatInputModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE, MatTooltipModule
} from '@angular/material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CrimeClassInvestigationPopupComponent } from './containers/crime-class-investigation-popup.component';
import {
  CcInformationInvestigationLayoutComponent
} from './components/cc-information-investigation-layout/cc-information-investigation-layout.component';
import {
  CrimeClassInformationInvestigationCoreModule
} from './../crime-class-information-investigation-core/crime-class-information-investigation-core.module';
import { CrimeClassInvestigationManagerComponent } from './containers/crime-class-information-investigation-manager-component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { SharedModule } from './../shared/shared.module';
import { AdditionalClassInformationComponent } from './components/additional-class-information/additional-class-information.component';
import { ClassStatuesInformationComponent } from './components/class-statues-information/class-statues-information.component';
import { CurrentTotalComponent } from './components/current-total/current-total.component';
import { PoliceStationInformationComponent } from './components/police-station-information/police-station-information.component';
import { ClassInformationComponent } from './components/class-information/class-information.component';
import { CcInvestigationClassInfoEffect } from './effects/cc-investigation-class-info-effect';


@NgModule({
  imports: [
    CommonModule,
    CrimeClassInformationInvestigationCoreModule,
    MatButtonModule,
    SharedModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    EffectsModule.forFeature([CcInvestigationClassInfoEffect])
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
  declarations: [CrimeClassInvestigationPopupComponent,
    CcInformationInvestigationLayoutComponent,
    CrimeClassInvestigationManagerComponent,
    AdditionalClassInformationComponent,
    ClassStatuesInformationComponent,
    CurrentTotalComponent,
    PoliceStationInformationComponent,
    ClassInformationComponent
  ],
  entryComponents: [CrimeClassInvestigationPopupComponent]
})

export class CrimeClassInformationInvestigationModule {
  popupComponent = CrimeClassInvestigationPopupComponent;

}
