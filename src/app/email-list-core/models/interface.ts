import { MatterInfo, SubmitType } from '../../add-note-core';

export interface InputData {
    fileCredentials?: { diaryId: number, password: string, letterName: string }[];
    subjectNote: string;
    signTokens: string[];
    safeBoxFileList: string[];
    submitType: SubmitType;
    url: string;
    matterData: MatterInfo;
}

export interface Contact {
    contactType: string;
    name: string;
    email: string;
    toCc: ToCc;
    id: string;
}
export enum Share {
    MLSAndSafeChat = 'MLS & Safe chat',
    SafeBox = 'SafeBox',
    EmailAttachment = 'Email attachment',
    EmailAttachmentPDF = 'Email attachment pdf'
}
export enum ToCc {
    Cc = 'Cc',
    To = 'To'
}
