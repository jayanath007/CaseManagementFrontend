import { FeeEarner } from '../../../add-note-core/models/interfaces';
import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-add-note-for-user',
  templateUrl: './add-note-for-user.component.html',
  styleUrls: ['./add-note-for-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNoteForUserComponent {
  @Input() feeEarnerList: FeeEarner[];
  @Input() placeholder: string;
  @Input() disabled: boolean;
  @Output() updatedFeeErner = new EventEmitter<string>();
  constructor() { }

  get selectedFeeEarner() {
    if (this.feeEarnerList) {
      return this.feeEarnerList.find((feeEarner) => feeEarner.selected);
    }
    return this.feeEarnerList;
  }


  onChangeFeeEarner(value: FeeEarner) {
    this.updatedFeeErner.emit(value.groupName);
  }
}
