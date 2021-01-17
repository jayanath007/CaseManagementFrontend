import {
  ItemSelectionViewModel, ContactScreenItem, ContactScreenItemWrapper,
  ContactFieldDef
} from '../../../screen-contact-core/models/interface';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-screen-contact-grid-row',
  templateUrl: './screen-contact-grid-row.component.html',
  styleUrls: ['./screen-contact-grid-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenContactGridRowComponent implements OnInit {

  constructor() { }

  @Input() rowData: ContactScreenItemWrapper;
  @Input() isFileSearch: boolean;
  @Input() columnDef: ContactFieldDef[];
  @Input() isMuiltiClientScreen: boolean;
  // @Output() onRemoveFromFile: EventEmitter<ContactScreenItemWrapper> = new EventEmitter();

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index].extras.fxFlex;
  }

  calculateFxLayout() {
    let columnCount = this.columnDef.length;
    if (this.isFileSearch) { columnCount += 1; } // Add remove button column if searchType is 'FileSearch'
    const val = 100 / columnCount;
    return `${val}%`;
  }

  calculateLayoutWidth() {
    let columnCount = this.columnDef.length;
    const val = 125 * columnCount;
    return `${val}px`;
  }

  getValueForColumn(contactField: string, contactIem: ContactScreenItemWrapper) {
    let columns: string[];
    if (!contactField.includes(',')) {
      columns = [contactField];
    } else {
      columns = contactField.split(',');
    }

    let columnValue = '';
    for (const columnName of columns) {
      const str = this.getValueIgnoreCase(contactIem, columnName);
      if (str) {
        columnValue += str + ' ';
      }
    }
    return columnValue;
  }

  // removeFromFile($event, contact) {
  //   this.onRemoveFromFile.emit(contact);
  // }

  getValueIgnoreCase(obj: any, key: string) {
    const alllKeys = Object.keys(obj);
    for (const key1 of alllKeys) {
      if (key === 'isLeadClient' && key1 === 'isLeadClient' ) {
        return !!obj[key1] ? 'Lead' : '';
      } else if (key1.trim().toUpperCase() === key.trim().toUpperCase()) {
        return obj[key1];
      }
    }
    return null;
  }
}
