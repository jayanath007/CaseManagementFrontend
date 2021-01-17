import { FileAttachment } from '../../core/lib/microsoft-graph';

export interface MsgViewerInput {
    viewerFrom: 'diary' | 'email';
    diaryInput?: {
        appCode: string, branchId: number, fileId: number,
        itemRef: string | number, attachmentName: string, attachmentRef?: string
    };
    emailInput?: { owner: string, itemId: string, attachmentId: string, parentExtention: 'eml' | 'msg', attachment: FileAttachment };
}
