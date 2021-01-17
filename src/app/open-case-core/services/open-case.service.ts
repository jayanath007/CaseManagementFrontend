
import {map} from 'rxjs/operators';

import { OpenCaseUpdateRequest, GetClientRequest, TimesFinancialFiguresRequest } from '../models/requests';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

import { OpenCaseValidationRequest } from '../models/requests';
import { of ,  throwError as _throw } from 'rxjs';
import { GridRowItemWrapper } from '../../matter-search-core/models/interfaces';
import { TimesFinancialFiguresResponse, ScreensContactTypeRequest } from '../models/interface';
import { AppConfig } from '../../core';
import { CaseContactResponse } from '../../case-contact-core/models/interface';


@Injectable()
export class OpenCaseService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }
    public checkValidateOpeningCase(request: OpenCaseValidationRequest) {
        console.log('checkValidateOpeningCase', request);

        // this.updateMatterHistoryOnOpeningCase({ AppId: request.AppID, BranchId: request.BranchID, FileId: request.FileID}).take(1)
        //     .subscribe(() => { });
        return this.http.post<any>(this.appConfig.serviceBase + '/Matters/ValidateOpeningCase',
            {
                BranchID: request.BranchID,
                AppID: request.AppID,
                FileID: request.FileID,
                AppCode: request.AppCode
            });
    }

    public mtterClientToContactLinkSync(request: any) {
        console.log('mtterClientToContactLinkSync', request);
        return this.http.post<any>(this.appConfig.serviceBase + '/Matters/SyncMatterClientToContactLinkAsync',
            {
                AppId: request.AppId,
                BranchId: request.BranchId,
                FileId: request.FileId,
                DisplayDataString : '',
            });
    }


    public updateMatterHistoryOnOpeningCase(request: OpenCaseUpdateRequest) {
        console.log('updateMatterHistoryOnOpeningCase', request);
        return this.http.post<any>(this.appConfig.serviceBase + '/File/UpdateMatterHistoryOnOpeningCase',
            {
                AppId: request.AppId,
                BranchId: request.BranchId,
                FileId: request.FileId,
            });
    }

    public getClientDetails(request: GetClientRequest) {
        console.log('getClientDetails', request);
        return this.http.get<any>(this.appConfig.serviceBase + '/Matters/GetClientDetails?appID='
            + request.appID + '&branchID=' + request.branchID + '&fileID=' + request.fileID);
    }

    public getIsUsingFD() {
        return this.http.get<any>(this.appConfig.serviceBase + '/File/UsingFD').pipe(map((data) => {
            // data['data'] = false;
            return data;
        }));
    }

    public getIsDeleteEnable() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Diary/GetDiaryDeleteEntrySecurity').pipe(map((data) => {
            // data['data'] = false;
            return data;
        }));
    }

    public getAllTimeValTotalByMaterRef(request: TimesFinancialFiguresRequest) {
        return this.http.get<TimesFinancialFiguresResponse>
            (this.appConfig.serviceBase + '/File/GetAllTimeValTotal?matterRef=' + request.matterReferenceNo);
    }


    public getOpenCaseMaterDataFromMailSubject(mailSubject: string) {
        // 'GetMatterByNewMailSubject'
        return this.http.get<GridRowItemWrapper>(this.appConfig.serviceBase
            + '/Matters/GetMatterByNewMailSubject?subject=' + encodeURIComponent(mailSubject),
        ).pipe(map((data) => {
            const newData: any = {
                data: data.data,
                selected: false,
                expanded: false, loading: false, financeDetails: null
            };
            return newData;
        }));
    }

    public getContactTypeScreensLoad(request: ScreensContactTypeRequest) {
        return this.http.post<any>(this.appConfig.serviceBase
            + '/Contacts/GetAllContactScreens', request.toPost()).pipe(map((data) => {
                 return data.data.data;
            }));
    }

    public getShortCutKeys(appId: number) {
        return this.http.get<any>
            (this.appConfig.serviceBase + '/Matters/GetMatterShortCutsKeySummary?appID=' + appId).pipe(
                map(response => response.data));
    }

        public getMatterBannerMsg(request: any) {
        return this.http.post<any>(this.appConfig.serviceBase
            + '/Matters/GetBannerMessages',  {
                AppId: request.AppId,
                BranchId: request.BranchId,
                FileId: request.FileId,
                DisplayDataString : '',
            }).pipe(map(response => response.data));
    }



}
