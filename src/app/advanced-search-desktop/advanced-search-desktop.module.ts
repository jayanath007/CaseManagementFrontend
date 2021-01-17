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
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { AdvancedSearchLayoutComponent } from './components/advanced-search-layout/advanced-search-layout.component';
import { AdvancedSearchCoreModule } from '../advanced-search-core/advanced-search-core.module';
import { AdvancedSearchManagerComponent } from './containers/advanced-search-manager.component';
import { AdvancedSearchDesktopPopupComponent } from './containers/advanced-search-desktop-popup.component';
import { AdvancedSearchHeaderComponent } from './components/advanced-search-header/advanced-search-header.component';
import { EditableControlBaseModule } from '../editable-control-base/editable-control-base.module';
import { AdvancedSearchGridComponent } from './components/advanced-search-grid/advanced-search-grid.component';
import { AdvancedSearchGridFixRowComponent } from './components/advanced-search-grid-fix-row/advanced-search-grid-fix-row.component';

@NgModule({
  imports: [CommonModule,
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
    AdvancedSearchCoreModule,
    EditableControlBaseModule,
  ],
  declarations: [AdvancedSearchLayoutComponent,
    AdvancedSearchManagerComponent, AdvancedSearchDesktopPopupComponent,
    AdvancedSearchHeaderComponent, AdvancedSearchGridComponent, AdvancedSearchGridFixRowComponent,

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
  ], entryComponents: [AdvancedSearchDesktopPopupComponent]
})
export class AdvancedSearchDesktopModule {
  popupComponent = AdvancedSearchDesktopPopupComponent;
}
