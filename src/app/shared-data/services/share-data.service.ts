import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as masterData from '../reducers';


@Injectable({
    providedIn: 'root'
  })
export class ShareDataService {

    constructor(private store: Store<masterData.State>) { }

    public getAllDepartment() {
        return this.store.select(masterData.getDepartmentList);
    }

    public getWorkTypeByDepartmentId(departmentId) {
        return this.store.select(masterData.getWorkTypeListByDepartmentId(departmentId));
    }

}
