
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { DataSourceRequestViewModel } from '../../core/lib/grid-model';
import {
    DepartmentResponse, UserPermissionResponse,
    GridDataObjectResponse, SelectedInfo, SummeryResponse, TREnableResponse, GroupMode, GridData
} from '../models/interfce';
import { GridRequest, RequestToCompleteTask } from '../models/request';
import { DatePipe } from '@angular/common';
import { AppConfig } from '../../core';
import { GroupFilter, getGridGroupFilters } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
import { MatterInfoResponse } from '../../matter-search-core';

@Injectable()
export class MyTasksService {
    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) { }

    public getDepartments() {
        return this.http.get<DepartmentResponse>(this.appConfig.serviceBase + '/Matters/GetDepartments').pipe(
            map(response => response.data));
    }

    public getUserPermission() {
        return this.http.get<UserPermissionResponse>(this.appConfig.serviceBase + '/Dashboard/GetUserPermissions').pipe(
            map(response => response.data));
    }

    public getGridData(request: GridRequest) {
        return this.http.post<GridDataObjectResponse>(this.appConfig.serviceBase + '/MyTasks/GetMyTasks', request.GridRequestToPost()).pipe(
            map((response) => response.data));
    }


    public getSummery(selectedInfo: SelectedInfo) {
        return this.http.get<SummeryResponse>(this.appConfig.serviceBase +
            '/MyTasks/GetMyTaskSummary?users=' + selectedInfo.user + '&Department=' + selectedInfo.departmentId).pipe(
                map((response) => response.data));
    }

    public isTimeRecordingEnabled(matterRef: string) {
        return this.http.get<TREnableResponse>(this.appConfig.serviceBase +
            '/TimeRecording/IsTimeRecordingEnabled?matterRef=' + matterRef).pipe(
                map((response) => response.data.isTimeRecordingEnabled));
    }


    public completeTask(request: RequestToCompleteTask) {
        return this.http.post<GridDataObjectResponse>
            (this.appConfig.serviceBase + '/Diary/AddUpdateDpsTask', request.CompleteTaskToPost()).pipe(
                map((response) => response.data));
    }




    public getGridGroupData(request: GridRequest, groupMode: GroupMode) {

        if (groupMode === GroupMode.Folder) {
            request.dataSourceInfo.group = [
                {
                    field: 'FolderName',
                }
            ];
        } else if (groupMode === GroupMode.Date) {
            request.dataSourceInfo.group = [
                {
                    field: 'DateGroup',
                    dir: 'desc'
                }
            ];
        }
        //  else if (groupMode === GroupMode.FolderDate) {
        //     request.dataSourceInfo.group = [
        //         {
        //             field: 'FolderName',
        //         }, {
        //             field: 'DateGroup',
        //             dir: 'desc'
        //         }
        //     ];
        // } else if (groupMode === GroupMode.DateFolder) {
        //     request.dataSourceInfo.group = [
        //         {
        //             field: 'DateGroup',
        //             dir: 'desc'
        //         }, {
        //             field: 'FolderName',
        //         }
        //     ];
        // }
        request.dataSourceInfo.take = 0;
        return this.http.post<any>(this.appConfig.serviceBase + '/MyTasks/GetMyTasks', request.GridRequestToPost()).pipe(
            map((response) => response.data.group));
    }



    public getMyTaskByGroup(request: GridRequest) {

        // const filter = {
        //     logic: 'and',
        //     filters: [
        //         {
        //             logic: 'and',
        //             filters: [

        //             ]
        //         }]
        // };

        // if (request.row.groupMode === GroupMode.Folder) {

        //     const group1 = request.row.groupIds.group1;
        //     filter.filters[0].filters.push({
        //         field: 'FolderName',
        //         operator: 'eq',
        //         value: group1
        //     });
        // } else if (request.row.groupMode === GroupMode.Date) {
        //     filter.filters[0].filters = this.getFilterArrayForDateFields(request.row.groupIds.group1, request.row.data.value);
        // }
        // request.dataSourceInfo.filter = filter;


        const groupFilters: GroupFilter[] = [];
        if (request.row.groupMode === GroupMode.Date) {
            groupFilters.push({ filterValue: request.row.groupIds.group1, fieldName: 'dateBy', fieldType: FieldType.Date });
        }
        request.dataSourceInfo.filter = getGridGroupFilters(groupFilters);

        // request.dataSourceInfo.take = 0;
        return this.http.post<any>(this.appConfig.serviceBase + '/MyTasks/GetMyTasks', request.GridRequestToPost()).pipe(
            map((response) => response.data));
    }



    getFilterArrayForDateFields(filtersValue, value): Array<any> {
        const filters = [];
        const filtersValues = filtersValue.split('$');

        if (value === 'Others') {

            filters.push({
                field: 'dateBy',
                operator: 'lte',
                value: filtersValue
            });

        } else {
            filters.push({
                field: 'dateBy',
                operator: 'gte',
                value: filtersValues[0]
            });

            filters.push({
                field: 'dateBy',
                operator: 'lte',
                value: filtersValues[1]
            });
        }

        return filters;

    }

    public getMyTaskGroup(request: GridRequest, groupMode: GroupMode) {

        if (groupMode === GroupMode.Folder) {
            request.dataSourceInfo.group = [
                {
                    field: 'FolderName',
                }
            ];
        } else if (groupMode === GroupMode.Date) {
            request.dataSourceInfo.group = [
                {
                    field: 'DateGroup',
                    dir: 'desc'
                }
            ];
        }
        // else if (groupMode === GroupMode.FolderDate) {
        //     request.dataSourceInfo.group = [
        //         {
        //             field: 'FolderName',
        //         }, {
        //             field: 'DateGroup',
        //             dir: 'desc'
        //         }
        //     ];
        // } else if (groupMode === GroupMode.DateFolder) {
        //     request.dataSourceInfo.group = [
        //         {
        //             field: 'DateGroup',
        //             dir: 'desc'
        //         }, {
        //             field: 'FolderName',
        //         }
        //     ];
        // }
        request.dataSourceInfo.take = 0;
        return this.http.post<any>(this.appConfig.serviceBase + '/File/GetDocumentHistories', request.GridRequestToPost()).pipe(map(
            (value) => {
                return value.data.group;
            }));
    }


    public getMatterInfoByCaseIdentity(request: GridData) {
        return this.http.get<MatterInfoResponse>(this.appConfig.serviceBase + `/Matters/GetMatterInfoByCaseIdentity?appId=${
            request.appID}&branchId=${request.branchID}&fileId=${request.fileID}`).pipe(map((response) => response.data));
    }

}
