import { MatDialog, MatDialogRef } from '@angular/material';
import { InforDialogComponent, InforDialogData, ConfirmDialogData, ConfirmDialogComponent, DetailStatus } from '../../shared';
import { getExtention } from '../../utils/file';
import { blacklistExtention } from '../consts/extensions';

export enum InfoDialogType {
    alert = 'alert',
    success = 'success',
    warning = 'warning',
    general = 'general'

}

export function showInforDialog(title: string, message: string, msgType: InfoDialogType, dialog: MatDialog):
    MatDialogRef<InforDialogComponent, any> {
    const dialogData: InforDialogData = {
        content: {
            title: title,
            message: message
        },
        data: { messageType: msgType }
    };
    return dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        hasBackdrop: true,
        panelClass: 'dps-notification'
    });
}

export function showConfirmDialog(title: string, message: string, dialog: MatDialog, acceptLabel = 'Yes', rejectLabel = 'No'):
    MatDialogRef<ConfirmDialogComponent, any> {
    const dialogData: ConfirmDialogData = {
        content: {
            title: title,
            message: message,
            acceptLabel: acceptLabel,
            rejectLabel: rejectLabel
        },
        data: null
    };
    return dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
    });
}

export function checkUploadFileIsBlacklisted(fileName: string): boolean {
    if (blacklistExtention.includes(getExtention(fileName).toLowerCase())) {
        return true;
    }
    return false;
}

export function combineStirng(text: string[]) {
    let temp = '';
    text.forEach(i => {
        if (!!i) {
            temp = `${temp} ${i} `;
        }
    });
    return temp;
}

export function getFileTypeByFullFileName(fileName: string): string {
    if (fileName) {
        const list = fileName.split('.');
        const listLength = !!list ? list.length : 0;
        if (listLength > 0) {
            const type = list[listLength - 1];
            return type ? type.toLocaleLowerCase() : '';
        }
    }
    return '';
}

export function showInforDialogWithDetailsStatus(title: string, detailStatus: DetailStatus[], msgType: InfoDialogType, dialog: MatDialog) {
    if (!!detailStatus && detailStatus.length > 0) {
        let msg = '';
        detailStatus.forEach(d => {
            msg += `<p>${d.message}</p>`;
        });
        showInforDialog('Plot Matters', msg, msgType, dialog);
    }
}

export function convertToDecimal(value: number, noOfDecimalPoint = 2) {
    if (value) {
        return parseFloat(value.toString()).toFixed(noOfDecimalPoint);
    }
    return value;
}
