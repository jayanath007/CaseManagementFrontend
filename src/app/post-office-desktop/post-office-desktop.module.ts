
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule, MatInputModule, MatIconModule, MatTooltipModule,
  MatTabsModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule,
  MatPaginatorModule, MatToolbarModule, MatExpansionModule, MatListModule,
  MatSliderModule, MatSidenavModule, MatChipsModule, MatDatepickerModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostOfficeCoreModule } from '../post-office-core/post-office-core.module';
import { PostOfficeRoutingModule } from './post-office-routing.module';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { SharedModule } from '../shared/shared.module';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { PostOfficeManagerRouterHostComponent } from './containers/post-office-manager-router-host.component';
import { PostOfficeManagerComponent } from './containers/post-office-manager.component';
import { PostOfficeLayoutComponent } from './components/post-office-layout/post-office-layout.component';
import { PostOfficeHeaderComponent } from './components/post-office-header/post-office-header.component';
import { PostOfficeViewsComponent } from './components/post-office-views/post-office-views.component';
import { PostOfficeGridComponent } from './components/post-office-grid/post-office-grid.component';
import { DocumentViewModule } from '../document-view/document-view.module';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { PostOfficeGridRowComponent } from './components/post-office-grid-row/post-office-grid-row.component';
import { PostofficeTwoGroupComponent } from './components/postoffice-two-group/postoffice-two-group.component';
import { PostofficeGroupComponent } from './components/postoffice-group/postoffice-group.component';

@NgModule({
  imports: [CommonModule,
    PostOfficeRoutingModule,
    PostOfficeCoreModule,
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
    DocumentViewModule,
    MailDesktopSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PostOfficeManagerRouterHostComponent,
    PostOfficeManagerComponent,
    PostOfficeLayoutComponent,
    PostOfficeHeaderComponent,
    PostOfficeViewsComponent,
    PostOfficeGridComponent,
    PostOfficeGridRowComponent,
    PostofficeTwoGroupComponent,
    PostofficeGroupComponent,
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
  entryComponents: []

})

export class PostOfficeDesktopModule { }
