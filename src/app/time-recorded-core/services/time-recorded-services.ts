
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import {
    DepartmentResponse, TypesResponse, UserPermissionResponse,
    FromToDateResponse, GridDataObjectResponse, SelectedInfo, SummeryResponse
} from '../models/interfce';
import { GridRequest, GridExportRequest } from '../models/request';
import { DatePipe } from '@angular/common';
import { AppConfig } from '../../core';

@Injectable()
export class TimeRecordedService {
    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) { }

    public getRecordTimeList() {
        return this.http.get<any>(this.appConfig.serviceBase + '/TimeRecording/GetUnpostedTimeRecords').pipe(
            map(response => response.data));
    }
    public getDepartments() {
        return this.http.get<DepartmentResponse>(this.appConfig.serviceBase + '/Matters/GetDepartments').pipe(
            map(response => response.data));
    }

    public getTypes() {
        return this.http.get<TypesResponse>(this.appConfig.serviceBase + '/Dashboard/GetTypes').pipe(
            map(response => response.data));
    }

    public getPeriods() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Dashboard/GetPeriodsTimeRecorded').pipe(
            map(response => response.data));
    }

    public getUserPermission() {
        return this.http.get<UserPermissionResponse>(this.appConfig.serviceBase + '/Dashboard/GetUserPermissions').pipe(
            map(response => response.data));
    }

    public getGridData(request: GridRequest) {
        return this.http.post<GridDataObjectResponse>(this.appConfig.serviceBase2 +
            '/Dashboard/GetTimeRecordedTimes', request.GridRequestToPost()).pipe(
                map((response) => response.data));
    }

    public getFromToDate(periodId) {
        if (!periodId) {
            periodId = '';
        }
        return this.http.get<FromToDateResponse>(this.appConfig.serviceBase
            + '/Dashboard/GetFromToDateForTimeRecordedPeriod?periodId=' + periodId).pipe(
                map((response) => response.data));
    }

    public getSummery(selectedInfo: SelectedInfo) {
        const user = selectedInfo.user;
        const departmentId = selectedInfo.departmentId;
        const dateFrom = this.datePipe.transform(selectedInfo.dateFrom, 'yyyy-MM-ddTHH:mm:ss');
        const dateTo = this.datePipe.transform(selectedInfo.dateTo, 'yyyy-MM-ddTHH:mm:ss');
        // const dateFrom = selectedInfo.dateFrom;
        // const dateTo = selectedInfo.dateTo;
        const typeId = selectedInfo.typeId;
        return this.http.get<SummeryResponse>(this.appConfig.serviceBase2 +
            '/Dashboard/GetTimeRecordedSummery?users=' + user + '&department='
            + departmentId + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo + '&type=' + typeId + '&isBillDate='
            + selectedInfo.isBillDate).pipe(
                map((response) => response.data));
    }

    public exportToExcel(request: GridExportRequest) {
        return this.http.post<GridDataObjectResponse>(this.appConfig.serviceBase +
            '/Dashboard/ExportToExcel', request.ExportRequestToPost()).pipe(
                map((response) => response.data));
    }

}
