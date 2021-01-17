import { Message } from './../../core/lib/microsoft-graph';
import { User } from './../../auth';

import { CheckedType, DiaryRecType } from './enumeration';
import { eBillingType } from '../../core/lib/matter';
import { AddNoteState } from '../reducers/add-note';
import { PrecedentHSModel, WorkType } from '../../core/lib/precedentHS';

export interface AddNoteItemData {
    token?: string;
    name: string;
    note: string;
    letterName: string;
    extension: string;
    dateDn: string | Date;
    attachments: Attachments[];
    isAttachmentLoading?: boolean;
    internetMessageId?: string;
}

export interface MatterInfo {
    ClientName: string;
    MatterReferenceNo: string;
    BranchID: number;
    AppID: number;
    FileID: number;
    FeeEarner: string;
    RateCategory: string;
    AppCode: string;
    eBilling: eBillingType;
    reviewNote?: string;
    isPlotMasterMatter: boolean;
    message?: string;
    isProspectMatter: boolean;
    isLegalAid: boolean;
}


export interface Attachments {
    contentType: string;
    contentId: string;
    isInline: boolean;
    name: string;
    originalReference: string;
    reference: string;
    size: number;
    viewReferance: string;
    isSelected: boolean;
    fileNote: string;
    extension: string;
    isUncharge: boolean;
    diaryFolderId: string;
    attachmentType: string;
}

export interface FeeEarner {
    userId: number;
    groupName: string;
    selected: boolean;
    groupId: number;
}

// export interface Folder {
//     text: string;
//     value: string;
//     selected: boolean;
// }

export interface Folder {
    folderName: string;
    folderId: number;
    parentId: number;
    position: number;
    selected: boolean;
    children?: Folder[];
}

export interface Grade {
    text: string;
    value: string;
    selected: boolean;
}

export interface DiaryType {
    selected: boolean;
    text: string;
    value: DiaryRecType;
}
export interface ActionType {
    selected: boolean;
    text: string;
    value: string;
}
export interface ExtraTimeType {
    text: string;
    value: number;
    selected: boolean;
    dtL_AppID: number;
    dtL_Label: string;
    dtL_RecType: number;

}
export interface FolderOnAttachment {
    folder: Folder;
    reference: string;
    parentItemIndex: number;
}

export interface NoteOnAttachment {
    note: string;
    reference: string;
    parentItemIndex: number;
}
export interface ConditiOnAttachment {
    condition: boolean;
    reference: string;
    parentItemIndex: number;
    checkedType: CheckedType;
}

export interface AddNoteValidationInfo {
    status: boolean;
    msg: string;
}

export interface RequiredField {
    feeEarner: string;
    diaryType: any;
    folder: string | number;
    dateDone: string | Date;
    note: string;
    unit: number;
    extraUnit: number;
    rate: number;
    extraRate: number;
    eBillingType: string;
    workType: WorkType;
    activiti: PrecedentHSModel;
    phase: PrecedentHSModel;
    phaseWiseTask: PrecedentHSModel;
}


export interface AddNoteSuccessInfo {
    isSuccess: boolean;
    msg: string;
}

export interface EditViewData {
    appCode: string;
    anchorType: number;
    appId: number;
    attachment: Attachments[];
    branchId: number;
    classId: number;
    clientRef: string;
    columnFolderId: number;
    curUser: string;
    dateBy: string;
    dateDn: string;
    dateOn: string;
    diaryRecType: number;
    eBilling: eBillingType;
    eBillingActivityId: number;
    eBillingPhaseId: number;
    eBillingTaskId: number;
    feeEarner: string;
    fileId: number;
    itemRate: number;
    itemUnits: number;
    itemValue: number;
    letter: string;
    matterReferenceNo: string;
    note: string;
    offline: boolean;
    telephoneAdvice: boolean;
    rate1: number;
    rate2: number;
    recType: number;
    status: number;
    subClassId: number;
    template: string;
    timeBy: string;
    timeDn: string;
    timeOn: string;
    transfered: string;
    uncharge: boolean;
    work: string;
    legalAidCourt: number;
}

export interface AttachmentLoadingInfo {
    user: User;
    fileExtension: string;
    diaryTypeList: DiaryType[];
    fileData: any;
    store: AddNoteState;
    token: string;
}

export class UpdateDeletePostEntriesRequest {
    constructor(public inboxId: number, public diaryId: number, public isDeletFile: boolean) { }
    public toPost() {
        return {
            InboxId: this.inboxId,
            DiaryId: this.diaryId,
            IsDeletFile: this.isDeletFile

        };
    }
}

export interface DiaryInput {
    fileInfo: FileInfoInput[];
    recType: number;
    diaryId: number;
    putOnBy: string;
    branchId: number;
    appId: number;
    fileId: number;
    taskFor: string;
    dateDn?: string;
    columnFolderId?: number;
    note: string;
    appCode: string;
    itemUnits: number;
    itemRate: number;
    itemValue: number;
    matterReferenceNo?: string;
    workflowActions: string;
    useDefaultNote: boolean;
    template?: string;
    anchorType?: string;
    classId?: number;
    subClassId?: number;
    uncharge: boolean;
    telephoneAdvice: boolean;
    extraItemUnits: number;
    extraItemRate: number;
    extraItemValue: number;
    extraRecTypeValue?: number;
    eBillingPhaseId?: number;
    eBillingTaskId?: number;
    eBillingActivityId?: number;
    legalAidCaseInfoId?: number,
    legalAidCourt?: number
    lafundLevel?: number;
}

export interface InlineAttachmentInput {
    reference: string;
    name: string;
    isSelected: boolean;
    diaryFolderId?: number;
    isUncharge: boolean;
    fileNote: string;
}

export interface FileInfoInput {
    inlineAttachments: InlineAttachmentInput[];
    token?: string;
    note: string;
    letterName: string;
    dateDn: string;
}

export interface ViewingInlineAttachement {
    loading: boolean;
    url?: string;
    msg?: Message;
    extension?: string;
}
