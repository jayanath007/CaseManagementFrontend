
import { switchMap, mergeMap, map, filter, take } from 'rxjs/operators';
import { TimezonePipe } from '../../shared/pipes/timezone.pipe';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { RemindersReceived, REMINDERS_RECEIVED } from '../../core/notifications';
import {
    UpdateReminders, FindNewReminders, FIND_NEW_REMINDERS,
    NewRemindersReceived, ChangeCurrentTime
} from '../actions/reminders';
import { combineLatest, from, of, interval } from 'rxjs';
import { getAllReminders, getNewReminders } from '../reducers';
import { getUser } from '../../auth';

@Injectable()
export class RemindersEffects {
    constructor(private actions$: Actions, private store: Store<any>, private datePipe: DatePipe, private timezonePipe: TimezonePipe) { }

    @Effect()
    remindersReceived$ = this.actions$.pipe(ofType<RemindersReceived>(REMINDERS_RECEIVED),
        map(action => new UpdateReminders({ reminders: action.payload })));

    @Effect()
    findNewReminder$ = this.actions$.pipe(ofType<FindNewReminders>(FIND_NEW_REMINDERS),
        switchMap(action =>
            combineLatest(
                this.store.select(getAllReminders),
                this.store.select(getNewReminders),
                this.store.select(getUser).pipe(filter(user => !!(user && user.userTimeZone && user.userTimeZone.info))),
                (allReminders, newReminders, user) => ({ allReminders: allReminders, newReminders: newReminders, user: user })
            ).pipe(take(1))
        ),
        mergeMap(({ allReminders, newReminders, user }) => {
            const now = this.datePipe.transform(
                this.timezonePipe.transform(new Date().toISOString(), user.userTimeZone.info.alias), 'yyyy-MM-ddTHH:mm');
            const _reminders = allReminders.filter(val =>
                this.datePipe.transform(val.reminderFireTime.dateTime, 'yyyy-MM-ddTHH:mm') === now)
                .sort((a, b) => new Date(a.eventStartTime.dateTime).valueOf() > new Date(b.eventStartTime.dateTime).valueOf() ? -1 : 1);
            if (_reminders.length > 0 && (newReminders.length < 1 || newReminders[0].eventId !== _reminders[0].eventId)) {
                if (user.reminderSoundEnable) {
                    const audio = new Audio();
                    audio.src = 'assets/audio/reminder.mp3';
                    audio.load();
                    audio.play();
                }
                return from([new NewRemindersReceived({ reminders: _reminders }), new ChangeCurrentTime({ dateTime: now })]);
            }
            return of(new ChangeCurrentTime({ dateTime: now }));
        }));

    @Effect()
    startFindNewReminder$ = this.actions$.pipe(ofType<FindNewReminders>(FIND_NEW_REMINDERS),
        switchMap(action => interval(1000).pipe(take(1), map(() => new FindNewReminders()))
        ));
}
