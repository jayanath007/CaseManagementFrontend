
import { createSelector } from '@ngrx/store';
import {
    BundleTreeItem, FileHistory, PDFBundleTreeItemViewModel,
    BundleItemsViewModel
} from '../models/interface';
import * as Actions from '../actions/core';
import { uuid } from '../../utils/uuid';
import { DatePipe } from '@angular/common';
const datePipe = new DatePipe('en-US');
import * as _ from 'lodash';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';
import { dpsNewDate } from '../../utils/javascriptDate';

export interface TreeMap { [id: string]: Readonly<BundleTreeItem>; }

export interface State {
    readonly [token: string]: BundlingProfileState;
}
export interface BundlingProfileState {
    readonly treeCache: TreeMap;
    readonly isDirty: boolean;
}
const initialState: State = {};
const COVER_PAGE_LABLE = 'Cover Page';

export function reducer(state: State = initialState, action: Actions.Any): State {
    switch (action.type) {
        case Actions.INIT_BUNDLING:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: { ...createDefaultTree() }
                        , isDirty: false
                    }
                }
            };
        case Actions.TOGGLE_EXPAND:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: toggleFolder(state[action.token].treeCache, action.folderId)
                        , isDirty: steDirtyValue(state[action.token].isDirty)
                    }
                }
            };
        case Actions.SET_SELECTED_ITEM:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: selectItem(state[action.token].treeCache, action.itemId)
                        , isDirty: steDirtyValue(state[action.token].isDirty)
                    }
                }
            };
        case Actions.MOVE_SELECTED_UP:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: moveSelectedItemUp(state[action.token].treeCache)
                        , isDirty: true
                    }
                }
            };
        case Actions.MOVE_SELECTED_DOWN:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: moveSelectedItemDown(state[action.token].treeCache)
                        , isDirty: true
                    }
                }
            };
        case Actions.UPDATE_LABEL:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: updateLable(state[action.token].treeCache, action.itemId, action.lable)
                        , isDirty: true
                    }
                }
            };
        case Actions.UPDATE_DATE:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: updateDate(state[action.token].treeCache, action.itemId, action.date)
                        , isDirty: true
                    }
                }
            };
        case Actions.CHANGE_FILE_DATE_ENABLE:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: updateFileDateEnable(state[action.token].treeCache, action.itemId, action.checkBoxValue)
                        , isDirty: true
                    }
                }
            };
        case Actions.MOVE_ITEM:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: moveItemById(state[action.token].treeCache, action.anchorId, action.itemId)
                        , isDirty: true
                    }
                }
            };
        case Actions.ADD_ITEM:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: addItemsBelow(state[action.token].treeCache, action.anchorId, action.data)
                        , isDirty: true
                    }
                }
            };
        case Actions.REMOVE_ITEM:
            return {
                ...state,
                ...{
                    [action.token]: {
                        treeCache: RemoveItem(state[action.token].treeCache, action.item[0].id)
                        , isDirty: true
                    }
                }
            };
        case Actions.ADD_FOLDER:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: addFolderBelow(state[action.token].treeCache, action.anchorId, action.lable)
                        , isDirty: true
                    }
                }
            };
        case Actions.ADD_ITEMS_WITH_FOLDER:
            const tmp = addItemsToNewFolder(state[action.token].treeCache, action.anchorId, action.folderLable, action.data);
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: tmp
                        , isDirty: true
                    }
                }
            };
        case Actions.START_ITEM_MOVE:
            return {
                ...state,
                ...{
                    [action.token]: {
                        treeCache: onItemMoveStart(state[action.token].treeCache, action.itemId)
                        , isDirty: true
                    }
                }
            };
        case Actions.BUNDLING_DATA_SUBMIT_SAVE_SUCCESS:
            return {
                ...state,
                ...{
                    [action.token]: {
                        treeCache: state[action.token].treeCache
                        , isDirty: false
                    }
                }
            };
        // case Actions.TREE_DATA_SAVE_SUCCESS:
        //     return {
        //         ...state,
        //         ...{
        //             [action.token]: {
        //                 treeCache: state[action.token].treeCache
        //                 , isDirty: false
        //             }
        //         }
        //     };
        case Actions.LOAD_SAVE_BUNDLE_DATA_SUCCESS:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: mappingToTreeCache(state[action.token],
                            action.payload.itemListList, action.payload.selectedRow, action.payload.timeOffset)
                        , isDirty: false
                    }
                }
            };
        case Actions.UPLOAD_COVER_PAGE_SUCCESS:
            return {
                ...state,
                ...{
                    [action.token]: {
                        treeCache: addCoverItems(state[action.token].treeCache, action.coverPageId,
                            action.fileName, action.path, action.data)
                        , isDirty: true
                    }
                }
            };
        case Actions.SET_EDIT_LABEL_ITEM:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: editLabelItem(state[action.token].treeCache, action.itemId)
                        , isDirty: true
                    }
                }
            };
        case Actions.CHANGE_IS_CORE_BUNDLE:
            return {
                ...state, ...{
                    [action.token]: {
                        treeCache: changeIsCoreBundle(state[action.token].treeCache, action.payload.ids)
                        , isDirty: true
                    }
                }
            };

    }
    return state;
}

function createHierarchy(myId: string, parentHierarchy: string = '') {
    return parentHierarchy + ',' + myId.substring(0, 6);
}

function createDefaultTree() {
    const rootId = uuid();
    const coverPageId = uuid();
    const root: BundleTreeItem = {
        lable: 'Bundling',
        isRoot: true,
        selected: true,
        expanded: true,
        isFolder: true,
        id: uuid(),
        parentId: null,
        isCoverPage: false,
        previousId: null,
        level: 0,
        visible: true,
        moving: false,
        isEdit: false,
        filePath: '',
        isCoreBunlde: false,
        hierarchy: createHierarchy(rootId),
        folderName: '',
        isFileDateEnable: true
    };
    const coverPageHolder: BundleTreeItem = {
        lable: getCoverPageLabel('not selected'),
        selected: false,
        isRoot: false,
        expanded: true,
        isFolder: false,
        id: coverPageId,
        parentId: root.id,
        isCoverPage: true,
        previousId: root.id,
        level: 1,
        visible: true,
        moving: false,
        isEdit: false,
        filePath: '',
        isCoreBunlde: false,
        hierarchy: createHierarchy(coverPageId, root.hierarchy),
        folderName: '',
        isFileDateEnable: true
    };

    return { ...{ [root.id]: root }, ...{ [coverPageHolder.id]: coverPageHolder } };
}

const treeUtil = (tree: TreeMap) => {

    interface Tree extends BundleTreeItem {
        items: (BundleTreeItem | Tree)[];
        level: number;
    }

    // https://gist.githubusercontent.com/theodorejb/376da4aeafd2ac424596/raw/5389475f5f8ff4a86fe4dc5c71d36af3c0e0add6/mapSort.js
    const mapSort = (linkedList: BundleTreeItem[]): BundleTreeItem[] => {
        const sortedList = [];
        const map = new Map();
        let currentId = null;

        const allLinkedIds = linkedList.reduce((acc, val) => {
            acc[val.id] = true;
            return acc;
        }, {});

        // to avoid inf-loop

        // index the linked list by previous_item_id

        let validCount = 0;

        for (let i = 0; i < linkedList.length; i++) {
            const item = linkedList[i];
            if (item.previousId === null && item.isRoot) {
                // first item
                currentId = item.id;
                sortedList.push(item);
                validCount++;
            } else if (allLinkedIds[item.previousId]) {
                if (map.has(item.previousId)) {
                    console.error('Duplicate prevous id found', item, map.get(item.previousId), i);
                } else {
                    map.set(item.previousId, i);
                    validCount++;
                }
            } else {
                console.error('Invalid Item chain found', item);
            }
        }

        while (sortedList.length < validCount) {
            // get the item with a previous item ID referencing the current item
            const nextItem = linkedList[map.get(currentId)];

            // Eranda
            if (nextItem) { ///
                sortedList.push(nextItem);
                currentId = nextItem.id;
            }///
        }
        return sortedList;
    };


    const buildTree = (itemHash: TreeMap): Tree => {
        const items = Object.values(itemHash);
        // const rootItem = items.find((item) => item.parentId === null);
        let treeRoot: Tree = null;
        const itemGroups: { [id: string]: Tree } = Object.keys(_.groupBy(items, (item: BundleTreeItem) => item.parentId || '-1'))
            .map((id) => ({ ...itemHash[id], items: [] }))
            .reduce((acc, value) => {
                acc[value.id] = value;
                return acc;
            }, {});

        items.forEach((item) => {
            if (itemGroups[item.id]) {
                item = itemGroups[item.id];
            } else {
                item = { ...item };
            }
            if (!!item.parentId && itemGroups[item.parentId]) {
                const parent = itemGroups[item.parentId];
                parent.items.push(item);
            } else {
                treeRoot = item as Tree;
            }
        });
        return treeRoot;
    };

    const travers = (curItem, callback: (item, parent, index) => void, parent?, index: number = 0) => {
        callback(curItem, parent, index);
        if (curItem.items && curItem.items.length > 0) {
            curItem.items.forEach((item, _index) => {
                travers(item, callback, curItem, _index);
            });
        }
    };

    const findInTree = (root: Tree, predicate: (node: Tree) => boolean) => {
        if (predicate(root)) {
            return root;
        }
        if (root.items && root.items.length > 0) {
            for (let i = 0; i < root.items.length; i++) {
                const item = root.items[i];
                const found = findInTree(item as Tree, predicate);
                if (found) {
                    return found;
                }
            }
        }
        return null;
    };

    const removeSubtree = (root: Tree, itemId: string) => {
        const remove = (curItem: Tree) => {
            if (curItem.items && curItem.items.length > 0) {
                const curLen = curItem.items.length;
                const newList = curItem.items.filter((item) => item.id !== itemId);
                curItem.items = newList;
                if (curLen === newList.length) {
                    curItem.items.forEach((_item, _index) => {
                        remove(_item as Tree);
                    });
                }
            }
        };
        remove(root);
        return root;
    };

    const treeToItemIds = (root: Tree): string[] => {
        const ids = [];
        travers(root, (item: Tree, parent, index) => {
            ids.push(item.id);
            return false;
        });
        return ids;
    };

    const generateLevelsAndVisibility = (root: Tree, original: TreeMap) => {
        const _hash = {};
        travers(root, (item: Tree, parent, index) => {
            if (!parent) {
                // item.level = 0;
                item.visible = true;
                item.hierarchy = createHierarchy(item.id);
            } else {
                item.level = parent.level + 1;
                item.visible = parent.expanded && parent.visible;
                item.hierarchy = createHierarchy(item.id, parent.hierarchy);
            }
            if (original[item.id]) {
                const _ori = original[item.id];
                if (_ori.level !== item.level || _ori.visible !== item.visible ||
                    _ori.hierarchy !== item.hierarchy) {

                    _hash[item.id] = {
                        level: item.level,
                        visible: item.visible,
                        hierarchy: item.hierarchy
                    };
                }
            } else {
                _hash[item.id] = {
                    level: item.level,
                    visible: item.visible,
                    hierarchy: item.hierarchy
                };
            }
            return false;
        }, null);
        return _hash;
    };

    const updateLevels = (_tree: TreeMap): TreeMap => {
        const _tempTree = buildTree(_tree);
        const updated = generateLevelsAndVisibility(_tempTree, tree);
        const mutated = Object.keys(updated)
            .map((id) => ({ ..._tree[id], ...updated[id] }))
            .reduce((acc, value) => {
                acc[value.id] = value;
                return acc;
            }, {});

        return { ..._tree, ...mutated };
    };

    const generateFullTreeFromArray = (data: BundleItemsViewModel[], bundleHeader: PDFBundleHeaderViewModel, timeOffset): TreeMap => {
        let coverPageLabel = bundleHeader.pbH_OptionsFrontPageFilePath;
        if (!!coverPageLabel) {
            const x: string[] = coverPageLabel.split('\\');
            coverPageLabel = x[x.length - 1].split('.')[0];
        }
        const map = createDefaultTree();
        const coverPage = Object.values(map).find((val) => val.isCoverPage);
        coverPage.lable = getCoverPageLabel(coverPageLabel);
        const root = Object.values(map).find((val) => val.isRoot);
        root.lable = bundleHeader.pbH_Name;

        let previousId: string = coverPage.id;
        const preIdHash = {};

        data.forEach((val) => {
            preIdHash['' + val.pbI_ItemID] = { previousId: previousId };
            previousId = '' + val.pbI_ItemID;
        });

        const createWrapperFromBackendItem = (itm: BundleItemsViewModel, header: PDFBundleHeaderViewModel): BundleTreeItem => {
            let letterName = itm.pbI_ItemText;
            let letterExtention;
            if (itm.pbI_FilePath) {
                const pieces = itm.pbI_FilePath.split('.');
                letterExtention = pieces[pieces.length - 1];
                letterName = `${letterName}.${letterExtention}`;
            }
            const date = datePipe.transform(dpsNewDate(timeOffset).toString(), 'yyyy-MM-dd');
            return {
                visible: itm.pbI_ParentID === 0,
                expanded: false,
                data: itm.pbI_Type !== 0 ? {
                    letter_name: letterName,
                    dateDone: itm.pbI_FileDate || date,
                    note: null,
                    folder: null,
                    folderName: null,
                    diary_UID: itm.pbI_DpsDiaryID,
                    offlineStatus: itm.pbI_Info
                } : null,
                lable: itm.pbI_ItemText,
                id: '' + itm.pbI_ItemID,
                previousId: null,
                isCoverPage: false,
                isFolder: itm.pbI_Type === 0,
                level: itm.pbI_Position,
                parentId: itm.pbI_ParentID === 0 ? root.id : '' + itm.pbI_ParentID,
                selected: false,
                isRoot: false,
                moving: false,
                isEdit: false,
                filePath: '',
                pageNoLabel: itm.pbI_PageNoLabel,
                isCoreBunlde: itm.pbI_ExclFromCoreBundle,
                hierarchy: null,
                folderName: '',
                date: itm.pbI_FileDate || date,
                isFileDateEnable: itm.pbI_DisplayDate ? true : false,
                isSavedItem: true,
                pbI_DisplayDate: itm.pbI_DisplayDate ? true : false,
                pbI_PageOffset: itm.pbI_PageOffset,
                pbI_PageCount: itm.pbI_PageCount,
                pbI_SectionPrefix: itm.pbI_SectionPrefix,
                pbI_PageNoLabel: itm.pbI_PageNoLabel,
                pbI_IgnoreForMerge: itm.pbI_IgnoreForMerge,
                pbI_IsSubPage: itm.pbI_IsSubPage
            };
        };

        const tempMap = data.reduce((acc, val) => {
            const item = createWrapperFromBackendItem(val, bundleHeader);
            acc[item.id] = item;
            return acc;
        }, {});

        const levelInfo = generateLevelsAndVisibility(buildTree(tempMap), tempMap);

        const finalTreeMap = Object.keys(tempMap).reduce((acc, id) => {
            const item = { ...tempMap[id], ...levelInfo[id], ...preIdHash[id] };
            acc[id] = item;
            return acc;
        }, map);
        return finalTreeMap;
    };

    const toggleExpand = (folderId): TreeMap => {
        const folder = tree[folderId];
        const _temp = { ...tree, ...{ [folderId]: { ...folder, expanded: !folder.expanded } } };
        return updateLevels(_temp);
    };

    const findNextItem = (itemId: string) => {
        return Object.values(tree)
            .find((item) => item.previousId === itemId);
    };

    const findSelectedItem = () => {
        return Object.values(tree)
            .find((item) => item.selected);
    };

    const findEditClickItem = () => {
        return Object.values(tree)
            .find((item) => item.isEdit);
    };


    const findSortedTail = (folderId: string, sortedList: BundleTreeItem[]) => {
        const _tempTree = buildTree(tree);
        const node = findInTree(_tempTree, (_node: Tree) => _node.id === folderId);
        const subIdsHash = treeToItemIds(node).reduce((acc, id) => {
            acc[id] = id;
            return acc;
        }, {});

        const myLoaded = sortedList.filter((item) => !!subIdsHash[item.id]);
        return myLoaded[myLoaded.length - 1];
    };

    const getCoverPageItem = () => {
        return Object.values(tree)
            .find((item) => item.isCoverPage);
    };

    const getRootItem = () => {
        return Object.values(tree)
            .find((item) => item.isRoot);
    };
    const getAllItemInSameLevel = (anchorId) => {
        return Object.values(tree)
            .filter((item) => !item.isFolder && item.parentId === anchorId);
    };

    const getAllFolderInSameLevel = (anchorId) => {
        return Object.values(tree)
            .filter((item) => item.isFolder && item.parentId === anchorId);
    };

    const createLable = (item: FileHistory) => {
        return item.note; // .letter_name;
    };

    const createItemWrapper = (data: FileHistory, previousId: string, level: number, parentId: string,
        parentIdHierarchy: string): BundleTreeItem => {
        const myId = uuid();
        return {
            visible: true,
            expanded: false,
            data: data,
            lable: data ? createLable(data) : 'New Folder', // edited
            id: uuid(),
            previousId: previousId,
            isCoverPage: false,
            isFolder: false,
            level: level,
            parentId: parentId,
            selected: false,
            isRoot: false,
            moving: false,
            isEdit: false,
            date: data ? data.dateDone : null,
            filePath: '',
            isCoreBunlde: false,
            hierarchy: createHierarchy(myId, parentIdHierarchy),
            isFileDateEnable: true,
        };
    };


    const createItemsChain = (items: FileHistory[], anchorId, level, parentId, hierarchy): BundleTreeItem[] => {
        return items.reduce((all, current) => {
            const preId = all.length > 0 ? all[all.length - 1].id : anchorId;
            all.push(createItemWrapper(current, preId, level, parentId, hierarchy));
            return all;
        }, []);
    };

    const getHiracheyInfo = (anchorId: string, changeParent = true, newItemIsFolder = false) => {
        const anchor = tree[anchorId];
        let level = anchor.level;
        let parentId = anchor.parentId;
        let previousId = anchorId;

        if (anchor.isFolder && changeParent === true) {
            level = anchor.level + 1;
            parentId = anchor.id;
        }

        let allItems = [];
        if (newItemIsFolder) {
            allItems = getAllFolderInSameLevel(anchorId);
            if (allItems.length > 0) {
                allItems = getAllItemInSameLevel(allItems.pop().id);
            }
        } else {
            allItems = getAllItemInSameLevel(anchorId);
        }

        if (allItems && allItems.length > 0) {
            previousId = allItems.pop().id;
        } else if (anchor.isRoot) {
            const coverPage = getCoverPageItem();
            previousId = coverPage.id;
        }

        const hierarchy = tree[parentId].hierarchy;
        return { level, parentId, previousId, hierarchy };
    };

    const addNewItems = (anchorId: string,
        itemCreatetor: (anchorId: string, level: number, parentId: string, hierarchy: string) => BundleTreeItem[],
        filePath?: string, isFolder?: boolean) => {
        const anchor = tree[anchorId];
        const { level, parentId, previousId, hierarchy } = getHiracheyInfo(anchorId, true, isFolder);
        const mutated = {};
        const items = itemCreatetor(previousId, level, parentId, hierarchy);

        if (anchor.isCoverPage) {
            if (items.length !== 1) {
                return tree;
            }
            const newItem = items[0];
            mutated[anchor.id] = { ...anchor, filePath: filePath, lable: getCoverPageLabel(newItem.lable), data: newItem.data };
        } else {
            items.forEach((item) => {
                mutated[item.id] = item;
            });

            const nextItem = findNextItem(previousId);
            if (nextItem) {
                mutated[nextItem.id] = { ...nextItem, previousId: items[items.length - 1].id };
            }
        }
        const newTree = { ...tree, ...mutated };
        if (anchor.isFolder) {
            return updateLevels(newTree);
        }
        return newTree;
    };

    const getSimbling = (itemId: string) => {
        const me = tree[itemId];
        return getSortedList()
            .filter((item) => item.parentId === me.parentId && item.isCoverPage === false);
    };

    const addFolder = (anchorId: string, lable: string) => {
        return addNewItems(anchorId, (_anchorId, level, parentId, hierarchy) => {
            return [{ ...createItemWrapper(null, _anchorId, level, parentId, hierarchy), lable: lable, isFolder: true }];
        }, null, true);
    };
    const addItems = (anchorId: string, data: FileHistory[], path?: string) => {
        data = data.sort(i => new Date(i.dateDone).valueOf()).reverse();
        return addNewItems(anchorId, (_anchorId, level, parentId, hierarchy) => {
            return createItemsChain(data, _anchorId, level, parentId, hierarchy);
        }, path);
    };

    const addItemsWithFolder = (anchorId: string, folderLable: string, data: FileHistory[]) => {
        let dropedItem = tree[anchorId];
        if (!dropedItem || dropedItem.isCoverPage) {
            dropedItem = getRootItem();
        }
        const additemLevel = dropedItem.isFolder ? dropedItem.level + 1 : dropedItem.level;
        let folder = Object.values(tree).find((item) => item.level === additemLevel && item.isFolder && item.lable === folderLable);
        let newTree = tree;
        if (!folder) {
            newTree = addFolder(dropedItem.id, folderLable);
            folder = Object.values(newTree).find((item) => item.level === additemLevel && item.isFolder && item.lable === folderLable);
        }
        return treeUtil(newTree).addItems(folder.id, data);
    };

    const getUpDown = (item: BundleTreeItem, sortedlist: BundleTreeItem[]) => {
        const isInner = (_item: BundleTreeItem) => {
            return _item.hierarchy.length > item.hierarchy.length && _item.hierarchy.startsWith(item.hierarchy);
        };
        const simbs = sortedlist.filter((_item) => !isInner(_item));
        // const simbs = list.filter((_item) => _item.parentId === item.parentId);

        const myIndex = _.findIndex(simbs, (_item) => _item.id === item.id);
        const up = myIndex > 0 ? simbs[myIndex - 1] : null;
        const down = myIndex < simbs.length - 1 ? simbs[myIndex + 1] : null;
        return { up, down };
    };

    const removeItem = (itemId: string) => {
        const item = tree[itemId];
        if (item.isRoot) {
            return tree;
        }

        if (item.isCoverPage) {
            return { ...tree, ...{ [item.id]: { ...item, data: null, lable: getCoverPageLabel('not selected') } } };
        }

        const sortedList = getSortedList();
        const { up, down } = getUpDown(item, sortedList);

        const mutated = {};
        if (down != null) {
            mutated[down.id] = {
                ...down,
                previousId: up.id,
            };
        }
        const newTree = { ...tree, ...mutated };
        return treeToItemIds(removeSubtree(buildTree(newTree), itemId))
            .reduce((acc, id) => {
                acc[id] = newTree[id];
                return acc;
            }, {});
    };

    const startItemMove = (itemId: string) => {
        const item = tree[itemId];
        if (item.isCoverPage || item.isRoot) {
            return tree;
        }
        let newTree = tree;
        if (item.isFolder && item.expanded) {
            newTree = toggleExpand(item.id);
        }
        return { ...newTree, ...{ [item.id]: { ...item, moving: true } } };
    };

    const moveItem = (anchorId: string, itemId: string, changeParent = true) => {
        const item = tree[itemId];

        if (item.isCoverPage || item.isRoot) {
            return tree;
        }
        if (item.id === anchorId) {
            return tree;
        }

        const sortedList = getSortedList();
        const anchor = tree[anchorId];

        const { up, down } = getUpDown(item, sortedList);

        // just vertually rmove the subtree
        const mutated = {};
        if (down != null) {
            mutated[down.id] = {
                ...down,
                previousId: up.id
            };
        }

        let itemTailId = item.id;
        let anchorTailId = anchor.id;

        if (anchor.isFolder) {
            const anchorTail = findSortedTail(anchor.id, sortedList);
            if (anchorTail) {
                anchorTailId = anchorTail.id;
            }
        }

        if (item.isFolder) {
            const itemTail = findSortedTail(item.id, sortedList);
            if (itemTail) {
                itemTailId = itemTail.id;
            }
        }

        const { level, parentId, hierarchy } = getHiracheyInfo(anchorId, changeParent);
        // just insert item below the last item of the anchor
        if (anchorTailId === item.id) {

            // do not change the previous item
            mutated[item.id] = {
                ...item,
                level: level,
                parentId: parentId,
                hierarchy: createHierarchy(item.id, hierarchy),
                moving: false
            };

        } else {
            mutated[item.id] = {
                ...item,
                previousId: anchorTailId,
                level: level,
                parentId: parentId,
                hierarchy: createHierarchy(item.id, hierarchy),
                moving: false
            };
        }

        const oldAnchorNext = findNextItem(anchorTailId);

        if (oldAnchorNext && oldAnchorNext.id !== item.id) {
            mutated[oldAnchorNext.id] = {
                ...oldAnchorNext,
                previousId: itemTailId
            };
        }

        let newTree = { ...tree, ...mutated };
        if (item.isFolder) {
            newTree = updateLevels(newTree);
        }
        return newTree;
    };

    const moveUp = (itemId: string) => {
        const item = tree[itemId];
        if (!item.previousId) {
            return tree;
        }

        const simbs = getSimbling(item.id);

        if (simbs.length <= 1) {
            return tree;
        }

        const myIndex = _.findIndex(simbs, (val) => val.id === item.id);

        if (myIndex <= 0) {
            return tree;
        }
        const preItem = simbs[myIndex - 1];
        if (preItem.isCoverPage) {
            return tree;
        }
        return moveDown(preItem.id);
    };

    const moveDown = (itemId: string) => {
        const item = tree[itemId];
        const simbs = getSimbling(item.id);

        if (simbs.length <= 1) {
            return tree;
        }
        const myIndex = _.findIndex(simbs, (val) => val.id === item.id);

        if (myIndex >= simbs.length - 1) {
            return tree;
        }
        const next = simbs[myIndex + 1];
        // if (next.isFolder) {
        //     return moveUp(next.id);
        // }
        return moveItem(next.id, itemId, false);
    };
    const editLable = (itemId: string, lable: string) => {
        const item = tree[itemId];
        const clone = { ...item, lable: lable, isEdit: false };
        return { ...tree, ...{ [item.id]: clone } };
    };
    const editDate = (itemId: string, date: string) => {
        const item = tree[itemId];
        const clone = { ...item, date: date ? datePipe.transform(date.toString(), 'yyyy-MM-dd') : null };
        return { ...tree, ...{ [item.id]: clone } };
    };
    const editFileDateEnable = (itemId: string, value: boolean) => {
        const item = tree[itemId];
        const clone = { ...item, isFileDateEnable: !item.isFileDateEnable };
        return { ...tree, ...{ [item.id]: clone } };
    };

    const setSelected = (itemId: string): TreeMap => {
        const item = tree[itemId];
        if (item.selected) {
            return tree;
        }
        const mutated = {};
        mutated[item.id] = { ...item, selected: true };
        const selected = findSelectedItem();
        if (selected) {
            mutated[selected.id] = { ...selected, 'selected': false };
        }
        return { ...tree, ...mutated };
    };
    const moveUpSelected = () => {
        const selected = findSelectedItem();
        if (!selected) {
            return tree;
        }
        return moveUp(selected.id);
    };
    const moveDownSelected = () => {
        const selected = findSelectedItem();
        if (!selected) {
            return tree;
        }
        return moveDown(selected.id);
    };
    const getSortedList = () => {
        return mapSort(Object.values(tree));
    };
    const getItemListForRendering = () => {
        return getSortedList().filter((item) => item.visible && !item.moving);
    };

    const getTreePreservePaginationValidation = () => {
        let validationObject;
        const messageTitle = 'Core Bundle';
        const validationMessage = 'The background colour of the layout has been changed to indicate that you have opened a Core Bundle.';
        const coreBundleItem = getSortedList().filter(item => !item.isCoverPage && !item.isRoot)
            .map((rowItem) => rowItem.isCoreBunlde);
        if (coreBundleItem && coreBundleItem.length > 0) {
            validationObject = { messageTitle: messageTitle, validationMessage: validationMessage };
        } else {
            validationObject = { messageTitle: null, validationMessage: null };
        }
        return validationObject;
    };
    const getItemListForBundling = (timeOffset) => {
        const coverPageData = getSortedList().filter(item => item.isCoverPage)[0];
        const treeList = getSortedList().filter(item => !item.isCoverPage);
        const bundleNameText = getSortedList().filter(item => item.isRoot)[0] ? getSortedList().filter(item => item.isRoot)[0].lable : '';
        const treeListCopy = getSortedList().map(x => Object.assign({}, x)).filter(item => !item.isCoverPage);
        const isHaveSavedItem = getSortedList().filter(item => item.isSavedItem);
        for (let i = 0; i < treeList.length; i++) {
            const item = treeList[i];
            const id = i + 1;
            if (item && treeListCopy && treeListCopy.length > 0) {
                treeListCopy.map((rowItem) => {
                    if (rowItem.id === item.id) {
                        rowItem.id = '-' + id.toString();
                    }
                    if (rowItem.parentId === item.id) {
                        rowItem.parentId = '-' + id.toString();
                        rowItem.folderName = item.lable;
                    }
                });
            }
            // console.log('-' + id.toString());
        }
        let tempPPI_Position = 0;
        let previceFolderId = null;
        const mapTreeItemList: PDFBundleTreeItemViewModel[] = treeListCopy.filter(item => !item.isRoot).map((_item) => {

            if (_item.isFolder && previceFolderId !== _item.id) {
                previceFolderId = _item.id;
                tempPPI_Position = 0;
            } else {
                tempPPI_Position = tempPPI_Position + 1;
            }

            return ({
                pbI_ItemID: +_item.id,
                pbI_BundleID: 0,
                // pbI_Position: _item.level,
                pbI_Position: _item.isFolder ? 1 : tempPPI_Position,
                pbI_DpsDiaryID: _item.data ? _item.data.diary_UID : 0,
                pbI_FilePath: _item.filePath,
                pbI_FileDate: _item.date ? _item.date : null, // _item.isFileDateEnable ? _item.date ? _item.date : null : null,
                pbI_ItemText: _item.lable,
                pbI_LastModifiedDate: datePipe.transform(dpsNewDate(timeOffset).toString(), 'yyyy-MM-dd'),
                pbI_FolderName: _item.folderName ? _item.folderName : '',
                pbI_ParentID: + _item.parentId,
                pbI_Version: isHaveSavedItem.length > 0 ? _item.isSavedItem ? 1 : 10 : 1, // fix for backend pagination issue
                pbI_ExclFromCoreBundle: _item.isCoreBunlde,
                pbI_Type: _item.isFolder ? 0 : 1,
                pbI_Info: _item.data ? _item.data.offlineStatus : null,
                pbI_DisplayDate: _item.isFileDateEnable, // _item.pbI_DisplayDate,
                pbI_PageOffset: _item.pbI_PageOffset,
                pbI_PageCount: _item.pbI_PageCount,
                pbI_SectionPrefix: _item.pbI_SectionPrefix,
                pbI_PageNoLabel: _item.pbI_PageNoLabel,
                pbI_IgnoreForMerge: _item.pbI_IgnoreForMerge,
                pbI_IsSubPage: _item.pbI_IsSubPage,
            });
        }

        );

        return mapTreeItemList;
    };
    const setEditLable = (itemId: string): TreeMap => {
        const item = tree[itemId];
        if (item && item.isEdit) {
            return tree;
        }
        const mutated = {};
        mutated[item.id] = { ...item, isEdit: true };
        const isEdit = findEditClickItem();
        if (isEdit) {
            mutated[isEdit.id] = { ...item, isEdit: false };
        }
        return { ...tree, ...mutated };
    };

    const setIsCoreBundle = (itemIds: string[]): TreeMap => {
        let tempTree = tree;
        itemIds.forEach(itemId => {
            const item = tempTree[itemId];
            const mutated = {};
            mutated[item.id] = { ...item, isCoreBunlde: !item.isCoreBunlde };
            tempTree = { ...tempTree, ...mutated };
        });
        return tempTree;
    };

    return {
        toggleExpand,
        addItems,
        addFolder,
        removeItem,
        moveItem,
        moveUpSelected,
        moveDownSelected,
        editLable,
        editDate,
        editFileDateEnable,
        setSelected,
        getSortedList,
        addItemsWithFolder,
        startItemMove,
        getItemListForRendering,
        setEditLable,
        getItemListForBundling,
        generateFullTreeFromArray,
        setIsCoreBundle,
        getTreePreservePaginationValidation,
    };
};

function toggleFolder(treeMap: TreeMap, folderId: string): TreeMap {
    return treeUtil(treeMap).toggleExpand(folderId);
}
function steDirtyValue(dirtyValue) {
    if (dirtyValue) {
        return dirtyValue;
    } else {
        return false;
    }
}

function getCoverPageLabel(lable: string): string {
    return `${COVER_PAGE_LABLE}[${lable}]`;
}

function selectItem(treeMap: TreeMap, itemId: string): TreeMap {
    return treeUtil(treeMap).setSelected(itemId);
}

function updateLable(treeMap: TreeMap, itemId: string, newLable: string): TreeMap {
    return treeUtil(treeMap).editLable(itemId, newLable);
}

function updateDate(treeMap: TreeMap, itemId: string, newDate: string): TreeMap {
    return treeUtil(treeMap).editDate(itemId, newDate);
}
function updateFileDateEnable(treeMap: TreeMap, itemId: string, value: boolean): TreeMap {
    return treeUtil(treeMap).editFileDateEnable(itemId, value);
}
function moveSelectedItemUp(treeMap: TreeMap) {
    return treeUtil(treeMap).moveUpSelected();
}

function moveSelectedItemDown(treeMap: TreeMap) {
    return treeUtil(treeMap).moveDownSelected();
}

function moveItemById(treeMap: TreeMap, anchorId: string, itemId: string) {
    return treeUtil(treeMap).moveItem(anchorId, itemId);
}

function addItemsBelow(treeMap: TreeMap, anchorId: string, items: FileHistory[]) {
    return treeUtil(treeMap).addItems(anchorId, items);
}

function addCoverItems(treeMap: TreeMap, coverPageId: string, fileName: string, path: string, items: FileHistory) {
    return treeUtil(treeMap).addItems(coverPageId, [items], path);
}

function addFolderBelow(treeMap: TreeMap, anchorId: string, lable: string) {
    return treeUtil(treeMap).addFolder(anchorId, lable);
}

function RemoveItem(treeMap: TreeMap, anchorId: string) {
    return treeUtil(treeMap).removeItem(anchorId);
}

function onItemMoveStart(treeMap: TreeMap, itemId: string) {
    // return treeUtil(treeMap).startItemMove(itemId);
    return treeMap;
}

function addItemsToNewFolder(treeMap: TreeMap, anchorId: string, lable: string, data: FileHistory[]) {
    return treeUtil(treeMap).addItemsWithFolder(anchorId, lable, data);
}
function editLabelItem(treeMap: TreeMap, itemId: string): TreeMap {
    return treeUtil(treeMap).setEditLable(itemId);
}
function changeIsCoreBundle(treeMap: TreeMap, itemIds: string[]): TreeMap {
    return treeUtil(treeMap).setIsCoreBundle(itemIds);
}
function mappingToTreeCache(state: BundlingProfileState, saveItemList: BundleItemsViewModel[],
    selectedRow: PDFBundleHeaderViewModel, timeOffset) {
    return treeUtil({}).generateFullTreeFromArray(saveItemList, selectedRow, timeOffset);
}

const getState = (state: State) => state;
const getProfileStatebyToken = (token) => createSelector(getState, (state) => state[token]);
const getBundlingTree = (token) => createSelector(getProfileStatebyToken(token), (state) => state ? state.treeCache : {} as TreeMap);
const getBundlingTreeUtil = (token) => createSelector(getBundlingTree(token), (tree) => !!tree ? treeUtil(tree) : treeUtil({}));
export const getBundlingItemList = (token) => createSelector(getBundlingTreeUtil(token), (util) => util.getItemListForRendering());
export const getBundlingAllItemList = (token) => createSelector(getBundlingTreeUtil(token), (util) => util.getSortedList());
export const getSelectedBundlingItem = (token) => createSelector(getBundlingTreeUtil(token), (util) =>
    util.getItemListForRendering().find(i => i.selected));
export const getBundlingItemSaveDataList = (token, timeOffset) =>
    createSelector(getBundlingTreeUtil(token), (util) => util.getItemListForBundling(timeOffset));
export const getPreservePaginationValidation = (token) => createSelector(getBundlingTreeUtil(token),
    (util) => util.getTreePreservePaginationValidation());
export const getBundlingCoverPageId = (token) => createSelector(getBundlingTreeUtil(token), (util) =>
    util.getItemListForRendering().find(i => i.isCoverPage).id);
export const isTreeDirtyByToken = (token) => createSelector(getProfileStatebyToken(token),
    (state) => state ? state.isDirty : false);
export const getBundleNameTextByToken = (token) => createSelector(getBundlingTreeUtil(token),
    (util) => util.getItemListForRendering());

