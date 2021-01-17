
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { ConfirmDialogData } from '../../shared/models/dialog';
import { Injectable } from '@angular/core';
import { ConfirmDialogResultKind } from '../../shared';
import { DocumentTranslationsService } from './document-translations.service';

@Injectable()
export class DocumenWindowPopupService {

    documenWindowPopupList = [];
    windowObj;
    constructor(private dialog: MatDialog, private translations: DocumentTranslationsService) { }

    openPopup(key: string, url: string) {

        for (let i = 0; i < this.documenWindowPopupList.length; i++) {
            if (this.documenWindowPopupList[i].key === key) {
                this.windowObj = this.documenWindowPopupList[i];
            }
        }
        if (this.windowObj && this.windowObj.window && !this.windowObj.window.closed) {
            this.windowObj.window.focus();
        } else {
            /// hadel null popower
            const newWindow = window.open(url, key, 'width=1000,height=900');
            this.windowObj = { key: key, window: newWindow };
            this.documenWindowPopupList.push(this.windowObj);

            if (!(window.navigator.userAgent.indexOf('Edge') > -1)
                && !newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                this.warningMessage();
            }
        }
    }

    private warningMessage() {
        const dialogData: ConfirmDialogData = {
            content: {
                title: this.translations.popup_blocked_title,
                message: this.translations.popup_blocked_message
            },
            contentParams: { displayName: '' },
            data: null,
        };

        const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: dialogData,
            width: '350px',
            panelClass: 'dps-notification'
        });
    }

}
