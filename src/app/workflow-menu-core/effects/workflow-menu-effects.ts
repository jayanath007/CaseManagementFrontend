
import { tap, catchError, switchMap, map, mergeMap, take, filter } from 'rxjs/operators';
import { FormViewRequestViewModel } from '../../screen-view-core/models/request';
import { SystemJsPopupLoaderService } from '../../shell-desktop/services/system-js-popup-loader.service';
import { ItemChangeKind } from '../models/enums';
import { InforDialogComponent } from '../../shared/components/infor-dialog/infor-dialog.component';

import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData, ConfirmDialogResult, ConfirmDialogResultKind } from '../../shared/models/dialog';
import { MatDialog } from '@angular/material';
import { WorkflowDocumentViewFail } from '../actions/core';
import {
    WorkflowDocumentViewResponse, WorkflowDocumentViewRequest,
    WorkflowMenuMetaDataWrapper, WorkflowMenuMetaDataRap, WorkflowMenuMetaItem
} from '../models/interfaces';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';

import { WorkflowMenuService } from '../services/workflowMenu.service';
import { MatterSearchGridData } from '../../core/lib/matter';
import { getRightClickMenutByToken, getMenuEditIsDirtyByToken } from '../reducers';
import { of, from, combineLatest, empty } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import * as Core from '../actions/core';
import { getMenuListByToken, getIsRequestToExitMenuEditByToken, getMenuMatterInfoByToken, getMenuIsFileBaseMenuByToken } from '..';
import { getIsWorkflowMenuInitByToken } from '..';
import { MenusUserAction } from '../../core/lib/workflow';
import { MenuButtpnClick } from '../../open-case-core';
import { MenuButtonClickType } from '../../open-case-core/models/enums';
import { fitWindow } from '../../utils/bounds';
import * as WindowPopup from '../../document-view/actions/window-popups';
import * as CoreActions from '../../core/lib/actions';
import { uuid } from '../../utils/uuid';
import { CheckoutTempalteFiles } from '../../document-view';

@Injectable()
export class WorkflowMenuEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: WorkflowMenuService,
        private urlResolver: FileUrlResolverService, private dialog: MatDialog, private popupService: SystemJsPopupLoaderService) {
    }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitWorkFlowMenu>(Core.INIT_WORKFLOW_MENU),
        // .do(() => console.log('$INIT_WORKFLOW_MENU 222'))
        switchMap((action) =>
            this.store.select(getIsWorkflowMenuInitByToken(action.token)).pipe(
                filter((isInit) => !isInit),
                take(1),
                mergeMap((val) =>
                    from([new Core.LoadMenuList(action.token),
                    new Core.LoadMenuMatterShortCutKeys(action.token),
                    new Core.LoadMenuMatterSummery(action.token),
                    new Core.LoadFileBaseMenu(action.token)])
                ))));

    @Effect()
    Refresh$ = this.actions$.pipe(ofType<Core.RefreshWorkFlowMenu>(Core.REFRESH_MENU),
        mergeMap((action) =>
            from([new Core.LoadMenuList(action.token),
            new Core.LoadMenuMatterShortCutKeys(action.token),
            new Core.LoadMenuMatterSummery(action.token),
            new Core.LoadFileBaseMenu(action.token)])
        ));

    @Effect()
    WorkFlowCompleted$ = this.actions$.pipe(ofType<Core.WorkflowSessionCompleted>(Core.WORKFLOW_SESSION_COMPLETED),
        mergeMap((action) =>
            from([new Core.LoadMenuListAfterRefresh(action.token),
            new Core.LoadMenuMatterShortCutKeys(action.token),
            new Core.LoadMenuMatterSummery(action.token)])
            // new Core.LoadFileBaseMenu(action.token)])
        ));

    @Effect()
    XmCommondExecuted$ = this.actions$.pipe(ofType<CoreActions.WorkflowXmCommondExecuted>(CoreActions.WORKFLOW_XM_COMMAND_EXECUTED),
        switchMap((action) =>
            from([new Core.ToBeSelectedWorkFlowMenuItem(action.token, action.menuName)])
        ));

    @Effect()
    initWorkflowMenuData$ = this.actions$.pipe(ofType<Core.LoadMenuList>(Core.LOAD_WORKFLOW_MENU_LIST),
        switchMap((action) =>
            this.store.select(getMenuMatterInfoByToken(action.token)).pipe(
                map((matterInfo: MatterSearchGridData) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap<any, Core.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getMenuList(info.matterInfo).pipe(
                    map((result) => new Core.LoadMenuListSuccess(info.token, { menuList: result.data })),
                    catchError((error) => of(new Core.LoadMenuListFail(info.token, error))));
            } else {
                return of();
            }
        }
        ));
    @Effect()
    initWorkflowMenuAfterRefresh$ = this.actions$.pipe(ofType<Core.LoadMenuListAfterRefresh>(Core.LOAD_WORKFLOW_MENU_LIST_REFRESH),
        switchMap((action) =>
            this.store.select(getMenuMatterInfoByToken(action.token)).pipe(
                map((matterInfo: MatterSearchGridData) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap<any, Core.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getMenuList(info.matterInfo).pipe(
                    map((result) => new Core.LoadMenuListAfterRefreshSuccess(info.token, { menuList: result.data })),
                    catchError((error) => of(new Core.LoadMenuListAfterRefreshFail(info.token, error))));
            } else {
                return of();
            }
        }
        ));

    @Effect()
    isFileBaseMenu$ = this.actions$.pipe(ofType<Core.LoadFileBaseMenu>(Core.LOAD_FILE_BASE_MENU),
        switchMap((action) =>
            this.store.select(getMenuMatterInfoByToken(action.token)).pipe(
                map((matterInfo: MatterSearchGridData) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap<any, Core.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getIsFileBaseMenu(info.matterInfo).pipe(
                    // .do((data) => console.log('getIsFileBaseMenu 222', data))
                    map((result) => new Core.LoadFileBaseMenuSuccess(info.token, { isFileBaseMenu: result })),
                    catchError((error) => of(new Core.LoadFileBaseMenuFail(info.token, error))));
            } else {
                return of();
            }
        }));


    @Effect()
    getMatterShortCutKyesData$ = this.actions$.pipe(ofType<Core.LoadMenuMatterShortCutKeys>(Core.LOAD_MENU_MATTER_SHORTCUT_KEYS),
        switchMap((action) =>
            this.store.select(getMenuMatterInfoByToken(action.token)).pipe(
                map((matterInfo: MatterSearchGridData) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap<any, Core.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getShortCutKeys(info.matterInfo).pipe(
                    tap((data) => console.log('getShortCutKeys', data)),
                    map((result) => new Core.LoadMenuMatterShortCutKeysSuccess(info.token, { matterShortCut: result })),
                    catchError((error) => of(new Core.LoadMenuMatterShortCutKeysFail(info.token, error))));
            } else {
                return of();
            }
        }));

    @Effect()
    getMatterSummeryData$ = this.actions$.pipe(ofType<Core.LoadMenuMatterSummery>(Core.LOAD_MENU_MATTER_SUMMARY),
        switchMap((action) =>
            this.store.select(getMenuMatterInfoByToken(action.token)).pipe(
                map((matterInfo: MatterSearchGridData) => ({ matterInfo, token: action.token })),
                take(1))),
        switchMap<any, Core.Any>((info) => {
            if (info && info.matterInfo) {
                return this.service.getMatterSummery(info.matterInfo).pipe(
                    // .do((data) => console.log('getMatterSummery', data))
                    map((result) => new Core.LoadMenuMatterSummerySuccess(info.token, { matterSummeryData: result })),
                    catchError((error) => of(new Core.LoadMenuMatterSummeryFail(info.token, error))));
            } else {
                return of();
            }
        }));

    @Effect()
    ExportWorkFlowmenuToLocalData$ = this.actions$.pipe(ofType<Core.WorkflowMenuExportToLocal>(Core.WORKFLOW_MENU_EXPORT_TO_LOCAL),
        tap(action => console.log('ExportWorkFlowmenuToLocalData')),
        switchMap((action: Core.WorkflowMenuExportToLocal) =>
            combineLatest(
                this.store.select(getMenuMatterInfoByToken(action.token)),
                this.store.select(getRightClickMenutByToken(action.token)),
                this.store.select(getMenuListByToken(action.token)),
                ((matterInfo, selectedNode, menuList) => ({
                    matterInfo, selectedNode, menuList,
                    menuExportData: action.payload.menuExportData, token: action.token
                }))
            ).pipe(
                take(1))
        ),
        switchMap((info) =>
            this.service.exportWorkflowMenus(info.matterInfo, info.selectedNode, info.menuList, info.menuExportData).pipe(map((response) =>
                new Core.WorkflowMenuExportToLocalSuccess(info.token, { menuExportData: info.menuExportData, exportData: response })),
                catchError(error => of(new Core.WorkflowMenuExportToLocalFail(info.token, error))))
        ));

    @Effect()
    WorkFlowMenuUserAction$ = this.actions$.pipe(ofType<Core.WorkFlowUserAction>(Core.USER_ACTION),
        switchMap((action: Core.WorkFlowUserAction) =>
            this.store.select(getMenuEditIsDirtyByToken(action.token)).pipe(
                map(isDirty => ({ isDirty, action: action })), take(1))
        ),
        map((info) => {
            if (info.action.payload.type && info.action.payload.type === MenusUserAction.fileBase) {
                return new Core.MenuEditSaveAction(info.action.token);
            } else if (info.isDirty) {
                if (info.action.payload.type && info.action.payload.type === MenusUserAction.save) {
                    return new Core.MenuEditSaveAction(info.action.token);
                } else if (info.action.payload.type && info.action.payload.type === MenusUserAction.cancel) {
                    return new Core.MenuEditCancelAction(info.action.token);
                }
                return empty();
            } else {
                return new Core.CloseMenuEdit(info.action.token);
            }
        }));


    @Effect()
    CancelMenuEditExit$ = this.actions$.pipe(ofType<Core.CloseMenuEdit>(Core.CLOSE_MENU_EDIT),
        map(action =>
            new MenuButtpnClick(action.token, { buttonType: MenuButtonClickType.WorkflowMenuView })));

    @Effect()
    saveMenuData$ = this.actions$.pipe(ofType<Core.MenuEditSaveAction>(Core.SAVE_ACTION),
        switchMap((action) =>
            combineLatest(
                this.store.select(getMenuMatterInfoByToken(action.token)),
                this.store.select(getMenuListByToken(action.token)),
                this.store.select(getMenuIsFileBaseMenuByToken(action.token)),
                ((matterInfo, allmenuList, isFileBaseMenu) => ({
                    matterInfo, allmenuList, isFileBaseMenu,
                    token: action.token
                }))
            ).pipe(take(1))
        ),
        switchMap((info) =>
            this.service.addUpdateMenuTreeList(info.matterInfo, info.allmenuList, info.isFileBaseMenu).pipe(
                map((result) => new Core.MenuEditSaveActionSuccess(info.token, { newMenuList: result })),
                catchError((error) => of(new Core.MenuEditSaveActionFail(info.token, error))))
        ));

    @Effect()
    WorkFlowMenuEditSaveSuccess$ = this.actions$.pipe(ofType<Core.MenuEditSaveActionSuccess>(Core.SAVE_ACTION_SUCCESS),
        switchMap((action: Core.MenuEditSaveActionSuccess) =>
            this.store.select(getIsRequestToExitMenuEditByToken(action.token)).pipe(
                map(isRequest => ({ isRequest, action: action })), take(1))
        ), map(info => {
            if (info.isRequest) {
                return new Core.CloseMenuEdit(info.action.token);
            } else {
                return new Core.AllDataUpdate(info.action.token);
            }
        }));

    @Effect()
    ImportWorkFlowRuleData$ = this.actions$.pipe(ofType<Core.WorkflowMenuImport>(Core.WORKFLOW_MENU_IMPORT),
        switchMap((action) =>
            combineLatest(
                this.store.select(getMenuMatterInfoByToken(action.token)),
                ((matterInfo) => ({
                    matterInfo,
                    file: action.payload.FullfileData.fileData,
                    importButtonType: action.payload.FullfileData.importButtonType,
                    token: action.token
                }))
            ).pipe(take(1))),
        tap(action => console.log('ImportWorkFlowRuleData', action)),
        switchMap((info) => {
            if (info.file) {
                const data = new FormData();
                data.append('file', info.file[0]);
                data.append('appId', JSON.stringify(info.matterInfo.appID));
                return this.service.ImportSelectedWorkflowMenus(data).pipe(map((response) =>
                    new Core.WorkflowMenuImportSuccess(info.token, { importedData: response, importButtonType: info.importButtonType })),
                    catchError(error => of(new Core.WorkflowMenuImportFail(info.token, error))));
            }
        }));
    @Effect()
    treeItemChangeEditTemplate$ = this.actions$.pipe(ofType<Core.TreeItemChange>(Core.TREE_ITEM_CHANGE),
        filter(action => action.payload.kind === ItemChangeKind.editTemplate && action.payload.value.data.atN_Type === 4),
        switchMap<Core.TreeItemChange, Action>((action) => {
            const _data = action.payload.value.data;
            // checkout by someone else
            if (_data.checkedOutByUser && _data.checkedOutByUser !== '' && (!_data.checkedOutHashKey || _data.checkedOutHashKey === '')) {
                // view
                return this.urlResolver.getTemplateDataUrl(_data.atN_AppID, _data.atN_Command).pipe(map((url) =>
                    new WindowPopup.OpenByUrl({
                        id: _data.atN_AppID + '_' + _data.atN_Command,
                        url: url,
                        spec: {
                            ...fitWindow(),
                        },
                        attachmentName: ''
                    })
                ));
            } else {
                return of(new CheckoutTempalteFiles({ appId: _data.atN_AppID, fileName: _data.atN_Command }));
            }
        }));

    @Effect({ dispatch: false })
    treeItemChangeDownloadTemplate$ = this.actions$.pipe(ofType<Core.TreeItemChange>(Core.TREE_ITEM_CHANGE),
        filter(action => action.payload.kind === ItemChangeKind.downloadTemplate && action.payload.value.data.atN_Type === 4),
        mergeMap((action) => {
            return this.urlResolver.getTemplateDownloadUrl({
                appId: action.payload.value.data.atN_AppID,
                templateName: action.payload.value.data.atN_Command,
                convertToDocx: true // TODO Check Is Template Word Document
            });
        }),
        tap((url) => {
            window.open(url, '_blank');
        }));

    // disable enable screen edit
    @Effect({ dispatch: false })
    treeItemChangeEditScreen$ = this.actions$.pipe(ofType<Core.TreeItemChange>(Core.TREE_ITEM_CHANGE),
        tap((data) => {
            console.log('treeItemChangeEditScreen' + data);
        }),
        filter(action => action.payload.kind === ItemChangeKind.editTemplate
            && action.payload.value.data.atN_Type === 2),
        tap((action) => {
            const token = 'screenDesingner' + uuid();
            this.popupService.openScreenDesingner(token, action.payload.value.data.atN_Command,
                action.payload.value.data.atN_AppID);
        }));



    @Effect()
    openWopi$ = this.actions$.pipe(ofType<Core.WorkflowDocumentView>(Core.WORKFLOW_DOCUMENT_VIEW),
        map((action) => {
            const appId = action.payload.request.appId;
            const fileName = action.payload.request.fileName;
            return new CheckoutTempalteFiles({ appId: appId, fileName: fileName });
        }));


    // @Effect()
    // openWopi$ = this.actions$.pipe(ofType<Core.WorkflowDocumentView>(Core.WORKFLOW_DOCUMENT_VIEW),
    //     switchMap((action) =>
    //         this.service.WorkflowMenusOpenDocument(action.payload.request).pipe(
    //             switchMap<any, any>((response: any) => {

    //                 if (response && response.status) {

    //                     if (response.status === 'Fail' && response.detailStatus) {
    //                         let message = '';
    //                         response.detailStatus.forEach((item) => {
    //                             message = message + '<br>' + item.message;
    //                         });
    //                         const dialogData: ConfirmDialogData = {
    //                             content: {
    //                                 title: 'Error',
    //                                 message: message,
    //                             },
    //                             contentParams: {},
    //                             data: { messageType: 'warning' }
    //                         };
    //                         const dialogRef = this.dialog.open(InforDialogComponent, {
    //                             data: dialogData,
    //                             width: '400px',
    //                             disableClose: true,
    //                             panelClass: 'dps-notification'
    //                         });
    //                         const self = this;
    //                         return dialogRef.afterClosed();

    //                     } else if (response.status === 'Success') {
    //                         if (response.detailStatus && response.detailStatus.length > 0
    //                             && response.detailStatus[0].code === 'FileNotFound') {

    //                             // poupmasage

    //                             const dialogData: ConfirmDialogData = {
    //                                 content: {
    //                                     title: 'Template not exists',
    //                                     message: 'Do you need to create the template',
    //                                 },
    //                                 contentParams: {},
    //                                 data: null
    //                             };
    //                             const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //                                 data: dialogData,
    //                                 width: '400px',
    //                                 disableClose: true,
    //                                 panelClass: 'dps-notification'
    //                             });
    //                             const self = this;
    //                             return dialogRef.afterClosed().pipe(
    //                                 switchMap(dialogResult => {
    //                                     if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
    //                                         return this.service.GenerateTemplate(action.payload.request.appId,
    //                                             action.payload.request.fileName).pipe(
    //                                                 map((result) => {
    //                                                     return new Core.WorkflowDocumentView(response.token,
    //                                                         { request: action.payload.request });
    //                                                 }),
    // catchError((error) => of(new Core.WorkflowDocumentViewFail(action.token, error))));
    //                                     } else {
    //                                         return of(new Core.WorkflowDocumentViewFail(action.token, { error: 'close' }));
    //                                     }
    //                                 }));
    //                         } else if (!response.detailStatus || response.detailStatus.length === 0) {
    //                             return of(new Core.DisplyWopiDocumentViewPoup(action.token,
    //                                 { docLink: response.data, id: `Document - ${action.payload.request.fileName}` }));
    //                         } else {
    //                             return empty();
    //                         }
    //                     }
    //                     return empty();
    //                 } else {
    //                     return of(new Core.DisplyWopiDocumentViewPoup(action.token,
    //                         { docLink: response.data, id: `Document - ${action.payload.request.fileName}` }));
    //                 }
    //             }),
    //             catchError((ex) => {
    //                 return of(new Core.WorkflowDocumentViewFail(action.token, { error: ex }));
    //             }))
    //     ));

    // @Effect()
    // displyWopiDocumentViewPoup$ = this.actions$.pipe(ofType<Core.DisplyWopiDocumentViewPoup>(Core.DISPLY_WOPI_DOCUMENT_VIEW_POUP),
    //     map((action) =>
    //         ({ url: action.payload.docLink.url, id: action.payload.id })
    //     ), map(({ url, id }) =>
    //         new WindowPopup.OpenByUrl({
    //             id: id, url: url, spec: {
    //                 ...centerToWindow(800, 600),
    //                 toolbar: false,
    //                 location: false,
    //                 directories: false,
    //                 status: false,
    //                 menubar: false,
    //                 scrollbars: false,
    //             }
    //         })
    //     ));

    @Effect()
    MenuEditDuplicate$ = this.actions$.pipe(ofType<Core.MenuEditDuplicate>(Core.MENU_EDIT_DUPLICATE),
        switchMap((action) =>
            combineLatest(
                this.store.select(getMenuMatterInfoByToken(action.token)),
                // this.store.select(getMenuListByToken(action.token)),
                // this.store.select(getMenuIsFileBaseMenuByToken(action.token)),
                ((matterInfo) => ({
                    matterInfo,
                    token: action.token,
                    selectedNodes: travers(action.payload.selectedMenu, [])
                }))
            ).pipe(take(1))
        ),
        switchMap((info) =>
            this.service.DuplicateItemPrecess(info.matterInfo, info.selectedNodes, false).pipe(
                map((result) => new Core.MenuEditDuplicateSuccess(info.token, { newMenuList: result })),
                catchError((error) => of(new Core.MenuEditDuplicateFail(info.token, error))))
        ));

    @Effect()
    duplicutSuccess$ = this.actions$.pipe(ofType<Core.MenuEditDuplicateSuccess>(Core.MENU_EDIT_DUPLICATE_SUCCESS),
        map(action => new Core.RefreshWorkFlowMenu(action.token)));
}

// function travers(list: WorkflowMenuMetaDataWrapper[], callback: (item: WorkflowMenuMetaDataWrapper, parent?:
//     WorkflowMenuMetaDataWrapper) => void) {
//     const curItem = list;
//     const travel = function (items: WorkflowMenuMetaDataWrapper[], parent: WorkflowMenuMetaDataWrapper) {
//         items.forEach((item) => {
//             callback(item, parent);
//             if (item.items && item.items.length) {
//                 travel(item.items, item);
//             }
//         });
//     };
//     travel(list, null);
// }

function travers(menuItemTree: WorkflowMenuMetaDataRap<Readonly<WorkflowMenuMetaItem>>, menuItems: WorkflowMenuMetaItem[])
    : WorkflowMenuMetaItem[] {

    // let tempMenuItems: WorkflowMenuMetaItem[] = [];
    menuItems.push(
        {
            atN_ID: menuItemTree.data.atN_ID,
            atN_ParentID: menuItemTree.data.atN_ParentID,
            atN_AppID: menuItemTree.data.atN_AppID,
            atN_Type: menuItemTree.data.atN_Type,
            atN_Order: menuItemTree.data.atN_Order,
            atN_Command: menuItemTree.data.atN_Command,
            atN_Desc: menuItemTree.data.atN_Desc,
            atN_Level: menuItemTree.data.atN_Level,
            atN_Help: menuItemTree.data.atN_Help,
            atN_ParentMenu: menuItemTree.data.atN_ParentMenu,
            nodeStatus: menuItemTree.data.nodeStatus,
            createUser: menuItemTree.data.createUser,
            dateDone: menuItemTree.data.dateDone
        }
    );
    // }

    menuItemTree.items.map(i => { menuItems = travers(i, menuItems); });
    return menuItems;

    // if (menuItemTree) {
    //      menuItems.concat(
    //         {
    //             atN_ID: menuItemTree.data.atN_ID,
    //             atN_ParentID: menuItemTree.data.atN_ParentID,
    //             atN_AppID: menuItemTree.data.atN_AppID,
    //             atN_Type: menuItemTree.data.atN_Type,
    //             atN_Order: menuItemTree.data.atN_Order,
    //             atN_Command: menuItemTree.data.atN_Command,
    //             atN_Desc: menuItemTree.data.atN_Desc,
    //             atN_Level: menuItemTree.data.atN_Level,
    //             atN_Help: menuItemTree.data.atN_Help,
    //             atN_ParentMenu: menuItemTree.data.atN_ParentMenu,
    //             nodeStatus: menuItemTree.data.nodeStatus,
    //             createUser: menuItemTree.data.createUser,
    //             dateDone: menuItemTree.data.dateDone
    //         }

    //     );
    //     menuItems.push(menuItemTree.items.map(i => travers(i, menuItems));
    // }
    // return menuItems;
}


