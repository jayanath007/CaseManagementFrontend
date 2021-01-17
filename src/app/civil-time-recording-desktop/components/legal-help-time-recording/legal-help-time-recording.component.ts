import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { civilTimeTotal, TimeRecordModel, ViewData } from '../../model/interfaces';

@Component({
  selector: 'dps-legal-help-time-recording',
  templateUrl: './legal-help-time-recording.component.html',
  styleUrls: ['./legal-help-time-recording.component.scss']
})
export class LegalHelpTimeRecordingComponent implements OnInit {

  @Input() modelData: TimeRecordModel;
  @Input() viewData: ViewData;
  @Input() homeCurrency: string;
  @Output() changeModel = new EventEmitter<{ key: string, value: any }>();

  constructor() { }

  ngOnInit() {
  }

  onChangeModel(key, value, isNumber?: boolean) {
    if (isNumber ) {
      value = Number(value);
    }
    this.changeModel.emit({ key: key, value: value });
  }

  get totalTimeValue(): number {
    return civilTimeTotal(this.modelData);
  }
  get totalDisbsValue(): number {
    return Number(this.modelData.mileageValue) + Number(this.modelData.faresVatExempt) + Number(this.modelData.faresIcludingVatNet) + Number(this.modelData.parkingFees);
  }

}
