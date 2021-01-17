import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { InputData, Contact } from '../../email-list-core';

@Component({
    selector: 'dps-email-list-popup',
    template: `
    <dps-email-list-manager #manager [token]="data.token" [input]="data.input">
        <dps-email-list-layout
            [isSafeBoxEnabled]="(manager.user$|async)?.general?.settingValues?.IsAzureSafeBoxEnabled"
            [submitType]="data.input.submitType"
            [emailList]="manager.emailList$|async"
            [loading]="manager.loading$|async"
            [closePopup]="manager.closePopup$|async"
            [share]="manager.share$|async"
            [columnDef]="manager.gridColoumns"
            [reviewDate]="manager.reviewDate$|async"
            [reviewNote]="manager.reviewNote$|async"
            [message]="manager.message$|async"
            [isSilent]="manager.isSilent$|async"
            (shareChange)="manager.onShareChange($event)"
            (toCcChange)="manager.onToCcChange($event)"
            (reviewDateChange)="manager.onReviewDateChange($event)"
            (reviewNoteChange)="manager.onReviewNoteChange($event)"
            (messageChange)="manager.onChangeMessageChange($event)"
            (shareAttachment)="manager.onShareAttachment(data.input,$event)"
            (addRecipient)="manager.onAddRecipient($event)"
            (changeSilent)="manager.onChangeSilent($event)"
            (exportToRecepient)="onClose($event)"
            (close)="onClose($event)">
        </dps-email-list-layout>
    </dps-email-list-manager>
    `,
    styles: []
})
export class EmailListPopupComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: InputData, token: string },
        public dialogRef: MatDialogRef<EmailListPopupComponent>) { }

    ngOnInit() {
    }

    onClose(event: Contact[]) {
        this.dialogRef.close(event);
    }

}
