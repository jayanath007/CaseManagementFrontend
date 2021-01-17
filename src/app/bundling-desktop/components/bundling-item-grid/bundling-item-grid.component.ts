
import { debounceTime } from 'rxjs/operators';
import { FileHistoryGroupDataResponse, BundlingDates } from './../../../bundling-core/models/interface';

import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GridGroupData, ColumnDef } from '../../../core/lib/grid-model';
import { FileHistory } from '../../../file-history-core/models/interface';
import { ViewChangeKind, BundleTreeItem } from '../../../bundling-core/models/interface';
import { MatterSearchGridData } from '../../../core/lib/matter';
import { ViewKind } from '../../../bundling-core/models/enum';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { dpsNewDate } from '../../../utils/javascriptDate';

@Component({
  selector: 'dps-bundling-item-grid',
  templateUrl: './bundling-item-grid.component.html',
  styleUrls: ['./bundling-item-grid.component.scss']
})
export class BundlingItemGridComponent implements OnInit {

  @Input() columnDef: ColumnDef[];
  @Input() groupData: any;
  @Input() bundledFolderGroup: any;
  @Input() gridData: any;
  @Input() bundlingItemList: BundleTreeItem[];
  @Input() loading: boolean;
  @Input() selectGroupHash: string[];
  @Input() selectGroup: GridGroupData;
  @Input() selectedGridItems: FileHistory[];
  @Input() matterInfo: MatterSearchGridData;
  @Input() searchText: string;
  @Input() timeOffset: number;


  @Output() toggleExpand = new EventEmitter();
  @Output() dropData = new EventEmitter<{
    dragData: FileHistory[],
    dragDataType: string, bundleTreeItem: BundleTreeItem, itemType: string
  }>();
  @Output() dragEnter = new EventEmitter<{ dragData: FileHistory[], dragDataType: string, bundleTreeItem: BundleTreeItem }>();
  @Output() folderRowChange = new EventEmitter<GridGroupData>();
  @Output() changeSelectGroup = new EventEmitter<GridGroupData>();
  @Output() menuChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() rowExpand = new EventEmitter<{ item: BundleTreeItem, isExpand: boolean }>();
  @Output() openDocument = new EventEmitter<FileHistory>();
  @Output() selectRow = new EventEmitter<{ item: FileHistory, isMuilti: boolean }>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();
  @Output() historyGridFilterChange = new EventEmitter<{ kind: ViewKind, value: BundlingDates }>();

  isRowEditCompleted = true;
  fromDate = '01/01/1900';
  toDate: Date;
  inputCtrl = new FormControl();

  constructor(private datePipe: DatePipe) { }
  ngOnInit() {
    this.toDate = dpsNewDate(this.timeOffset);
    this.inputCtrl.valueChanges.pipe(
      debounceTime(500))
      .subscribe((value: string) => {
        if (value.length <= 0) {
          this.OnSearchTextChanged(value);
        }
      });
  }
  dateChange() {
  }
  public dpsTreeNodeExpandClick(event, selectedNode) {
    if (!this.isRowEditCompleted) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    //  this.itemChange.emit({ kind: ItemChangeKind.RowNodeExpand, value: selectedNode });
  }
  get getVisibleColumnDef() {
    return this.columnDef ? this.columnDef.filter(c => c.fieldName !== 'folderName') : [];
  }
  toggle(event) {
    event.preventDefault();
    this.toggleExpand.emit(this);
  }
  onDragStart(event) {
  }
  select(event) {
  }
  descriptionChange(folder, event) {
  }
  onEnter() {
  }
  onFolderRowChange(event: GridGroupData) {
    this.folderRowChange.emit(event);
  }

  onSelectGroup(data: GridGroupData) {
    this.changeSelectGroup.emit(data);
  }
  onHeading(event) {
    this.menuChange.emit({ kind: ViewChangeKind.Heading, value: event });
  }
  gridRowExpan(row) {
    this.rowExpand.emit(row);
  }
  onOpenDocument(item) {
    this.openDocument.emit(item);
  }
  onSelectRow(event: { item: FileHistory, isMuilti: boolean }) {
    this.selectRow.emit(event);
  }
  onKeydownSearchText(event: any) {
    if (event.keyCode === 13) {
      this.historyGridFilterChange.emit({
        kind: ViewKind.searchText, value: {
          fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
          toDate: this.datePipe.transform(this.toDate.toString(), 'yyyy-MM-dd'),
          searchTest: event.currentTarget.value,
          refresh: null,
        }
      });
    }
  }
  OnSearchTextChanged(value) {
    this.historyGridFilterChange.emit({
      kind: ViewKind.searchText, value: {
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate.toString(), 'yyyy-MM-dd'),
        searchTest: value,
        refresh: null
      }
    });
  }
  onRefresh(event) {
    this.fromDate = '01/01/1900';
    this.toDate = dpsNewDate(this.timeOffset);
    this.historyGridFilterChange.emit({
      kind: ViewKind.clearFilter, value: {
        fromDate: this.datePipe.transform('01/01/1900', 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(dpsNewDate(this.timeOffset).toString(), 'yyyy-MM-dd'),
        searchTest: '',
        refresh: 'refresh'
      }
    });
  }
  onChangeFromDate(event) {
    this.fromDate = event.value;
    this.historyGridFilterChange.emit({
      kind: ViewKind.periodColumnFilter, value: {
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: this.datePipe.transform(this.toDate.toString(), 'yyyy-MM-dd'),
        searchTest: '',
        refresh: null
      }
    });
  }
  onChangeToDate(event) {
    this.toDate = event.value;
    this.historyGridFilterChange.emit({
      kind: ViewKind.periodColumnFilter, value: {
        fromDate: this.datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        toDate: event.value, // this.datePipe.transform(this.toDate.toDpsString(), 'yyyy-MM-dd'),
        searchTest: '',
        refresh: 'refresh'
      }
    });
  }
  loadMore(data: GridGroupData) {
    this.loadMoreData.emit(data);
  }

}
