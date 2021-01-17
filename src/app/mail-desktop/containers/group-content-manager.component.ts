import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseGroupManager } from '../../mail-core/containers/base-group-manager';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterOutlets } from '../models/enums';
import { AddToVisibilityStack } from '../actions/folder-menu';

@Component({
  selector: 'dps-group-content-manager',
  template: '<ng-content></ng-content>',
})
export class GroupContentManagerComponent extends BaseGroupManager implements OnInit, OnDestroy {


  constructor(store: Store<any>, private route: ActivatedRoute, private router: Router) {
    super(store);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }
  onSelectGroup({ event, readingPaneMode}) {
    const outletName = RouterOutlets.Groups;
    const innerRouet: any = [event];

    // TODO check the client layout
    // if (readingPaneMode !== 'hide') {
    innerRouet.push({ outlets: { [RouterOutlets.MessageItemCommon]: ['posts-viwer'] } });
    // }

    const myRouet = [{
      outlets: {
        [outletName]: innerRouet,
        [RouterOutlets.MessageItemCommon]: null
      }
    }];

    const t = this.router.createUrlTree(myRouet, { relativeTo: this.route }).toString();
    console.log(t);
    this.router.navigate(myRouet, { relativeTo: this.route });
    super.onSelectGroup(event);
    this.store.dispatch(new AddToVisibilityStack(outletName as RouterOutlets));

  }
}
