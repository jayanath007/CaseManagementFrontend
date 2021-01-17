import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ContactsCreateMainLayoutComponent } from './components/contacts-create-main-layout/contacts-create-main-layout.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';
import { ContactsCreatePopUpRouterHostComponent } from './containers/contacts-create-popup-router-host.component';
import { ContactsCreateManagerComponent } from './containers/contacts-create-manager.component';
import {
  MatToolbarModule, MatDialogModule, MatButtonModule,
  MatIconModule, MatCardModule, MatListModule, MatTabsModule, MatDatepickerModule, MatProgressBarModule, MatInputModule
} from '@angular/material';
import { PersonalDetailsComponent } from './components/personal-details/personal-details.component';
import { CompanyDetailsComponent } from './components/company-details/company-details.component';
import { CaseSpecificDetailsComponent } from './components/case-specific-details/case-specific-details.component';
import { OtherContactDetailsComponent } from './components/other-contact-details/other-contact-details.component';
import { ContactCreateRoutingModule } from './contact-create.routing.module';
import { ContactCreateRouterHostComponent } from './containers/contact-create-manager-router-host.component';
import { ContactCreatePopupLayoutComponent } from './components/contact-create-popup-layout/contact-create-popup-layout.component';
import { ContactCreateDataContentComponent } from './components/contact-create-data-content/contact-create-data-content.component';
import { ContactCreateHeaderComponent } from './components/contact-create-header/contact-create-header.component';
import { ContactsCreateCoreModule } from '../contacts-create-core/contacts-create-core.module';
import { CaseContactDesktopModule } from '../case-contact-desktop/case-contact-desktop.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatTabsModule,
    MatDatepickerModule,
    MatProgressBarModule,
    ContactsCreateCoreModule,
    CaseContactDesktopModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  declarations: [
    ContactCreateRouterHostComponent,
    ContactsCreateManagerComponent,
    ContactsCreatePopUpRouterHostComponent,
    ContactsCreateMainLayoutComponent,
    ContactCreatePopupLayoutComponent,
    ContactCreateHeaderComponent,
    ContactCreateDataContentComponent,
    PersonalDetailsComponent,
    CompanyDetailsComponent,
    CaseSpecificDetailsComponent,
    OtherContactDetailsComponent

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
  entryComponents: [ContactsCreatePopUpRouterHostComponent]
})


export class ContactsCreateDesktopGeneric {
  popupComponent = ContactsCreatePopUpRouterHostComponent; // use in popup service as entry component
}

@NgModule({
  imports: [
    ContactCreateRoutingModule,
    ContactsCreateDesktopGeneric
  ],
  declarations: [
  ],

})
export class ContactsCreateDesktopModule {
}
