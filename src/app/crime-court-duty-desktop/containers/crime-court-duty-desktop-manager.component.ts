import { Component, OnInit, Input } from '@angular/core';
import { BaseCcDutyManager } from '../../crime-court-duty-core/containers/base-cc-duty-manager';
import { Store } from '@ngrx/store';
import { CourtDutyTimeRecord } from '../../crime-court-duty-core/model/interface';
import { PaginatorDef } from './../../core/lib/grid-model';
import { MatterKeyInfor } from '../../core/lib/matter';

@Component({
  selector: 'dps-crime-court-duty-desktop-manager',
  template: `<ng-content></ng-content>`,

})
export class CrimeCourtDutyDesktopManagerComponent extends BaseCcDutyManager implements OnInit {

  constructor(store: Store<any>) {
    super(store);
  }
  @Input() inputData: MatterKeyInfor;
  @Input() token: string;

  ngOnInit() {
    super.init(this.token, this.inputData);
  }

  changeModel(event: { key: string, value: any }) {
    this.onChangeModel(this.token, event);
  }

  onUserAction(userAction: string) {
    this.userAction(this.token, userAction);
  }

  onSelectItemForEdit(model: CourtDutyTimeRecord) {
    this.selectItemForEdit(this.token, model);
  }

  onChangePage(def: PaginatorDef) {
    this.changePage(this.token, def);
  }

  onChangeGridFilter(filter: { key: string, value: any }) {
    this.changeGridFilter(this.token, filter);
  }
  onClosePopup() {
    this.close(this.token);
  }
}

