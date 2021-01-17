import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PaginatorDef, ColumnDef } from '../../../core/lib/grid-model';
import { MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material';


@Component({
  selector: 'dps-general-popup-layout',
  templateUrl: './general-popup-layout.component.html',
  styleUrls: ['./general-popup-layout.component.scss']
})
export class GeneralPopupLayoutComponent implements OnInit {
  pageSizeOptions = [25, 50, 100];
  @Input() columnDef: ColumnDef;
  @Input() generalPopupList;
  @Input() paginatorDef: PaginatorDef;
  @Input() searchText: string;
  @Input() isPopup: boolean;
  @Input() totalItems: number;
  @Input() isLoading: boolean;
  @Input() sitePath: string;
  @Input() popupTitle: string;
  @Input() hideSearchBox: boolean;
  @Input() hidePaginator: boolean;
  @Input() isFrontEndFilter: boolean;

  constructor(private dialogRef: MatDialogRef<GeneralPopupLayoutComponent>) { }
  @Output() changePage = new EventEmitter<{ pageDef: PaginatorDef, searchText: string }>();
  @Output() selectedRow = new EventEmitter<any>();
  @Output() updateSearchText = new EventEmitter<string>();
  @Output() toggleShorting = new EventEmitter<ColumnDef>();

  ngOnInit() {
  }

  onClose() {
    this.dialogRef.close();
  }


  get pageEvent(): PageEvent {
    return { pageIndex: this.paginatorDef.currentPage, pageSize: this.paginatorDef.itemPerPage, length: this.totalItems };
  }

  public onChangePage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.changePage.emit({ pageDef: pageDef, searchText: this.searchText });
  }


  public popupRowdblclick(row): void {
    this.selectedRow.emit(row);
  }

  public onSearchTextChanged(value): void {
    if (this.isFrontEndFilter) {
      this.updateSearchText.emit(value);
    }
  }
  public onSearch(value): void {
    this.updateSearchText.emit(value);
  }

  onToggleSorting(def: ColumnDef) {
    this.toggleShorting.emit(def);
  }

}
