// import { Injectable } from '@angular/core';
// import { Effect, Actions, ofType } from '@ngrx/effects';;
// import { Store } from '@ngrx/store';
// import { timer } from 'rxjs/observable/timer';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/take';
// import 'rxjs/add/operator/do';

// import * as Events from '../../core/exceptions';
// import * as Exception from '../actions/exceptions';
// import { getExceptionLatestEvent } from '../reducers';
// import { ChangeType } from '../../core/exceptions';

// @Injectable()
// export class ExceptionEffects {
//     constructor(private actions$: Actions, private store: Store<any>) { }

//     currentItemChanges$ = this.actions$.ofType<Events.NotificationReceived>(Events.NOTIFICATION_RECEIVED)
//         .map(action => action.payload)
//         .filter((event) => event.Group === Events.NotificationGroups.Inbox)
//         .filter(event => event.ResourceData && !!event.ResourceData.Id);

//     @Effect()
//     newMail$ = this.actions$.ofType<Events.NotificationReceived>(Events.NOTIFICATION_RECEIVED)
//         .map(action => action.payload)
//         .filter((event) => event.Group === Events.NotificationGroups.Inbox)
//         .filter(event => event.ResourceData && !!event.ResourceData.Id)
//         .filter(event => event.ChangeType === Events.ChangeType.Created)
//         .map((event) => event.ResourceData)
//         .filter((event: Events.ExceptionDialogData) =>
//             ((new Date(event.LastModifiedDateTime).getTime()) - (new Date(event.ReceivedDateTime).getTime())) / 1000 < 5)
//         .do(event => console.log('new mail event', event))
//         .map((event) => new Exception.ExceptionNotificationReceived({ event: event as Events.ExceptionDialogData }));

//     @Effect()
//     hideIndicator$ = this.actions$.ofType<Exception.ExceptionNotificationReceived>(Exception.NEW_MAIL_NOTIFICATION_RECIVED)
//         .switchMap((action) =>
//             timer(10000)
//                 .take(1)
//                 .map(() => new Exception.HideIndicator())
//         );

//     @Effect()
//     currentRead = this.currentItemChanges$
//     .filter((event) => event.ChangeType === ChangeType.Updated)
//     .filter((event) => event.ResourceData.IsRead)
//     .map((event) => new Exception.DeleteEvent(event.ResourceData.Id));

//     @Effect()
//     currentDeleted= this.currentItemChanges$
//     .filter((event) => event.ChangeType === ChangeType.Deleted)
//     .map((event) => new Exception.DeleteEvent(event.ResourceData.Id));

// }
