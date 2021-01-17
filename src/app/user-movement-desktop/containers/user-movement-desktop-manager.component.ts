import { BaseUserMovementManager } from '../../user-movement-core/containers/base-user-movement-manager';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dps-user-movement-desktop-manager',
  template: '<ng-content></ng-content>',
})
export class UserMovementDesktopManagerComponent extends BaseUserMovementManager implements OnInit, OnChanges {
  @Input() myToken;

  constructor(store: Store<any>) {
    super(store);
  }

  ngOnInit() {

    super.initSelectors(this.myToken);

  }
  ngOnChanges(changes: SimpleChanges) {

  }


  onSelectUserInMovements(user) {

    this.selectUserInMovements(this.myToken, user);

  }

  onChangeUserDepartment(department) {
    this.changeUserDepartment(this.myToken, department);
  }
  onUserSerchtextChange(searchText) {
    this.userSerchtextChange(this.myToken, searchText);
  }


  onChangeUserLocation(location) {
    this.changeUserLocation(this.myToken, location);

  }

  onChangeIsAllDayEvent(value) {
    this.changeIsAllDayEvent(this.myToken, value);
  }
}

