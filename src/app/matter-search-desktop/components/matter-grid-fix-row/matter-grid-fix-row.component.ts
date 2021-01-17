import { Component, OnInit, Input, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { ColumnDef } from '../../../core/lib/grid-model';


@Component({
  selector: 'dps-matter-grid-fix-row',
  templateUrl: './matter-grid-fix-row.component.html',
  styleUrls: ['./matter-grid-fix-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterGridFixRowComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() matterRowData: any;
  @Input() columnDef: ColumnDef[];
  @Input() activeView;
  @Input() searchText: string;
  @Input() isPopup: boolean;
  @Input() isPlotUser: boolean;
  @Input() plotVarValues: string[];

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    // alert('fffffff');
  }
  getRowDatata() {
    console.log('dbClick', this.matterRowData);
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }
}
