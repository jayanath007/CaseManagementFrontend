import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../core/configs/app-config';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { CurrentLimits, LimitHistory, UserInputData } from '../models/interfaces';
import { CrimeLimitHistoryViewModel } from '../models/request';

@Injectable()
export class PriceCapLimitService {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getTimeCurrentLimits(model: CrimeClassIdentityViewModel) {
        return this.http.post<{ data: CurrentLimits[] }>(`${this.appConfig.serviceBase}/CrimeTime/GetTimeCurrentLimits`, model)
            .pipe(map(response => response.data));
    }

    public getLimitHistoryDetails(model: CrimeClassIdentityViewModel, limitType: number) {
        const requestBody = { limitType: limitType, CrimeClassIdentityViewModel: model };
        return this.http.post<{ data: LimitHistory[] }>(`${this.appConfig.serviceBase}/CrimeTime/GetLimitHistoryDetails`, requestBody)
            .pipe(map(responce => responce.data));
    }

    public saveExceedLimit(request: CrimeLimitHistoryViewModel) {
        return this.http.post(`${this.appConfig.serviceBase}/CrimeTime/SaveExceedLimit`, request.toPost())
            .pipe(map(responce => responce));
    }

    public deleteLimitHistory(request: CrimeLimitHistoryViewModel) {
        return this.http.post(`${this.appConfig.serviceBase}/CrimeTime/DeleteLimitHistory`, request.toPost());
    }

}
