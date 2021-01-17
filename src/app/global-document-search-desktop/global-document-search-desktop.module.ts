import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatInputModule, MatIconModule, MatTooltipModule,
  MatTabsModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule,
  MatPaginatorModule, MatToolbarModule, MatExpansionModule, MatListModule,
  MatSliderModule, MatSidenavModule, MatChipsModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule,
} from '@angular/material';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DocumentViewModule } from '../document-view/document-view.module';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalDocumentSearchLayoutComponent } from './components/global-document-search-layout/global-document-search-layout.component';
import { GlobalDocumentSearchCoreModule } from '../global-document-search-core/global-document-search-core.module';
import { GlobalDocumentSearchRoutingModule } from './global-document-search-routing.module';
import { GlobalDocumentSearchManagerComponent } from './containers/global-document-search-manager.component';
import { GlobalDocumentSearchManagerRouterHostComponent } from './containers/global-document-search-manager-router-host.component';
import { GlobalDocumentDefaultComponent } from './components/global-document-default/global-document-default.component';
import { GlobalDocumentFixRowComponent } from './components/global-document-fix-row/global-document-fix-row.component';

import { GlobalDocumentViewsComponent } from './components/global-document-views/global-document-views.component';
import { GlobalDocumentHeaderComponent } from './components/global-document-header/global-document-header.component';
import { GlobalDocumentSearchFilterComponent } from './components/global-document-search-filter/global-document-search-filter.component';
import { GlobalDocumentFilterComponent } from './components/global-document-filter/global-document-filter.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { GlobalDocumentGridComponent } from './components/global-document/global-document-grid.component';
import { GlobalDocumentViewPageComponent } from './components/global-document-view-page/global-document-view-page.component';
import { GlobalGridButtonDetailsComponent } from './components/global-grid-button-details/global-grid-button-details.component';
@NgModule({
  imports: [CommonModule,
    GlobalDocumentSearchRoutingModule,
    GlobalDocumentSearchCoreModule,
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
    MatSliderModule,
    MatSidenavModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DocumentViewModule,
    MailDesktopSharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,

  ],
  declarations: [GlobalDocumentSearchLayoutComponent,
    GlobalDocumentSearchManagerComponent,
    GlobalDocumentSearchManagerRouterHostComponent,
    GlobalDocumentDefaultComponent,
    GlobalDocumentFixRowComponent,
    GlobalDocumentGridComponent,
    GlobalDocumentViewsComponent,
    GlobalDocumentHeaderComponent,
    GlobalDocumentSearchFilterComponent,
    GlobalDocumentViewPageComponent,
    GlobalGridButtonDetailsComponent,
    GlobalDocumentFilterComponent],

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
export class GlobalDocumentSearchDesktopModule { }
