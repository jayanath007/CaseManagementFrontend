import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatIconModule, MatTabsModule, MatExpansionModule, MatInputModule,
  MatButtonModule, MatSelectModule, MatListModule, MatCheckboxModule, MatToolbarModule,
  MatProgressBarModule, MatDatepickerModule, MatPaginatorModule, MatStepperModule, MatRadioModule, MatChipsModule, MatBottomSheetModule, MatProgressSpinnerModule
} from '@angular/material';
import { OpportunityRouting } from './opportunity-routing.routing';
import { OpportunityManagerRouterHostComponent } from './containers/opportunity-manager-router-host.component';
import { OpportunityLayoutComponent } from './components/opportunity-layout/opportunity-layout.component';
import { OppertunityViewerComponent } from './components/oppertunity-viewer/oppertunity-viewer.component';
import { SavedOpportunitiesComponent } from './components/saved-opportunities/saved-opportunities.component';
import { ViewOpportunityManagerComponent } from './containers/view-opportunity-manager.component';
import { ViewOpportunityPopupLayoutComponent } from './components/view-opportunity-popup-layout/view-opportunity-popup-layout.component';
import { OpportunityHistoryComponent } from './components/opportunity-history/opportunity-history.component';
import { SaveOpportunityRecordRowComponent } from './components/save-opportunity-record-row/save-opportunity-record-row.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { OpportunityCoreModule } from '../opportunity-core/opportunity-core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { OpportunityEffects } from './effects/opportunity.effects';
import { CloseOpportunityPopupManagerComponent } from './containers/close-opportunity-popup-manager.component';
import { CloseOpportunityPopupComponent } from './components/close-opportunity/close-opportunity-popup.component';
import { OpportunityQuoteRunPopupComponent } from './components/opportunity-quote-run-popup/opportunity-quote-run-popup.component';
import { OpportunityQuoteRunPopupManagerComponent } from './containers/opportunity-quote-run-popup-manager.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { OpportunityManagerComponent } from './containers/opportunity-manager.component';
import { ProfertyQuotePopupManagerComponent } from './containers/proferty-quote-popup-manager.component';
import { PropertyQuoteLayoutComponent } from './components/property-quote-layout/property-quote-layout.component';
import { PropertyQuoteMenuTileComponent } from './components/property-quote-menu-tile/property-quote-menu-tile.component';
import { PropertyQuoteDetailsComponent } from './components/property-quote-details/property-quote-details.component';
import { OpportunitiesStatsComponent } from './components/opportunities-stats/opportunities-stats.component';
import { PropertyQuoteReportItemsComponent } from './components/property-quote-report-items/property-quote-report-items.component';
import { PropertyQuoteReportComponent } from './components/property-quote-report/property-quote-report.component';
import { OpportunitiesSettingsComponent } from './components/opportunities-settings/opportunities-settings.component';
import { EditableControlBaseModule } from '../editable-control-base/editable-control-base.module';
import { SectionForBuyingInformationComponent } from './components/property-quote-details/section-for-buying-information/section-for-buying-information.component';
import { OppertunitySettingScreenItemComponent } from './components/oppertunity-setting-screen-item/oppertunity-setting-screen-item.component';
import { OpportunitySettingPopupManagerComponent } from './containers/opportunitySettingPopupManager.component';
import { SectionForPriceComponent } from './components/property-quote-details/section-for-price/section-for-price.component';
import { SectionForPropertyComponent } from './components/property-quote-details/section-for-property/section-for-property.component';
import { OppertunitySettingsComponent } from './components/oppertunity-settings/oppertunity-settings.component';
import { EnquiryInfoItemComponent } from './components/enquiry-Info-item/enquiry-Info-item.component';
import { SharedDataModule } from '../shared-data/shared-data.module';
import { PropertyReportItemEditComponent } from './components/property-report-item-edit/property-report-item-edit.component';
import { SectionForSellingInformationComponent } from './components/property-quote-details/section-for-selling-information/section-for-selling-information.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedDataModule,
    OpportunityRouting,
    FlexLayoutModule,
    OpportunityCoreModule,
    GridFilterDesktopModule,
    FormsModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatStepperModule,
    MatRadioModule,
    MatChipsModule,
    MatBottomSheetModule,
    EditableControlBaseModule,
    MatProgressSpinnerModule,
    EffectsModule.forFeature([OpportunityEffects])
  ],
  declarations: [
    OpportunityManagerRouterHostComponent,
    OpportunityManagerComponent,
    OpportunityLayoutComponent,
    OppertunityViewerComponent,
    SavedOpportunitiesComponent,
    ViewOpportunityManagerComponent,
    ViewOpportunityPopupLayoutComponent,
    OpportunityHistoryComponent,
    SaveOpportunityRecordRowComponent,
    OpportunityQuoteRunPopupComponent,
    OpportunityQuoteRunPopupManagerComponent,
    CloseOpportunityPopupComponent,
    CloseOpportunityPopupManagerComponent,
    ProfertyQuotePopupManagerComponent,
    PropertyQuoteLayoutComponent,
    PropertyQuoteMenuTileComponent,
    PropertyQuoteDetailsComponent,
    PropertyQuoteReportComponent,
    PropertyQuoteReportItemsComponent,
    OpportunitiesStatsComponent,
    OpportunitySettingPopupManagerComponent,
    OpportunitiesSettingsComponent,
    OppertunitySettingScreenItemComponent,
    SectionForBuyingInformationComponent,
    SectionForPriceComponent,
    SectionForPropertyComponent,
    SectionForSellingInformationComponent,
    OppertunitySettingsComponent,
    EnquiryInfoItemComponent,
    PropertyReportItemEditComponent
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
    }
  ],
  entryComponents: [ViewOpportunityManagerComponent, OpportunityQuoteRunPopupManagerComponent,
    CloseOpportunityPopupManagerComponent, ProfertyQuotePopupManagerComponent, OpportunitySettingPopupManagerComponent,
    OppertunitySettingsComponent, PropertyReportItemEditComponent]
})

export class ViewOpportunityModule {
  popupComponent = ViewOpportunityManagerComponent;
}
@NgModule({
  imports: [
    OpportunityRouting,
    ViewOpportunityModule
  ],
  declarations: [
  ],
})
export class ProfertyQuoteModule {
  popupComponent = ProfertyQuotePopupManagerComponent;
}

@NgModule({
  imports: [
    OpportunityRouting,
    ProfertyQuoteModule
  ],
  declarations: [

  ],

})
export class QuoteRunModule {
  popupComponent = OpportunityQuoteRunPopupManagerComponent;
}
@NgModule({
  imports: [
    OpportunityRouting,
    QuoteRunModule
  ],
  declarations: [
  ],
})
export class CloseOpportunityModule {
  popupComponent = CloseOpportunityPopupManagerComponent;
}
@NgModule({
  imports: [
    OpportunityRouting,
    CloseOpportunityModule
  ],
  declarations: [
  ],
})
export class OppertunitySettingsModule {
  popupComponent = OpportunitySettingPopupManagerComponent;
}
@NgModule({
  imports: [
    OpportunityRouting,
    OppertunitySettingsModule
  ],
  declarations: [
  ],
})
export class OpportunityDesktopModule { }


