import { WorkflowMenuMetaDataWrapper, ExportData, WorkflowMenuFileData, WorkflowMenuKeyUpDownData } from '../models/interfaces';
import { TreeItemChange, WorkFlowMenuTabChange, RunWorkflowCommand, MenuEditDuplicate, WorkflowItemSearch } from '../actions/core';
import { ItemChangeKind } from '../models/enums';
import { MatterSearchGridData } from '../../core/lib/matter';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { ComponentBase } from '../../core/lib/component-base';
import { Store } from '@ngrx/store';
import {
    InitWorkFlowMenu, MenuExportFileType, WorkflowMenuExportToLocal,
    getMenuExportedByToken, getMenuExportToServerTriggerByToken, getMenuOpenFilePathByToken,
    getMenuIsLoadingByToken, getMenuForwardFilePathByToken, CloseMenuEdit, MenuEditIgnowExit, MenuEditSaveAction,
    getMenuCutOrCopyItemByToken, WorkflowMenuImport, getMenuValidationMessageByToken, getMenuIsFileBaseMenuByToken,
    WorkflowMenuKeyUpDown, MsgReset, getMenuCanShowDeleteMsgByToken, DeleteLinkMenuItem, ToBeSelectedWorkFlowMenuItem
} from '..';
import {
    getMenuTreeViewByToken, getMenuSelectedChildListByToken, getActiveToken, getIsOpenConfrimExitByToken,
    getMenuEditIsDirtyByToken, getIsRequestToCancelToken, getWfItemSearchTextByToken, getSelectedMenuItemByToken, getFlatmenuListByToken
} from '../reducers/index';
import { Injector } from '@angular/core';
import { FileManagerType, CheckinFile, DiscardCheckout } from '../../document-view';
import { getMatterSummeryByToken, getShortcutKeysByToken, getMenuFilePathHistoryByToken, getMenuMatterInfoByToken } from '../reducers';

export class BaseWorkflowMenuManager extends ComponentBase {
    public WorkflowMenuList$: any;
    public selectedMenuChildList$: any;
    public matterSummeryList$: any;
    public matterShortCutList$: any;
    public openFilePath$: any;
    public openFilePathHistory$: any;
    public forwardFilePathHistory$: any;
    public exportedData$: any;
    public exportToServerTrigger$: any;
    public loading$: any;
    public requestToCancel$: any;
    public cutOrCopyItem$: any;
    public validationMessage$: any;
    public isFileBaseMenu$: any;
    public isShowDeleteMsg$: any;
    public wfSearchText$: any;
    public wfSelectedItem$: any;
    public flatMenuList$: any;

    constructor(protected store: Store<any>, protected injector: Injector) {
        super();
    }

    protected initSelectors(workflowToken: string, inputData: OpenCaseMenueData) {
        this.store.dispatch(new InitWorkFlowMenu(workflowToken, {
            inputData: inputData
        }));
        this.WorkflowMenuList$ = this.store.select(getMenuTreeViewByToken(workflowToken));
        this.flatMenuList$ = this.store.select(getFlatmenuListByToken(workflowToken));
        this.selectedMenuChildList$ = this.store.select(getMenuSelectedChildListByToken(workflowToken));
        this.matterSummeryList$ = this.store.select(getMatterSummeryByToken(workflowToken));
        this.matterShortCutList$ = this.store.select(getShortcutKeysByToken(workflowToken));
        this.openFilePath$ = this.store.select(getMenuOpenFilePathByToken(workflowToken));
        this.openFilePathHistory$ = this.store.select(getMenuFilePathHistoryByToken(workflowToken));
        this.forwardFilePathHistory$ = this.store.select(getMenuForwardFilePathByToken(workflowToken));
        this.exportedData$ = this.store.select(getMenuExportedByToken(workflowToken));
        this.exportToServerTrigger$ = this.store.select(getMenuExportToServerTriggerByToken(workflowToken));
        this.loading$ = this.store.select(getMenuIsLoadingByToken(workflowToken));
        this.requestToCancel$ = this.store.select(getIsRequestToCancelToken(workflowToken));
        this.cutOrCopyItem$ = this.store.select(getMenuCutOrCopyItemByToken(workflowToken));
        this.validationMessage$ = this.store.select(getMenuValidationMessageByToken(workflowToken));
        this.isFileBaseMenu$ = this.store.select(getMenuIsFileBaseMenuByToken(workflowToken));
        this.isShowDeleteMsg$ = this.isFileBaseMenu$ = this.store.select(getMenuCanShowDeleteMsgByToken(workflowToken));
        this.wfSearchText$ = this.isFileBaseMenu$ = this.store.select(getWfItemSearchTextByToken(workflowToken));
        this.wfSelectedItem$ = this.isFileBaseMenu$ = this.store.select(getSelectedMenuItemByToken(workflowToken));

    }
    // workFlowMenuTabChange(workflowToken: string) {
    //     this.store.dispatch(new WorkFlowMenuTabChange(workflowToken));
    // }
    // getWorkflowMenuList() {
    //     return this.getActiveToken()
    //         .switchMap((token) => this.store.select(getMenuTreeViewByToken(token)));
    // }
    // getSelectedMenuChildList() {
    //     this.getActiveToken()
    //         .switchMap((token) => this.store.select(getMenuSelectedChildListByToken(token)));
    // }
    // getMatterSummeryList() {
    //     return this.getActiveToken()
    //         .switchMap((token) => this.store.select(getMatterSummeryByToken(token)));
    // }
    // getMatterShortCutList() {
    //     return this.getActiveToken()
    //         .switchMap((token) => this.store.select(getShortcutKeysByToken(token)));
    // }


    expandParentList(workflowToken: string, value: any) {
        this.store.dispatch(new ToBeSelectedWorkFlowMenuItem(workflowToken, value));
    }

    getActiveToken() {
        return this.store.select(getActiveToken);
    }

    itemChange(workflowToken: string, kind: ItemChangeKind, value: any) {
        this.store.dispatch(new TreeItemChange(workflowToken, { kind, value }));
    }
    duplicateMenu(workflowToken: string, selectedMenu: WorkflowMenuMetaDataWrapper) {
        this.store.dispatch(new MenuEditDuplicate(workflowToken, { selectedMenu: selectedMenu }));
    }
    runWorkflow(workflowToken: string, injector: Injector, data: any) {
        this.store.dispatch(new RunWorkflowCommand(workflowToken, injector, data));
    }

    msgReset(workflowToken: string, value: string) {
        this.store.dispatch(new MsgReset(workflowToken, { value: value }));
    }
    deleteLinkItem(workflowToken: string, value: boolean) {
        this.store.dispatch(new DeleteLinkMenuItem(workflowToken, { value: value }));
    }
    // isRequestToCancel() {
    //     return this.getActiveToken()
    //         .switchMap((token) => this.store.select(getIsRequestToCancelToken(token)));
    // }
    // menuViewitemClick(workflowToken: string, selectedItem: WorkflowMenuMetaDataWrapper) {
    //     this.store.dispatch(new TreeItemChange(workflowToken, { kind, value }));
    // }

    onExportMenus(workflowToken: string, menuExportData: ExportData) {
        this.store.dispatch(new WorkflowMenuExportToLocal(workflowToken, { menuExportData: menuExportData }));
    }

    importMenu(workflowToken: string, fullFileData: WorkflowMenuFileData) {
        this.store.dispatch(new WorkflowMenuImport(workflowToken, { FullfileData: fullFileData }));
    }
    exitEditView(workflowToken) {
        this.store.dispatch(new CloseMenuEdit(workflowToken));
    }
    cancelExitEditView(workflowToken) {
        this.store.dispatch(new MenuEditIgnowExit(workflowToken));
    }
    saveEditView(workflowToken) {
        this.store.dispatch(new MenuEditSaveAction(workflowToken));
    }
    keyUpDown(workflowToken: string, data: WorkflowMenuKeyUpDownData) {
        this.store.dispatch(new WorkflowMenuKeyUpDown(workflowToken,
            { keyCode: data.keyCode, selectMenuItem: data.selectMenuItem }));
    }

    doCheckin(item: WorkflowMenuMetaDataWrapper) {

        const checkout = {
            hashKey: item.data.checkedOutHashKey,
            url: null,
            name: null,
            path: null,
            fileManagerType: FileManagerType.TemplateManager
        };
        this.store.dispatch(new CheckinFile(checkout));
    }

    doDiscardCheckin(item: WorkflowMenuMetaDataWrapper) {
        const checkout = {
            hashKey: item.data.checkedOutHashKey,
            url: null,
            name: null,
            path: null,
            fileManagerType: FileManagerType.TemplateManager
        };
        this.store.dispatch(new DiscardCheckout(checkout));
    }
    onWfItemSearchtext(workflowToken: string, text: string) {
        this.store.dispatch(new WorkflowItemSearch(workflowToken, text));
    }
}

