import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Filter, Condition } from '../../../odata';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { GridData } from '../../../matter-view-by-client-core/models/interface';
import { PageEvent } from '@angular/material';
import { ViewChangeKind } from '../../../matter-view-by-client-core/models/enumeration';


@Component({
  selector: 'dps-matter-view-by-client-layout',
  templateUrl: './matter-view-by-client-layout.component.html',
  styleUrls: ['./matter-view-by-client-layout.component.scss']
})
export class MatterViewByClientLayoutComponent implements OnInit {

  constructor() { }

  @Input() isLoading: boolean;
  @Input() gridColoumn: ColumnDef[];
  @Input() paginatorDef: PaginatorDef;
  @Input() gridData: GridData[];
  @Input() totalItem: number;
  @Input() token: string;
  @Input() matterLabel: string;

  @Output() viewChange = new EventEmitter<any>();
  @Output() selectedRow = new EventEmitter<GridData>();

  pageSizeOptions = [25, 50, 100];

  clickedItem: any;
  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.gridColoumn) { return ''; }
    return this.gridColoumn[index]
      && this.gridColoumn[index].extras ? this.gridColoumn[index].extras.fxFlex : '';
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.viewChange.emit({ kind: ViewChangeKind.PageChange, value: pageDef });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }): void {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.viewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }): void {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.viewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef): void {
    this.viewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  onClose(): void {
    this.selectedRow.emit(null);
  }

  // public onSelectRow(row: GridData): void {
  //   this.selectedRow.emit(row);
  // }

  public popupRowdblclick(row): void {
    this.selectedRow.emit(row);
  }

  public popupRowclick(row: GridData): void {
    this.clickedItem = row;
  }

}

