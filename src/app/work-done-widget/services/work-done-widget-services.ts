
import { map } from 'rxjs/operators';
import { AppConfig } from '../../core/configs/app-config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataRequest } from '../models/request';
import { DataObjectResponse, FromToDateResponse, GridData } from '../models/interfce';
import { MatterInfoResponse } from '../../matter-search-core';

@Injectable()
export class WorkDoneWidgetService {

    private matters$;
    public testData: any;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }

    public loadWorkDoneData(request: DataRequest) {
        return this.http.post<DataObjectResponse>(this.appConfig.serviceBase2 + '/Dashboard/GetWorkDoneRecords?suppressErrors=true',
            request.DataRequestToPost()).pipe(
                map((response) => response.data));
    }

    public getFromToDate(periodId) {
        if (!periodId) {
            periodId = '';
        }
        return this.http.get<FromToDateResponse>(this.appConfig.serviceBase2
            + '/Dashboard/GetWorkDoneFromAndToDateByPeriod?suppressErrors=true&periodId=' + periodId).pipe(
                map((response) => response.data));
    }

    public getMatterInfoByCaseIdentity(request: GridData) {
        return this.http.get<MatterInfoResponse>(this.appConfig.serviceBase + `/Matters/GetMatterInfoByCaseIdentity?appId=${
            request.appID}&branchId=${request.branchID}&fileId=${request.fileId || request.fileNumber}`)
            .pipe(map((response) => response.data));
    }

}
