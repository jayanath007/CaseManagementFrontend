import { MenuExportFileType, ItemDragTo, ImportButtonType } from './enums';
import { DPSResponse } from '../../core/lib/data-response';


export interface WorkflowMenuMetaItem {
    atN_ID: number;
    atN_ParentID: number;
    atN_AppID: number;
    atN_Type: number;
    atN_Order: number;
    atN_Command: string;
    atN_Desc: string;
    atN_Level: number;
    atN_Help: string;
    atN_ParentMenu: string;
    nodeStatus: number;
    createUser: string;
    dateDone: string;
    checkedOutByUser?: string;
    checkedOutHashKey?: string;
}

export interface WorkflowMenuMetaDataRap<T> {
    treeId: number;
    parentId: number;
    treeLevel: number;
    isRowEdit: boolean;
    isRightClick: boolean;
    isRowSelected: boolean;
    indexId: number;
    data: T;
    items?: WorkflowMenuMetaDataWrapper[];
    enabled: boolean;
    isTreeNodeExpand: boolean;
    editingBusy?: boolean;

}

export interface ExportData {
    menuExportFileType: MenuExportFileType;
    isToServer: boolean;
}

export type WorkflowMenuMetaDataWrapper = WorkflowMenuMetaDataRap<Readonly<WorkflowMenuMetaItem>>;


export class MatterSummery {
    description1: string;
    description2: string;
    key: string;
    value: string;
}
export class MatterShortcuts {
    kbs_sourcetype: number;
    kbs_keycode: number;
    kbs_appid: number;
    kbs_item_name: string;
    kbs_item_title: string;
    kbs_item_variant: string;
    kbs_item_notes: string;
    kbs_KeyText: string;
}

export interface MoveMenuItem {
    dragItem: WorkflowMenuMetaDataWrapper;
    dropItem: WorkflowMenuMetaDataWrapper;
    ItemDragTo: ItemDragTo;
}

export interface WorkflowMenuFileData {
    fileData: any;
    importButtonType: ImportButtonType;
}

export interface WorkflowMenuKeyUpDownData {
    keyCode: number;
    selectMenuItem: WorkflowMenuMetaDataWrapper;
}

export interface WorkflowDocumentViewRequest {
    appId: number;
    fileName: string;
    wopiActionType?: string;
}


export class WorkflowDocumentViewResponseData {
    url: string;
}

export interface FormLibraryTemplateInfo {
    isFormLibraryTemplate: boolean;
    formLibraryTemplatePath: string;

}




export type WorkflowDocumentViewResponse = DPSResponse<WorkflowDocumentViewResponseData>;





