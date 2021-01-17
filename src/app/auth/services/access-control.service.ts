import { Injectable } from '@angular/core';
import { Module, SettingKey, UserPermissionKey } from '../../core/lib/app-settings';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as auth from '../reducers';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {

  constructor(private store: Store<auth.State>) { }

  public checkModuleIsActive(moduleId: Module): Observable<boolean> {
    return this.store.select(auth.getModuleCanAccessByModuleId(moduleId));
  }
  public getSettingValue(key: SettingKey) {
    return this.store.select(auth.getDPSSettingValueByKey(key));
  }
  public checkTimeRecordType(appCode: string, eBilling: string, isLegalAid: boolean) {
    return this.store.select(auth.checkTimeRecordType(appCode, eBilling, isLegalAid));
  }
  public getUserPermision(key: UserPermissionKey) {
    return this.store.select(auth.getUserPermitionByKey(key));
  }
}
