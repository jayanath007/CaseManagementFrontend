import { map, switchMap, take, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import {
    ShowMessage, SHOW_MESSAGE, OpenLoockupPopup, OPEN_LOOKUP_POPUP, RequestToChangeModel
} from '../../crime-class-information-proceedings-core/actions/class-information';
import { showInforDialog } from '../../core/utility/DpsUtility';
import { LookupsDialogInput } from '../../shared';
import { CrimeLookUpFiled, CRIME_LOOKUP_FILEDS } from '../../core/lib/crime-managment';
import { LookupsComponent } from '../../shared/components/lookups/lookups.component';
import { LoockupItem } from './../../shared/models/dialog';
import { of } from 'rxjs';
import { ModelProperty } from '../../crime-class-information-proceedings-core/models/enum';
import { Store } from '@ngrx/store';

@Injectable()
export class ProceedingClassInfoEffect {
    constructor(private actions$: Actions, private dialog: MatDialog, protected store: Store<any>) { }

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<ShowMessage>(SHOW_MESSAGE),
        map((action) => {
            showInforDialog(action.title, action.message, action.messageType, this.dialog);
        }));

    @Effect({ dispatch: false })
    OpenLocationLoockupPopup$ = this.actions$.pipe(ofType<OpenLoockupPopup>(OPEN_LOOKUP_POPUP),
        map(action => {
            const fileds: CrimeLookUpFiled = CRIME_LOOKUP_FILEDS[action.lookupType];
            const loockupInput: LookupsDialogInput = {
                title: fileds.title,
                secondTitle: fileds.secondTitle,
                items: action.data,
                keyColumsEnable: false,
                editable: false,
                showCode: true,
                enableSearch: true,
                searchText: action.searchText
            };
            const dialogRef = this.dialog.open(LookupsComponent, {
                width: '450px',
                height: '500px',
                data: loockupInput,
                hasBackdrop: true,
                disableClose: true,
                panelClass: 'dps-notification'
            });
            dialogRef.afterClosed().subscribe(
                ((item: LoockupItem) => {
                    if (item) {
                        this.store.dispatch(new RequestToChangeModel(action.token,
                            { key: ModelProperty.locationId, value: item.code }));
                        this.store.dispatch(new RequestToChangeModel(action.token,
                            { key: ModelProperty.locationName, value: item.name }));
                    }

                })
            );

        }
        )
    );

    // @Effect({ dispatch: false })
    // showValidationFailMessge$ = this.actions$.pipe(ofType<ShowValidationFailDialog>(SHOW_VALIDATION_FAIL_MESSAGE),
    //     map((action) => {
    //         const dialogRef = this.dialog.open(FailDialogComponent, {
    //             data: action.data,
    //             width: '400px',
    //             disableClose: true,
    //             hasBackdrop: true,
    //             panelClass: 'dps-notification'
    //         });
    //     }));

    // @Effect({ dispatch: false })
    // viewLogFile$ = this.actions$.pipe(ofType<GetLogFileSuccess>(GET_LOG_FILE_SUCCESS),
    //     map((action) => {
    //         this.urlPopupService.openWithUrlPoup(action.url, 'bundleLogViewer', true, false, 'Log file View', true);
    //     }));
}

