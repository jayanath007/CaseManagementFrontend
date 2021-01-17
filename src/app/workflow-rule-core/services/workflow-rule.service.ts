
import {map, tap} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { combineLatest ,  Observable ,  of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WorkflowRuleListDataResponse, WorkflowRuleListData } from '../models/interfaces';
import { AppConfig } from '../../core';

@Injectable()
export class WorkflowRuleService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public getWorkflowRuleList(appID: number) {
        return this.http.get<WorkflowRuleListDataResponse>(this.appConfig.serviceBase + '/WorkFlow/GetWorkflowRuleList?appID=' + appID).pipe(
            tap(response => console.log('GetMenuListUpdatedWorkFlowRule', response)),
            map(response => response),);
    }

    public workFlowRuleDataSubmit(appID: number, branchID: number, fileId: number, workflowRuleList: WorkflowRuleListData[]) {

        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/ProcessSaveWorkFlow', {
            appID: appID,
            branchID: branchID,
            fileId: fileId,
            workflowRuleList: workflowRuleList
        }).pipe(
            map(response => response),
            tap(response => console.log('save', response.status)),);
    }

    public exportWorkflowRule(appID: number, workflowRuleList: WorkflowRuleListData[]) {

        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/ExportWorkFlowRules', {
            fileName: 'DPSWorkflowRule',
            appID: appID,
            WorkflowList: workflowRuleList
        }).pipe(
            map(response => response),
            tap(response => console.log('export', response.status)),);
    }

    public importWorkflowRules(file: any) {
        const headers = new Headers({ 'Content-Type': undefined });
        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/ImportWorkflowRules',
        file).pipe(
            map((response) => response.data),
            tap(response => console.log('import', response.status)),);
    }

}
