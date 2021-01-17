import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GridRowAction } from '../../../global-document-search-core/models/interface';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-global-document-default',
  templateUrl: './global-document-default.component.html',
  styleUrls: ['./global-document-default.component.scss']
})
export class GlobalDocumentDefaultComponent implements OnInit {

  @Output() clickGridRow = new EventEmitter<GridRowAction>();

  @Input() gridData;
  @Input() columnDef: ColumnDef[];

  constructor() { }

  ngOnInit() {
  }

  onClickGridRow(action: GridRowAction) {

    this.clickGridRow.emit(action);

  }


}
