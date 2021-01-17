
import { map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MatterResponse, MatterDataResponse, MatterInfoResponse, ReviewNoteResponce } from '../models/interfaces';

import { DepartmentResponse, MatterFinanceResponse, GridRowItemWrapper } from '../models/interfaces';
import { MatterRequest, MatterRequestForMatterCreate } from '../models/requests';

import { AppConfig } from '../../core';
import { DatePipe } from '@angular/common';
import { CaseFileIdentityWithAppIdViewModel } from '../../core/lib/files';

@Injectable()
export class MatterSearchService {

    private matters$;
    public testData: any;

    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) {
    }
    public getDepartments() {
        return this.http.get<DepartmentResponse>(this.appConfig.serviceBase +
            '/Matters/GetDepartments').pipe(map(response => response.data),
                tap((response) => console.log('depart', response)));
    }
    // For matter creation
    public loadMatterCreationSearchData(request: MatterRequestForMatterCreate) {
        return this.http.post<MatterResponse>(this.appConfig.serviceBase + '/Matters/MattersSearchByFields', request.toPost()).pipe(
            map((response) => {
                if (response.data.data['matters']) {
                    return {
                        data: {
                            data: response.data.data['matters'], total: response.data.total,
                            aggregates: response.data.aggregates,
                            totalBillOutstandingBalance: response.data.data['totalBillOutstandingBalance'],
                            totalMatterCount: response.data.data['totalMatterCount']
                        },
                        status: response.status,
                        messageBody: response.messageBody,
                        messageHeader: response.messageHeader,
                        detailStatus: response.detailStatus,
                        totalBillOutstandingBalance: response.data.data['totalBillOutstandingBalance'],
                        totalMatterCount: response.data.data['totalMatterCount']
                    };
                } else {
                    return response;
                }
            }));
    }

    public loadMatterData(request: MatterRequest) {
        return this.http.post<MatterResponse>(this.appConfig.serviceBase +
            `/Matters/${request.filterOptions.matterFilterType === 'SuggestByEmails' ? 'GetMattersByEmail ' : 'GetMatters'}`,
            request.toPost()).pipe(
                map((response) => {
                    const data: MatterDataResponse = response.data as any;
                    if (data.data.matters) {
                        return {
                            data: {
                                data: data.data.matters,
                                total: response.data.total,
                                aggregates: response.data.aggregates,
                            },
                            status: response.status,
                            messageBody: response.messageBody,
                            messageHeader: response.messageHeader,
                            detailStatus: response.detailStatus,
                            totalBillOutstandingBalance: data.data.totalBillOutstandingBalance,
                            totalMatterCount: data.data.totalMatterCount
                        };
                    } else {
                        return response;
                    }
                }));
    }
    public loadMatterFinanceData(request: GridRowItemWrapper) {
        return this.http.get<MatterFinanceResponse>(this.appConfig.serviceBase + '/Matters/GetMatterFinance?matterRef=' +
            request.data.matterReferenceNo).pipe(map((response) => {
                return {
                    wipSum: response.data.wipSum ? response.data.wipSum : 0.00,
                    wipLimit: response.data.wipLimit ? response.data.wipLimit : 0.00,
                    clientBal: response.data.clientBal ? response.data.clientBal : 0.00,
                    unpaidBill: response.data.unpaidBill ? response.data.unpaidBill : 0.00,
                    dateLastBill: response.data.dateLastBill ? response.data.dateLastBill : null
                };
            }));
        // .do((response) => console.log('matterFinance1111', response));
    }

    public getMatterInfoByCaseIdentity(request: GridRowItemWrapper) {
        return this.http.get<MatterInfoResponse>(this.appConfig.serviceBase +
            `/Matters/GetMatterInfoByCaseIdentity?appId=${request.data.appID
            }&branchId=${request.data.branchID}&fileId=${request.data.fileID}`).pipe(map((response) => response.data));
    }

    public addReferralNoteData(saveData: any) {



        return this.http.post<any>(`${this.appConfig.serviceBase}/Matters/AddUpdateReviewDataToDpsVars`,
            {
                reviewDate: this.datePipe.transform(saveData.event.reviewDate, 'yyyy-MM-dd HH:mm:ss'),
                reviewNote: saveData.event.reviewNotes,
                keyMessage: saveData.event.keyMessage,
                reviewBy: '',
                branchId: saveData.data.matterInfo.branchID,
                appId: saveData.data.matterInfo.appID,
                fileId: saveData.data.matterInfo.fileID,
                displayDataString: '',

            }
        );


    }
    public getReviewNotes(request: CaseFileIdentityWithAppIdViewModel) {
        return this.http.post<{ data: ReviewNoteResponce }>(`${this.appConfig.serviceBase}/Matters/GetReviewNotes`, request)
            .pipe(map(response => response.data));
    }
}

