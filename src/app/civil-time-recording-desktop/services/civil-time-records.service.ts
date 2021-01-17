import { PaginatorDef } from './../../core/lib/grid-model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CivilClassObj } from '../../civil-class-management';
import { AppConfig } from '../../core';
import { RateType } from '../model/enum';
import { ViewData, TimeRecordModel, Rates, CivilTimeRecordsData } from '../model/interfaces';
import { getPaginatorSkip } from '../../core/lib/grid-helpers';

@Injectable()
export class CivilTimeRecordsService {
  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  getViewData(classObj: CivilClassObj): Observable<ViewData> {
    let functionName = '';
    if (classObj.className === 'Certificated') {
      functionName = 'GetCertificatedViewData';
    } else if (classObj.className === 'Legal Help') {
      functionName = 'GetLegalHelpViewData';
    }
    return this.http.get<{ body: ViewData }>
      (`${this.appConfig.apiv3CivilApi}/CivilTime/${functionName}?legalAidCaseId=${classObj.legalAidCaseId}`)
      .pipe(map(responce => responce.body));
  }

  getRate(classObj: CivilClassObj, model: TimeRecordModel): Observable<Rates[]> {
    let rateItems = '';
    let param = '';
    if (classObj.className === 'Certificated') {
      rateItems = `${RateType.Travel},${RateType.Advice},${RateType.Counsel},${RateType.Advocacy},${RateType.Milage},${RateType.FaresIncVAT}`;
      param = `judgeLevel=${model.judgeLevel}&`;
    } else if (classObj.className === 'Legal Help') {
      rateItems = `${RateType.Travel},${RateType.Advice},${RateType.Milage},${RateType.FaresIncVAT}`;
    }
    param = `${param}legalAidCaseId=${classObj.legalAidCaseId}&fundingType=${model.level}&rateItems=${rateItems}`;
    return this.http.get<{ body: Rates[] }>
      (`${this.appConfig.apiv3CivilApi}/CivilTime/GetItemRates?${param}`)
      .pipe(map(responce => responce.body));
  }

  getCivilTimeRecodeInfo(diaryId: number): Observable<TimeRecordModel> {
    return this.http.get<{ body: TimeRecordModel }>
      (`${this.appConfig.apiv3CivilApi}/CivilTime/GetCivilTimeRecodeInfo/${diaryId}`)
      .pipe(map(responce => responce.body));
  }

  saveTimeRecord(model: TimeRecordModel): Observable<any> {
    return this.http.post<{ body: any }>
      (`${this.appConfig.apiv3CivilApi}/CivilTime/Save`, { body: model })
      .pipe(map(responce => responce.body));
  }

  deleteTimeRecord(diaryId: number): Observable<any> {
    return this.http.delete(`${this.appConfig.apiv3CivilApi}/CivilTime/DeleteRecord/${diaryId}`);
  }

  getRecordHistory(classObj: CivilClassObj, pageInfo: PaginatorDef): Observable<CivilTimeRecordsData> {
    const skip = getPaginatorSkip(pageInfo);
    const take = pageInfo.itemPerPage;
    return this.http.get<{ body: CivilTimeRecordsData }>
      (`${this.appConfig.apiv3CivilApi}/CivilTime/GetTimeRecords?legalAidCaseId=${classObj.legalAidCaseId}&take=${take}&skip=${skip}`)
      .pipe(map(responce => responce.body));
  }

}
