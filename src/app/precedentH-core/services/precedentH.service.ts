
import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../core';
import { PrecedentHInput, PrecedentHS, EstimateValues, EstimateViewData, TotalsValues } from '../models/interfaces';
import { XMLFileTypes, eBillingType } from '../../core/lib/matter';

@Injectable()
export class PrecedentHService {


    constructor(private http: HttpClient, private appConfig: AppConfig) {

    }
    public getPrecedentSList(matterInfo: PrecedentHInput) {
        const matterData = {
            BranchId: matterInfo.BranchId,
            AppId: matterInfo.AppId,
            FileId: matterInfo.FileId,
            DisplayDataString: '',
        };
        return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSList',
            {
                CaseFileIdentityWithAppIdViewModel: matterData,
                Phases: XMLFileTypes.Phases
            }).pipe(
                map(response => response.data));
    }
    public getPrecedentHDataList(matterInfo: PrecedentHInput) {
        const matterData = {
            BranchId: matterInfo.BranchId,
            AppId: matterInfo.AppId,
            FileId: matterInfo.FileId,
            DisplayDataString: '',
        };
        return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentHList',
            {
                CaseFileIdentityWithAppIdViewModel: matterData,
                Phases: ''
            }).pipe(
                map(response => response.data));
    }
    public savePrecedentHS(matterInfo: PrecedentHInput, precedentHSList: PrecedentHS[]): any {
        const matterData = {
            BranchId: matterInfo.BranchId,
            AppId: matterInfo.AppId,
            FileId: matterInfo.FileId,
            DisplayDataString: '',
        };
        if (matterInfo.eBilling === eBillingType.PrecedentH) {
            return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/UpdatePrecedentHEstimates',
                {
                    CaseFileIdentityWithAppIdViewModel: matterData,
                    PhaseDescriptionViewModel: precedentHSList
                }).pipe(
                    map(response => response));
        } else if (matterInfo.eBilling === eBillingType.PrecedentS) {
            return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/UpdatePrecedentSEstimates',
                {
                    CaseFileIdentityWithAppIdViewModel: matterData,
                    PhaseDescriptionViewModel: precedentHSList
                }).pipe(
                    map(response => response));
        } else {
            return null;
        }
    }

    public getWorkTypeList() {
        return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentHWorkTypeList').pipe(
            map(response => response.data));
    }

    public exportXML(matterInfo: PrecedentHInput) {
        const matterData = {
            BranchId: matterInfo.BranchId,
            AppId: matterInfo.AppId,
            FileId: matterInfo.FileId,
            DisplayDataString: '',
        };
        if (matterInfo.eBilling === eBillingType.PrecedentH) {
            return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/AddPrecedentHSFileNote',
                {
                    CaseFileIdentityWithAppIdViewModel: matterData,
                    PrecedentSMatter: 'False'
                }).pipe(
                    map(response => response));
        } else if (matterInfo.eBilling === eBillingType.PrecedentS) {
            return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/AddPrecedentHSFileNote',
                {
                    CaseFileIdentityWithAppIdViewModel: matterData,
                    PrecedentSMatter: 'True'
                }).pipe(
                    map(response => response));
        }
    }

    public getEstimatedCost(matterInfo: PrecedentHInput) {
        const matterData = {
            BranchId: matterInfo.BranchId,
            AppId: matterInfo.AppId,
            FileId: matterInfo.FileId,
        };
        return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/',
            matterData).pipe(
                map(response => response.data));
    }


    public getPrecidentHData(matterInfo: PrecedentHInput) {
        // branchId: number, fileId: number, appId: number
        const fields = 'jobs,statistics';
        return this.http.get<{ body: any }>
            (`${this.appConfig.apiv3PrecidentHApi}/PrecedentH/GetPrecedentHData?branchId=${matterInfo.BranchId}&fileId=${matterInfo.FileId}&appId=${matterInfo.AppId}`)
            .pipe(map(responce => responce.body));
    }


    public savePrecedentHRates(matterInfo: PrecedentHInput, selectEstimateValues: EstimateViewData, savePrecedentHRates: any,
        estimateValueChanges: any, selectedWorkTypeId: number, totalValues: TotalsValues) {

        const request = {
            fileId: matterInfo.FileId,
            branchId: matterInfo.BranchId,
            appId: matterInfo.AppId,
            estimateValueChanges: estimateValueChanges,
            estimateValue: {
                phsId: null,
                // fileId: matterInfo.FileId,
                // branchId: matterInfo.BranchId,
                // appId: matterInfo.AppId,
                workTypeId: selectedWorkTypeId,
                expertFees: selectEstimateValues ? Number(selectEstimateValues.estimateValues.expertFees) : null,
                expertDisbursements: selectEstimateValues ? Number(selectEstimateValues.estimateValues.expertDisbursements) : null,
                leadingCounsel: selectEstimateValues ? Number(selectEstimateValues.estimateValues.leadingCounsel) : null,
                juniorCounsel: selectEstimateValues ? Number(selectEstimateValues.estimateValues.juniorCounsel) : null,
                courtFees: selectEstimateValues ? Number(selectEstimateValues.estimateValues.courtFees) : null,
                otherDisbursements: selectEstimateValues ? Number(selectEstimateValues.estimateValues.otherDisbursements) : null,
                assumption: selectEstimateValues ? selectEstimateValues.assumptions : null,
                profitTotal: totalValues ? Number(totalValues.totalProfitCost) : null
            },

            feeEarnerTimeRates: savePrecedentHRates,
        };

        return this.http.post<{ body: any }>(`${this.appConfig.apiv3PrecidentHApi}/PrecedentH/AddUpdatePrecedentH/`,
            { body: request }).pipe(map(responce => responce.body));

    }

}
