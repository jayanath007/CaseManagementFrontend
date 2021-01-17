
import { delay, catchError, map, take, switchMap, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { interval, of } from 'rxjs';
import { StartReminders, START_REMINDERS, RefreshReminders, REFRESH_REMINDERS } from '../actions/reminders';
import { RemindersReceived } from '../../core/notifications';
import { getUser, AuthInfoStateService } from '../../auth';
import { ReminderClientService } from '../services/reminder-client.service';
import {
    SnoozeReminder, SNOOZE_REMINDER, DismissReminder,
    DISMISS_REMINDER, DismissAllReminder, DISMISS_ALL_REMINDER, GetAutoReply, GET_AUTO_REPLY, GetAutoReplyFail,
    GetAutoReplySuccess, OffAutoReply, OffAutoReplySuccess, OffAutoReplyFail, OFF_AUTO_REPLY
} from '../../notification-desktop';
import { UpdateTimeZoneSuccess, UPDATE_USER_TIME_ZONE_SUCCESS } from '../../organizer-settings-core';








@Injectable()
export class RemindersEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private eventApi: ReminderClientService, private authHelper: AuthInfoStateService) { }

    @Effect()
    subscribe$ = this.actions$.pipe(ofType<StartReminders>(START_REMINDERS),
        filter(() => !this.authHelper.isGoogle()),
        switchMap(action =>
            this.store.select(getUser).pipe(
                filter(user => !!(user && user.userTimeZone && user.userTimeZone.info)),
                take(1), map(user => ({ action, user })))
        ),
        switchMap(({ action, user }) => {
            const date = new Date();
            const start = '0001-01-01T00:00:00.0000000';
            date.setDate(date.getDate() + 1);
            const end = date.toISOString();
            return this.eventApi.getReminders(start, end, user.userTimeZone.info.alias).pipe(
                map((reminders) => {
                    return new RemindersReceived(reminders);
                }),
                catchError(() =>
                    of(new StartReminders(action.iteration + 1)).pipe(delay(5000 * action.iteration))
                ));
        }));

    @Effect()
    renewSubscription$ = this.actions$.pipe(ofType(START_REMINDERS),
        switchMap(action => interval(1000 * 60 * 30).pipe(
            take(1),
            map(() => new StartReminders(1)))
        ));

    @Effect()
    refreshReminders$ = this.actions$.pipe(ofType<RefreshReminders>(REFRESH_REMINDERS),
        switchMap(action =>
            this.store.select(getUser).pipe(
                filter(user => !!(user && user.userTimeZone && user.userTimeZone.info)),
                take(1), map(user => ({ action, user })))
        ),
        switchMap(({ action, user }) => {
            const date = new Date();
            const start = '0001-01-01T00:00:00.0000000';
            date.setDate(date.getDate() + 1);
            const end = date.toISOString();
            return this.eventApi.getReminders(start, end, user.userTimeZone.info.alias).pipe(
                map((reminders) => {
                    return new RemindersReceived(reminders);
                }),
                catchError(() =>
                    of(new RefreshReminders(action.iteration + 1)).pipe(delay(5000 * action.iteration))
                ));
        }));

    @Effect()
    snoozeReminder$ = this.actions$.pipe(ofType<SnoozeReminder>(SNOOZE_REMINDER),
        switchMap(action =>
            this.store.select(getUser).pipe(
                filter(user => !!(user && user.userTimeZone && user.userTimeZone.info)),
                take(1), map(user => ({ action, user })))
        ),
        switchMap(({ action, user }) => {
            return this.eventApi.snoozeReminder(action.payload.reminder.eventId,
                action.payload.newReminderTime, user.userTimeZone.info.alias).pipe(
                    map((reminders) => {
                        return new RefreshReminders(1);
                    }),
                    catchError(() =>
                        of(new SnoozeReminder(action.payload)).pipe(delay(30000))
                    ));
        }));

    @Effect()
    dismissReminder$ = this.actions$.pipe(ofType<DismissReminder>(DISMISS_REMINDER),
        switchMap((action) => {
            return this.eventApi.dismissReminder(action.payload.reminder.eventId).pipe(
                map((reminders) => {
                    return new RefreshReminders(1);
                }),
                catchError(() =>
                    of(new DismissReminder(action.payload)).pipe(delay(30000))
                ));
        }));
    @Effect()
    dismissAllReminder$ = this.actions$.pipe(ofType<DismissAllReminder>(DISMISS_ALL_REMINDER),
        filter(action => action.payload.reminders.length > 1),
        switchMap((action) => {
            const requests = [];
            action.payload.reminders.forEach((reminder) => {
                requests.push({
                    id: reminder.eventId,
                    method: 'POST',
                    url: `/me/events/${reminder.eventId}/dismissReminder`,
                    body: '',
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                });
            });
            return this.eventApi.batchRequest(requests).pipe(
                map((reminders) => {
                    return new RefreshReminders(1);
                }),
                catchError(() =>
                    of(new DismissAllReminder(action.payload)).pipe(delay(30000))
                ));
        }));
    @Effect()
    dismissAllReminder2$ = this.actions$.pipe(ofType<DismissAllReminder>(DISMISS_ALL_REMINDER),
        filter(action => action.payload.reminders.length === 1),
        map((action) => new DismissReminder({ reminder: action.payload.reminders[0] })));

    @Effect()
    updateTimeZoneSuccess$ = this.actions$.pipe(ofType<UpdateTimeZoneSuccess>(UPDATE_USER_TIME_ZONE_SUCCESS),
        map((action) => new RefreshReminders(1)));

    @Effect()
    getAutoReply$ = this.actions$.pipe(ofType<GetAutoReply>(GET_AUTO_REPLY),
        switchMap(action =>
            this.eventApi.getAutomaticReplies().pipe(
                map(result => new GetAutoReplySuccess(result)),
                catchError((error) => of(new GetAutoReplyFail())))
        ));
    @Effect()
    offAutoReply$ = this.actions$.pipe(ofType<OffAutoReply>(OFF_AUTO_REPLY),
        switchMap(action =>
            this.eventApi.offAutomaticReplies().pipe(
                map(result => new OffAutoReplySuccess(result)),
                catchError((error) => of(new OffAutoReplyFail())))
        ));
}
