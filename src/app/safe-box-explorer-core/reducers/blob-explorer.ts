import { ResponseNodeData } from '../models/interfaces';

import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { TreeNodeItem, Blob } from '../models/interfaces';
import { ExplorerViewType } from '../models/enum';

export interface State {
    readonly [token: string]: BlobExplorerState;
}

export interface BlobExplorerState {
    readonly loading: boolean;
    readonly treeNodeItem: TreeNodeItem;
    readonly selectFolder: string;
    readonly selectedTreeNodeItem: TreeNodeItem;
    readonly selectedBlobData: Blob[];
    readonly viewType: ExplorerViewType;
    readonly rootNodeName: string;
    readonly backpath: string[];
    readonly nextpath: string[];
    readonly copyItems: { type: 'copy' | 'cut', path: string[] };
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {

        case Actions.INIT_SAFE_BOX_EXPLORER:
            temp[action.token] = setInitialData(state[action.token]);
            return { ...state, ...temp };

        case Actions.SELECT_BLOB_SAFE_BOX:
            temp[action.token] = updateSelectedBlob(state[action.token], action.payload);
            return { ...state, ...temp };

        case Actions.INIT_SAFE_BOX_EXPLORER_SUCCESS:

            const rootNodeName = action.payload.rootNodeName;
            const rootNode = {
                isExpand: false,
                data: action.payload.response,
                id: rootNodeName,
                name: rootNodeName,
                nodes: [],
                prefix: rootNodeName,
                rootNodeName: rootNodeName,
                isSelect: false,
            };

            const rootMainNode = createTreeNodeFromResponse(updateTreeNodeResponse(action.payload.response), '');
            rootMainNode.name = rootNodeName;
            rootMainNode.id = rootNodeName;
            rootMainNode.isSelect = true;
            rootMainNode.isExpand = true,
                rootNode.nodes.push(rootMainNode);

            temp[action.token] = {
                ...state[action.token], treeNodeItem: rootNode,
                selectedTreeNodeItem: rootMainNode,
                rootNodeName: rootNodeName,
                loading: false
            };
            return { ...state, ...temp };

        case Actions.EXPAND_SAFE_BOX_EXPLORER:


            const selectedData = recursionSetSelectedItem(state[action.token].treeNodeItem,
                action.payload.prefix, action.payload.prefix);

            const selectedTreeNodeItem = getSelectedNodeItem(state[action.token].treeNodeItem, action.payload.prefix);

            temp[action.token] = {
                ...state[action.token],
                treeNodeItem: selectedData,
                selectedTreeNodeItem: selectedTreeNodeItem,
                selectedBlobData: [],
                loading: true,
                backpath: action.payload.prefix !== state[action.token].backpath[0] ?
                    [action.payload.prefix].concat(state[action.token].backpath) : state[action.token].backpath,
                nextpath: action.payload.isNavigete || action.payload.prefix === state[action.token].backpath[0] ?
                    state[action.token].nextpath : [],
            };

            return { ...state, ...temp };

        case Actions.EXPAND_SAFE_BOX_EXPLORER_SUCCESS:
            const createTreeNode = createTreeNodeFromResponse(updateTreeNodeResponse(action.payload.response), '/');
            let paths = [];
            if (action.payload.response.Prefix) {
                paths = action.payload.response.Prefix.split('/');
                paths.pop();
            }
            paths.unshift(state[action.token].rootNodeName);
            const treeNodeItem = recursion(state[action.token].treeNodeItem, paths, createTreeNode);

            const updateSelectedTreeNodeItem = getSelectedNodeItem(treeNodeItem, action.payload.prefix);

            temp[action.token] = {
                ...state[action.token], treeNodeItem: treeNodeItem,
                selectedTreeNodeItem: updateSelectedTreeNodeItem,
                loading: false
            };

            return { ...state, ...temp };


        case Actions.EXPAND_COLLAPSED_SAFE_BOX:
            const pathList = action.payload.item.prefix.split('/');
            pathList.pop();
            pathList.unshift(state[action.token].rootNodeName);
            const treeNode = recursionExpandCollapes(state[action.token].treeNodeItem, pathList, action.payload.item.name);
            temp[action.token] = { ...state[action.token], treeNodeItem: treeNode, loading: false };

            return { ...state, ...temp };

        case Actions.ITEM_DOWNLOAD:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.ITEM_DOWNLOAD_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.ITEM_DOWNLOAD_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };

        case Actions.ITEM_RENAME:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.ITEM_RENAME_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.ITEM_RENAME_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };

        case Actions.ITEM_DELETE:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.ITEM_DELETE_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.ITEM_DELETE_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.CHANGE_VIEW_TYPE_SAFE_BOX:
            temp[action.token] = { ...state[action.token], viewType: action.payload.viewType };
            return { ...state, ...temp };
        case Actions.UPLOAD_FILE_SAFE_BOX_EXPLORER:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.UPLOAD_FILE_SAFE_BOX_EXPLORER_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.UPLOAD_FILE_SAFE_BOX_EXPLORER_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.ITEM_MOVE:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.ITEM_MOVE_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.ITEM_MOVE_FAIL:
            temp[action.token] = { ...state[action.token], loading: false };
            return { ...state, ...temp };
        case Actions.NAVIGETE:
            temp[action.token] = mapPath(state[action.token], action.payload.type, action.payload.prefix);
            return { ...state, ...temp };
        case Actions.ITEM_COPY:
            temp[action.token] = { ...state[action.token], copyItems: action.payload };
            return { ...state, ...temp };
        case Actions.ITEM_PASTE:
            temp[action.token] = { ...state[action.token], loading: true };
            return { ...state, ...temp };
        case Actions.ITEM_CUT_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false, copyItems: { type: 'copy', path: action.payload.paths } };
            return { ...state, ...temp };
        case Actions.ITEM_COPY_SUCCESS:
            temp[action.token] = { ...state[action.token], loading: false, };
            return { ...state, ...temp };
        case Actions.SELECT_FOLDER:
            temp[action.token] = { ...state[action.token], selectFolder: action.payload.folderPrefix, selectedBlobData: [] };
            return { ...state, ...temp };
        default:
            {
                return state;
            }
    }
}

function mapPath(state: BlobExplorerState, type: string, prefix: string) {
    if (type === 'back') {
        const pathX = state.backpath[0];
        return {
            ...state,
            backpath: state.backpath.filter(p => p !== pathX),
            nextpath: [pathX].concat(state.nextpath)

        };
    } else if (type === 'next') {
        const pathX = state.nextpath[0];
        return {
            ...state,
            backpath: pathX ? [pathX].concat(state.backpath) : state.backpath,
            nextpath: state.nextpath.filter(p => p !== pathX),
        };
    }
}

function recursionExpandCollapes(node, paths, selectedNode) {

    const nodes = node.nodes.map(item => {

        if (selectedNode === item.id && paths.length === 1) {

            return { ...item, isExpand: !item.isExpand };

        } else if (item.id !== paths[0]) {

            return item;
        }

        return recursionExpandCollapes(item, paths.slice(1), selectedNode);

    });

    return Object.assign({}, node, { nodes });
}


function getSelectedNodeItem(node, selectedNode) {

    if (node.prefix === selectedNode) {
        return node;
    } else if (node.nodes != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < node.nodes.length; i++) {
            result = getSelectedNodeItem(node.nodes[i], selectedNode);
        }
        return result;
    }
    return null;
}



function recursionSetSelectedItem(node, paths, selectedNode) {

    const nodes = node.nodes.map(item => {
        if (selectedNode === item.prefix) {
            const selectedItem = { ...item, isSelect: true };
            return recursionSetSelectedItem(selectedItem, paths, selectedNode);

        } else {
            const newItem = { ...item, isSelect: false };
            return recursionSetSelectedItem(newItem, paths, selectedNode);
        }

    });

    return Object.assign({}, node, { nodes });
}



function recursion(node, paths, newNode) {
    let nodes;
    const lastiItem = paths[paths.length - 1];
    if (paths.length === 0) {
        nodes = newNode;
    } else {
        nodes = node.nodes.map(child => {
            if (child.id === lastiItem && paths.length === 1) {

                let newNodeItem = newNode.nodes;
                if (child.nodes && child.nodes.length > 0) {
                    newNodeItem = newNode.nodes.map((item) => {
                        return (child.nodes.filter(p => p.prefix === item.prefix)[0]) ?
                            child.nodes.filter(p => p.prefix === item.prefix)[0] : item;
                    });
                }
                return Object.assign({}, child, { nodes: newNodeItem, data: newNode.data });
            }
            if (child.id !== paths[0]) {
                return child;
            }

            const nodeItem = recursion(child, paths.slice(1), newNode);

            return Object.assign({}, child, { nodes: nodeItem.nodes });
        });
    }
    return Object.assign({}, node, { nodes });
}



function updateTreeNodeResponse(response: ResponseNodeData) {
    let BlobPrefix = [];
    let BlobList = [];
    if (response && response.Blobs) {
        if (response.Blobs.BlobPrefix) {
            if (Array.isArray(response.Blobs.BlobPrefix)) {
                BlobPrefix = response.Blobs.BlobPrefix;
            } else {
                BlobPrefix.push(response.Blobs.BlobPrefix);
            }
        }
        if (response.Blobs.Blob) {

            if (Array.isArray(response.Blobs.Blob)) {
                BlobList = response.Blobs.Blob;
            } else {
                BlobList.push(response.Blobs.Blob);
            }
        }
    }

    const BlobPrefixData = BlobPrefix.map((item) => {
        const path = item.Name.split('/');
        const displayName = path[path.length - 2];
        return { ...item, displayName: displayName };
    });
    const BlobData = BlobList.map((item) => {
        const path = item.Name.split('/');
        const displayName = path[path.length - 1];
        return { ...item, displayName: displayName };
    });

    return { ...response, Blobs: { ...response.Blobs, BlobPrefix: BlobPrefixData, Blob: BlobData } };
}


function updateSelectedBlob(state: BlobExplorerState, selectBlob: Blob[]) {
    return {
        ...state,
        selectedBlobData: selectBlob,
        selectFolder: null
    };


}


function createTreeNodeFromResponse(response: ResponseNodeData, prefix: string) {
    const newNode = {
        isExpand: true,
        data: response,
        id: prefix,
        name: prefix,
        nodes: [],
        prefix: prefix,
        isSelect: false,
    };
    if (response && response.Blobs && response.Blobs.BlobPrefix) {
        response.Blobs.BlobPrefix.forEach((item) => {
            const path = item.Name.split('/');
            const name = path[path.length - 2];
            newNode.nodes.push({
                isExpand: false,
                data: null,
                id: name,
                name: name,
                prefix: item.Name,
                nodes: [],
                isSelect: false,
            });
        });
    }
    return newNode;
}

function setInitialData(state: BlobExplorerState): Partial<BlobExplorerState> {
    if (state && state.treeNodeItem) {
        return { ...state };
    }
    return {
        ...state,
        loading: true,
        treeNodeItem: null,
        viewType: ExplorerViewType.Icon,
        rootNodeName: 'sup',
        backpath: [''],
        nextpath: [],
        copyItems: null,
    };
}
export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getTreeDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.treeNodeItem : null);

export const getSelectedTreeNodeItemByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state ? state.selectedTreeNodeItem : null;
    }
);
export const getLoadingByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.loading : true);

export const getSelectedBlobByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.selectedBlobData : []);

export const getSelectedViewTypebByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state ? state.viewType : null;
    });

export const getAllBackPathByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state ? state.backpath : null;
    });

export const getAllNextPathByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state ? state.nextpath : null;
    });

export const getCopyItemsByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state ? state.copyItems : null;
    });

export const getSelectedFolderByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state ? state.selectFolder : null;
    });






