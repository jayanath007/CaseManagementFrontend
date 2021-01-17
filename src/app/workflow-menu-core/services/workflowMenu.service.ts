
import { tap, map } from 'rxjs/operators';
import { WorkflowMenuMetaItem, ExportData } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { MatterSearchGridData } from '../../core/lib/matter';
import { AppConfig } from '../../core';
import { IS_GOOGLE } from '../../shared';

@Injectable()
export class WorkflowMenuService {

    constructor(private http: HttpClient, private appConfig: AppConfig, @Inject(IS_GOOGLE) public isGoogle: boolean) {

    }

    public getMenuList(matterInfo: MatterSearchGridData) {
        return this.http.get<any>
            (this.appConfig.serviceBase + '/WorkFlow/GetMenuListUpdatedWorkFlowRule?appID=' + matterInfo.appID
                + '&fileNum=' + matterInfo.fileID + '&branchID=' + matterInfo.branchID).pipe(
                    map((response) => {
                        return response;
                    }));
    }
    public getIsFileBaseMenu(matterInfo: MatterSearchGridData) {
        return this.http.get<any>
            (this.appConfig.serviceBase + '/WorkFlow/ImportFileBaseMenus?appID=' + matterInfo.appID).pipe(
                map(response => response.data.isImportFileBaseMenus),
                tap(response => console.log('getIsFileBaseMenu', response)));
    }
    public getMatterSummery(matterInfo: MatterSearchGridData) {
        return this.http.post<any>(this.appConfig.serviceBase + '/Matters/GetMatterSummary',
            {
                BranchId: matterInfo.branchID,
                AppId: matterInfo.appID,
                FileId: matterInfo.fileID
            }).pipe(
                map(response => response.data));
    }
    public getShortCutKeys(matterInfo: MatterSearchGridData) {
        return this.http.get<any>
            (this.appConfig.serviceBase + '/Matters/GetMatterShortCutsKeySummary?appID=' + matterInfo.appID).pipe(
                map(response => response.data));
    }

    public exportWorkflowMenus(matterInfo: MatterSearchGridData, selectedNode: any,
        menuList: any, menuExportData: ExportData) {

        const CaseFileIdentityWithAppCodeViewModel = {
            BranchId: matterInfo.branchID,
            AppCode: matterInfo.app_Code,
            FileId: matterInfo.fileID
        };

        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/ExportWorkflowMenus', {
            ParentMenuCommand: selectedNode.atN_Command,
            SelectedOption: menuExportData.menuExportFileType,
            FileIdentityAppCode: CaseFileIdentityWithAppCodeViewModel,
            MenuViewList: menuList,
            IsSaveToServer: menuExportData.isToServer
        }).pipe(
            map(response => response),
            tap(response => console.log('ExportWorkflowMenus', response.status)));
    }

    public addUpdateMenuTreeList(matterInfo: MatterSearchGridData, allMenuList: WorkflowMenuMetaItem[], isFileBaseMenu: boolean) {
        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/ProcessSaveMenus',
            {
                BranchId: matterInfo.branchID,
                AppId: matterInfo.appID,
                FileId: matterInfo.fileID,
                WorkflowMenuList: allMenuList,
                ImportFileBaseMenus: isFileBaseMenu
            }).pipe(
                map(response => response.data));
    }

    public ImportSelectedWorkflowMenus(file: any) {

        const headers = new Headers({ 'Content-Type': undefined });
        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/ImportSelectedWorkflowMenus',
            file).pipe(
                map((response) => response.data),
                tap(response => console.log('import', response.status)));
    }


    public ImportWorkflowMenus(file: any) {
        const headers = new Headers({ 'Content-Type': undefined });
        return this.http.post<any>(this.appConfig.serviceBase + '/WorkFlow/ImportSelectedWorkflowMenus',
            file).pipe(
                map((response) => response.data),
                tap(response => console.log('import', response.status)));
    }


    // public WorkflowMenusOpenDocument(workflowDocumentViewRequest: WorkflowDocumentViewRequest) {
    //     const params = {
    //         appId: workflowDocumentViewRequest.appId,
    //         fileName: workflowDocumentViewRequest.fileName,
    //         fileUrlType: workflowDocumentViewRequest.wopiActionType,
    //     };
    //     return this.http.post<any>(`${this.appConfig.serviceBase}/Drive/GetDpsTemplateUrl`, params,
    //         { headers: new HttpHeaders().set('Accept', 'application/json') });
    // }

    // public WorkflowMenusOpenDocument(workflowDocumentViewRequest: WorkflowDocumentViewRequest) {
    //     if (this.isGoogle) {
    //         const params = {
    //             appId: workflowDocumentViewRequest.appId,
    //             fileName: workflowDocumentViewRequest.fileName,
    //         };
    //         return this.http.post<any>(`${this.appConfig.serviceBase}/GoogleFile/GetDpsTemplateUrl`, params,
    //             { headers: new HttpHeaders().set('Accept', 'application/json') }).pipe(map((data) => {
    //                 return data.data;
    //             }));
    //     } else {
    //         const params = {
    //             appId: workflowDocumentViewRequest.appId,
    //             fileName: workflowDocumentViewRequest.fileName,
    //             wopiActionType: workflowDocumentViewRequest.wopiActionType,
    //         };
    //         return this.http.post<any>(`${this.appConfig.wopiBase}/Link/GetDpsTemplateUrl`, params,
    //             { headers: new HttpHeaders().set('Accept', 'application/json') });
    //     }

    // }
    public GenerateTemplate(appId: number, templateName: string) {
        return this.http.get<any>
            (this.appConfig.serviceBase + '/File/GenerateTemplate?appId=' + appId + '&templateName=' + templateName).pipe(
                map(response => response.data));
    }

    public DuplicateItemPrecess(matterInfo: MatterSearchGridData, duplicateist: WorkflowMenuMetaItem[], isFileBaseMenu: boolean) {
        return this.http.post<{ data: WorkflowMenuMetaItem[] }>(this.appConfig.serviceBase + '/WorkFlow/AddDuplicateTree',
            {
                BranchId: matterInfo.branchID,
                AppId: matterInfo.appID,
                FileId: matterInfo.fileID,
                WorkflowMenuList: duplicateist,
                ImportFileBaseMenus: isFileBaseMenu
            }).pipe(
                map(response => response.data));
    }

}
