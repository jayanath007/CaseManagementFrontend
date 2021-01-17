import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { Injectable } from '@angular/core';
import { TimeRecordGridResponce, TimeInformationModel, RateResponce } from '../models/interfaces';
import { CrimeTimeDeleteViewModel } from '../models/request';
import { LoockupItem, LookupType } from '../../shared';
import { AttTypeResponse, CrimeClassIdentityViewModel, CrimeClassIdentitySubClassViewModel } from '../../core/lib/timeRecord';
import { CrimeClassRequest, FeeEarner } from '../../core/lib/crime-managment';
import { CurrentLimits } from './../../price-cap-limits-core/models/interfaces';

@Injectable()
export class TimeInformationService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getFeeEarnerList() {
        return this.http.get<{ data: FeeEarner[] }>(this.appConfig.serviceBase + '/CrimeTime/GetFeeEarnerLookupData').pipe(
            map(response => response.data));
    }

    public getCrimeWorkTypes(model: CrimeClassIdentityViewModel) {
        return this.http.post<AttTypeResponse>(this.appConfig.serviceBase + '/CrimeTime/GetCrimeWorkTypes',
            model).pipe(
                map(response => {
                    const list = response.data;
                    return list;
                }));
    }

    public getCurrentLimitAndTotalsForSpecificClassType(model: CrimeClassIdentitySubClassViewModel) {
        // SubClassId
        return this.http.post<{ data: CurrentLimits }>
            (`${this.appConfig.serviceBase}/CrimeTime/GetCurrentLimitAndTotalsForSpecificClassType`, model)
            .pipe(map(response => response.data));
    }
    public getCrimeRates(classId) {
        // return this.http.get<RateResponce>(this.appConfig.serviceBase + '/CrimeTime/GetCrimeRates').pipe(
        //     map(response => response));
        return this.http.get<{ body: RateResponce }>
            (`${this.appConfig.apiv3CrimeApi}/CrimeTime/GetCrimeTimeRates?classId=${classId}`)
            .pipe(map(responce => responce.body));
        // return this.http.get<RateResponce>('/assets/rate.json').pipe(
        //     map(response => response));
    }

    public getTimeRecords(request: CrimeClassRequest) {
        return this.http.post<TimeRecordGridResponce>(this.appConfig.serviceBase + '/CrimeTime/GetCrimeTimeRecords',
            request.CrimeClassIdentityViewModel()).pipe(
                map(response => response.data));
    }

    public saveTimeRecord(model: TimeInformationModel) {
        return this.http.post<TimeRecordGridResponce>(this.appConfig.serviceBase + '/CrimeTime/SaveCrimeTime',
            model).pipe(
                map(response => response.data));
    }


    public deleteTimeRecord(request: CrimeTimeDeleteViewModel) {
        return this.http.post<TimeRecordGridResponce>(this.appConfig.serviceBase + '/CrimeTime/DeleteTime',
            request.RequestToPost()).pipe(
                map(response => response.data));
    }

    public getIsTimeRecordingEnabled(matterRef) {
        return this.http.get<any>(this.appConfig.serviceBase + '/TimeRecording/IsTimeRecordingEnabled?MatterRef=' + matterRef).pipe(
            map(response => response.data.isTimeRecordingEnabled));
    }

    // public getRatePrecentage() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/CrimeTime/GetRatesChangePercentages').pipe(
    //         map(response => response.data));
    // }

    public GetAttendeesAndWorkLookupData(lookupId: LookupType) {
        // return this.http.get<{ body: LoockupItem[] }>
        //     (`${this.appConfig.apiv3CrimeApi}/CrimeCommon/GetCrimeLookups/${lookupId}`).pipe(
        //         map(responce => responce.body)
        //     );
        return this.http.get<{ data: LoockupItem[] }>
            (`${this.appConfig.serviceBase}/CrimeTime/GetAttendeesAndWorkLookupData?lookupId=${lookupId}`).pipe(
                map(responce => responce.data)
            );
    }

}
