
import { tap, map } from 'rxjs/operators';
import {
  DropdownListData, Branch, VatCode, MatterBalance, EchitModel, ShortcutType, EChitPrint, PresidentHDisbRequest, EChitPopupInput
} from '../models/interfaces';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { centerToWindow } from '../../utils/bounds';
import { uuid } from '../../utils/uuid';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { AttTypeResponse, CrimeClassIdentityViewModel } from '../../core/lib/timeRecord';
import { ClassListRequest } from '../../core/lib/crime-managment';
import { ClassObj } from '../../crime-management-core/models/interfaces';
import { WebViewService } from '../../azure-storage';


@Injectable()
export class EChitService {

  constructor(private http: HttpClient, private appConfig: AppConfig,
    private fileUrlResolverService: FileUrlResolverService,
    private webViewService: WebViewService,
    private windowPopupsManagerService: WindowPopupsManagerService) { }



  public GetAllChequeRequests(): Observable<DropdownListData[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetAllChequeRequests').pipe(
      map(response => response.data));
  }

  public getReferencesList(): Observable<string[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetReferences').pipe(
      map(response => response.data));
  }

  public getClearanceTypes(): Observable<DropdownListData[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetClearanceTypes').pipe(
      map(response => response.data));
  }

  public getVatCodes(): Observable<VatCode[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetVatCodes').pipe(
      map(response => response.data));
  }

  public getBranches(): Observable<Branch[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetBranches').pipe(
      map(response => response.data));
  }
  // precident_H
  public GetDisbursementType(matterData): Observable<any> {
    const data = {
      branchId: matterData.branchId,
      appId: matterData.appId,
      fileId: matterData.fileId,
    };
    return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentHDisbursementType', data).pipe(
      map(response => response.data),
      tap(response => response.status));
  }


  public getShortcutDescriptionsByType(shortCutType: string): Observable<ShortcutType[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetShortcutDescriptionsByType?shortCutType=' + shortCutType).pipe(
      map(response => response.data));
  }

  public getFeeEarneList(): Observable<DropdownListData[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetFeeEarner').pipe(
      map(response => response.data));
  }

  public getMatterBalances(matterRef: string): Observable<MatterBalance[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetMatterBalances?matterRef=' + matterRef).pipe(
      map(response => response.data));
  }

  public getDefaultVatCode(supplierRef: string): Observable<string> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetDefaultVatCode?supplierRef=' + supplierRef).pipe(
      map(response => {

        return response.data;
      }));
  }



  public GetPrecedentHIncDisbBreakDown(matterData, disbData): Observable<any> {
    const data = {
      branchId: matterData.branchID,
      appId: matterData.appID,
      fileId: matterData.fileID,
      feeEarner: disbData.feeEarner,
      precedentHWorkType: disbData.value
    };
    return this.http.post<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentHIncDisbBreakDown', data).pipe(
      map(response => {

        return response.data;
      }));
  }

  //   public getSuppliers(requestd: GeneralPopupRequest) {
  //     return this.http.post<GeneralPopupResponse>(this.appConfig.serviceBase + '/EChit/GetSuppliers', requestd.toPopupPost())
  //         .map((response) => {
  //             return response.data; });
  // }





  public getNominalList(): Observable<DropdownListData[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetNominals').pipe(
      map(response => response.data));
  }


  public getSetupValueBoolean(): Observable<DropdownListData[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetSetupValueBoolean').pipe(
      map(response => response.data));
  }

  public getClientDefaults(): Observable<DropdownListData[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/GetClientDefaults').pipe(
      map(response => response.data));
  }



  public saveEchit(data: any): Observable<EChitPrint> {

    return this.http.post<any>(this.appConfig.serviceBase + '/EChit/PostChequeRequest', data).pipe(
      map(response => response.data)
    );

  }



  public eChitPrint(reportData: EChitPrint, date: string, telephoneAdvice: boolean, selectedWorktype?: number): Observable<any> {

    return this.http.get<any>(this.appConfig.serviceBase + '/EChit/EChitPrint?chequeRequestID=' + reportData.eChitID
      + '&branchId=' + reportData.branchID
      + '&appId=' + reportData.appID
      + '&fileId=' + reportData.fileID
      + '&date=' + date
      + '&precedentHWorkType=' + selectedWorktype
      + '&telephoneAdvice=' + telephoneAdvice).pipe(
        map((response) => {
          return response.data;
        }),
        tap(response => console.log('save', response.status)));
  }


  public getEChiteportReport(diaryId: number, appCode: string, branchId: number, fileId: number, attachmentName: string) {
    return this.webViewService.getDiaryWebViewUrl(appCode, branchId, fileId, diaryId, attachmentName).pipe(map((data) => {

      const spec = {
        ...centerToWindow(800, 600),
        toolbar: false,
        location: false,
        directories: false,
        status: false,
        menubar: false,
        scrollbars: false,
      };

      this.windowPopupsManagerService.openWindow(uuid(), data, spec, 'pdf');

      return true;
    }));
  }

  public getEChiteportReportWithpath(path: any) {

    return this.fileUrlResolverService.getEChiteportReportWithpath(path).pipe(map((data) => {
      console.log(data);
      const spec = {
        ...centerToWindow(800, 600),
        toolbar: false,
        location: false,
        directories: false,
        status: false,
        menubar: false,
        scrollbars: false,
      };

      this.windowPopupsManagerService.openWindow(uuid(), data, spec, 'pdf');

      return true;
    }));
  }

  public getClassType(data: { branchId: number, appId: number, fileId: number }) {
    const model = new ClassListRequest(data.branchId, data.appId, data.fileId);
    return this.http.post<{ data: ClassObj[] }>
      (`${this.appConfig.serviceBase}/CrimeTime/GetClassList`, model.DataRequestToPost()).pipe(
        map(responce => responce.data));
  }

  public savePresidentHDisb(requestData: EchitModel, diaryId, disbData) {
    const request: PresidentHDisbRequest = {
      dpsEventId: diaryId,
      precedentHDisbCategory: requestData.disbType,
      precedentHWorktype: requestData.workType,
      matRef: requestData.matterRef,
      feeEarner: requestData.feeEarner,
      supplierRef: requestData.supplierRef,
      reason: requestData.reason,
      dateRequested: requestData.dateRequired,
      net: requestData.net,
      vat: requestData.vatAmount,
      precedentHExperCostCourtFeesNet: requestData.fee,
      precedentHExperCostCourtFeesVAT: requestData.fee / 100 * parseInt(requestData.rate, 10),
      itemValue: requestData.disbType === 100 ? (parseInt(requestData.net, 10) - requestData.fee)
        : parseInt(requestData.net, 10),
      disbVATTotal: requestData.disbType === 100 ? (parseInt(requestData.net, 10) - requestData.fee) / 100 * parseInt(requestData.rate, 10)
        : parseInt(requestData.net, 10) / 100 * parseInt(requestData.rate, 10),  // disbData.disbuValus.disbuVat,
    };

    return this.http.post<any>
      (this.appConfig.serviceBase + `/EChit/AddPrecedentHDisbRequest`, request).pipe(
        map(response => {

          return response.data;
        }));
  }
  // public getClassType() {
  //   return this.http.get<any>(`${this.appConfig.serviceBase}/CrimeTime/GetCrimeClassTypes`).pipe(
  //     map(responce => responce.data));
  // }

  public getCrimeWorkTypes(inputData: EChitPopupInput, classId: number) {
    const model: CrimeClassIdentityViewModel = {
      fileId: inputData.fileId,
      branchId: inputData.branchId,
      classId: classId
    };
    return this.http.post<AttTypeResponse>(this.appConfig.serviceBase + '/CrimeTime/GetCrimeWorkTypes',
      model).pipe(
        map(response => response.data));
  }


}
