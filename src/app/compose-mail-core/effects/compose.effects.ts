import { BodyHandlerService } from './../../organizer-desktop-shared';
import { retry, mergeMap, mergeAll, filter, catchError, map, take, tap, switchMap, delayWhen, delay } from 'rxjs/operators';

import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, combineLatest, from, ObservableInput } from 'rxjs';

import * as Compose from '../actions/compose';
import { getInlineAttachmentsByToken, getIsDirtyByToken, getListAttachmentsByToken } from '../reducers';
import { ComposeMailService } from '../services/compose-mail.service';
import { getIsMailSavingByToken, getIsMailSendingByToken, getIsMailDeleteingByToken, getComposeItemByToken } from '../reducers/index';
import { Attachment, Message } from './../../core/lib/microsoft-graph';
import { AttachmentType } from './../../core/lib/graph-enums';
import { CreateItemAttachmentReqest, CreateFileAttachmentReqest } from './../models/interface';
import { InforDialogData, InforDialogComponent } from '../../shared/index';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FileUrlResolverService, OpenByUrl } from '../../document-view';
import { getUser } from '../../auth';
import { IS_GOOGLE } from '../../shared';
import { centerToWindow } from '../../utils/bounds';
import { Dictionary } from '../../core';


@Injectable()
export class ComposeEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: ComposeMailService, private router: Router,
        public urlPopupService: UrlPopupService, private bodyHandlerService: BodyHandlerService, private dialog: MatDialog,
        protected urlResolver: FileUrlResolverService, @Inject(IS_GOOGLE) public isGoogle: string, public snackBar: MatSnackBar) { }


    draftItem$ = this.actions$.pipe(ofType<Compose.DraftItem>(Compose.DRAFT_ITEM),
        switchMap((action) =>
            combineLatest(
                this.store.select(getIsMailSendingByToken(action.token)),
                this.store.select(getIsMailDeleteingByToken(action.token)),
                this.store.select(getIsMailSavingByToken(action.token)),
                (isMailSending, isMailDeleteing, isMailSaveing) => ({ isMailSending, isMailDeleteing, isMailSaveing })
            ).pipe(
                take(1),
                filter(({ isMailSending, isMailDeleteing, isMailSaveing }) => !isMailSending && !isMailDeleteing),
                map(({ isMailSending, isMailDeleteing, isMailSaveing }) => {
                    const data: Message = JSON.parse(JSON.stringify(action.payload.message));
                    if (data.body.contentType === 'html') {
                        data.body.content = this.bodyHandlerService.substituteOriginalCid(data.body.content);

                    }
                    return { isMailSaveing, action, data };
                })
            )
        )
    );

    @Effect()
    createItem$ = this.draftItem$.pipe(
        filter(({ isMailSaveing, action, data }) => !isMailSaveing && !data.id),
        tap(({ isMailSaveing, action, data }) => { this.store.dispatch(new Compose.ItemSaveing(action.token)); }),
        switchMap(({ isMailSaveing, action, data }) =>
            this.service.createItem(data).pipe(
                map((result) => new Compose.DraftItemSuccess(action.token, { item: data, newItem: result })),
                catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: data })))
            )
        )
    );

    @Effect()
    draftItem1$ = this.draftItem$.pipe(
        filter(({ isMailSaveing, action, data }) => isMailSaveing || !!this.getLocalStorageDraftItem(data.id || action.token)),
        tap(({ isMailSaveing, action, data }) => { this.setLocalStorageDraftItem(data.id || action.token, data); }),
        switchMap(({ isMailSaveing, action, data }) => of())
    );

    @Effect()
    draftItem2$ = this.draftItem$.pipe(
        filter(({ isMailSaveing, action, data }) => !isMailSaveing && !!data.id && !this.getLocalStorageDraftItem(data.id)),
        tap(({ isMailSaveing, action, data }) => { this.setLocalStorageDraftItem(data.id, data); }),
        switchMap(({ isMailSaveing, action, data }) =>
            combineLatest(
                this.store.select(getInlineAttachmentsByToken(action.token)),
                this.store.select(getListAttachmentsByToken(action.token)),
                ((inlineAttachments, attachments) => ({
                    isMailSaveing, action, data,
                    attachments: attachments.concat(inlineAttachments),
                }))
            ).pipe(take(1))
        ),
        tap(({ isMailSaveing, action, data }) => { this.store.dispatch(new Compose.ItemSaveing(action.token)); }),
        switchMap(({ isMailSaveing, action, data, attachments }) => {
            return this.service.updateMailItem(data.id, data, attachments, action.payload.isSuppressErrors).pipe(
                map((result) => new Compose.DraftItemSuccess(action.token, { item: data, newItem: result })),
                catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: data }))));
        })
    );

    @Effect()
    draftItemSuccess$ = this.actions$.pipe(ofType<Compose.DraftItemSuccess>(Compose.DRAFT_ITEM_SUCCESS),
        filter(action => !!action.payload.item),
        tap(action => {
            if (!action.payload.item.id) {
                const draft = this.getLocalStorageDraftItem(action.token);
                this.removeLocalStorageDraftItem(action.token);
                this.setLocalStorageDraftItem(action.payload.newItem.id, draft);
            }
        }),
        delay(30000),
        map((action) => {
            const draft = this.getLocalStorageDraftItem(action.payload.newItem.id);
            if (!draft || JSON.stringify(draft) === JSON.stringify(action.payload.item)) {
                this.removeLocalStorageDraftItem(action.payload.newItem.id);
                return { action, draft: null };
            }
            return { action, draft };
        }),
        filter(({ action, draft }) => !!draft),
        switchMap(({ action, draft }) =>
            combineLatest(
                this.store.select(getInlineAttachmentsByToken(action.token)),
                this.store.select(getListAttachmentsByToken(action.token)),
                ((inlineAttachments, attachments) => ({ action, attachments: attachments.concat(inlineAttachments), draft }))
            ).pipe(take(1))
        ),
        tap(({ action, attachments, draft }) => { this.store.dispatch(new Compose.ItemSaveing(action.token)); }),
        switchMap(({ action, attachments, draft }) => {
            return this.service.updateMailItem(action.payload.newItem.id, draft, attachments, true).pipe(
                map((result) => new Compose.DraftItemSuccess(action.token, { item: draft, newItem: result })),
                catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: draft }))));
        })
    );

    // @Effect()
    // draftItem$ = this.actions$.pipe(ofType<Compose.DraftItem>(Compose.DRAFT_ITEM),
    //     switchMap((action) =>
    //         combineLatest(
    //             this.store.select(getIsMailSendingByToken(action.token)),
    //             this.store.select(getIsMailDeleteingByToken(action.token)),
    //             this.store.select(getIsMailSavingByToken(action.token)),
    //             ((isMailSending, isMailDeleteing, isMailSaveing) => ({
    //                 isMailSending: isMailSending,
    //                 isMailDeleteing: isMailDeleteing, isMailSaveing: isMailSaveing, action: action,
    //             }))
    //         ).pipe(take(1))
    //     ),
    //     filter(({ isMailSending, isMailDeleteing, isMailSaveing, action }) =>
    //         isMailSending === false && isMailDeleteing === false && (isMailSaveing === false || action.payload.lastDraft)
    //     ),
    //     delayWhen(({ isMailSending, isMailDeleteing, isMailSaveing, action }) =>
    //         this.store.select(getIsMailSavingByToken(action.token)).pipe(filter((val) => !(action.payload.lastDraft && val)))),
    //     tap(({ isMailSending, isMailDeleteing, isMailSaveing, action }) =>
    //         this.store.dispatch(new Compose.ItemSaveing(action.token))
    //     ),
    //     switchMap(({ isMailSending, isMailDeleteing, isMailSaveing, action }) =>
    //         combineLatest(
    //             this.store.select(getInlineAttachmentsByToken(action.token)),
    //             this.store.select(getListAttachmentsByToken(action.token)),
    //             ((inlineAttachments, attachments) => ({
    //                 isMailSending,
    //                 isMailDeleteing, isMailSaveing, action,
    //                 attachments: attachments.concat(inlineAttachments),
    //             }))
    //         ).pipe(take(1))
    //     ),
    //     switchMap(({ isMailSending, isMailDeleteing, isMailSaveing, action, attachments }) => {
    //         // if (isMailSending === false && isMailDeleteing === false) {
    //         const data: Message = JSON.parse(JSON.stringify(action.payload.message));
    //         if (data.body.contentType === 'html') {
    //             data.body.content = this.bodyHandlerService.substituteOriginalCid(data.body.content);

    //         }
    //         if (!data.id) {
    //             return this.service.createItem(data).pipe(
    //                 map((result) => {
    //                     return new Compose.DraftItemSuccess(action.token, { item: data, newItem: result });
    //                 }),
    //                 catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: data }))));
    //         } else {
    //             return this.service.updateMailItem(data.id, data, attachments, action.payload.isSuppressErrors).pipe(
    //                 map((result) => new Compose.DraftItemSuccess(action.token, { item: data, newItem: result })),
    //                 catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: data }))));
    //         }
    //         // } else {
    //         //     return of(new Compose.DraftItemStopped(action.token, { item: action.payload.message }));
    //         // }
    //     })
    // );

    @Effect()
    saveAndClearComposeMail$ = this.actions$.pipe(ofType<Compose.SaveAndClearComposeMail>(Compose.SAVE_AND_CLEAR_COMPOSE_MAIL),
        switchMap((action) =>
            combineLatest(
                this.store.select(getIsMailSendingByToken(action.token)),
                this.store.select(getIsMailDeleteingByToken(action.token)),
                this.store.select(getIsMailSavingByToken(action.token)),
                this.store.select(getComposeItemByToken(action.token)),
                ((isMailSending, isMailDeleteing, isMailSaveing, item) => ({
                    isMailSending: isMailSending,
                    isMailDeleteing: isMailDeleteing, isMailSaveing: isMailSaveing, item: item, action: action
                }))
            ).pipe(take(1))
        ),
        filter(({ isMailSending, isMailDeleteing, isMailSaveing, item, action }) =>
            isMailSending === false && isMailDeleteing === false && isMailSaveing === false && !!item
        ),
        tap(({ isMailSending, isMailDeleteing, isMailSaveing, item, action }) =>
            this.store.dispatch(new Compose.ItemSaveing(action.token))
        ),
        switchMap(({ isMailSending, isMailDeleteing, isMailSaveing, item, action }) =>
            combineLatest(
                this.store.select(getInlineAttachmentsByToken(action.token)),
                this.store.select(getListAttachmentsByToken(action.token)),
                this.store.select(getIsDirtyByToken(action.token)),
                ((inlineAttachments, attachments, isDirty) => ({
                    isMailSending,
                    isMailDeleteing, isMailSaveing, item, action,
                    attachments: attachments.concat(inlineAttachments),
                    isDirty,
                }))
            ).pipe(take(1))
        ),
        switchMap(({ isMailSending, isMailDeleteing, isMailSaveing, item, action, attachments, isDirty }) => {
            // if (isMailSending === false && isMailDeleteing === false) {
            const data: Message = {
                id: item.id,
                body: item.body,
                subject: item.subject,
                toRecipients: item.toRecipients || [],
                ccRecipients: item.ccRecipients || [],
                bccRecipients: item.bccRecipients || [],
                importance: item.importance,
                flag: item.flag
            };
            if (data.body.contentType === 'html') {
                data.body.content = this.bodyHandlerService.substituteOriginalCid(data.body.content);
            }
            if (!isDirty) {
                return of(new Compose.ClearComposeMail(action.token, { itemId: data.id }));
            }
            if (!data.id) {
                this.removeLocalStorageDraftItem(action.token);
                return this.service.createItem(data).pipe(
                    map((result) => {
                        return new Compose.ClearComposeMail(action.token, { itemId: data.id });
                    }),
                    catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: data }))));
            } else {
                this.removeLocalStorageDraftItem(data.id);
                return this.service.updateMailItem(data.id, data, attachments, true).pipe(
                    map((result) => new Compose.ClearComposeMail(action.token, { itemId: data.id })),
                    catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: data }))));
            }
            // } else {
            //     return of(new Compose.DraftItemStopped(action.token, { item: action.payload.message }));
            // }
        }));

    @Effect()
    openInUrlPopupComposeMail$ = this.actions$.pipe(ofType<Compose.OpenInUrlPopupComposeMail>(Compose.OPEN_IN_URL_POPUP_COMPOSE_MAIL),
        switchMap((action) =>
            combineLatest(
                this.store.select(getIsMailSendingByToken(action.token)),
                this.store.select(getIsMailDeleteingByToken(action.token)),
                this.store.select(getInlineAttachmentsByToken(action.token)),
                this.store.select(getListAttachmentsByToken(action.token)),
                ((isMailSending, isMailDeleteing, inlineAttachments, attachments) => ({
                    isMailSending,
                    isMailDeleteing, action, attachments: attachments.concat(inlineAttachments)
                }))
            ).pipe(take(1))
        ),
        switchMap(({ isMailSending, isMailDeleteing, action, attachments }) => {
            if (isMailSending === false && isMailDeleteing === false) {
                const data: Message = JSON.parse(JSON.stringify(action.payload.message));
                if (data.body.contentType === 'html') {
                    data.body.content = this.bodyHandlerService.substituteOriginalCid(data.body.content);
                }
                return this.store.select(getIsMailSavingByToken(action.token)).pipe(
                    filter(isMailSaving => !isMailSaving),
                    take(1),
                    tap(),
                    switchMap(() => this.store.select(getComposeItemByToken(action.token)).pipe(
                        take(1),
                        switchMap((item => {
                            const id = data.id || item.id;
                            if (id) {
                                this.removeLocalStorageDraftItem(id);
                                return this.service.updateMailItem(data.id, data, attachments).pipe(
                                    mergeMap((result) => {
                                        const encodeId = encodeURIComponent(result.id);
                                        const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                                        const opened = this.urlPopupService.openWithUrlPoup(urlPath, result.id, false, false);
                                        if (!opened) {
                                            this.warningMessage();
                                        }
                                        return from([
                                            new Compose.DraftItemSuccess(action.token, { newItem: result }),
                                            new Compose.CloseComposeMailItem(action.token, { composeMail: data }),
                                            // new Compose.DraftItemSuccess(action.token, { item: data, newItem: result }),
                                        ]);
                                    }),
                                    catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: data }))));
                            }
                            this.removeLocalStorageDraftItem(action.token);
                            return this.service.createItem(data).pipe(
                                mergeMap((result) => {
                                    const encodeId = encodeURIComponent(result.id);
                                    const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                                    const opened = this.urlPopupService.openWithUrlPoup(urlPath, result.id, false, false);
                                    if (!opened) {
                                        this.warningMessage();
                                    }
                                    return from([
                                        new Compose.DraftItemSuccess(action.token, { item: data, newItem: result }),
                                        new Compose.CloseComposeMailItem(action.token, { composeMail: data }),
                                    ]);
                                }),
                                catchError(error => of(new Compose.DraftItemFail(action.token, { error, item: data }))));
                        }))
                    ))
                ) as ObservableInput<any>;
            } else {
                return of(new Compose.DraftItemStopped(action.token, { item: action.payload.message }));
            }
        }));

    @Effect()
    discardItem$ = this.actions$.pipe(ofType<Compose.DiscardItem>(Compose.DISCARD_ITEM),
        switchMap((action) =>
            this.store.select(getIsMailSendingByToken(action.token)).pipe(
                map((isMailSending) => ({ isMailSending: isMailSending, action: action })),
                take(1))
        ),
        switchMap<any, any>(({ isMailSending, action }) => {
            if (isMailSending === false) {
                const data = action.payload.message;
                if (!data.id) {
                    this.removeLocalStorageDraftItem(action.token);
                    return of(new Compose.DiscardItemSuccess(action.token, { item: data }));
                } else {
                    this.removeLocalStorageDraftItem(data.id);
                    return this.service.deleteMailItem(data.id).pipe(
                        map((result) => new Compose.DiscardItemSuccess(action.token, { item: data })),
                        catchError(error => of(new Compose.DiscardItemFail(action.token, { error, item: data }))));
                }
            } else {
                return of(new Compose.DiscardItemStopped(action.token, { item: action.payload.message }));
            }
        }));

    @Effect()
    sendItem$ = this.actions$.pipe(ofType<Compose.SendItem>(Compose.SEND_ITEM),
        switchMap((action) =>
            combineLatest(
                this.store.select(getIsMailSavingByToken(action.token)),
                this.store.select(getIsMailDeleteingByToken(action.token)),
                this.store.select(getInlineAttachmentsByToken(action.token)),
                this.store.select(getListAttachmentsByToken(action.token)),
                ((isMailSaveing, isMailDeleteing, inlineAttachments, attachments) => ({
                    isMailSaveing: isMailSaveing, isMailDeleteing: isMailDeleteing, action: action,
                    attachments: attachments.concat(inlineAttachments)
                }))
            ).pipe(take(1))
        ),
        switchMap<any, any>(({ isMailSaveing, isMailDeleteing, action, attachments }) => {
            if (isMailDeleteing === false) {
                const data: Message = JSON.parse(JSON.stringify(action.payload.message));
                if (data.body.contentType === 'html') {
                    data.body.content = this.bodyHandlerService.substituteOriginalCid(data.body.content);
                }
                if (!data.id && isMailSaveing === false) {
                    this.removeLocalStorageDraftItem(action.token);
                    return of(new Compose.SendNewItem(action.token, { message: data }));
                } else {
                    return combineLatest(
                        this.store.select(getIsMailSavingByToken(action.token)),
                        this.store.select(getComposeItemByToken(action.token)),
                        ((_isMailSaveing, item) => ({
                            isMailSaveing: _isMailSaveing, item
                        }))
                    ).pipe(
                        filter(val => !!(!val.isMailSaveing && val.item && val.item.id)),
                        take(1),
                        switchMap((result) => {
                            data.id = data.id || result.item.id;
                            this.removeLocalStorageDraftItem(data.id);
                            return this.service.updateMailItem(data.id, data, attachments).pipe(
                                mergeMap((res) => {
                                    data.changeKey = res.changeKey;
                                    return from([
                                        new Compose.DraftItemSuccess(action.token, { item: data, newItem: res }),
                                        new Compose.SendDraftItem(action.token, { message: data })
                                    ]);
                                }),
                                catchError(error => of(new Compose.SendItemFail(action.token, { error, item: data }))));
                        }));
                }
                // else if (!data.id && isMailSaveing === true) {
                //     return this.store.select(getComposeItemByToken(action.token)).pipe(
                //         filter(val => val && val.id ? true : false),
                //         take(1),
                //         switchMap((result) => {
                //             data.id = result.id;
                //             return of(new Compose.SendDraftItem(action.token, { message: data }));
                //         }));
                // }
            } else {
                return of(new Compose.SendItemStopped(action.token, { item: action.payload.message }));
            }
        }));

    @Effect()
    sendNewItem$ = this.actions$.pipe(ofType<Compose.SendNewItem>(Compose.SEND_NEW_ITEM),
        switchMap((action) => {
            const data = action.payload.message;
            return this.service.sendNewItem(data).pipe(
                map((result) => new Compose.SendItemSuccess(action.token, { item: data })),
                catchError(error => of(new Compose.SendItemFail(action.token, { error, item: data }))));

        }));

    @Effect()
    sendDraftItem$ = this.actions$.pipe(ofType<Compose.SendDraftItem>(Compose.SEND_DRAFT_ITEM),
        switchMap((action) => {
            const data = action.payload.message;
            return this.service.sendDraftItem(data.id).pipe(
                // retryWhen(errors => errors.pipe(delay(3000), take(3))),
                map((result) => new Compose.SendItemSuccess(action.token, { item: data })),
                catchError(error => of(new Compose.SendItemFail(action.token, { error, item: data }))));
        }));

    @Effect()
    addAttachment$ = this.actions$.pipe(ofType<Compose.AddAttachment>(Compose.ADD_ATTACHMENT),
        switchMap((action) =>
            combineLatest(
                this.store.select(getIsMailSendingByToken(action.token)),
                this.store.select(getIsMailDeleteingByToken(action.token)),
                this.store.select(getIsMailSavingByToken(action.token)),
                ((isMailSending, isMailDeleteing, isMailSaveing) => (
                    { isMailSending: isMailSending, isMailDeleteing: isMailDeleteing, isMailSaveing: isMailSaveing, action: action }
                ))
            ).pipe(take(1))
        ),
        tap(({ isMailSending, isMailDeleteing, isMailSaveing, action }) => {
            if (!isMailSaveing && !action.payload.item.id) {
                this.store.dispatch(new Compose.DraftItem(action.token, { message: action.payload.item, isSuppressErrors: true }));
            }
        }),
        mergeMap(({ isMailSending, isMailDeleteing, isMailSaveing, action }) => {
            if (isMailSending === true && isMailDeleteing === true) {
                return of(new Compose.AddAttachmentFail(action.token, {
                    error: 'Item not found', item: action.payload.item, attachment: action.payload.attachment, uid: action.payload.uid
                }));
            } else if (isMailSaveing === true || !action.payload.item.id) {

                return this.store.select(getComposeItemByToken(action.token)).pipe(
                    filter(val => !!val && !!val.id),
                    take(1),
                    mergeMap<any, any>((result) => {
                        return this.addAttachment(action.token, result.id, action.payload.attachment,
                            action.payload.uid, action.payload.type, action.payload.item);
                    }));
            } else {
                return this.addAttachment(action.token, action.payload.item.id, action.payload.attachment,
                    action.payload.uid, action.payload.type, action.payload.item);
            }
        }));

    @Effect()
    addItemAttachments$ = this.actions$.pipe(ofType<Compose.AddNewMailItemAttachments>(Compose.ADD_NEW_MAIL_ITEM_ATTACHMENTS),
        switchMap((action) =>
            combineLatest(
                this.store.select(getIsMailSendingByToken(action.token)),
                this.store.select(getIsMailDeleteingByToken(action.token)),
                this.store.select(getIsMailSavingByToken(action.token)),
                this.store.select(getComposeItemByToken(action.token)),
                ((isMailSending, isMailDeleteing, isMailSaveing, item) => (
                    {
                        isMailSending: isMailSending, isMailDeleteing: isMailDeleteing, isMailSaveing: isMailSaveing,
                        item: item, action: action
                    }
                ))
            ).pipe(take(1))
        ),
        tap(({ isMailSending, isMailDeleteing, isMailSaveing, item, action }) => {
            if (!isMailSaveing && !item.id) {
                this.store.dispatch(new Compose.DraftItem(action.token, { message: item, isSuppressErrors: true }));
            }
        }),
        switchMap(({ isMailSending, isMailDeleteing, isMailSaveing, item, action }) => {
            if (isMailSending === true && isMailDeleteing === true) {
                return of(new Compose.AddInitAttachmentsFail(action.token, {
                    error: 'Item not found', attachments: action.payload.attachments
                }));
            } else {
                const attachments = action.payload.attachments.map<CreateItemAttachmentReqest>(val => {
                    return {
                        ItemId: { Id: val.item.id, ChangeKey: null },
                        Name: val.name,
                        Size: 0,
                        IsInline: false
                    };
                });
                if (isMailSaveing === true || !item.id) {

                    return this.store.select(getComposeItemByToken(action.token)).pipe(
                        filter(val => !!val && !!val.id),
                        take(1),
                        switchMap((message) => {
                            return this.service.addItemAttachment(message.id, attachments).pipe(
                                retry(3),
                                map(result => {
                                    if (result.status === 'Success') {
                                        const newAttachments = action.payload.attachments.map((val, index) => {
                                            val.id = result.data[index].attachmentId.id;
                                            val['@odata.type'] = '#microsoft.graph.itemAttachment';
                                            return val;
                                        }
                                        );
                                        return new Compose.AddInitAttachmentsSuccess(action.token,
                                            { attachments: newAttachments });
                                    } else {
                                        return new Compose.AddInitAttachmentsFail(action.token,
                                            { error: result.messageBody, attachments: action.payload.attachments });
                                    }
                                }),
                                catchError(error => of(new Compose.AddInitAttachmentsFail(action.token,
                                    { error: error, attachments: action.payload.attachments }))));
                        }));
                } else {
                    return this.service.addItemAttachment(item.id, attachments).pipe(
                        retry(3),
                        map(result => {
                            if (result.status === 'Success') {
                                const newAttachments = action.payload.attachments.map((val, index) => {
                                    val.id = result.data[index].attachmentId.id;
                                    return val;
                                }
                                );
                                return new Compose.AddInitAttachmentsSuccess(action.token,
                                    { attachments: newAttachments });
                            } else {
                                return new Compose.AddInitAttachmentsFail(action.token,
                                    { error: result.messageBody, attachments: action.payload.attachments });
                            }
                        }),
                        catchError(error => of(new Compose.AddInitAttachmentsFail(action.token,
                            { error: error, attachments: action.payload.attachments }))));
                }
            }
        }));

    @Effect()
    addFileAttachment$ = this.actions$.pipe(ofType<Compose.AddFileAttachment>(Compose.ADD_FILE_ATTACHMENT),
        switchMap((action) =>
            combineLatest(
                this.store.select(getInlineAttachmentsByToken(action.token)),
                this.store.select(getListAttachmentsByToken(action.token)),
                ((inlineAttachments, attachments) => ({
                    action: action,
                    attachments: attachments.concat(inlineAttachments)
                }))
            ).pipe(take(1))
        ),
        map(({ action, attachments }) => {
            const data = action.payload.attachment;
            if (data.size < 3000000) {
                data['@odata.type'] = '#microsoft.graph.fileAttachment';
                return this.service.addAttachment(action.payload.itemId, <Attachment>data,
                    action.payload.uid, attachments, action.payload.item).pipe(
                        map((result) => new Compose.AddAttachmentSuccess(action.token, { attachment: result, uid: action.payload.uid })),
                        catchError(error => of(new Compose.AddAttachmentFail(action.token, {
                            error: error,
                            attachment: action.payload.attachment,
                            uid: action.payload.uid
                        }))));
            } else {
                const fileAttachmentReqest: CreateFileAttachmentReqest = {
                    AttachmentType: 'FileAttachment',
                    FileAttachmentTypeViewModel: {
                        Name: data.name,
                        Size: data.size,
                        IsInline: data.isInline,
                        IsContactPhoto: false,
                        ContentType: data.contentType,
                        Base64String: '' + data.contentBytes
                    }
                };
                return this.service.addFileAttachment(action.payload.itemId, [fileAttachmentReqest],
                    action.payload.uid, attachments, action.payload.item).pipe(
                        retry(3),
                        map(result => {
                            data.id = result.data[0].attachmentId.id;
                            return new Compose.AddAttachmentSuccess(action.token, { attachment: data, uid: action.payload.uid });
                        }),
                        catchError(error => of(new Compose.AddAttachmentFail(action.token, {
                            error: error,
                            attachment: action.payload.attachment,
                            uid: action.payload.uid
                        }))));
            }

        }), mergeAll(1));

    @Effect()
    addItemAttachment$ = this.actions$.pipe(ofType<Compose.AddItemAttachment>(Compose.ADD_ITEM_ATTACHMENT),
        mergeMap((action) => {
            const attachment = {
                ItemId: { Id: action.payload.attachment.item.id, ChangeKey: null },
                Name: action.payload.attachment.name,
                Size: 0,
                IsInline: false
            };
            return this.service.addItemAttachment(action.payload.itemId, [attachment]).pipe(
                retry(3),
                map(result => {
                    const data = action.payload.attachment;
                    data.id = result.data[0].attachmentId.id;
                    return new Compose.AddAttachmentSuccess(action.token, { attachment: data, uid: action.payload.uid });
                }),
                catchError(error => of(new Compose.AddAttachmentFail(action.token,
                    { error: error, attachment: action.payload.attachment, uid: action.payload.uid }))));
        }));

    @Effect()
    addDiaryAttachment$ = this.actions$.pipe(
        ofType<Compose.AddDiaryAttachment>(Compose.ADD_DIARY_ATTACHMENT),
        mergeMap((action) => {
            return this.service.addDiaryAttachment(action.payload.itemId, <any>action.payload.attachment.item).pipe(
                retry(3),
                map(result => {
                    const data = action.payload.attachment;
                    data.id = result;
                    return new Compose.AddAttachmentSuccess(action.token, { attachment: data, uid: action.payload.uid });
                }),
                catchError(error => of(new Compose.AddAttachmentFail(action.token,
                    { error: error, attachment: action.payload.attachment, uid: action.payload.uid }))));
        }));

    @Effect()
    addDriveAttachment$ = this.actions$.pipe(ofType<Compose.AddDriveAttachment>(Compose.ADD_DRIVE_ATTACHMENT),
        mergeMap((action) => {
            return this.service.addDriveAttachment(action.payload.itemId, action.payload.attachment).pipe(
                retry(3),
                map(result => {
                    const data = action.payload.attachment;
                    data.id = result.data[0].attachmentId.id;
                    return new Compose.AddAttachmentSuccess(action.token, { attachment: data, uid: action.payload.uid });
                }),
                catchError(error => of(new Compose.AddAttachmentFail(action.token,
                    { error: error, attachment: action.payload.attachment, uid: action.payload.uid }))));
        }));

    @Effect({ dispatch: false })
    downloadAttachment$ = this.actions$.pipe(ofType<Compose.DownloadAttachment>(Compose.DOWNLOAD_ATTACHMENT),
        filter(action => action.payload.type === 'computer'),
        mergeMap((action) => {
            return this.urlResolver.getAttachementDownloadUrl('me', action.payload.itemId, null, action.payload.attachment, true)
                .pipe(map((url) =>
                    ({ url: url, name: action.payload.attachment.name, contentType: action.payload.attachment.contentType })));
        }),
        tap(({ url, name, contentType }) => {
            if (this.isGoogle) {
                const link = document.createElement('a');
                link.href = url;
                link.download = name;
                link.click();
                link.remove();
            } else {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    const downloadLink = document.createElement('a');
                    const file = new Blob([xhr.response], { type: contentType });
                    downloadLink.href = window.URL.createObjectURL(file);
                    downloadLink.download = name;
                    downloadLink.click();
                    downloadLink.remove();
                };
                xhr.send();
            }

        }));

    @Effect()
    downloadAttachmentToCloud$ = this.actions$.pipe(ofType<Compose.DownloadAttachment>(Compose.DOWNLOAD_ATTACHMENT),
        filter(action => action.payload.type === 'cloud'),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) => {
            const snackBar = this.snackBar.open('Downloading to personal folder', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            return this.service.downloadMailAttachmentToOneDrive(action.payload.attachment.id, user.profile.upn.split('@')[0]).pipe(
                tap((result) => {
                    snackBar.dismiss();
                    this.snackBar.open('Download complete', result && result.data && result.data.fileUrl ? 'Open' : null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right',
                        panelClass: 'dps-download-complete-snackbar'
                    }).onAction()
                        .subscribe(() => {
                            this.store.dispatch(
                                new OpenByUrl({
                                    url: result.data.fileUrl,
                                    id: result.data.fileId,
                                    spec: { ...centerToWindow(800, 600) },
                                    attachmentName: ''
                                }));
                        });
                }),
                map((result) => new Compose.DownloadAttachmentSuccess(null)),
                catchError(error => {
                    snackBar.dismiss();
                    return of(new Compose.DownloadAttachmentFail({ error, ids: null }));
                }));
        }));

    @Effect()
    deleteAttachment$ = this.actions$.pipe(ofType<Compose.DeleteAttachment>(Compose.DELETE_ATTACHMENT),
        mergeMap((action) => {
            return this.service.deleteAttachment(action.payload.itemId, action.payload.attachmentId).pipe(
                map((result) => {
                    return new Compose.DeleteAttachmentSuccess(action.token, action.payload);
                }),
                catchError(error => of(new Compose.DeleteAttachmentFail(action.token,
                    { error: error, itemId: action.payload.itemId, attachmentId: action.payload.attachmentId }))));

        }));

    addAttachment(token: string, itemId: string, attachment: Attachment, uid: string, type: AttachmentType, item: Message) {
        switch (type) {
            case AttachmentType.FileAttachment:
                return of(new Compose.AddFileAttachment(token, {
                    itemId: itemId, attachment: attachment, uid: uid, item
                }));
            case AttachmentType.ItemAttachment:
                return of(new Compose.AddItemAttachment(token, {
                    itemId: itemId, attachment: attachment, uid: uid
                }));
            case AttachmentType.OneDriveAttachment:
                return of(new Compose.AddDriveAttachment(token, {
                    itemId: itemId, attachment: attachment, uid: uid
                }));
            case AttachmentType.DiaryAttachment:
                return of(new Compose.AddDiaryAttachment(token, {
                    itemId: itemId, attachment: attachment, uid: uid
                }));
            default:
                return of(new Compose.AddAttachmentFail(token, {
                    error: 'Item not found', attachment: attachment, uid: uid
                }));
        }

    }

    public openComposeUrlPoupByItemId(id) {

        const encodeId = encodeURIComponent(id);
        const url = window.location.origin + `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
        // const newWindow = window.open(url, id, 'width=900,height=700');

        const popupWidth = 900;
        const popupHeight = 700;
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen['left'];
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen['top'];

        const width = window.innerWidth ? window.innerWidth :
            document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight :
            document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const left = ((width / 2) - (popupWidth / 2)) + dualScreenLeft;
        const top = ((height / 2) - (popupHeight / 2)) + dualScreenTop;
        const newWindow = window.open(url, id, 'scrollbars=yes, width=' + popupWidth + ', height='
            + popupHeight + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
            newWindow.focus();
        }

        // if (!(window.navigator.userAgent.indexOf('Edge') > -1)
        //     && !newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        //     this.warningMessage();
        // }
    }

    warningMessage() {
        const dialogData: InforDialogData = {
            content: {
                title: 'Popup has been blocked',
                message: `Please allow popup for this domain`
            },
            data: { messageType: 'warning' }
        };

        const deleteDialogRef = this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '350px',
            panelClass: 'dps-notification'
        });
    }

    getLocalStorageDraftItems(): Dictionary<Message> {
        return JSON.parse(localStorage.getItem('EmailDrafts') || '{}');
    }

    getLocalStorageDraftItem(id: string): Message {
        const drafts = this.getLocalStorageDraftItems();
        return drafts[id];
    }

    setLocalStorageDraftItem(id: string, message: Message) {
        const drafts = this.getLocalStorageDraftItems();
        drafts[id] = message;
        localStorage.setItem('EmailDrafts', JSON.stringify(drafts));
    }
    removeLocalStorageDraftItem(id: string) {
        const drafts = this.getLocalStorageDraftItems();
        delete drafts[id];
        localStorage.setItem('EmailDrafts', JSON.stringify(drafts));
    }

}
