import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { MatFormFieldAppearance, ThemePalette, FloatLabelType, ErrorStateMatcher, MatMenuTrigger } from '@angular/material';
import { FormControl } from '@angular/forms';
import { TableColumn, TableRow } from '../..';

@Component({
  selector: 'dps-select-input-with-table',
  templateUrl: './select-input-with-table.component.html',
  styleUrls: ['./select-input-with-table.component.scss']
})
export class SelectInputWithTableComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() appearance: MatFormFieldAppearance;
  @Input() color: ThemePalette;
  @Input() floatLabel: FloatLabelType;
  @Input() hideRequiredMarker: boolean;
  @Input() hintLabel: string;

  @Input() errorStateMatcher: ErrorStateMatcher;
  @Input() placeholder: string;
  @Input() formControl: FormControl = new FormControl();
  @Input() selectedKeyValue: { key: string | number, value: string | number };
  @Input() readonly: boolean;

  @Input() canEdit: boolean;

  @Input() columns: TableColumn[];
  @Input() rows: TableRow<any>[];
  @Input() panelWidth: string;
  @Input() tableMinWidth: string;
  @Input() sortBy: string;

  @Output() selectionChange =
    new EventEmitter<{ event: MouseEvent | FocusEvent, key: string | number, value: string | number, data: any }>();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild('div') div: ElementRef<HTMLDivElement>;
  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  protected _key: string | number = '';
  public _rows: TableRow<any>[] = [];

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedKeyValue && changes.selectedKeyValue.currentValue) {
      this._key = this.selectedKeyValue.key;
      this.setValue();
    }
  }
  ngAfterViewInit() {
    if (this.selectedKeyValue) {
      this.setValue();
    }
  }
  onArrowClick(event: MouseEvent | FocusEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.readonly && this.columns && this.columns.length > 0) {
      if (this.rows && this.rows.length > 0) {
        if (this._key) {
          // tslint:disable-next-line: triple-equals
          this._rows = this.rows.map(val => ({ ...val, selected: this._key == val.key }));
        } else {
          this._rows = this.rows.map(val => ({ ...val, selected: false }));
        }
      } else {
        this._rows = [];
      }
      this.div.nativeElement.style.width = this.panelWidth || this.input.nativeElement.clientWidth + 24 + 'px';
      this.contextMenu.openMenu();
    }
  }
  onRowClick({ event, row }: { event: MouseEvent, row: TableRow<any> }) {
    this.input.nativeElement.value = (row.value || '').toString();
    this._key = row.key;
    this.selectionChange.emit({ event, key: row.key, value: row.value, data: row.data });
    this.contextMenu.closeMenu();
  }
  onInputBlur(event: FocusEvent) {
    // tslint:disable-next-line: triple-equals
    const row = this._rows.find(val => val.value == this.input.nativeElement.value);
    if (row) {
      this._key = row.key;
    } else {
      this._key = null;
    }
    this.selectionChange.emit({ event, key: this._key, value: this.input.nativeElement.value, data: row ? row.data : null });
  }
  onInputFocus(event: FocusEvent) {
    if (!this.canEdit) {
      this.input.nativeElement.blur();
      this.onArrowClick(event);
    }
  }
  setValue() {
    let value = this.selectedKeyValue.value;
    if (!value && this._key && this.rows && this.rows.length > 0) {
      // tslint:disable-next-line: triple-equals
      const row = this.rows.find(val => val.key == this._key);
      if (row) {
        value = row.value;
      }
    }
    this.input.nativeElement.value = (value || '').toString();
  }

}
