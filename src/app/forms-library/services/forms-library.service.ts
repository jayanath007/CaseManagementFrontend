
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../../core';
import { map } from 'rxjs/operators';
import { TreeDataResponse } from '../models/interfce';

@Injectable()
export class FormsLibraryService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {

    }
    // public getOpenTransactionPeriods() {
    //     return this.http.get<any>(this.appConfig.serviceBase + '/BillingRequest/GetOpenTransactionPeriods').pipe(
    //         map(response => response.data));
    // }
    public getFormsLibraryTreeData(): Observable<TreeDataResponse> {
        return this.http.get<{ body: any }>(`${this.appConfig.apiv3FormsLibraryApi}/TemplateFormLibProxy`)
            .pipe(map(response => response.body));
    }

}
