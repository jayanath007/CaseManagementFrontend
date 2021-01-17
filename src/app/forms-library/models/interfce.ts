import { TreeItemType } from './enums';

export interface TreeDataResponse {
    description: string;
    id?: string;
    path?: string;
    items: TreeDataResponse[];
}
export interface TreeMetaData {
    description: string;
    id?: string;
    path?: string;
}
export interface TreeMetaDataWrapper<T> {
    treeId: string;
    parentId: string;
    treeLevel: number;
    isRowEdit: boolean;
    isRightClick: boolean;
    isRowSelected: boolean;
    enabled: boolean;
    // indexId: number;
    nodeType: TreeItemType;
    isTreeNodeExpand: boolean;
    data: T;
    items: TreeDataWrapper[];
}

export type TreeDataWrapper = TreeMetaDataWrapper<Readonly<TreeMetaData>>;

