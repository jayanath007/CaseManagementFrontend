import { map, tap } from 'rxjs/operators';

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatterResponse, DropdownListData } from '../models/interfaces';

import { of, Observable, defer, from as fromPromise, from } from 'rxjs';

import { AppConfig } from '../../core';


@Injectable()
export class AdvancedSearchService {

    private matters$;
    public testData: any;

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }

    public getMatterSearchInfo(): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAdvancedMatterSearchLoadingInfo').pipe(
            map(response => response.data));
    }

    public getBranchList(): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Echit/GetBranches').pipe(
            map(response => response.data));
    }



    public getClientList(): Observable<any> {
        const data = {
            searchText: null
            ,
            dataSourceRequestViewModel: { take: 0, skip: 0 }
        };

        return this.http.post<any>(this.appConfig.serviceBase + '/Client/GetClientsList', data);
    }

    public getAppCodeList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAppsForSpecificUser').pipe(
            map(response => response.data));
    }


    public getSearchHeadersData(searchHeadersInfo): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAppDynamicColumnHeaders?branchId=' +
            searchHeadersInfo.branchId + '&appId=' + searchHeadersInfo.appId + '&matterSearchMode='
            + searchHeadersInfo.matterSearchMode + '&columnOptionMode=' + searchHeadersInfo.searchColumnOption).pipe(
                map(response => response.data));
    }




    public getAdvancedGridData(request: any) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Matters/GetMatterSearchResults', request.toPost());
    }


    public saveSelectedBranchId(branchId: number) {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/SaveBranch?branchId=' +
            branchId).pipe(
                map(response => response.data));

    }


    // public loadMatterData(request: MatterRequest) {
    //     return this.http.post<MatterResponse>(this.appConfig.serviceBase + '/Matters/GetMatters', request.toPost()).pipe(
    //         map((response) => {
    //             if (response.data.data['matters']) {
    //                 return {
    //                     data: {
    //                         data: response.data.data['matters'], total: response.data.total,
    //                         aggregates: response.data.aggregates,
    //                         totalBillOutstandingBalance: response.data.data['totalBillOutstandingBalance'],
    //                         totalMatterCount: response.data.data['totalMatterCount']
    //                     },
    //                     status: response.status,
    //                     messageBody: response.messageBody,
    //                     messageHeader: response.messageHeader,
    //                     detailStatus: response.detailStatus,
    //                     totalBillOutstandingBalance: response.data.data['totalBillOutstandingBalance'],
    //                     totalMatterCount: response.data.data['totalMatterCount']
    //                 };
    //             } else {
    //                 return response;
    //             }
    //         }));
    // }
}

