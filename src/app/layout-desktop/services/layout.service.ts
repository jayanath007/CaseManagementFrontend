import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { AppConfig } from '../../core';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { IsDpsMailPipe } from './../../shared';

export interface DatabaseIdentity {
  databaseId: string;
  databaseName: string;
  environmentName: string;
  storageName: string;
  isSelected: string;
}

@Injectable()
export class LayoutService {

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  // public getPreloadUrls() {
  //   return this.http.get<any>(this.appConfig.wopiBase + '/Link/GetPreloadUrls').pipe(map((data) => {
  //     return data;
  //   }));
  // }

  public getOpenCaseMaterDataFromMailSubjectOrDiaryId({ mailSubject, diaryId }: { mailSubject: string, diaryId: number },
    companyCode: string) {
    const isDpsMail = new IsDpsMailPipe();
    if (isDpsMail.transform(mailSubject, companyCode)) {
      return this.http.get<GridRowItemWrapper>(this.appConfig.serviceBase
        + '/Matters/GetMatterByNewMailSubject?subject=' + encodeURIComponent(mailSubject),
      ).pipe(
        map((data) => {
          const newData: any = {
            data: data.data,
            selected: false,
            expanded: false, loading: false, financeDetails: null
          };
          return newData;
        })
      );
    } else {
      return this.http.get<{ body }>(`${this.appConfig.apiv3DiaryApi}/Diary/GetMatterByDiaryId/${diaryId}/Temp`).pipe(
        map((data) => {
          const newData: any = {
            data: {
              appID: data.body.appId,
              app_Code: data.body.appCode,
              branchID: data.body.branchId,
              clientName: data.body.clientName,
              client_Ref: data.body.clientRef,
              closed: data.body.closed ? 1 : 0,
              eBilling: data.body.ebilling,
              feeEarner: data.body.feeEarner,
              fileID: data.body.fileId,
              isLegalAid: data.body.legalAid,
              isPlotMasterMatter: data.body.plotMasterMatter,
              isPlotMatter: data.body.plotMatter,
              isProspectMatter: data.body.prospectMatter,
              matterCounter: data.body.matCounter,
              matterDetails: data.body.matterDetails,
              matterReferenceNo: data.body.matterRef,
              rateCategory: data.body.rateCategoryId,
              ufnValue: data.body.ufn,
              // leadUfn: data.body.leadUfn,
            },
            selected: false,
            expanded: false, loading: false, financeDetails: null
          };
          return newData;
        })
      );
    }

  }

  public getDatabases() {
    return this.http.get<{ data: DatabaseIdentity[] }>(this.appConfig.serviceBase + '/General/GetDatabases').pipe(
      map((data) => {
        return data.data || [];
      }));
  }
}
