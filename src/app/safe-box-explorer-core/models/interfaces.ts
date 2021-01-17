import { DropdownListData } from '../../core';

export interface TreeNodeItem {
    readonly nodes?: TreeNodeItem[];
    readonly data: ResponseNodeData;
    readonly isExpand: boolean;
    readonly id?: string;
    readonly name: string;
    readonly prefix: string;
    readonly isSelect?: boolean;
}


export interface BlobPrefix {
    Name: string;
    displayName: string;
}

export interface Properties {
    // Creation-Time: string;
    // Last-Modified: string;
    // Content-Length: string;
    // Content-Type: string;
    // Content-Encoding?: any;
    // Content-Language?: any;
    // Content-MD5: string;
    // Cache-Control?: any;
    // Content-Disposition?: any;
    Etag: string;
    BlobType: string;
    AccessTier: string;
    AccessTierInferred: string;
    LeaseStatus: string;
    LeaseState: string;
    ServerEncrypted: string;
}

export interface Blob {
    Name: string;
    Properties: Properties;
    displayName: string;
}

export interface Blobs {
    BlobPrefix: BlobPrefix[];
    Blob: Blob[];
}

export interface ResponseNodeData {
    Delimiter: string;
    Blobs: Blobs;
    NextMarker?: any;
}

export interface AppView {
    isLoading: boolean;
    app: AppInfo;
    appPathTemplate: TemplateListView;
    appCommonPathTemplates: TemplateListView;
    isLocationMatch: boolean;
}

export interface Template {
    name: string;
    selected?: boolean;
    checkedOutByUser?: string;
    checkedOutHashKey?: string;
    editingBusy?: boolean;
    canEdit: boolean;
    canView: boolean;
}

export interface CheckedOutData {
    id: number;
    hashKey: string;
    byUser: string;
    driveFileId: string;
    path: string;
    diaryId: number;
    templateId: string;
    driveFolderId: string;
}

export interface TemplateListResponse {
    appPathTemplate: TemplateListResponseView;
    appCommonPathTemplates: TemplateListResponseView;
    isLocationMatch: boolean;
}

export interface TemplateListResponseView {
    fileName: string[];
    path: string;
    filePath: string;
}

export interface TemplateListView {
    templateList: Template[];
    path: string;
    filePath: string;
}

export interface TemplateClipboard {
    readonly templates: Template[];
    readonly filePath: string;
    readonly appId: number;
    readonly type: 'copy' | 'cut';
}

export interface AppInfo {
    readonly appId: number;
    readonly appDataPrefix: string;
    readonly appMatterPrefix: string;
    readonly appPath: string;
    readonly appDescription: string;
    readonly appSystemPath: string;
    readonly appDataPath: string;
    readonly appCommonDataPath: string;
}
