import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'dps-file-security-rights-popup',
    template: `
    <dps-file-security-rights-manager #manager [inputData]="data.input">
        <dps-file-security-rights-layout
            [isLoading]="manager.isLoading$ | async"
            [matterId]="data.input"
            [users]="manager.users$ | async"
            [originalUsers]="manager.originalUsers$ | async"
            [gridColoumns]="manager.gridColoumns"
            (hasRightsChange)="manager.onHasRightsChange($event)"
            (changeUsers)="manager.onChangeUsers($event)"
            (close)="onClose($event)">
        </dps-file-security-rights-layout>
    </dps-file-security-rights-manager>
  `,
    styles: []
})
export class FileSecurityRightsPopupComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: number, token: string },
        public dialogRef: MatDialogRef<FileSecurityRightsPopupComponent>) { }

    ngOnInit() {

    }

    onClose(event) {
        this.dialogRef.close(event);
    }

}
