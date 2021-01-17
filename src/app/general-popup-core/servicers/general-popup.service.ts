
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material';
import { DPSResponse, AppConfig } from '../../core';
import { HttpClient } from '@angular/common/http';
import { GeneralPopupResponse } from '../models/interfaces';
import { GeneralSearchRequest } from '../models/requests';
import {
    PDFBundleCaseFileIdentityWithAppIdRequestViewModel
} from '../../bundling-desktop/containers/bundling-existing-manager.component.component';




@Injectable()
export class GeneralPopupService {

    constructor(
        private http: HttpClient, private appConfig: AppConfig
    ) { }

    public getGeneralPopupData(requestd: any) {
        if (requestd instanceof PDFBundleCaseFileIdentityWithAppIdRequestViewModel) {
            return this.http.post<GeneralPopupResponse>(this.appConfig.serviceBase + requestd.sitePath, requestd.toPost()).pipe(
                map((response) => {
                    return response;
                }));
        } else if (requestd.isFrontEndFilter) {
            return this.http.get<any>(this.appConfig.serviceBase + requestd.sitePath).pipe(
                map((response) => {
                    return response;
                }));
        } else {
            return this.http.post<GeneralPopupResponse>(this.appConfig.serviceBase + requestd.sitePath, requestd.toPost()).pipe(
                map((response) => {
                    return response.data;
                }));
        }

    }

}
