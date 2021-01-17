
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, take, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { getCrimeClassIdentityViewModel } from './../../time-information-core/reducers';
import { PriceCapLimitInput } from '../../core/lib/priceCapLimit';
import { SystemJsPopupLoaderService } from './../../shell-desktop/services/system-js-popup-loader.service';
import {
    OpenExideLimitPopup, OPEN_PRICE_CAP_LIMIT_POPUP,
    OPEN_LOOKUP_POPUP, OpenLoockupPopup, SelectLookupData, GetAssistanceData
} from './../../time-information-core/actions/core';
import { LookupsDialogInput, LoockupItem } from './../../shared/models/dialog';
import { LookupsComponent } from './../../shared/components/lookups/lookups.component';
import { CrimeLookUpFiled, CRIME_LOOKUP_FILEDS } from '../../core/lib/crime-managment';

@Injectable()
export class TimeInformationEffects {
    constructor(private actions$: Actions, private store: Store<any>, private popupService: SystemJsPopupLoaderService,
        private dialog: MatDialog) { }

    @Effect()
    openExceedPopup$ = this.actions$.pipe(ofType<OpenExideLimitPopup>(OPEN_PRICE_CAP_LIMIT_POPUP),
        switchMap(action =>
            this.store.select(getCrimeClassIdentityViewModel(action.token)).pipe(
                take(1), switchMap(model => {
                    const input: PriceCapLimitInput = {
                        fileID: model.fileId,
                        branchID: model.branchId,
                        classId: model.classId,
                    };
                    return this.popupService.priceCapLimitPopup('crime-price-cap-limit', input).pipe(
                        take(1),
                        map(() => {
                            return new GetAssistanceData(action.token);
                        }));
                }))
        )
    );

    @Effect()
    OpenLoockupPopup$ = this.actions$.pipe(ofType<OpenLoockupPopup>(OPEN_LOOKUP_POPUP),
        switchMap(action => {
            const fileds: CrimeLookUpFiled = CRIME_LOOKUP_FILEDS[action.lookupType];
            const loockupInput: LookupsDialogInput = {
                title: fileds.title,
                secondTitle: fileds.secondTitle,
                items: action.lookupList,
                keyColumsEnable: false,
                editable: false
            };
            const dialogRef = this.dialog.open(LookupsComponent, {
                width: '450px',
                data: loockupInput,
                hasBackdrop: true,
                disableClose: true,
                panelClass: 'dps-notification'
            });
            return dialogRef.afterClosed().pipe(
                take(1),
                map((item: LoockupItem) => {
                    return new SelectLookupData(action.token, action.lookupType, action.property, item);
                })
            );

        }
        )
    );

}
