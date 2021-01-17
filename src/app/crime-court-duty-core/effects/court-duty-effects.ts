import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as Core from '../actions/court-duty';
import { map, mergeMap, switchMap, catchError, filter, take, tap } from 'rxjs/operators';
import { GetFeeEarnerList, GetBranchList, GetCrimeLookupList } from '../../shared-data';
import { from, of, combineLatest } from 'rxjs';
import { LookupType } from '../../shared';
import { LocalStorageKey } from '../../core';
import { RateSource } from '../../time-information-core';
import { CrimeCourtDutyService } from '../services/crime-court-duty.service';
import { InfoDialogType } from '../../core/utility/DpsUtility';
import { getModel, gridDataFilter, gridDataPaginatorDef } from '../reducers';
import { CourtDutyTimeRecord } from '../model/interface';
import { isMobile } from '../../utils/is-mobile';
import { centerToWindow } from '../../utils/bounds';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { WebViewService } from '../../azure-storage';

@Injectable()
export class CourtDutyEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: CrimeCourtDutyService, private windowPopupsManagerService: WindowPopupsManagerService,
        private webViewService: WebViewService) { }

    @Effect()
    GetClassType$ = this.actions$.pipe(ofType<Core.InitCcourtDutyInformation>(Core.INIT_CRIME_COURT_DUTY),
        mergeMap(action => from([new GetFeeEarnerList(true), new GetBranchList(),
        new GetCrimeLookupList(LookupType.MA_COURT_CODES), new Core.GetCrimeRateFiles(action.token)])));

    @Effect()
    getCrimeRateFiles$ = this.actions$.pipe(ofType<Core.GetCrimeRateFiles>(Core.GET_CRIME_RATE_FILES),
        switchMap(action => {
            const crimeRateFiles = localStorage.getItem(LocalStorageKey.CrimeRateFiles);
            let rateSource: RateSource = {};
            const classId = 500;
            if (crimeRateFiles) {
                rateSource = JSON.parse(localStorage.getItem(LocalStorageKey.CrimeRateFiles));
            }
            if (rateSource && rateSource[classId]) {
                return of(new Core.GetCrimeRateFilesSuccess(action.token,
                    {
                        ratesDataSource: rateSource[classId]
                    }));
            } else {
                return this.service.getCrimeRates(classId).pipe(map((response) => {
                    rateSource[classId] = response;
                    localStorage.setItem(LocalStorageKey.CrimeRateFiles,
                        JSON.stringify(rateSource));

                    return new Core.GetCrimeRateFilesSuccess(action.token,
                        {
                            ratesDataSource: response
                        });
                }), catchError(() => of(new Core.GetCrimeRateFilesFail(action.token))));
            }
        }));

    @Effect()
    getRateSucess$ = this.actions$.pipe(ofType<Core.GetCrimeRateFilesSuccess>(Core.GET_CRIME_RATE_FILES_SUCCESS),
        map(action => new Core.UpdateRates(action.token))
    );

    @Effect()
    needToChangeRate$ = this.actions$.pipe(ofType<Core.ChangeModel>(Core.CHANGE_MODEL),
        filter(action => action.payload.key === 'timDate' || action.payload.key === 'isLonRates'),
        map(action => new Core.UpdateRates(action.token))
    );

    @Effect()
    calWithNewrates$ = this.actions$.pipe(ofType<Core.UpdateRates>(Core.UPDATE_RATE),
        map(action => new Core.ValueCalculation(action.token))
    );

    @Effect()
    changeTotal$ = this.actions$.pipe(ofType<Core.ChangeModel>(Core.CHANGE_MODEL),
        filter(action => this.needToClaculateValues(action.payload.key)),
        map(action => new Core.ValueCalculation(action.token))
    );

    @Effect()
    bindRateForNew$ = this.actions$.pipe(ofType<Core.ClearModel>(Core.CLEAR_MODEL),
        map(action => new Core.UpdateRates(action.token))
    );

    @Effect({ dispatch: false })
    checkSaveModelData$ = this.actions$.pipe(ofType<Core.Save>(Core.SAVE),
        switchMap(action => this.store.select(getModel(action.token)).pipe(
            map(model => ({ token: action.token, errorMsg: this.validationFailMessage(model), model: model })),
            take(1)
        ))
    );

    @Effect()
    validationFail$ = this.checkSaveModelData$.pipe(
        filter(action => !!action.errorMsg),
        map((action => new Core.ShowMessage(action.token, 'DPS Crime Module', action.errorMsg, InfoDialogType.warning))
        ));

    @Effect()
    saveTimeInfo$ = this.checkSaveModelData$.pipe(
        filter(action => !action.errorMsg),
        switchMap(action => this.service.saveTimeRecord(action.model).pipe(
            map(() => new Core.SaveSuccess(action.token)),
            catchError(() => of(new Core.SaveFail(action.token)))
        ))
    );

    @Effect()
    requestHistory$ = this.actions$.pipe(ofType<Core.ChangeModel>(Core.CHANGE_MODEL),
        filter(action => action.payload.key === 'branchId'),
        map(action => new Core.GetTimeRecords(action.token))
    );

    @Effect()
    saveTimeInfoSuccess$ = this.actions$.pipe(ofType<Core.SaveSuccess>(Core.SAVE_SUCCESS),
        mergeMap(action => from([new Core.GetTimeRecords(action.token), new Core.ClearModel(action.token)]))
    );

    @Effect()
    changePage$ = this.actions$.pipe(ofType<Core.ChangePage>(Core.CHANGE_PAGE),
        map(action => new Core.GetTimeRecords(action.token))
    );

    @Effect()
    changeFilters$ = this.actions$.pipe(ofType<Core.ChangeGridFilter>(Core.CHANGE_GRID_FILTER),
        switchMap(action => this.store.select(gridDataFilter(action.token)).pipe(
            map(filters => ({ filters, token: action.token }),
            ), take(1)
        )),
        filter(info => !!info.filters.fromData && !!info.filters.toDate),
        map(action => new Core.GetTimeRecords(action.token))
    );

    @Effect()
    getRecords$ = this.actions$.pipe(ofType<Core.GetTimeRecords>(Core.GET_TIME_RECORDS)).pipe(
        switchMap(action =>
            combineLatest(
                this.store.select(getModel(action.token)),
                this.store.select(gridDataFilter(action.token)),
                this.store.select(gridDataPaginatorDef(action.token)),
                ((model, filters, pageDef) => ({ branchId: model.branchId, filters, pageDef, token: action.token }))
            ).pipe(take(1))
        ),
        switchMap(action => this.service.getCourtDutyTimeRecords(action.branchId, action.filters, action.pageDef).pipe(
            map(responce => new Core.GetTimeRecordsSuccess(action.token, responce)),
            catchError(() => of(new Core.GetTimeRecordsFail(action.token)))
        ))
    );

    @Effect()
    deleteRecord$ = this.actions$.pipe(ofType<Core.Delete>(Core.DELETE)).pipe(
        switchMap(action => this.store.select(getModel(action.token)).pipe(
            map(model => ({ timId: model.timId, token: action.token }),
            ), take(1)
        )),
        switchMap(action => this.service.deleteCourtDuty(action.timId).pipe(
            map(responce => new Core.DeleteSuccess(action.token)),
            catchError(() => of(new Core.DeleteFail(action.token)))
        ))
    );

    @Effect()
    deleteTimeSuccess$ = this.actions$.pipe(ofType<Core.DeleteSuccess>(Core.DELETE_SUCCESS),
        mergeMap(action => from([new Core.GetTimeRecords(action.token), new Core.UpdateRates(action.token)]))
    );

    @Effect()
    setRateForEditItem$ = this.actions$.pipe(ofType<Core.EditItem>(Core.EDIT_ITEM),
        map(action => new Core.UpdateRates(action.token))
    );


    @Effect()
    loadDiaryWebViewUrl$ = this.actions$.pipe(ofType<Core.PrintDoc>(Core.PRINT_DOC),
        switchMap(action => this.store.select(getModel(action.token)).pipe(
            map(model => ({ token: action.token, model: model })),
            take(1)
        )),
        mergeMap((data) => {
            return this.webViewService.getDiaryWebViewUrlByDiaryId(data.model.diaryRef, 'CDS Report.pdf').pipe(
                map((url) => {
                    return new Core.PrintDocSuccess(data.token, data.model.diaryRef, url);
                }),
                catchError(() => {
                    return of(new Core.PrintDocFail(data.token));
                }));
        }));

    @Effect({ dispatch: false })
    openInNewTab$ = this.actions$.pipe(ofType<Core.PrintDocSuccess>(Core.PRINT_DOC_SUCCESS), tap((data) => {
        const spec = {
            ...centerToWindow(800, 600),
            toolbar: false,
            location: false,
            directories: false,
            status: false,
            menubar: false,
            scrollbars: false,
        };
        this.windowPopupsManagerService.openWindow(data.diaryId.toString(),
            data.url, spec, 'pdf');
    }));


    needToClaculateValues(changeType: string): boolean {
        if (changeType === 'travelHrsMin' || changeType === 'socialTimeHrsMin' ||
            changeType === 'unSocialTimeHrsMin' || changeType === 'mileage' ||
            changeType === 'vatFares' || changeType === 'nonVATFares' || changeType === 'parking' ||
            changeType === 'doNotClaimTravel') {
            return true;
        }
        return false;
    }

    validationFailMessage(model: CourtDutyTimeRecord): string {
        if (!model.feeEarner) {
            return 'Please enter a Fee Earner before saving the record.';
        } else if (!model.totalValue || Number(model.totalValue) <= 0) {
            return 'Please enter the time information before saving the record.';
        }
        return null;
    }

}
