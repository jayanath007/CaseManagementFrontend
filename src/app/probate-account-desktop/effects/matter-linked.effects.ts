
import {
    ShowValidationFailDialog, SHOW_VALIDATION_FAIL_MESSAGE, GetPlotStatusSuccess,
    GET_PLOT_STATUS_SUCCESS
} from './../../matter-linked-core/actions/core';

import { map, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import { FailDialogComponent } from '../../shared';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { showInforDialog, showInforDialogWithDetailsStatus, InfoDialogType } from '../../core/utility/DpsUtility';


@Injectable()
export class MatterLinkedEffects {
    constructor(private actions$: Actions, private dialog: MatDialog, private urlPopupService: UrlPopupService) { }


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
    showMessge$ = this.actions$.pipe(ofType<GetPlotStatusSuccess>(GET_PLOT_STATUS_SUCCESS),
        filter((action => action.responce && action.responce.detailStatus && action.responce.detailStatus.length > 0)),
        map((action) => {
            showInforDialogWithDetailsStatus('Plot Matters', action.responce.detailStatus, InfoDialogType.success, this.dialog);
        }));

    @Effect({ dispatch: false })
    showSuccessMessge$ = this.actions$.pipe(ofType<GetPlotStatusSuccess>(GET_PLOT_STATUS_SUCCESS),
        filter((action => action.responce && action.responce.detailStatus.length === 0)),
        map((action) => {
            showInforDialog('Plot Matters', 'Plots created successfully.', InfoDialogType.success, this.dialog);
        }));

}

