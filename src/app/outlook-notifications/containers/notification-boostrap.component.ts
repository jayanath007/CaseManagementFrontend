import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StartNotifications } from '../actions/notifications';
import { StartReminders } from '../actions/reminders';

@Component({
  selector: 'dps-notification-boostrap',
  template: ` `,
  styles: [],
})
export class NotificationBoostrapComponent implements OnInit {

  constructor(private store: Store<any>) {
  }

  ngOnInit() {
    this.store.dispatch(new StartNotifications(false, 1));
    this.store.dispatch(new StartReminders(1));
  }

}

