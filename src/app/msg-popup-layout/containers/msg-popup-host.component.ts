import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { ComponentBase } from '../../core';

@Component({
    selector: 'dps-msg-popup-host',
    template: `
    <dps-msg-content-manager #msgManager [msgToken]="data.token" [input]="data.input"
    (closePopup)="onClose($event)">
    <dps-msg-popup-view
    [item]="msgManager.input"
    [companyCode]="(msgManager.user$ | async)?.general?.companyCode"
    [msgToken]="data.token"
    [timeZone]="(msgManager.user$ | async)?.userTimeZone?.info.alias"
    (chaserPopupClosed)="msgManager.onchaserPopupClosed($event)"
    (fileHistoryMsgReply)="msgManager.onFileHistoryMsgReply($event)"
    ></dps-msg-popup-view>
    </dps-msg-content-manager>
    `,
    styles: []
})
export class MsgPopupHostComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
        public dialogRef: MatDialogRef<MsgPopupHostComponent>) { }

    ngOnInit() {
    }
    onClose(event) {
        this.dialogRef.close(event);
    }

}
