import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as ClassInfo from '../actions/class-information';
import { map, mergeMap, switchMap, catchError, filter, take, switchMapTo } from 'rxjs/operators';
import { ModelProperty, Message } from '../models/enum';
import { ProceedingsClassServices } from '../service/proceedings-class-services';
import { of, combineLatest } from 'rxjs';
import * as selector from '../reducers';
import { InfoDialogType } from '../../core/utility/DpsUtility';
import { ClassTotalRequest } from '../models/classTotalRequest';
@Injectable()
export class ProceedingClassInfoEffect {
    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private service: ProceedingsClassServices) { }

    @Effect()
    initProceddingClassInfo$ = this.actions$.pipe(ofType<ClassInfo.InitCrimeProceedingClassInfo>
        (ClassInfo.INIT_PROCEEDING_CASE_INFORMATION),
        map(action => ({
            crimeClassIdentityViewModel: {
                fileId: action.crimeClassIdentityViewModel.fileId,
                branchId: action.crimeClassIdentityViewModel.branchId,
                classId: action.crimeClassIdentityViewModel.classId
            }, token: action.token
        })),
        map(info =>
            new ClassInfo.GetClassInfo(info.token, info.crimeClassIdentityViewModel))
    );

    @Effect()
    GetClassInfo$ = this.actions$.pipe(ofType<ClassInfo.GetClassInfo>(ClassInfo.GET_CLASS_INFO),
        switchMap(action => this.service.getClassInfo(action.request).pipe(
            map(responce => new ClassInfo.GetClassInfoSuccess(action.token, responce)),
            catchError(() => of(new ClassInfo.GetClassInfoFail(action.token))
            ))));


    // @Effect()
    // GetInitalTotal$ = this.actions$.pipe(ofType<ClassInfo.GetClassInfoSuccess>(ClassInfo.GET_CLASS_INFO_SUCCESS),
    //     map(action => new ClassInfo.GetClassTotal(action.token))
    // );

    @Effect()
    GetClassTotal$ = this.actions$.pipe(ofType<ClassInfo.GetClassTotal>(ClassInfo.GET_CLASS_TOTAL),
        switchMap(action =>
            combineLatest(
                this.store.select(selector.getInfomationModel(action.token)),
                this.store.select(selector.getClassIdentity(action.token)),
                ((model, classIdentity) =>
                    ({ model, classIdentity, token: action.token }))
            ).pipe(take(1))),
        switchMap(info => this.service.getClassTotal(new ClassTotalRequest(info.classIdentity, info.model)).pipe(
            map(responce => new ClassInfo.GetClassTotalSuccess(info.token, responce)),
            catchError(() => of(new ClassInfo.GetClassTotalFail(info.token))
            ))));

    @Effect()
    reFreshTotals$ = this.actions$.pipe(ofType<ClassInfo.ChangeModel>(ClassInfo.CHANGE_MODEL),
        filter(action => !!action.event && this.isTotalChange(action.event.key)),
        map(action => new ClassInfo.GetClassTotal(action.token))
    );

    @Effect()
    validateChanges$ = this.actions$.pipe(ofType<ClassInfo.RequestToChangeModel>(ClassInfo.REQUEST_TO_CHANGE_MODEL),
        map(action => {
            if (this.checkIsNumberOnly(action.event.key)) {
                const newValue = isNaN(action.event.value) ? 0 : parseInt(action.event.value, 0);
                return new ClassInfo.ChangeModel(action.token, { key: action.event.key, value: newValue });
            } else if (action.event.key === ModelProperty.representationOrderDateAppliedFor) {
                if (!this.checkRepresentationOrderDateIsValid(action.event.value)) {
                    this.store.dispatch(new ClassInfo.ChangeModel(action.token, {
                        key: ModelProperty.representationOrderDateAppliedFor,
                        value: null
                    }))
                    return new ClassInfo.ShowMessage(action.token, 'DPS Crime Module',
                        Message.InvalidRepresentationOrderDate, InfoDialogType.warning);
                }
            }
            return new ClassInfo.ChangeModel(action.token, action.event);
        })
    );

    // @Effect()
    // getStageReachedList$ = this.actions$.pipe(ofType<ClassInfo.GetStageReachedValues>
    //     (ClassInfo.GET_STAGE_REACHED_VALUES_FOR_PROEEDING_CLS_INFO),
    //     switchMap(action => this.service.GetStageReachedValues().pipe(
    //         map(responce => new ClassInfo.GetStageReachedValuesSuccess(action.token, responce)),
    //         catchError(() => of(new ClassInfo.GetStageReachedValuesFail(action.token))
    //         ))));

    // @Effect()
    // getMatterTypeList$ = this.actions$.pipe(ofType<ClassInfo.GetMatterTypeValues>(ClassInfo.GET_MATTER_TYPE_VALUES_FOR_PROEEDING_CLS_INFO),
    //     switchMap((action) => this.store.select(selector.getMatterTypeList(action.token)).pipe(
    //         take(1),
    //         map(matterType => ({ matterType: matterType, request: action.request, token: action.token })))),
    //     filter(info => info.matterType.length === 0),
    //     switchMap((info) => this.service.GetMatterTypeValues().pipe(
    //         map(responce => new ClassInfo.GetMatterTypeValuesSuccess(info.token, responce)),
    //         catchError(() => of(new ClassInfo.GetMatterTypeValuesFail(info.token))
    //         ))));

    // @Effect()
    // getOutComeCode$ = this.actions$.pipe(ofType<ClassInfo.GetOutComeCodeValues>
    //     (ClassInfo.GET_OUT_COME_CODE_VALUES_FOR_PROEEDING_CLS_INFO),
    //     switchMap((action) => this.store.select(selector.getOutComeCodeList(action.token)).pipe(take(1),
    //         map(outComeCode => ({ outComeCode: outComeCode, request: action.request, token: action.token })))),
    //     filter(info => info.outComeCode.length === 0),
    //     switchMap((info) => this.service.GetOutComeCode().pipe(
    //         map(responce => new ClassInfo.GetOutComeCodeValuesSuccess(info.token, responce)),
    //         catchError(() => of(new ClassInfo.GetOutComeCodeValuesFail(info.token))
    //         ))));

    // @Effect()
    // getCaseTypes$ = this.actions$.pipe(ofType<ClassInfo.GetCaseTypeValues>
    //     (ClassInfo.GET_CASE_TYPE_FOR_PROEEDING_CLS_INFO),
    //     switchMap((action) => this.store.select(selector.getCaseTypeList(action.token)).pipe(take(1),
    //         map(caseTypes => ({ caseTypes: caseTypes, request: action.request, token: action.token })))),
    //     filter(info => info.caseTypes.length === 0),
    //     switchMap((info) => this.service.GetCaseTypes().pipe(
    //         map(responce => new ClassInfo.GetCaseTypeValuesSuccess(info.token, responce)),
    //         catchError(() => of(new ClassInfo.GetCaseTypeValuesFail(info.token))
    //         ))));

    @Effect()
    validateModel$ = this.actions$.pipe(ofType<ClassInfo.RequestToSave>(ClassInfo.REQUEST_TO_SAVE),
        switchMap(action =>
            combineLatest(
                this.store.select(selector.getInfomationModel(action.token)),
                this.store.select(selector.getFilterdStageReachedList(action.token)),
                this.store.select(selector.getFilterdCaseTypeList(action.token)),
                ((model, filterdStageReached, filterdCaseType) =>
                    ({ model, filterdStageReached, filterdCaseType, token: action.token }))
            ).pipe(take(1))),
        map(data => {
            if (!data.filterdStageReached || !data.filterdStageReached.find(i => i.key === data.model[ModelProperty.stageReached])) {
                return new ClassInfo.ShowMessage(data.token, 'DPS Crime Module',
                    'Stage Reached should not be empty. Please select a Stage Reached', InfoDialogType.warning);
            } else if (!data.filterdCaseType || !data.filterdCaseType.find(i => i.value === data.model[ModelProperty.caseType])) {
                return new ClassInfo.ShowMessage(data.token, 'DPS Crime Module',
                    'Case Type should not be empty. Please select a Case Type', InfoDialogType.warning);
            } else if (!data.model[ModelProperty.representationOrderDateAppliedFor]) {
                return new ClassInfo.ShowMessage(data.token, 'DPS Crime Module',
                    'Representation Order Date not be empty, Please select a date', InfoDialogType.warning);
            } else if (!this.checkRepresentationOrderDateIsValid(data.model[ModelProperty.representationOrderDateAppliedFor])) {
                return new ClassInfo.ShowMessage(data.token, 'DPS Crime Module',
                    Message.InvalidRepresentationOrderDate, InfoDialogType.warning);
            } else {
                return new ClassInfo.Save(data.token, data.model);
            }
        }));


    @Effect()
    save$ = this.actions$.pipe(ofType<ClassInfo.Save>(ClassInfo.SAVE),
        switchMap(action => this.service.Save(action.model).pipe(
            map(responce => new ClassInfo.SaveSuccess(action.token)),
            catchError(() => of(new ClassInfo.SaveFail(action.token))
            ))));

    @Effect()
    SaveSuccess$ = this.actions$.pipe(ofType<ClassInfo.SaveSuccess>(ClassInfo.SAVE_SUCCESS),
        map(action => new ClassInfo.GetClassTotal(action.token)));

    @Effect()
    loadLocationLookupData$ = this.actions$.pipe(ofType<ClassInfo.GetLocationLookupData>(ClassInfo.GET_LOCATION_LOOKUP_DATA),
        switchMap(action =>
            this.store.select(selector.getLocationLookupDataByToken(action.token)).pipe(
                map(lookupData => ({
                    lookupData,
                    token: action.token,
                    lookupType: action.lookupType,
                    searchText: action.searchText,
                })), take(1))
        )
        , switchMap<any, any>(info => {
            if (info.lookupData && info.lookupData.length === 0) {
                return this.service.GetLookupData(info.lookupType).pipe(
                    map(result => new ClassInfo.GetLocationLookupDataSuccess(info.token, info.lookupType, result, info.searchText)),
                    catchError(() => of(new ClassInfo.GetLocationLookupDataFail(info.token))));
            } else {
                return of(new ClassInfo.OpenLoockupPopup(info.token, info.lookupType, info.lookupData, info.searchText));
            }
        }));

    @Effect()
    openAttendeesLockup$ = this.actions$.pipe(ofType<ClassInfo.GetLocationLookupDataSuccess>
        (ClassInfo.GET_LOCATION_LOOKUP_DATA_SUCCESS),
        map(action => new ClassInfo.OpenLoockupPopup(action.token, action.lookupType, action.data, action.searchText)));

    checkIsNumberOnly(property: ModelProperty): boolean {
        switch (property) {
            case ModelProperty.travUplifts:
            case ModelProperty.waitUplifts:
            case ModelProperty.attUplifts:
            case ModelProperty.prepUplifts:
            case ModelProperty.advoUplifts:
            case ModelProperty.letterUplifts:
            case ModelProperty.callsUplifts:
                return true;
            default:
                return false;
        }
    }

    checkRepresentationOrderDateIsValid(date: string) {
        return new Date(date) >= new Date('01/01/2016');
    }

    isTotalChange(type: ModelProperty): boolean {
        if (type === ModelProperty.stageReached ||
            type === ModelProperty.caseType ||
            type === ModelProperty.urbanRates ||
            type === ModelProperty.doNotClaimVATChecked ||
            type === ModelProperty.committedToCrownCourt ||
            type === ModelProperty.roNotGranted ||
            type === ModelProperty.representationOrderWithdrawnDate ||
            type === ModelProperty.extradition ||
            type === ModelProperty.isEnhancedRates ||
            type === ModelProperty.travUplifts ||
            type === ModelProperty.waitUplifts ||
            type === ModelProperty.attUplifts ||
            type === ModelProperty.prepUplifts ||
            type === ModelProperty.advoUplifts ||
            type === ModelProperty.letterUplifts ||
            type === ModelProperty.callsUplifts) {
            return true;
        }
        return false;
    }

}
