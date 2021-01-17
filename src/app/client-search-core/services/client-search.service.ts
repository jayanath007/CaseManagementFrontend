import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { AppConfig } from '../../core';
import { ClientSearchResponse, MatterDataObject, MatterViewModel } from '../models/interfaces';
import { ClientPopupRequest, ClientSearchRequest } from '../models/requests';
import { ClientPopupType } from './../models/enums';





@Injectable()
export class ClientSearchService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getSearchClients(request: ClientSearchRequest) {
        return this.http.post<ClientSearchResponse>(this.appConfig.serviceBase + '/Client/SearchFromClientOrMatter', request.toPost()).pipe(
            tap((res) => console.log('ClientSearchResponse', res)),
            map((response) => {
                return response;
            }));
    }
    public getSearchClientsPopup(requestd: ClientPopupRequest) {
        if (requestd.filterOptions && requestd.filterOptions.popupType &&
            requestd.filterOptions.popupType === ClientPopupType.OpportunityClientSearch) {
            const opportunityClientPopupRequest = {
                firstName: requestd.filterOptions ? requestd.filterOptions.popupPara.firstName : '',
                lastName: requestd.filterOptions ? requestd.filterOptions.popupPara.lastName : '',
                companyName: requestd.filterOptions ? requestd.filterOptions.popupPara.companyName : '',
                email1: requestd.filterOptions ? requestd.filterOptions.popupPara.email1 : '',
                isOpportunityEdit: requestd.filterOptions.isOpportunityEdit
            };
            return this.http.post<ClientSearchResponse>(this.appConfig.serviceBase + '/Opportunity/GetClientSearchResults',
                {
                    dataSourceRequestViewModel: requestd.dataSourceInfo,
                    opportunityClientFilterOptionViewModel: opportunityClientPopupRequest
                }).pipe(
                    map((response) => {
                        return response;
                    }));
        } else {
            return this.http.post<ClientSearchResponse>(this.appConfig.serviceBase + '/Client/GetClients',
                requestd.toPopupPost()).pipe(
                    map((response) => {
                        return response;
                    }));
        }
    }

    public getMatters(request: ClientSearchRequest) {
        return this.http.post<{ data: MatterDataObject }>(this.appConfig.serviceBase + '/Matters/SearchMatterFromClient',
            request.toPostGetMatters()).pipe(
                map((response) => {
                    return response.data;
                }));
    }
}


