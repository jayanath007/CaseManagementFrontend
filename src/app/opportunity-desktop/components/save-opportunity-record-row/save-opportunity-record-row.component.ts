import { Component, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { StatusList } from './../../../opportunity-core/models/interfaces';
import { OpportunityType } from '../../../opportunity-core/models/enums';

@Component({
  selector: 'dps-save-opportunity-record-row',
  templateUrl: './save-opportunity-record-row.component.html',
  styleUrls: ['./save-opportunity-record-row.component.scss']
})
export class SaveOpportunityRecordRowComponent implements OnInit, OnChanges {

  @Input() columnDef: ColumnDef[];
  @Input() rowData: any[];
  @Input() loadSaveOpportunityData: any;
  @Input() selectedStatus: StatusList;
  @Input() isLoading: boolean;

  @Output() openOpprtunity = new EventEmitter<any>();
  @Output() selectedRowItem = new EventEmitter<any>();
  @Output() clickOnNotificationSetting = new EventEmitter<any>();

  currentCell = 0;
  constructor() { }
  type = OpportunityType;

  // get getRowData(): any[] {
  // return this.rowData.filter(r => !r.isRoot && !r.isFolder && !r.isCoverPage);
  // }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columnDef && !changes.columnDef.isFirstChange()) {
      this.currentCell = 0;
    }
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onOpprtunityRowDBClick(item) {
    this.openOpprtunity.emit(item);
    this.selectedRowItem.emit(item);
  }
  onRowSelect(row) {
    this.selectedRowItem.emit(row);
  }
  onClickNotificationSetting(row) {
    this.clickOnNotificationSetting.emit(row);
  }
}
