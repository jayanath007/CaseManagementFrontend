import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthInterceptorService } from '../auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { TransactionsPopupLayoutComponent } from './components/transactions-popup-layout/transactions-popup-layout.component';
import { PreviousTransactionsManagerComponent } from './containers/previous-transactions-manager.component';
import {
  MatCheckboxModule, MatChipsModule,
  MatPaginatorModule, MatProgressBarModule,
  MatTooltipModule, MatIconModule,
  MatInputModule, MatToolbarModule, MatListModule, MatRadioModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PreviousTransactionsGridComponent } from './components/previous-transactions-grid/previous-transactions-grid.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { TransactionsPopupRouterComponent } from './containers/transactions-popup-router.component';
import { LedgerPreviousTransCoreModule } from '../ledger-previous-trans-core/ledger-previous-trans-core.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    GridFilterDesktopModule,
    LedgerPreviousTransCoreModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatListModule,
    MatRadioModule,
    MatChipsModule
  ],
  declarations: [
    PreviousTransactionsManagerComponent,
    TransactionsPopupRouterComponent,
    TransactionsPopupLayoutComponent,
    PreviousTransactionsGridComponent
  ],
  entryComponents: [TransactionsPopupRouterComponent],
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
export class LedgerPreviousTransDesktopModule {
  popupComponent = TransactionsPopupRouterComponent;
}
