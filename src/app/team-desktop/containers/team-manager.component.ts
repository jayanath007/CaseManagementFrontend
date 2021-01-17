import { Component, OnInit, Input } from '@angular/core';
import { BaseTeamManager } from '../../team-core/containers/base-team-manager';
import { Store } from '@ngrx/store';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { MainMenuService } from '../../layout-desktop';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MatDialog } from '@angular/material';




@Component({
  selector: 'dps-team-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class TeamManagerComponent extends BaseTeamManager implements OnInit {

  @Input() token;
  loginguser;
  user$;

  constructor(store: Store<any>, private pageService: MainMenuService
    , private popupService: SystemJsPopupLoaderService, public dialog: MatDialog) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.token, this.columnDef, this.paginatorDef);
    // this.user$ = this.store.select(getUser);
  }



  onSearchTextcahange(value) {


    this.onUserSearchTextcahange(this.token, value);

  }

  onDepartmentcahange(value) {


    this.onChangeDepartmentValue(this.token, value);

  }

  onChangeViewType(value) {

    this.onChangeViewTypeValue(this.token, value);
  }

  onSelectYearAndMonth(value) {

    this.onSelectYearAndMonthValue(this.token, value);
  }

  onTeamUserChange(value) {

    this.teamUserChange(this.token, value);

  }
  onSelectedDayForDetails(userMovementIds) {

    this.selectDayForDetails(this.token, userMovementIds);

  }




}
