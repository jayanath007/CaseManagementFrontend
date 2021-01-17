
import {map} from 'rxjs/operators';
import { BillingGuideViewModel, BillingGuidePopupData, BilledValueResponse } from '../models/interfaces';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';
import { uuid } from '../../utils/uuid';
import { centerToWindow } from '../../utils/bounds';

@Injectable()
export class BillingGuideService {

  constructor(private http: HttpClient, private appConfig: AppConfig,
    private fileUrlResolverService: FileUrlResolverService, private windowPopupsManagerService: WindowPopupsManagerService) {


  }


  public getBillingGuideReport(inputData: BillingGuideViewModel) {
    return this.fileUrlResolverService.getBillingGuideReportUrl2(inputData).pipe(map((data) => {

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

  public getBillingGuideReportCheck(request: BillingGuideViewModel) {



    const params = {
      branchId: request.caseFileIdentityWithAppIdViewModel.branchId,
      appId: request.caseFileIdentityWithAppIdViewModel.appId,
      fileId: request.caseFileIdentityWithAppIdViewModel.fileId,
      matterRef: request.matterRef,
      fromDate: request.fromDate,
      toDate: request.toDate,
      chkType: request.chkType,
      activity: request.activity,
      clientName: request.clientName,
      analysisType: request.analysisType,
      sortBy: request.billingGuideSortBy,
      showTime: request.billingGuideShowTime,
      chkFeeEarner: request.chkFeeEarner,
      chkActivity: request.chkActivity,
      chkHideZeroValues: request.chkHideZeroValues,
      chkBillingSummaryReport: request.chkBillingSummaryReport,
      chkIncludeDisbursement: request.chkIncludeDisbursement,
      isValidate: true,
    };
    const qs = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');

    return this.http.get<any>(this.appConfig.serviceBase + `/EChit/GetBillingGuideReport/?${qs}`).pipe(
      map(response => response));
  }

  public billingguideCloseSave(saveData: BillingGuideViewModel) {
    return this.http.post<any>(this.appConfig.serviceBase + '/Echit/AddBillingGuideFileNoteRecord', saveData).pipe(
      map(response => response));
  }


  public getCalculateTime(inputValue: BillingGuidePopupData) {
    return this.http.get<BilledValueResponse>(this.appConfig.serviceBase
      + '/Echit/GetCalculateTime?matter=' + inputValue.matterRef).pipe(map(response => response.data));
  }



}

