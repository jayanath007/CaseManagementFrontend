
import { take, filter, catchError, switchMap, map } from 'rxjs/operators';
import { CreateItemAttachmentReqest } from '../../compose-mail-core/models/interface';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MsgraphClientMailItemService } from '../../mail-item-core/services/msgraph-client-mail-item.service';
import * as Item from '../../mail-item-core/actions/item';
import * as UrlPopup from '../actions/core';
import * as ComposeMail from '../../compose-mail-core';
import { of, empty } from 'rxjs';
import { EventMessage, Message, MailFolder } from '../../core/lib/microsoft-graph';
import { getUser } from '../../auth';

import { Router } from '@angular/router';
import * as Events from '../../core/notifications';
import { getMailItemByToken } from '..';
import { ItemEffectBase } from '../../mail-item-core';
import { FileUrlResolverService } from '../../document-view';
import { MatSnackBar } from '@angular/material';
import { getDefaultMessageFormat } from '../../utils/organizer';


@Injectable()
export class MailUrlPopupEffects extends ItemEffectBase {
    constructor(actions$: Actions, store: Store<any>,
        mailItemService: MsgraphClientMailItemService, private router: Router,
        urlResolver: FileUrlResolverService, public snackBar: MatSnackBar) {
        super(actions$, store, snackBar, urlResolver, mailItemService);
    }

    @Effect()
    readUnreadItems$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupReadUnreadItems>(UrlPopup.URL_POPUP_READ_UNREAD_ITEMS),
        switchMap((action) => {
            if (action.payload.items.length === 1) {
                return this.mailItemService.updateMailItem(action.payload.items[0].owner, action.payload.items[0].data.id,
                    { isRead: action.payload.isRead }).pipe(
                        map((result) => new UrlPopup.UrlPopupReadUnreadItemSuccess(action.token, { item: action.payload.items[0] })),
                        catchError(error =>
                            of(new UrlPopup.UrlPopupReadUnreadItemFail(action.token, { error, item: action.payload.items[0] }))));
            }
        }));

    @Effect()
    flagItems$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupFlagItems>(UrlPopup.URL_POPUP_FLAG_ITEMS),
        switchMap((action) => {
            if (action.payload.items.length === 1) {
                return this.mailItemService.updateMailItem(action.payload.items[0].owner, action.payload.items[0].data.id,
                    { flag: action.payload.flag }).pipe(
                        map((result) => new UrlPopup.UrlPopupReadUnreadItemSuccess(action.token, { item: action.payload.items[0] })),
                        catchError<any, any>(error => {
                            if (error.status === 403) {
                                return of(new UrlPopup.UrlPopupMailItemLoad(action.token,
                                    { owner: action.payload.items[0].owner, itemId: action.payload.items[0].data.id }
                                ));
                            }
                            return of(new UrlPopup.UrlPopupReadUnreadItemFail(action.token, { error, item: action.payload.items[0] }));
                        }));
            }
        }));


    @Effect({ dispatch: false })
    handleAttachemntDownload$ = this._downloadAttachment$;

    @Effect()
    handleAttachemntDownloadToCloud$ = this._downloadAttachmentToCloud$;

    @Effect()
    getOutlookJournalStatus$ = this._getOutlookJournalStatus$;

    @Effect()
    messageItemsLoadSuccess$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupMailItemLoadSuccess>(UrlPopup.URL_POPUP_MAIL_ITEM_LOAD_SUCCESS),
        filter(action => !action.payload.newItem.isDraft),
        map(action => new Item.GetOutlookJournalStatus({
            internetMessageIds: [action.payload.newItem.internetMessageId]
        }))
    );

    @Effect()
    downloadAttachment$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupDownloadAttachment>(UrlPopup.URL_POPUP_DOWNLOAD_ATTACHMENT),
        map((action) => {
            return new Item.DownloadAttachment({
                owner: action.payload.owner,
                itemId: action.payload.itemId,
                attachmentId: action.payload.attachmentId,
                attachment: action.payload.attachment, type: action.payload.type,
                isEmail: true
            });
        }));

    @Effect()
    meetingResponseItem$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupMeetingResponse>
        (UrlPopup.URL_POPUP_MEETING_RESPONSE_ITEM),
        switchMap((action) => {
            const data = <EventMessage>action.payload.item.data;
            return this.mailItemService.responseEvent(
                data.event.id,
                action.payload.comment,
                action.payload.sendResponse,
                action.payload.type).pipe(
                    map((result) => new UrlPopup.UrlPopupMeetingResponseSuccess(action.token, { item: action.payload.item })),
                    catchError(error =>
                        of(new UrlPopup.UrlPopupMeetingResponseFail(action.token, { error, item: action.payload.item }))));
        }));

    @Effect()
    meetingResponseItemSuccess$ = this.actions$
        .pipe(ofType<UrlPopup.UrlPopupMeetingResponseSuccess>(UrlPopup.URL_POPUP_MEETING_RESPONSE_ITEM_SUCCESS),
            switchMap((action) =>
                of(new UrlPopup.UrlPopupDeleteItems(action.token, { items: [action.payload.item], deleteOnlyList: false }))));

    @Effect()
    removeFromCalendar$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupRemoveFromCalendar>(UrlPopup.URL_POPUP_REMOVE_FROM_CALENDAR),
        switchMap((action) => {
            return this.mailItemService.deleteEventMessageEvent(action.payload.eventId).pipe(
                map((result) => new UrlPopup.UrlPopupDeleteItems(action.token,
                    { items: [action.payload.item], deleteOnlyList: false })));
        }));
    // @Effect()
    // createReplyForward$ = this.actions$.ofType
    // <UrlPopup.UrlPopupCreateReplyForward>(UrlPopup.URL_POPUP_CREATE_REPLY_FORWARD).do((data) => {
    //     console.log(data);
    // })
    //     .switchMap((action) => {

    //         const user: User = JSON.parse(localStorage.getItem(LocalStorageKey.LoginUser));

    //         const comment = user.isSignaturAutoAdd ? action.payload.comment ? action.payload.comment : '' +
    //             '<p></p> <div class="signature">' + user.signature + '</div>' +
    //             '<div id ="divRplyFwdMsg"></div>' :
    //             action.payload.comment ? action.payload.comment : '' + '<p></p> <div id ="divRplyFwdMsg"></div>';

    //         return this.mailItemService
    //             .createReplyForward(action.payload.item.data.id, action.payload.type, action.payload.message, comment)
    //             .map((data) => {
    //                 const encodeId = encodeURIComponent(data.id);
    //                 this.router.navigate(['/mail-item/' + encodeId]);
    //                 return new UrlPopup.UrlPopupCreateReplyForwardSuccess(action.token, { newItem: data });
    //             })
    //             .catch(error =>
    // of(new UrlPopup.UrlPopupCreateReplyForwardFail(action.token, { error: error, item: action.payload.item })));
    //     });

    @Effect()
    createReplyForward$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupCreateReplyForward>(UrlPopup.URL_POPUP_CREATE_REPLY_FORWARD),
        switchMap((action) =>
            this.store.select(getUser).pipe(
                filter(user => !!(user.userTimeZone && user.userTimeZone.info)),
                map((user) => {
                    return { user, payload: action.payload, token: action.token };
                }),
                take(1))),
        switchMap((action) => {
            const messageFormat = getDefaultMessageFormat(action.user.messageFormat);
            if (action.payload.isItemAttachement === true) {
                return this.mailItemService
                    .createReplyForwardForItemAttachement(action.payload.item.data.id, action.payload.type, action.payload.message,
                        action.user.isSignaturAutoAdd ? action.payload.comment ? action.payload.comment : '' +
                            `${messageFormat} <div class="signature">` + action.user.signature + '</div>' +
                            '<div id ="divRplyFwdMsg"></div>' :
                            action.payload.comment ? action.payload.comment : '' + `${messageFormat} <div id ="divRplyFwdMsg"></div>`).pipe(
                                map((result) => {
                                    if (result.status === 'Success') {
                                        const encodeId = encodeURIComponent(result.data);
                                        this.router.navigate([`/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId]);
                                        return new UrlPopup.UrlPopupCreateReplyForwardSuccess
                                            (action.token, { newItem: { id: result.data } });
                                    }
                                    return new UrlPopup.UrlPopupCreateReplyForwardFail(action.token,
                                        { error: result.messageBody, item: action.payload.item });
                                }),
                                catchError(error => of(new UrlPopup.UrlPopupCreateReplyForwardFail
                                    (action.token, { error: error, item: action.payload.item }))));
            }
            return this.mailItemService
                .createReplyForward(action.payload.item.data.id, action.payload.type, action.user.userTimeZone.info.alias,
                    action.payload.message,
                    action.user.isSignaturAutoAdd ? action.payload.comment ? action.payload.comment : '' +
                        `${messageFormat} <div class="signature">` + action.user.signature + '</div>' +
                        '<div id ="divRplyFwdMsg"></div>' :
                        action.payload.comment ? action.payload.comment : '' + `${messageFormat} <div id ="divRplyFwdMsg"></div>`).pipe(
                            map((data) => {
                                const encodeId = encodeURIComponent(data.id);
                                this.router.navigate([`/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId]);
                                return new UrlPopup.UrlPopupCreateReplyForwardSuccess(action.token, { newItem: data });
                            }),
                            catchError(error => of(new UrlPopup.UrlPopupCreateReplyForwardFail
                                (action.token, { error: error, item: action.payload.item }))));
        }
        ));

    @Effect()
    newMailWithItemAttachment$ = this.actions$
        .pipe(ofType<UrlPopup.UrlPopupNewMailWithItemAttachment>(UrlPopup.URL_POPUP_NEW_MAIL_WITH_ITEM_ATTACHMENT),
            switchMap((action) =>
                this.store.select(getUser).pipe(
                    map((user) => {
                        return { user, payload: action.payload };
                    }),
                    take(1))),
            switchMap((action) => {
                const messageFormat = getDefaultMessageFormat(action.user.messageFormat);
                const message: Message = {
                    body: {
                        content: action.user.isSignaturAutoAdd ? '' +
                            `${messageFormat} <div class="signature">` + action.user.signature + '</div>' +
                            '<div id ="divRplyFwdMsg"></div>' :
                            '' + `${messageFormat} <div id ="divRplyFwdMsg"></div>`,
                        contentType: 'html'
                    }
                };
                return this.mailItemService
                    .createItem(message).pipe(
                        switchMap((data) => {
                            const attachments = action.payload.attachments.map<CreateItemAttachmentReqest>(val => {
                                return {
                                    ItemId: { Id: val.item.id, ChangeKey: null },
                                    Name: val.name,
                                    Size: 0,
                                    IsInline: false
                                };
                            });
                            return this.mailItemService.addItemAttachment(data.id, attachments).pipe(
                                map(result => {
                                    if (result.status === 'Success') {
                                        const encodeId = encodeURIComponent(data.id);
                                        this.router.navigate([`/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId]);
                                        return new UrlPopup.UrlPopupNewMailWithItemAttachmentSuccess({ attachments: result });
                                    } else {
                                        return new UrlPopup.UrlPopupNewMailWithItemAttachmentFail({ error: result.messageBody });
                                    }
                                }),
                                catchError(error => of(new UrlPopup.UrlPopupNewMailWithItemAttachmentFail({ error: error }))));
                        }),
                        catchError(error => of(new UrlPopup.UrlPopupNewMailWithItemAttachmentFail({ error: error }))));
            }));

    @Effect()
    deleteItems$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupDeleteItems>(UrlPopup.URL_POPUP_DELETE_ITEMS),
        switchMap(
            (action) => {
                return this.mailItemService.getMailFolderByParentId(action.payload.items[0].owner,
                    action.payload.items[0].data.parentFolderId).pipe(
                        map((folder) => {
                            return { folder, action };
                        }), switchMap<{ folder: MailFolder, action: UrlPopup.UrlPopupDeleteItems }, any>((data) => {

                            if (data.folder && data.folder.wellKnownName && data.folder.wellKnownName === 'deleteditems') {
                                if (action.payload.items.length === 1) {
                                    return this.mailItemService.deleteMailItem(action.payload.items[0].data.id,
                                        action.payload.items[0].owner).pipe(
                                            map((result) => {
                                                return new UrlPopup.UrlPopupDeleteItemSuccess(action.token,
                                                    { items: action.payload.items });
                                            }),
                                            catchError(error => of(new UrlPopup.UrlPopupDeleteItemFail
                                                (action.token, { error, item: action.payload.items[0] }))));
                                }
                            } else {
                                return of(new UrlPopup.UrlPopupMoveItems(action.token,
                                    { items: action.payload.items, folderId: 'deleteditems' }));
                            }
                        }),
                        catchError(error => of(new UrlPopup.UrlPopupMailFolderItemFail(action.token, { error }))));
            }));


    @Effect()
    moveItems$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupMoveItems>(UrlPopup.URL_POPUP_MOVE_ITEMS),
        switchMap((action) => {
            if (action.payload.items.length === 1) {
                return this.mailItemService.moveMailItem(action.payload.items[0].owner, action.payload.items[0].data.id,
                    action.payload.folderId).pipe(
                        map((result) => new UrlPopup.UrlPopupMoveItemSuccess
                            (action.token, { items: action.payload.items, folderId: action.payload.folderId })),
                        catchError(error => of(new UrlPopup.UrlPopupMoveItemFail(action.token, { error, item: action.payload.items[0] }))));
            }
        }));

    @Effect()
    currentItemChanges$ = this.actions$.pipe(ofType<Events.NotificationReceived>(Events.NOTIFICATION_RECEIVED),
        map(action => action.payload),
        filter(event => event.ResourceData && !!event.ResourceData.Id),
        switchMap((event) =>
            this.store.select(getMailItemByToken('draftMail')).pipe(filter(data => !!data.data), take(1),
                map((data) => {
                    return {
                        eventItemId: event.ResourceData.Id, curentItemId: data.data.id,
                        isDraft: data.data.isDraft, owner: data.owner
                    };
                }))
        ), filter(data => (data.curentItemId === data.eventItemId) && !data.isDraft),
        map((data) => {
            return new UrlPopup.UrlPopupMailItemLoad('draftMail', { owner: data.owner, itemId: data.curentItemId });
        }));

    @Effect()
    mailItemLoad$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupMailItemLoad>(UrlPopup.URL_POPUP_MAIL_ITEM_LOAD),
        switchMap((action) =>
            this.mailItemService.getMailItem(action.payload.owner, action.payload.itemId).pipe(
                map((data) => new UrlPopup.UrlPopupMailItemLoadSuccess(action.token, { owner: action.payload.owner, newItem: data })),
                catchError(error => of(new UrlPopup.UrlPopupMailItemLoadFail(action.token, { error: error }))))
        ));

    @Effect()
    itemAttachmentLoad$ = this.actions$.pipe(ofType<UrlPopup.UrlPopupItemAttachmentLoad>(UrlPopup.URL_POPUP_ITEM_ATTACHMENT_LOAD),
        switchMap((action) =>
            this.mailItemService.getItemAttachment(action.payload.owner, action.payload.itemId, action.payload.attachmentId).pipe(
                map((result) => {

                    const item = <Message>result.item;
                    item.id = result.id;
                    item.attachments = item.attachments ? item.attachments.map(val => {
                        return {
                            ...val,
                            '@odata.type': val['attachmentType'] === 'Item' ?
                                '#microsoft.graph.itemAttachment' : '#microsoft.graph.fileAttachment',
                        };
                    }) : [];
                    return new UrlPopup.UrlPopupItemAttachmentLoadSuccess(action.token,
                        { owner: action.payload.owner, newItem: item, itemId: action.payload.itemId });
                }),
                catchError(error => of(new UrlPopup.UrlPopupItemAttachmentLoadFail(action.token, { error: error }))))
        ));

    @Effect()
    composeSendSucces$ = this.actions$.pipe(ofType<ComposeMail.SendItemSuccess>(ComposeMail.SEND_ITEM_SUCCESS),
        switchMap((action) => {
            this.removeItemFromCache(action.payload.item.id);
            window.close();
            return empty();
        }));
    @Effect()
    composeSendFail$ = this.actions$.pipe(ofType<ComposeMail.SendItemFail>(ComposeMail.SEND_ITEM_FAIL),
        switchMap((action) => {
            localStorage.setItem('mail_error', JSON.stringify(action.payload));
            return empty();
        }));
    @Effect()
    composeDiscardSucces$ = this.actions$.pipe(ofType<ComposeMail.DiscardItemSuccess>(ComposeMail.DISCARD_ITEM_SUCCESS),
        switchMap((action) => {
            this.removeItemFromCache(action.payload.item.id);
            window.close();
            return empty();
        }));

    removeItemFromCache(id: string) {
        localStorage.setItem('removeMailItemFromCache', id);
        localStorage.removeItem('removeMailItemFromCache');
    }

}






