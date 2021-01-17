import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { TableColumn, TableRow } from '../../../shared/models/interface';
import { GrandTotals, WorkTypeData, EstimateValues, ActualValues } from '../../../precedentH-core/models/interfaces';



@Component({
  selector: 'dps-presidenth-summary-grid-data',
  templateUrl: './presidenth-summary-grid-data.component.html',
  styleUrls: ['./presidenth-summary-grid-data.component.scss']
})

export class PresidenthSummaryGridDataComponent implements OnInit {

  @Input() rateTable: any;
  @Input() gridRows: TableRow<any>[] = [];
  @Input() CheckAll: any;
  @Input() grandTotals: GrandTotals;
  @Input() selectedWorkTypeData: WorkTypeData;
  @Input() presidentHSummaryData: TableRow<any>[] = [];
  @Input() rateTableName: string;


  @Output() rowCheckBoxChange = new EventEmitter<{ value: boolean, row: TableRow<any>, columns: TableColumn }>();
  @Output() checkAllClick = new EventEmitter<any>();

  constructor() { }

  matterBalanceGridcolumns: TableColumn[] = [
    { name: 'Work Done / To be Done', propertyName: 'workdone', width: '25%', textAlign: 'left' },
    { name: 'Assumptions', propertyName: 'assumptions', width: '15%', textAlign: 'left' },
    { name: 'Inc. Disburs', propertyName: 'incdisburs', width: '12%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Inc. Time c', propertyName: 'inctimec', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Est. Disbur', propertyName: 'estdisburs', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Est. Time c', propertyName: 'esttimec', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Total (£)', propertyName: 'total', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Record', propertyName: 'record', width: '8%', textAlign: 'right', isCheckBox: true, }
  ];
  allComplete: boolean;
  ngOnInit() {

  }
  getSelectAll() {
    return !!this.allComplete;
  }

  onRowDblClick(event) {

  }

  onChangecheckAll(event) {

    this.checkAllClick.emit(event.checked);
  }

  onRowCheckBoxChange(event) {
    this.allComplete = false;
    this.rowCheckBoxChange.emit(event);

  }


}



