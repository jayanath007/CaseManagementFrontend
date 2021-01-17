import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatSidenavModule, MatListModule, MatButtonModule,
  MatCardModule, MatIconModule, MatChipsModule, MatCheckboxModule,
  MatMenuModule, MatDatepickerModule, MatInputModule,
  MatToolbarModule,
  MatButtonToggleModule,
  MatTooltipModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MAT_DATE_LOCALE,
  MatDialogModule,
  MatGridListModule,
  DateAdapter,

} from '@angular/material';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FullCalendarModule } from '@fullcalendar/angular';

import { reducers } from './reducers';
import { CalendarCoreModule } from '../calendar-core';
import { CalendarRoutingModule } from './calendar-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CalendarManagerComponent } from './containers/calendar-manager.component';
import { CalendarLayoutComponent } from './components/calendar-layout/calendar-layout.component';
import { CalendarGroupListComponent } from './components/calendar-group-list/calendar-group-list.component';
import { CalendarGroupItemComponent } from './components/calendar-group-item/calendar-group-item.component';
import { CalendarContentLayoutComponent } from './components/calendar-content-layout/calendar-content-layout.component';
import { SelectedCalendarListComponent } from './components/selected-calendar-list/selected-calendar-list.component';
import { CalendarListItemComponent } from './components/calendar-list-item/calendar-list-item.component';
import { EditEventPopupManagerComponent } from './containers/edit-event-popup-manager.component';
import { CalendarContentManagerComponent } from './containers/calendar-content-manager.component';
import { DayEventListComponent } from './components/day-event-list/day-event-list.component';
import { DayEventItemComponent } from './components/day-event-item/day-event-item.component';
import { OrganizerDesktopSharedModule } from '../organizer-desktop-shared/organizer-desktop-shared.module';
import { RecipientInputManagerComponent } from './containers/recipient-input-manager.component';
import { EditEventContentComponent } from './components/edit-event-content/edit-event-content.component';
import { EditEventHeaderComponent } from './components/edit-event-header/edit-event-header.component';
import { EditEventLayoutComponent } from './components/edit-event-layout/edit-event-layout.component';
import { EditEventManagerComponent } from './containers/edit-event-manager.component';
import { CalendarMiniListComponent } from './components/calendar-mini-list/calendar-mini-list.component';
import { ViewEventLayoutComponent } from './components/view-event-layout/view-event-layout.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CkEditorModule } from '../ck-editor/ck-editor.module';
import { ViewEventPopupManagerComponent } from './containers/view-event-popup-manager.component';
import { ViewEventManagerComponent } from './containers/view-event-manager.component';
import { ViewEventHeaderComponent } from './components/view-event-header/view-event-header.component';
import { ViewEventContentComponent } from './components/view-event-content/view-event-content.component';
import { EventContextMenueComponent } from './components/event-context-menue/event-context-menue.component';
import { AttendeesInputComponent } from './components/attendees-input/attendees-input.component';
import { AttendeeItemComponent } from './components/attendee-item/attendee-item.component';
import { CalendarMiniListItemComponent } from './components/calendar-mini-list-item/calendar-mini-list-item.component';
import { CustomeRecurrenceDialogComponent } from './components/custome-recurrence-dialog/custome-recurrence-dialog.component';
import { CalendarTestEventsComponent } from './components/calendar-test-events/calendar-test-events.component';
import { EventDiscardDialogComponent } from './components/event-discard-dialog/event-discard-dialog.component';
import { ExceptionInterceptor } from '../shared/services/exception-interceptor.service';
import { DocumentViewModule } from '../document-view/document-view.module';


@Injectable()
export class DpsDateAdapter extends MomentDateAdapter {

  getFirstDayOfWeek(): number {
    return 0;
  }

}

@NgModule({
  imports: [
    CommonModule,
    CalendarCoreModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatMenuModule,
    MatInputModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    FullCalendarModule,
    CkEditorModule,
    MatGridListModule,
    StoreModule.forFeature('dpsCalendarDesktop', reducers),
    OrganizerDesktopSharedModule,
    DocumentViewModule,
  ],
  declarations: [
    CalendarManagerComponent,
    CalendarLayoutComponent,
    CalendarGroupListComponent,
    CalendarGroupItemComponent,
    CalendarContentLayoutComponent,
    SelectedCalendarListComponent,
    CalendarListItemComponent,
    EditEventManagerComponent,
    EditEventLayoutComponent,
    EditEventHeaderComponent,
    EditEventContentComponent,
    CustomeRecurrenceDialogComponent,
    CalendarContentManagerComponent,
    DayEventListComponent,
    DayEventItemComponent,
    RecipientInputManagerComponent,
    CalendarMiniListComponent,
    ViewEventManagerComponent,
    ViewEventLayoutComponent,
    ViewEventHeaderComponent,
    ViewEventContentComponent,
    AttendeesInputComponent,
    EventContextMenueComponent,
    AttendeeItemComponent,
    CalendarMiniListItemComponent,
    CalendarTestEventsComponent,
    EventDiscardDialogComponent
  ],
  exports: [
    EditEventManagerComponent,
    EditEventLayoutComponent,
    ViewEventManagerComponent,
    ViewEventLayoutComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: DateAdapter, useClass: DpsDateAdapter }
  ],
  entryComponents: [CustomeRecurrenceDialogComponent, CalendarTestEventsComponent, EventDiscardDialogComponent]
})
export class CalendarDesktopGeneric {
}

@NgModule({
  imports: [
    CalendarRoutingModule,
    CalendarDesktopGeneric
  ],
  declarations: [
  ],

})
export class CalendarDesktopModule { }

@NgModule({
  imports: [
    CalendarDesktopGeneric,
    CommonModule,
    CalendarCoreModule,
    MatProgressBarModule,
    MatDialogModule
  ],
  declarations: [
    EditEventPopupManagerComponent,
  ],
  entryComponents: [EditEventPopupManagerComponent]
})
export class CalendarDesktopEditEventModule {
  popupComponent = EditEventPopupManagerComponent;
}

@NgModule({
  imports: [
    CalendarDesktopGeneric,
    CommonModule,
    CalendarCoreModule,
    MatProgressBarModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExceptionInterceptor,
      multi: true,
    }],
  declarations: [
    ViewEventPopupManagerComponent,
  ],
  entryComponents: [ViewEventPopupManagerComponent]
})
export class CalendarDesktopViewEventModule {
  popupComponent = ViewEventPopupManagerComponent;
}

