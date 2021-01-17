import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatInputModule, MatIconModule, MatTooltipModule,
  MatTabsModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule,
  MatPaginatorModule, MatToolbarModule, MatExpansionModule, MatListModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LedgerCardRoutingModule } from './ledger-card-routing.module';
import { LedgerCardManagerRouterHostComponent } from './containers/ledger-card-manager-router-host.component';
import { LedgerCardManagerComponent } from './containers/ledger-card-manager.component';
import { LedgerCardLayoutComponent } from './components/ledger-card-layout/ledger-card-layout.component';
import { LedgerCardHeaderComponent } from './components/ledger-card-header/ledger-card-header.component';
import { LedgerCardDataContentComponent } from './components/ledger-card-data-content/ledger-card-data-content.component';
import { LedgerCardGridComponent } from './components/ledger-card-grid/ledger-card-grid.component';
import { LedgerCardMatterDetailsComponent } from './components/ledger-card-matter-details/ledger-card-matter-details.component';
import { LedgerCardMatterBalanceComponent } from './components/ledger-card-matter-balance/ledger-card-matter-balance.component';
import { LedgerCardCoreModule } from '../ledger-card-core/ledger-card-core.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { LedgerCardOptionComponent } from './components/ledger-card-option/ledger-card-option.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { AllGridComponent } from './components/all-grid/all-grid.component';
import {
  LedgerCardMatterBalanceItemComponent
} from './components/ledger-card-matter-balance-item/ledger-card-matter-balance-item.component';
import { BillGridComponent } from './components/bill-grid/bill-grid.component';
import { DisbsGridComponent } from './components/disbs-grid/disbs-grid.component';
import { GbpGridComponent } from './components/gbp-grid/gbp-grid.component';
import { DdaGridComponent } from './components/dda-grid/dda-grid.component';
import { ClientGrdsComponent } from './components/client-grds/client-grds.component';
import { LedgerCardPopupManagerComponent } from './containers/ledger-card-popup-manager.component';
import { LedgerCardPopupLayoutComponent } from './components/ledger-card-popup-layout/ledger-card-popup-layout.component';
import { BalancesColorPipe } from './pipe/balances-color.pipe';
import { SharedModule } from '../shared/shared.module';
import { EchitGridComponent } from './components/echit-grid/echit-grid.component';

@NgModule({
  imports: [LedgerCardRoutingModule,
    CommonModule,
    LedgerCardCoreModule,
    MatCardModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSelectModule,
    MatCheckboxModule,
    GridFilterDesktopModule,
    MatPaginatorModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LedgerCardManagerRouterHostComponent,
    LedgerCardManagerComponent,
    LedgerCardLayoutComponent,
    LedgerCardHeaderComponent,
    LedgerCardDataContentComponent,
    LedgerCardGridComponent,
    LedgerCardMatterBalanceComponent,
    LedgerCardMatterDetailsComponent,
    LedgerCardOptionComponent,
    AllGridComponent,
    BillGridComponent,
    DisbsGridComponent,
    GbpGridComponent,
    DdaGridComponent,
    ClientGrdsComponent,
    EchitGridComponent,
    LedgerCardMatterBalanceItemComponent,
    LedgerCardPopupManagerComponent,
    LedgerCardPopupLayoutComponent,
    EchitGridComponent,

    // Pipe
    BalancesColorPipe
  ],
  entryComponents: [LedgerCardPopupManagerComponent],
  exports: [
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
  ]

})
export class LedgerCardDesktopPopup {
  popupComponent = LedgerCardPopupManagerComponent; // use in popup service as entry component
}
@NgModule({
  imports: [
    LedgerCardRoutingModule,
    LedgerCardDesktopPopup
  ],
  declarations: [
  ],

})

export class LedgerCardDesktopModule { }
