import { DocumentFlowStatus, WorkflowActions } from './enum';
import { GridData } from '../../post-office-core/models/interfce';
export class PostOfficeActionModel {

    attachAs: number;
    action: number;
    diaryFoldes?: number;
    group: number;
    sendTo: string;
    itemType: number;
    massage: string;
    note: string;
    appId: number;

    // createdBy: string;
    // status: DocumentFlowStatus;
    // document: string;
    // statusName: string;
}

export interface FeeEarner {
    userId: number;
    user: string;
    selected?: boolean;
}

export interface Group {
    groupId: number;
    groupName: string;
    selected?: boolean;
}


export class PostOfficeActionInputData {

    attachAs: number;
    action: number;
    diaryFoldes?: number;
    groupId: number;
    sendTo: string;
    itemType: number;
    massage: string;


    group: string;
    status: DocumentFlowStatus;
    createdBy: string;
    dateOn: string;
    note: string;
    document: string;
    statusName: string;
    rows: GridData[];

}

export interface EnabaleControlers {
    itemTypeEnable: boolean;
    actionEnable: boolean;
    massageEnable: boolean;
    groupEnable: boolean;
    sendToEnable: boolean;
    diaryFoldersEnable: boolean;

    noteEnable: boolean;
    matterSelectEnable: boolean;
}






