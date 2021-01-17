import { BillingTimeRecordResponseModel, EditTimeRecordData } from './../../../billing-request-core/models/interfaces';
import { BillingRequestState } from './../../../billing-request-core/reducers/billing-request';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dps-billing-request-edit-time',
  templateUrl: './billing-request-edit-time.component.html',
  styleUrls: ['./billing-request-edit-time.component.scss']
})
export class BillingRequestEditTimeComponent implements OnInit {
  @Input() requestViewData: BillingRequestState;
  @Input() rowData: BillingTimeRecordResponseModel;

  @Output() close = new EventEmitter<any>();
  @Output() timeEntryEditSave = new EventEmitter<any>();

  editRowData: EditTimeRecordData = {
    timUniqueRef: null,
    timDetails: '',
    timNotes: ''
  };
  constructor() { }

  ngOnInit() {
    if (this.rowData) {
      this.editRowData = {
        timUniqueRef: this.rowData ? this.rowData.timUniqueRef : null,
        timDetails: this.rowData ? this.rowData.timDetails : '',
        timNotes: this.rowData ? this.rowData.timNotes : ''
      };
    }
  }
  onControllerFocusOut(key, value) {
    if (key === 'TimeDetails' && value) {
      this.editRowData.timDetails = value;
    } else if (key === 'TimeNotes' && value) {
      this.editRowData.timNotes = value;
    }
  }
  onSave() {
    this.timeEntryEditSave.emit(this.editRowData);
    this.close.emit();
  }
  onClose(event) {
    this.close.emit();
  }
}
