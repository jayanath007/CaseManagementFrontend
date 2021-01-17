import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseRecipientInputManager } from '../../contacts-and-people-core/containers';
import { AuthInfoStateService } from '../../auth';

@Component({
  selector: 'dps-recipient-input-manager',
  template: '<ng-content></ng-content>',
})
export class RecipientInputManagerComponent extends BaseRecipientInputManager implements OnInit {

  public people$: any;
  public searcheUsers$: any;
  constructor(store: Store<any>, authHelper: AuthInfoStateService) {
    super(store, authHelper);
    this.people$ = this.getPeople();
    this.searcheUsers$ = this.getSearchedUsers();
  }

  ngOnInit() {
  }

}
