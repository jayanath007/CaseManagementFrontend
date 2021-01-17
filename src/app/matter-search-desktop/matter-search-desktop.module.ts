import { LayoutModule } from '@angular/cdk/layout';
import { MatterSearchHeaderComponent } from './components/matter-search-header/matter-search-header.component';
import { MatterSearchViewsComponent } from './components/matter-search-views/matter-search-views.component';
import { MatterSearchPopupManagerComponent } from './containers/matter-search-popup-manager.component';
import { MatterSearchManagerRouterHostComponent } from './containers/matter-search-manager-router-host.component';
import { MatterSearchPopupComponent } from './components/matter-search-popup/matter-search-popup.component';
import { MatterSearchOutstandingComponent } from './components/matter-search-outstanding/matter-search-outstanding.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedDataModule } from './../shared-data/shared-data.module';

import {
  MatSelectModule,
  MatCheckboxModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatPaginatorModule,
  MatTableModule,
  MatExpansionModule,
  MatListModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule,
  MatRadioModule,
  MatChipsModule,
  MatTooltipModule,
  MatDatepickerModule
} from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { MatterSearchRoutingModule } from './matter-search-routing.module';
import { MatterSearchCoreModule } from '../matter-search-core/matter-search-core.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { MatterSearchBoxComponent } from './components/matter-search-box/matter-search-box.component';
import { MatterSearchDapartmentsComponent } from './components/matter-search-dapartments/matter-search-dapartments.component';
import { MatterSearchGridComponent } from './components/matter-search-grid/matter-search-grid.component';
import { GridButtonDetailsComponent } from './components/grid-button-details/grid-button-details.component';
import { MatterGridFixRowComponent } from './components/matter-grid-fix-row/matter-grid-fix-row.component';
import { MatterSearchManagerComponent } from './containers/matter-search-manager.component';

// FOR testing
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptorService } from '../auth';
import { MatterSearchLayoutComponent } from './components/matter-search-layout/matter-search-layout.component';
import { MatterSearchSidenavComponent } from './components/matter-search-sidenav/matter-search-sidenav.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { ReferralNoteAndDatePopupComponent } from './components/referral-note-and-date-popup/referral-note-and-date-popup.component';
import { ReferralNotePopupManagerComponent } from './containers/referral-note-popup-manager.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SharedDataModule,
    MatterSearchCoreModule,
    MatTooltipModule,
    MatSelectModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatListModule,
    MatDatepickerModule,
    MatSidenavModule,
    GridFilterDesktopModule,
    MatProgressBarModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatRadioModule,
    MatChipsModule,
    LayoutModule,
  ],
  declarations: [
    MatterSearchGridComponent,
    MatterSearchSidenavComponent,
    MatterSearchDapartmentsComponent,
    MatterSearchBoxComponent,
    MatterGridFixRowComponent,
    GridButtonDetailsComponent,
    MatterSearchManagerComponent,
    MatterSearchLayoutComponent,
    MatterSearchOutstandingComponent,
    MatterSearchPopupComponent,
    MatterSearchManagerRouterHostComponent,
    MatterSearchPopupManagerComponent,
    MatterSearchViewsComponent,
    MatterSearchHeaderComponent,
    ReferralNoteAndDatePopupComponent,
    ReferralNotePopupManagerComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    }
  ],
  entryComponents: [MatterSearchPopupManagerComponent,
    ReferralNotePopupManagerComponent]

})
export class MatterSearchDesktopGeneric {
  popupComponent = MatterSearchPopupManagerComponent; // use in popup service as entry component
}

@NgModule({
  imports: [
    MatterSearchRoutingModule,
    MatterSearchDesktopGeneric
  ],
  declarations: [
  ],

})
export class MatterSearchDesktopModule {
}
