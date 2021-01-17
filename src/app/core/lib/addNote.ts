import { MatterInfo, LegalAid, DiaryRecType } from '../../add-note-core';
import { DriveItem, Message } from './microsoft-graph';
import { MessageListItem } from '../../mail-item-core';
import { ShowDiaryScreenRequest } from '../../workflow-core';
import { GridData } from '../../post-office-core/models/interfce';

export type MailItem = Readonly<MessageListItem<Readonly<Message>>>;
export type InboxItem = Readonly<GridData>;
export type LetterEnginItem = Readonly<ShowDiaryScreenRequest>;
export type AddNoteItem = File | MailItem | InboxItem | DiaryItem | LetterEnginItem | DriveItem;
export interface DiaryItem {
    appId: number;
    appCode: string;
    branchId: number;
    diaryId: number;
    fileId: number;
    letterName: string;
}
export interface AddNoteInPutData {
    matterData: MatterInfo;
    legalAid: LegalAid;
    diaryType: DiaryRecType;
    isEdit: boolean;
    type?: string;
    uid?: number;
    addNoteItemsType?: AddNoteItemsType;
    fileItemList?: File[];
    driveItemList?: DriveItem[];
    mailItemList?: MailItem[];
    inboxItemList?: InboxItem[];
    diaryItemList?: DiaryItem[];
    letterEnginItemList?: LetterEnginItem[];
}

export enum AddNoteItemsType {
    FileItems = 1,
    DriveItems,
    MailItems,
    InboxItems,
    DiaryItems,
    LetterEnginItems
}

export enum AddNoteCloseInfo {
    ExitByUser = 'ExitByUser',
    ExitWithSaveSuccess = 'ExitWithSaveSuccess'
}



