import { BlockBlobClient } from '@azure/storage-blob';
import { FileURL } from '@azure/storage-file';
import { AuthInfoStateService } from '../../auth';

export interface Item {
    fileName: string;
}

export interface ItemDownload extends Item {
    url: string;
}

export interface AzureSasTokenResponse {
    token: string;
    storageKind: StorageKind;
    letterName?: string;
}

export interface AzureStorageRequest extends AzureSasTokenResponse {
    url: string;
    tokenRequestUrl: string;
}

export interface BlobFileRequest extends AzureStorageRequest, Item {
    id: number;
}

export interface ItemUpload extends BlobFileRequest {
    progress: number;
    uploading: boolean;
    error?: any;
}

export type AzureStorageClientFactory = (
    options: AzureStorageRequest,
    authHelper: AuthInfoStateService
) => BlockBlobClient | FileURL;


export enum StorageKind {
    Blobs = 'Blobs',
    Files = 'Files'
}

export interface EmailItem {
    itemId?: string;
    messageId?: string;
    userEmail: string;
    subject: string;
}

export interface DriveItem {
    name: string;
    itemRef: string;
}
export interface DiaryItem {
    name: string;
    diaryId: string;
}
export interface InboxItem {
    name: string;
    inboxId: number;
}

export interface DurableProxy {
    hubName: string;
    instanceId: string;
    itemAccess?: { itemId: string, token: string }[];
}

export interface DurableTaskStatus {
    createdTime: string;
    customStatus?: DurableTaskItemStatus[];
    instanceId: string;
    lastUpdatedTime: string;
    output?: { items: DurableTaskItemStatus[] };
    // input?: DurableTaskInput;
    name: string;
    runtimeStatus: 'Pending' | 'Running' | 'Completed' | 'ContinuedAsNew' | 'Failed' | 'Terminated';
}
export interface DurableTaskItemStatus {
    errorMessage: string;
    errorCode: string;
    success: boolean;
    body: {
        copyProgress: number
        copyStatus: string
        copyStatusDescription: string
        itemId: number
    } | string;
}

export interface DurableTaskInput {
    DatabaseId: string;
    LoginUserEmail: string;
    Payload: {
        items: DurableTaskInputItems[]
    };
    TenantId: string;
    UserAuthToken: string;
}

export interface DurableTaskInputItems {
    Audiance: string;
    Destination: {
        Path: string;
        ShareName: string
    };
    SourceItemId: number;
}

export interface SessionToken {
    token: string;
    expireInSeconds: number;
}

export interface DiaryWebViewToken extends SessionToken {
    expireTimeValue: number;
    isRequesting: boolean;
}
