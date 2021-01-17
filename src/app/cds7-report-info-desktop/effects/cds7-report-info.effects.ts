import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { SaveSuccess, SAVE_SUCCESS } from '../../cds7-report-info-core/actions/core';
import { tap } from 'rxjs/operators';
import { CDS7CloseInfo } from '../../cds7-report-info-core/models/cds7-report-info';

@Injectable()
export class Cds7ReportInfoEffects {
    constructor(private actions$: Actions) { }


    @Effect({ dispatch: false })
    closePopup$ = this.actions$.pipe(ofType<SaveSuccess>(SAVE_SUCCESS),
        tap(action => action.popupDialog.close({ action: CDS7CloseInfo.ExitWithSaveSuccess, data: null })));

}
