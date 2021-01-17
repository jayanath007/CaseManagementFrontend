import { BaseProbateManager } from './../../../probate-core/containers/base-probate-manager.component';
import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-probate-manager',
  template: `<ng-content></ng-content>`,
})
export class ProbateManagerComponent extends BaseProbateManager implements OnInit {

  @Input() token;
  @Input() inputData;
  constructor(store: Store<any>, private matDialog: MatDialog) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.token, this.inputData);
  }
  onRnrbDataUpdate(event) {
    this.rnrbDataUpdate(this.token, event);

  }

  onSubmitSaveData(event) {
    this.submitSaveData(this.token, event);

  }

  onEdittransactionClick(event) {
    this.edittransactionClick(this.token, event);
  }

  onEditDistributionClick(event) {
    this.editDistributionClick(this.token, event);
  }

  onspouseCivilUpdate(event) {
    this.spouseCivilUpdate(this.token, event);
  }

  onSelectedRowClick(event) {
    this.selectedRowClick(this.token, event);

  }

  onDeleteRow(event) {
    this.deleteRow(this.token, event);
  }
  onDeleteProbateRow(event) {
    this.deleteProbateRow(this.token, event);
  }
  onClear() {
    this.clear(this.token);
  }

  onGenerateForm(event) {
    this.generateForm(this.token, event);
  }

  onGenerateAccounts(event) {
    this.generateAccounts(this.token, event);

  }

  onOpenIntForm(event) {
    this.openIntForm(this.token, event);
  }


}
