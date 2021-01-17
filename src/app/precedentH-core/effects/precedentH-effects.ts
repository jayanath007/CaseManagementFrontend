
import { mergeMap, catchError, take, map, switchMap } from 'rxjs/operators';

import { SystemJsPopupLoaderService } from '../../shell-desktop/services/system-js-popup-loader.service';
import { MatDialog } from '@angular/material';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { PrecedentHService } from '../services/precedentH.service';
import { of, from, combineLatest } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { uuid } from '../../utils/uuid';
import * as Core from '../actions/core';
import { PrecedentHInput, PrecedentHS } from '../models/interfaces';
import {
    getMatterInfoByToken, getPrecedentHSListByToken, getSelectedEstmateValueByToken,
    getFeeEarnerTimeRatesSaveByToken,
    getEstimateValueChangesByToken,
    getSelectedWorkTypeIdByToken,
    getTotalProfitCostByToken
} from '../reducers/index';
import { eBillingType } from '../../core/lib/matter';

@Injectable()
export class PrecedentHEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: PrecedentHService,
        private urlResolver: FileUrlResolverService, private dialog: MatDialog, private popupService: SystemJsPopupLoaderService) {
    }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitPage>(Core.INIT_PRECEDENTH),
        mergeMap((action) => {
            if (action && action.payload.inputData && action.payload.inputData.eBilling === eBillingType.PrecedentS) {
                return from([
                    new Core.LoadPrecedentSList(action.token),
                ]);
            } else if (action && action.payload.inputData && action.payload.inputData.eBilling === eBillingType.PrecedentH) {
                return from([new Core.LoadPrecedentHDataList(action.token),
                new Core.GetPresidentHEstimatedCost(action.token),
                ]);
            } else {
                return [];
            }
        }));

    @Effect()
    getPrecedentSList$ = this.actions$.pipe(ofType<Core.LoadPrecedentSList>(Core.LOAD_PRECEDENTS_PHASE),
        switchMap((action) =>
            this.store.select(getMatterInfoByToken(action.token)).pipe(
                map((matterInfo: PrecedentHInput) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap<any, Core.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getPrecedentSList(info.matterInfo).pipe(
                    map((result) => new Core.LoadPrecedentSListSuccess(info.token, { precedentSList: result })),
                    catchError((error) => of(new Core.LoadPrecedentSListFail(info.token, error))));
            } else {
                return of();
            }
        }));
    @Effect()
    getWorkType$ = this.actions$.pipe(ofType<Core.LoadPrecedentHDataList>(Core.LOAD_PRECEDENTH_WORK_TYPE),
        switchMap((action) =>
            this.store.select(getMatterInfoByToken(action.token)).pipe(
                map((matterInfo: PrecedentHInput) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap<any, Core.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getPrecedentHDataList(info.matterInfo).pipe(
                    map((result) => new Core.LoadPrecedentHDataListSuccess(info.token, { precedentHList: result })),
                    catchError((error) => of(new Core.LoadPrecedentHDataListFail(info.token, error))));
            } else {
                return of();
            }
        }));
    @Effect()
    savePrecedentHS$ = this.actions$.pipe(ofType<Core.SavePrecedentHS>(Core.SAVE_PRESEDENT_HS),
        switchMap((action) =>
            combineLatest(
                this.store.select(getPrecedentHSListByToken(action.token)),
                this.store.select(getMatterInfoByToken(action.token)),
                ((hSDataList, matterInfo) => ({
                    hSDataList,
                    matterInfo,
                    token: action.token
                }))
            ).pipe(take(1))),
        switchMap((info) =>

            this.service.savePrecedentHS(info.matterInfo, info.hSDataList).pipe(
                map((result) => new Core.SavePrecedentHSSuccess(info.token, result)),
                catchError((error) => of(new Core.SavePrecedentHSFail(info.token, error))))
        ));

    @Effect()
    exportXML$ = this.actions$.pipe(ofType<Core.ExportPrecedentHSXML>(Core.EXPORT_PRECEDENT_HS_XML),
        switchMap((action) =>
            this.store.select(getMatterInfoByToken(action.token)).pipe(
                map((matterInfo: PrecedentHInput) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.exportXML(info.matterInfo).pipe(
                map((result) => new Core.ExportPrecedentHSXMLSuccess(info.token, result)),
                catchError((error) => of(new Core.ExportPrecedentHSXMLFAIL(info.token, error))))
        ));


    @Effect()
    getWorkTypeList$ = this.actions$.pipe(ofType<Core.GetWorkTypeList>(Core.GET_WORK_TYPE_LIST),
        switchMap((action) =>
            this.service.getWorkTypeList().pipe(
                map((result) => new Core.GetWorkTypeListSuccess(action.token, { workTypeList: result })),
                catchError((error) => of(new Core.GetWorkTypeListFail(action.token, error))))
        ));



    @Effect()
    changeWorkType$ = this.actions$.pipe(ofType<Core.SavePrecidentHRatesSuccess>(Core.SAVE_PRECIDENT_H_RATES_SUCCESS),
        map((action) => {

            return new Core.GetPresidentHEstimatedCostSuccess(action.token, { presidentHData: action.payload.responce });

        }));
    @Effect()
    getEstimatedCost$ = this.actions$.pipe(ofType<Core.GetPresidentHEstimatedCost>(Core.GET_PRESIDENTH_ESTIMATED_COST),
        switchMap((action) =>
            this.store.select(getMatterInfoByToken(action.token)).pipe(
                map((matterInfo: PrecedentHInput) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap((info) =>
            this.service.getPrecidentHData(info.matterInfo).pipe(
                map((result) => new Core.GetPresidentHEstimatedCostSuccess(info.token, { presidentHData: result })),
                catchError((error) => of(new Core.GetPresidentHEstimatedCostFail(info.token, error))))
        ));





    @Effect()
    setDefaultworktype$ = this.actions$.pipe(ofType<Core.GetPresidentHEstimatedCostSuccess>
        (Core.GET_PRESIDENTH_ESTIMATED_COST_SUCCESS),
        map((action) => {

            return new Core.SetDefaultWorkType(action.token);

        }));


    @Effect()
    savePrecedentHRates$ = this.actions$.pipe(ofType<Core.SavePrecidentHRates>(Core.SAVE_PRECIDENT_H_RATES),
        switchMap((action) =>
            combineLatest(
                this.store.select(getSelectedEstmateValueByToken(action.token)),
                this.store.select(getMatterInfoByToken(action.token)),
                this.store.select(getFeeEarnerTimeRatesSaveByToken(action.token)),
                this.store.select(getEstimateValueChangesByToken(action.token)),
                this.store.select(getSelectedWorkTypeIdByToken(action.token)),
                this.store.select(getTotalProfitCostByToken(action.token)),

                ((selectEstimateValues, matterInfo, feeEarnerTimeRates, estimateValueChanges, selectedWorkTypeId, totalValues) => ({
                    selectEstimateValues,
                    matterInfo,
                    feeEarnerTimeRates,
                    estimateValueChanges,
                    selectedWorkTypeId,
                    totalValues,
                    token: action.token
                }))
            ).pipe(take(1))),
        switchMap((info) =>

            this.service.savePrecedentHRates(info.matterInfo, info.selectEstimateValues,
                info.feeEarnerTimeRates, info.estimateValueChanges, info.selectedWorkTypeId, info.totalValues).pipe(
                    map((result) => new Core.SavePrecidentHRatesSuccess(info.token, { responce: result })),
                    catchError((error) => of(new Core.SavePrecidentHRatesFail(info.token, error))))
        ));

    // @Effect()
    // getPhaseDescriptionList$ = this.actions$.ofType<Core.LoadPrecedentSList>(Core.LOAD_PRECEDENTS_PHASE)
    //     .switchMap((action) =>
    //         this.service.getPrecedentSList()
    //             .map((result) => new Core.LoadPrecedentSListSuccess(action.token, { phaseList: result }))
    //             .do(value => console.log('Phase list result:', value))
    //             .catch((error) => of(new Core.LoadPrecedentSListFail(action.token, error)))
    //     );
}
