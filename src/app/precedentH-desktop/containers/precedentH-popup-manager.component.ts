import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
    selector: 'dps-precedenth-popup-manager',
    template: `
        <dps-precedenth-content-manager #precedentHManager [precedentHToken]="data.token" [inputData]="data.input"
        (closePopup)="onClose($event)">
        <dps-precedenth-main-layout
         [isLoading]="precedentHManager.isLoading$ | async"
         [precedentHSDataList]="precedentHManager.getPrecedentHSListByToken$ | async"
         [actualAndEstimatedTotal]="precedentHManager.actualAndEstimatedTotal$ | async"
         [eBillingType]="precedentHManager.eBillingType$ | async"
         [saveStatus]="precedentHManager.saveStatus$ | async"
         [isDirty]="precedentHManager.isDirty$ | async"
         [selectedRow]="precedentHManager.selectedRow$  | async"
         [exportXMLSuccessStatus]="precedentHManager.exportXMLSuccessStatus$  | async"
         [workTypeList]="precedentHManager.workTypeList$  | async"
         [estimatedCostGridData]="precedentHManager.estimatedCostGridData$  | async"
         [grandTotals] = "precedentHManager.grandTotals$ | async"
         [selectedWorkTypeData] = "precedentHManager.selectedWorkTypeData$ | async"
         [presidentHSummaryData] =  "precedentHManager.presidentHSummaryData$ | async"
         [selectedEstimateValue] =  "precedentHManager.selectedEstimateValue$ | async"
         [selectedActualValue] =  "precedentHManager.selectedActualValue$ | async"
         [rateTableName] =  "precedentHManager.rateTableName$ | async"
         [totalProfitCost] = "precedentHManager.totalProfitCost$ | async"
         (rowClick)="precedentHManager.onRowClick($event)"
         (inputDataChange)="precedentHManager.inputDatavalueChange($event)"
        (savePrecedentH)="precedentHManager.onSavePrecedentH()"
        (exportXMLOut)="precedentHManager.onExportXMLOut()"
        (popupClose)="precedentHManager.close($event)"
        (changeValue)="precedentHManager.onChangeValue($event)"
        (changeWorkType)="precedentHManager.onChangeWorkType($event)"
        (rowInputChange)="precedentHManager.onRowInputChange($event)"
        (savePrecedentHRates)="precedentHManager.onSavePrecedentHRates($event)"
        (rowCheckBoxChange)="precedentHManager.onRowCheckBoxChange($event)"
        (checkAllClick)="precedentHManager.onCheckAllClick($event)"
        ></dps-precedenth-main-layout>
        </dps-precedenth-content-manager>
    `,
    styles: []
})

export class PrecedentHPopupManagerComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
        public dialogRef: MatDialogRef<PrecedentHPopupManagerComponent>) { }

    ngOnInit() {
    }
    onClose(event) {
        this.dialogRef.close(event);
    }
}
