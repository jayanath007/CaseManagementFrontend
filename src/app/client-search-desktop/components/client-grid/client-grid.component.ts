import { PageEvent } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { ClientGridRowRapper, MatterGridRowRapper, MatterExpandData } from '../../../client-search-core/models/interfaces';
import { ClientSearchKind } from '../../../client-search-core/models/enums';
import { Filter, Condition } from '../../../odata';
import { MainMenuItem } from '../../../layout-desktop';


@Component({
  selector: 'dps-client-grid',
  templateUrl: './client-grid.component.html',
  styleUrls: ['./client-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientGridComponent implements OnInit {

  length = 50;
  pageSize = 50;
  pageSizeOptions = [25, 50, 100];
  pageIndex = 0;

  @Input() ClientData: any;
  @Input() clientColumnDef: ColumnDef;
  @Input() matterColumnDef: ColumnDef;
  @Input() clientPaginatorDef: PaginatorDef;
  @Input() searchText: string;
  @Input() isGridLoading: boolean;
  @Input() totalItems;
  @Input() fontSizeClass;
  @Input() menuItem: MainMenuItem<any>[];
  @Input() isPlotUser: boolean;

  @Output() clientSearchSubmit = new EventEmitter();
  @Output() toggleClientGridExpand = new EventEmitter();
  @Output() toggleMatterGridExpand = new EventEmitter<MatterExpandData>();
  @Output() updateNewMailClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateOpenCaseClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateTimeRecordingClick = new EventEmitter<MatterGridRowRapper>();
  @Output() updateLedgerCardClick = new EventEmitter<MatterGridRowRapper>();
  @Output() openEchitPopup = new EventEmitter<{ matterData: MatterGridRowRapper, clientData: ClientGridRowRapper }>();
  @Output() updateMatterCreationClick = new EventEmitter<MatterGridRowRapper>();
  @Output() matterGridPageChange = new EventEmitter<{ clientRef: string, pageDef: PaginatorDef }>();

  constructor() { }

  ngOnInit() {
  }

  public clientGridRowExpan(row: ClientGridRowRapper, event: MouseEvent): void {
    this.toggleClientGridExpand.emit(row);
  }

  public MatterGridRowExpand(row: MatterExpandData): void {
    this.toggleMatterGridExpand.emit(row);
  }

  public onUpdateOpenCaseClick(selectedMatterData: MatterGridRowRapper) {
    this.updateOpenCaseClick.emit(selectedMatterData);
  }

  public onUpdateTimeRecordingClick(selectedMatterData: MatterGridRowRapper) {
    this.updateTimeRecordingClick.emit(selectedMatterData);
  }

  public onUpdateNewMailClick(selectedMatterData: MatterGridRowRapper) {
    this.updateNewMailClick.emit(selectedMatterData);
  }

  public onUpdateLedgerCardClick(selectedMatterData: MatterGridRowRapper) {
    this.updateLedgerCardClick.emit(selectedMatterData);
  }
  onUpdateMatterCreationClick(selectedMatterData: MatterGridRowRapper) {
    this.updateMatterCreationClick.emit(selectedMatterData);
  }

  onOpenEchitPopup(matterData: MatterGridRowRapper, clienData: ClientGridRowRapper) {
    this.openEchitPopup.emit({ matterData: matterData, clientData: clienData });
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.clientSearchSubmit.emit({ kind: ClientSearchKind.ClientPageChange, value: pageDef });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.clientSearchSubmit.emit({ kind: ClientSearchKind.ApplyClientColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.clientSearchSubmit.emit({ kind: ClientSearchKind.ClearClientColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    if (def.fieldName !== 'MatterCount') {
      this.clientSearchSubmit.emit({ kind: ClientSearchKind.ToggleClientFieldSort, value: def });
    }
  }

  onMatterGridPageChange(data: { clientRef: string, pageDef: PaginatorDef }) {
    this.matterGridPageChange.emit(data);
  }

}
