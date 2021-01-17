
import { filter, mergeMap, catchError, map, switchMap, take, tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, combineLatest, from } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MyTasksService } from '../services/my-tasks-services';
import * as Core from '../actions/core';

import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';
import { gridFilterKind } from '../models/enumeration';
import {
    getMyTasksDepartmentsByToken, getMyTasksColumnDefByToken,
    getMyTasksPeginatorDefByToken, getMyTasksSelectedInfoByToken,
    getMyTasksStateByToken,
    getMytaskGroupDataByRow
} from '../reducers';
import { InitTeamMember } from '../../team-member-core';
import { ChangeDepartmentOrFeeEranerState } from '../../team-member-core/actions/team-member';
import { GridRequest, RequestToCompleteTask } from '../models/request';
import { TeamMemberOpenFrom } from '../../team-member-core/models/enums';

import { AddUpdateMatterSuccess, ADD_UPDATE_MATTER_SUCCESS } from '../../matter-creation-core';
import { ADD_UPDATE_CLIENT_SUCCESS, AddUpdateClientSuccess } from '../../client-creation-core';
import { GroupMode } from '../models/interfce';
import { RefreshMyTaskWidget } from '../../my-task-widget';
import { Store } from '@ngrx/store';
import { RefreshWorkDoneWidget } from '../../work-done-widget';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MainMenuService } from '../../layout-desktop';



@Injectable()
export class MyTasksEffects {
    constructor(private actions$: Actions, private store: Store<any>, private datePipe: DatePipe,
        private service: MyTasksService, private mainMenuService: MainMenuService) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<Core.InitMyTask>(Core.INIT_MY_TASK),
        mergeMap((action) =>
            combineLatest(this.store.select(getMyTasksDepartmentsByToken(action.token)),
                (department) => ({ department })).pipe(
                    take(1),
                    mergeMap((info) => {
                        if (!info.department || info.department.length === 0) {
                            return from([new Core.LoadUserPermission(action.token),
                            new Core.GridDataRequest(action.token),
                            new InitTeamMember('TEAM_MEMBER_DATA_MY_TASKS', TeamMemberOpenFrom.MyTask),
                            new Core.LoadDepartments(action.token),
                            new Core.LoadSummery(action.token)]
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
    loadUserPermission$ = this.actions$.pipe(ofType<Core.LoadUserPermission>(Core.LOAD_USER_PERMISSION),
        switchMap((action) =>
            this.service.getUserPermission().pipe(
                map((result) => new Core.LoadUserPermissionSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadUserPermissionFail(action.token, error))))
        ));




    @Effect()
    ChangeGridFilter$ = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        map((action) => {
            return new Core.GridDataRequest(action.token);
        }));

    @Effect()
    myTaskGroupChange$ = this.actions$.pipe(ofType<Core.MyTaskGroupChange>(Core.MY_TASK_GROUP_CHANGE),
        map((action) => {
            return new Core.GridDataRequest(action.token);
        }));

    @Effect()
    GetSummery$ = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        filter(action => action.payload.newData.kind === gridFilterKind.department || action.payload.newData.kind === gridFilterKind.user),
        map(info => {
            return new Core.LoadSummery(info.token);
        }));

    @Effect()
    $loadTeamMember = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        mergeMap((action) =>
            this.store.select(getMyTasksSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, action: action })),
                take(1),
                filter(info => info.action.payload.newData.kind === gridFilterKind.department),
                map(info => {
                    const inPutData = {
                        departmentId: info.selectedInfo ? info.selectedInfo.departmentId : null,
                        isInactiveFeeEarners: false,
                        membereSearchText: null
                    };
                    return new ChangeDepartmentOrFeeEranerState('TEAM_MEMBER_DATA_MY_TASKS', { inPutData: inPutData });
                }
                ))));

    @Effect()
    RefreshGrid$ = this.actions$.pipe(ofType<Core.GridRefresh>(Core.GRID_REFRESH),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token),
            new Core.LoadSummery(action.token),
            new RefreshMyTaskWidget()]);
        }));

    @Effect()
    GridViewChange$ = this.actions$.pipe(ofType<Core.GridViewChange>(Core.GRID_VIEW_CHANGE),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token)]);
        }));

    @Effect()
    GetSummeryData$ = this.actions$.pipe(ofType<Core.LoadSummery>(Core.LOAD_SUMMERY),
        switchMap(action =>
            this.store.select(getMyTasksSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, token: action.token })),
                take(1),
                switchMap(info => {
                    return this.service.getSummery(info.selectedInfo).pipe(
                        map((response) =>
                            new Core.LoadSummerySuccess(action.token, { data: response })),
                        catchError(error => of(new Core.LoadSummeryFail(action.token, error))));
                }))));

    @Effect()
    CheckIsEnableTimeRecord$ = this.actions$.pipe(ofType<Core.RequestToComplete>(Core.REQUEST_TO_COMPLETE),
        map(action => {
            if (!action.payload.row.checkTREnable) {
                return new Core.CheckTREnabale(action.token, { row: action.payload.row });
            } else {
                return new Core.CheckTREnabaleSuccess(action.token, {
                    row: action.payload.row, isEnable: action.payload.row.isTimeRecordingEnabled
                });
            }
        }));

    @Effect()
    GetIsTimeEnable$ = this.actions$.pipe(ofType<Core.CheckTREnabale>(Core.CHECK_TIME_RECORDED_ENABLE),
        switchMap(action => {
            return this.service.isTimeRecordingEnabled(action.payload.row.matterReferenceNo).pipe(
                map((response) =>
                    new Core.CheckTREnabaleSuccess(action.token,
                        { row: action.payload.row, isEnable: response })),
                catchError(error => of(new Core.CheckTREnabaleFail(action.token, error))));
        }));

    @Effect()
    CompleteTask$ = this.actions$.pipe(ofType<Core.CompleteTask>(Core.COMPLETE_TASK),
        switchMap(action => {
            return this.service.completeTask(action.payload.request).pipe(
                map((response) =>
                    new Core.CompleteTaskSuccess(action.token)),
                catchError(error => of(new Core.CompleteTaskFail(action.token, error))));

        }));

    @Effect()
    CompmleteTaskRquest$ = this.actions$.pipe(ofType<Core.CheckTREnabaleSuccess>(Core.CHECK_TIME_RECORDED_ENABLE_SUCCESS),
        map(action => {
            if (action.payload.isEnable) {
                return new Core.CompleteTaskRequest(action.token, { row: action.payload.row });
            } else {
                const msgModel = {
                    isShow: true,
                    msg: `Current Spitfire version doesn't support this action on this matter.`
                };

                return new Core.ShowMsg(action.token, { msgModel: msgModel });
            }
        }));

    @Effect()
    RequestToCompleteTask$ = this.actions$.pipe(ofType<Core.CompleteTaskRequest>(Core.COMPLETE_TASK_REQUEST),
        map(action =>
            new RequestToCompleteTask(
                {
                    taskFor: action.payload.row.taskFor,
                    client: action.payload.row.client,
                    matterReferenceNo: action.payload.row.matterReferenceNo,
                    matterDetails: action.payload.row.matterDetails,
                    columnFolderId: action.payload.row.columnFolderId,
                    workflowActions: 'Complete',
                    note: action.payload.row.note,
                    dateBy: this.datePipe.transform(action.payload.row.dateBy, 'yyyy-MM-dd HH:mm'),
                    // taskID: action.payload.row.taskID,
                    putOnBy: action.payload.row.putOnBy,
                    appCode: action.payload.row.appCode,
                    appID: action.payload.row.appID,
                    fileID: action.payload.row.fileID,
                    date: action.payload.row.date,
                    branchID: action.payload.row.branchID,
                    diaryId: action.payload.row.taskID
                },
                action.token
            )
        ), map(request => new Core.CompleteTask(request.token, { request: request })));

    @Effect()
    ReloadData$ = this.actions$.pipe(ofType<Core.CompleteTaskSuccess>(Core.COMPLETE_TASK_SUCCESS),
        mergeMap(action => {
            return from([
                // new Core.GridDataRequest(action.token),
                new Core.GridRefresh(action.token),
                new Core.LoadSummery(action.token),
                new RefreshMyTaskWidget(),
                new RefreshWorkDoneWidget(),
            ]
            );
        }));

    @Effect()
    matterSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateMatterSuccess>(ADD_UPDATE_MATTER_SUCCESS),
        switchMap(() =>
            this.store.select(getMyTasksStateByToken('MyTasksPage')).pipe(
                map(state => ({ state })),
                take(1),
                filter(info => !!info.state),
                map(() => new Core.GridRefresh('MyTasksPage')))));

    @Effect()
    clientSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateClientSuccess>(ADD_UPDATE_CLIENT_SUCCESS),
        switchMap(() =>
            this.store.select(getMyTasksStateByToken('MyTasksPage')).pipe(
                map(state => ({ state })),
                take(1),
                filter(info => !!info.state),
                map(() => new Core.GridRefresh('MyTasksPage')))));





    @Effect()
    RequestGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.GridDataRequest>(Core.REQUEST_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getMyTasksColumnDefByToken(action.token)),
                this.store.select(getMyTasksPeginatorDefByToken(action.token)),
                this.store.select(getMyTasksSelectedInfoByToken(action.token)),
                ((gridColumn, gridPage, selectedInfo) => ({ gridColumn, gridPage, selectedInfo, token: action.token }))
            ).pipe(take(1),
                map((info) =>
                    new GridRequest(
                        {
                            take: info.gridPage.itemPerPage,
                            filter: toODataFilter(info.gridColumn),
                            skip: getPaginatorSkip(info.gridPage),
                            sort: toODataSort(info.gridColumn)
                        },
                        {
                            user: info.selectedInfo.user,
                            departmentId: info.selectedInfo.departmentId,
                            searchText: info.selectedInfo.searchText,
                        },
                    )
                ), map((request) => new Core.LoadGrid(action.token, request)))
        ));


    @Effect()
    LoadAllGridData$ = this.actions$.pipe(ofType<Core.LoadGrid>(Core.LOAD_GRID_DATA),
        switchMap((action) =>
            this.store.select(getMyTasksStateByToken(action.token)).pipe(
                map((state) => {
                    return { state: state, action: action };
                }), take(1))
        ),
        switchMap<any, any>((data) => {
            if (data.state.groupMode === GroupMode.Default) {

                return this.service.getGridData(data.action.request).pipe(
                    map((response) =>
                        new Core.LoadGridSuccess(data.action.token, { pageData: response })),
                    catchError(error => of(new Core.LoadGridFail(data.action.token, error))));

            } else {

                return this.service.getGridGroupData(data.action.request, data.state['groupMode']).pipe(
                    map((result) => {
                        return new Core.LoadMyTaskGroupSuccess(data.action.token, result);
                    }),
                    catchError((error) => of(new Core.LoadMyTaskGroupFail(data.action.token, error))));

            }
        }));



    @Effect()
    expandMyTaskGroup$ = this.actions$.pipe(ofType<Core.ExpandMyTaskGroup>
        (Core.EXPAND_MY_TASK_GROUP),
        filter((action) => (action.payload.row.isLefNode && !action.payload.row.isExpand)),
        switchMap((action) => {

            return this.store.select(getMytaskGroupDataByRow(action.token, action.payload.row)).pipe(
                map((gridData) => {
                    return { hasData: (gridData.length > 0) ? true : false, action: action };
                }), take(1));
        }),
        filter((actionInfo) => {

            return !actionInfo.hasData;
        }),
        switchMap((data) => {

            return combineLatest(
                this.store.select(getMyTasksColumnDefByToken(data.action.token)),
                this.store.select(getMyTasksPeginatorDefByToken(data.action.token)),
                this.store.select(getMyTasksSelectedInfoByToken(data.action.token)),
                ((gridColumn, gridPage, selectedInfo) => ({ gridColumn, gridPage, selectedInfo, token: data.action.token }))
            ).pipe(take(1),
                map((info) => {

                    const gridRequest = new GridRequest(
                        {
                            take: info.gridPage.itemPerPage,
                            filter: toODataFilter(info.gridColumn),
                            skip: getPaginatorSkip(info.gridPage),
                            sort: toODataSort(info.gridColumn)
                        },
                        {
                            user: info.selectedInfo.user,
                            departmentId: info.selectedInfo.departmentId,
                            searchText: info.selectedInfo.searchText,
                        },
                        data.action.payload.row
                    );

                    return new Core.LoadMyTaskGridDataByGroup(info.token, { request: gridRequest });

                }));

        }));




    @Effect()
    mytaskGroupLoadMore$ = this.actions$.pipe(ofType<Core.MyTaskGroupLoadMore>
        (Core.MY_TASK_GROUP_LOAD_MORE),
        switchMap((action) => {
            return combineLatest(
                this.store.select(getMyTasksColumnDefByToken(action.token)),
                this.store.select(getMyTasksPeginatorDefByToken(action.token)),
                this.store.select(getMyTasksSelectedInfoByToken(action.token)),
                ((gridColumn, gridPage, selectedInfo) => ({ gridColumn, gridPage, selectedInfo, token: action.token }))
            ).pipe(take(1),
                map((info) => {

                    const gridRequest = new GridRequest(
                        {
                            take: info.gridPage.itemPerPage,
                            filter: toODataFilter(info.gridColumn),
                            skip: action.payload.row.currentItems,
                            sort: toODataSort(info.gridColumn)
                        },
                        {
                            user: info.selectedInfo.user,
                            departmentId: info.selectedInfo.departmentId,
                            searchText: info.selectedInfo.searchText,
                        },
                        action.payload.row
                    );

                    return new Core.LoadMyTaskGridDataByGroup(info.token, { request: gridRequest });

                }));

        }));


    @Effect()
    loadMyTaskGridData$ = this.actions$.pipe(ofType<Core.LoadMyTaskGridDataByGroup>
        (Core.LOAD_MY_TASK_GRID_DATA_BY_GROUP),
        switchMap((action) => {
            return this.service.getMyTaskByGroup(action.payload.request).pipe(
                map((result) => new Core.LoadMyTaskGridDataByGroupSuccess(action.token,
                    { pageData: result, request: action.payload.request })
                ),
                catchError((error) => of(new Core.LoadMyTaskGridDataByGroupFail(action.token, error))));
        }));

    @Effect({ dispatch: false })
    goToOpenCase$ = this.actions$.pipe(ofType<Core.GoToOpenCase>(Core.GO_TO_OPEN_CASE),
        switchMap((action) =>
            this.service.getMatterInfoByCaseIdentity(action.matter).pipe(tap(infor => {
                const materData: GridRowItemWrapper = {
                    data: {
                        appID: action.matter.appID,
                        fileID: action.matter.fileID,
                        app_Code: action.matter.appCode,
                        branchID: action.matter.branchID,
                        feeEarner: action.matter.putOnBy,
                        reviewDate: action.matter.datedn,
                        clientName: action.matter.client,
                        reviewNote: action.matter.note,
                        company_Name: '',
                        matterDetails: action.matter.matterDetails,
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

}













