import { EChitAuthorisationsState } from './../../../e-chit-authorisations-core/reducers/e-chit-authorisations';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef, PaginatorDef } from './../../../core/lib/grid-model';
import { PageEvent } from '@angular/material';
import { User } from '../../../auth';

@Component({
  selector: 'dps-authorisations-grid',
  templateUrl: './authorisations-grid.component.html',
  styleUrls: ['./authorisations-grid.component.scss']
})
export class AuthorisationsGridComponent implements OnInit {
  @Input() columnDef: ColumnDef;
  @Input() paginatorDef: PaginatorDef;
  @Input() viewData: EChitAuthorisationsState;
  @Input() user: User;

  @Output() changePage = new EventEmitter<PaginatorDef>();
  @Output() columsSortApply = new EventEmitter<ColumnDef>();
  @Output() selectedRowItem = new EventEmitter<any>();
  @Output() checkedChange = new EventEmitter<any>();
  @Output() viewReportData = new EventEmitter<any>();

  fontSizeClass;
  isLoading = false;
  constructor() { }

  ngOnInit() {
  }
  onToggleSorting(def: ColumnDef) {
    // if (def.fieldName !== 'xxxx') {
    this.columsSortApply.emit(def);
    // }
  }
  onChangePage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.changePage.emit(pageDef);
  }
  onSelectedRow(row) {
    this.selectedRowItem.emit(row);
  }
  onCheckedChange(obj) {
    this.checkedChange.emit(obj);
  }
  onViewFile(dataModel) {
    this.viewReportData.emit(dataModel);
  }
}
