import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { TextInsertDialogInput, TextInsertDialogComponent } from '../../shared';
import { FileHistoryUiService, FileItemWrapper } from '../../file-history-core';

@Injectable()
export abstract class FileHistoryDesktopUiService extends FileHistoryUiService {
    constructor(private dialog: MatDialog) {
        super();
    }

    showArchiveXDraftConfirm(item: FileItemWrapper): Observable<{ xNote: string, item: FileItemWrapper }> {
        return this.openXdraftDialog(item, 'Archive file', `you can't edit archive file, Please create xDraft for edit the file`)
            .pipe(map((value) => ({xNote: value, item: item })));
    }

    private openXdraftDialog(item, title: string, details: string): Observable<string> {
        const dialogData: TextInsertDialogInput = {
            content: { title: title, details: details, message: '', placeholder: '' }, allowEmpty: true,
            text: item.data.note,
            showCancelBtn: true
        };

        const dialogRef = this.dialog.open(TextInsertDialogComponent, {
            width: '250px',
            data: dialogData,
            panelClass: 'dps-notification',

        });

        return dialogRef.afterClosed();
    }
}
