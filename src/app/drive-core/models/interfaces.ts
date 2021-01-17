import { DriveItem, BaseItem } from '../../core/lib/microsoft-graph';

export interface DriveListItemWrapper {
    data: Readonly<DriveItem>;
    selected: boolean;
}

export interface ItemView {
    readonly itemCache: { [id: string]: DriveListItemWrapper };
    readonly order: string[];
    readonly viewPath: string;
    readonly loading: boolean;
    readonly active: boolean;
    readonly skipToken?: string;
    readonly loaded: boolean;
    readonly owner?: BaseItem;
    readonly searchText?: string;
    readonly sortBy: string;
    readonly orderBy: string;
}

export interface ItemClipboard {
    readonly items: DriveItem[];
    readonly viewPath: string;
    readonly type: 'copy' | 'cut';
}
export interface Navigation {
    readonly label: string;
    readonly driveId: string;
    readonly viewPath: string;
}

export interface CopyingItem {
    readonly operation: CopyingItemOperation;
    readonly viewPath: string;
    readonly destItem: BaseItem;
    readonly location: string;
    readonly item: DriveItem;
}
export interface CopyingItemOperation {
    readonly status?: 'completed' | 'inProgress';
    readonly resourceLocation?: string;
    readonly percentComplete?: number;
    readonly percentageComplete?: number;
    readonly resourceId?: string;
    readonly operation?: string;
}

export interface UploadingItem {
    readonly name: string;
    readonly uploadUrl: string;
    readonly percentageComplete: number;
    readonly status: 'completed' | 'inProgress' | 'error';
}
