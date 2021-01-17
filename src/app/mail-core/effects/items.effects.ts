
import {
    filter, catchError, delay,
    map, take, tap, mergeMap, switchMap
} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { of, from, empty, merge } from 'rxjs';

import { MSGraphClientService } from '../services/msgraph-client.service';
import * as Folders from '../actions/folders';
import * as Items from '../actions/items';
import * as ItemActions from '../../mail-item-core/actions/item';
import { MailItemRequest } from '../models/requests';
import {
    getSelectedFolderId, getInbox, findNextItem, findPreviousItem,
    getHasMessageItemLoadedByViewId, getItemRequestInfoByViewId, getActiveViewId, getItemLoadingByViewId,
    findFolder, getAllItemSortageRequests,
    getSelectedFolder, getItemToViewByViewId, getViewingItemByViewId, isItemInActiveView, isVertualScrolling,
    getItemAllRequestInfoForActiveViewCacheByViewId
} from '../reducers';
import { EventMessage } from '../../core/lib/microsoft-graph';
import * as ComposeMail from '../../compose-mail-core';
import { SEARCH_VIEWID } from '../models/const';
import * as Item from '../../mail-item-core/actions/item';
import { GetOutlookJournalStatus, MsgraphClientMailItemService } from '../../mail-item-core';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { getUser } from '../../auth';
import { ItemEffectBase } from '../../mail-item-core';
import { FileUrlResolverService } from '../../document-view';
import { MatDialog, MatSnackBar } from '@angular/material';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { SerchMessageListActions, MessageListActions } from '../models/enums';
import { getDefaultMessageFormat } from '../../utils/organizer';
import { FolderItemWrapper } from '../models/interfaces';
import { SendItemSuccess, SEND_ITEM_SUCCESS } from '../../compose-mail-core';

@Injectable()
export class ItemsEffects extends ItemEffectBase {
    constructor(actions$: Actions, store: Store<any>, private service: MSGraphClientService,
        mailItemService: MsgraphClientMailItemService, private urlPopupService: UrlPopupService,
        urlResolver: FileUrlResolverService, private dialog: MatDialog, public snackBar: MatSnackBar) {
        super(actions$, store, snackBar, urlResolver, mailItemService);
        window.addEventListener('storage', (event) => {
            if (event.key === 'removeMailItemFromCache' && event.newValue) {
                store.dispatch(new Items.RemoveItemFromCache({ itemId: event.newValue }));
            }
        });
    }

    // @Effect()
    // cacheAttachemntUrl = this._cacheAttachmentUrl$;

    @Effect()
    openMailUrlPopup$ = this.actions$.pipe(ofType<Item.OpenMailUrlPopup>(Item.OPEN_MAIL_URL_POPUP), switchMap((data) => {
        const encodeId = encodeURIComponent(data.payload.itemId);
        const urlPath = `/mail-item/${encodeURIComponent(btoa(data.payload.owner))}/` + encodeId;
        const opened = this.urlPopupService.openWithUrlPoup(urlPath, data.payload.itemId, false, false);
        if (!opened) {
            this.warningMessage();
        }
        return empty();
    }));

    @Effect()
    folderSelect$ = this.actions$.pipe(ofType<Folders.SelectFolder>(Folders.FOLDER_SELECT),
        mergeMap((action) => of<Items.Any>(
            new Items.EnsureViewChange({ viewId: action.payload.data.id, changes: [] }),
            new Items.SetActiveView({ viewId: action.payload.data.id }))
        ));


    @Effect()
    onSearchView$ = this.actions$.pipe(ofType<Items.SearchViewChange>(Items.SEARCH_LIST_VIEW_CHANGE),
        map((action) => new Items.EnsureViewChange({ viewId: SEARCH_VIEWID, changes: action.payload.changes })));

    @Effect()
    refreshView$ = this.actions$.pipe(ofType<Items.RefreshView>(Items.REFRESH_VIEW),
        map(action => action.payload.viewId),
        mergeMap((viewId) =>
            this.store.select(getItemAllRequestInfoForActiveViewCacheByViewId(viewId)).pipe(
                take(1),
                map((reqInfo) => ({ viewId, reqInfos: reqInfo })))
        ),
        mergeMap(({ viewId, reqInfos }) =>
            from(reqInfos).pipe(
                map((req) => ({ viewId, reqInfo: req })))
        ),
        map(({ viewId, reqInfo }) => new Items.LoadItemsWithRequestInfo({ viewId: viewId, reqInfo: reqInfo, isSuppressErrors: true })));

    @Effect()
    onReqInfo$ = this.actions$.pipe(ofType<Items.LoadItemsWithRequestInfo>(Items.LOAD_ITEMS_WITH_REQUEST_INFO),
        map(action => action.payload),
        mergeMap(({ viewId, reqInfo, isSuppressErrors }) =>
            this.store.select(findFolder(reqInfo.folderId ? reqInfo.folderId : viewId)).pipe(
                take(1),
                map((folder) => ({ folder, reqInfo, viewId, isSuppressErrors })))
        ),
        map(({ viewId, reqInfo, folder, isSuppressErrors }) => ({
            request: new MailItemRequest(
                true,
                reqInfo.hash,
                viewId === SEARCH_VIEWID,
                reqInfo.start,
                reqInfo.size,
                reqInfo.orderBy,
                reqInfo.sortDir,
                reqInfo.filter,
                reqInfo.searchText,
                reqInfo.isAllFolders,
                reqInfo.hasAttachment,
                reqInfo.from,
                reqInfo.dateType,
                reqInfo.dateFrom,
                reqInfo.dateTo,
                folder ? folder.owner : null,
                folder ? folder.data.id : null,
                folder ? folder.data.wellKnownName : null), isSuppressErrors
        })),
        map((request) => new Items.LoadMessageItems(request.request, request.isSuppressErrors)));

    @Effect()
    ensureViewChange$ = this.actions$.pipe(ofType<Items.EnsureViewChange>(Items.ENSURE_LIST_VIEW_CHANGE),
        mergeMap(action =>
            this.store.select(getHasMessageItemLoadedByViewId(action.payload.viewId)).pipe(
                take(1),
                map((hasLoaded) => ({ hasLoaded, viewId: action.payload.viewId })))
        ),
        filter(({ hasLoaded }) => !hasLoaded),
        mergeMap(({ viewId }) =>
            this.store.select(getItemLoadingByViewId(viewId)).pipe(
                take(1),
                map((loading) => ({ loading, viewId: viewId })))
        ),
        filter(({ loading }) => !loading),
        mergeMap(({ viewId }) =>
            this.store.select(getItemRequestInfoByViewId(viewId)).pipe(
                take(1),
                map((reqInfo) => ({ viewId, reqInfo })))
        ), // TODO REFACTOR TO LoadItemsWithRequestInfo
        mergeMap(({ viewId, reqInfo }) =>
            this.store.select(findFolder(reqInfo.folderId ? reqInfo.folderId : viewId)).pipe(
                take(1),
                map((folder) => ({ folder, reqInfo, viewId })))
        ),
        map(({ viewId, reqInfo, folder }) => new MailItemRequest(
            true,
            reqInfo.hash,
            viewId === SEARCH_VIEWID,
            reqInfo.start,
            reqInfo.size,
            reqInfo.orderBy,
            reqInfo.sortDir,
            reqInfo.filter,
            reqInfo.searchText,
            reqInfo.isAllFolders,
            reqInfo.hasAttachment,
            reqInfo.from,
            reqInfo.dateType,
            reqInfo.dateFrom,
            reqInfo.dateTo,
            folder ? folder.owner : null,
            folder ? folder.data.id : null,
            folder ? folder.data.wellKnownName : null)),
        tap(request => console.log('new reqiest', request)),
        map((request) => new Items.LoadMessageItems(request, false)));


    @Effect()
    clearViewIngItem$ = this.actions$.pipe(ofType<Items.EnsureViewChange>(Items.ENSURE_LIST_VIEW_CHANGE),
        filter((action) => !!action.payload.changes.find((change) =>
            [MessageListActions.Filter,
            MessageListActions.OrderBy,
            SerchMessageListActions.DateType,
            SerchMessageListActions.From,
            SerchMessageListActions.HasAttachment,
            SerchMessageListActions.IsAllFolders,
            SerchMessageListActions.SearchText
            ].includes(change.kind))),
        tap(() => console.log('clearing any viewing item')),
        map((action) => new Items.ClearViewingItem({ item: null })));

    @Effect()
    ensureViewIngItem$ = this.actions$.pipe(
        ofType<Items.RemoveItemFromCache | ItemActions.DeleteItems>(Items.REMOVE_ITEM_FROM_CACHE,
            ItemActions.DELETE_ITEMS),
        switchMap((action) =>
            this.store.select(isVertualScrolling).pipe(take(1), filter(vs => vs),
                map(() => action))),
        switchMap((action) =>
            this.store.select(getActiveViewId).pipe(take(1))
        ),
        switchMap((viewId) => {
            const whenNotItem$ = this.store.select(getViewingItemByViewId(viewId)).pipe(
                take(1),
                filter((item) => !item),
                map(() => viewId));

            const whenItem$ = this.store.select(getViewingItemByViewId(viewId)).pipe(
                take(1),
                filter((item) => !!item),
                switchMap(item => this.store.select(isItemInActiveView(viewId, item.data.id)).pipe(take(1))),
                filter(isIn => !isIn),
                map(() => viewId));
            return merge(whenNotItem$, whenItem$);
        }),
        switchMap((viewId) =>
            this.store.select(getItemToViewByViewId(viewId)).pipe(
                take(1),
                filter(item => !!item),
                map((item) => ({ viewId, item })))
        ),
        tap((info) => console.log('Item autoselected', info)),
        map(({ viewId, item }) =>
            new Items.ViewItem({ item, viewId })
        ));

    @Effect()
    loadFolderItems$ = this.actions$.pipe(ofType<Items.LoadMessageItems>(Items.LOAD_MAIL_MESSAGE_ITEMS),
        mergeMap((action) =>
            this.service.listOrSearchMessageItems(action.payload, action.isSuppressErrors).pipe(map((response) =>
                new Items.MessageItemsLoadSuccess({ request: action.payload, response: response })),
                catchError(error => of(new Items.MessageItemsLoadFail(error, action.payload))))
        ));

    @Effect()
    getOutlookJournalStatus$ = this._getOutlookJournalStatus$;

    @Effect()
    messageItemsLoadSuccess$ = this.actions$.pipe(ofType<Items.MessageItemsLoadSuccess>(Items.MAIL_MESSAGE_ITEM_LOAD_SUCCESS),
        map(action => new GetOutlookJournalStatus({ internetMessageIds: action.payload.response.items.map(val => val.internetMessageId) }))
    );

    @Effect()
    gotoInbox$ = this.actions$.pipe(ofType<Folders.DeleteFolderSuccess>(Folders.DELETE_FOLDER_SUCCESS),
        switchMap((action) => this.store.select(getSelectedFolderId).pipe(take(1), map((id) => ({ id, action })))),
        switchMap(({ id, action }) => {
            if (id && id === action.payload.item.data.id) {
                return this.store.select(getInbox).pipe(take(1), map(inbox => new Folders.SelectFolder(inbox)));
            } else {
                return empty();
            }
        }));

    @Effect({ dispatch: false })
    downloadAttachment$ = this._downloadAttachment$;

    @Effect()
    handleAttachemntDownloadToCloud$ = this._downloadAttachmentToCloud$;

    @Effect()
    readUnreadItems$ = this.actions$.pipe(ofType<Item.ReadUnreadItems>(Item.READ_UNREAD_ITEMS),
        switchMap((action) => {
            if (action.payload.items.length === 1) {
                return this.mailItemService.updateMailItem(action.payload.items[0].owner, action.payload.items[0].data.id,
                    { isRead: action.payload.isRead }, true).pipe(
                        map((result) => new Item.ReadUnreadItemSuccess({ item: action.payload.items[0] })),
                        catchError(error => of(new Item.ReadUnreadItemFail({ error, item: action.payload.items[0] }))));
            } else {
                const requests = [];
                action.payload.items.forEach((item) => {
                    requests.push({
                        id: item.data.id,
                        method: 'PATCH',
                        url: `/me/messages/${item.data.id}`,
                        body: { isRead: action.payload.isRead },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                });
                return this.mailItemService.batchRequest(requests).pipe(
                    map((result) => new Item.ReadUnreadItemSuccess({ item: action.payload.items[0] })),
                    catchError(error => of(new Item.ReadUnreadItemFail({ error, item: action.payload.items[0] }))));
            }
        }));
    @Effect()
    flagItems$ = this.actions$.pipe(ofType<Item.FlagItems>(Item.FLAG_ITEMS),
        switchMap(action => this.store.select(getActiveViewId).pipe(
            take(1),
            map((viewId) => ({ action, viewId })))),
        switchMap(({ action, viewId }) => {
            if (action.payload.items.length === 1) {
                return this.mailItemService.updateMailItem(action.payload.items[0].owner, action.payload.items[0].data.id,
                    { flag: action.payload.flag }).pipe(
                        map((result) => new Item.FlagItemSuccess({ item: action.payload.items[0] })),
                        catchError<any, any>(error => {
                            if (error.status === 403 && viewId) {
                                return of(new Items.RefreshView({ viewId: viewId }));
                            }
                            return of(new Item.FlagItemFail({ error, item: action.payload.items[0] }));
                        }));
            } else {
                const requests = [];
                action.payload.items.forEach((item) => {
                    requests.push({
                        id: item.data.id,
                        method: 'PATCH',
                        url: `/me/messages/${item.data.id}`,
                        body: { flag: action.payload.flag },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                });
                return this.mailItemService.batchRequest(requests).pipe(
                    map((result) => {
                        if (result.responses.find(val => val.status === 403) && viewId) {
                            return new Items.RefreshView({ viewId: viewId });
                        }
                        return new Item.FlagItemSuccess({ item: action.payload.items[0] });
                    }),
                    catchError(error => of(new Item.FlagItemFail({ error, item: action.payload.items[0] }))));
            }
        }));



    @Effect()
    getEventMessageEvent$ = this.actions$.pipe(ofType<Item.GetEventMessageEvent>(Item.GET_EVENT_MESSAGE_EVENT),
        switchMap((action) => {
            return this.mailItemService.getEventMessageEvent(<EventMessage>action.payload.item.data).pipe(
                map((result) => new Items.ReplaceItem({
                    item: <EventMessage>{ ...action.payload.item.data, event: result },
                    wellKnownName: action.payload.item.folderWellKnownId,
                    owner: action.payload.item.owner
                })));
        }));


    @Effect()
    removeFromCalendar$ = this.actions$.pipe(ofType<Item.RemoveFromCalendar>(Item.REMOVE_FROM_CALENDAR),
        switchMap((action) => {
            return this.mailItemService.deleteEventMessageEvent(action.payload.eventId).pipe(
                map((result) => new Item.DeleteItems({ items: [action.payload.item], deleteOnlyList: false })));
        }));
    @Effect()
    deleteItems$ = this.actions$.pipe(ofType<Item.DeleteItems>(Item.DELETE_ITEMS),
        switchMap((action) => this.store.select(getSelectedFolder).pipe(take(1), map((folder) => ({ folder, action })))),
        mergeMap<{ folder: FolderItemWrapper, action: ItemActions.DeleteItems }, any>(({ folder, action }) => {
            if (folder && folder.data.wellKnownName && folder.data.wellKnownName === 'deleteditems') {
                if (action.payload.items.length === 1) {
                    return this.mailItemService.deleteMailItem(action.payload.items[0].data.id, action.payload.items[0].owner).pipe(
                        map((result) => new Item.DeleteItemSuccess({ items: action.payload.items })),
                        catchError(error => of(new Item.DeleteItemFail({ error, item: action.payload.items[0] }))));
                } else {
                    const requests = [];
                    action.payload.items.forEach((item) => {
                        requests.push({
                            id: item.data.id,
                            method: 'DELETE',
                            url: `/me/messages/${item.data.id}`
                        });
                    });
                    return this.mailItemService.batchRequest(requests).pipe(
                        map((result) => new Item.DeleteItemSuccess({ items: action.payload.items })),
                        catchError(error => of(new Item.DeleteItemFail({ error, item: action.payload.items[0] }))));
                }
            } else {
                return of(new Item.MoveItems({
                    items: action.payload.items,
                    folderId: 'deleteditems', owner: action.payload.items[0].owner
                }));
            }

        }));

    @Effect()
    moveItems$ = this.actions$.pipe(ofType<Item.MoveItems>(Item.MOVE_ITEMS),
        switchMap(action => this.store.select(getActiveViewId).pipe(
            take(1),
            map((viewId) => ({ action, viewId })))),
        switchMap(({ action, viewId }) => {
            if (action.payload.items.length === 1) {
                return this.mailItemService.moveMailItem(action.payload.items[0].owner, action.payload.items[0].data.id,
                    action.payload.folderId).pipe(
                        map((result) => new Item.MoveItemSuccess({ items: action.payload.items, folderId: action.payload.folderId })),
                        catchError(error => of(new Item.MoveItemFail({ error, item: action.payload.items[0] }))));
            } else {
                const requests = [];
                action.payload.items.forEach((item) => {
                    const owner = action.payload.items[0].owner;
                    requests.push({
                        id: item.data.id,
                        method: 'POST',
                        url: `/${owner === 'me' ? owner : ('users/' + owner)}/messages/${item.data.id}/move`,
                        body: { DestinationId: action.payload.folderId },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                });
                return this.mailItemService.batchRequest(requests).pipe(
                    map((result) => {
                        if (result.responses.find(val => val.status === 403 ||
                            (val.body['error'] && val.body['error'].code === 'ErrorMoveCopyFailed')) && viewId) {
                            return new Items.RefreshView({ viewId: viewId });
                        }
                        return new Item.MoveItemSuccess({ items: action.payload.items, folderId: action.payload.folderId });
                    }),
                    catchError(error => of(new Item.MoveItemFail({ error, item: action.payload.items[0] }))));
            }
        }));

    @Effect()
    meetingResponseItem$ = this.actions$.pipe(ofType<Item.MeetingResponse>(Item.MEETING_RESPONSE_ITEM),
        switchMap((action) => {
            const data = <EventMessage>action.payload.item.data;
            return this.mailItemService.responseEvent(
                data.event.id,
                action.payload.comment,
                action.payload.sendResponse,
                action.payload.type).pipe(
                    map((result) => new Item.MeetingResponseSuccess({ item: action.payload.item })),
                    catchError(error => of(new Item.MeetingResponseFail({ error, item: action.payload.item }))));
        }));

    @Effect()
    meetingResponseItemSuccess$ = this.actions$.pipe(ofType<Item.MeetingResponseSuccess>(Item.MEETING_RESPONSE_ITEM_SUCCESS),
        switchMap((action) => of(new Item.DeleteItems({ items: [action.payload.item], deleteOnlyList: false }))));

    @Effect()
    viewNextItem$ = this.actions$.pipe(ofType<Items.ViewNextItem>(Items.VIEW_NEXT_ITEM),
        switchMap((action) => {
            if (!action.payload.viewId) {
                return this.store.select(getActiveViewId).pipe(
                    take(1),
                    map((viewId) =>
                        ({ item: action.payload.item, viewId: viewId })));
            }
            return of({ item: action.payload.item, viewId: action.payload.viewId });
        }),
        switchMap(({ item, viewId }) =>
            this.store.select(findNextItem(item, viewId)).pipe(
                take(1),
                map((nextItem) => ({ item: nextItem, viewId: viewId })))
        ),
        filter(({ item, viewId }) => !!item),
        map(({ item, viewId }) => new Items.ViewItem({ item, viewId })));

    @Effect()
    viewPreviousItem$ = this.actions$.pipe(ofType<Items.ViewPreviousItem>(Items.VIEW_PREVIOUS_ITEM),
        switchMap((action) => {
            if (!action.payload.viewId) {
                return this.store.select(getActiveViewId).pipe(
                    take(1),
                    map((viewId) =>
                        ({ item: action.payload.item, viewId: viewId })));
            }
            return of({ item: action.payload.item, viewId: action.payload.viewId });
        }),
        switchMap(({ item, viewId }) =>
            this.store.select(findPreviousItem(item, viewId)).pipe(
                take(1),
                map((preItem) => ({ item: preItem, viewId: viewId })))
        ),
        filter(({ item, viewId }) => !!item),
        map(({ item, viewId }) => new Items.ViewItem({ item, viewId })));

    @Effect()
    createReplyForward$ = this.actions$.pipe(ofType<Item.CreateReplyForward>(Item.CREATE_REPLY_FORWARD),
        switchMap((action) =>
            this.store.select(getUser).pipe(
                filter(user => !!(user.userTimeZone && user.userTimeZone.info)),
                map((user) => ({ user, payload: action.payload })),
                take(1))),
        switchMap((action) => {
            const messageFormat = getDefaultMessageFormat(action.user.messageFormat);
            return this.mailItemService
                .createReplyForward(action.payload.item.data.id, action.payload.type,
                    action.user.userTimeZone.info.alias, action.payload.message,
                    action.user.isSignaturAutoAdd ? action.payload.comment ? action.payload.comment : '' +
                        `${messageFormat} <div class="signature">` + action.user.signature + '</div>' +
                        '<div id ="divRplyFwdMsg"></div>' :
                        action.payload.comment ? action.payload.comment : '' + `${messageFormat} <div id ="divRplyFwdMsg"></div>`).pipe(
                            map((data) => new Item.CreateReplyForwardSuccess({
                                newItem: data,
                                refItem: action.payload.item.data,
                                token: action.payload.token
                            })),
                            catchError(error => of(new Item.CreateReplyForwardFail({ error: error, item: action.payload.item }))));
        }));
    @Effect()
    newMailWithItemAttachment$ = this.actions$.pipe(ofType<Item.NewMailWithItemAttachment>(Item.NEW_MAIL_WITH_ITEM_ATTACHMENT), delay(10),
        switchMap((action) => of(new ComposeMail.AddNewMailItemAttachments(action.payload.token,
            { attachments: action.payload.attachments }))));
    @Effect()
    getCreateReplyForwardFullData$ = this.actions$.pipe(ofType<Item.GetCreateReplyForwardFullData>(Item.GET_CREATE_REPLY_FORWARD_FULL_DATA),
        switchMap((action) =>
            this.mailItemService.getMailItem('me', action.payload.message.id).pipe(
                map((data) => new ComposeMail.AddInitAttachmentsSuccess(action.payload.token,
                    { attachments: data.attachments })),
                catchError(error => of(new Item.CreateReplyForwardFail({ error: error }))))
        ));

    @Effect()
    createReplyForwardSuccess$ = this.actions$.pipe(ofType<Item.CreateReplyForwardSuccess>(Item.CREATE_REPLY_FORWARD_SUCCESS),
        mergeMap((action) => from([
            new ComposeMail.AddComposeMail(action.payload.token, { composeMail: action.payload.newItem, refMail: action.payload.refItem }),
            new Item.GetCreateReplyForwardFullData({ message: action.payload.newItem, token: action.payload.token })
        ])));

    @Effect()
    createReplyForwardUpdate$ = this.actions$.pipe(ofType<Item.CreateReplyForwardSuccess>(Item.CREATE_REPLY_FORWARD_SUCCESS),
        switchMap(action => {
            return this.mailItemService.updateMailItem('me', action.payload.newItem.id, { body: action.payload.newItem.body }, false).pipe(
                switchMap(data => of())
            );
        })
    );

    // @Effect()
    // preCacheAttUrl$ = this.actions$.pipe(ofType<Items.ViewItem>(Items.VIEW_ITEM),
    //     map(action => new Item.CacheAttachmentUrl({ item: action.payload.item })));

    @Effect()
    refillItemsOnDelete$ = this.actions$.pipe(ofType<Item.DeleteItemSuccess>(Item.DELETE_ITEM_SUCCESS),
        map(() => new Items.RefillItemSortage()));

    @Effect()
    refillItemsOnMove$ = this.actions$.pipe(ofType<Item.MoveItemSuccess>(Item.MOVE_ITEM_SUCCESS),
        map(() => new Items.RefillItemSortage()));

    @Effect()
    refillItemonEventDelete$ = this.actions$.pipe(ofType<Items.RemoveItemFromCache>(Items.REMOVE_ITEM_FROM_CACHE),
        map(() => new Items.RefillItemSortage()));

    @Effect()
    refillItemonEventUpdate$ = this.actions$.pipe(ofType<Items.ReplaceItem>(Items.REPLACE_ITEMS),
        map(() => new Items.RefillItemSortage()));

    @Effect()
    clearMovedFolder$ = this.actions$.pipe(ofType<Item.MoveItemSuccess>(Item.MOVE_ITEM_SUCCESS),
        mergeMap(action =>
            this.store.select(findFolder(action.payload.folderId)).pipe(
                take(1),
                map((folder) => ({ folderId: folder.data.id })))
        ), map((action) => new Items.RemoveFolderView({ viewId: action.folderId })));

    @Effect()
    refillItemSortage$ = this.actions$.pipe(ofType<Items.RefillItemSortage>(Items.REFILL_ITEM_SORTAGE),
        switchMap((action) => this.store.select(getAllItemSortageRequests).pipe(take(1))),
        tap(info => console.log('refile item shorage', info)),
        mergeMap((reqInfos) => from(reqInfos)),
        switchMap((reqInfo) => reqInfo.folderId ? this.store.select(findFolder(reqInfo.folderId)).pipe(
            map((folder) => ({ folder, reqInfo }))) : of({ folder: null, reqInfo })
        ),
        map(({ reqInfo, folder }) => (
            new MailItemRequest(
                false,
                reqInfo.hash,
                reqInfo.isSearching,
                reqInfo.start,
                reqInfo.size,
                reqInfo.orderBy,
                reqInfo.sortDir,
                reqInfo.filter,
                reqInfo.searchText,
                reqInfo.isAllFolders,
                reqInfo.hasAttachment,
                reqInfo.from,
                reqInfo.dateType,
                reqInfo.dateFrom,
                reqInfo.dateTo,
                folder ? folder.owner : null,
                folder ? folder.data.id : null,
            ))

        ), map((request) => new Items.LoadMessageItems(request, false)));

    @Effect()
    sendItemSuccess$ = this.actions$.pipe(ofType<SendItemSuccess>(SEND_ITEM_SUCCESS),
        map((action) => new Items.RemoveItemFromCache({ itemId: action.payload.item.id }))
    );

    warningMessage() {
        const dialogData: InforDialogData = {
            content: {
                title: 'Popup has been blocked',
                message: `Please allow popup for this domain`
            },
            contentParams: { displayName: '' },
            data: { messageType: 'warning' }
        };
        const deleteDialogRef = this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '350px',
            panelClass: 'dps-notification'
        });
    }

}
