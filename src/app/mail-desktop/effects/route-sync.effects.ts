
import { takeUntil, map, take, tap, mergeMap, filter, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';


import { empty } from 'rxjs';
import { getInbox, getSelectedFolderId, isVertualScrolling } from '../../mail-core';

import * as Folders from '../../mail-core/actions/folders';
import * as Items from '../../mail-core/actions/items';
import { ViewManagerService } from '../services/view-manager.service';
import * as Item from '../../mail-item-core/actions/item';
import { SendItemFail, SEND_ITEM_FAIL } from '../../compose-mail-core';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../shared';
import { MatDialog } from '@angular/material';
import { OpenMailUrlPopup } from '../../mail-item-core/actions/item';
import { SendChaserEmailFail, SEND_CHASER_EMAIL_FAIL } from '../../chaser-core/actions/core';


@Injectable()
export class RouteSyncEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private viewManager: ViewManagerService, private dialog: MatDialog) { }

    // @Effect()
    // folderRouteChnage = this.actions$.ofType<RouteSync.FolderRouteChange>(RouteSync.MAIL_FOLDER_ROUTE_CHANGE)
    //     //.observeOn(async)
    //     .delayWhen(() => this.store.select(getIsFolderLoaded).filter((loaded) => loaded ).take(1) )
    //     .switchMap(action => this.store.select(findFolder(action.folderId)).take(1))
    //     .filter((folder) => !!folder)
    //     .map((folder) => new SelectFolder(folder))
    //     .do((folder) => console.log('select folder from route change 2', folder));

    @Effect({ dispatch: false })
    gotoInboxInDelete$ = this.actions$.pipe(ofType<Folders.DeleteFolderSuccess>(Folders.DELETE_FOLDER_SUCCESS),
        switchMap((action) =>
            this.store.select(getSelectedFolderId).pipe(
                take(1),
                map((id) => ({ selectedId: id, deletedId: action.payload.item.data.id })))
        ),
        filter(({ selectedId, deletedId }) => !selectedId || selectedId === deletedId),
        mergeMap(() =>
            this.store.select(getInbox).pipe(
                take(1))
        ), filter((inbox) => !!inbox),
        tap((inbox) => this.viewManager.navigateToFolder(inbox)));

    @Effect({ dispatch: false })
    gotoInboxInMove$ = this.actions$.pipe(ofType<Folders.MoveFolderSuccess>(Folders.MOVE_FOLDER_SUCCESS),
        switchMap((action) =>
            this.store.select(getSelectedFolderId).pipe(
                take(1),
                map((id) => ({ selectedId: id, deletedId: action.payload.item.data.id })))
        ),
        filter(({ selectedId, deletedId }) => !selectedId || selectedId === deletedId),
        mergeMap(() =>
            this.store.select(getInbox).pipe(take(1))
        ), filter((inbox) => !!inbox),
        tap((inbox) => this.viewManager.navigateToFolder(inbox)));

    @Effect({ dispatch: false })
    watchViewItemDelete$ = this.actions$.pipe(ofType<Items.ViewItem>(Items.VIEW_ITEM),
        switchMap((action) =>
            this.store.select(isVertualScrolling).pipe(
                take(1),
                filter((vs) => !vs), map(() => action))
        ),
        switchMap((action) => {
            const destroy$ = this.actions$.pipe(ofType(Items.CLEAR_VIEWING_ITEM), take(1));
            return this.actions$.pipe(ofType<Item.DeleteItems>(Item.DELETE_ITEMS),
                map((deleteAction) => deleteAction.payload.items.map(item => item.data.id)),
                map(deletedIds => deletedIds.indexOf(action.payload.item.data.id) !== -1),
                takeUntil(destroy$));
        }),
        tap((result) => console.log('is viwing item deleted', result)),
        filter(isViewItemDelete => isViewItemDelete),
        tap(() => this.viewManager.clearViewingItem()));

    @Effect({ dispatch: false })
    watchViewItemDeleteFromEvents$ = this.actions$.pipe(ofType<Items.ViewItem>(Items.VIEW_ITEM),
        switchMap((action) =>
            this.store.select(isVertualScrolling).pipe(
                take(1),
                filter((vs) => !vs), map(() => action))
        ),
        switchMap((action) => {
            const destroy$ = this.actions$.pipe(ofType(Items.CLEAR_VIEWING_ITEM), take(1));
            return this.actions$.pipe(ofType<Items.RemoveItemFromCache>(Items.REMOVE_ITEM_FROM_CACHE),
                map((deleteAction) => deleteAction.payload.itemId),
                map(deletedId => deletedId === action.payload.item.data.id),
                takeUntil(destroy$));
        }),
        tap((result) => console.log('is viwing item deleted', result)),
        filter(isViewItemDelete => isViewItemDelete),
        tap(() => this.viewManager.clearViewingItem()));

    @Effect({ dispatch: false })
    watchViewItemAndSearch$ = this.actions$.pipe(ofType<Items.ViewItem>(Items.VIEW_ITEM),
        switchMap((action) => {
            const destroy$ = this.actions$.pipe(ofType(Items.CLEAR_VIEWING_ITEM), take(1));
            return this.actions$.pipe(ofType<Items.SearchViewChange>(Items.SEARCH_LIST_VIEW_CHANGE),
                takeUntil(destroy$));
        }),
        tap((result) => console.log('searching while viewing items', result)),
        tap(() => this.viewManager.clearViewingItem()));

    @Effect()
    composeSendFail$ = this.actions$.pipe(ofType<SendItemFail>(SEND_ITEM_FAIL),
        switchMap((action) => {
            const dialogData: ConfirmDialogData = {
                content: {
                    title: 'Send Fail',
                    message: `${action.payload.error.error ?
                        `<p>${action.payload.error.error.error.message}</p>` : ''}Do you want to send again?`,
                    acceptLabel: 'Yes',
                    rejectLabel: 'No'
                },
                contentParams: {},
                data: null
            };
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                width: '350px',
                disableClose: true,
                panelClass: 'dps-notification',
                hasBackdrop: true,
            });

            return dialogRef.afterClosed().pipe(
                filter(dialogResult => dialogResult.kind === ConfirmDialogResultKind.Confirmed),
                map(dialogResult => new OpenMailUrlPopup({ owner: 'me', itemId: action.payload.item.id, token: 'composeItem' })));
        }));

    @Effect()
    sendChaserEmailFail$ = this.actions$.pipe(ofType<SendChaserEmailFail>(SEND_CHASER_EMAIL_FAIL),
        filter(({ payload, error }) => error.body && error.body.status === 'Fail'),
        switchMap(({ payload, error }) => {
            const dialogData: ConfirmDialogData = {
                content: {
                    title: 'Send Fail',
                    message: `${error.body.detailStatus && error.body.detailStatus.length > 0 ?
                        `<p>${error.body.detailStatus[0].message}</p>` : ''}Do you want to send again?`,
                    acceptLabel: 'Yes',
                    rejectLabel: 'No'
                },
                contentParams: {},
                data: null
            };
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                width: '350px',
                disableClose: true,
                panelClass: 'dps-notification',
                hasBackdrop: true,
            });

            return dialogRef.afterClosed().pipe(
                filter(dialogResult => dialogResult.kind === ConfirmDialogResultKind.Confirmed),
                map(dialogResult => new OpenMailUrlPopup({ owner: 'me', itemId: payload.emailModel.id, token: 'composeItem' })));
        }));

}
