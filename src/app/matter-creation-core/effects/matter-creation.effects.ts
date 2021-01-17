import { take, mergeMap, filter, catchError, map, switchMap, tap } from 'rxjs/operators';
import { MatterCreationService } from '../services/matterCreation.service';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as MatterCreation from '../actions/core';
import { from, of } from 'rxjs';
import {
    getSupervisorList, getAppCodeList,
    getMatterInterestSchemeList, getIntroductionList, getTrusAccNoList, getCreditControlStageList, getSundryProfitList,
    getDDABankList, getMatterCategoryListByDepartmentId, getBranchList, getClientDefaults, getLSCDate, getUseFileSecurity,
    getModelByToken, getOpportunityViewModelByToken, getModeByToken
} from '../reducers';
import { Mode, LocalStorageKey } from '../../core';
import { GridRowItemWrapper, checkMatterUFN } from '../../core/lib/matter';
import { MainMenuService, MainMenuItem } from '../../layout-desktop';
import { RefreshData } from '../../matter-widget';
import { RefreshMyTaskWidget } from '../../my-task-widget';
import { RefreshWorkDoneWidget } from '../../work-done-widget';
import * as Menus from '../../layout-desktop/actions/main-menu';
import { OpenCaseMenueData } from './../../core/lib/open-case';
import { RequestUpdateLinkedMatter } from './../../matter-linked-core/actions/core';
import { MenuTabClose } from '../../core/lib/actions';
import { CloseMenuOpenCaseTap } from '../../workflow-menu-core';
import { Matter } from '../models/interfaces';
import { InfoDialogType } from '../../core/utility/DpsUtility';
import { GetDepartment, GetFeeEarnerList, getFeeEarnerList } from '../../shared-data';

@Injectable()
export class MatterCreationEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>,
        private service: MatterCreationService,
        protected pageService: MainMenuService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<MatterCreation.InitMatterCreation>(MatterCreation.INIT_MATTER_CREATION),
        mergeMap(action => from([
            new MatterCreation.GetClientDefaults(action.token),
            new MatterCreation.GetLSCDate(action.token),
            new MatterCreation.GetBranchList(action.token),
            new GetFeeEarnerList(true),
            new MatterCreation.GetSupervisorList(action.token),
            new MatterCreation.GetAppCodeList(action.token),
            new GetDepartment(),
            // new MatterCreation.GetMatterDepartmentList(action.token),
            // new MatterCreation.GetRateCategoryList(action.token),
            new MatterCreation.GetMatterInterestSchemeList(action.token),
            new MatterCreation.GetIntroductionList(action.token),
            new MatterCreation.GetTrusAccNoList(action.token),
            new MatterCreation.GetCreditControlStageList(action.token),
            new MatterCreation.GetSundryProfitList(action.token),
            new MatterCreation.GetDDABankList(action.token),
            new MatterCreation.UseFileSecurity(action.token)
        ])
        ));

    @Effect()
    getInitRateCat$ = this.actions$.pipe(ofType<MatterCreation.InitMatterCreation>(MatterCreation.INIT_MATTER_CREATION),
        filter(action => !action.payload.inputData || !action.payload.inputData.matterId),
        map(action => new MatterCreation.GetRateCategoryList(action.token))
    );

    @Effect()
    getFullMatterData$ = this.actions$.pipe(ofType<MatterCreation.GetFullMatterData>(MatterCreation.GET_FULL_MATTER_DATA),
        switchMap(action => this.service.getFullMatterData(action.payload.matterId).pipe(
            map((result) => new MatterCreation.GetFullMatterDataSuccess(action.token, {
                matterModel: result, matterSeatchList: action.payload.matterSeatchList, matterIndex: action.payload.matterIndex
            })),
            catchError((error) => of(new MatterCreation.GetFullMatterDataFail(action.token,
                { error: error, matterSeatchList: action.payload.matterSeatchList, matterIndex: action.payload.matterIndex }))))
        ));
    @Effect()
    getFullMatterDataSuccess$ = this.actions$.pipe(ofType<MatterCreation.GetFullMatterDataSuccess>
        (MatterCreation.GET_FULL_MATTER_DATA_SUCCESS),
        mergeMap(action =>
            from([
                new MatterCreation.GetCloserProcessing(action.token, { matterRef: action.payload.matterModel.matter.matterRef }),
                new MatterCreation.UpdateCompletionFields(action.token,
                    { mode: Mode.EditMode, matter: action.payload.matterModel.matter }),
                new MatterCreation.CheckFeeEarnerIsUser(action.token, { matterRef: action.payload.matterModel.matter.matterRef }),
                new MatterCreation.CheckFeeEarnerValied(action.token,
                    { matterFeeEarner: action.payload.matterModel.matter.matterFeeEarner }),
                new MatterCreation.GetLegalAidCombosList(action.token,
                    {
                        matterType: action.payload.matterModel.matter.legalMatterType,
                        startDate: action.payload.matterModel.matter.legalCaseStarted
                    }),
                new MatterCreation.GetLAMatterTypesAvailable(action.token,
                    {
                        branchId: action.payload.matterModel.matter.branchID,
                        startDate: action.payload.matterModel.matter.legalCaseStarted
                    }),
                new MatterCreation.GetRateCategoryList(action.token)

            ])));
    @Effect()
    getLeadUFN$ = this.actions$.pipe(ofType<MatterCreation.GetLeadUFN>(MatterCreation.GET_LEAD_UFN),
        switchMap(action => this.service.getLeadUFN(action.payload.fileID, action.payload.branchID).pipe(
            map(result => {
                if (result) {
                    return new MatterCreation.UpdateMatteer(action.token, { property: 'crimeLeadUFN', value: result });
                }
                return new MatterCreation.EmptyLeadUFN(action.token);
            }),
            catchError((error) => of(new MatterCreation.GetLeadUFNFail(action.token, { error: error }))))
        ));
    @Effect()
    addUpdateMatter$ = this.actions$.pipe(ofType<MatterCreation.AddUpdateMatter>(MatterCreation.ADD_UPDATE_MATTER),
        filter(action => !!this.validateData(action.payload.data, action.token)),
        switchMap(action =>
            this.service.addUpdateMatter({
                ...action.payload.data,
                matterId: action.payload.data.matterId || -1,
                masterMatterId: action.payload.data.masterMatterId,
            }).
                pipe(
                    map((result) => new MatterCreation.AddUpdateMatterSuccess(action.token, result,
                        action.payload.openCase, action.closeAfterSave)),
                    catchError((error) => of(new MatterCreation.AddUpdateMatterFail(action.token, { error: error }))))
        ));

    @Effect()
    addUpdateMatterSuccess$ = this.actions$.pipe(ofType<MatterCreation.AddUpdateMatterSuccess>(MatterCreation.ADD_UPDATE_MATTER_SUCCESS),
        map(action => new MatterCreation.UpdateCompletionFields(action.token, { mode: Mode.EditMode, matter: action.payload.matter })));

    @Effect()
    updateDashBoard$ = this.actions$.pipe(ofType<MatterCreation.AddUpdateMatterSuccess>(MatterCreation.ADD_UPDATE_MATTER_SUCCESS),
        mergeMap(action => from([
            new RefreshData,
            new RefreshMyTaskWidget,
            new RefreshWorkDoneWidget,
            new MatterCreation.AndAddDiaryRecords(action.token)
        ])));

    @Effect({ dispatch: false })
    openCase$ = this.actions$.pipe(ofType<MatterCreation.AddUpdateMatterSuccess>(MatterCreation.ADD_UPDATE_MATTER_SUCCESS),
        filter(action => !!action.openCase),
        map(action => {
            const matter: GridRowItemWrapper = {
                data: {
                    branchID: action.payload.matter.branchID,
                    app_Code: action.payload.matter.appCode,
                    fileID: action.payload.matter.fileID ? action.payload.matter.fileID : null,
                    matterReferenceNo: action.payload.matter.matterRef,
                    appID: action.payload.matter.appId ? action.payload.matter.appId : null,
                    closed: action.payload.matter.matterCloseMatter ? 1 : 0,
                    lastUsed: null,
                    feeEarner: action.payload.matter.matterFeeEarner,
                    reviewDate: null,
                    clientName: action.payload.matter.clientName,
                    reviewNote: null,
                    company_Name: null,
                    matterDetails: action.payload.matter.matterDetails,
                    matterCounter: action.payload.matter.matterId,
                    ufnValue: action.payload.matter.ufnValue,
                    eBilling: action.payload.matter.eBilling,
                    isPlotMatter: action.payload.matter.isPlotMatter,
                    isPlotMasterMatter: action.payload.matter.isPlotMasterMatter,
                    isProspectMatter: action.payload.matter.isProspectMatter,
                    isLegalAid: action.payload.matter.isLegalAid
                },
                selected: true,
                expanded: true,
                financeDetails: null
            };

            this.pageService.gotoOpenCase(matter);
            // return new MatterCreation.CloseMaterCreation(action.token);
        }));


    @Effect()
    deleteMatter$ = this.actions$.pipe(ofType<MatterCreation.DeleteMatter>(MatterCreation.DELETE_MATTER),
        switchMap(action =>
            this.service.deleteMatter(action.payload.matterRef, action.payload.appID, action.payload.fileID, action.payload.branchID).pipe(
                map((result) => new MatterCreation.DeleteMatterSuccess(action.token, action.payload.matterRef)),
                catchError((error) => of(new MatterCreation.DeleteMatterFail(action.token, { error: error }))))
        ));

    @Effect({ dispatch: false })
    closeOpenCase$ = this.actions$.pipe(ofType<MatterCreation.DeleteMatterSuccess>(MatterCreation.DELETE_MATTER_SUCCESS),
        map(action => {
            const openCases: MainMenuItem<OpenCaseMenueData>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.OpenCaseMenuItems));
            const selectOpenCase = !!openCases ? openCases.find(c => c.data.matterReferenceNo === action.matterRef) : null;
            if (selectOpenCase) {
                const token = selectOpenCase.token;
                this.store.dispatch(new MenuTabClose({ item: selectOpenCase, nextIndex: 0 }));
                this.store.dispatch(new CloseMenuOpenCaseTap(token));
            }
        }));


    @Effect()
    closerProcessing$ = this.actions$.pipe(ofType<MatterCreation.GetCloserProcessing>(MatterCreation.CLOSURE_PROCESSING),
        switchMap(action =>
            this.service.closerProcessing(action.payload.matterRef).pipe(
                map((result) => new MatterCreation.CloserProcessingSuccess(action.token, result)),
                catchError((error) => of(new MatterCreation.CloserProcessingFail(action.token, { error: error }))))
        ));
    @Effect()
    checkFeeEarnerIsUser$ = this.actions$.pipe(ofType<MatterCreation.CheckFeeEarnerIsUser>(MatterCreation.CHECK_FEE_EARNER_IS_USER),
        switchMap(action =>
            this.service.checkFeeEarnerIsUser(action.payload.matterRef).pipe(
                map((result) => new MatterCreation.CheckFeeEarnerIsUserSuccess(action.token, result)),
                catchError((error) => of(new MatterCreation.CheckFeeEarnerIsUserFail(action.token, { error: error }))))
        ));
    @Effect()
    writeOffNegativeWip$ = this.actions$.pipe(ofType<MatterCreation.WriteOffNegativeWip>(MatterCreation.WRITE_OFF_NEGATIVE_WIP),
        switchMap(action =>
            this.service.writeOffNegativeWip(action.payload.matterRef).pipe(
                map((result) => new MatterCreation.WriteOffNegativeWipSuccess(action.token)),
                catchError((error) => of(new MatterCreation.WriteOffNegativeWipFail(action.token))))
        ));

    // switchMap(action => this.service.writeOffNegativeWip(action.payload.matterRef)));

    @Effect()
    updateClientDefaultsAutoArchNo$ = this.actions$.pipe(ofType<MatterCreation.UpdateClientDefaultsAutoArchNo>
        (MatterCreation.UPDATE_CLIENT_DEFAULTS_AUTO_ARCH_NO),
        switchMap(action => this.service.updateClientDefaultsAutoArchNo()));

    @Effect()
    updateCompletionFields$ = this.actions$.pipe(ofType<MatterCreation.UpdateCompletionFields>(MatterCreation.UPDATE_COMPLETION_FIELDS),
        switchMap(action => {
            if (action.payload.matter.matterCloseMatter && !action.payload.matter.completionArchiveRef) {
                return this.service.getClientDefaults().pipe(mergeMap(result => {
                    const actions = [];
                    if ((action.payload.mode === Mode.EditMode && result.useAutoArchNum) ||
                        (action.payload.mode === Mode.AddMode && result.cD_AutoArch)) {
                        actions.push(new MatterCreation.UpdateMatteer(action.token,
                            { value: result.nextAutoAchNum, property: 'completionArchiveRef' }));
                        actions.push(new MatterCreation.UpdateClientDefaultsAutoArchNo(action.token));
                    }
                    actions.push(new MatterCreation.GetClientDefaultsSuccess(action.token, result));
                    return from(actions);
                }));
            }
            return of();
        }));

    @Effect()
    useFileSecurity$ = this.actions$.pipe(ofType<MatterCreation.UseFileSecurity>(MatterCreation.USE_FILE_SECURITY),
        switchMap(action =>
            this.store.select(getUseFileSecurity).pipe(
                map((value) => ({ value: value, token: action.token })),
                take(1))),
        switchMap(({ value, token }) => {
            if (value === null) {
                return this.service.useFileSecurity().pipe(
                    map((result) => new MatterCreation.UseFileSecuritySuccess(token, result)),
                    catchError((error) => of(new MatterCreation.UseFileSecurityFail(token, { error: error }))));
            } else {
                return of();
            }
        }));

    @Effect()
    getBranchList$ = this.actions$.pipe(ofType<MatterCreation.GetBranchList>(MatterCreation.GET_BRANCH_LIST),
        switchMap(action =>
            this.store.select(getBranchList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getBranchList().pipe(
                    map((result) => new MatterCreation.GetBranchListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetBranchListFail(token, { error: error }))));
            } else {
                this.store.dispatch(new MatterCreation.SetUserBarnchToNewMatter(token));
                return of();
            }
        }));

    @Effect()
    changeInitialBarnch$ = this.actions$.pipe(ofType<MatterCreation.GetAppCodeListSuccess>
        (MatterCreation.GET_APP_CODE_LIST_SUCCESS),
        map(action => new MatterCreation.SetUserBarnchToNewMatter(action.token)));

    @Effect()
    getClientDefaults$ = this.actions$.pipe(ofType<MatterCreation.GetClientDefaults>(MatterCreation.GET_CLIENT_DEFAULTS),
        switchMap(action =>
            this.store.select(getClientDefaults).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getClientDefaults().pipe(
                    map((result) => new MatterCreation.GetClientDefaultsSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetClientDefaultsFail(token, { error: error }))));
            } else {
                return of();
            }
        }));
    @Effect()
    getLSCDate$ = this.actions$.pipe(ofType<MatterCreation.GetLSCDate>(MatterCreation.GET_CLIENT_DEFAULTS),
        switchMap(action =>
            this.store.select(getLSCDate).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getLSCDate('LSC_2013').pipe(
                    map((result) => new MatterCreation.GetLSCDateSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetLSCDateFail(token, { error: error }))));
            } else {
                return of();
            }
        }));
    // @Effect()
    // getFeeEarnerList$ = this.actions$.pipe(ofType<MatterCreation.GetFeeEarnerList>(MatterCreation.GET_FEE_EARNER_LIST),
    //     switchMap(action =>
    //         this.store.select(getFeeEarnerList).pipe(
    //             map((list) => ({ list: list, token: action.token })),
    //             take(1))),
    //     switchMap(({ list, token }) => {
    //         if (!list) {
    //             return this.service.getFeeEarnerList(true).pipe(
    //                 map((result) => new MatterCreation.GetFeeEarnerListSuccess(token, result)),
    //                 catchError((error) => of(new MatterCreation.GetFeeEarnerListFail(token, { error: error }))));
    //         } else {
    //             return of();
    //         }
    //     }));
    @Effect()
    checkFeeEarnerValied$ = this.actions$.pipe(ofType<MatterCreation.CheckFeeEarnerValied>(MatterCreation.CHECK_FEE_EARNER_VALIED),
        switchMap(action =>
            this.store.select(getFeeEarnerList(true)).pipe(
                filter(list => !!list),
                map((list) => ({ list: list, action: action })),
                take(1))),
        map(({ list, action }) => {
            let isValied = false;
            list.forEach(val => {
                if (val.userId.toString() === action.payload.matterFeeEarner) {
                    isValied = true;
                }
            });
            if (isValied) {
                return new MatterCreation.CheckFeeEarnerValiedSuccess(action.token, action.payload);
            } else {
                return new MatterCreation.CheckFeeEarnerValiedFail(action.token, action.payload);
            }
        }));
    @Effect()
    getSupervisorList$ = this.actions$.pipe(ofType<MatterCreation.GetSupervisorList>(MatterCreation.GET_SUPERVISOR_LIST),
        switchMap((action) =>
            this.store.select(getSupervisorList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getSupervisorList().pipe(
                    map((result) => new MatterCreation.GetSupervisorListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetSupervisorListFail(token, { error: error }))));
            } else {
                return of();
            }
        }));

    @Effect()
    getAppCodeList$ = this.actions$.pipe(ofType<MatterCreation.GetAppCodeList>(MatterCreation.GET_APP_CODE_LIST),
        switchMap((action) =>
            this.store.select(getAppCodeList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getAppCodeList().pipe(
                    map((result) => new MatterCreation.GetAppCodeListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetAppCodeListFail(token, { error: error }))));
            } else {
                this.store.dispatch(new MatterCreation.SetInitalPlotSaleModel(token));
                return of();
            }
        }));

    @Effect()
    changeInitialdataForPlotSale$ = this.actions$.pipe(ofType<MatterCreation.GetAppCodeListSuccess>
        (MatterCreation.GET_APP_CODE_LIST_SUCCESS),
        map(action => new MatterCreation.SetInitalPlotSaleModel(action.token)));

    @Effect()
    changeInitialdata$ = this.actions$.pipe(ofType<MatterCreation.ClearMatterData>
        (MatterCreation.CLEAR_MATTER_DATA),
        mergeMap(action => from([new MatterCreation.SetInitalPlotSaleModel(action.token),
        new MatterCreation.SetUserBarnchToNewMatter(action.token)])));

    // @Effect()
    // getMatterDepartmentList$ = this.actions$.pipe(ofType<MatterCreation.GetMatterDepartmentList>
    //     (MatterCreation.GET_MATTER_DEPARTMENT_LIST),
    //     switchMap((action) =>
    //         this.store.select(getMatterDepartmentList).pipe(
    //             map((list) => ({ list: list, token: action.token })),
    //             take(1))),
    //     switchMap(({ list, token }) => {
    //         if (!list) {
    //             return this.service.getMatterDepartmentList().pipe(
    //                 map((result) => new MatterCreation.GetMatterDepartmentListSuccess(token, result)),
    //                 catchError((error) => of(new MatterCreation.GetMatterDepartmentListFail(token, { error: error }))));
    //         } else {
    //             return of();
    //         }
    //     }));

    @Effect()
    getRateCategoryList$ = this.actions$.pipe(ofType<MatterCreation.GetRateCategoryList>(MatterCreation.GET_RATE_CATEGORY_LIST),
        switchMap((action) =>
            this.store.select(getModelByToken(action.token)).pipe(
                map((model) => ({ model: model, token: action.token })),
                take(1))),
        switchMap(({ model, token }) => {
            let eBilling;
            if (!!model && !!model.matter && !!model.matter.eBilling) {
                eBilling = model.matter.eBilling;
            }
            return this.service.getRateCategoryList(eBilling).pipe(
                map((result) => new MatterCreation.GetRateCategoryListSuccess(token, result)),
                catchError((error) => of(new MatterCreation.GetRateCategoryListFail(token, { error: error }))));
        }));

    @Effect()
    getMatterInterestSchemeList$ = this.actions$.pipe(ofType<MatterCreation.GetMatterInterestSchemeList>
        (MatterCreation.GET_MATTER_INTEREST_SCHEME_LIST),
        switchMap((action) =>
            this.store.select(getMatterInterestSchemeList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getMatterInterestSchemeList().pipe(
                    map((result) => new MatterCreation.GetMatterInterestSchemeListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetMatterInterestSchemeListFail(token, { error: error }))));
            } else {
                return of();
            }
        }));

    @Effect()
    getIntroductionList$ = this.actions$.pipe(ofType<MatterCreation.GetIntroductionList>(MatterCreation.GET_INTRODUCTION_LIST),
        switchMap((action) =>
            this.store.select(getIntroductionList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getIntroductionList().pipe(
                    map((result) => new MatterCreation.GetIntroductionListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetIntroductionListFail(token, { error: error }))));
            } else {
                return of();
            }
        }));

    @Effect()
    getTrusAccNoList$ = this.actions$.pipe(ofType<MatterCreation.GetTrusAccNoList>(MatterCreation.GET_TRUS_ACC_NO_LIST),
        switchMap((action) =>
            this.store.select(getTrusAccNoList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getTrusAccNoList().pipe(
                    map((result) => new MatterCreation.GetTrusAccNoListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetTrusAccNoListFail(token, { error: error }))));
            } else {
                return of();
            }
        }));

    @Effect()
    getCreditControlStageList$ = this.actions$.pipe(ofType<MatterCreation.GetCreditControlStageList>
        (MatterCreation.GET_CREDIT_CONTROL_STAGE_LIST),
        switchMap((action) =>
            this.store.select(getCreditControlStageList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getCreditControlStageList().pipe(
                    map((result) => new MatterCreation.GetCreditControlStageListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetCreditControlStageListFail(token, { error: error }))));
            } else {
                return of();
            }
        }));

    @Effect()
    getSundryProfitList$ = this.actions$.pipe(ofType<MatterCreation.GetSundryProfitList>(MatterCreation.GET_SUNDRY_PROFIT_LIST),
        switchMap((action) =>
            this.store.select(getSundryProfitList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getSundryProfitList().pipe(
                    map((result) => new MatterCreation.GetSundryProfitListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetSundryProfitListFail(token, { error: error }))));
            } else {
                return of();
            }
        }));

    @Effect()
    getDDABankList$ = this.actions$.pipe(ofType<MatterCreation.GetDDABankList>(MatterCreation.GET_DDA_BANK_LIST),
        switchMap((action) =>
            this.store.select(getDDABankList).pipe(
                map((list) => ({ list: list, token: action.token })),
                take(1))),
        switchMap(({ list, token }) => {
            if (!list) {
                return this.service.getDDABankList().pipe(
                    map((result) => new MatterCreation.GetDDABankListSuccess(token, result)),
                    catchError((error) => of(new MatterCreation.GetDDABankListFail(token, { error: error }))));
            } else {
                return of();
            }
        }));

    // @Effect()
    // getMatterCategoryList$ = this.actions$.pipe(ofType<MatterCreation.GetMatterCategoryList>(MatterCreation.GET_MATTER_CATEGORY_LIST),
    //     switchMap((action) =>
    //         this.store.select(getMatterCategoryListByDepartmentId(action.payload.departmentId)).pipe(
    //             map((list) => ({ list: list, action: action })),
    //             take(1))),
    //     switchMap(({ list, action }) => {
    //         if (!list) {
    //             return this.service.getMatterCategoryList(action.payload.departmentId).pipe(
    //                 map((result) => new MatterCreation.GetMatterCategoryListSuccess(action.token,
    //                     { departmentId: action.payload.departmentId, dropdownList: result })),
    //                 catchError((error) => of(new MatterCreation.GetMatterCategoryListFail(action.token, { error: error }))));
    //         } else {
    //             return of();
    //         }
    //     }));

    @Effect()
    getLAMatterTypesAvailable$ = this.actions$.pipe(ofType<MatterCreation.GetLAMatterTypesAvailable>
        (MatterCreation.GET_LA_MATTER_TYPES_AVAILABLE),
        switchMap(action => {
            if (action.payload.branchId && action.payload.startDate) {
                return this.service.getLAMatterTypesAvailable(action.payload.branchId, action.payload.startDate).pipe(
                    map((result) => new MatterCreation.GetLAMatterTypesAvailableSuccess(action.token, result)),
                    catchError((error) => of(new MatterCreation.GetLAMatterTypesAvailableFail(action.token, { error: error }))));
            }
            return of();
        }));
    @Effect()
    getLegalAidCombosList$ = this.actions$.pipe(ofType<MatterCreation.GetLegalAidCombosList>
        (MatterCreation.GET_LEAGAL_AID_COMBOS_LIST),
        filter(action => !!(action.payload.matterType && action.payload.startDate)),
        switchMap(action => this.service.getLegalAidCombosList(action.payload.matterType, action.payload.startDate).pipe(
            map((result) => new MatterCreation.GetLegalAidCombosListSuccess(action.token, result)),
            catchError((error) => of(new MatterCreation.GetLegalAidCombosListFail(action.token, { error: error }))))
        ));

    @Effect()
    getFileIsLocked$ = this.actions$.pipe(ofType<MatterCreation.GetFileIsLocked>(MatterCreation.GET_FILE_IS_LOCKED),
        switchMap(action =>
            this.service.getFileIsLocked(action.payload.appID, action.payload.fileID, action.payload.branchID).pipe(
                map((result) => new MatterCreation.GetFileIsLockedSuccess(action.token,
                    { data: result, branchID: action.payload.branchID })),
                catchError((error) => of(new MatterCreation.GetFileIsLockedFail(action.token, { error: error }))))
        ));
    @Effect()
    getFileIsLockedSuccess$ = this.actions$.pipe(ofType<MatterCreation.GetFileIsLockedSuccess>(MatterCreation.GET_FILE_IS_LOCKED_SUCCESS),
        filter(action => action.payload.data[0].errorCode === 'Locked'),
        switchMap((action) =>
            this.store.select(getModelByToken(action.token)).pipe(
                map((model) => ({ model: model, action: action })),
                take(1))),
        mergeMap(({ model, action }) =>
            from([
                new MatterCreation.UpdateMatteer(action.token, { property: 'branchID', value: action.payload.branchID }),
                new MatterCreation.GetLAMatterTypesAvailable(action.token,
                    {
                        branchId: action.payload.branchID,
                        startDate: model.matter.legalCaseStarted
                    })
            ])
        ));


    @Effect()
    checkOutstandingUndertakings$ = this.actions$.pipe(ofType<MatterCreation.CheckOutstandingUndertakings>
        (MatterCreation.CHECK_OUTSTANDING_UNDERTAKINGS),
        switchMap(action =>
            this.service.checkOutstandingUndertakings(action.payload.matterRef).pipe(
                map(result => {
                    if (result && (action.payload.mode === Mode.AddMode || action.payload.matterId)) {
                        return new MatterCreation.HasOutstandingUndertakings(action.token);
                    }
                    return new MatterCreation.CheckUnreconciledItems(action.token, action.payload);
                }),
                catchError((error) => of(new MatterCreation.CheckOutstandingUndertakingsFail(action.token, { error: error }))))
        ));
    @Effect()
    checkUnreconciledItems$ = this.actions$.pipe(ofType<MatterCreation.CheckUnreconciledItems>(MatterCreation.CHECK_UNRECONCILED_ITEMS),
        switchMap(action =>
            this.service.checkUnreconciledItems(action.payload.matterRef).pipe(
                filter(result => !!(result && (action.payload.mode === Mode.AddMode || action.payload.matterId))),
                map(result => new MatterCreation.HasUnreconciledItems(action.token)),
                catchError((error) => of(new MatterCreation.CheckUnreconciledItemsFail(action.token, { error: error }))))
        ));

    @Effect()
    hasOutstandingUndertakings$ = this.actions$.pipe(ofType<MatterCreation.HasOutstandingUndertakings>
        (MatterCreation.HAS_OUTSTANDING_UNDERTAKINGS),
        mergeMap(action => from([
            new MatterCreation.UpdateMatteer(action.token, { property: 'matterCloseMatter', value: false }),
            new MatterCreation.UpdateMatteer(action.token, { property: 'matterClosedate', value: null })])));

    // @Effect()
    // getAppId$ = this.actions$.pipe(ofType<MatterCreation.GetAppIdByDepartmentChange>(MatterCreation.GET_APP_ID_BY_DEPARTMENT),
    //     switchMap((action) =>
    //         combineLatest(this.store.select(getAppCodeList),
    //             this.store.select(getModeByToken(action.token)),
    //             ((list, mode) => ({ list, mode, action }))
    //         ).pipe(take(1)),
    //         // this.store.select(getModeByToken).pipe(
    //         //     map((list) => ({ list, action })),
    //         //     take(1))
    //     ),
    //     filter(({ list, mode, action }) => mode !== Mode.EditMode),
    //     switchMap(({ list, mode, action }) =>
    //         this.service.GetAppIdByDepartmentId(action.payload.departmentId).pipe(
    //             mergeMap((result) => {
    //                 const item = list.find(val => val.key === result);
    //                 return from([new MatterCreation.UpdateMatteer(action.token, { property: 'appId', value: result }),
    //                 new MatterCreation.UpdateMatteer(action.token, {
    //                     property: 'appCode',
    //                     value: item ? item.value : ''
    //                 })]);
    //             }),
    //             catchError((error) => of(new MatterCreation.GetAppIdByDepartmentChangeFail(action.token, error))))
    //     ));


    // @Effect()
    // feeEarnerChange$ = this.actions$.pipe(ofType<MatterCreation.FeeEarnerChange>(MatterCreation.MATTER_FEE_EARNER_CHANGE),
    //     switchMap(action => {
    //         if (action.payload.feeEarner) {
    //             return this.service.GetFeeEarnerDefaultDepartmentSupervisorBranchID(action.payload.feeEarner).pipe(
    //                 mergeMap(result => {
    //                     if ((action.payload.mode === Mode.AddMode && action.payload.feeEarner && result)) {
    // return from([new MatterCreation.UpdateMatteer(action.token, { property: 'branchID', value: result.branchId }),
    //                         new MatterCreation.UpdateMatteer(action.token, {
    //                             property: 'matterDepartment',
    //                             value: result.department ? +result.department : -1
    //                         }),
    //  new MatterCreation.UpdateMatteer(action.token, { property: 'matterSupervisor', value: result.supervisorRef }),
    //                         new MatterCreation.GetAppIdByDepartmentChange(action.token,
    //                             { departmentId: result.department ? +result.department : -1 })
    //                         ]);
    //                     } else {
    //                         return of();
    //                     }

    //                 }));
    //         }
    //         return of();
    //     }));

    @Effect()
    andAddDiaryRecords$ = this.actions$.pipe(ofType<MatterCreation.AndAddDiaryRecords>(MatterCreation.ADD_DIARY_RECORD),
        switchMap((action) =>
            this.store.select(getOpportunityViewModelByToken(action.token)).pipe(
                map((model) => ({ model: model, action: action })),
                take(1))),
        filter(data => !!(data && data.model && data.model.opportunityId)),
        switchMap((info) =>
            this.service.AddDiaryRecords(info.model).pipe(
                map((result) => new MatterCreation.AndAddDiaryRecordsSuccess(info.action.token, { responceData: result })),
                catchError((error) => of(new MatterCreation.AndAddDiaryRecordsFail(info.action.token, { error: error }))))
        ));


    @Effect()
    updatePlotLinkedMatters$ = this.actions$.pipe(ofType<MatterCreation.AddUpdateMatterSuccess>
        (MatterCreation.ADD_UPDATE_MATTER_SUCCESS), tap((result) => {
            console.log(result);
        }),
        filter(action => action.payload.matter && action.payload.matter.isPlotMasterMatter),
        map(action => new RequestUpdateLinkedMatter(action.token, action.payload.matter.matterRef)));


    @Effect()
    matterSaveSuccess$ = this.actions$.pipe(ofType<MatterCreation.AddUpdateMatterSuccess>(MatterCreation.ADD_UPDATE_MATTER_SUCCESS),
        map((action) => {
            return new Menus.MenuItemOpenCaseMatterDatilsUpdate({ matter: action.payload.matter });
        }));

    @Effect()
    refreshRateCategary$ = this.actions$.pipe(ofType<MatterCreation.UpdateMatteer>(MatterCreation.UPDATE_MATTER),
        filter(action => action.payload.property === 'eBilling'),
        map(action => new MatterCreation.GetRateCategoryList(action.token)));


    validateData(matter: Matter, token: string): boolean {
        let errorMsg;
        // validate ufn date
        if (matter && !!matter.crimeUFN) {
            const result = checkMatterUFN(matter.crimeUFN);
            errorMsg = !result.isValid ? result.msg : null;
        }
        if (!!errorMsg) {
            this.store.dispatch(new MatterCreation.ShowMessage(token, 'Matter Save', errorMsg, InfoDialogType.warning));
            return false;
        } else {
            return true;
        }
    }

}
