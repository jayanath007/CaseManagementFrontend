import {
  MatIconModule, MatButtonModule, MatInputModule, MatProgressBarModule,
  MatTabsModule, MAT_DATE_LOCALE, MatListModule, MatPaginatorModule, MatCheckboxModule
} from '@angular/material';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptorService } from '../auth';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { BankSearchCoreModule } from '../bank-search-core/bank-search-core.module';
import { BankSearchEffects } from '../bank-search-core/effects/bank-search-effects';
import { BankSearchManagerComponent } from './containers/bank-search-manager.component';
import { BankSearchPopupHostComponent } from './containers/bank-search-popup-host.component';
import { BankSearchGridComponent } from './components/bank-search-grid/bank-search-grid.component';
import { BankSearchGridRowComponent } from './components/bank-search-grid-row/bank-search-grid-row.component';
import { BankSearchLayoutComponent } from './components/bank-search-layout/bank-search-layout.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BankSearchCoreModule,
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
    EffectsModule.forFeature([BankSearchEffects]),
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
    BankSearchManagerComponent,
    BankSearchPopupHostComponent,
    BankSearchGridComponent,
    BankSearchGridRowComponent,
    BankSearchLayoutComponent,
  ],
  entryComponents: [
    BankSearchPopupHostComponent,
  ]
})
export class BankSearchDesktopModule {
  popupComponent = BankSearchPopupHostComponent;
}
