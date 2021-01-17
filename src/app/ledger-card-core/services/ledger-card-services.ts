
import {map} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import {
    AllGridFilterModel, BillGridRespone, AllGridRespone, DisbsGridRespone, GBPGridRespone,
    DDAGridRespone, ClientGridRespone,  EChitGridRespone
} from '../models/interfce';
import {
    LedgerFilterOptionsViewModel, AllGridRequest, BillGridRequest, DisbsGridRequest,
    GbpGridRequest, DdaGridRequest, ClientGridRequest
} from '../models/request';
import { DataSourceRequestViewModel } from '../../core/lib/grid-model';
import { AppConfig } from '../../core';
import { centerToWindow } from '../../utils/bounds';
import { uuid } from '../../utils/uuid';

@Injectable()
export class LedgerCardService {
    constructor(private http: HttpClient, private appConfig: AppConfig
       ) { }

    public getMatterFromMatRef(matterRef: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/LedgerCard/GetMatterFromMatRef?matterRef=' + matterRef).pipe(
            map(response => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return null;
                }
            }));
    }

    public getMatterFromMatterBalances(matterRef: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/LedgerCard/GetMatterBalances?matterRef=' + matterRef).pipe(
            map(response => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return null;
                }
            }));
    }

    public getAllGridData(request: AllGridRequest) {
        return this.http.post<AllGridRespone>(this.appConfig.serviceBase + '/LedgerCard/GetAllLadgerCardData', request.allGridToPost()).pipe(
            map((response) => response.data));
    }

    public getBillGridData(request: BillGridRequest) {
        return this.http.post<BillGridRespone>(this.appConfig.serviceBase + '/LedgerCard/GetBillsAndReceipts', request.billGridToPost()).pipe(
            map((response) => response.data));
    }

    public getDisbsGridData(request: DisbsGridRequest) {
        return this.http.post<DisbsGridRespone>(this.appConfig.serviceBase + '/LedgerCard/GetLedgerDisbursements',
         request.disbsGridToPost()).pipe(
            map((response) => response.data));
    }

    public getGbpGridData(request: GbpGridRequest) {
        return this.http.post<GBPGridRespone>(this.appConfig.serviceBase + '/LedgerCard/GetLedgerClientGBP', request.gpdGridToPost()).pipe(
            map((response) => response.data));
    }

    public getDdaGridData(request: DdaGridRequest) {
        return this.http.post<DDAGridRespone>(this.appConfig.serviceBase + '/LedgerCard/GetLedgerDDA', request.ddaGridToPost()).pipe(
            map((response) => response.data));
    }

    public getCurrencyData(matterRef: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/LedgerCard/GetCurrencies?matterRef=' + matterRef).pipe(
            map((response) => response.data));
    }

    public getClientGridData(request: ClientGridRequest) {
        return this.http.post<ClientGridRespone>(this.appConfig.serviceBase + '/LedgerCard/GetLedgerClientCurrency',
         request.clientGridToPost()).pipe(
            map((response) => response.data));
    }

    public getAllMatterData(clientRef: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/LedgerCard/GetAllMattersCount?clientRef=' + clientRef).pipe(
            map((response) => response.data.length));
    }

    public getEchitGridData(matterRef: string) {
        return this.http.get<EChitGridRespone>(this.appConfig.serviceBase + '/LedgerCard/GetEChits?matterRef=' + matterRef).pipe(
            map(response => {
                if (response) {
                    return response.data;
                } else {
                    return null;
                }
            }));
    }

}
