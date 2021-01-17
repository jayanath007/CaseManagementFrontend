
import { AdvancedSearchViewModel } from './../../../advanced-search-core/models/requests';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ViewChangeKind, SearchColumnOption } from './../../../advanced-search-core/models/enums';
import { PaginatorDef, ColumnDef } from '../../../core/lib/grid-model';


@Component({
  selector: 'dps-advanced-search-grid',
  templateUrl: './advanced-search-grid.component.html',
  styleUrls: ['./advanced-search-grid.component.scss']
})
export class AdvancedSearchGridComponent implements OnInit {
  @Input() columnDef;
  @Input() gridDataList;
  @Input() coloumnArray;
  @Input() isLoading: boolean;
  @Input() totalItem: number;
  @Input() pageSizeOptions: any;
  @Input() paginatorDef: any;
  @Input() advancedSearchViewMode: AdvancedSearchViewModel;

  @Output() coloumnHeaderRightClick = new EventEmitter<any>();
  @Output() openCaseClick = new EventEmitter<any>();
  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();




  constructor() { }

  ngOnInit() {
  }


  onPageChange(event) {
    const pageDef: PaginatorDef = { currentPage: event.pageIndex, itemPerPage: event.pageSize };
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageDef });

  }
  setColColor(columnVal) {
    let style: string;
    if (this.advancedSearchViewMode.searchFields) {

      this.advancedSearchViewMode.searchFields.forEach((value) => {
        if (value === columnVal) {
          if (this.advancedSearchViewMode && this.advancedSearchViewMode.searchColumnOption === SearchColumnOption.Speed) {
             style = 'dps-columns-highlight';

          } else {



            style = 'dps-columns-spc';
          }


        }
      });
      return style;

    }

  }

  onColoumnRightClick(event, header) {
    event.preventDefault();

    this.coloumnHeaderRightClick.emit(header.fieldName);

  }

  onOpenCaseClick(event) {

    this.openCaseClick.emit(event);
  }

  onToggleSorting(def: ColumnDef) {

    this.viewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });

  }




}
