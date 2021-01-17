
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../core';
import { map } from 'rxjs/operators';
import { PageSetupData } from '../models/interfce';

@Injectable()
export class PageSetupService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }
    public getPageSetupService() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Workflow/GetPageSetupSettings').pipe(
            map(response => response.data));
    }
    public SaveSetupChanges(pageSetup: PageSetupData) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Workflow/SavePageSetupSettings', pageSetup).pipe(
            map(response => response));
    }

}





