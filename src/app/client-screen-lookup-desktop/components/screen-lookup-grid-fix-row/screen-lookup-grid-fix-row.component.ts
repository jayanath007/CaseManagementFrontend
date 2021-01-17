import { LookupList } from '../../../core/lib/screen-edit';
import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { MatDialog, MatInput } from '@angular/material';
import { UpdateCol } from '../../../client-screen-lookup-core/models/interfaces';

@Component({
  selector: 'dps-screen-lookup-grid-fix-row',
  templateUrl: './screen-lookup-grid-fix-row.component.html',
  styleUrls: ['./screen-lookup-grid-fix-row.component.scss']
})
export class ScreenLookupGridFixRowComponent implements OnInit {
  @Input() isEdit: boolean;
  @Input() columnDef;
  @Input() lookupRowData: LookupList;
  @Output() btnDelete = new EventEmitter<any>();
  @Output() onLookupCodeChange = new EventEmitter<LookupList>();
  @Output() lookupItemChange = new EventEmitter<{ rowId: number, changeValue: any, changeCol: UpdateCol }>();
  // @ViewChild('luP_Code') private luP_Code: ElementRef;
  constructor(private dialog: MatDialog, private element: ElementRef) { }

  ngOnInit() {

  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onBtnDelete(value) {
    this.btnDelete.emit(value);
  }

  lookupCodeChange(selectedItem: LookupList, event) {
    if (selectedItem.luP_Code !== event.target.value) {
      this.lookupItemChange.emit({ rowId: selectedItem.luP_ID, changeValue: event.target.value, changeCol: UpdateCol.DISPLAYNAME });
    }
  }

  descriptionChange(selectedItem: LookupList, event) {
    if (selectedItem.luP_Description !== event.target.value) {

      this.lookupItemChange.emit({ rowId: selectedItem.luP_ID, changeValue: event.target.value, changeCol: UpdateCol.DESCRIPTION });
    }

  }


  onChangeHide(selectedItem: LookupList, event) {
    if (selectedItem.luP_Hidden !== event.checked) {

      this.lookupItemChange.emit({ rowId: selectedItem.luP_ID, changeValue: event.checked, changeCol: UpdateCol.HIDE });


    }
  }


  // onFocusdisplyName(value) {
  // this.luP_Code.nativeElement.focus();

  // }

}
