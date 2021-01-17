import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Cds7ReportBaseManager } from '../../cds7-report-info-core/containers/cds7-report-base-manager';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-cds7-report-info-popup-manager',
  template: '<ng-content></ng-content>'
})
export class Cds7ReportInfoPopupManagerComponent extends Cds7ReportBaseManager implements OnInit {

  constructor(protected store: Store<any>) {
    super(store);
  }

  @Input() token: string;
  @Input() input: CrimeClassIdentityViewModel;

  ngOnInit() {
    super.initSelectors(this.token, this.input);
  }

  onChangeModel(event: { key: string, value: any }) {
    this.changeModel(this.token, event);
  }

  onSave(popupDialog: MatDialogRef<any>) {
    this.save(this.token, popupDialog);
  }

}
