import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatDialog } from '@angular/material';
import { CrimeManagementInput } from '../../core/lib/crime-managment';

@Component({
    selector: 'dps-crime-manager-desktop-popup',
    template: `<dps-crime-management-manager #crimeManagementPopupManager
                    [inputData]="data.input"
                    [token]="data.token"
                    [isPopup]="true"
                    (closePopup)="onClose()">
                    <dps-crime-management-popup-layout
                        [isLoading]="crimeManagementPopupManager.isLoading$|async"
                        [classList]="crimeManagementPopupManager.classList$|async"
                        [classType]="crimeManagementPopupManager.classType$|async"
                        [addClassModel]="crimeManagementPopupManager.addClassModel$|async"
                        [rateFileloading]="crimeManagementPopupManager.rateFileloading$|async"
                        (updateAddClassModel)="crimeManagementPopupManager.onUpdateAddClassModel($event)"
                        (userAction)="crimeManagementPopupManager.onUserAction($event)"
                        (rateFileUpdate)="crimeManagementPopupManager.onRateFileUpdate(data.token)"
                        (expandRow)="crimeManagementPopupManager.getClassTotal(data.token, $event)"
                        (closePopUp)="onClose()">
                    </dps-crime-management-popup-layout>
                </dps-crime-management-manager>`,
    styles: []
})



export class CrimeManagerDesktopPopupComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: CrimeManagementInput, token: string },
        public dialogRef: MatDialogRef<CrimeManagerDesktopPopupComponent>, private dialog: MatDialog) { }

    ngOnInit() {

    }

    onClose() {
        this.dialogRef.close();
    }

}
