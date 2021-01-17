
import { tap, map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../core';
import { FeeEarner, Folder, FeeEarnerResponce, FolderResponce, ActionTypeResponce } from '../models/interface';

@Injectable()
export class TaskAddEditService {

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  public getFeeEarners() {
    return this.http.get<FeeEarnerResponce>(this.appConfig.serviceBase + '/MyTasks/GetActiveUserList').pipe(
      map(response => response.data));
  }
  public getFolders(appId: number) {
    return this.http.get<FolderResponce>(this.appConfig.serviceBase2 + '/Diary/GetFolders?appId=' + appId).pipe(
      map(response => response.data));
    // .do((response) => console.log('FolderResponce456', response));
  }
  // Get Action List
  public getActionList(documentFlowStatus: string) {
    return this.http.get<ActionTypeResponce>(this.appConfig.serviceBase + '/MyTasks/GetTaskWorkflowActions?documentFlowStatus=' +
      documentFlowStatus).pipe(
        map(response => response.data));
  }
  public getDefaultFolder(appId: string) {
    return this.http.get<any>(this.appConfig.serviceBase + '/Diary/GetDiaryDefaultFolderIdByAppId?appId=' + appId).pipe(
      map(response => response.data));
  }
  public saveTaskAddEdit(dataModel) {
    return this.http.post<any>(this.appConfig.serviceBase + '/MailBox/AddUpdateDpsTask', dataModel).pipe(
      map(response => response),
      tap(response => console.log('Tasksave', response.status)));
  }
  public getIsTREnable(matterRef: string) {
    return this.http.get<any>(this.appConfig.serviceBase + '/TimeRecording/IsTimeRecordingEnabled?MatterRef=' + matterRef).pipe(
      map(response => response.data.isTimeRecordingEnabled));
  }
  public ValidateTaskDocumentChangePassword(password: string, uid: number) {
    return this.http.get<any>(this.appConfig.serviceBase
      + '/MyTasks/ValidateDpsTaskDocumentChangePassword?password=' + password + '&uId=' + uid).pipe(
        map(response => response.data));
  }
}
