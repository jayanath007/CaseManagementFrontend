import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAllReminders, DismissReminder, SnoozeReminder, getCurentTime, DismissAllReminder } from '../../notification-desktop';

@Component({
    selector: 'dps-reminders-list-manager',
    template: `
        <dps-reminder-list [reminderList]="reminderList$|async" [curentTime]="curentTime$|async"
        (snooze)="onSnooze($event)"
        (dismiss)="onDismiss($event)"
        (dismissAll)="onDismissAll($event)"
        ></dps-reminder-list>
      `,
    styles: [],
})
export class RemindersListManagerComponent implements OnInit {

    reminderList$;
    curentTime$;

    constructor(private store: Store<any>) { }

    ngOnInit() {
        this.reminderList$ = this.store.select(getAllReminders);
        this.curentTime$ = this.store.select(getCurentTime);
    }

    onDismiss(reminder) {
        this.store.dispatch(new DismissReminder({ reminder: reminder }));
    }
    onSnooze({ reminder, newReminderTime }) {
        this.store.dispatch(new SnoozeReminder({ reminder: reminder, newReminderTime: newReminderTime }));
    }
    onDismissAll(reminders) {
        this.store.dispatch(new DismissAllReminder({ reminders: reminders }));
    }
}
