
import { map } from 'rxjs/operators';
import { MessageItemWrapper } from '../../mail-item-core/models/interface';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
    GroupResponse, GridDataObjectResponse, Department,
} from '../models/interfce';
import { GridRequest } from '../models/request';
import { AppConfig } from '../../core';
import { Observable } from 'rxjs/internal/Observable';


@Injectable()
export class PostOfficeService {
    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) { }

    public getGridData(request: GridRequest): Observable<any> {
        return this.http.post<GridDataObjectResponse>(this.appConfig.serviceBase +
            '/PostOffice/GetInboxEntries', request.GridRequestToPost()).pipe(
                map((response) => response.data));
    }

    public getUsers() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Dashboard/GetWorkDonePeriods').pipe(
            map(response => response.data));
    }


    public deleteInboxEntries(inboxIds) {
        return this.http.post<any>(this.appConfig.serviceBase + '/PostOffice/DeleteInboxEntries', inboxIds);
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

    public getDepartments() {

        // return this.http.get<{ data: Department[] }>(this.appConfig.serviceBase + '/Matters/GetDepartments').pipe(
        //     map(response => response.data));

        return this.http.get<{ data: Department[] }>(this.appConfig.serviceBase + '/PostOffice/GetGroupsList').pipe(
            map(response => response.data));

    }



    // public getGroups() {
    //     return this.http.get<GroupResponse>(this.appConfig.serviceBase + '/Matters/GetGroupsList').pipe(
    //         map(response => response.data));
    // }

    // public getLoookFor() {
    //     return this.http.get<GroupResponse>(this.appConfig.serviceBase + '/PostOffice/GetGroupsList').pipe(
    //         map(response => response.data));
    // }

}
