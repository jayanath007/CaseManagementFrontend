
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



import { AppConfig } from '../../core/configs/app-config';

@Injectable()
export class WorkflowDiaryService {

    constructor(private httpClient: HttpClient, private appConfig: AppConfig) {

    }

    public getFileLetterHistories(CaseFileIdentityWithAppCodeViewModel) {
        const headers = new Headers({ 'Content-Type': undefined });
        return this.httpClient
            .post<any>(this.appConfig.serviceBase + '/Diary/GetFileLetterHistories', CaseFileIdentityWithAppCodeViewModel).pipe(
                map((response) => response.data));
    }

}
