import {
    DescriptionList, BillingRequestViewModel, FeeEarnerResponce,
    BillingDisbursmentRequestViewModel, NominalCodeRequestViewModel,
    BillingRequestProcessViewModel,
    BillingAddressRequestViewModel, BillingAddressUpdateRequestViewModel, NominalRequestModelModel, EditTimeRecordData, BillRequestEditData
} from './../models/interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig, LocalStorageKey } from '../../core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { VatCode, PrintPreviewPathResponce } from '../models/interfaces';
import { PosingPeriod } from '../../setting-core';
import { DetailStatus } from '../../shared';

@Injectable()
export class BillingRequestService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {
    }
    public getMatterDataByRef(matterRef: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/LedgerCard/GetMatterFromMatRef?matterRef=' + matterRef).pipe(
            map(response => {
                if (response && response.data) {
                    return response.data;
                } else {
                    return null;
                }
            }));
    }
    public getFeeEarnerList() {
        return this.http.get<FeeEarnerResponce>(this.appConfig.serviceBase + '/EChit/GetFeeEarner').pipe(
            map(response => response.data));
    }
    public getVatCodeList(): Observable<VatCode[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetVatCodesOrderByVatCode').pipe(
            map(response => response.data));
    }
    public getShortcutDescriptionsByType(shortCutType: string): Observable<DescriptionList[]> {
        return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetShortcutDescriptionsByType?shortCutType=' + shortCutType).pipe(
            map(response => response.data));
    }
    public getNominalList(nominalCodeRequestViewModel: NominalCodeRequestViewModel) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Billingrequest/GetDefaultNominalCodeAsync',
            nominalCodeRequestViewModel).pipe(
                map(response => response.data));
    }
    public GetUnbilledTimeRecord(billingRequestViewModel: BillingRequestViewModel) {
        return this.http.post<any>(this.appConfig.serviceBase + '/BillingRequest/GetAllUnbilledTimeAsync',
            billingRequestViewModel).pipe(
                map(response => response.data));
    }
    public GetUnbilledDisbursements(billingDisbursmentRequestViewModel: BillingDisbursmentRequestViewModel) {
        return this.http.post<any>(this.appConfig.serviceBase + '/BillingRequest/GetAllUnbilledDisbursementsAsync',
            billingDisbursmentRequestViewModel).pipe(
                map(response => response.data));
    }
    public GetTimeProfitHeaderData(timeProfitHeaderDataViewModel: BillingRequestProcessViewModel) {
        return this.http.post<any>(this.appConfig.serviceBase + '/BillingRequest/GetProcessedUnbilledTimeAsync',
            timeProfitHeaderDataViewModel).pipe(
                map(response => response.data));
    }
    public getDefaultBillSettings() {
        const userRef = '';
        return this.http
            .post<any>(this.appConfig.serviceBase + '/BillingRequest/GetUserDefaultBillSettingsAsync', { userRef: userRef }).pipe(
                map(response => response.data));
    }
    public getMatterBalances(matterRef: string) {
        return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetMatterBalances?matterRef=' + matterRef).pipe(
            map(response => response.data));
    }
    public GetQuickBillProcessedData(quickBillModel: BillingRequestViewModel) {
        return this.http.post<any>(this.appConfig.serviceBase + '/BillingRequest/GetQuickProcessedUnbilledTimeAsync',
            quickBillModel).pipe(
                map(response => response.data));
    }
    public getAddress(billingAddressRequestViewModel: BillingAddressRequestViewModel) {
        return this.http
            .post<any>(this.appConfig.serviceBase + '/BillingRequest/GetBillingAddressAsync', billingAddressRequestViewModel).pipe(
                map(response => response.data));
    }
    public getComboBoxData(userComboType: string[]) {
        return this.http
            .post<any>(this.appConfig.serviceBase + '/BillingRequest/GetReportLayoutsAsync', userComboType).pipe(
                map(response => response.data));
    }
    public saveDefaultPrintSetting(billSettingRequestViewModel: any) {
        return this.http.post<any>(`${this.appConfig.serviceBase}/BillingRequest/UpdateUserDefaultBillSettingsAsync`,
            billSettingRequestViewModel
        ).pipe(map(response => response.data));
    }
    public saveBillingRequestData(saveDataModel: any) {
        return this.http.post<any>(this.appConfig.serviceBase + '/BillingRequest/BillPrintRequestAsync',
            saveDataModel).pipe(
                map(response => response.data));
    }
    public printBillingRequestData(saveDataModel: any) {
        return this.http.post<{ data: PrintPreviewPathResponce }>(this.appConfig.serviceBase + '/BillingRequest/GetBillPrintPathAsync',
            saveDataModel).pipe(
                map(response => response.data));
    }
    public saveBillingAddress(saveDataModel) {
        const billingAddressUpdateRequestViewModel: BillingAddressUpdateRequestViewModel = {
            billingAddressRequestViewModel: saveDataModel.billingAddressRequestModel,
            billingAddressUpdateViewModels: [saveDataModel.billingAddressResponceModel]
        };
        return this.http.post<any>(this.appConfig.serviceBase + '/BillingRequest/UpdateBillingAddressAsync',
            billingAddressUpdateRequestViewModel).pipe(
                map(response => response.data));
    }
    public getDefaultNominalValueByFE(nominalRequestModelModel: NominalRequestModelModel) {
        return this.http.post<any>(this.appConfig.serviceBase + '/BillingRequest/GetDefaultNominalAsync',
            nominalRequestModelModel).pipe(
                map(response => response.data));
    }
    public saveEditTimeRecord(timeEditData: EditTimeRecordData) {
        return this.http.post<any>(this.appConfig.serviceBase + '/BillingRequest/SaveTimeRecordNoteAsync',
            timeEditData).pipe(
                map(response => response.data));
    }
    public getBillingRequestWebViewToken(fileName: string) {
        return this.http.get<{ body: { token: string } }>
            (`${this.appConfig.apiv3DocumentHandler}/BillingRequest/GetWebViewToken/${fileName}`).pipe(
                map(response => response.body));
    }
    public getBillRequestEditData(billReqId: number, matterRef: string, branchId: number) {
        const tempValue = localStorage.getItem(LocalStorageKey.PostingPeriod);
        const selectedPeriod: PosingPeriod = tempValue ? JSON.parse(tempValue) : null;
        const postingPeriodId = selectedPeriod ? selectedPeriod.tP_ID : 0;
        const param = `billReqId=${billReqId}&matterRef=${matterRef}&branchId=${branchId}&postingPeriodId=${postingPeriodId}`;
        return this.http.get<{ data: BillRequestEditData }>
            (`${this.appConfig.serviceBase}/BillingRequest/GetBillRequestEditData?${param}`).pipe(
                map(response => response.data));
    }

    public IsValidDeleteRequest(billOrProformaData: string) {
        billOrProformaData = billOrProformaData ? new Date(billOrProformaData).toDpsString(true) : null;
        const tempValue = localStorage.getItem(LocalStorageKey.PostingPeriod);
        const selectedPeriod: PosingPeriod = tempValue ? JSON.parse(tempValue) : null;
        const postingPeriodId = selectedPeriod ? selectedPeriod.tP_ID : 0;
        return this.http.get<{ detailStatus: DetailStatus[] }>
            (`${this.appConfig.serviceBase}/BillingRequest/IsValidDeleteRequest?billedDate=${billOrProformaData}&postingPeriod=${postingPeriodId}`)
            .pipe(map(response => response.detailStatus));
    }

    public deleteBilligRequest(billRequestId: number, diaryId: number) {
        return this.http.post<{ data: any }>
            (`${this.appConfig.serviceBase}/BillingRequest/DeleteBilligRequestAsync`, { BillRequestId: billRequestId, DiaryId: diaryId })
            .pipe(map(response => response.data));
    }

}
