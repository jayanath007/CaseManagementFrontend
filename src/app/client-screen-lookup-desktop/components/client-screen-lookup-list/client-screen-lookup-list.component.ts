import { UpdateCol } from '../../../client-screen-lookup-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LookupViewModel } from '../../../core';

@Component({
  selector: 'dps-client-screen-lookup-list',
  templateUrl: './client-screen-lookup-list.component.html',
  styleUrls: ['./client-screen-lookup-list.component.scss']
})
export class ClientScreenLookupListComponent implements OnInit {
  @Input() columnDef;
  @Input() loading;
  @Input() screenLookupList: LookupViewModel;

  @Output() onlookupItemChange = new EventEmitter<{ rowId: number, changeValue: any, changeCol: UpdateCol }>();
  @Output() onDeleteScreenLookupClick = new EventEmitter<any>();

  selectedRow: any;

  constructor() { }

  ngOnInit() {

  }

  rowClick(item) {
    this.selectedRow = item;
  }

  onBtnDelete(event) {
    this.onDeleteScreenLookupClick.emit(event);
  }
  onLookupItemChange(event) {


    this.onlookupItemChange.emit(event);
  }
}
