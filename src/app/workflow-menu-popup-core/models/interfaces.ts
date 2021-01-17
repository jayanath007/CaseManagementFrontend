
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
    children?: WorkflowMenuMetaItem[];
}

// export interface WorkflowMenuMetaDataRap<T> {
//     treeId: number;
//     treeLevel: number;
//     isRowEdit: boolean;
//     isRightClick: boolean;
//     isRowSelected: boolean;
//     indexId: number;
//     data: T;
//     items?: WorkflowMenuMetaDataWrapper[];
//     enabled: boolean;
//     isTreeNodeExpand: boolean;

// }

// export type WorkflowMenuMetaDataWrapper = WorkflowMenuMetaDataRap<Readonly<WorkflowMenuMetaItem>>;


// public ModelDirty() {
//     var self = this;
//     self.isMenuDirty = true;
// }
        // isDirty: false,
        // isCutRowItem: false,

// export interface IWorkflowEditMenuMetaData {
//     ATN_ID: number;
//     ATN_ParentID: number;
//     ATN_AppID: number;
//     ATN_Type: number;
//     ATN_Order: number;
//     ATN_Command: string;
//     ATN_Desc: string;
//     ATN_Level: number;
//     ATN_Help: string;
//     ATN_ParentMenu: string;
//     NodeStatus: number;
//     CreateUser: string;
//     DateDone: string;
//     enabled: boolean;
//     isViewRowSelected: boolean;
//     isTreeNodeExpand: boolean;
//     isRowDeleted: boolean;
//     isRowMove: boolean;
//     isDirty: boolean;
//     isCutRowItem: boolean;
// }
