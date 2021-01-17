import { FindNewReminders, HideNewReminder, DismissReminder, SnoozeReminder, GetAutoReply, OffAutoReply } from '../actions/reminders';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToggleLastEvent, ToggleMailList } from '../actions/new-mails';
import {
  getNewMailLatestEvent, showLastEmailEvent, showNewEmailList,
  getNewEmailList, getShowLastReminder, getNewReminders, getCurentTime, showAutoRepyMsg
} from '../reducers';

@Component({
  selector: 'dps-new-mail-indicator-manager',
  template: `
    <dps-notification-boostrap> </dps-notification-boostrap>
    <dps-new-mail-indicator
    (toggle)="toggleVisibility()"
    (lastEventClick)="onLastEventClick()"
    [lastEvent]="lastEvent$ | async"
    [mailList]="emailList$ | async"
    [openLastEvent]="showLastEvent$ | async"
    [showList]="showList$ | async"

    [showLastReminder]="showLastReminder$|async"
    [newReminders]="newReminders$|async"
    [curentTime]="curentTime$|async"
    (closeReminders)="onReminderClose()"
    (snooze)="onSnooze($event)"
    (dismiss)="onDismiss($event)"

    [openAutoReplyMSG]="autoRepy$|async"
    (offAutoReply)="onAutoReplyOff()"
    > </dps-new-mail-indicator> `,
  styles: [],
})
export class NewMailIndicatorManagerComponent implements OnInit {

  showList$;
  showLastEvent$;
  lastEvent$;
  emailList$;

  showLastReminder$;
  newReminders$;
  curentTime$;

  autoRepy$;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.showList$ = this.store.select(showNewEmailList);
    this.showLastEvent$ = this.store.select(showLastEmailEvent);
    this.lastEvent$ = this.store.select(getNewMailLatestEvent);
    this.emailList$ = this.store.select(getNewEmailList);

    this.store.dispatch(new FindNewReminders());
    this.showLastReminder$ = this.store.select(getShowLastReminder);
    this.newReminders$ = this.store.select(getNewReminders);
    this.curentTime$ = this.store.select(getCurentTime);

    this.store.dispatch(new GetAutoReply());
    this.autoRepy$ = this.store.select(showAutoRepyMsg);

  }

  toggleVisibility() {
    this.store.dispatch(new ToggleMailList());
  }

  onLastEventClick() {
    this.store.dispatch(new ToggleLastEvent());
  }
  onReminderClose() {
    this.store.dispatch(new HideNewReminder());
  }
  onDismiss(reminder) {
    this.store.dispatch(new DismissReminder({ reminder: reminder }));
  }
  onSnooze({ reminder, newReminderTime }) {
    this.store.dispatch(new SnoozeReminder({ reminder: reminder, newReminderTime: newReminderTime }));
  }
  onAutoReplyOff() {
    this.store.dispatch(new OffAutoReply());
  }
}

