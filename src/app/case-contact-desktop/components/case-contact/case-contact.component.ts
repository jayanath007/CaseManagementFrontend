
import { element } from 'protractor';
import { DataSource } from '@angular/cdk/collections';
import { CaseContact, ContactItemWrapper, ContactMode } from '../../../case-contact-core/models/interface';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  Component, OnInit,
  ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { ViewChangeKind } from '../../../case-contact-core/actions/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { Filter, Condition } from '../../../odata';


@Component({
  selector: 'dps-case-contact',
  templateUrl: './case-contact.component.html',
  styleUrls: ['./case-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseContactComponent implements OnInit, OnChanges {



  @ViewChild('caseContactGridContent') caseContactGridContent;

  @Input() fontSizeClass: string;
  @Input() columnDef;
  @Input() caseContactData;
  @Input() pageInfo;
  @Input() contactMode: any;


  @Output() onExpandSelection = new EventEmitter<ContactItemWrapper>();
  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() requestComposeMail = new EventEmitter<string>();
  @Output() selectRow = new EventEmitter<{ row: CaseContact, isDblClick: boolean }>();
  @Output() selectRowForSearch = new EventEmitter<ContactItemWrapper>();

  selctedIndex: number;


  selectRowItem: any;

  onSelectRow(item) {
    this.selectRowItem = item;
    // this.onExpandSelection.emit(item);
  }

  onExpand(item: ContactItemWrapper, row: number) {
  }

  onPageChange(pageEvent: PageEvent) {
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    if (data.filter.filters[0].value.toString().trim()) {
      const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
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

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {

  }

  onRquestComposeMail(emailAddress: string): void {
    this.requestComposeMail.emit(emailAddress);
  }

  onOpenContact(row) {
    this.selectRow.emit({ row: row.data, isDblClick: true });
  }

  onSelectRowForSearch(event: { rowData: ContactItemWrapper, dubleClick: boolean }, index: number) {
    if (event.dubleClick) {
      this.selectRowForSearch.emit(event.rowData);
    }
    this.selctedIndex = index;
  }


  get getCaseContactData() {
    if (this.caseContactData && this.caseContactData.data && this.caseContactData.data.length > 0) {
      if (this.contactMode === ContactMode.View) {

        return this.caseContactData.data.filter((row) => {
          return !(row.data.isScreenContact === true);
        });

      } else {
        return this.caseContactData.data;
      }

    } else {
      return [];
    }

  }



}









