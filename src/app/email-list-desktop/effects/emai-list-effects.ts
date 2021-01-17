
import { switchMap, filter } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { ShareAttachmentSuccess, SHARE_ATTACHMENT_SUCCESS } from '../../email-list-core';
import { MatDialog } from '../../../../node_modules/@angular/material';
import { InforDialogComponent, InforDialogData } from '../../shared';
import { of } from 'rxjs';
import { SubmitType } from '../../add-note-core';

@Injectable()
export class EmailListEffects {
    constructor(private actions$: Actions, private dialog: MatDialog) { }

    @Effect()
    getEmailListSuccess$ = this.actions$.pipe(ofType<ShareAttachmentSuccess>(SHARE_ATTACHMENT_SUCCESS),
        filter(action => !(action.payload && action.payload.id)),
        switchMap(action => {
            const dialogData: InforDialogData = {
                content: {
                    title: 'Send',
                    message: `The ${action.payload.submitType === SubmitType.MsgViaMLS ? 'message' : 'document'} was sent successfully`
                },
                data: { messageType: '' }
            };
            const dialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '400px',
                disableClose: false,
                hasBackdrop: true,
                panelClass: 'dps-notification',
            });
            return dialogRef.afterClosed().pipe(switchMap(val => of()));
        }));
}
