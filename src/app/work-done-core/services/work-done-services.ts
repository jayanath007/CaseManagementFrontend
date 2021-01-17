
import { map } from 'rxjs/operators';
import { MessageItemWrapper } from '../../mail-item-core/models/interface';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { DatePipe } from '@angular/common';
import {
    DepartmentResponse, FromToDateResponse, GridDataObjectResponse,
    MatterFinanceResponse, SelectedInfo, SummeryResponse, GridData,
} from '../models/interfce';
import { GridRequest } from '../models/request';
import { AppConfig } from '../../core';
import { MatterInfoResponse } from '../../matter-search-core';

@Injectable()
export class WorkDoneService {
    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) { }

    public getDepartments() {
        return this.http.get<DepartmentResponse>(this.appConfig.serviceBase + '/Matters/GetDepartments').pipe(
            map(response => response.data));
    }

    public getPeriods() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Dashboard/GetWorkDonePeriods').pipe(
            map(response => response.data));
    }


    public getGridData(request: GridRequest) {
        return this.http.post<GridDataObjectResponse>(this.appConfig.serviceBase +
            '/Dashboard/GetWorkDoneRecords', request.GridRequestToPost()).pipe(
                map((response) => response.data));
    }

    public getFromToDate(periodId) {
        if (!periodId) {
            periodId = '';
        }
        return this.http.get<FromToDateResponse>(this.appConfig.serviceBase
            + '/Dashboard/GetWorkDoneFromAndToDateByPeriod?periodId=' + periodId).pipe(
                map((response) => response.data));
    }

    public getMatterFinance(matterRef: string) {
        return this.http.get<MatterFinanceResponse>(this.appConfig.serviceBase + '/Matters/GetMatterFinance?matterRef=' + matterRef).pipe(
            map((response) => response.data));
    }

    public getSummery(selectedInfo: SelectedInfo) {
        const user = selectedInfo.user;
        const departmentId = selectedInfo.departmentId;
        const dateFrom = this.datePipe.transform(selectedInfo.dateFrom, 'yyyy-MM-ddTHH:mm:ss');
        const dateTo = this.datePipe.transform(selectedInfo.dateTo, 'yyyy-MM-ddTHH:mm:ss');
        return this.http.get<SummeryResponse>(this.appConfig.serviceBase +
            '/Dashboard/GetMyWorkDoneSummary?users=' + user + '&department=' + departmentId +
            '&dateFrom=' + dateFrom + '&dateTo=' + dateTo).pipe(
                map((response) => response.data));
    }

    public checkPassword(diaryUID: number, password: string) {
        const params = new HttpParams({
            fromObject: {
                diaryId: diaryUID.toString(),
                password: password,
            }
        });
        return this.http.get<any>(`${this.appConfig.serviceBase}/File/ValidateDiaryPassword`,
            { headers: new HttpHeaders().set('Accept', 'application/json'), params: params, }).pipe(
                map(response => response));
    }

    public getMatterInfoByCaseIdentity(request: GridData) {
        return this.http.get<MatterInfoResponse>(this.appConfig.serviceBase + `/Matters/GetMatterInfoByCaseIdentity?appId=${
            request.appID}&branchId=${request.branchID}&fileId=${request.fileNumber}`).pipe(map((response) => response.data));
    }

}
