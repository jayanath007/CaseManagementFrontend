import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { OpportunityLoadingType, StatusList, GridDataResponceViewModel } from './../../../opportunity-core/models/interfaces';
import { PageEvent } from '@angular/material';
import { Filter, Condition } from './../../../odata/interfaces';

@Component({
  selector: 'dps-saved-opportunities',
  templateUrl: './saved-opportunities.component.html',
  styleUrls: ['./saved-opportunities.component.scss']
})
export class SavedOpportunitiesComponent {

  @Input() isLoading: OpportunityLoadingType;
  @Input() rowData: any[];
  @Input() columnDef: ColumnDef[];
  @Input() loadSaveOpportunityData: GridDataResponceViewModel;
  @Input() selectedStatus: StatusList;
  @Input() paginetorDef: PaginatorDef;
  @Input() fontSizeClass: string;

  @Output() openOpprtunity = new EventEmitter<number>();
  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() columsSortApply = new EventEmitter<ColumnDef>();
  @Output() selectedRowItem = new EventEmitter<any>();
  @Output() clickOnNotificationSetting = new EventEmitter<any>();
  @Output() changeColumFilteration = new EventEmitter<{ kind: string, columnDef: ColumnDef }>();
  constructor() { }

  onOpenOpprtunity(item) {
    this.openOpprtunity.emit(item);
  }
  onChangePage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.changePage.emit(pageDef);
  }
  onToggleSorting(def: ColumnDef) {
    if (def.fieldName !== 'OpportunityNumber') {
      this.columsSortApply.emit(def);
    }
  }
  onRowSelect(row) {
    this.selectedRowItem.emit(row);
  }
  onClickNotificationSetting(row) {
    this.clickOnNotificationSetting.emit(row);
  }
  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      this.changeColumFilteration.emit({ kind: 'ApplyColumnFilter', columnDef: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.changeColumFilteration.emit({ kind: 'ClearColumnFilter', columnDef: filterDef });
  }
}
