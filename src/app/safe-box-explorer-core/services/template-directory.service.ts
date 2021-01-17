import { Injectable } from '@angular/core';
import { AppConfig, DropdownListData } from '../../core';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CheckedOutData, TemplateListResponse, AppInfo } from '../models/interfaces';

@Injectable()
export class TemplateDirectoryService {

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  public getAppCodeList(): Observable<AppInfo[]> {
    return this.http.get<any>(this.appConfig.serviceBase + '/Diary/GetDPSApplicationInfoAsync').pipe(
      map(response => response.data));
  }
  public getTemplateList(appId: number): Observable<TemplateListResponse> {
    return this.http.get<any>(this.appConfig.serviceBase + `/File/GetStorageFiles?appId=${appId}`).pipe(
      map(response => response.data));
  }
  public getCheckedOutFiles(appId: number): Observable<CheckedOutData[]> {
    return this.http.get<any>(this.appConfig.serviceBase + `/File/GetCheckedOutAllFilesFromTemplateAsync?appId=${appId}`).pipe(
      map(response => response.data));
  }

  public getTemplateListWithCheckedOutData(appId: number) {
    return combineLatest(this.getTemplateList(appId), this.getCheckedOutFiles(appId),
      (templateList, checkedOutList) => ({ templateList, checkedOutList })).pipe(
        take(1));
  }

  public copyDriveToTemplateDirectory(driveId: string, fileItemIds: string[], appId: number, path: string) {
    return this.http.post<any>(this.appConfig.serviceBase + '/Drive/CopyDriveToTemplateDirectory',
      { appId, fileItemIds, driveId, path }).pipe(
        map(response => response.data));
  }
  public copyTemplateFileToSameDirectory(copyToPath: string, files: string[]) {
    return this.http.post<any>(this.appConfig.serviceBase + '/Drive/CopyTemplateFileToSameDirectory',
      { copyToPath, files }).pipe(
        map(response => response.data));
  }
  public cutPasteTemplateFileToSameDirectory(copyToPath: string, files: string[]) {
    return this.http.post<any>(this.appConfig.serviceBase + '/Drive/CutPasteTemplateFileToSameDirectory',
      { copyToPath, files }).pipe(
        map(response => response.data));
  }

  public deleteTemplateFile(files: string[]) {
    return this.http.post<any>(this.appConfig.serviceBase + '/Drive/DeleteTemplateFile',
      { files }).pipe(
        map(response => response.data));
  }

  public renameTemplateFile(file: string, newFileName: string) {
    return this.http.post<any>(this.appConfig.serviceBase + '/Drive/RenameTemplateFile',
      { file, newFileName }).pipe(
        map(response => response.data));
  }
  public uploadTemplateFile(data: FormData) {
    return this.http.post<any>(this.appConfig.serviceBase + '/File/UploadTemplateFile', data).pipe(
      map(response => response.data));
  }

  public generateTemplate(templateName: string, appId: number, isCommon: boolean) {
    return this.http.get<any>(this.appConfig.serviceBase +
      `/File/${isCommon ? 'GenerateCommonTemplate' : 'GenerateTemplate'}?appId=${appId}&templateName=${templateName}`)
      .pipe(
        map(response => response.data));
  }
}
