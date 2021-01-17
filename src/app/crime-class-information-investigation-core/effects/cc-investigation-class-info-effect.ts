import { InvestigationClassInfo } from './../models/interfaces';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, catchError, mergeMap, take, filter } from 'rxjs/operators';
import { CCInvestigationServices } from '../services/cc-investigation-services';
import * as Core from './../actions/core';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import {
    getMatterTypeList, getOutComeCodeList, getInformationModel,
    getTotalSummeryRequestModel, getCurrentTotalReqViewModel,
    getClassClosingReqViewModel
} from './../reducers/index';
import { ModelProperty } from './../models/enum';
import { getUser } from '../../auth';
import { LookupType } from '../../shared';
import { GetCrimeLookupList } from '../../shared-data';

@Injectable()
export class CcInvestigationClassInfoEffect {
    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: CCInvestigationServices
    ) { }

    @Effect()
    init$ = this.actions$.pipe(ofType<Core.InitCrimeInformation>(Core.INIT_CRIME_INFORMATION),
        map(action => ({
            crimeClassIdentityViewModel: {
                fileId: action.inputData.fileId,
                branchId: action.inputData.classObj.branchid,
                classId: action.inputData.classObj.rectype,
                IsRecursiveFormDisplay: action.inputData.isRecursiveFormDisplay,
            }, token: action.token
        })),
        mergeMap(info => [new Core.GetClassInfo(info.token, info.crimeClassIdentityViewModel),
        new Core.GetStageReachedValuesForInvClass(info.token, info.crimeClassIdentityViewModel),
        new Core.GetMatterTypeValuesForInvClass(info.crimeClassIdentityViewModel),
        new Core.GetOutComeCodeValuesForInvClses(info.crimeClassIdentityViewModel),
        new GetCrimeLookupList(LookupType.POLICE_ST_CODES),]));

    @Effect()
    initSuccess$ = this.actions$.pipe(ofType<Core.GetClassInfoSuccess>(Core.GET_CLASS_INFO_SUCCESS),
        map(action => new Core.GetInvClassTotalsSummary(action.token))
    );

    @Effect()
    refreshTotalSummery$ = this.actions$.pipe(ofType<Core.GetInvClassCurrentTotalsSuccess>(Core.GET_INV_CLASS_CURRENT_TOTALS_SUCCESS),
        map(action => new Core.GetInvClassTotalsSummary(action.token))
    );

    @Effect()
    getClassInfo$ = this.actions$.pipe(ofType<Core.GetClassInfo>(Core.GET_CLASS_INFO),
        switchMap(action => this.service.getClassInfo(action.request).pipe(
            map(responce => new Core.GetClassInfoSuccess(action.token, responce)),
            catchError(() => of(new Core.GetClassInfoFail(action.token))
            ))));

    @Effect()
    getStageReachedList$ = this.actions$.pipe(ofType<Core.GetStageReachedValuesForInvClass>(Core.GET_CLASS_INFO),
        switchMap(action => this.service.GetStageReachedValuesForInvClass(action.request).pipe(
            map(responce => new Core.GetStageReachedValuesForInvClassSuccess(action.token, responce)),
            catchError(() => of(new Core.GetStageReachedValuesForInvClassFail(action.token))
            ))));

    @Effect()
    getMatterTypeList$ = this.actions$.pipe(ofType<Core.GetMatterTypeValuesForInvClass>(Core.GET_MATTER_TYPE_VALUES_FOR_INV_CLASS),
        switchMap((action) => this.store.select(getMatterTypeList).pipe(take(1),
            map(matterType => ({ matterType: matterType, request: action.request })))),
        filter(info => info.matterType.length === 0),
        switchMap((info) => this.service.GetMatterTypeValuesForInvClass(info.request).pipe(
            map(responce => new Core.GetMatterTypeValuesForInvClassSuccess(responce)),
            catchError(() => of(new Core.GetMatterTypeValuesForInvClassFail())
            ))));

    @Effect()
    getOutComeCode$ = this.actions$.pipe(ofType<Core.GetOutComeCodeValuesForInvClses>(Core.GET_OUT_COME_CODE_VALUES),
        switchMap((action) => this.store.select(getOutComeCodeList).pipe(take(1),
            map(outComeCode => ({ outComeCode: outComeCode, request: action.request })))),
        filter(info => info.outComeCode.length === 0),
        switchMap((info) => this.service.GetOutComeCodeValuesForInvClses(info.request).pipe(
            map(responce => new Core.GetOutComeCodeValuesForInvClassSuccess(responce)),
            catchError(() => of(new Core.GetOutComeCodeValuesForInvClsesFail())
            ))));

    @Effect()
    save$ = this.actions$.pipe(ofType<Core.Save>(Core.SAVE),
        switchMap((action) => this.store.select(getInformationModel(action.token)).pipe(take(1),
            map(model => ({ model: model, token: action.token })))),
        switchMap(info => this.service.Save(info.model).pipe(
            map(() => new Core.SaveSuccess(info.token)),
            catchError(() => of(new Core.SaveFail(info.token)))
        ))
    );

    @Effect()
    getTotalSummery$ = this.actions$.pipe(ofType<Core.GetInvClassTotalsSummary>(Core.GET_INV_CLASS_TOTALS_SUMMARY),
        switchMap(action => this.store.select(getTotalSummeryRequestModel(action.token)).pipe(
            map(request => ({ request, token: action.token })), take(1))),
        switchMap(info => this.service.GetInvClassTotalsSummary(info.request).pipe(
            map((responce) => new Core.GetInvClassTotalsSummarySuccess(info.token, responce)),
            catchError(() => of(new Core.GetInvClassTotalsSummaryFail(info.token)))
        ))
    );

    @Effect()
    requestRefreshTotal$ = this.actions$.pipe(ofType<Core.ChangeModel>(Core.CHANGE_MODEL),
        filter(action => (action.event.key === ModelProperty.closedDate) ||
            (action.event.key === ModelProperty.cdsDirectTAFChecked) ||
            (action.event.key === ModelProperty.schemeId) ||
            (action.event.key === ModelProperty.doNotClaimVATChecked)
        ),
        map(action => new Core.GetInvClassCurrentTotals(action.token)));

    @Effect()
    getRefreshTotal$ = this.actions$.pipe(ofType<Core.GetInvClassCurrentTotals>(Core.GET_INV_CLASS_CURRENT_TOTALS),
        switchMap(action => this.store.select(getCurrentTotalReqViewModel(action.token)).pipe(
            map(request => ({ request, token: action.token })), take(1))),
        switchMap(info => this.service.GetInvClassCurrentTotals(info.request).pipe(
            map((responce) => new Core.GetInvClassCurrentTotalsSuccess(info.token, responce)),
            catchError(() => of(new Core.GetInvClassTotalsSummaryFail(info.token)))
        ))
    );

    @Effect()
    getRefreshTotalSuccess = this.actions$.pipe(ofType<Core.GetInvClassCurrentTotalsSuccess>(Core.GET_INV_CLASS_CURRENT_TOTALS_SUCCESS),
        map(action => new Core.ChangeModel(action.token, { key: ModelProperty.invClassCurrentTotalsViewModel, value: action.data }))
    );

    @Effect()
    requestPoliceStaionInfo$ = this.actions$.pipe(ofType<Core.ChangeModel>(Core.CHANGE_MODEL),
        filter(action => action.event.key === ModelProperty.policeStId),
        map(action => new Core.GetPoliceStationInfoById(action.token, action.event.value))
    );

    @Effect()
    getPoliceStInfo$ = this.actions$.pipe(ofType<Core.GetPoliceStationInfoById>(Core.GET_POLICE_STATION_INFO_BY_ID),
        switchMap(action => this.service.GetPoliceStationInfoById(action.policeStID).pipe(
            map(responce => new Core.GetPoliceStationInfoByIdSuccess(action.token, responce)),
            catchError(() => of(new Core.GetPoliceStationInfoByIdFail(action.token)))
        ))
    );

    @Effect()
    getPoliceStInfoSuccess$ = this.actions$.pipe(ofType<Core.GetPoliceStationInfoByIdSuccess>(Core.GET_POLICE_STATION_INFO_BY_ID_SUCCESS),
        mergeMap(action => [
            new Core.ChangeModel(action.token, { key: ModelProperty.policeStName, value: action.info.policeStName }),
            new Core.ChangeModel(action.token, { key: ModelProperty.schemeId, value: action.info.schemeId }),
            new Core.ChangeModel(action.token, { key: ModelProperty.schemeName, value: action.info.schemeName })
        ]));

    @Effect()
    checkIsValidClossClass$ = this.actions$.pipe(ofType<Core.CheckIsClassClosingValid>(Core.CHECK_CLOSE_CLASS),
        switchMap(action => this.store.select(getClassClosingReqViewModel(action.token)).pipe(
            map(request => ({ request, token: action.token })), take(1)
        )),
        switchMap(action => this.service.CheckIsClassClosingValid(action.request).pipe(
            map(responce => new Core.CheckIsClassClosingValidSuccess(action.token, responce)),
            catchError(() => of(new Core.CheckIsClassClosingValidFail(action.token)))
        ))
    );

    @Effect()
    isValidClossClSuccess$ = this.actions$.pipe(ofType<Core.CheckIsClassClosingValidSuccess>(Core.CHECK_CLOSE_CLASS_SUCCESS),
        switchMap(action => this.store.select(getUser).pipe(map(user => ({ user, action })))),
        mergeMap(({ user, action }) => [
            new Core.ChangeModel(action.token, { key: ModelProperty.billedDate, value: new Date().toDpsString(true) }),
            new Core.ChangeModel(action.token, { key: ModelProperty.closedDate, value: new Date().toDpsString(true) })
        ]));

    @Effect()
    reopenClass$ = this.actions$.pipe(ofType<Core.ReopenClass>(Core.REOPEN_CLASS),
        map(action => new Core.ChangeModel(action.token, { key: ModelProperty.closedDate, value: null }))
    );



}
