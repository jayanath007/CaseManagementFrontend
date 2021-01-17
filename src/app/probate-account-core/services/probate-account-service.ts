import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { WindowPopupsManagerService } from '../../document-view/services/window-popups-manager.service';

import { AccountItem } from '../models/interfaces';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
@Injectable()
export class ProbateAccountService {

  constructor(private httpClient: HttpClient, private appConfig: AppConfig, private datePipe: DatePipe,
    private fileUrlResolverService: FileUrlResolverService, private windowPopupsManagerService: WindowPopupsManagerService) {


  }

  public saveProbateAccount(updateData, matterInfo) {
    const accountItem: AccountItem = {
      branchId: matterInfo.branchID,
      appId: matterInfo.appId,
      fileId: matterInfo.fileID,
      id: updateData.id,
      probateTransId: updateData.probateTransId,
      dealtBy: updateData.dealtBy,
      percent: updateData.percent,
      description: updateData.description,
      contactId: updateData.contactId,
      soldDate: this.datePipe.transform(updateData.soldDate, 'yyyy-MM-ddT00:00:00'),
      amount: updateData.amount,
      receiptType: updateData.receiptType,
      noOfShares: updateData.noOfShares,

      // pBS: updateData.pBS ? updateData.pBS : false,
      // Scpe: updateData.Scpe ? updateData.Scpe : false,
      // noOfShares: updateData.noOfShares ? updateData.noOfShares : 0,
      // subType: updateData.subType ? updateData.subType : 3,

    };

    return this.httpClient.post<{ body: any }>(`${this.appConfig.apiv3ProbateApi}/Probate/SaveProbateAccountItem`,
      { body: accountItem }).pipe(map(responce => responce.body));

  }


  // public getLinkedMatter(request: LinkedMatterRequestViewModel) {

  //   return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/GetLinkedMattersForSpecificMatter', request.toPost());
  // }


  // public createLinkedMatter(request: PlotMatterViewModel) {

  //   return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/AddPlotMatters', request.toPost());
  // }


  // public getPlotStatus(request: PlotMatterViewModel) {

  //   return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/getPlotStatus', request.toPost());
  // }


  // public addDiaryRecordsForPlot(request: any) {
  //   return this.httpClient.post<any>(this.appConfig.serviceBase + '/Diary/AddDiaryRecordsForPlotMattters', request.toPost());
  // }

  // public savePlotSaleScreenData(request: PlotSaleScreenDataViewModel) {
  //   return this.httpClient.post<any>(`${this.appConfig.serviceBase}/WorkFlow/SavePlotSaleScreenData`, request);
  // }

  // public updatePlotMatters(request: PlotMatterUpdateViewModel) {
  //   return this.httpClient.post<any>(this.appConfig.serviceBase + '/Matters/UpdatePlotMatters', request.toPost());
  // }



}

