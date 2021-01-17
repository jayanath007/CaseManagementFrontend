import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import {
    EmptyLeadUFN, EMPTY_LEAD_UFN, CheckFeeEarnerValiedFail, CHECK_FEE_EARNER_VALIED_FAIL,
    GetFileIsLockedSuccess, GET_FILE_IS_LOCKED_SUCCESS, HasOutstandingUndertakings, HAS_OUTSTANDING_UNDERTAKINGS,
    HasUnreconciledItems, HAS_UNRECONCILED_ITEMS, UpdateMatteer
} from '../../matter-creation-core';
import { MatDialog } from '@angular/material';
import {
    InforDialogData, InforDialogComponent, ConfirmDialogData,
    ConfirmDialogComponent, ConfirmDialogWithCancelResultKind
} from '../../shared';
import { WriteOffNegativeWipSuccess, WRITE_OFF_NEGATIVE_WIP_SUCCESS, ShowMessage, SHOW_MSG } from './../../matter-creation-core/actions/core';
import { showInforDialog } from '../../core/utility/DpsUtility';
import { InfoDialogType } from './../../core/utility/DpsUtility';

@Injectable()
export class MatterCreationDesktopEffects {

    constructor(private actions$: Actions, private dialog: MatDialog) { }

    @Effect()
    emptyLeadUFN$ = this.actions$.pipe(ofType<EmptyLeadUFN>(EMPTY_LEAD_UFN),
        switchMap(action => {
            const dialogData: InforDialogData = {
                content: {
                    title: 'DPS Software',
                    message: 'Empty Lead UFN Selected.'
                },
                data: { messageType: 'alert' },
            };
            const dialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '350px',
                panelClass: 'dps-notification'
            });
            return of();
        }));

    @Effect()
    checkFeeEarnerValiedFail$ = this.actions$.pipe(ofType<CheckFeeEarnerValiedFail>(CHECK_FEE_EARNER_VALIED_FAIL),
        switchMap(action => {
            const dialogData: InforDialogData = {
                content: {
                    title: 'DPS Software',
                    message: 'Fee earner ' + action.payload.matterFeeEarner +
                        'Not found or disable. A supervisor needs to create this user'
                },
                data: { messageType: 'alert' },
            };
            const dialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '350px',
                panelClass: 'dps-notification'
            });
            return of();
        }));
    @Effect()
    getFileIsLockedSuccess$ = this.actions$.pipe(ofType<GetFileIsLockedSuccess>(GET_FILE_IS_LOCKED_SUCCESS),
        filter(action => action.payload.data[0].errorCode === 'Locked'),
        switchMap(action => {
            const dialogData: InforDialogData = {
                content: {
                    title: 'DPS change branch',
                    message: action.payload.data[0].message
                },
                data: { messageType: 'alert' },
            };
            const dialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '350px',
                panelClass: 'dps-notification'
            });
            return of();
        }));
    @Effect()
    hasOutstandingUndertakings$ = this.actions$.pipe(ofType<HasOutstandingUndertakings>(HAS_OUTSTANDING_UNDERTAKINGS),
        switchMap(action => {
            const dialogData: InforDialogData = {
                content: {
                    title: 'Close Matter',
                    message: 'Cannot close matter as there are outstanding undertakings.'
                },
                data: { messageType: 'alert' },
            };
            const dialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '350px',
                panelClass: 'dps-notification'
            });
            return of();
        }));
    @Effect()
    hasUnreconciledItems$ = this.actions$.pipe(ofType<HasUnreconciledItems>(HAS_UNRECONCILED_ITEMS),
        map(action => {
            const dialogData: ConfirmDialogData = {
                content: {
                    title: 'Close Matter',
                    message: `<p>There are un-reconciled items on matter, Do you want to continue closing the matter?</p>`,
                    acceptLabel: 'Yes',
                    rejectLabel: 'No',
                },
                contentParams: {},
                data: null
            };
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                width: '350px',
                disableClose: true,
                panelClass: 'dps-notification'
            });
            return dialogRef.afterClosed().pipe(mergeMap(dialogResult => {
                if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
                    return from([
                        new UpdateMatteer(action.token, { property: 'matterCloseMatter', value: false }),
                        new UpdateMatteer(action.token, { property: 'matterClosedate', value: null })
                    ]);
                }
                return from([]);
            }));
        }));

    @Effect({ dispatch: false })
    showWriteOffTimeMessge$ = this.actions$.pipe(ofType<WriteOffNegativeWipSuccess>(WRITE_OFF_NEGATIVE_WIP_SUCCESS),
        map(() => {
            showInforDialog('Write Off Time', 'All records written off', InfoDialogType.success, this.dialog);
        }));

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<ShowMessage>(SHOW_MSG),
        map((action) => {
            showInforDialog(action.title, action.message, action.messageType, this.dialog);
        }));

}
