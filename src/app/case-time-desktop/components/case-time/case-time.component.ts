
import { element } from 'protractor';
import { DataSource } from '@angular/cdk/collections';
import { CaseTime, TimeItemWrapper } from '../../../case-time-core/models/interface';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Component, OnInit,
  ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { ViewChangeKind } from '../../../case-time-core/actions/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { Filter, Condition } from '../../../odata';
import { GridButton } from '../../../case-time-core/models/enum';


@Component({
  selector: 'dps-case-time',
  templateUrl: './case-time.component.html',
  styleUrls: ['./case-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseTimeComponent {



  @ViewChild('caseTimeGridContent') caseTimeGridContent;


  @Input() fontSizeClass: string;
  @Input() columnDef: ColumnDef[];
  @Input() caseTimeData;
  @Input() pageInfo;
  @Output() selectRow = new EventEmitter<TimeItemWrapper>();
  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() gridButton = new EventEmitter<{ kind: GridButton, row: TimeItemWrapper }>();
  selectRowItem: any;


  constructor() {

  }




  onSelectRow(item: TimeItemWrapper) {
    this.selectRow.emit(item);
  }

  onPageChange(pageEvent: PageEvent) {
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
      console.log('apply column filter', data);
      this.viewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
    }
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.viewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  onToggleSorting(def: ColumnDef) {
    this.viewChange.emit({ kind: ViewChangeKind.ToggleFieldSort, value: def });
  }

  opened(e) {

  }

  headerFlex(header) {
    if (header.extras.hidden) {
      return 0;
    }
    return header.extras.fxFlex;
  }

  onEditTimeClick(item: TimeItemWrapper) {
    this.gridButton.emit({ kind: GridButton.Edit, row: item });
  }

  onDelteTimeClick(item: TimeItemWrapper) {
    this.gridButton.emit({ kind: GridButton.Delete, row: item });
  }

  get columnDefList() {
    return this.columnDef.filter(val => val.extras.hidden === false);
  }



}









