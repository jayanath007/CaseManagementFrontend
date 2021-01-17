import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, LookupViewModel } from '../../core';
import { Observable } from 'rxjs';
import { DropdownListItem, DepartmentWithMatterAndAppCode, FeeEarnerInfo } from '../model/interface';
import { map } from 'rxjs/operators';
import { LookupType, LoockupItem } from '../../shared';

@Injectable()
export class MasterDataServices {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getDepartmentList(): Observable<DepartmentWithMatterAndAppCode[]> {
        return this.http.get<{ data: DepartmentWithMatterAndAppCode[] }>
            (this.appConfig.serviceBase + '/Matters/GetDepartmentWithMatCategoryAndAppInfo').pipe(
                map(response => response.data));
    }

    public getWorkTypeList(): Observable<DropdownListItem[]> {
        return this.http
            .get<{ data: DropdownListItem[] }>(this.appConfig.serviceBase + '/Matters/GetMatterCategoryIDAndNameList?deptID').pipe(
                map(response => response.data));
    }
    public getLookupType(lookupType: string): Observable<LookupViewModel> {
        return this.http.get<{ data: LookupViewModel }>(this.appConfig.serviceBase + '/Lookup/GetLookupType?lookupTypeTag=' + lookupType)
            .pipe(
                map(response => response.data));
    }
    public GetCrimeLookupData(lookupId: LookupType) {
        return this.http.get<{ body: LoockupItem[] }>
            (`${this.appConfig.apiv3CrimeApi}/CrimeCommon/GetCrimeLookups/${lookupId}`).pipe(
                map(responce => responce.body)
            );
    }
    public getFeeEarnerList(isActive: boolean): Observable<FeeEarnerInfo[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetFeeEarners?isActive=' + isActive).pipe(
            map(response => response.data));
    }
    public getBranchList(): Observable<DropdownListItem[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/Client/GetBranchIDAndNameList').pipe(
            map(response => response.data));
    }

}
