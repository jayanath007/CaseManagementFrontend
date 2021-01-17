import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CivilClassObj } from '../../../civil-class-management';
import { PaginatorDef } from '../../../core/lib/grid-model';
import { TableColumn, TableRow } from '../../../shared';
import { FeeEarnerInfo } from '../../../shared-data';
import { TimeRecord, TimeRecordModel, ViewData } from '../../model/interfaces';

@Component({
  selector: 'dps-time-recorded-tab-content',
  templateUrl: './time-recorded-tab-content.component.html',
  styleUrls: ['./time-recorded-tab-content.component.scss']
})
export class TimeRecordedTabContentComponent implements OnInit, OnChanges {

  @Input() feeEarnerList: FeeEarnerInfo[];
  @Input() viewData: ViewData;
  @Input() modelData: TimeRecordModel;
  @Input() classData: CivilClassObj;
  @Input() isLoading: boolean;
  @Input() homeCurrency: string;
  @Output() selectItemForEdit = new EventEmitter<number>();
  @Output() changeModel = new EventEmitter<{ key: string, value: any }>();
  @Output() userAction = new EventEmitter<string>();
  @Output() changePage = new EventEmitter<PaginatorDef>();

  gridRows: TableRow<TimeRecord>[] = [];

  timeGridcolumns: TableColumn[] = [
    { name: 'Fee Earner', propertyName: 'feeEarner', width: '10%' },
    { name: 'Date Done', propertyName: 'dateDone', width: '10%', isDate: true, dateFormat: 'dd/MM/yyyy' },
    { name: 'Note', propertyName: 'note', width: '45%' },
    { name: 'LA Fund Level', propertyName: 'fundLevelDiscription', width: '20%' },
    { name: 'Value', propertyName: 'totalValue', width: '15%' },
  ];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.viewData && !changes.viewData.isFirstChange())) {
      this.setTableRow();
    }
  }

  setTableRow() {
    const rows: TableRow<TimeRecord>[] = [];
    if (this.viewData && this.viewData.civilTimeRecordData && this.viewData.civilTimeRecordData.timeRecords.length > 0) {
      this.viewData.civilTimeRecordData.timeRecords.forEach((r, i) => {
        const isSelected = this.modelData && this.modelData.diaryId === r.diaryId;
        rows.push({
          data: r,
          selected: isSelected,
          index: i
        });
      });
    }
    this.gridRows = rows;
  }

  selectTimeRecord(data: { event: MouseEvent, row: TableRow<TimeRecord> }) {
    this.selectItemForEdit.emit(data.row.data.diaryId);
    this.setTableRow();
  }

  onChangeModel(key, value) {
    this.changeModel.emit({ key: key, value: value });
  }

  onUserAction(action: string) {
    this.userAction.emit(action);
  }

  onPageChange(event) {
    const pageDef: PaginatorDef = { currentPage: event.pageIndex, itemPerPage: event.pageSize };
    this.changePage.emit(pageDef);
  }

}
