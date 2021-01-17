import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CivilManagementModuleInput } from '..';
import { AppConfig } from '../../core';
import { CivilClassObj } from '../model/interfaces';


@Injectable()
export class CivilManagementService {

  constructor(private http: HttpClient, private appConfig: AppConfig) { }

  getClassList(input: CivilManagementModuleInput): Observable<CivilClassObj[]> {
    const param = `appId=${input.appId}&branchId=${input.branchId}&fileId=${input.fileId}`;
    return this.http.get<{ body: CivilClassObj[] }>(`${this.appConfig.apiv3CivilApi}/CivilClassInfor/GetAllOpenClass?${param}`)
      .pipe(map(responce => responce.body));
  }

}
