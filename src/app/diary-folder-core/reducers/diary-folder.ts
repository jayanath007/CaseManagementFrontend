import { createSelector } from '@ngrx/store';
import * as Action from '../actions/core';
import { DiaryFolder, DiaryFolderWrapper, FolderNode, FolderFlatNode } from '../models/interfaces';
import { uuid } from '../../utils/uuid';
import { nodeChildrenAsMap } from '@angular/router/src/utils/tree';

export interface State {
    readonly [token: string]: DiaryFolderState;
}

export interface DiaryFolderState {
    readonly loading: boolean;
    readonly diaryFolder: DiaryFolderWrapper[];
    readonly appId: number;
    readonly isSaving: boolean;
    readonly isSaved: boolean;
    readonly closeType: string;
    readonly isDurty: boolean;


    readonly folderDataSource: FolderNode[];
    readonly folderFlatData: FolderFlatNode[];

}

const initialState: State = {

};

export function reducer(state: State = initialState, action: Action.Any): State {
    const temp = {};
    switch (action.type) {
        case Action.INIT_DIARY_FOLDER:
            temp[action.token] = intitState(action.payload.appId);
            return {
                ...state, ...temp,
            };
        case Action.GET_FOLDERS_SUCCESS:
            temp[action.token] = getFoldersSuccess(action.payload.folders, state[action.token]);
            return {
                ...state, ...temp,
            };
        case Action.ADD_FOLDER:
            temp[action.token] = addFolder({ ...action.payload, value: '-1' }, state[action.token]);
            return {
                ...state, ...temp,
            };
        case Action.DELETE_FOLDER:
            temp[action.token] = deleteFolder(action.payload, state[action.token]);
            return {
                ...state, ...temp,
            };
        case Action.CANCEL_DELETED_FOLDER:
            temp[action.token] = cancelDeletedFolder(action.payload, state[action.token]);
            return {
                ...state, ...temp,
            };
        case Action.CHANGE_IS_DEFAULT:
            temp[action.token] = cangeIsDefault(action.payload.node, action.payload.checked, state[action.token]);
            return {
                ...state, ...temp,
            };
        case Action.CHANGE_FOLDER_NAME:
            temp[action.token] = changeFolderName(action.payload.folder, action.payload.text, state[action.token]);
            return {
                ...state, ...temp,
            };
        case Action.SAVE_TREE_FOLDERS:
            temp[action.token] = saveFolders(state[action.token], action.payload);
            return {
                ...state, ...temp,
            };
        case Action.SAVE_TREE_FOLDERS_SUCCESS:
            temp[action.token] = saveFoldersSuccess(state[action.token], action.payload.response);
            return {
                ...state, ...temp,
            };
        case Action.SAVE_TREE_FOLDERS_FAIL:
            temp[action.token] = saveFoldersFaild(state[action.token]);
            return {
                ...state, ...temp,
            };
        case Action.CHANGE_ROOT_FOLDER:
            temp[action.token] = changeRootFolder(state[action.token], action.payload);
            return {
                ...state, ...temp,
            };

        case Action.ADD_ROOT_FOLDER:
            temp[action.token] = addRootFolder(state[action.token], action.payload);
            return {
                ...state, ...temp,
            };

        case Action.ADD_NEW_ROOT_FOLDER:
            temp[action.token] = addNewRootFolder(state[action.token], action.payload);
            return {
                ...state, ...temp,
            };
        default:
            return state;
    }
}

function intitState(appId) {
    return {
        appId, loading: true, diaryFolder: [], isSaving: false, isSaved: false, closeType: null,
        isDurty: false

    };

}
function getFoldersSuccess(folders: DiaryFolder[], state: DiaryFolderState) {
    return {
        ...state, loading: false,
        //  folderFlatData: folders
        folderFlatData: folders.map((val) => ({ ...val, isdeleted: false, uid: uuid() }))
    };

}
function addFolder(folder: DiaryFolder, state: DiaryFolderState) {
    return {
        ...state, loading: false,
        diaryFolder: state.diaryFolder
            .map(val => ({ ...val, data: { ...val.data, selected: folder.selected ? false : val.data.selected } }))
            .concat([{ isdeleted: false, data: folder, uid: uuid() }])
    };

}
function deleteFolder(change: { node: FolderFlatNode, type: string }, state: DiaryFolderState) {
    //  let folderData:state.folderFlatData;
    let folderData: FolderFlatNode[] = state.folderFlatData ? state.folderFlatData : [];
    if (change.type === 'RESTORE') {
        folderData = state.folderFlatData
            .map(val => ({
                ...val,
                isDeleted: change.node.uid === val.uid ? false : val.isDeleted,
                //  selected: node.folderId === val.folderId ? false : val.selected

            }));

    } else {
        if (change.node.folderId === 0 || change.node.folderId === -1) {
            folderData = state.folderFlatData.filter(val => val.uid !== change.node.uid);
        } else {
            folderData = state.folderFlatData
                .map(val => ({
                    ...val,
                    isDeleted: change.node.uid === val.uid ? true : val.isDeleted,
                    //  selected: node.folderId === val.folderId ? false : val.selected

                }));
        }

    }

    return {
        ...state, loading: false,
        folderFlatData: folderData,
        isDurty: true
    };
}

function cancelDeletedFolder(folder: DiaryFolderWrapper, state: DiaryFolderState) {
    return {
        ...state, loading: false,
        diaryFolder: state.diaryFolder.map(val => ({ ...val, isdeleted: folder.uid === val.uid ? false : val.isdeleted }))
    };

}
function cangeIsDefault(node: FolderFlatNode, checked: boolean, state: DiaryFolderState) {
    return {
        ...state, loading: false,
        isDurty: true,
        folderFlatData: state.folderFlatData
            .map(val => ({
                ...val,
                selected: val.uid === node.uid ? checked : false

            }))
    };

}
function changeFolderName(folder: DiaryFolderWrapper, text: string, state: DiaryFolderState) {
    return {
        ...state, loading: false,
        isDurty: true,
        diaryFolder: state.diaryFolder
            .map(val => ({
                ...val,
                data: {
                    ...val.data,
                    text: val.uid === folder.uid ? text : val.data.text
                }
            }))
    };

}
function saveFolders(state: DiaryFolderState, type: string) {
    return { ...state, isSaving: true, closeType: type };

}
function saveFoldersSuccess(state: DiaryFolderState, savedFolders: FolderFlatNode[]) {

    // const savedFolderswithUid = savedFolders.map((val) => ({ ...val, isdeleted: false, uid: uuid() }));
    return {
        ...state, isSaving: false, isSaved: state.closeType === 'save_close' ? true : false,
        isDurty: false,
        folderFlatData: savedFolders.map((val) => {
            const x = state.folderFlatData.find(i => i.folderId === val.folderId);
            if (x) {
                return { ...val, expanded: x.expanded, uid: x.uid };
            } else {
                return { ...val, expanded: false, uid: uuid() };
            }

        })


        // savedFolders
        //     .map(val => ({
        //         ...val,
        //         isdeleted: false

        //     }))

    };

}
function saveFoldersFaild(state: DiaryFolderState) {
    return { ...state, isSaving: false, isSaved: false, isDurty: false };

}
function changeRootFolder(state: DiaryFolderState, changeValues: { node: FolderFlatNode, value: string, rootType: string }) {
    let changeFolder = state.folderFlatData;
    if (state.folderFlatData) {
        // const changeFolder = state.folderFlatData.find(f => f.folderId === changeValues.node.folderId);
        changeFolder = state.folderFlatData.map(folder => {
            if (folder.uid === changeValues.node.uid) {
                return { ...folder, folderName: changeValues.value };
            } else {
                return folder;
            }
        });


    }
    return {
        ...state,
        folderFlatData: changeFolder,
        isDurty: true
    };

}

function addRootFolder(state: DiaryFolderState, node: FolderFlatNode) {
    let changeFolder = state.folderFlatData ? state.folderFlatData : [];
    changeFolder = state.folderFlatData.map(folder => {
        if (folder.uid === node.uid) {
            return { ...folder, expanded: true, level: 2 };
        } else {
            return folder;
        }
    });

    changeFolder.push({
        parentId: node.folderId,
        position: 0,
        folderId: 0,
        folderName: '',
        children: null,
        expanded: true,
        isDeleted: false,
        uid: uuid()
    });

    // let changeFolder = state.folderFlatData;
    // if (state.folderFlatData) {
    //     // const changeFolder = state.folderFlatData.find(f => f.folderId === changeValues.node.folderId);
    //     changeFolder = state.folderFlatData.map(folder => {
    //         if (folder.folderId === changeValues.node.folderId) {
    //             return { ...folder, folderName: changeValues.value };
    //         } else {
    //             return folder;
    //         }
    //     });


    // }
    return {
        ...state,
        folderFlatData: changeFolder,
        isDurty: true
    };

}

function addNewRootFolder(state: DiaryFolderState, value: string) {
    let changeFolder = state.folderFlatData ? state.folderFlatData : [];
    changeFolder = state.folderFlatData.map(folder => {
        if (folder.folderId === 0) {
            return { ...folder, expanded: false, level: 2 };
        } else {
            return folder;
        }
    });

    changeFolder.push({
        parentId: 0,
        position: 0,
        folderId: -1,
        folderName: value,
        children: null,
        expanded: true,
        isDeleted: false,
        uid: uuid()
    });

    return {
        ...state,
        folderFlatData: changeFolder,
        isDurty: true
    };

}




const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (state) => state[token]);
export const getIsLoading = (token) => createSelector(getViewByToken(token), (view) => view.loading);
export const getFolders = (token) => createSelector(getViewByToken(token), (view) => view.diaryFolder);
export const getIsSaving = (token) => createSelector(getViewByToken(token), (view) => view.isSaving);
export const getIsSaved = (token) => createSelector(getViewByToken(token), (view) => view.isSaved);
export const getfolderDataSource = (token) => createSelector(getViewByToken(token), (view) => view.folderDataSource);
export const getfolderFlatData = (token) => createSelector(getViewByToken(token), (view) => view.folderFlatData);
export const getappIdData = (token) => createSelector(getViewByToken(token), (view) => view.appId);
export const getIsDurty = (token) => createSelector(getViewByToken(token), (view) => view.isDurty);


