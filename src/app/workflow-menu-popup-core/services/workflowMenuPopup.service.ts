
import {map} from 'rxjs/operators';
import { WorkflowMenuMetaItem } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { MatterSearchGridData } from '../../core/lib/matter';
import { AppConfig } from '../../core';


@Injectable()
export class WorkflowMenuPopupService {

    constructor(private http: HttpClient, private appConfig: AppConfig) {

    }

    public getMenuList(appID: number, fileID: number, branchID: number, ) {
        return this.http.get<any>
            (this.appConfig.serviceBase + '/WorkFlow/GetMenuListUpdatedWorkFlowRule?appID=' + appID
            + '&fileNum=' + fileID + '&branchID=' + branchID).pipe(
            map((response) => {
                return response;
            }));
    }
    public getIsFileBaseMenu(matterInfo: MatterSearchGridData) {
        return this.http.get<any>
            (this.appConfig.serviceBase + '/WorkFlow/ImportFileBaseMenus?appID=' + matterInfo.appID).pipe(
            map(response => response.isImportFileBaseMenus));
    }

}
