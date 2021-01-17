import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { AddNewClassRequest } from '../models/request';
import { ClassObj, ClassTotalsViewModel } from '../models/interfaces';
import { CrimeClassRequest, ClassListRequest } from './../../core/lib/crime-managment';
import { TotalData } from '../../crime-class-information-proceedings-core/models/interfaces';

@Injectable()
export class CrimeManagementService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getClassList(model: ClassListRequest) {
        return this.http.post<{ data: ClassObj[] }>
            (`${this.appConfig.serviceBase}/CrimeTime/GetClassList`, model.DataRequestToPost()).pipe(
                map(responce => responce.data));
    }

    public getClassType() {
        return this.http.get<any>(`${this.appConfig.serviceBase}/CrimeTime/GetCrimeClassTypes`).pipe(
            map(responce => responce.data));
    }

    public addClass(model: AddNewClassRequest) {
        return this.http.post<any>(`${this.appConfig.serviceBase}/CrimeTime/AddClass`, model.DataRequestToPost()).pipe(
            map(responce => responce.data));
    }
    // public getCrimeRates() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/CrimeTime/GetCrimeRates').pipe(
    //         map(response => response.data));
    // }
    // public getRatePrecentage() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/CrimeTime/GetRatesChangePercentages').pipe(
    //         map(response => response.data));
    // }
    public deleteClass(data: CrimeClassRequest) {
        return this.http.post<any>(this.appConfig.serviceBase + '/CrimeTime/DeleteClass', data.CrimeClassIdentityViewModel()).pipe(
            map(response => response.data));
    }
    public getClassTotal(branchId: number, fileId: number, classId: number) {

        return this.http.post<{ body: { claimTotalSummary: ClassTotalsViewModel } }>
        (`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetCurrentTotals`,
         { body: { crimeClassIdentityRequest : { branchId:branchId , classId: classId ,fileId :fileId }  } })
        .pipe(map(responce => responce.body));

        // return this.http.get<{ body: { claimTotalSummary: ClassTotalsViewModel } }>
        //     // tslint:disable-next-line: max-line-length
        //     (`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetCurrentTotals?branchId=${branchId}&fileId=${fileId}&classId=${classId}`)
        //     .pipe(map(responce => responce.body));
    }

}
