
import { switchMap, filter, take, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { timer } from 'rxjs';

import * as Events from '../../core/notifications';
import * as NewMail from '../actions/new-mails';
import { ChangeType } from '../../core/notifications';
import { getUser } from '../../auth';

@Injectable()
export class NewMailEffects {
    constructor(private actions$: Actions, private store: Store<any>) { }

    currentItemChanges$ = this.actions$.pipe(ofType<Events.NotificationReceived>(Events.NOTIFICATION_RECEIVED),
        map(action => action.payload),
        filter((event) => event.Group === Events.NotificationGroups.Inbox),
        filter(event => event.ResourceData && !!event.ResourceData.Id));

    @Effect()
    newMail$ = this.actions$.pipe(ofType<Events.NotificationReceived>(Events.NOTIFICATION_RECEIVED),
        map(action => action.payload),
        filter((event) => event.Group === Events.NotificationGroups.Inbox),
        filter(event => event.ResourceData && !!event.ResourceData.Id),
        filter(event => event.ChangeType === Events.ChangeType.Created),
        map((event) => event.ResourceData),
        filter((event: Events.InboxMessageNotification) =>
            ((new Date(event.LastModifiedDateTime).getTime()) - (new Date(event.ReceivedDateTime).getTime())) / 1000 < 5),
        tap(event => console.log('new mail event', event)),
        map((event) => new NewMail.NewMailNotificationReceived({ event: event as Events.InboxMessageNotification })));

    @Effect()
    hideIndicator$ = this.actions$.pipe(ofType<NewMail.NewMailNotificationReceived>(NewMail.NEW_MAIL_NOTIFICATION_RECIVED),
        switchMap((action) => this.store.select(getUser).pipe(take(1))),
        tap(user => {
            if (user.newMailSoundEnable) {
                const audio = new Audio();
                audio.src = 'assets/audio/new-email.mp3';
                audio.load();
                audio.play();
            }
        }),
        switchMap(() =>
            timer(10000).pipe(
                take(1),
                map(() => new NewMail.HideIndicator()))
        ));

    @Effect()
    currentRead = this.currentItemChanges$.pipe(
        filter((event) => event.ChangeType === ChangeType.Updated),
        filter((event) => event.ResourceData.IsRead),
        map((event) => new NewMail.DeleteEvent(event.ResourceData.Id)));

    @Effect()
    currentDeleted = this.currentItemChanges$.pipe(
        filter((event) => event.ChangeType === ChangeType.Deleted),
        map((event) => new NewMail.DeleteEvent(event.ResourceData.Id)));

}
