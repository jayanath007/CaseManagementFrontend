import { Message as GraphMessage } from '../../core/lib/microsoft-graph';
import { FileUrlCache } from '../../core/lib/files';

export interface MgGraphBatchResponseItem<T> {
    id: string;
    status: number;
    headers?: any;
    body?: T;
}

export interface MgGraphBatchResponse<T> {
    responses: MgGraphBatchResponseItem<T>[];

}
export interface MessageListItem<APIObject> {
    readonly data: APIObject;
    readonly loading?: boolean;
    readonly selected?: boolean;
    readonly displayTo: string;
    readonly displayColor: string;
    readonly displayInitials: string;
    readonly diaryId: number;
    readonly iconIndex: string;
    readonly actionDate: string;
    readonly viewing?: boolean;
    readonly folderWellKnownId: string;
    readonly owner: string;
}
export type MessageItemWrapper = MessageListItem<Readonly<GraphMessage>>;
export type ReplyForwardType = 'createReply' | 'createReplyAll' | 'createForward';

// gamil
export interface Header {
    name: string;
    value: string;
}

export interface Body {
    size: number;
    data?: string;
    attachmentId?: string;
}

export interface Part {
    partId: string;
    mimeType: string;
    filename: string;
    headers: Header[];
    body: Body;
    parts?: Part[];
}


export interface Message {
    id: string;
    threadId: string;
    labelIds: string[];
    snippet: string;
    historyId: string;
    internalDate: string;
    payload: Part;
    sizeEstimate: number;
    raw?: string;
}

export interface Draft {
    id: string;
    message: Message;
}
