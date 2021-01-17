import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { MatDialog } from '@angular/material';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  GridRowAction, GridRowType, FilterViewModel, UpdateCol,
  DropdownListData
} from '../../../global-document-search-core/models/interface';
import { FileItemWrapper } from '../../../file-history-core/models/interface';

@Component({
  selector: 'dps-global-document-search-layout',
  templateUrl: './global-document-search-layout.component.html',
  styleUrls: ['./global-document-search-layout.component.scss']
})
export class GlobalDocumentSearchLayoutComponent implements OnInit {

  constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }



  @Input() isLoading: boolean;
  @Input() gridData: any;
  @Input() totalItem: number;
  @Input() columnDef: ColumnDef[];
  @Input() filterViewModel: FilterViewModel;
  @Input() feeEarnerList: DropdownListData[];
  @Input() appCodeList: DropdownListData[];
  @Input() documentViewOpened: boolean;
  @Input() filterExpanded: boolean;
  @Input() paginatorDef: boolean;


  @Output() clickGridRow = new EventEmitter<any>();
  @Output() filterItemChange = new EventEmitter<{ filterId: number, changeValue: any, changeCol: UpdateCol }>();
  @Output() removeFilterRow = new EventEmitter<any>();
  @Output() searchDoc = new EventEmitter<any>();
  @Output() addFilterRow = new EventEmitter<any>();
  @Output() changeSearchText = new EventEmitter<any>();
  @Output() closeViewer = new EventEmitter();
  @Output() viewChange = new EventEmitter<any>();
  @Output() documentClear = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Output() openInPopup = new EventEmitter<any>();
  @Output() openCaseClick = new EventEmitter<any>();
  @Output() share = new EventEmitter<FileItemWrapper>();
  fontSizeClass: string;



  isMemberNavExpan = false;

  ngOnInit() {
  }


  onChangeSearchText(event) {

    this.changeSearchText.emit(event);

  }

  public onClickGridRow(action) {
    this.clickGridRow.emit(action);
  }


  onDocumentSearch() {
    if (this.filterViewModel.searchText !== '') {
      this.searchDoc.emit(this.filterViewModel);

    }
  }

  onAddFilterRow() {
    this.addFilterRow.emit();

  }

  onfilterItemChange(event) {
    this.filterItemChange.emit(event);

  }
  onCloseViewer() {
    this.closeViewer.emit();
  }

  onRemoveFilterRow(event) {

    this.removeFilterRow.emit(event);
  }

  onSearchDoc() {
    this.searchDoc.emit(this.filterViewModel);

  }

  onDocumentClear(event) {

    this.documentClear.emit(event);
  }

  onSearchClear() {
    this.documentClear.emit();
  }

  onViewChange(event) {

    this.viewChange.emit(event);
  }


  onRefresh() {
    if (this.filterViewModel.searchText !== '') {
      this.refresh.emit();
    }
  }

  onFontSizeClassChange(value) {
    this.fontSizeClass = value;
  }

  onOpenInPopup() {

    this.openInPopup.emit();


  }

  onOpenCaseClick(item) {

    this.openCaseClick.emit(item);

  }

  onShare(item) {
    this.share.emit(item);

  }

  get calculateHeight(): string {
    return 'calc(100%-220px)';
  }


}
