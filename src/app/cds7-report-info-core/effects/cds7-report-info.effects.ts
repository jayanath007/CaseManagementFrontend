import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Cds7ReportInfoService } from '../services/cds7-report-info.service';
import * as Core from '../actions/core';
import { map, switchMap, catchError, take, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { getInformationModel } from '../reducers';
import { GetCrimeLookupList } from '../../shared-data';
import { LookupType } from '../../shared';
@Injectable()
export class Cds7ReportInfoEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: Cds7ReportInfoService) { }


    @Effect()
    init$ = this.actions$.pipe(ofType<Core.InitCDS7>(Core.INIT_CDS7),
        mergeMap(action => [new Core.GetCDS7ReportInfo(action.token, action.input), new GetCrimeLookupList(LookupType.MA_COURT_CODES)]));

    @Effect()
    getInfo$ = this.actions$.pipe(ofType<Core.GetCDS7ReportInfo>(Core.GET_CDS7_REPORT_INFO),
        switchMap(action => this.service.GetCDS7ReportInfo(action.input).pipe(
            map(responce => new Core.GetCDS7ReportInfoSuccess(action.token, responce.cdS7ReportInfo, responce.caseTypes)),
            catchError(() => of(new Core.GetCDS7ReportInfoFail(action.token)))
        )));

    @Effect()
    saveData$ = this.actions$.pipe(ofType<Core.Save>(Core.SAVE),
        switchMap(action => this.store.select(getInformationModel(action.token)).pipe(
            map(modal => ({ modal: modal, action: action })),
            take(1)
        )),
        switchMap(info => this.service.Save(info.modal).pipe(
            map(responce => new Core.SaveSuccess(info.action.token, info.action.popupDialog)),
            catchError(() => of(new Core.SaveFail(info.action.token)))
        )));

}
