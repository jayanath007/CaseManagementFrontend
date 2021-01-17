import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { FolderItemWrapper } from '../../mail-core';
import { AddToVisibilityStack, PopFromVisibilityStack } from '../actions/folder-menu';
import { RouterOutlets } from '../models/enums';
import { SelectFolder, InitMailCore } from '../../mail-core';
import { LoadPeople } from '../../contacts-and-people-core';
import { BaseMessageOperations } from '../../mail-core';
import { ReadingPaneMode } from '../../auth';

@Injectable()
export class ViewManagerService extends BaseMessageOperations {

  rootRoute: ActivatedRoute;
  constructor(store: Store<any>, private router: Router) { super(store); }

  // registerRootRouter(route: ActivatedRoute) {
  //   this.rootRoute = route;
  // }

  initCore(initFolder, rootRoute: ActivatedRoute) {
    this.rootRoute = rootRoute;

    this.store.dispatch(new InitMailCore({ selectedFolder: initFolder }));
    this.store.dispatch(new LoadPeople());
    this.router.navigate([{ outlets: { [RouterOutlets.Inbox]: [initFolder] } }],
      { relativeTo: this.rootRoute });

  }

  navigateToFolder(folder: FolderItemWrapper) {
    const outletName = Object.values(RouterOutlets)
      .find((_outlet) => _outlet === folder.data.wellKnownName && folder.owner === 'me') || RouterOutlets.MessagesCommon;
    // const t = this.router.createUrlTree([{ outlets: tmp }], { relativeTo: this.route }).toString();
    this.router.navigate([{
      outlets: {
        [outletName]: [folder.owner === 'me' && folder.data.wellKnownName ? folder.data.wellKnownName : folder.data.id],
        [RouterOutlets.MessageItemCommon]: null
      }
    }], { relativeTo: this.rootRoute });

    this.store.dispatch(new SelectFolder(folder));
    this.store.dispatch(new AddToVisibilityStack(outletName as RouterOutlets));
  }

  viewItem(item, viewId, emailReadingPaneMode?: ReadingPaneMode, parentRoute?: ActivatedRoute) {
    super.viewItem(item, viewId);
    const myRoute = [{ outlets: { [RouterOutlets.MessageItemCommon]: 'item-viwer' } }];
    if (emailReadingPaneMode === 'hide') {
      this.router.navigate(myRoute, { relativeTo: this.rootRoute });
      this.store.dispatch(new AddToVisibilityStack(RouterOutlets.MessageItemCommon));
    } else if (parentRoute) {
      const route = [{ outlets: { [RouterOutlets.MessageItemCommon]: null } }];
      this.router.navigate(route, { relativeTo: this.rootRoute }).then(() => {
        const t = this.router.createUrlTree(myRoute, { relativeTo: parentRoute }).toString();
        this.router.navigate(myRoute, { relativeTo: parentRoute });
      });
      this.store.dispatch(new PopFromVisibilityStack(RouterOutlets.MessageItemCommon));
    }
  }

  clearViewingItem() {
    super.clearViewingItem(null);
    const myRoute = [{ outlets: { [RouterOutlets.MessageItemCommon]: null } }];
    this.router.navigate(myRoute, { relativeTo: this.rootRoute });
    this.store.dispatch(new PopFromVisibilityStack(RouterOutlets.MessageItemCommon));
  }

  showReplayForward(item, type) {
    const token = 'replyForward';
    this.router.navigate([{ outlets: { [RouterOutlets.MessageItemCommon]: ['compose', token] } }], { relativeTo: this.rootRoute });
    this.replyForward({ item, type, token });
  }

}
