import { map, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import {
    ShowMessage, SHOW_MSG, OpenClassInfoPopup,
    OPEN_CLASS_INFO_POPUP, RefreshClassList, GetClassTotal
} from '../../crime-management-core/actions/core';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { getInputDataByToken } from './../../crime-management-core/reducers';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { CrimeProceedingClassInfoInput } from '../../core/lib/crime-managment';
@Injectable()
export class CrimeManagementEffects {
    constructor(private actions$: Actions, private dialog: MatDialog, private store: Store<any>,
        private popupService: SystemJsPopupLoaderService) { }

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<ShowMessage>(SHOW_MSG),
        map((action) => {

            const dialogData: InforDialogData = {
                content: {
                    title: 'Case Class Management',
                    message: action.payload.msg
                },
                data: { messageType: 'alert' }
            };
            const dialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '400px',
                disableClose: true,
                hasBackdrop: true,
                panelClass: 'dps-notification'
            });

        }));

    @Effect({ dispatch: false })
    openClassInfoPopup$ = this.actions$.pipe(ofType<OpenClassInfoPopup>(OPEN_CLASS_INFO_POPUP),
        switchMap(action => this.store.select(getInputDataByToken(action.token)).pipe(
            map((crimeManagementInput => ({
                input: {
                    appId: crimeManagementInput.appId,
                    fileId: crimeManagementInput.fileId,
                    classObj: action.classObj,
                    ufn: crimeManagementInput.ufnValue,
                    isRecursiveFormDisplay: false,
                },
                token: action.token
            }))), take(1))
        ), map(data => {
            switch (data.input.classObj.rectype) {
                case 3: {
                    return this.popupService.openInvestigationClassInfoPopup(`investigation_class-${data.input.fileId}`, data.input)
                        .subscribe((value) => {
                            this.store.dispatch(new RefreshClassList(data.token));
                        });
                }
                case 4: {
                    const proceddingClassInput: CrimeProceedingClassInfoInput = {
                        crimeClassIdentityViewModel: {
                            fileId: data.input.fileId,
                            branchId: data.input.classObj.branchid,
                            classId: data.input.classObj.rectype
                        },
                        ufnValue: data.input.ufn,
                    };
                    return this.popupService.openProceedingClassInfoPopup(`proceeding_class-${data.input.fileId}`, proceddingClassInput)
                        .subscribe((value) => {
                            this.store.dispatch(new RefreshClassList(data.token, data.input.classObj));
                        });
                }
                default: return;
            }
        }));
}

