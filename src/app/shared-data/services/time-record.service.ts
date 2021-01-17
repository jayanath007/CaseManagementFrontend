import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ClassObj } from './../../crime-management-core/models/interfaces';
import { AppConfig } from './../../core/configs/app-config';
import { CrimeClassIdentityViewModel } from './../../core/lib/timeRecord';
import { CrimeTimeSettings, ClassListRequest } from '../../core/lib/crime-managment';

@Injectable()
export class TimeRecordServices {
    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getCrimeClassList(model: ClassListRequest) {
        return this.http.post<{ data: ClassObj[] }>
            (`${this.appConfig.serviceBase}/CrimeTime/GetClassList`, model.DataRequestToPost()).pipe(
                map(responce => responce.data));
    }

    public getCrimeTimeLoadingSetting(model: CrimeClassIdentityViewModel) {
        return this.http.post<{ data: CrimeTimeSettings }>
            (`${this.appConfig.serviceBase}/CrimeTime/GetCrimeTimeLoadingSettings`, model).pipe(
                map(responce => responce.data)
            );
    }
}
