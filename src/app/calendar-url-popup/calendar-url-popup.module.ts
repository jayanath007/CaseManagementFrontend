import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CalendarUrlPopupRoutingModule } from './calendar-url-popup-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OutlookNotificationsModule } from '../outlook-notifications/outlook-notifications.module';
import { DocumentViewModule } from '../document-view/document-view.module';
import { SettingCoreModule } from '../setting-core/setting-core.module';
import { CalendarPopupLayoutComponent } from './components/calendar-popup-layout/calendar-popup-layout.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { AuthInterceptorService } from '../auth';

@NgModule({
  imports: [
    CalendarUrlPopupRoutingModule,
    CommonModule,
    SharedModule,
    HttpClientModule,
    OutlookNotificationsModule,
    DocumentViewModule,
    SettingCoreModule
  ],
  declarations: [CalendarPopupLayoutComponent],
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
export class CalendarUrlPopupModule { }
