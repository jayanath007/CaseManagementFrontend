
import { map, filter, switchMap, take } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseItemManager } from '../../mail-core/containers';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable } from 'rxjs';

import { MessageItemWrapper } from '../../mail-item-core';
import { RouterOutlets } from '../models/enums';
import { AddToVisibilityStack, PopFromVisibilityStack } from '../actions/folder-menu';
import { getVisibleOutlet } from '../reducers';
import { ViewManagerService } from '../services/view-manager.service';
import { AuthInfoStateService, ReadingPaneMode } from '../../auth';

@Component({
  selector: 'dps-mail-item-manager',
  template: `
              <dps-folder-content-layout [hidden]="(showFolder$ | async) === false"
              [activeItems]="activeItems$ | async"
              [selectedItems]="selectedItems$ | async"
              [isItemsLoading]="activeItemsLoading$ | async"
              [viewId]="viewId$ | async"
              [listOptions]="listOptions$ | async"
              (itemsReadUnread)="onItemsReadUnread($event)"
              (itemsFlag)="onItemsFlag($event)"
              (itemCheck)="onItemCheck($event)"
              (itemsDelete)="onItemsDelete($event)"
              (itemSelect)="onItemSelect($event)"
              (listViewChange)="onListViewChange($event)"
              [isSearching]="isSearching$ | async"
              (attachToNewMail)="onAttachToNewMail($event)"
              [companyCode] = "(user$|async)?.general?.companyCode"
              [timeZone]="(user$|async)?.userTimeZone?.info.alias"
              *ngIf="(user$|async)?.emailReadingPaneMode==='hide'"
              [folderList]="folderList$|async"
              (moveToFolder)="onMoveToFolder($event)"
              ></dps-folder-content-layout>

              <dps-folder-content-short-layout [hidden]="(showFolder$ | async) === false"
              [activeItems]="activeItems$ | async"
              [selectedItems]="selectedItems$ | async"
              [isItemsLoading]="activeItemsLoading$ | async"
              [viewId]="viewId$ | async"
              [listOptions]="listOptions$ | async"
              (itemsReadUnread)="onItemsReadUnread($event)"
              (itemsFlag)="onItemsFlag($event)"
              (itemCheck)="onItemCheck($event)"
              (itemsDelete)="onItemsDelete($event)"
              (itemSelect)="onItemSelect($event)"
              (listViewChange)="onListViewChange($event)"
              [isSearching]="isSearching$ | async"
              (attachToNewMail)="onAttachToNewMail($event)"
              [companyCode] = "(user$|async)?.general?.companyCode"
              [timeZone]="(user$|async)?.userTimeZone?.info.alias"
              [viewingItem]="(viewingItem$|async)?.item"
              [folderList]="folderList$|async"
              (moveToFolder)="onMoveToFolder($event)"
              *ngIf="!(user$|async)?.emailReadingPaneMode || (user$|async)?.emailReadingPaneMode==='right'"
              ></dps-folder-content-short-layout>
            `,
})
export class MailItemManagerComponent extends BaseItemManager implements OnInit, OnDestroy {

  activeItems$: any;
  showFolder$: any;
  selectedItems$: any;
  activeItemsLoading$: any;
  visibleOutlet$: Observable<any>;
  viewId$: Observable<any>;
  listOptions$: any;
  isSearching$: any;
  user$: Observable<any>;
  allItems$: any;
  viewingItem$: Observable<any>;
  folderList$: any;

  constructor(store: Store<any>, private route: ActivatedRoute, private router: Router,
    private viewManager: ViewManagerService, public service: AuthInfoStateService) {
    super(store, service);
  }

  ngOnInit() {

    this.user$ = this.getUser();
    this.visibleOutlet$ = this.store.select(getVisibleOutlet);
    const myFolder$ = merge(this.route.data, this.route.params).pipe(
      map((data) => data.mailFolderId),
      filter((folderId) => !!folderId),
      switchMap((folderId) => this.findFolderById(folderId).pipe(take(1))));

    this.viewId$ = myFolder$.pipe(switchMap(folder => this.getItemViewIdByFolderId(folder.data.id)));

    this.isSearching$ = this.viewId$.pipe(switchMap((viewId) => {
      return this.getIsInSearchModeByViewId(viewId);
    }));

    this.activeItems$ = this.viewId$.pipe(
      switchMap(viewId => this.getActiveItemsByViewId(viewId)));

    this.selectedItems$ = this.viewId$.pipe(
      switchMap(viewId => this.getSelectedItemsByViewId(viewId)));

    this.listOptions$ = this.viewId$.pipe(switchMap((viewId) => this.getItemListViewOptionsByViewId(viewId)));

    const isMyOutlet = (outlet, wellKnownName, readingPaneMode) => {
      // if ((!readingPaneMode || readingPaneMode === 'right') && outlet === RouterOutlets.MessageItemCommon) {
      //   return true;
      // }
      if (outlet && outlet === wellKnownName) {
        return true;
      }
      // has dedicated outlet and it is invisible
      if (!!wellKnownName && Object.values(RouterOutlets).indexOf(wellKnownName) !== -1) {
        return false;
      }
      // all other folder contents
      return outlet === RouterOutlets.MessagesCommon;
    };

    this.showFolder$ = myFolder$.pipe(switchMap((folder) =>
      this.visibleOutlet$.pipe(switchMap((outlet) =>
        this.user$.pipe(map(user =>
          isMyOutlet(outlet, folder.owner === 'me' ? folder.data.wellKnownName : null, user.emailReadingPaneMode)
        ))
      ))));

    this.activeItemsLoading$ = this.viewId$.pipe(
      switchMap((viewId) => this.getActiveItemsLoadingByViewId(viewId)));

    this.viewingItem$ = this.viewId$.pipe(switchMap((viewId) =>
      this.getViewingItemByViewId(viewId)
    ));

    this.store.dispatch(new AddToVisibilityStack(this.route.snapshot.outlet as RouterOutlets));
    this.folderList$ = this.getFolderList();
  }

  public onItemSelect({ item, viewId, readingPaneMode }: { item: MessageItemWrapper, viewId: string, readingPaneMode: ReadingPaneMode }) {
    this.viewManager.viewItem(item, viewId, readingPaneMode, this.route);
  }

  public onListViewChange({ changes, viewId }) {
    this.ensureItemViewChanges(changes, viewId);
  }
  public onAttachToNewMail({ itemAttachments, readingPaneMode }) {
    const token = 'newMail';
    this.router.navigate([{ outlets: { [RouterOutlets.MessageItemCommon]: ['compose', token] } }], { relativeTo: this.route.parent });
    if (readingPaneMode === 'hide') {
      this.store.dispatch(new AddToVisibilityStack(RouterOutlets.MessageItemCommon));
    }
    this.attachToNewMail(itemAttachments, token, 'itemAttachment');
  }
  ngOnDestroy(): void {
    this.store.dispatch(new PopFromVisibilityStack(this.route.snapshot.outlet as RouterOutlets));
  }
}
