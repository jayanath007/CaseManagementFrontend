
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../core';
import { map } from 'rxjs/operators';

@Injectable()
export class PostingPeriodService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {

    }
    public getOpenTransactionPeriods() {
        return this.http.get<any>(this.appConfig.serviceBase + '/BillingRequest/GetOpenTransactionPeriods').pipe(
            map(response => response.data));
    }


}
