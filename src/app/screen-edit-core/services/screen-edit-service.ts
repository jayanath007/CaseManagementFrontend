
import {map} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, ScreenEditComponentTreeData } from '../../core';

@Injectable()
export class ScreenEditService {

  constructor(private http: HttpClient, private appConfig: AppConfig) { }
  /* service functions */

  public getComponentTree(screenName: string) {
    return this.http.get<any>(this.appConfig.serviceBase + '/EditScreen/GetComponentTree?screenName=' + screenName).pipe(
      map(response => response.data));
  }

  public getRuleTypeList() {
    return this.http.get<any>(this.appConfig.serviceBase + '/EditScreen/GetRuleTypesIDAndNameList').pipe(
      map(response => response.data));
  }

  public updateData(data: ScreenEditComponentTreeData[]) {
    return this.http.post<any>(this.appConfig.serviceBase + '/EditScreen/InsertOrUpdateComponentsAndProperties',
    {componentTreeViewModels: data}).pipe(
      map((response) => response));
  }
}
