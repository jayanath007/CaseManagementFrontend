import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule } from '@angular/material';

// import { MailUrlPopupLayoutComponent } from './components/mail-url-popup-layout/mail-url-popup-layout.component';
import { MailItemUrlPopupLayoutRoutingModule, MailUrlPopupLayoutRoutingModule } from './mail-url-popup-layout-routing.module';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from '../auth';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { MailUrlPopupCoreModule } from '../mail-url-popup-core/mail-url-popup-core.module';
import { MailDesktopSharedModule } from '../mail-desktop-shared/mail-desktop-shared.module';
import { ComposeUrlPopupViewManagerComponent } from './containers/compose-url-poup-view-manager.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressBarModule, MatListModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ComposeUrlPoupViewHostComponent } from './containers/compose-url-poup-view-host.component';
import { OutlookNotificationsModule } from '../outlook-notifications/outlook-notifications.module';
import { ComposeMailCoreModule } from '../compose-mail-core/compose-mail-core.module';
import { ItemAttachmentViewManagerComponent } from './containers/item-attachment-view-manager.component';
import { DocumentViewModule } from '../document-view/document-view.module';
import { SettingCoreModule } from '../setting-core/setting-core.module';
import { EmailListContactsComponent } from './components/email-list-contacts/email-list-contacts.component';
import { SharedModule } from '../shared/shared.module';
import { MailPopupLayoutComponent } from './components/mail-popup-layout/mail-popup-layout.component';

@NgModule({
    imports: [
        MailItemUrlPopupLayoutRoutingModule,
        MailUrlPopupCoreModule,
        ComposeMailCoreModule,
        MailDesktopSharedModule,
        CommonModule,
        SharedModule,
        MatProgressBarModule,
        MatListModule,
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        HttpClientModule,
        OutlookNotificationsModule,
        DocumentViewModule,
        SettingCoreModule
    ],
    declarations: [
        ComposeUrlPopupViewManagerComponent,
        ComposeUrlPoupViewHostComponent,
        ItemAttachmentViewManagerComponent,
        EmailListContactsComponent,
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
        }, DatePipe],
})

export class MailItemUrlPopupLayoutModule { }

@NgModule({
    imports: [
        MailUrlPopupLayoutRoutingModule,
        CommonModule,
        SharedModule,
        HttpClientModule,
        OutlookNotificationsModule,
        DocumentViewModule,
        SettingCoreModule
    ],
    declarations: [MailPopupLayoutComponent],
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
        }, DatePipe],
})

export class MailUrlPopupLayoutModule { }
