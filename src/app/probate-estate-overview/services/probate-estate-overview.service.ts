
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from '../../core';
import { FormType, ProbateEntryType } from '../models/enums';
import { CategoryItem, EOMatterData, EstateOverviewModel } from '../models/interfce';

@Injectable()
export class ProbateEstateOverviewService {

    constructor(private http: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe) {
    }
    public getProbateCategory() {
        return this.http.get<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/GetMetaData`,
        ).pipe(map(responce => responce.body));
    }
    public saveProbateEstateItem(saveModel: EstateOverviewModel) {
        let mapModel;
        if (saveModel.probateEntryType === ProbateEntryType.Asset) {
            mapModel = {
                ...saveModel,
                itemData: {
                    ...saveModel.itemData,
                    jointOwnershipStartDate: saveModel.itemData['jointOwnershipStartDate'] ?
                        new Date(saveModel.itemData['jointOwnershipStartDate']).toDpsString() : null,
                    finalPaymentDate: saveModel.itemData['finalPaymentDate'] ?
                        new Date(saveModel.itemData['finalPaymentDate']).toDpsString() : null
                }
            };
        } else if (saveModel.probateEntryType === ProbateEntryType.Liability) {
            mapModel = {
                ...saveModel,
                itemData: {
                    ...saveModel.itemData,
                    loanDate: saveModel.itemData['loanDate'] ?
                        new Date(saveModel.itemData['loanDate']).toDpsString() : null,
                    loanStartDate: saveModel.itemData['loanStartDate'] ?
                        new Date(saveModel.itemData['loanStartDate']).toDpsString() : null
                }
            };
        } else if (saveModel.probateEntryType === ProbateEntryType.Gift) {
            mapModel = {
                ...saveModel,
                itemData: {
                    ...saveModel.itemData,
                    dateOfGift: saveModel.itemData['dateOfGift'] ?
                        new Date(saveModel.itemData['dateOfGift']).toDpsString() : null,
                    preOwnedAssetDateOfGift: saveModel.itemData['preOwnedAssetDateOfGift'] ?
                        new Date(saveModel.itemData['preOwnedAssetDateOfGift']).toDpsString() : null
                }
            };
        } else {
            mapModel = saveModel;
        }
        return this.http.post<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/SaveEstateItem`,
            { body: mapModel }).pipe(map(responce => responce.body.probateId));
    }
    public getProbateItemById(id: number): Observable<EstateOverviewModel> {
        return this.http.get<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/GetProbateItemById/${id}`)
            .pipe(map(response => response.body));
    }
    public deleteAccountItem(rowId: number) {
        return this.http.delete<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/DeleteAccountItem/${rowId}`,
        ).pipe(map(responce => responce.body));
    }
    public getJointlyOwnedAssetsByMatter(matterData: EOMatterData, formType: FormType, category: CategoryItem) {
        const entryFormType = (formType === FormType.Asset) ? 0 :
            (formType === FormType.Liability) ? 1 : (formType === FormType.Exemption) ? 2 : (formType === FormType.Gift) ? 3 : null;
        return this.http.get<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/GetJointlyAssets?branchId=${matterData.branchId}&appId=${matterData.appId}&fileId=${matterData.fileId}&category=${category.id}&entryType=${entryFormType}`)
            .pipe(map(response => response.body));
    }
}
