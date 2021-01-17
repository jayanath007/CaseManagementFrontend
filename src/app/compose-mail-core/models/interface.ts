import { Attachment, FileAttachment, ItemAttachment } from '../../core/lib/microsoft-graph';
import { DPSResponse } from '../../core/lib/data-response';
export interface BatchResponses {
    readonly id: string;
    readonly status: number;
    readonly headers?: { location: string };
    readonly body?: {
        error?: {
            code: string
            message: string
        };
        value?: any;
    };
    readonly displayDate: string;
    readonly displayColor: string;
    readonly displayInitials: string;
    readonly iconIndex: string;
    readonly viewing?: boolean;

}
export interface CreateItemAttachmentReqest {
    ItemId: { Id: string, ChangeKey: string }; Name: string; Size: number; IsInline: boolean;
}
export interface CreateFileAttachmentReqest {
    AttachmentType: 'FileAttachment';
    FileAttachmentTypeViewModel: {
        Name: string,
        Size: number,
        IsInline: boolean,
        IsContactPhoto: boolean,
        ContentType: string,
        Base64String: string
    };
}
export type CreateItemAttachmentResponse = DPSResponse<ItemAttachmentResponse[]>;
export type GetItemAttachment = DPSResponse<ItemAttachment>;
export type CreateReplyForwardResponse = DPSResponse<string>;

export interface ItemAttachmentResponse {
    attachmentId: { id: string, rootItemId: string, rootItemChangeKey: string };
    contentId: string;
}

export interface AttachmentWrapper {
    readonly uid: string;
    readonly isUploding: boolean;
    readonly isDeleting: boolean;
    readonly attachment: Attachment | FileAttachment | ItemAttachment;
    readonly downloadUrl?: string;
}
