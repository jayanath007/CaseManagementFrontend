import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';
import { map } from 'rxjs/operators';
import { LookupType, LoockupItem } from '../../shared';
import { ProceedingClassInfoViewModal, TotalData, ProceedingClassInfoResponce } from '../models/interfaces';
import { DatePipe } from '@angular/common';
import { ClassTotalRequest } from '../models/classTotalRequest';

@Injectable()
export class ProceedingsClassServices {
    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) { }

    public getClassInfo(request: CrimeClassIdentityViewModel) {
        return this.http.get<{ body: ProceedingClassInfoResponce }>
            // tslint:disable-next-line: max-line-length
            (`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetProceedingClassInfo?branchId=${request.branchId}&classId=${request.classId}&fileId=${request.fileId}`)
            .pipe(map(responce => responce.body));
    }
    public getClassTotal(request: ClassTotalRequest) {
        return this.http.post<{ body: TotalData }>
            (`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetCurrentTotals`, { body: request.toPost() })
            .pipe(map(responce => responce.body));
    }
    // public getClassTotal(request: CrimeClassIdentityViewModel, model: ProceedingClassInfoViewModal) {
    //     const representationOrderWithdrawnDate = this.datePipe.transform(model.representationOrderWithdrawnDate, 'yyyy-MM-dd HH:mm');
    //     return this.http.get<{ body: TotalData }>
    //         // tslint:disable-next-line: max-line-length
    //         (`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetCurrentTotals?branchId=${request.branchId}&fileId=${request.fileId}&classId=${request.classId}&stageReachedType=${model.stageReached}&caseType=${model.caseType}&isUrbanRates=${model.isUrbanRates}&isDoNotClaimVatChecked=${model.doNotClaimVAT}&isCommitedToCrownCourt=${model.committedToCrownCourt}&isROAppliedAndNotGranted=${model.roNotGranted}&representationOrderWithdrawnDate=${representationOrderWithdrawnDate}&isExtradition=${model.extradition}`)
    //         .pipe(map(responce => responce.body));
    // }
    public GetStageReachedValues() {
        return this.http.get<{ body: string[] }>(`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetStageReachedCodes`,
        ).pipe(map(responce => responce.body));
        // return this.http.get<any>('./../../../assets/crimeclassSampleData.json').pipe(map(data => data.StageReached));
    }
    public GetMatterTypeValues() {
        return this.http.get<{ body: string[] }>(`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetMatterTypes`).
            pipe(map(responce => responce.body));
    }
    public GetOutComeCode() {
        return this.http.get<{ body: string[] }>(`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetOutcomeCodes`).
            pipe(map(responce => responce.body));
    }
    public GetCaseTypes() {
        return this.http.get<{ body: string[] }>(`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/GetCaseTypes`).
            pipe(map(responce => responce.body));
    }
    public GetLookupData(lookupId: LookupType) {
        return this.http.get<{ body: LoockupItem[] }>
            (`${this.appConfig.apiv3CrimeApi}/CrimeCommon/GetCrimeLookups/${lookupId}`).pipe(
                map(responce => responce.body)
            );
    }
    public Save(model: ProceedingClassInfoViewModal) {
        const tem = {
            ...model,
            dateOfMainOffences: this.datePipe.transform(model.dateOfMainOffences, 'yyyy-MM-dd HH:mm'),
            dateFirstInstructed: this.datePipe.transform(model.dateFirstInstructed, 'yyyy-MM-dd HH:mm'),
            preOrderWorkDate: this.datePipe.transform(model.preOrderWorkDate, 'yyyy-MM-dd HH:mm'),
            representationOrderDateAppliedFor: this.datePipe.transform(model.representationOrderDateAppliedFor, 'yyyy-MM-dd HH:mm'),
            representationOrderWithdrawnDate: this.datePipe.transform(model.representationOrderWithdrawnDate, 'yyyy-MM-dd HH:mm'),
            openedDate: this.datePipe.transform(model.openedDate, 'yyyy-MM-dd HH:mm'),
            billedDate: this.datePipe.transform(model.billedDate, 'yyyy-MM-dd HH:mm'),
            closedDate: this.datePipe.transform(model.closedDate, 'yyyy-MM-dd HH:mm'),
        };
        return this.http.post<{ body: any }>
            (`${this.appConfig.apiv3CrimeApi}/ProceedingClassInfo/Save`, { body: tem }).pipe(
                map(responce => responce.body)
            );
    }

    // public GetProClassTotalsSummary(request: any) {
    // const temp = {
    //     ...request,
    //     ClosedDate: this.datePipe.transform(request.ClosedDate, 'yyyy-MM-dd HH:mm'),
    // };
    //     return this.http.get<{ data: CrimeClassTotalsSummaryViewModel }>
    //         (`${this.appConfig.serviceBase}/CrimeClassInformation/GetInvClassTotalsSummary`).pipe(
    //             map(responce => responce.data)
    //         );
    // }
}
