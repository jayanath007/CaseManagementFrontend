
import { filter, map } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { getMenuMode } from '../reducers';
import { Observable } from 'rxjs';
import { FolderMenuToggle } from '../actions/folder-menu';
import { BaseFolderManager } from '../../mail-core/containers';
import { FolderItemWrapper } from '../../mail-core';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderRouteChange } from '../actions/router-sync';
import { AddToVisibilityStack } from '../actions/folder-menu';
import { RouterOutlets } from '../models/enums';
import { AuthInfoStateService, ReadingPaneMode, User } from '../../auth';
import { getVisibleOutlet } from '../../layout-desktop';

@Component({
  selector: 'dps-folder-content-manager',
  template: '<ng-content></ng-content>',
})
export class FolderContentManagerComponent extends BaseFolderManager implements OnInit, OnDestroy {

  public menuMode$: any;
  public folders$: any;
  public welknownFolders$: any;
  public isFolderLoading$: any;
  public selectedFolder$: any;
  public deleteItemsFolder$: any;
  public token$: any;
  public isSearching$: any;
  public user$: Observable<User>;

  public mailBoxes$: any;

  private routerListner;

  activeOutlet$;

  constructor(store: Store<any>, private route: ActivatedRoute, private router: Router, public service: AuthInfoStateService) {
    super(store);
    this.menuMode$ = this.store.select(getMenuMode);
  }

  ngOnInit() {
    this.user$ = this.service.getUser();
    this.mailBoxes$ = this.getMailBoxes();
    this.folders$ = this.getSortedFolderList();
    this.welknownFolders$ = this.getSortedWelknownFolderList();
    this.isFolderLoading$ = this.getIsFolderLoading();
    this.selectedFolder$ = this.getSelectedFolder();
    this.isSearching$ = this.getIsSearching();
    this.deleteItemsFolder$ = this.getDeletedItemsFolder();
    if (!(window.opener && window.opener !== window)) {
      this.activeOutlet$ = this.store.select(getVisibleOutlet);
    }
    this.routerListner = this.route.params.pipe(
      map((params) => params.mailFolderId),
      filter(folderId => !!folderId))
      .subscribe(folderId => this.store.dispatch(new FolderRouteChange(folderId)));
  }

  ngOnDestroy(): void {
    if (this.routerListner) {
      this.routerListner.unsubscribe();
    }
  }

  onFolderMenueToggle() {
    this.store.dispatch(new FolderMenuToggle());
  }

  public onFolderSelect({ item, readingPaneMode }: { item: FolderItemWrapper, readingPaneMode: ReadingPaneMode }) {
    const outletName = Object.values(RouterOutlets)
      .find((_outlet) => (_outlet === item.data.wellKnownName && item.owner === 'me')) || RouterOutlets.MessagesCommon;

    const innerRouet: any = [item.owner === 'me' && item.data.wellKnownName ? item.data.wellKnownName : item.data.id];

    // TODO check the client layout
    if (readingPaneMode !== 'hide') {
      innerRouet.push({ outlets: { [RouterOutlets.MessageItemCommon]: ['item-viwer'] } });
    }

    const myRouet = [{
      outlets: {
        [outletName]: innerRouet,
        [RouterOutlets.MessageItemCommon]: null
      }
    }];

    const t = this.router.createUrlTree(myRouet, { relativeTo: this.route }).toString();
    this.router.navigate(myRouet, { relativeTo: this.route });
    this.folderSelect(item);
    this.store.dispatch(new AddToVisibilityStack(outletName as RouterOutlets));
  }

  public onNewMail(readingPaneMode: ReadingPaneMode) {
    const token = 'newMail';
    this.router.navigate([{ outlets: { [RouterOutlets.MessageItemCommon]: ['compose', token] } }], { relativeTo: this.route });
    if (readingPaneMode === 'hide') {
      this.store.dispatch(new AddToVisibilityStack(RouterOutlets.MessageItemCommon));
    }
    this.newMail(token);
  }
}
