import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableColumn, TableRow } from '../../../shared/models/interface';
import { ChangeValueKind } from '../../../precedentH-core/models/enum';
import { EstimateGridData, WorkTypeData, EstimateViewData, ActualViewData, TotalsValues } from '../../../precedentH-core/models/interfaces';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../../shared';

@Component({
  selector: 'dps-presidenth-estimated-grid-data',
  templateUrl: './presidenth-estimated-grid-data.component.html',
  styleUrls: ['./presidenth-estimated-grid-data.component.scss']
})

export class PresidenthEstimatedGridDataComponent implements OnInit {

  @Input() input01: string;
  @Input() input02: string;
  @Input() workType: any;
  @Input() selectedType: any;
  @Input() isDirty: boolean;
  @Input() valtype: any;
  @Input() estimatedCostGridData: TableRow<EstimateGridData[]>;
  @Input() gridRows: TableRow<any>[] = [];
  @Input() selectedWorkTypeData: WorkTypeData;
  @Input() selectedEstimateValue: EstimateViewData;
  @Input() selectedActualValue: ActualViewData;
  @Input() totalProfitCost: TotalsValues;


  @Output() changeValue = new EventEmitter<{ kind: ChangeValueKind, value: number }>();
  @Output() changeWorkType = new EventEmitter<any>();
  @Output() rowInputChange = new EventEmitter<{ value: string, row: TableRow<any>, columns: TableColumn }>();
  @Output() savePrecedentHRates = new EventEmitter<any>();

  constructor(private dialog: MatDialog) { }

  feeEarnerStatusGridcolumns: TableColumn[] = [
    { name: 'Fee earner Status ', propertyName: 'feeEarnerStatus', width: '60%', textAlign: 'left' },
    { name: 'Units', propertyName: 'units', width: '10%', textAlign: 'right', numberFormat: '1.2-2', isInput: true },
    { name: 'Rates', propertyName: 'rate', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Cost', propertyName: 'cost', width: '10%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Inc Cost', propertyName: 'actualCost', width: '10%', textAlign: 'right', numberFormat: '1.2-2' }
  ];
  kind = ChangeValueKind;
  ngOnInit() {
    // this.gridRows.push({ data: { feeearnerstatus: 'Solicitor', units: 10, rates: 110.00, cost: 550.00, inclcost: 15.00 } });
    // this.gridRows.push({ data: { feeearnerstatus: 'Tainee Legal Executive', units: 10, rates: 400.00, cost: 4000.00, inclcost: 0.00 } });
    // this.gridRows.push({ data: { feeearnerstatus: 'Article Clerk', units: 10, rates: 600, cost: 6000.00, inclcost: 0.00 } });
    // this.gridRows.push({ data: { feeearnerstatus: 'Maintanance', units: 10, rates: 200.00, cost: 200.00, inclcost: 0.00 } });
    // this.gridRows.push({ data: { feeearnerstatus: 'Cashier', units: 10, rates: 700.00, cost: 0.00, inclcost: 0.00 } });

    // this.workType = [
    //   { text: 'Pre-action Costs', value: 500 },
    //   { text: 'Issue Statement of case', value: 501 },
    //   { text: 'CMC', value: 502 },
    //   { text: 'Disclosure', value: 503 },
    //   { text: 'Witness Statement', value: 504 },
    //   { text: 'Expert Reports', value: 505 },
    //   { text: 'PTR', value: 506 },
    //   { text: 'Trial Preparation ', value: 507 },
    //   { text: 'Trial', value: 508 },
    //   { text: 'ADR Settlement Discussions ', value: 509 },
    //   { text: 'Contingent Cost A', value: 510 },
    //   { text: 'Contingent Cost B', value: 511 },
    //   { text: 'Contingent Cost C', value: 512 },

    // ];
    this.selectedType = this.selectedWorkTypeData[0];
  }

  onChangeValue(event) {
    this.input02 = event.target.value;
  }
  onRowClick(event) {
  }
  onRowDblClick(event) {
  }
  onChangeWorkType(event) {
    if (this.isDirty) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Confirm . . .',
          message: 'Changes have been made! Do you want to save them?',
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.savePrecedentHRates.emit();
          this.changeWorkType.emit(this.selectedType);
        } else if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
          this.changeWorkType.emit(event);

        }
      });
    } else {
      this.changeWorkType.emit(event);
    }


  }



  onChangeValues(kindValue, changeValue) {

    this.changeValue.emit({ kind: kindValue, value: changeValue });

  }

  onRowInputChange(event: { value: string, row: TableRow<any>, columns: TableColumn }) {

    if (event.columns.name === 'Units') {

      this.rowInputChange.emit(event);

    }

  }
  onchangeClick(event) {
    if (this.isDirty) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Confirm . . .',
          message: 'Changes have been made! Do you want to go back and save them?',
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          // this.savePrecedentHRates.emit();
        } else if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {


        }
      });
    } else {

    }


  }
}

