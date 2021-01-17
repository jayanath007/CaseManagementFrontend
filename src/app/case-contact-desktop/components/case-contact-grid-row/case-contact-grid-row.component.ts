import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-case-contact-grid-row',
  templateUrl: './case-contact-grid-row.component.html',
  styleUrls: ['./case-contact-grid-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseContactGridRowComponent implements OnInit {

  constructor() { }

  @Input() rowData: any;
  @Input() columnDef: ColumnDef[];

  @Output() requestComposeMail = new EventEmitter<string>();
  @Output() openContact = new EventEmitter<string>();
  @Output() selectRow = new EventEmitter<{ rowData: any, dubleClick: boolean }>();

  selectId: number;

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index].extras.fxFlex;
  }

  onProcessEMail(emailAddress: string): void {
    if (emailAddress) {
      this.requestComposeMail.emit(emailAddress);
    }
  }
  onOpenContact(event) {
    this.openContact.emit(event);
  }

  onSelectRow(dubleClick: boolean) {
    this.selectRow.emit({rowData: this.rowData, dubleClick: dubleClick});
  }

}
