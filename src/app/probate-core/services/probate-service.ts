
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../core';
import { map } from 'rxjs/operators';
import { AccountItem } from '../models/interfaces';

@Injectable()
export class ProbateService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }
    public getProbateDatatest() {
        return this.http.get<any>(this.appConfig.serviceBase + '/Probate/GetProbateData').pipe(
            map(response => response.data));
    }
    public getProbateData(matterData) {
        const fields = 'estates,transactions,distributions,spouseorcivilpartner,bankexemptions,ihtforms';
        return this.http.get<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/GetProbateData?fields=${fields}&branchId=${matterData.branchID}&appId=${matterData.appId}&fileId=${matterData.fileID}`,
        ).pipe(map(responce => responce.body));
    }

    public updateRnrbData(rnrbUpdateData, spouseorCivilPatner, matterInfo) {
        const data: any = {
            branchId: matterInfo.branchID,
            appId: matterInfo.appId,
            fileId: matterInfo.fileID,
            spouseorCivilPatner: spouseorCivilPatner,
            residenceNilRateBandInfo: rnrbUpdateData,
        };

        return this.http.post<any>(`${this.appConfig.apiv3ProbateApi}/Probate/UpdateSpouseCivilPartnerOrRNRB`, { body: data }).pipe(
            map(response => response.body));

    }

    public saveProbateAccount(updateData, matterInfo) {
        const accountItem: AccountItem = {
            branchId: matterInfo.branchID,
            appId: matterInfo.appId,
            fileId: matterInfo.fileID,
            id: updateData.id,
            probateTransId: null,
            dealtBy: updateData.dealtBy,
            percent: null,
            description: updateData.description,
            contactId: null,
            soldDate: updateData.soldDate,
            amount: parseInt(updateData.amount.toString(), 10),
            pBS: updateData.pBS ? updateData.pBS : false,
            Scpe: updateData.Scpe ? updateData.Scpe : false,
            noOfShares: updateData.noOfShares ? updateData.noOfShares : 0,
            subType: updateData.subType ? updateData.subType : 3,

        };

        return this.http.post<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/SaveProbateAccountItem`,
            { body: accountItem }).pipe(map(responce => responce.body));

    }
    public refeshProbateData(matterData) {
        const fields = 'estates,transactions,distributions,spouseorcivilpartner,bankexemptions,ihtforms';
        return this.http.get<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/GetProbateData?fields=${fields}&branchId=${matterData.branchID}&appId=${matterData.appId}&fileId=${matterData.fileID}`,
        ).pipe(map(responce => responce.body));
    }

    public deleteAccountItem(id) {
        return this.http.delete<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/DeleteAccountItem/${id}`,
        ).pipe(map(responce => responce.body));
    }
    public deleteProbateItem(id) {
        return this.http.delete<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/DeleteProbateItem/${id}`,
        ).pipe(map(responce => responce.body));
    }
    public generateForm(matterData, data) {
        return this.http.get<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/PopulateIHTForms?branchId=${matterData.branchID}&appId=${matterData.appId}&fileId=${matterData.fileID}&isForce400=${data.isForce400}&isForce205=${data.isForce205}`,
        ).pipe(map(responce => responce.body));
    }
    public generateAccount(matterData) {
        return this.http.get<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/GenarateAccounts?branchId=${matterData.branchID}&appId=${matterData.appId}&fileId=${matterData.fileID}`,
        ).pipe(map(responce => responce.body));
    }

}
