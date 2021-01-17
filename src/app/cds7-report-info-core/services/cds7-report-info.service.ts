import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../core';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { Cds7ReportInfoView } from './../reducers/cds7-report-info';
import { Cds7ReportInfo } from '../models/cds7-report-info';

@Injectable()
export class Cds7ReportInfoService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public GetCDS7ReportInfo(request: CrimeClassIdentityViewModel) {
        return this.http.get<{ body: { cdS7ReportInfo: Cds7ReportInfoView, caseTypes: string[] } }>
            (`${this.appConfig.apiv3CrimeApi}/Crime/GetCDS7ReportInfo?branchId=${
                request.branchId}&classId=${request.classId}&fileId=${request.fileId}`)
            .pipe(map(responce => responce.body));
    }

    public Save(model: Cds7ReportInfo) {
        model.dateOfMainOffences = model.dateOfMainOffences ? new Date(model.dateOfMainOffences).toDpsString() : null;
        model.gpToSolDate = model.gpToSolDate ? new Date(model.gpToSolDate).toDpsString() : null;
        model.indClaimDate = model.indClaimDate ? new Date(model.indClaimDate).toDpsString() : null;
        model.preOrderWorkDate = model.preOrderWorkDate ? new Date(model.preOrderWorkDate).toDpsString() : null;
        return this.http.post(`${this.appConfig.apiv3CrimeApi}/Crime/SaveCDS7ReportInfo`, { body: model });
    }
}
