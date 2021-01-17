import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrimeClassInfoProceedingPopupComponent } from './containers/crime-class-info-proceeding-popup.component';
import { CrimeClassProceedingManagerComponent } from './containers/crime-class-proceeding-manager.component';
import { CrimeClassInfoPopupLayoutComponent } from './components/crime-class-info-popup-layout/crime-class-info-popup-layout.component';
import { CrimeClassInformationProceedingsCoreModule }
  from '../crime-class-information-proceedings-core/crime-class-information-proceedings-core.module';
import { SharedModule } from '../shared/shared.module';
import { ClassInformationComponent } from './components/class-information/class-information.component';
import {
  MatTooltipModule, MatSelectModule, MatButtonModule, MatInputModule, MatCheckboxModule,
  MatIconModule, MatDatepickerModule, MAT_DATE_LOCALE, MatNativeDateModule, MatRadioModule, MatExpansionModule
} from '@angular/material';
import { AdditionalClassInformationComponent } from './components/additional-class-information/additional-class-information.component';
import { RepresentationOrderDetailsComponent } from './components/representation-order-details/representation-order-details.component';
import { LocationComponent } from './components/location/location.component';
import { ClassStatuesInformationComponent } from './components/class-statues-information/class-statues-information.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { EffectsModule } from '@ngrx/effects';
import { ProceedingClassInfoEffect } from './effects/proceedings-class-info-effects';
import { CurrentTotalComponent } from './components/current-total/current-total.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CrimeClassInformationProceedingsCoreModule,
    MatTooltipModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    // MatExpansionModule,
    EffectsModule.forFeature([ProceedingClassInfoEffect])
  ],

  declarations: [CrimeClassInfoProceedingPopupComponent, CrimeClassProceedingManagerComponent,
    CrimeClassInfoPopupLayoutComponent, ClassInformationComponent, AdditionalClassInformationComponent,
    RepresentationOrderDetailsComponent, LocationComponent, ClassStatuesInformationComponent,
    CurrentTotalComponent],
  entryComponents: [CrimeClassInfoProceedingPopupComponent],
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
})
export class CrimeClassInformationProceedingsDesktopModule {
  popupComponent = CrimeClassInfoProceedingPopupComponent;
}
