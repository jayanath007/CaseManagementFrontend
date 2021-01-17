
// import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';

import { AppConfig } from '../../core';
import { centerToWindow } from '../../utils/bounds';
import { AllGridRespone } from '../models/interface';
import { AllGridRequest } from '../models/request';
// import { uuid } from '../../utils/uuid';

@Injectable()
export class PreviousTransactionsService {
    constructor(private http: HttpClient, private appConfig: AppConfig
    ) { }

    public getPreviousTransGridData(request: AllGridRequest) {
        return this.http.post<AllGridRespone>(this.appConfig.serviceBase + '/LedgerCard/GetLedgerPreviousTransData',
            request.allGridToPost()).pipe(
                map((response) => response.data));
    }

}
