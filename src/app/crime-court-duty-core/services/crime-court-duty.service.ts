import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../core';
import { RateResponce } from '../../time-information-core';
import { map, filter } from 'rxjs/operators';
import { CourtDutyTimeRecord, GridDataFilter, CourtDutyData } from '../model/interface';
import { PaginatorDef } from './../../core/lib/grid-model';
import { getPaginatorSkip } from '../../core/lib/grid-helpers';

@Injectable()
export class CrimeCourtDutyService {
  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  public getCrimeRates(classId) {
    return this.http.get<{ body: RateResponce }>(`${this.appConfig.apiv3CrimeApi}/CourtDuty/GetCourtDutyRates`)
      .pipe(map(responce => responce.body));
  }

  public saveTimeRecord(model: CourtDutyTimeRecord) {
    return this.http.post(`${this.appConfig.apiv3CrimeApi}/CourtDuty/Save`, {
      body: {
        ...model,
        travelRate: Number(model.travelRate),
        travelVal: Number(model.travelVal),
        socialTimeRate: Number(model.socialTimeRate),
        socialTimeVal: Number(model.socialTimeVal),
        unSocialTimeRate: Number(model.unSocialTimeRate),
        unSocialTimeVal: Number(model.unSocialTimeVal),
        mileage: Number(model.mileage),
        mileageRate: Number(model.mileageRate),
        mileageValue: Number(model.mileageValue),
        vatFares: Number(model.vatFares),
        nonVATFares: Number(model.nonVATFares),
        parking: Number(model.parking),
        totalValue: Number(model.totalValue),
        feMin: model.feMin ? Number(model.feMin) : 0,
        timDate: model.timDate ? new Date(model.timDate).toDpsString() : model.timDate,
        nextHearDate: model.nextHearDate ? new Date(model.nextHearDate).toDpsString() : model.nextHearDate,
        note: model.note,
        matterInfor: model.matterInfor
      }
    });
  }

  public getCourtDutyTimeRecords(branchId: number, filters: GridDataFilter, pageDef: PaginatorDef): Observable<CourtDutyData> {
    let param = `branchId=${branchId}&take=${pageDef.itemPerPage}&skip=${getPaginatorSkip(pageDef)}`;
    if (filters && filters.fromData && filters.toDate) {
      param += `&fromDate=${new Date(filters.fromData).toDpsString()}`;
      param += `&toDate=${new Date(filters.toDate).toDpsString()}`;
    }

    return this.http.get<{ body: CourtDutyData }>
      (`${this.appConfig.apiv3CrimeApi}/CourtDuty/GetCourtDutyTimeRecords?${param}`).pipe(
        map(responce => responce.body)
      );
  }

  public deleteCourtDuty(timid: number) {
    return this.http.delete<{ body: RateResponce }>(`${this.appConfig.apiv3CrimeApi}/CourtDuty/Delete/${timid}`)
      .pipe(map(responce => responce.body));
  }

}



