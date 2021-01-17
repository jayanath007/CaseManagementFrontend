
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import {
    ShowMessage, SHOW_MESSAGE, ShowValidationFailDialog,
    SHOW_VALIDATION_FAIL_MESSAGE, GetLogFileSuccess, GET_LOG_FILE_SUCCESS
} from '../../bundling-core/actions/core';
import { showInforDialog } from '../../core/utility/DpsUtility';
import { FailDialogComponent } from '../../shared';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';


@Injectable()
export class BundlingEffects {
    constructor(private actions$: Actions, private dialog: MatDialog, private urlPopupService: UrlPopupService) { }

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<ShowMessage>(SHOW_MESSAGE),
        map((action) => {
            showInforDialog(action.title, action.message, action.messageType, this.dialog);
        }));

    @Effect({ dispatch: false })
    showValidationFailMessge$ = this.actions$.pipe(ofType<ShowValidationFailDialog>(SHOW_VALIDATION_FAIL_MESSAGE),
        map((action) => {
            const dialogRef = this.dialog.open(FailDialogComponent, {
                data: action.data,
                width: '400px',
                disableClose: true,
                hasBackdrop: true,
                panelClass: 'dps-notification'
            });
        }));

    @Effect({ dispatch: false })
    viewLogFile$ = this.actions$.pipe(ofType<GetLogFileSuccess>(GET_LOG_FILE_SUCCESS),
        map((action) => {
            this.urlPopupService.openWithUrlPoup(action.url, 'bundleLogViewer', true, false, 'Log file View', true);
        }));
}

