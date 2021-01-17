import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TimeInformationModel } from '../../../time-information-core/models/interfaces';
import { ColumnDef } from '../../../core/lib/grid-model';
import { TimeDTO } from '../../../time-information-core/class/core/TimeDTO';
import { CrimeDefs } from '../../../time-information-core/class/CrimeDefs';
import { DateTimeUtil } from '../../../time-information-core/class/util/DateTimeUtil';


@Component({
  selector: 'dps-time-record-grid-item',
  templateUrl: './time-record-grid-item.component.html',
  styleUrls: ['./time-record-grid-item.component.scss']
})
export class TimeRecordGridItemComponent implements OnInit {

  constructor() { }
  @Input() rows: TimeInformationModel[];
  @Input() gridColumnDef: ColumnDef[];
  @Input() allData: boolean;
  @Output() selectItem = new EventEmitter<TimeInformationModel>();

  selectedIndex: number;

  ngOnInit() {



  }

  getFxFlexProperty(index) {
    if (!this.gridColumnDef) { return ''; }
    return this.gridColumnDef[index]
      && this.gridColumnDef[index].extras ? this.gridColumnDef[index].extras.fxFlex : '';
  }

  onRowDblClick(item: TimeInformationModel, index: number) {
    this.selectItem.emit(item);
    this.selectedIndex = index;
  }


  travellingTimeSum(item: TimeInformationModel) {
    if (item.classId === CrimeDefs.INVESTIGATIONCLASSID && item.attTypeId === 2) {
      const to = item.travelTo, from = item.travelFrom;
      if (!to || !from) {
        return;
      }
      const toTime = new TimeDTO(parseInt(to.split(':')[0], 10), parseInt(to.split(':')[1], 10));
      const fromTime = new TimeDTO(parseInt(from.split(':')[0], 10), parseInt(from.split(':')[1], 10));

      const news = toTime.add(fromTime);
      return `${news.hrs < 10 ? '0' + news.hrs : news.hrs}:${news.min < 10 ? '0' + news.min : news.min}`;
    } else {

      return item.travel;
    }
  }

  travellingValueSum(item: TimeInformationModel) {
    if (item.classId === CrimeDefs.INVESTIGATIONCLASSID && item.attTypeId === 2) {
      const to = item.travToVal, from = item.travFromVal;
      if (!to || !from) {
        return;
      }
      const toValue = parseFloat(to);
      const fromValue = parseFloat(from);
      return toValue + fromValue;
    } else {

      return item.travelVal;

    }
  }

  disbursementTotal(item: TimeInformationModel) {

    const disbursements =
      parseFloat(item.mileageVal) +
      parseFloat(item.vatFaresVal) +
      parseFloat(item.nonVatFaresVal) +
      parseFloat(item.parkingVal);

    return disbursements;
  }

  prepTimeSum(item: TimeInformationModel) {
    if (item.classId === CrimeDefs.PROCLASSID) {
      return DateTimeUtil.addHHMMStringArr([item.prep, item.attendance]).timeString();
    } else {
      return item.prep;
    }
  }

  prepValueSum(item: TimeInformationModel) {
    if (item.classId === CrimeDefs.PROCLASSID) {
      return (parseFloat(item.prepVal) + parseFloat(item.attendanceVal)).toString();
    } else {
      return item.prepVal;
    }
  }


}
