import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, map, take } from 'rxjs/operators';
import {
    ChangeModel, OPEN_CLASS_INFO_POPUP, OpenClassInfoPopup, ShowMessage, VALIDATION_MESSAGE
} from '../../crime-class-information-investigation-core/actions/core';
import { getInformationModel, getPopupOpeningData } from '../../crime-class-information-investigation-core/reducers';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { ModelProperty } from './../../crime-class-information-investigation-core/models/enum';
import { PoliceStationList } from './../../core/lib/police-station';
import { showInforDialog } from '../../core/utility/DpsUtility';

@Injectable()
export class CcInvestigationClassInfoEffect {
    constructor(private actions$: Actions, private store: Store<any>,
        private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) { }

    // @Effect({ dispatch: false })
    // openPoliceStSearchPopup1$ = this.actions$.pipe(ofType<OpenPoliceStSearch>(OPEN_POLICE_ST_SEARCH),
    //     switchMap(action => this.store.select(getInformationModel(action.token)).pipe(
    //         map(model => ({ model, action: action })), take(1))
    //     ), map(info =>
    //         this.popupService.openPoliceStationPopup('TimeInformation', info.action.searchText)
    //             .subscribe((result: PoliceStationList) => {
    //                 if (result) {
    //                     this.store.dispatch(new ChangeModel(info.action.token, { key: ModelProperty.policeStId, value: result.code }));
    //                 }
    //             })));

    @Effect({ dispatch: false })
    openClassInfoPopup$ = this.actions$.pipe(ofType<OpenClassInfoPopup>(OPEN_CLASS_INFO_POPUP),
        switchMap(action => this.store.select(getPopupOpeningData(action.token)).pipe(
            map(input => this.popupService.openInvestigationClassInfoPopup(
                `investigation_class_Info_RecursiveFormDisp-${input.fileId}`, input
            )),
            take(1))
        ));

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<ShowMessage>(VALIDATION_MESSAGE),
        map((action) => {
            showInforDialog(action.title, action.message, action.messageType, this.dialog);
        }));

}
