
import { take, filter, switchMap, map, catchError, tap, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { NotificationClientService } from '../services/notification-client.service';
import * as Events from '../actions/notifications';
import { NotificationReceived, NotificationReconnected } from '../../core/notifications';
import { interval, throwError as _throw, of } from 'rxjs';
import { LOCAL_RECONNECTED } from '../services/streaming-connection';

import { AuthInfoStateService } from '../../auth';

@Injectable()
export class NotificationEffects {
    constructor(private actions$: Actions, private authHelper: AuthInfoStateService, private eventApi: NotificationClientService) { }

    @Effect()
    $subscribe = this.actions$.pipe(ofType<Events.StartNotifications>(Events.START_NOTIFICATIONS),
        filter(() => !this.authHelper.isGoogle()),
        switchMap(action =>
            this.eventApi.startNotification(action.isReconnect).pipe(
                map((event) => {
                    if (event['@odata.type'] === LOCAL_RECONNECTED) {
                        return new NotificationReconnected();
                    }
                    return new NotificationReceived(event);
                }),
                catchError(() =>
                    of(new Events.StartNotifications(true, action.iteration + 1)).pipe(
                        tap(() => console.warn('Notification subscriptions failed, retry 5 seconds')),
                        delay(5000 * action.iteration))
                ),
                tap((result) => console.log('NEW OUTLOOK NOTIFICATION ', result)))
        ));

    @Effect()
    $renewSubscription = this.actions$.pipe(ofType(Events.START_NOTIFICATIONS),
        switchMap(action => interval(1000 * 60 * 60 * 9).pipe(
            take(1),
            map(() => new Events.StartNotifications(false, 1)))
        ));
}
