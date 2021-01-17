import { Any } from './../../contacts-and-people-core/actions/people';

import {
    FeeEarnerResponce, GridDataRequest, EchitAuthoriseViewModel,
    AuthorisationsGridData, FileDataViewModel
} from './../models/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../core';
import { map } from 'rxjs/operators';

@Injectable()
export class EChitAuthorisationsService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }
    public getFeeEarnerList(groupId: number) {
        return this.http.get<FeeEarnerResponce>(this.appConfig.serviceBase + '/EChit/GetUsersByGroupId?groupId=' + groupId).pipe(
            map(response => response.data));
    }
    public getUserGroupListList() {
        return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetGroups').pipe(
            map(response => response.data));
    }
    public getAuthoriseGridData(request: GridDataRequest) {
        return this.http.post<any>(this.appConfig.serviceBase + '/EChit/GetUnauthorisedEChits', request.GridRequestToPost()).pipe(
            map((response) => response.data));
    }
    public saveAuthoriseData(echitAuthoriseViewModel: {}) {
        return this.http.post<any>(this.appConfig.serviceBase + '/EChit/AuthoriseEChit',
            echitAuthoriseViewModel).pipe(
                map(response => response));
    }
    public getMSGEmailItem(fileDataViewModel: FileDataViewModel) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Drive/GetEchitSupplierMsgFileData', fileDataViewModel).pipe(
            map((response) => response.data));
    }
    public rejectAuthoriseData(echitAuthoriseViewModel: {}) {
        return this.http.post<any>(this.appConfig.serviceBase + '/EChit/RejectEChit',
            echitAuthoriseViewModel).pipe(
                map(response => response));
    }
}
