export interface DiaryFolder {
    readonly disabled?: boolean;
    readonly group?: any;
    readonly selected: boolean;
    readonly text: string;
    readonly value: string;
}

export interface DiaryFolderWrapper {
    readonly data: DiaryFolder;
    readonly isdeleted: boolean;
    readonly uid: string;
}
export interface ColumnFolder {
    readonly folderID?: number;
    readonly appId?: number;
    readonly folderName: string;
    readonly isDefault: boolean;
    readonly isDeleted: boolean;
    readonly parentId: number;
    readonly position: number;
}


/** Flat node with expandable and level information */
export interface FolderFlatNode {
    uid: string;
    folderId: number;
    parentId: number;
    folderName: string;
    position: number;
    level?: number;
    selected?: boolean;
    children?: FolderFlatNode[];
    isDeleted: boolean;
    expanded?: boolean;
}

export interface FolderNode {
    folderId: string;
    type: any;
    level: number;
    expandable: boolean;
}

