import { Component, OnInit, Input } from '@angular/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-lookup-screen-grid-row',
  templateUrl: './lookup-screen-grid-row.component.html',
  styleUrls: ['./lookup-screen-grid-row.component.scss']
})
export class LookupScreenGridRowComponent implements OnInit {
  // columnDef: any;
  @Input() lookupDataModel;
  @Input() columnDef;
  // @Input() lookupDataModel;
  constructor() { }

  ngOnInit() {
  }
  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }
}
