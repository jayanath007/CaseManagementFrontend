import { ClientDocumentGridComponent } from './components/client-document-grid/client-document-grid.component';
import { ClientCreationRouterHostComponent } from './containers/client-creation-router-host.component';
import { EditableControlBaseModule } from '../editable-control-base/editable-control-base.module';
import { ClientCreationHeaderComponent } from './components/client-creation-header/client-creation-header.component';
import { ClientCreationMainLayoutComponent } from './components/client-creation-main-layout/client-creation-main-layout.component';
import { AuthInterceptorService } from '../auth/services/auth-interceptor.service';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import {
  MatSelectModule, MatInputModule, MatToolbarModule, MatButtonModule,
  MatIconModule, MatSlideToggleModule, MatTableModule, MatExpansionModule,
  MatListModule, MatSnackBarModule, MatProgressBarModule, MatTabsModule, MatSidenavModule, MatDatepickerModule, MatCheckboxModule, MatChipsModule
} from '@angular/material';
import { ClientCreationManagerComponent } from './containers/client-creation-manager.component';
import { MatterViewDataComponent } from './components/matter-view-data/matter-view-data.component';
import { GridFilterDesktopModule } from '../grid-filter-desktop';
import { CrimeViewDataComponent } from './components/crime-view-data/crime-view-data.component';
import { ClientCreationCoreModule } from '../client-creation-core/client-creation-core.module';
import { ClientCreationNotesComponent } from './components/client-creation-notes/client-creation-notes.component';
import { ClientDocRegisterGridComponent } from './components/client-doc-register-grid/client-doc-register-grid.component';
import { ClientDetilsValidationPopupComponent } from './components/client-detils-validation-popup/client-detils-validation-popup.component';
import { ClientRiskAssessmentComponent } from './components/client-risk-assessment/client-risk-assessment.component';
import { ClientCreationBannerMessageComponent } from './components/client-creation-banner-message/client-creation-banner-message.component';



@NgModule({
  imports: [
    FormsModule,
    MatSidenavModule,
    CommonModule,
    SharedModule,
    MatSelectModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatTableModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDatepickerModule,
    GridFilterDesktopModule,
    EditableControlBaseModule,
    ClientCreationCoreModule,
    HttpClientModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  declarations: [
    ClientCreationRouterHostComponent,
    ClientCreationManagerComponent,
    ClientCreationMainLayoutComponent,
    ClientCreationHeaderComponent,
    MatterViewDataComponent,
    CrimeViewDataComponent,
    ClientCreationNotesComponent,
    ClientDocumentGridComponent,
    ClientDocRegisterGridComponent,
    ClientDetilsValidationPopupComponent,
    ClientRiskAssessmentComponent,
    ClientCreationBannerMessageComponent
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
  entryComponents: [ClientCreationRouterHostComponent, ClientDetilsValidationPopupComponent]
})
export class ClientCreationDesktopModule {
  popupComponent = ClientCreationRouterHostComponent;
}
