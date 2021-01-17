
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TimeRecordingInfoResponce, TimeRecordAddUpdateViewModel, TimeDeleteViewModel, DiaryFileData } from '../models/interfaces';
import { AppConfig } from '../../core';
import { FeeEarner } from '../../core/lib/fee-earner';
import { XMLFileTypes } from '../../core/lib/matter';
import { FeeEarnerResponse } from '../../add-note-core/models/responses';

@Injectable()
export class TimeRecordingService {

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  public getFeeEarnerList() {
    return this.http.get<FeeEarnerResponse>(this.appConfig.serviceBase + '/TimeRecording/GetFeeEarnerList').pipe(
      map(response => response.data));
  }
  public getDetailsList(feeEarner: FeeEarner, matterRef: string) {
    const groupName = feeEarner ? feeEarner.groupName : null;
    return this.http.get<TimeRecordingInfoResponce>(this.appConfig.serviceBase + '/TimeRecording/GetTimeRecordInfo?matterRef=' +
      matterRef + '&feeEarner=' + groupName).pipe(
        map(response => response.data));
  }
  public saveTimeRecords(timeRecordAddUpdateViewModel: TimeRecordAddUpdateViewModel) {
    return this.http.post<any>(this.appConfig.serviceBase + '/TimeRecording/AddUpdateTimeRecord', timeRecordAddUpdateViewModel).pipe(
      map((response) => response));
  }
  public getIsTimeRecordingEnabled(matterRef) {
    return this.http.get<any>(this.appConfig.serviceBase + '/TimeRecording/IsTimeRecordingEnabled?MatterRef=' + matterRef).pipe(
      map(response => response.data.isTimeRecordingEnabled));
  }
  // eBilling Comment
  public getPrecedentHRateList(matterRef: string) {
    return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetStatusRatesByMatter?matterRef=' + matterRef).pipe(
      map(response => response.data));
  }
  public getWorkTypeList(matterRef: string) {
    return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentHWorkTypeListByMatterRef?matterRef=' + matterRef).pipe(
      map(response => response.data));
  }
  public getPhaseList() {
    return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Phases).pipe(
      map(response => response.data));
  }
  public getActivitiList() {
    return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Activities).pipe(
      map(response => response.data));
  }
  public getTaskList() {
    return this.http.get<any>(this.appConfig.serviceBase + '/PrecedentSH/GetPrecedentSCodesList?type=' + XMLFileTypes.Tasks).pipe(
      map(response => response.data));
  }
  public deleteTimeRecording(timeDeleteViewModel: TimeDeleteViewModel) {
    return this.http.post<any>(this.appConfig.serviceBase + '/TimeRecording/DeleteTimeRecord', timeDeleteViewModel).pipe(
      map((response) => response));
  }
  public getDiaryDocDetails(url: string) {
    return this.http.get<any>(url).pipe(
      map(response => response.data));
  }
  public getDiaryFileData(timeEventId: number) {
    return this.http.get<DiaryFileData>(this.appConfig.serviceBase + '/TimeRecording/GetDiaryLetterName?diaryId=' + timeEventId).pipe(
      map(response => response.data));
  }
}
