import { map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig, DropdownListData, LookupViewModel, LookupList } from '../../core';
import { MatterModel, LegalAidCombos, Matter, DiaryRecordViewModel } from '../models/interfaces';

@Injectable()
export class MatterCreationService {
    constructor(private http: HttpClient, private appConfig: AppConfig) {

    }

    public getFullMatterData(matterId: number): Observable<MatterModel> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetFullMatterDetails?MatterId=' + matterId).pipe(
            map(response => response.data));
    }
    public addUpdateMatter(matter: Matter): Observable<MatterModel> {
        return this.http.post<any>(this.appConfig.serviceBase + '/Matters/AddUpdateMatter', matter).pipe(
            map(response => {

                return response.data;
            }));
    }
    public getLeadUFN(fileID: number, branchID: number): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetLeadUFNFromFileID?fileID=' +
            fileID + '&branchID=' + branchID).pipe(
                map(response => response.data));
    }
    public deleteMatter(matterRef: string, appID: number, fileID: number, branchID: number): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/DeleteMatter?matterRef=' +
            matterRef + '&appID=' + appID + '&fileID=' + fileID + '&branchID=' + branchID).pipe(
                map(response => response.data));
    }
    public closerProcessing(matterRef: string): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/MatterCloserProcessing?matterRef=' + matterRef).pipe(
            map(response => response.data));
    }
    public getFileIsLocked(appID: number, fileID: number, branchID: number): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/FileIsLocked?branchID=' + branchID +
            '&appID=' + appID + '&fileID=' + fileID).pipe(
                map(response => response));
    }
    public useFileSecurity(): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/UseFileSecurity').pipe(
            map(response => response.data));
    }
    public checkFeeEarnerIsUser(matterRef: string): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/CheckFeeEarnerIsUser?matterRef=' + matterRef).pipe(
            map(response => response.data));
    }
    public writeOffNegativeWip(matterRef: string): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/WriteOffNegativeWip?matterRef=' + matterRef).pipe(
            map(response => response.data));
    }
    public getClientDefaults() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetClientDefaults').pipe(
            map(response => response.data));
    }
    public updateClientDefaultsAutoArchNo() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/UpdateClientDefaultsAutoArchNo').pipe(
            map(response => response.data));
    }
    public getLSCDate(year: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetLSCDate?year=' + year).pipe(
            map(response => response.data));
    }
    public getBranchList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetBranchIDAndNameList').pipe(
            map(response => response.data));
    }
    // public getFeeEarnerList(isActive: boolean): Observable<DropdownListData[]> {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetFeeEarnerCodeAndNameList?isActive=' + isActive).pipe(
    //         map(response => response.data));
    // }
    public getSupervisorList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetGetActiveUserCodeAndNameList').pipe(
            map(response => response.data));
    }
    public getAppCodeList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAppCodeIDAndNameList').pipe(
            map(response => response.data));
    }
    public getMatterDepartmentList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetMatterDepartmentIDAndNameList').pipe(
            map(response => response.data));
    }
    public getMatterCategoryList(departmentId: number): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase
            + '/Matters/GetMatterCategoryIDAndNameList?deptID=' + (departmentId || -1)).pipe(
                map(response => response.data));
    }
    public getRateCategoryList(eBilling: string = null): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetRateCategoryIDAndNameList?eBilling=' + eBilling).pipe(
            map(response => response.data));
    }
    public getMatterInterestSchemeList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetMatterInterestSchemeIDAndNameList').pipe(
            map(response => response.data));
    }
    public getIntroductionList(): Observable<LookupList[]> {
        return this.getLookupType('SALINTRO').pipe(map(data => data.lookupViewModels));
    }
    public getTrusAccNoList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetTrusAccNoCodeAndNameList').pipe(
            map(response => response.data));
    }
    public getCreditControlStageList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetCreditControlStagesList').pipe(
            map(response => response.data));
    }
    public getSundryProfitList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetSundryProfitCodeAndNameList').pipe(
            map(response => response.data));
    }
    public getDDABankList(): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetDDABankCodeAndNameList').pipe(
            map(response => response.data));
    }

    public getLookupType(lookupType: string): Observable<LookupViewModel> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Lookup/GetLookupType?lookupTypeTag=' + lookupType).pipe(
            map(response => response.data));
    }

    public getLAMatterTypesAvailable(branchId: number, startDate: string): Observable<DropdownListData[]> {
        return this.http.get<any>(this.appConfig.serviceBase +
            '/Matters/GetLAMatterTypesAvailable?branchID=' + branchId + '&startDate=' + startDate).pipe(
                map(response => response.data));
    }

    public getLegalAidCombosList(matterType: string, startDate: string): Observable<LegalAidCombos> {
        return this.http.get<any>(this.appConfig.serviceBase +
            '/Matters/GetLegalAidCombosCodeAndNameList?matterType=' + matterType + '&startDate=' + startDate).pipe(
                map(response => response.data));
    }
    public checkOutstandingUndertakings(matterRef: string): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/HasOutstandingUndertakings?matterRef=' + matterRef).pipe(
            map(response => response.data));
    }
    public checkUnreconciledItems(matterRef: string): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/HasUnreconciledItems?matterRef=' + matterRef).pipe(
            map(response => response.data));
    }
    // public GetAppIdByDepartmentId(departmentId: number): Observable<any> {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetAppIdByDepartmentId?departmentId=' +
    //         departmentId).pipe(
    //             map(response => response.data));
    // }
    public GetFeeEarnerDefaultDepartmentSupervisorBranchID(feeEarnerRef: string): Observable<any> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetFeeEarnerDefaultDepartmentSupervisorBranchID?feeEarnerRef=' +
            feeEarnerRef).pipe(
                map(response => response.data));
    }
    public AddDiaryRecords(caseFileIdentityWithAppIdViewModel: DiaryRecordViewModel) {
        return this.http.get<any>(this.appConfig.serviceBase + '/Opportunity/UpdateOpportunityAndAddDiaryRecords?matterRef=' +
            caseFileIdentityWithAppIdViewModel.matterRef + '&opportunityId=' + caseFileIdentityWithAppIdViewModel.opportunityId ,
        ).pipe(
            map(response => response));
    }
}
