
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { GridDataObjectResponse, GridResponse } from '../models/interface';
import { GridRequest } from '../models/requests';
import { AppConfig } from '../../core';

@Injectable()
export class MatterViewByClientServices {

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }
    public getGridData(request: GridRequest) {
        return this.http.post<GridDataObjectResponse>(
            this.appConfig.serviceBase + '/LedgerCard/GetAllMattersByClient', request.gridToPost()).pipe(
            map((response) => response.data));
    }

    public getEChitMatterGridData(request: GridRequest) {

        return this.http.post<GridDataObjectResponse>(
            this.appConfig.serviceBase + '/EChit/GetEchitMattersP', request.gridToPostEchit()).pipe(
            map((response) => response.data));

    }


    public getEChitToMatterGridData(request: GridRequest) {

        return this.http.post<GridDataObjectResponse>(
            this.appConfig.serviceBase + '/EChit/GetEchitMattersP', request.gridToPostEchit()).pipe(
            map((response) => response.data));

    }

    // public getEChitMatterGridData(searchString: string): Observable<GridResponse[]> {
    //     return this.http.get<any>(
    //         this.appConfig.serviceBase + '/EChit/GetMatters?matRefValue=' + encodeURIComponent(searchString))
    //         .map((response) => response.data);
    // }
}
