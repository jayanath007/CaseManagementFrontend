import { filter, catchError, mergeMap, map, switchMap, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, combineLatest, from, EMPTY as empty } from 'rxjs';
import { TimeRecordedService } from '../services/time-recorded-services';
import * as Core from '../actions/core';
import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';
import { ViewChangeKind, gridFilterKind, GroupMode } from '../models/enumeration';
import {
    getTimeRecordedDepartmentByToken, getTimeRecordedColumnDefByToken, getTimeRecordedSelectedInfoByToken,
    getTimeRecordedPeginatorDefByToken, getTimeRecordedStateByToken, getSelectGroupModeByToken
} from '../reducers';
import { InitTeamMember } from '../../team-member-core';
import { GridRequest, GridExportRequest } from '../models/request';
import { ChangeDepartmentOrFeeEranerState } from '../../team-member-core/actions/team-member';
import { DatePipe } from '@angular/common';
import { TeamMemberOpenFrom } from '../../team-member-core/models/enums';
import { RefreshTimeRecordedWidget } from '../../time-recorded-widget/actions/core';
import { AddUpdateMatterSuccess, ADD_UPDATE_MATTER_SUCCESS } from '../../matter-creation-core';
import { ADD_UPDATE_CLIENT_SUCCESS, AddUpdateClientSuccess } from '../../client-creation-core';
import { OpenRecordTimeTab, LoadTabDataInit } from './../../time-recording-core/actions/core';
import { uuid } from '../../utils/uuid';
import { TimeRecordClose, TIME_RECORD_CLOSE } from './../../shared-data/actions/time-record';
import { getUser } from '../../auth';
@Injectable()
export class TimeRecordedEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: TimeRecordedService, private datePipe: DatePipe) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<Core.InitTimeRecorded>(Core.INIT_TIME_RECORDED),
        mergeMap((action) =>
            combineLatest(this.store.select(getTimeRecordedDepartmentByToken(action.token)),
                (department) => ({ department })).pipe(
                    take(1),
                    mergeMap((info) => {
                        if (!info.department || info.department.length === 0) {
                            return from([new Core.LoadUserPermission(action.token),
                            new Core.GridDataRequest(action.token),
                            new Core.LoadDepartments(action.token),
                            new Core.LoadTypes(action.token),
                            new Core.LoadPeriods(action.token),
                            new Core.LoadRecordTimeList(action.token),
                            new InitTeamMember('TEAM_MEMBER_DATA_TIME_RECORDED', TeamMemberOpenFrom.TimeRecorded)]
                                // new Matter.LoadMatterDataWithCurrentState(action.token)],
                            );
                        }
                        return from([]);
                    }))));

    @Effect()
    loadRecordTimeList$ = this.actions$.pipe(ofType<Core.LoadRecordTimeList>(Core.LOAD_RECORD_TIME_LIST),
        switchMap((action) =>
            this.service.getRecordTimeList().pipe(
                map((result) => new Core.LoadRecordTimeListSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadRecordTimeListFail(action.token, error))))
        ));
    @Effect()
    showValidateMassage$ = this.actions$.pipe(ofType<Core.LoadRecordTimeListSuccess>(Core.LOAD_RECORD_TIME_LIST_SUCCESS),
        filter(action => action.payload.items && action.payload.items.length > 0),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ action, user })))),
        mergeMap(({ action, user }) => {
            return from(action.payload.items.map(val =>
                new OpenRecordTimeTab(uuid(), {
                    inputData: {
                        matterReferenceNo: val.matterRef,
                        feeEarner: val.feeEarner,
                        editData: null,
                        tabDataEdit: val,
                        eBilling: val.eBilling,
                        canMinimize: true
                    },
                    timeOffset: user.general.dateTimeOffset
                })));

        }));

    @Effect()
    loadTabData$ = this.actions$.pipe(ofType<Core.LoadRecordTimeList>(Core.LOAD_RECORD_TIME_LIST),
        mergeMap((action: Core.LoadRecordTimeList) => {
            return from([
                new LoadTabDataInit(action.token),
                // new Core.Ccccccc(action.token),
            ]);
        }));
    @Effect()
    loadDepartment$ = this.actions$.pipe(ofType<Core.LoadDepartments>(Core.LOAD_DEPARTMENTS),
        switchMap((action) =>
            this.service.getDepartments().pipe(
                map((result) => new Core.LoadDepartmentsSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadDepartmentsFail(action.token, error))))
        ));

    @Effect()
    loadTypes$ = this.actions$.pipe(ofType<Core.LoadTypes>(Core.LOAD_TYPES),
        switchMap((action) =>
            this.service.getTypes().pipe(
                map((result) => new Core.LoadTypesSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadTypesFail(action.token, error))))
        ));

    @Effect()
    loadPeriods$ = this.actions$.pipe(ofType<Core.LoadPeriods>(Core.LOAD_PERIODS),
        switchMap((action) =>
            this.service.getPeriods().pipe(
                map((result) => new Core.LoadPeriodsSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadPeriodsFail(action.token, error))))
        ));

    @Effect()
    loadUserPermission$ = this.actions$.pipe(ofType<Core.LoadUserPermission>(Core.LOAD_USER_PERMISSION),
        switchMap((action) =>
            this.service.getUserPermission().pipe(
                map((result) => new Core.LoadUserPermissionSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadUserPermissionFail(action.token, error))))
        ));

    @Effect()
    RequestGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.GridDataRequest>(Core.REQUEST_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getTimeRecordedColumnDefByToken(action.token)),
                this.store.select(getTimeRecordedPeginatorDefByToken(action.token)),
                this.store.select(getTimeRecordedSelectedInfoByToken(action.token)),
                this.store.select(getSelectGroupModeByToken(action.token)),
                ((gridColumn, gridPage, selectedInfo, groupMode) =>
                    ({ gridColumn, gridPage, selectedInfo, token: action.token, groupMode }))
            ).pipe(take(1),
                filter(info => !!info.selectedInfo),
                map((info) =>
                    new GridRequest(
                        {
                            take: action.gridGroupData ? 50 : info.groupMode === GroupMode.Default ? info.gridPage.itemPerPage : 0,
                            filter: toODataFilter(info.gridColumn),
                            group: info.groupMode === GroupMode.Default || action.gridGroupData ?
                                null : [{ field: info.groupMode, dir: 'desc' }],
                            skip: action.gridGroupData ? action.gridGroupData.currentItems : info.groupMode === GroupMode.Default
                                ? getPaginatorSkip(info.gridPage) : 0,
                            sort: info.groupMode === GroupMode.Default || action.gridGroupData ? toODataSort(info.gridColumn) : null
                        },
                        {
                            dateFrom: this.datePipe.transform(info.selectedInfo.dateFrom, 'yyyy-MM-ddTHH:mm:ss'),
                            dateTo: this.datePipe.transform(info.selectedInfo.dateTo, 'yyyy-MM-ddTHH:mm:ss'),
                            // dateFrom: info.selectedInfo.dateFrom,
                            // dateTo: info.selectedInfo.dateTo,
                            type: info.selectedInfo.typeId,
                            user: info.selectedInfo.user,
                            departmentId: info.selectedInfo.departmentId,
                            searchText: info.selectedInfo.searchText,
                            isBillDate: info.selectedInfo.isBillDate
                        }
                    )
                ), map((request) => new Core.LoadGrid(action.token, request, action.gridGroupData)))
        ));

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
    RequstGroupData$ = this.actions$.pipe(ofType<Core.GroupDataRequest>(Core.GROUP_DATA_REQUEST),
        map(action => {
            if (action.payload.gridGroupData.currentItems < action.payload.gridGroupData.count) {
                return new Core.GridDataRequest(action.token, false, '', action.payload.gridGroupData);
            } else {
                return new Core.AllDataUpdate(action.token);
            }
        }
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
    ChangeGridFilter$ = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token)]);
        }));
    @Effect()
    addTimeRecordSuccess$ = this.actions$.pipe(ofType<Core.DateTypeDange>(Core.TIME_RECORDED_DATE_TIME_CHANGE),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token)]);
        }));

    @Effect()
    $loadTeamMember = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        mergeMap((action) =>
            this.store.select(getTimeRecordedSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, action: action })),
                take(1),
                filter(info => info.action.payload.newData.kind === gridFilterKind.department),
                map(info => {
                    const inPutData = {
                        departmentId: info.selectedInfo ? info.selectedInfo.departmentId : null,
                        isInactiveFeeEarners: false,
                        membereSearchText: null
                    };
                    return new ChangeDepartmentOrFeeEranerState('TEAM_MEMBER_DATA_TIME_RECORDED', { inPutData: inPutData });
                }
                ))));

    @Effect()
    LoadPeriodSuccess$ = this.actions$.pipe(ofType<Core.LoadPeriodsSuccess>(Core.LOAD_PERIODS_SUCCESS),
        switchMap(action =>
            this.store.select(getTimeRecordedSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, token: action.token })),
                take(1),
                switchMap(info => {
                    return from([new Core.LoadFromToDate(action.token, { periodId: info.selectedInfo.periodId })]);
                }))));


    @Effect()
    LoadFromDate$ = this.actions$.pipe(ofType<Core.LoadFromToDate>(Core.LOAD_FROM_TO_DATE),
        switchMap(action => {
            return this.service.getFromToDate(action.payload.periodId).pipe(
                map((response) =>
                    new Core.LoadFromToDateSuccess(action.token, { dates: response, periadId: action.payload.periodId })),
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
            return from([new Core.GridDataRequest(action.token),
            new RefreshTimeRecordedWidget]);
        }));

    @Effect()
    GridViewChange$ = this.actions$.pipe(ofType<Core.GridViewChange>(Core.GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token)]);
        }));

    @Effect()
    RequestToSummery$ = this.actions$.pipe(ofType<Core.LoadGridSuccess>(Core.LOAD_GRID_DATA_SUCCESS),
        filter(acttion => !acttion.request.timeRecordedFilter.searchText),
        switchMap((action) => {
            return from([new Core.LoadSummery(action.token)]);
        }));

    @Effect()
    GetSummeryData$ = this.actions$.pipe(ofType<Core.LoadSummery>(Core.LOAD_SUMMERY),
        switchMap(action =>
            this.store.select(getTimeRecordedSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, token: action.token })),
                take(1),
                switchMap(info => {
                    return this.service.getSummery(info.selectedInfo).pipe(
                        map((response) =>
                            new Core.LoadSummerySuccess(action.token, { data: response })),
                        catchError(error => of(new Core.LoadSummeryFail(action.token, error))));
                }))));

    @Effect()
    matterSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateMatterSuccess>(ADD_UPDATE_MATTER_SUCCESS),
        switchMap(() =>
            this.store.select(getTimeRecordedStateByToken('TimeRecordedPage')).pipe(
                map(state => ({ state })),
                take(1),
                filter(info => !!info.state),
                map(() => new Core.GridRefresh('TimeRecordedPage')))));

    @Effect()
    clientSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateClientSuccess>(ADD_UPDATE_CLIENT_SUCCESS),
        switchMap(() =>
            this.store.select(getTimeRecordedStateByToken('TimeRecordedPage')).pipe(
                map(state => ({ state })),
                take(1),
                filter(info => !!info.state),
                map(() => new Core.GridRefresh('TimeRecordedPage')))));

    @Effect()
    dateTypeChange$ = this.actions$.pipe(ofType<TimeRecordClose>(TIME_RECORD_CLOSE),
        map(() => new Core.GridRefresh('TimeRecordedPage')));
    @Effect()
    exportToExcel$ = this.actions$.pipe(ofType<Core.ExportToExcel>(Core.EXPORT_TO_EXCEL),
        switchMap(action =>
            combineLatest(
                this.store.select(getTimeRecordedColumnDefByToken(action.token)),
                this.store.select(getTimeRecordedPeginatorDefByToken(action.token)),
                this.store.select(getTimeRecordedSelectedInfoByToken(action.token)),
                this.store.select(getSelectGroupModeByToken(action.token)),
                ((gridColumn, gridPage, selectedInfo, groupMode) =>
                    ({ gridColumn, gridPage, selectedInfo, token: action.token, groupMode }))
            ).pipe(take(1),
                map((info) =>
                    new GridExportRequest(
                        {
                            take: 0,
                            filter: toODataFilter(info.gridColumn),
                            group: null,
                            skip: 0,
                            sort: toODataSort(info.gridColumn)
                        },
                        {
                            dateFrom: this.datePipe.transform(info.selectedInfo.dateFrom, 'yyyy-MM-ddTHH:mm:ss'),
                            dateTo: this.datePipe.transform(info.selectedInfo.dateTo, 'yyyy-MM-ddTHH:mm:ss'),
                            type: info.selectedInfo.typeId,
                            user: info.selectedInfo.user,
                            departmentId: info.selectedInfo.departmentId,
                            searchText: info.selectedInfo.searchText,
                            isBillDate: info.selectedInfo.isBillDate
                        },
                        info.gridColumn
                    )
                ), switchMap(request => {
                    return this.service.exportToExcel(request).pipe(
                        map((response) =>
                            new Core.ExportToExcelSuccess(action.token, response)),
                        catchError(error => of(new Core.ExportToExcelFail(action.token))));

                }))
        ));

    @Effect({ dispatch: false })
    exportDataSuccess = this.actions$.pipe(ofType<Core.ExportToExcelSuccess>(Core.EXPORT_TO_EXCEL_SUCCESS),
        tap(action => {
            if (!action.exportData) {
                return;
            }
            const url = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; base64,' + action.exportData;
            const link: any = document.createElement('a');
            link.download = 'Time_Record';
            link.href = url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.click();
        }));

}







