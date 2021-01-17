import { CaseTimeRequest, CaseTimeDeleteRequest } from '../models/case-time-request';
import { CaseTimeResponse } from '../models/interface';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';

@Injectable()
export class CaseTimeService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getCaseTimeData(request: CaseTimeRequest) {
        return this.http.post<CaseTimeResponse>(this.appConfig.serviceBase + '/File/GetTimes', request.toPost());
    }

    public getCaseTimeDelete(request: CaseTimeDeleteRequest) {
        return this.http.post<CaseTimeResponse>(this.appConfig.serviceBase +
            '/TimeRecording/DeleteTimeRecord?timeIdList', request.toPost());
    }

}
