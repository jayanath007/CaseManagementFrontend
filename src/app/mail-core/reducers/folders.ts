import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/folders';
import { FolderItemWrapper, MailBox, FolderPermissions, FolderPermission, FolderPermissionUserId } from '../models/interfaces';
import { FolderEditMode } from '../../core/organizer/enums';
import { MailFolder, User } from '../../core/lib/microsoft-graph';
import * as _ from 'lodash';
import { ReadItems, EditDeleteItems, PermissionLevel } from '../models/enums';

export interface FolderMap { [id: string]: Readonly<FolderItemWrapper>; }
export type ImmutableFolerMap = Readonly<FolderMap>;

export interface State {
    readonly folders: ImmutableFolerMap;
    readonly loading: boolean;
    readonly init: boolean;
    readonly selectedFolderId: string;
    readonly folderLoaded: boolean;
    readonly mailBoxes: MailBox[];
    readonly folderPermissions: FolderPermissions;
}

const initialState: State = Object.freeze({
    folders: Object.freeze({}),
    loading: false, init: false, selectedFolderId: null,
    folderLoaded: false,
    mailBoxes: [
        { mail: 'me', displayName: 'My Mailbox', init: false, expanded: true, loading: false },
    ],
    folderPermissions: null
});

export function reducer(state = initialState, action: Actions.Any): State {
    try {

        switch (action.type) {
            case Actions.LOAD_FOLDER_LIST:
                return { ...state, loading: state.folderLoaded ? false : true, init: true };
            case Actions.FOLDER_LOAD_SUCCESSS:
                return {
                    ...state,
                    folders: assignFolders(state.folders, action.payload.folderList, action.payload.clearCurrent, action.payload.owner),
                    loading: false,
                    folderLoaded: true,
                    mailBoxes: state.mailBoxes.map(mailbox => {
                        if (mailbox.mail === action.payload.owner) {
                            return { ...mailbox, init: false, loading: false };
                        }
                        return mailbox;
                    })
                };
            case Actions.FOLDER_LOAD_FAIL:
                return {
                    ...state, loading: false,
                    mailBoxes: state.mailBoxes.map(mailbox => {
                        if (mailbox.mail === action.payload.owner) {
                            return { ...mailbox, loading: false };
                        }
                        return mailbox;
                    })
                };
            case Actions.FOLDER_ITEM_TOGGLE_EXPAND:
                return { ...state, folders: toggleExpand(state.folders, action.payload) };
            case Actions.TOGGLE_MAILBOX:
                return {
                    ...state, mailBoxes: state.mailBoxes.map(mailbox => {
                        if (mailbox.mail === action.payload.mail) {
                            return { ...mailbox, expanded: !mailbox.expanded, loading: mailbox.init };
                        }
                        return mailbox;
                    })
                };
            case Actions.REFRESH_MAILBOX:
                return {
                    ...state, mailBoxes: state.mailBoxes.map(mailbox => {
                        if (mailbox.mail === action.payload.mail) {
                            return { ...mailbox, loading: true, init: true };
                        }
                        return mailbox;
                    })
                };
            case Actions.GET_MAILBOXES_SUCCESS:
                return {
                    ...state,
                    mailBoxes: state.mailBoxes.concat(action.payload.map(val => ({ ...val, init: true, expanded: false, loading: false })))
                };
            case Actions.ADD_MAILBOX_SUCCESS:
                return {
                    ...state,
                    mailBoxes: addMailBox(state.mailBoxes, action.payload)
                };
            case Actions.REMOVE_MAILBOX_SUCCESS:
                return {
                    ...state,
                    mailBoxes: removeMailBox(state.mailBoxes, action.payload)
                };
            case Actions.GET_FOLDER_PERMISSION_SET:
                return {
                    ...state,
                    folderPermissions: null
                };
            case Actions.GET_FOLDER_PERMISSION_SET_SUCCESS:
                return {
                    ...state,
                    folderPermissions: (action.payload && action.payload.folderId) ?
                        {
                            ...action.payload,
                            permissionSet: action.payload.permissionSet
                                .map((val, i) => i === 0 ? { ...val, isSelected: true } : { ...val, isSelected: false })
                        } : null
                };
            case Actions.SELECT_USER_PERMISSION:
                return {
                    ...state,
                    folderPermissions: {
                        ...state.folderPermissions,
                        permissionSet: state.folderPermissions.permissionSet
                            .map(val => (val.userId.userId === action.payload.userId) ?
                                { ...val, isSelected: true } : { ...val, isSelected: false })
                    }
                };
            case Actions.REMOVE_SELECTED_PERMISSION:
                return {
                    ...state,
                    folderPermissions: {
                        ...state.folderPermissions,
                        permissionSet: state.folderPermissions.permissionSet.filter(val => !val.isSelected)
                            .map((val, i) => i === 0 ? { ...val, isSelected: true } : { ...val, isSelected: false })
                    }
                };
            case Actions.ADD_FOLDER_PERMISSION:
                return {
                    ...state,
                    folderPermissions: {
                        ...state.folderPermissions,
                        permissionSet: state.folderPermissions.permissionSet
                            .map(val => ({ ...val, isSelected: false }))
                            .concat([getPermissionByLevel(PermissionLevel.None, {
                                userId: action.payload.mail,
                                userDisplayName: action.payload.displayName,
                            })])
                    }
                };
            case Actions.CHANGE_FOLDER_PERMISSION_LEVEL:
                return {
                    ...state,
                    folderPermissions: {
                        ...state.folderPermissions,
                        permissionSet: state.folderPermissions.permissionSet
                            .map(val => {
                                if (val.isSelected) {
                                    return getPermissionByLevel(action.payload, val.userId);
                                }
                                return val;
                            })
                    }
                };
            case Actions.CHANGE_FOLDER_PERMISSION_VALUE_BY_KEY:
                return {
                    ...state,
                    folderPermissions: {
                        ...state.folderPermissions,
                        permissionSet: state.folderPermissions.permissionSet
                            .map(val => {
                                if (val.isSelected) {
                                    return getPermissionByValue(val, action.payload);
                                }
                                return val;
                            })
                    }
                };
            case Actions.FOLDER_SELECT:
                return { ...state, ...selectFolder(state, action.payload, getSelectedFolder(state)) };
            case Actions.ACTIVATE_FOLDER_EDIT_MODE:
                return {
                    ...state, folders: setFolderEditMode(state.folders,
                        (action as Actions.ActivateFolderEditMode).payload.item,
                        (action as Actions.ActivateFolderEditMode).payload.editMode)
                };

            case Actions.FINALIZE_FOLDER_EDIT_MODE:
                return {
                    ...state, folders: setFolderEditMode(state.folders, (action as Actions.FinalizeFolderEditMode).payload.item, null)
                };

            // folder create stuff
            case Actions.CREATE_NEW_FOLDER:
                return { ...state, ...preCreateFolder(state, (action as Actions.CreateNewFolder).payload.parentId) };
            case Actions.FOLDER_CREATE_SUCCESS:
                return {
                    ...state,
                    folders: folderCreateSuccess(state.folders, (action as Actions.FolderCreateSuccess).payload.item, action.payload.owner)
                };
            case Actions.FOLDER_CREATE_FAIL:
                return { ...state, folders: folderCreateFail(state.folders, (action as Actions.FolderCreateFail).payload.parentId) };

            case Actions.RENAME_FOLDER:
                return {
                    ...state, folders: preRenameFolder(state.folders,
                        (action as Actions.RenameFolder).payload.folder, (action as Actions.RenameFolder).payload.value)
                };
            case Actions.RENAME_FOLDER_SUCCESS:
                return {
                    ...state, folders: folderRenameSuccess(state.folders,
                        (action as Actions.RenameFolderSuccess).payload.item)
                };
            case Actions.RENAME_FOLDER_FAIL:
                return { ...state, folders: folderRenameFail(state.folders, (action as Actions.RenameFolderFail).payload.folder) };

            case Actions.DELETE_FOLDER:
                return { ...state, folders: preFolderDelete(state.folders, (action as Actions.DeleteFolder).payload.item) };

            case Actions.DELETE_FOLDER_SUCCESS:
                return {
                    ...state,
                    ...folderDeleteSuccess(state, (action as Actions.DeleteFolderSuccess).payload.item, action.payload.owner)
                };

            case Actions.DELETE_FOLDER_FAIL:
                return {
                    ...state, ...folderDeleteFail(state.folders,
                        (action as Actions.DeleteFolderFail).payload.item)
                };
            case Actions.MOVE_FOLDER:
                return { ...state, folders: preFolderDelete(state.folders, (action as Actions.MoveFolder).payload.item) };

            case Actions.MOVE_FOLDER_SUCCESS:
                return { ...state, ...folderMoveSuccess(state, action.payload.item, action.payload.newItem, action.payload.owner) };

            case Actions.MOVE_FOLDER_FAIL:
                return {
                    ...state, ...folderDeleteFail(state.folders,
                        (action as Actions.MoveFolderFail).payload.item)
                };

            case Actions.REFRESH_FOLDER_SUCCESS:
                return {
                    ...state, folders: replaceFolders(state.folders, action.payload.items)
                };

            default:
                {
                    return state;
                }
        }
    } catch (e) {
        console.log('error in mail foder reducer');
        return state;
    }
}
// mailboxes
function addMailBox(mailBoxes: MailBox[], payload: User) {
    if (mailBoxes.find(val => val.mail === payload.mail)) {
        return mailBoxes.map(val => val.mail === payload.mail ? { ...val, ...payload } : val);
    }
    return mailBoxes.concat([{ ...payload, init: true, expanded: false, loading: false }]);
}
function removeMailBox(mailBoxes: MailBox[], payload: MailBox) {
    return mailBoxes.filter(val => val.mail !== payload.mail);
}

// #region delete folder
function preFolderDelete(current: ImmutableFolerMap, folder: FolderItemWrapper): ImmutableFolerMap {
    const tmp = {};
    tmp[folder.data.id] = Object.freeze({
        ...folder,
        loading: true,
    });
    return Object.freeze({ ...current, ...tmp });
}

function folderDeleteFail(current: ImmutableFolerMap, folder: FolderItemWrapper): ImmutableFolerMap {
    const tmp = {};
    tmp[folder.data.id] = Object.freeze({
        ...folder,
        loading: false,
    });
    return Object.freeze({ ...current, ...tmp });
}

function folderDeleteSuccess(state: State, folder: FolderItemWrapper, owner: string): Partial<State> {
    const changed = [];
    const deletedFolder = getAllChildFolders(state.folders, folder)
        .concat([folder])
        .map((child) => child.data.id);

    const newFolders = Object.keys(state.folders)
        .filter((id) => deletedFolder.indexOf(id) === -1)
        .reduce((accu, id) => {
            accu[id] = state.folders[id];
            return accu;
        }, {});

    if (newFolders[folder.data.parentFolderId]) {
        const oldParent = newFolders[folder.data.parentFolderId].data;
        changed.push({ ...oldParent, childFolderCount: oldParent.childFolderCount - 1 || 0 });
    }

    return { folders: assignFolders(newFolders, changed, false, owner) };
}
function folderMoveSuccess(state: State, folder: FolderItemWrapper, newFolder: MailFolder, owner: string): Partial<State> {
    const changed = [newFolder];
    const newFolders = Object.keys(state.folders)
        .filter((id) => id !== folder.data.id)
        .reduce((accu, id) => {
            accu[id] = state.folders[id];
            return accu;
        }, {});
    if (newFolders[folder.data.parentFolderId]) {
        const oldParent = newFolders[folder.data.parentFolderId].data;
        changed.push({ ...oldParent, childFolderCount: oldParent.childFolderCount - 1 || 0 });
    }
    if (newFolders[newFolder.parentFolderId]) {
        const newParent = newFolders[newFolder.parentFolderId].data;
        changed.push({ ...newParent, childFolderCount: newParent.childFolderCount + 1 || 1 });
    }
    return { folders: assignFolders(newFolders, changed, false, owner) };
}

// #endregion

// #region rename folder
function preRenameFolder(current: ImmutableFolerMap, folder: FolderItemWrapper, value: string): ImmutableFolerMap {
    const tmp = {};
    tmp[folder.data.id] = Object.freeze({
        ...folder,
        loading: true,
        editMode: undefined,
        data: Object.freeze({ ...folder.data, displayName: value })
    });
    return Object.freeze({ ...current, ...tmp });
}

function folderRenameSuccess(current: ImmutableFolerMap, folder: MailFolder): ImmutableFolerMap {
    const oldWrapper = current[folder.id];
    const tmp = {};
    tmp[folder.id] = Object.freeze({ ...oldWrapper, loading: false, data: folder });
    return Object.freeze({ ...current, ...tmp });
}

function folderRenameFail(current: ImmutableFolerMap, originalFolder: FolderItemWrapper): ImmutableFolerMap {
    const tmp = {};
    tmp[originalFolder.data.id] = Object.freeze({ ...originalFolder, loading: false, editMode: undefined });
    return Object.freeze({ ...current, ...tmp });
}

// #endregion

// #region folder create
function preCreateFolder(state: State, parentId?: string): Partial<State> {
    const current: ImmutableFolerMap = state.folders;
    if (!!parentId && current[parentId]) {
        const tmp = {};
        tmp[parentId] = Object.freeze({ ...current[parentId], loading: true });
        return { folders: Object.freeze({ ...current, ...tmp }) };
    }
    return state;
}

function folderCreateSuccess(current: ImmutableFolerMap, folder: MailFolder, owner: string) {
    const changed = [folder];
    if (current[folder.parentFolderId]) {
        const parentData = current[folder.parentFolderId].data;
        changed.push({ ...parentData, childFolderCount: parentData.childFolderCount + 1 || 1 });
    }
    return assignFolders(current, changed, false, owner);
}

function folderCreateFail(current: ImmutableFolerMap, owner: string, parentId?: string) {
    if (parentId && current[parentId]) {
        return assignFolders(current, [current[parentId].data], false, owner);
    }
    return current;
}
// #endregion

function replaceFolders(current: ImmutableFolerMap, folders: MailFolder[]): ImmutableFolerMap {
    return Object.freeze(folders.reduce((folderMap, folder) => {
        if (folderMap[folder.id]) {
            folderMap[folder.id] = Object.freeze({ ...folderMap[folder.id], data: folder });
        }
        return folderMap;
    }, { ...current } as FolderMap));
}

function setFolderEditMode(current: ImmutableFolerMap, changed: FolderItemWrapper, editMode: FolderEditMode) {
    return Object.freeze<FolderMap>(Object.values(current).reduce((map, item) => {
        if (item.data.id === changed.data.id) {
            map[item.data.id] = Object.freeze({ ...changed, editMode: editMode });
        }
        return map;
    }, { ...current } as FolderMap));
}

function selectFolder(state: State, newSelected: FolderItemWrapper, currentSelected: FolderItemWrapper): Partial<State> {
    if (currentSelected === newSelected) {
        return state;
    }

    const currentFolders = state.folders;
    console.log('all child folders', getAllChildFolders(currentFolders, newSelected));
    const changes = [newSelected];
    if (currentSelected) {
        changes.push(currentSelected);
    }

    const folders = Object.freeze(changes.reduce((map, item) => {
        if (item.data.id === newSelected.data.id) {
            map[item.data.id] = Object.freeze<FolderItemWrapper>({ ...item, selected: true });
        } else {
            map[item.data.id] = Object.freeze<FolderItemWrapper>({ ...item, selected: false });
        }
        return map;
    }, { ...currentFolders } as any));

    return Object.freeze<Partial<State>>({ folders: folders as ImmutableFolerMap, selectedFolderId: newSelected.data.id });
}

function toggleExpand(current: ImmutableFolerMap, toggled: FolderItemWrapper) {
    const affectedFolders = toggled.expanded ? getAllChildFolders(current, toggled) :
        Object.values(current).filter((folder) => {
            return folder.data.parentFolderId === toggled.data.id;
        });

    let mutated = affectedFolders.reduce((all, child) => {
        return { ...all, ...{ [child.data.id]: Object.freeze({ ...child, visible: !toggled.expanded }) } };
    }, {});
    mutated = { ...mutated, ...{ [toggled.data.id]: Object.freeze({ ...toggled, expanded: !toggled.expanded }) } };
    return Object.freeze({ ...current, ...mutated });
}

function getAllChildFolders(current: ImmutableFolerMap, parent: FolderItemWrapper) {
    const group: { [id: string]: FolderItemWrapper[] } = _.groupBy(Object.values(current),
        (folder: FolderItemWrapper) => folder.data.parentFolderId);
    function getChildren(_parent: FolderItemWrapper): FolderItemWrapper[] {
        if (group[_parent.data.id]) {
            return group[_parent.data.id].map((child) => {
                return [child].concat(getChildren(child));
            }).reduce((allChildren, children) => {
                return allChildren.concat(children);
            }, []);
        }
        return [];
    }
    return getChildren(parent);
}

function deriveLevels(data: ImmutableFolerMap) {
    const travers = (list, callback: (item, parent, index) => void, parent?, index: number = 0) => {
        const curItem = list;
        callback(curItem, parent, index);
        if (curItem.children && curItem.children.length > 0) {
            _.sortBy(curItem.children, (item) => item.data.displayName || '')
                .forEach((item, _index) => travers(item, callback, curItem, _index));
        }
    };

    const tempTreeHash = Object.values(data)
        .map((item) => ({ ...item, children: [], level: 1, hierarchy: null }))
        .reduce((acc, item) => {
            acc[item.data.id] = item;
            return acc;
        }, {});

    const root = { data: null, children: [], level: 0, hierarchy: '' };

    Object.keys(tempTreeHash).forEach((key) => {
        const obj = tempTreeHash[key];
        if (obj.data.parentFolderId && tempTreeHash[obj.data.parentFolderId]) {
            const parent = tempTreeHash[obj.data.parentFolderId];
            parent.children.push(obj);
        } else {
            root.children.push(obj);
        }
    });

    const rankHash: { [id: string]: string } = {
        inbox: '001', drafts: '002', sentitems: '003',
        deleteditems: '004'
    };
    const resultHash: { [id: string]: { level: number, hierarchy: string, visible: boolean } } = {};

    root.children
        .forEach((item, myIndex) => {
            if (item.owner === 'me' && item.data.wellKnownName && rankHash[item.data.wellKnownName]) {
                item.hierarchy = rankHash[item.data.wellKnownName];
            } else {
                item.hierarchy = _.padStart('' + (Object.values(rankHash).length + 1 + myIndex), 3, '0');
            }
            item.level = 1;
            item.visible = true;
            resultHash[item.data.id] = { level: item.level, hierarchy: item.hierarchy, visible: item.visible };
            travers(item, (child, parent, index) => {
                if (parent) {
                    child.level += parent.level;
                    const pad = _.padStart(child.level + index, 3, '0');
                    child.hierarchy = parent.hierarchy + ',' + pad;
                    resultHash[child.data.id] = {
                        level: child.level, hierarchy: child.hierarchy,
                        visible: parent.expanded && parent.visible
                    };
                }
            });
        });

    return resultHash;
}

function assignFolders(current: ImmutableFolerMap, newList: MailFolder[], clear: boolean, owner: string) {

    const isTopLevel = (hierarchy: string) => {
        return hierarchy.split(',').length === 1;
    };
    const newMap = {};
    if (clear) {
        Object.keys(current).forEach((key) => {
            if (current[key].owner !== owner) {
                newMap[key] = { ...current[key] };
            }
        });
    }

    const changed: FolderMap = newList.reduce<FolderMap>((map, item) => {

        let tmp: FolderItemWrapper;
        const parentFolder = current[item.parentFolderId];
        const oldItem = current[item.id];

        if (parentFolder && parentFolder.loading) {
            map[item.parentFolderId] = Object.freeze({ ...parentFolder, loading: false });
        }

        if (oldItem) {
            tmp = { ...oldItem, data: item, loading: false };
        } else {
            tmp = { data: item, selected: false, loading: false, hierarchy: null, visible: false, expanded: false, owner: owner };
        }

        map[item.id] = Object.freeze<FolderItemWrapper>(tmp);

        // update parent folder flags
        return map;
    }, clear ? newMap : { ...current });

    const levelHash = deriveLevels(changed);

    return Object.freeze(Object.keys(levelHash).reduce<FolderMap>((map, key) => {
        const item = map[key];
        map[key] = Object.freeze({
            ...item, hierarchy: levelHash[key].hierarchy,
            visible: levelHash[key].visible
        });
        return map;
    }, changed)) as ImmutableFolerMap;
}

function folderCom(folder) {
    return folder.hierarchy;
}
// permission
function getPermissionByValue(folderPermission: FolderPermission, { key, value }): FolderPermission {

    const _folderPermission = { ...folderPermission };
    _folderPermission[key] = value;
    if (_folderPermission.readItems === ReadItems.None &&
        _folderPermission.editItems === EditDeleteItems.None &&
        _folderPermission.deleteItems === EditDeleteItems.None) {

        if (!(_folderPermission.isFolderContact || _folderPermission.isFolderOwner ||
            _folderPermission.isFolderVisible || _folderPermission.canCreateItems || _folderPermission.canCreateSubFolders)) {
            return { ..._folderPermission, permissionLevel: PermissionLevel.None };
        } else if (!_folderPermission.isFolderContact && !_folderPermission.isFolderOwner &&
            _folderPermission.isFolderVisible && _folderPermission.canCreateItems && !_folderPermission.canCreateSubFolders) {
            return { ..._folderPermission, permissionLevel: PermissionLevel.Contributor };
        }
    } else if (_folderPermission.readItems === ReadItems.FullDetails &&
        _folderPermission.editItems === EditDeleteItems.All &&
        _folderPermission.deleteItems === EditDeleteItems.All) {
        if (_folderPermission.isFolderContact && _folderPermission.isFolderOwner &&
            _folderPermission.isFolderVisible && _folderPermission.canCreateItems && _folderPermission.canCreateSubFolders) {
            return { ..._folderPermission, permissionLevel: PermissionLevel.Owner };
        } else if (!_folderPermission.isFolderContact && !_folderPermission.isFolderOwner &&
            _folderPermission.isFolderVisible && _folderPermission.canCreateItems && _folderPermission.canCreateSubFolders) {
            return { ..._folderPermission, permissionLevel: PermissionLevel.PublishingEditor };
        } else if (!_folderPermission.isFolderContact && !_folderPermission.isFolderOwner &&
            _folderPermission.isFolderVisible && _folderPermission.canCreateItems && !_folderPermission.canCreateSubFolders) {
            return { ..._folderPermission, permissionLevel: PermissionLevel.Editor };
        }
    } else if (_folderPermission.readItems === ReadItems.FullDetails &&
        _folderPermission.editItems === EditDeleteItems.Owned &&
        _folderPermission.deleteItems === EditDeleteItems.Owned) {
        if (!_folderPermission.isFolderContact && !_folderPermission.isFolderOwner &&
            _folderPermission.isFolderVisible && _folderPermission.canCreateItems && _folderPermission.canCreateSubFolders) {
            return { ..._folderPermission, permissionLevel: PermissionLevel.PublishingAuthor };
        } else if (!_folderPermission.isFolderContact && !_folderPermission.isFolderOwner &&
            _folderPermission.isFolderVisible && _folderPermission.canCreateItems && !_folderPermission.canCreateSubFolders) {
            return { ..._folderPermission, permissionLevel: PermissionLevel.Author };
        }
    } else if (_folderPermission.readItems === ReadItems.FullDetails &&
        _folderPermission.editItems === EditDeleteItems.None &&
        _folderPermission.deleteItems === EditDeleteItems.Owned &&
        !_folderPermission.isFolderContact && !_folderPermission.isFolderOwner &&
        _folderPermission.isFolderVisible && _folderPermission.canCreateItems && !_folderPermission.canCreateSubFolders) {

        return { ..._folderPermission, permissionLevel: PermissionLevel.NoneditingAuthor };

    } else if (_folderPermission.readItems === ReadItems.FullDetails &&
        _folderPermission.editItems === EditDeleteItems.None &&
        _folderPermission.deleteItems === EditDeleteItems.None &&
        !_folderPermission.isFolderContact && !_folderPermission.isFolderOwner &&
        _folderPermission.isFolderVisible && !_folderPermission.canCreateItems && !_folderPermission.canCreateSubFolders) {

        return { ..._folderPermission, permissionLevel: PermissionLevel.Reviewer };

    }

    return { ..._folderPermission, permissionLevel: PermissionLevel.Custom };

}
function getPermissionByLevel(level: PermissionLevel, userId: FolderPermissionUserId): FolderPermission {
    switch (level) {
        case PermissionLevel.None:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: false,
                canCreateItems: false,
                canCreateSubFolders: false,
                readItems: ReadItems.None,
                editItems: EditDeleteItems.None,
                deleteItems: EditDeleteItems.None,
                permissionLevel: PermissionLevel.None,
                userId: userId
            };
        case PermissionLevel.Owner:
            return {
                isSelected: true,
                isFolderContact: true,
                isFolderOwner: true,
                isFolderVisible: true,
                canCreateItems: true,
                canCreateSubFolders: true,
                readItems: ReadItems.FullDetails,
                editItems: EditDeleteItems.All,
                deleteItems: EditDeleteItems.All,
                permissionLevel: PermissionLevel.Owner,
                userId: userId
            };
        case PermissionLevel.PublishingEditor:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: true,
                canCreateItems: true,
                canCreateSubFolders: true,
                readItems: ReadItems.FullDetails,
                editItems: EditDeleteItems.All,
                deleteItems: EditDeleteItems.All,
                permissionLevel: PermissionLevel.PublishingEditor,
                userId: userId
            };
        case PermissionLevel.Editor:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: true,
                canCreateItems: true,
                canCreateSubFolders: false,
                readItems: ReadItems.FullDetails,
                editItems: EditDeleteItems.All,
                deleteItems: EditDeleteItems.All,
                permissionLevel: PermissionLevel.Editor,
                userId: userId
            };
        case PermissionLevel.PublishingAuthor:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: true,
                canCreateItems: true,
                canCreateSubFolders: true,
                readItems: ReadItems.FullDetails,
                editItems: EditDeleteItems.Owned,
                deleteItems: EditDeleteItems.Owned,
                permissionLevel: PermissionLevel.PublishingAuthor,
                userId: userId
            };
        case PermissionLevel.Author:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: true,
                canCreateItems: true,
                canCreateSubFolders: false,
                readItems: ReadItems.FullDetails,
                editItems: EditDeleteItems.Owned,
                deleteItems: EditDeleteItems.Owned,
                permissionLevel: PermissionLevel.Author,
                userId: userId
            };
        case PermissionLevel.NoneditingAuthor:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: true,
                canCreateItems: true,
                canCreateSubFolders: false,
                readItems: ReadItems.FullDetails,
                editItems: EditDeleteItems.None,
                deleteItems: EditDeleteItems.Owned,
                permissionLevel: PermissionLevel.NoneditingAuthor,
                userId: userId
            };
        case PermissionLevel.Reviewer:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: true,
                canCreateItems: false,
                canCreateSubFolders: false,
                readItems: ReadItems.FullDetails,
                editItems: EditDeleteItems.None,
                deleteItems: EditDeleteItems.None,
                permissionLevel: PermissionLevel.Reviewer,
                userId: userId
            };
        case PermissionLevel.Contributor:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: true,
                canCreateItems: true,
                canCreateSubFolders: false,
                readItems: ReadItems.None,
                editItems: EditDeleteItems.None,
                deleteItems: EditDeleteItems.None,
                permissionLevel: PermissionLevel.Contributor,
                userId: userId
            };
        default:
            return {
                isSelected: true,
                isFolderContact: false,
                isFolderOwner: false,
                isFolderVisible: false,
                canCreateItems: false,
                canCreateSubFolders: false,
                readItems: ReadItems.None,
                editItems: EditDeleteItems.None,
                deleteItems: EditDeleteItems.None,
                permissionLevel: PermissionLevel.None,
                userId: userId
            };
    }
}

export const getFolders = (state: State) => state.folders;
export const getIsLoading = (state: State) => state.loading;
export const getIsInit = (state: State) => state.init;
export const getIsFolderLoaded = (state: State) => state.folderLoaded;
export const getSelectedFolderId = (state: State) => state.selectedFolderId;

export const getMailBoxes = (state: State) => state.mailBoxes;

export const getFolderPermissions = (state: State) => state.folderPermissions;

export const getSelectedFolder = createSelector(getSelectedFolderId, getFolders, (id, folders) => {
    if (!!id) {
        return folders[id];
    }
    return null;
});

export const getSortedFolderList = createSelector(getFolders, (folders) => {
    const sorted = _.sortBy<FolderItemWrapper>(Object.values(folders).filter((item) => item.visible), [folderCom]);
    return sorted;
});

export const getSortedWelknownFolderList = createSelector(getSortedFolderList,
    (folders: FolderItemWrapper[]) =>
        folders.filter((folder) => folder.data.wellKnownName !== null && folder.owner === 'me'));

export const getInbox = createSelector(getFolders, (folders) =>
    Object.values(folders).find(folder => folder.data.wellKnownName === 'inbox' && folder.owner === 'me'));
export const getDeletedItemsFolder = createSelector(getFolders, (folders) =>
    Object.values(folders).find(folder => folder.data.wellKnownName === 'deleteditems' && folder.owner === 'me'));

export const findFolder = (folderId: string) =>
    createSelector(getFolders,
        (folders) =>
            Object.values(folders).find(
                (folder) => (folder.data.wellKnownName === folderId && folder.owner === 'me') || folder.data.id === folderId
            )
    );
