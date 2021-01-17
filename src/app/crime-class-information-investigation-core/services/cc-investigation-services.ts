import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../core';
import { CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';
import {
    InvestigationClassInfo,
    InvClassTotalsReqViewModel, InvClassCurrentTotalsReqViewModel,
    InvClassCurrentTotalsViewModel, PoliceStationInfoViewModel,
    ClassClosingReqViewModel
} from '../models/interfaces';
import { DatePipe } from '@angular/common';
import { CrimeClassTotalsSummaryViewModel } from '../../core/lib/crime-managment';

@Injectable()
export class CCInvestigationServices {
    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) { }

    public getClassInfo(request: CrimeClassIdentityViewModel) {
        return this.http.post<{ data: InvestigationClassInfo }>
            (`${this.appConfig.serviceBase}/CrimeClassInformation/GetInvestigationClassInfo/`,
                request).pipe(map(responce => responce.data));
    }
    public GetStageReachedValuesForInvClass(request: CrimeClassIdentityViewModel) {
        return this.http.post<{ data: string[] }>(`${this.appConfig.serviceBase}/CrimeClassInformation/GetStageReachedValues/`,
            request).pipe(map(responce => responce.data));
    }
    public GetMatterTypeValuesForInvClass(request: CrimeClassIdentityViewModel) {
        return this.http.post<{ data: string[] }>(`${this.appConfig.serviceBase}/CrimeClassInformation/GetMatterTypeValues/`,
            request).pipe(map(responce => responce.data));
    }
    public GetOutComeCodeValuesForInvClses(request: CrimeClassIdentityViewModel) {
        return this.http.post<{ data: string[] }>(`${this.appConfig.serviceBase}/CrimeClassInformation/GetOutComeCodeValues/`,
            request).pipe(map(responce => responce.data));
    }
    public Save(request: InvestigationClassInfo) {
        const tem = {
            ...request,
            billedDate: this.datePipe.transform(request.billedDate, 'yyyy-MM-dd HH:mm'),
            closedDate: this.datePipe.transform(request.closedDate, 'yyyy-MM-dd HH:mm'),
            openedDate: this.datePipe.transform(request.openedDate, 'yyyy-MM-dd HH:mm'),
        };
        return this.http.post(`${this.appConfig.serviceBase}/CrimeClassInformation/SaveInvestigationClassInfo`, tem);
    }
    public GetInvClassTotalsSummary(request: InvClassTotalsReqViewModel) {
        const temp = {
            ...request,
            ClosedDate: this.datePipe.transform(request.ClosedDate, 'yyyy-MM-dd HH:mm'),
        };
        return this.http.post<{ data: CrimeClassTotalsSummaryViewModel }>
            (`${this.appConfig.serviceBase}/CrimeClassInformation/GetInvClassTotalsSummary`, temp).pipe(
                map(responce => responce.data)
            );
    }
    public GetInvClassCurrentTotals(request: InvClassCurrentTotalsReqViewModel) {
        const temp = {
            ...request,
            ClosedDate: this.datePipe.transform(request.ClosedDate, 'yyyy-MM-dd HH:mm'),
        };
        return this.http.post<{ data: InvClassCurrentTotalsViewModel }>
            (`${this.appConfig.serviceBase}/CrimeClassInformation/GetInvClassCurrentTotals`, temp).pipe(map(responce => responce.data));
    }
    public GetPoliceStationInfoById(id: string) {
        return this.http.get<{ data: PoliceStationInfoViewModel }>
            (`${this.appConfig.serviceBase}/CrimeClassInformation/GetPoliceStationInfoById?policeStId=${id}`).pipe(
                map(responce => responce.data)
            );
    }
    public CheckIsClassClosingValid(request: ClassClosingReqViewModel) {
        return this.http.post<{ data: any }>
            (`${this.appConfig.serviceBase}/CrimeClassInformation/IsClassClosingValid?policeStId=`, request).pipe(
                map(responce => responce.data)
            );
    }
}
