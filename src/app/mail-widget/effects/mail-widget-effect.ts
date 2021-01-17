
import { catchError, mergeMap, map, switchMap, take } from 'rxjs/operators';
import { MailWidgetService } from '../services/mail-widget.service';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { of, from } from 'rxjs';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { Message } from '../../core/lib/microsoft-graph';
import { getUser } from '../../auth';
import { getDefaultMessageFormat } from '../../utils/organizer';
@Injectable()
export class MailWidgetEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: MailWidgetService, private urlPopupService: UrlPopupService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitMailWidget>(Core.INIT_MAIL_WIDGET),
        mergeMap(action => {
            return from([new Core.LoadData(),
            new Core.LoadMailCount()]);
        }));

    @Effect()
    loadData$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap(action =>
            this.service.getListMessageItems().pipe(
                map(result => new Core.LoadDataSuccess({ data: result })),
                catchError((error) => of(new Core.LoadDataFail())))
        ));

    @Effect()
    refresh$ = this.actions$.pipe(ofType<Core.RefreshMailWidgetData>(Core.REFRESH_DATA),
        mergeMap(action => {
            return from([new Core.LoadData(),
            new Core.LoadMailCount]);
        }));

    @Effect()
    loadMailCountData$ = this.actions$.pipe(ofType<Core.LoadMailCount>(Core.LOAD_MAIL_COUNT),
        switchMap(action =>
            this.service.getInboxDetails().pipe(
                map(result => new Core.LoadMailCountSuccess({ data: result })),
                catchError((error) => of(new Core.LoadMailCountFail())))
        ));

    @Effect()
    newCompose$ = this.actions$.pipe(ofType<Core.NewCompose>(Core.NEW_COMPOSE),
        switchMap(action =>
            this.store.select(getUser).pipe(
                take(1),
                switchMap(user => {
                    const messageFormat = getDefaultMessageFormat(user.messageFormat);
                    const message: Partial<Message> = {
                        hasAttachments: false,
                        subject: null,
                        body: {
                            content: (user && user.isSignaturAutoAdd) ?
                                `${messageFormat} <div class="signature">` + user.signature + '</div>' : messageFormat,
                            contentType: 'html'
                        },
                    };
                    return this.service.createItem(message).pipe(
                        map(data => {
                            const encodeId = encodeURIComponent(data.id);
                            const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                            this.urlPopupService.openWithUrlPoup(urlPath, data.id, false, false);
                            return { type: 'dps_empty' };
                        }), catchError((error) => of()));
                }))
        ));
}
