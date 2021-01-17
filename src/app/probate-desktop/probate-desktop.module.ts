import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { ProbateDesktopComponent } from './probate-desktop.component';
import { EffectsModule } from '@ngrx/effects';
import {
  MatListModule, MatPaginatorModule, MatExpansionModule, MatProgressBarModule, MatToolbarModule,
  MatNativeDateModule, MatTooltipModule, MatRippleModule,
  MatInputModule, MatCheckboxModule, MatDatepickerModule, MatSlideToggleModule, MatSelectModule,
  MatRadioModule, MatIconModule, MAT_DATE_LOCALE, MatTabsModule, MatTableModule, MatSidenavModule
} from '@angular/material';
import { BillingGuideCoreModule } from '../billing-guide-core/billing-guide-core.module';
import { DocumentViewModule } from '../document-view/document-view.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProbateManagerComponent } from './containers/probate-desktop-popup/probate-manager.component';
import { ProbateDesktopPopupComponent } from './containers/probate-desktop-popup/probate-desktop-popup.component';
import { ProbateLayoutComponent } from './components/probate-layout/probate-layout.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { EstateOverviewComponent } from './components/estate-overview/estate-overview.component';
import { TransactionComponent } from './components/transaction/transaction.component';
// import { AddAssetManagerComponent } from './containers/probate-desktop-popup/add-asset-manager.component ';
import { ProbateCoreModule } from '../probate-core/probate-core.module';
import { ProbateRoutingModule } from './probate-routing.module';
import { ProbatePaymentReceiptComponent } from './components/probate-payment-receipt/probate-payment-receipt.component';
import { TransactionGridComponent } from './components/transaction-grid/transaction-grid.component';
import { DistributionGridComponent } from './components/distribution-grid/distribution-grid.component';
import { EditorbleInputsComponent } from './components/editorble-inputs/editorble-inputs.component';
import { DistributionComponent } from './components/distribution/distribution.component';
import { SpouseCivilPartnerComponent } from './components/spouse-civil-partner/spouse-civil-partner.component';
import { ResidenceNilRateBandComponent } from './components/residence-nil-rate-band/residence-nil-rate-band.component';
import { IhtFormGridComponent } from './components/iht-form-grid/iht-form-grid.component';
import { EditorbaleCheckcoxComponent } from './components/editorbale-checkcox/editorbale-checkcox.component';
import { EditorbaleRadioBtnComponent } from './components/editorbale-radio-btn/editorbale-radio-btn.component';
import { EditorbaleTextInputComponent } from './components/editorbale-text-input/editorbale-text-input.component';
import { EditorbleDatePickerComponent } from './components/editorble-date-picker/editorble-date-picker.component';
import { EditorbleDropDownComponent } from './components/editorble-drop-down/editorble-drop-down.component';
import { AssetFormsComponent } from './components/asset-forms/asset-forms.component';
import { DistributionPecuniaryResiduaryTabComponent } from './components/distribution-pecuniary-residuary-tab/distribution-pecuniary-residuary-tab.component';
import { ProbetePaymentReceiptManagerComponent } from './containers/probate-desktop-popup/probate-payment-receipt-manager.component';
import { ProbatePaymentReceiptTabComponent } from './components/probate-payment-receipt-tab/probate-payment-receipt-tab.component';
import { ProbateAccountDesktopModule } from '../probate-account-desktop/probate-account-desktop.module';
@NgModule({
  imports: [FormsModule,
    ReactiveFormsModule,
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
    BillingGuideCoreModule,
    DocumentViewModule,
    ProbateCoreModule,
    ProbateAccountDesktopModule,
    MatRippleModule

  ],
  declarations: [ProbateLayoutComponent,
    ProbateManagerComponent,
    ProbateDesktopPopupComponent, EstateOverviewComponent, TransactionComponent
    , ProbatePaymentReceiptComponent, TransactionGridComponent, DistributionGridComponent, EditorbleInputsComponent,
    DistributionComponent, SpouseCivilPartnerComponent, ResidenceNilRateBandComponent, IhtFormGridComponent, EditorbaleCheckcoxComponent,
    EditorbaleRadioBtnComponent, EditorbaleTextInputComponent, EditorbleDatePickerComponent,
    EditorbleDropDownComponent, AssetFormsComponent,
    ProbetePaymentReceiptManagerComponent, ProbatePaymentReceiptTabComponent,
    DistributionPecuniaryResiduaryTabComponent],

  entryComponents: [ProbateDesktopPopupComponent, ProbetePaymentReceiptManagerComponent],

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

export class ProbateDesktopModule {
  popupComponent = ProbateDesktopPopupComponent;
}