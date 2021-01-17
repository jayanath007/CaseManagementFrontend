import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'dps-grid-container',
  templateUrl: './grid-container.component.html',
  styleUrls: ['./grid-container.component.scss']
})
export class GridContainerComponent implements OnInit {


  @Input() pageEvent: PageEvent;
  @Input() gridColoumn: ColumnDef[];
  @Input() filterAnchor;
  @Input() isGridLoding;

  @Output() filterApply = new EventEmitter();
  @Output() filterClear = new EventEmitter();
  @Output() toggleSorting = new EventEmitter<ColumnDef>();
  @Output() page = new EventEmitter<PageEvent>();
  gridContentFxFlex = 'calc(100% - 85px)';

  constructor() { }

  ngOnInit() {
    if (!this.pageEvent) {
      this.gridContentFxFlex = 'calc(100% - 35px)';
    }


  }


  onFilterApply(e) {
    this.filterApply.emit(e);
  }

  onFilterClear(e) {
    this.filterClear.emit(e);
  }

  onToggleSorting(def: ColumnDef) {
    this.toggleSorting.emit(def);
  }

  onPageEvent(e) {
    this.page.emit(e);
  }
  onSearchTextChanged() {


  }

}
