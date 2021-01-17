
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { BasePostOfficeManager } from '../../post-office-core/containers/post-office-manager';
import { GridFilterUpdate, GridData, GridButtonAction } from '../../post-office-core/models/interfce';
import { GridGroupData } from '../../core/lib/grid-model';
import { GridButtonType } from '../../post-office-core/models/enumeration';



@Component({
  selector: 'dps-post-office-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class PostOfficeManagerComponent extends BasePostOfficeManager implements OnInit {

  @Input() token;


  constructor(store: Store<any>) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.token, this.columnDef, this.paginatorDef);
  }

  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo(this.token, value);
  }

  onRowSelect(row: GridData) {
    this.expandRow(this.token, row);
  }

  onRefresh() {
    this.gridRefresh(this.token);
  }

  onViewChange(value) {
    this.viewChange(this.token, value);
  }

  onUserEnterPassword(data) {
    this.userEnterPassword(this.token, data);
  }

  removePasswordRequest() {
    this.removeRequestRow(this.token);
  }

  onSelectGroup(data: GridGroupData) {
    this.selectGroup(this.token, data);
  }

  onLoadMoreData(group: GridGroupData) {
    this.loadMoreData(this.token, group);
  }

  onMenuChange(item) {
    this.menuChange(this.token, item);
  }


  onClickGridButton(action: GridButtonAction) {
    switch (action.kind) {
      case GridButtonType.viewDocument: {
        this.viewDocument(this.token, action.value);
        break;

      } case GridButtonType.closeViewer: {
        this.closeViewer(this.token, action.value);
        break;
      }
      default: {
        this.rowChange(this.token, action);
      }
    }
  }

  onGroupChange(value) {
    this.groupChange(this.token, value);
  }

}
