import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { showInforDialog } from '../../core/utility/DpsUtility';
import { ShowMessage, SHOW_MESSAGE } from '../../crime-court-duty-core/actions/court-duty';

@Injectable()
export class CourtDutyEffects {
    constructor(protected store: Store<any>, private actions$: Actions, private dialog: MatDialog) { }

    @Effect({ dispatch: false })
    showMessge$ = this.actions$.pipe(ofType<ShowMessage>(SHOW_MESSAGE),
        map((action) => {
            showInforDialog(action.title, action.message, action.messageType, this.dialog);
        }));
}

