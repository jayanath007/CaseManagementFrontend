import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { TableColumn, TableRow } from '../../models/interface';
import { MatMenu, MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'dps-common-grid-table',
  templateUrl: './common-grid-table.component.html',
  styleUrls: ['./common-grid-table.component.scss']
})
export class CommonGridTableComponent implements OnInit, OnChanges {

  @Input() minWidth: string;
  @Input() columns: TableColumn[];
  @Input() rows: TableRow<any>[];
  @Input() sortBy: string;
  @Input() matMenu: MatMenu;
  @Input() rippleEnabled: boolean;
  @Input() loading = false;

  @Output() rowClick = new EventEmitter<{ event: MouseEvent, row: TableRow<any> }>();
  @Output() rowDblClick = new EventEmitter<{ event: MouseEvent, row: TableRow<any> }>();
  @Output() rowCtrlClick = new EventEmitter<{ event: MouseEvent, row: TableRow<any> }>();
  @Output() rowRightClick = new EventEmitter<{ event: MouseEvent, row: TableRow<any> }>();
  @Output() rowButtonClick = new EventEmitter<{ event: MouseEvent, row: TableRow<any>, columns: TableColumn }>();
  @Output() rowInputChange = new EventEmitter<{ value: string, row: TableRow<any>, columns: TableColumn }>();
  @Output() rowCheckBoxChange = new EventEmitter<{ value: any, row: TableRow<any>, columns: TableColumn }>();

  @ViewChild('span') span: ElementRef<HTMLSpanElement>;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  protected _sortBy = '';
  protected _orderBy = 1;

  public rightClickdRow: TableRow<any>;

  get sortedRows() {
    if (this.columns && this.columns.length > 0 && this.rows && this.rows.length > 0) {
      if (!this._sortBy) {
        return this.rows.concat([]);
      }
      const column = this.columns.find(val => val.propertyName === this._sortBy);
      return this.rows.concat([]).sort((a, b) => {
        const _a = a.data[this._sortBy];
        const _b = b.data[this._sortBy];
        if (column.isDate) {
          if (!(_a && _b)) {
            return _a && !_b ? -1 : (!_a && _b ? 1 : 0);
          }
          return new Date(_a).valueOf() > new Date(_b).valueOf() ? -1 * this._orderBy :
            (new Date(_a).valueOf() < new Date(_b).valueOf() ? this._orderBy : 0);
        }
        return _a > _b ? this._orderBy :
          (_a < _b ? -1 * this._orderBy : 0);
      });

    }
    return [];
  }

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.sortBy && changes.sortBy.currentValue !== changes.sortBy.previousValue) {
      this._sortBy = this.sortBy;
    }
  }
  onClick(event: MouseEvent, row: TableRow<any>) {
    event.preventDefault();
    event.stopPropagation();
    if (event.ctrlKey && this.rowCtrlClick.observers.length > 0) {
      this.rowCtrlClick.emit({ event, row });
    } else {
      this.rowClick.emit({ event, row });
    }
  }
  onDblClick(event: MouseEvent, row: TableRow<any>) {
    this.rowDblClick.emit({ event, row });
  }
  onContextmenu(event: MouseEvent, row: TableRow<any>) {
    this.rightClickdRow = row;
    this.rowRightClick.emit({ event, row });
    if (this.contextMenu) {
      event.preventDefault();
      event.stopPropagation();
      this.span.nativeElement.style.top = event.pageY + 'px';
      this.span.nativeElement.style.left = event.pageX + 'px';
      setTimeout(() => {
        this.contextMenu.openMenu();
      }, 10);
    }
  }
  onChangeSortOrder(propertyName: string, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (propertyName === this._sortBy) {
      this._orderBy = -1 * this._orderBy;
    } else {
      this._sortBy = propertyName;
      this._orderBy = 1;
    }
  }

  // onClickRowIcon(event: MouseEvent, row: TableRow<any>, columns: TableColumn) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   this.rowButtonClick.emit({ event, row, columns });
  // }

  onRowInputChange(value: string, row: TableRow<any>, columns: TableColumn) {
    this.rowInputChange.emit({ value, row, columns });
  }
  onChangeCheckbox(event, e, row: TableRow<any>, columns: TableColumn) {
    event.preventDefault();
    event.stopPropagation();
    e.checked = !e.checked;
    this.rowCheckBoxChange.emit({ value: e.checked, row, columns });

  }
}
