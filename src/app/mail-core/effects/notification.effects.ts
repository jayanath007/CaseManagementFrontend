
import { filter, switchMap, take, map, bufferTime, mergeMap, tap, share, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import { of, empty, combineLatest, merge, from } from 'rxjs';
import * as _ from 'lodash';

import * as Events from '../../core/notifications';
import { findFolder, getMessageViewByViewId, findItemById, getActiveViewId } from '../reducers';
import { MSGraphClientService } from '../services/msgraph-client.service';
import * as Items from '../actions/items';
import * as Folders from '../actions/folders';
import { MessageNotification, NotificationGroups } from '../../core/notifications';
import { MsgraphClientMailItemService } from '../../mail-item-core/services/msgraph-client-mail-item.service';
import { MessageItemWrapper } from '../../mail-item-core';
import { RefreshMailWidgetData } from '../../mail-widget/actions/core';
import { FolderItemWrapper } from '../models/interfaces';

function checkItemDiff(item: MessageItemWrapper, eventData: MessageNotification): boolean {
    return true;
    // if (item.data.isDraft !== eventData.IsDraft || item.data.isRead !== eventData.IsRead) {
    //     return true;
    // }

    // const itemFlag = item.data.flag ? item.data.flag.flagStatus.toLowerCase() : undefined;
    // const eventFlag = eventData.Flag ? eventData.Flag.FlagStatus.toLowerCase() : undefined;

    // if (itemFlag !== eventFlag) {
    //     return true;

    // }

    // return false;
}

@Injectable()
export class NotificationEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: MSGraphClientService,
        private mailItemService: MsgraphClientMailItemService) { }

    mailNotifications$ = this.actions$.pipe(ofType<Events.NotificationReceived>(Events.NOTIFICATION_RECEIVED),
        map(action => action.payload),
        filter((event) => event.Group === NotificationGroups.AllMail),
        filter(event => event.ResourceData && !!event.ResourceData.Id),
        mergeMap((event) =>
            event.ResourceData.ParentFolderId ?
                combineLatest(this.store.select(findFolder(event.ResourceData.ParentFolderId)),
                    this.store.select(getMessageViewByViewId(event.ResourceData.ParentFolderId)),
                    (folder, view) => ({ folder, view })).pipe(
                        take(1),
                        map(({ folder, view }) => ({ folder, event, view }))) : of({ event, folder: null, view: null })
        ),
        tap(info => console.log('Mail notification', info)),
        share());



    // missedEvents = this.actions$.pipe(ofType<Events.NotificationReceived>(Events.NOTIFICATION_RECEIVED),
    //     map(action => action.payload),
    //     filter(event => event.ChangeType === Events.ChangeType.Missed),
    //     tap((event) => console.log('missed event recived', event)));

    // @Effect()
    // clearAllCache$ = merge(this.actions$.ofType<Events.NotificationReconnected>
    // (Events.NOTIFICATION_RECONNECTED), this.missedEvents).pipe(
    //     map(() => new Items.ClearAllItemCache()));


    missedEvents = this.actions$.pipe(ofType<Events.NotificationReceived>(Events.NOTIFICATION_RECEIVED),
        map(action => action.payload),
        filter(event => event.ChangeType === Events.ChangeType.Missed),
        tap((event) => console.log('missed event recived', event)));


    @Effect()
    clearAllCache$ = merge(this.actions$.pipe(ofType<Events.NotificationReconnected>(Events.NOTIFICATION_RECONNECTED))
        , this.missedEvents).pipe(
            map(() => new Items.ClearAllItemCache()));


    @Effect()
    refreshDefault$ = this.actions$.pipe(ofType<Items.ClearAllItemCache>(Items.CLEAR_ALL_ITEM_CACHE),
        switchMap((action) =>
            merge(
                this.store.select(findFolder('inbox')).pipe(
                    take(1),
                    filter(folder => !!folder),
                    map(folder => folder.data.id)),

                this.store.select(findFolder('drafts')).pipe(
                    take(1),
                    filter(folder => !!folder),
                    map(folder => folder.data.id)),

                this.store.select(findFolder('sentitems')).pipe(
                    take(1),
                    filter(folder => !!folder),
                    map(folder => folder.data.id)),

                this.store.select(findFolder('deleteditems')).pipe(
                    take(1),
                    filter(folder => !!folder),
                    map(folder => folder.data.id)),

                this.store.select(getActiveViewId).pipe(
                    take(1),
                    filter((viewId) => !!viewId))
            )
        ),
        map((viewId) => new Items.RefreshView({ viewId: viewId })));

    @Effect()
    refreshActiveView$ = this.actions$.pipe(ofType<Items.ClearAllItemCache>(Items.CLEAR_ALL_ITEM_CACHE),
        switchMap((action) =>
            this.store.select(getActiveViewId).pipe(
                take(1),
                filter((viewId) => !!viewId))
        ),
        map((viewId) => new Items.RefreshView({ viewId: viewId })));

    @Effect()
    updateFolderCounts$ = this.mailNotifications$.pipe(
        filter((info) => !!info.folder),
        map(info => info.folder.data.id),
        bufferTime(2000),
        filter(buffer => buffer.length > 0),
        map(folders => _.uniq(folders)),
        map((folderIds) => new Folders.RefreshFoldersData({ folderIds: folderIds, owner: 'me' })));

    @Effect()
    newItemEvents$ = this.mailNotifications$.pipe(
        filter((info) => info.event.ChangeType === Events.ChangeType.Created),
        filter((info) => !!info.view),
        mergeMap((info) =>
            this.mailItemService.getMailItem('me', info.event.ResourceData.Id, true).pipe(
                map((item) => ({ item, folder: info.folder })),
                catchError((error) => empty()))
        ),
        mergeMap((info: any) => {
            return from([new Items.NewItemsRecived({ item: info.item, wellKnownName: info.folder.data.wellKnownName }),
            new RefreshMailWidgetData()]);
        }));


    @Effect()
    updateItemEvents$ = this.mailNotifications$.pipe(
        filter((info) => info.event.ChangeType === Events.ChangeType.Updated),
        tap((info) => console.log('Item update notification', info)),
        filter((info) => !!info.view),
        mergeMap((info) =>
            this.store.select(findItemById(info.event.ResourceData.Id, info.event.ResourceData.ParentFolderId)).pipe(
                take(1),
                filter((item) => !!item),
                map((item) => ({ item, eventData: info.event.ResourceData, folder: info.folder })))
        ),
        filter(({ item, eventData }) => checkItemDiff(item, eventData)),
        mergeMap((info) =>
            this.mailItemService.getMailItem('me', info.item.data.id, true).pipe(
                map((item) => ({ item, folder: <FolderItemWrapper>info.folder })),
                catchError((error) => empty()))
        ),
        // .map((info: any) => new Items.ReplaceItem({ item: info.item, wellKnownName: info.folder.data.wellKnownName }))
        mergeMap((info) => {
            return from([
                new Items.ReplaceItem({ item: info.item, wellKnownName: info.folder.data.wellKnownName, owner: info.folder.owner }),
                new RefreshMailWidgetData()
            ]);
        }));

    @Effect()
    deleteItemEvent$ = this.mailNotifications$.pipe(
        filter((info) => info.event.ChangeType === Events.ChangeType.Deleted),
        tap((info) => console.log('Item delte notification', info)),
        filter((info) => !!info.view),
        mergeMap((info) => {
            return from([new Items.RemoveItemFromCache({ itemId: info.event.ResourceData.Id }),
            new RefreshMailWidgetData()]);
        }));
    // .do((info) => console.log('item deleted from the cache from notifications', info));
}
