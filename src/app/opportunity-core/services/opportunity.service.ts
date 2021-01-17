import {
    GridDataResponceViewModel, StatusList, OpportunitySaveViewModel,
    QuoteGenarateResponce, OpportunityClosedViewModel, OppertunityHistory, MatterValidationData, OpertunityState, ScreenItem,
    QuoteEditData
} from './../models/interfaces';

import { HttpClient } from '@angular/common/http';
import { Injectable, } from '@angular/core';
import { AppConfig, LookupViewModel, LookupList, DropdownListData } from '../../core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GridRequest } from '../models/interfaces';
import { QuoteRequest, MLSOpportunitySendRequest } from '../models/request';
import { DatePipe } from '@angular/common';

@Injectable()
export class OpportunityService {

    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) {
    }
    public getLookupType(lookupType: string): Observable<LookupViewModel> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Lookup/GetLookupType?lookupTypeTag=' + lookupType).pipe(
            map(response => response.data));
    }
    public getIntroductionList(): Observable<LookupList[]> {
        return this.getLookupType('SALINTRO').pipe(map(data => data.lookupViewModels));
    }
    public getOpportunityStatusList(): Observable<StatusList[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Opportunity/GetOpportunityStatus').pipe(
            map(response => response.data));
    }
    // public getOpportunityDepartmentList(): Observable<DropdownListData[]> {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetMatterDepartmentIDAndNameList?isOpportunity=true').pipe(
    //         map(response => response.data));
    // }
    // public getWorkTypeListByDepartmentId(departmentId: number): Observable<DropdownListData[]> {
    //     return this.http
    //         .get<any>(this.appConfig.serviceBase + '/Matters/GetMatterCategoryIDAndNameList?deptID=' + (departmentId || -1)).pipe(
    //             map(response => response.data));
    // }
    public getFeeEarnerList(isActive: boolean): Observable<any[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetFeeEarnerCodeAndNameList?isActive=' + isActive).pipe(
            map(response => response.data));
    }
    public getOpportunityStatus(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetMatterDepartmentIDAndNameList').pipe(
            map(response => response.data));
    }
    public getSaveOpportunityGridDataList(request: GridRequest): Observable<any> {
        return this.http.post<{ data: GridDataResponceViewModel }>
            (this.appConfig.serviceBase + '/Opportunity/GetSavedOpportunitiesForSpecificStatus',
                request.GridRequestToPost()).pipe(
                    map((response) => response.data));
    }
    public saveAndSendOpportunity(opportunitySaveViewModel: OpportunitySaveViewModel) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Opportunity/SaveOpportunity',
            opportunitySaveViewModel).pipe(
                map(response => response));
    }
    public getTemplete() {
        return this.http.get<{ data: string[] }>(`${this.appConfig.serviceBase}/Opportunity/GetWorkTypeTemplates`).pipe(
            map(responce => responce.data)
        );
    }
    public genarateQuote(request: QuoteRequest) {
        return this.http.post<QuoteGenarateResponce>
            (`${this.appConfig.serviceBase}/Opportunity/GenerateQuoteForOpportunity`, request.toPost()).pipe(
                map(responce => responce)
            );
    }
    public saveAcceptedCloseOpportunity(opportunityClosedViewModel: OpportunityClosedViewModel) {
        opportunityClosedViewModel.closeDate = this.datePipe.transform(opportunityClosedViewModel.closeDate, 'yyyy-MM-ddTHH:mm:ss');
        return this.http.post<any>(this.appConfig.serviceBase + '/Opportunity/OpportunityAccepted',
            opportunityClosedViewModel).pipe(
                map(response => response));
    }
    public saveRejectedCloseOpportunity(opportunityClosedViewModel: OpportunityClosedViewModel) {
        opportunityClosedViewModel.closeDate = this.datePipe.transform(opportunityClosedViewModel.closeDate, 'yyyy-MM-ddTHH:mm:ss');
        return this.http.post<any>(this.appConfig.serviceBase + '/Opportunity/OpportunityRejected',
            opportunityClosedViewModel).pipe(
                map(response => response));
    }
    public SendOpportunityFeeEarnerEmail(opportunityId: number) {
        return this.http.get<any>(this.appConfig.serviceBase + '/Opportunity/SendOpportunity?opportunityId=' + opportunityId)
            .pipe(
                map(response => response.data));
    }
    public getMatterData(opportunityId: number) {
        return this.http.get<any>(this.appConfig.serviceBase + '/Opportunity/GetMatterDetaisForOpportunity?opportunityId=' + opportunityId)
            .pipe(
                map(response => response));
    }
    public getOppertunityHistory(oppertunityId: number) {
        return this.http.get<{ data: OppertunityHistory[] }>
            (`${this.appConfig.serviceBase}/Opportunity/GetOpportunityHistoryData?opportunityId=${oppertunityId}`)
            .pipe(map(responce => responce.data));
    }
    public validateMatterInfo(oppertunityId: number, continueProcess) {
        return this.http.get<MatterValidationData>
            (`${this.appConfig.serviceBase}/Opportunity/IsValidOpportunityAccepted?opportunityId=${oppertunityId}&isCheckOpprtunityData=${continueProcess === 'closeOppertunity' ? true : false}`);
    }
    public getStats() {
        return this.http.get<{ data: OpertunityState }>
            (`${this.appConfig.serviceBase}/Opportunity/GetOpportunityStatusSummary`).pipe(
                map(responce => responce.data)
            );
    }
    public getMLSOpportunityScreenList(appId: number) {
        return this.http.get<{ data: ScreenItem[] }>
            (`${this.appConfig.serviceBase}/MLS/GetMLSOpportunityScreenList?appId=${appId}`).pipe(
                map(responce => responce.data)
            );
    }
    public saveScreenList(request: MLSOpportunitySendRequest) {
        return this.http.post<any>(this.appConfig.serviceBase + '/MLS/SendOpportunityDocsToMLSAsync',
            request.toPost()).pipe(
                map(response => response));
    }
    public getAppCodeList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAppCodeIDAndNameList').pipe(
            map(response => response.data));
    }
    public getInitialScreenList(): Observable<string> {
        return this.http.get<any>(this.appConfig.serviceBase + '/MLS/GetMLSOpportunitySavedScreenList').pipe(
            map(response => response.data));
    }
    public uploadEmailTemplete(file: File): Observable<any> {
        const data = new FormData();
        data.append('file', file);
        return this.http.post<any>(this.appConfig.serviceBase + '/Opportunity/SaveMailHeaderAttachment', data).pipe(
            map(response => response.data));
    }
    public getEditQuoteData(enquaryId: number): Observable<QuoteEditData> {
        return this.http.get<{ data: QuoteEditData }>(`${this.appConfig.serviceBase}/Opportunity/QuoteEditData?enquiryId=${enquaryId}`)
            .pipe(map(response => response.data));
    }

    public viewMailHeaderAttachment(): Observable<string> {
        return this.http.get<{ data: string }>(`${this.appConfig.serviceBase}/Opportunity/viewMailHeaderAttachment?`)
            .pipe(map(response => response.data));
    }
    public sendNotification(data: { email: string, feeEarnerCode: string, message: string, enquiryId: number }, userName: string) {
        const request = {
            to: data.email,
            fromCode: userName,
            message: data.message,
            enquiryId: data.enquiryId,
        };
        return this.http.post<{ body: any }>
            (`${this.appConfig.apiv3OpportunityApi}/Enquiry/PushSimpleMessage`, { body: request }).pipe(
                map(responce => responce.body)
            );
    }

    public createMatter(enquiryId: number): Observable<any> {
        return this.http.post<any>(this.appConfig.serviceBase + '/Opportunity/AddProspectMatter',
            { OpportunityId: enquiryId });
    }



}
