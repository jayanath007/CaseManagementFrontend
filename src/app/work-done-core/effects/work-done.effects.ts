import { filter, mergeMap, catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, combineLatest, from, empty } from 'rxjs';
import { WorkDoneService } from '../services/work-done-services';
import * as Core from '../actions/core';
import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';
import { InitTeamMember } from '../../team-member-core';
import { ChangeDepartmentOrFeeEranerState } from '../../team-member-core/actions/team-member';
import { DatePipe } from '@angular/common';
import {
    getWorkDoneSepartmentsByToken, getWorkDoneSelectedInfoByToken, getWorkDoneColumnDefByToken,
    getWorkDonePeginatorDefByToken,
    getWorkDoneGridDataByToken, getWorkDoneStateByToken, getGroupModeByToken
} from '../reducers';
import { GridRequest } from '../models/request';
import { gridFilterKind } from '../models/enumeration';
import { FileUrlResolverService } from '../../document-view';
import { TeamMemberOpenFrom } from '../../team-member-core/models/enums';
import { ADD_UPDATE_MATTER_SUCCESS, AddUpdateMatterSuccess } from '../../matter-creation-core';
import { ADD_UPDATE_CLIENT_SUCCESS, AddUpdateClientSuccess } from '../../client-creation-core';
import { GroupMode } from '../models/interfce';
import { TimeRecordClose, TIME_RECORD_CLOSE } from './../../shared-data/actions/time-record';
import { getFileTypeByFullFileName } from '../../core/utility/DpsUtility';
import { WebViewService } from '../../azure-storage';
import { v3CanViewExtensions } from '../../core';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MainMenuService } from '../../layout-desktop';

@Injectable()
export class WorkDoneEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: WorkDoneService, private datePipe: DatePipe,
        private mainMenuService: MainMenuService, private webViewService: WebViewService) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<Core.InitWorkDone>(Core.INIT_WORK_DONE),
        mergeMap((action) =>
            combineLatest(this.store.select(getWorkDoneSepartmentsByToken(action.token)),
                (department) => ({ department })).pipe(
                    take(1),
                    mergeMap((info) => {
                        if (!info.department || info.department.length === 0) {
                            return from([
                                new Core.LoadDepartments(action.token),
                                new Core.LoadPeriods(action.token),
                                new InitTeamMember('TEAM_MEMBER_DATA_WORK_DONE', TeamMemberOpenFrom.Work_Done)]
                            );
                        }
                        return from([]);
                    }))));

    @Effect()
    loadDepartment$ = this.actions$.pipe(ofType<Core.LoadDepartments>(Core.LOAD_DEPARTMENTS),
        switchMap((action) =>
            this.service.getDepartments().pipe(
                map((result) => new Core.LoadDepartmentsSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadDepartmentsFail(action.token, error))))
        ));


    @Effect()
    loadPeriods$ = this.actions$.pipe(ofType<Core.LoadPeriods>(Core.LOAD_PERIODS),
        switchMap((action) =>
            this.service.getPeriods().pipe(
                map((result) => new Core.LoadPeriodsSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadPeriodsFail(action.token, error))))
        ));

    @Effect()
    LoadPeriodSuccess$ = this.actions$.pipe(ofType<Core.LoadPeriodsSuccess>(Core.LOAD_PERIODS_SUCCESS),
        switchMap(action =>
            this.store.select(getWorkDoneSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, token: action.token })),
                take(1),
                switchMap(info => {
                    return from([new Core.LoadFromToDate(action.token, { periodId: info.selectedInfo.periodId })]);
                }))));

    @Effect()
    RequestGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.GridDataRequest>(Core.REQUEST_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getWorkDoneColumnDefByToken(action.token)),
                this.store.select(getWorkDonePeginatorDefByToken(action.token)),
                this.store.select(getWorkDoneSelectedInfoByToken(action.token)),
                this.store.select(getGroupModeByToken(action.token)),
                ((gridColumn, gridPage, selectedInfo, groupMode) => ({
                    gridColumn, gridPage, selectedInfo,
                    token: action.token, groupMode
                }))
            ).pipe(take(1),
                filter(info => !!info.selectedInfo),
                map((info) => {
                    let groupFilter = [{ field: info.groupMode, dir: null }];
                    if (info.groupMode === GroupMode.Date) {
                        groupFilter = [{ field: GroupMode.Date, dir: 'desc' }];
                    } else if (info.groupMode === GroupMode.ByUserDate) {
                        groupFilter = [{ field: GroupMode.ByUser, dir: null }, { field: GroupMode.Date, dir: 'desc' }];
                    } else if (info.groupMode === GroupMode.DateByUser) {
                        groupFilter = [{ field: GroupMode.Date, dir: 'desc' }, { field: GroupMode.ByUser, dir: null }];
                    }
                    return new GridRequest(

                        {
                            take: action.gridGroupData ? 50 : info.groupMode === GroupMode.Default ? info.gridPage.itemPerPage : 0,
                            filter: toODataFilter(info.gridColumn),
                            group: info.groupMode === GroupMode.Default || action.gridGroupData ? null : groupFilter,
                            skip: action.gridGroupData ? action.gridGroupData.currentItems :
                                info.groupMode === GroupMode.Default ? getPaginatorSkip(info.gridPage) : 0,
                            sort: info.groupMode === GroupMode.Default || action.gridGroupData ? toODataSort(info.gridColumn) : null
                        },
                        {
                            dateFrom: this.datePipe.transform(info.selectedInfo.dateFrom, 'yyyy-MM-ddTHH:mm:ss'),
                            dateTo: this.datePipe.transform(info.selectedInfo.dateTo, 'yyyy-MM-ddTHH:mm:ss'),
                            user: info.selectedInfo.user,
                            departmentId: info.selectedInfo.departmentId,
                            searchText: info.selectedInfo.searchText,
                        }
                    );
                }
                ), map((request) => new Core.LoadGrid(action.token, request, action.gridGroupData)))
        ));


    @Effect()
    LoadAllGridData$ = this.actions$.pipe(ofType<Core.LoadGrid>(Core.LOAD_GRID_DATA),
        switchMap(action => {
            return this.service.getGridData(action.request).pipe(
                map((response) =>
                    new Core.LoadGridSuccess(action.token, { pageData: response, gridGroupData: action.gridGroupData }, action.request)),
                catchError(error => of(new Core.LoadGridFail(action.token, error))));

        }));

    @Effect()
    GroupData$ = this.actions$.pipe(ofType<Core.GroupData>(Core.GROUP_DATA),
        map(action => {
            if (action.payload.type !== GroupMode.Default) {
                return new Core.GridDataRequest(action.token, true, action.payload.type);
            } else {
                return new Core.GridDataRequest(action.token);
            }
        }));

    @Effect()
    ChangeGridFilter$ = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token)]);
        }));

    @Effect()
    loadTeamMember$ = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        mergeMap((action) =>
            this.store.select(getWorkDoneSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, action: action })),
                take(1),
                filter(info => info.action.payload.newData.kind === gridFilterKind.department),
                map(info => {
                    const inPutData = {
                        departmentId: info.selectedInfo ? info.selectedInfo.departmentId : null,
                        isInactiveFeeEarners: false,
                        membereSearchText: null
                    };
                    return new ChangeDepartmentOrFeeEranerState('TEAM_MEMBER_DATA_WORK_DONE', { inPutData: inPutData });
                }
                ))));

    @Effect()
    GetFinanceData$ = this.actions$.pipe(ofType<Core.GridRowExpand>(Core.GRID_ROW_EXPAND),
        switchMap((action) => {
            if (!action.payload.row.matterFinance) {
                return this.service.getMatterFinance(action.payload.row.matterReferenceNo).pipe(
                    map((response) =>
                        new Core.GetMatterFinanceSuccess(action.token, { row: action.payload.row, financeData: response })),
                    catchError(error => of(new Core.GetMatterFinanceFail(action.token, error))));
            } else {
                return of();
            }
        }));

    @Effect()
    GetFinanceDataInNewDataSet$ = this.actions$.pipe(ofType<Core.LoadGridSuccess>(Core.LOAD_GRID_DATA_SUCCESS),
        switchMap((action) => {
            if (action.payload.pageData.data && action.payload.pageData.data[0]) {
                return this.service.getMatterFinance(action.payload.pageData.data[0].matterReferenceNo).pipe(
                    map((response) =>
                        new Core.GetMatterFinanceSuccess(action.token, { row: action.payload.pageData.data[0], financeData: response })),
                    catchError(error => of(new Core.GetMatterFinanceFail(action.token, error))));
            } else {
                return of();
            }
        }));

    @Effect()
    LoadFromDate$ = this.actions$.pipe(ofType<Core.LoadFromToDate>(Core.LOAD_FROM_TO_DATE),
        switchMap(action => {
            return this.service.getFromToDate(action.payload.periodId).pipe(
                map((response) =>
                    new Core.LoadFromToDateSuccess(action.token, { dates: response, periodId: action.payload.periodId })),
                catchError(error => of(new Core.LoadFromToDateFail(action.token, error))));
        }));

    @Effect()
    RequestGridDataWhenChangePeriod$ = this.actions$.pipe(ofType<Core.LoadFromToDateSuccess>(Core.LOAD_FROM_TO_DATE_SUCCESS),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token)]);
        }));

    @Effect()
    RefreshGrid$ = this.actions$.pipe(ofType<Core.GridRefresh>(Core.GRID_REFRESH),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token)]);
        }));

    @Effect()
    GridViewChange$ = this.actions$.pipe(ofType<Core.GridViewChange>(Core.GRID_VIEW_CHANGE),
        map((action) => {
            // return from([new Core.GridDataRequest(action.token)]);
            if (action.payload.value !== GroupMode.Default) {
                return new Core.GridDataRequest(action.token, true, action.payload.value);
            } else {
                return new Core.GridDataRequest(action.token);
            }
        }));

    @Effect()
    RequestToSummery$ = this.actions$.pipe(ofType<Core.LoadGridSuccess>(Core.LOAD_GRID_DATA_SUCCESS),
        filter(action => !action.request.workDoneFilter.searchText),
        switchMap((action) => {
            return from([new Core.LoadSummery(action.token)]);
        }));

    @Effect()
    GetSummeryData$ = this.actions$.pipe(ofType<Core.LoadSummery>(Core.LOAD_SUMMERY),
        switchMap(action =>
            this.store.select(getWorkDoneSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, token: action.token })),
                take(1),
                switchMap(info => {
                    return this.service.getSummery(info.selectedInfo).pipe(
                        map((response) =>
                            new Core.LoadSummerySuccess(action.token, { data: response })),
                        catchError(error => of(new Core.LoadSummeryFail(action.token, error))));
                }))));

    @Effect()
    GetDocURL$ = this.actions$.pipe(ofType<Core.GetDocURL>(Core.GET_DOCUMENT_URL),
        map((action) => {
            if (!action.payload.gridRow.docUrl || !action.payload.gridRow.emailItem) {
                if (action.payload.gridRow.hasPassword && !action.payload.gridRow.password) {
                    return new Core.GetDocPassword(action.token, { row: action.payload.gridRow });
                } else {
                    const extention = this.getFileType(action.payload.gridRow.letter_name);
                    if (extention === 'msg' || extention === 'eml') {
                        return new Core.GetEmailItemSuccess(action.token, { emailItem: true, row: action.payload.gridRow });
                    } else if (v3CanViewExtensions.filter(p => p === extention).length > 0) {
                        return new Core.LoadWebViewUrl(action.token, action.payload.gridRow);
                    } else {
                        return new Core.GetDocURLFail(action.token, { request: action.payload.gridRow });
                    }
                }
            } else {
                return new Core.ViewDoc(action.token, action.payload.gridRow);
            }
        }));



    @Effect()
    LoadWopiURL$ = this.actions$.pipe(ofType<Core.LoadWebViewUrl>(Core.LOAD_WEB_VIEW_URL),
        mergeMap((action) => {
            const item = action.request;
            return this.webViewService.getDiaryWebViewUrl(item.appCode, item.branchID,
                item.fileNumber, item.diary_UID, item.letter_name).pipe(
                    map((link) => new Core.GetDocURLSuccess(action.token, { gridRow: action.request, url: link })),
                    catchError((data) => {
                        return of(new Core.GetDocURLFail(action.token, { request: action.request }));
                    }));
        })
    );


    @Effect()
    validateUserPassword$ = this.actions$.pipe(ofType<Core.ValidatePassword>(Core.VALIDATE_PASSWORD),
        switchMap((action) => {
            return this.service.checkPassword(action.payload.row.diary_UID, action.payload.insertPassword).pipe(
                map((result) => {
                    if (result.data) {
                        return new Core.SetPassword(action.token, {
                            row: action.payload.row,
                            insertPassword: action.payload.insertPassword
                        });
                    } else {
                        return new Core.PaswordInvalid(action.token);
                    }
                }),
                catchError((data) => {
                    return of(new Core.GetDocURLFail(action.token, ''));
                }));
        }));

    @Effect()
    GetUrlWithPassword$ = this.actions$.pipe(ofType<Core.SetPassword>(Core.SET_DOC_PASSWORD),
        switchMap(action =>
            this.store.select(getWorkDoneGridDataByToken(action.token)).pipe(
                map(gridData => ({ gridData, action: action })),
                take(1),
                switchMap(info => {
                    const selectRow = info.gridData.find(row => row.diary_UID === info.action.payload.row.diary_UID);
                    return of(new Core.GetDocURL(info.action.token, { gridRow: selectRow }));
                }))));

    @Effect()
    matterSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateMatterSuccess>(ADD_UPDATE_MATTER_SUCCESS),
        switchMap(() =>
            this.store.select(getWorkDoneStateByToken('workDonePage')).pipe(
                map(state => ({ state })),
                take(1),
                filter(info => !!info.state),
                map(() => new Core.GridRefresh('workDonePage')))));


    @Effect()
    RequstGroupData$ = this.actions$.pipe(ofType<Core.GroupDataRequest>(Core.GROUP_DATA_REQUEST),
        map(action => {
            if (action.payload.gridGroupData.currentItems < action.payload.gridGroupData.count &&
                !action.payload.gridGroupData.hasSubgroups) {
                return new Core.GridDataRequest(action.token, false, '', action.payload.gridGroupData);
            } else {
                return new Core.AllDataUpdate(action.token);
            }
        }));

    @Effect()
    clientSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateClientSuccess>(ADD_UPDATE_CLIENT_SUCCESS),
        switchMap(() =>
            this.store.select(getWorkDoneStateByToken('workDonePage')).pipe(
                map(state => ({ state })),
                take(1),
                filter(info => !!info.state),
                map(() => new Core.GridRefresh('workDonePage')))));

    @Effect()
    addTimeRecordSuccess$ = this.actions$.pipe(ofType<TimeRecordClose>(TIME_RECORD_CLOSE),
        map(() => new Core.GridRefresh('workDonePage')));

    @Effect({ dispatch: false })
    goToOpenCase$ = this.actions$.pipe(ofType<Core.GoToOpenCase>(Core.GO_TO_OPEN_CASE),
        switchMap((action) =>
            this.service.getMatterInfoByCaseIdentity(action.matter).pipe(tap(infor => {
                const materData: GridRowItemWrapper = {
                    data: {
                        appID: action.matter.appID,
                        fileID: action.matter.fileNumber,
                        app_Code: action.matter.appCode,
                        branchID: action.matter.branchID,
                        feeEarner: action.matter.by,
                        reviewDate: action.matter.dateDone,
                        clientName: action.matter.client,
                        reviewNote: action.matter.note,
                        company_Name: '',
                        matterDetails: action.matter.details,
                        matterReferenceNo: action.matter.matterReferenceNo,
                        matterCounter: action.matter.matterCounter,
                        ufnValue: action.matter.ufnValue,
                        eBilling: action.matter.eBilling,
                        isPlotMatter: infor.isPlotMatter,
                        isPlotMasterMatter: infor.isPlotMasterMatter,
                        isProspectMatter: action.matter.isProspectMatter,
                        isLegalAid: action.matter.isLegalAid
                    }
                };
                this.mainMenuService.gotoOpenCase(materData);
            }))
        ));


    getFileType(fileName: string): string {
        return getFileTypeByFullFileName(fileName);
        // if (fileName && fileName.split('.')[1].toLocaleLowerCase()) {
        //     return fileName.split('.')[1].toLocaleLowerCase();
        // }
        // return '';
    }


}










