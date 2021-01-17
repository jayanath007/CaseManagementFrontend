import { TableRow, TableColumn } from './../../../shared/models/interface';
import { emit } from 'cluster';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
// import { MatDialogRef } from '@angular/material';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {
  PrecedentHS, ActualAndEstimatedTotal, DropdownListData, GrandTotals, WorkTypeData,
  EstimateGridData,
  EstimateViewData,
  ActualViewData
} from '../../../precedentH-core/models/interfaces';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind, InforDialogData, InforDialogComponent } from '../../../shared';
import { ChangeValueKind } from '../../../precedentH-core/models/enum';

@Component({
  selector: 'dps-precedenth-main-layout',
  templateUrl: './precedenth-main-layout.component.html',
  styleUrls: ['./precedenth-main-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PrecedenthMainLayoutComponent implements OnInit, OnChanges {
  @Input() isLoading: boolean;
  @Input() precedentHSDataList: PrecedentHS[];
  @Input() eBillingType: string;
  @Input() actualAndEstimatedTotal: ActualAndEstimatedTotal;
  @Input() isDirty: boolean;
  @Input() saveStatus: boolean;
  @Input() selectedRow: PrecedentHS;
  @Input() exportXMLSuccessStatus: string;
  @Input() workTypeList: DropdownListData[];
  @Input() estimatedCostGridData: TableRow<EstimateGridData[]>;
  @Input() grandTotals: GrandTotals;
  @Input() selectedWorkTypeData: WorkTypeData;
  @Input() presidentHSummaryData: TableRow<any>[] = [];
  @Input() selectedEstimateValue: EstimateViewData;
  @Input() selectedActualValue: ActualViewData;
  @Input() rateTableName: string;
  @Input() totalProfitCost: string;


  @Output() rowClick = new EventEmitter();
  @Output() inputDataChange = new EventEmitter();
  @Output() savePrecedentH = new EventEmitter();
  @Output() popupClose = new EventEmitter<any>();
  @Output() exportXMLOut = new EventEmitter<any>();
  @Output() changeValue = new EventEmitter<{ kind: ChangeValueKind, value: number }>();
  @Output() changeWorkType = new EventEmitter<any>();
  @Output() rowInputChange = new EventEmitter<{ value: number, row: TableRow<any>, columns: TableColumn }>();
  @Output() savePrecedentHRates = new EventEmitter<any>();
  @Output() changeAssumptionValue = new EventEmitter<any>();
  @Output() rowCheckBoxChange = new EventEmitter<{ value: boolean, row: TableRow<any>, columns: TableColumn }>();
  @Output() checkAllClick = new EventEmitter<any>();

  constructor(private dialogRef: MatDialogRef<PrecedenthMainLayoutComponent>, private dialog: MatDialog) { }

  kind = ChangeValueKind;
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.exportXMLSuccessStatus && changes.exportXMLSuccessStatus.currentValue === 'Success') {

      const dialogData: InforDialogData = {
        content: {
          title: 'Message',
          message: 'Exported document is successfully added as a file note.'
        },
        contentParams: {},
        data: { messageType: 'alert' }
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });

    }
  }
  onClose() {
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
          // this.savePrecedentH.emit();
          // this.savePrecedentHRates.emit();
        } else if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
          this.popupClose.emit();
        }
      });
    } else {
      this.popupClose.emit();
    }
  }
  onRowClick(item: PrecedentHS, event) {
    this.rowClick.emit(item);
  }
  onExportXML(event) {
    this.exportXMLOut.emit();
  }
  onValueChange(item: PrecedentHS, event) {
    if (event.target.value) {
      this.inputDataChange.emit({ phaseID: item.phaseID, value: event.target.value ? +event.target.value : 0.00 });
    }
  }
  onExeedValueCheck(actualValue, estimatedValue) {
    if (parseFloat(actualValue) > parseFloat(estimatedValue)) {
      return true;
    } else {
      return false;
    }
  }
  onSavePrecedentH() {
    this.savePrecedentH.emit();
  }


  onChangeValues(event) {

    this.changeValue.emit(event);

  }

  onChangeWorkType(event) {

    this.changeWorkType.emit(event);

  }

  onRowInputChange(event: { value: number, row: TableRow<any>, columns: TableColumn }) {

    this.rowInputChange.emit(event);
  }

  onSavePrecedentHRates() {
    this.savePrecedentHRates.emit();

  }

  onChangeAssumptionValue(kindValue, changeValue) {
    this.changeValue.emit({ kind: kindValue, value: changeValue });
  }

  onRowCheckBoxChange(event) {
    this.rowCheckBoxChange.emit(event);

  }

  onCheckAllClick(event) {
    this.checkAllClick.emit(event);

  }
}
