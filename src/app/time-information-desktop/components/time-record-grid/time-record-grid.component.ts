import { TimeInformationModel } from './../../../time-information-core/models/interfaces';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-time-record-grid',
  templateUrl: './time-record-grid.component.html',
  styleUrls: ['./time-record-grid.component.scss']
})
export class TimeRecordGridComponent {

  @Input() gridColumnDef: ColumnDef[];
  @Input() timeRecordsGridData: TimeInformationModel[];
  @Input() allData: boolean;
  @Input() selectedType: number;
  @Input() isloading: boolean;
  @Output() selectGridItem = new EventEmitter<TimeInformationModel>();

  constructor() { }

  onSelectGridItem(item: TimeInformationModel) {
    this.selectGridItem.emit(item);
  }

  get getGridColumnDef(): ColumnDef[] {
    if (!this.allData) {
      return this.gridColumnDef.filter(c => c.fieldName !== 'AttendanceType');
    } else {
      return this.gridColumnDef;
    }
  }

  get getTimeRecordsGridData(): TimeInformationModel[] {
    if (!this.allData && this.timeRecordsGridData && this.timeRecordsGridData.length > 0) {
      return this.timeRecordsGridData.filter(r => r.attTypeId === this.selectedType);
    } else {
      return this.timeRecordsGridData;
    }
  }

}
