import { MessageItemWrapper } from '../../mail-item-core/models/interface';
import { PageEvent } from '@angular/material';
import { FileHistoryRequest, DocumentURLRequest, LoadFileHistoryGridDataByGroupRequest } from '../models/file-history-request';
import { ViewChangeKind, RowItemChangeKind } from '../actions/core';
import { FileHistoryResponse, FileItemWrapper, GroupMode, FileHistoryGroup, Folder } from '../models/interface';
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as DocAction from '../../document-view';
import { ColumnDef } from '../../core/lib/grid-model';
import { clearFilters, applyFieldSort, applyColumnFilter, createDefultColumnDef } from '../../core/lib/grid-helpers';
import { MatterInfo } from '../../core/lib/matter';
import * as Core from '../../core/lib/actions';
import { FieldType } from '../../odata';
import { getFileTypeByFullFileName } from '../../core/utility/DpsUtility';
import { FileManagerType } from '../../document-view';
import { wopiConvertExtensions } from '../../core';


export interface FileHistoryViewState {
    data: FileItemWrapper[];
    total: number;
    loading: boolean;
    groupData: FileHistoryGroup[];
}
export interface FileHistoryGridView { [hash: string]: FileHistoryViewState; }

export interface FileHistoryState {
    fileHistorData: FileHistoryGridView;
    matterInfo: MatterInfo;
    columnDef: ColumnDef[];
    readonly searchText: string;
    readonly isSearchFullText: boolean;
    readonly pageEvent: PageEvent;
    readonly isDocPassword: boolean;
    readonly userPassword: string;
    readonly documentViewOpened: boolean;
    readonly documentViewPopupOpened: boolean;
    readonly loadSignToken: boolean;
    readonly signToken: string;
    readonly xdraftViewSuccess: any;
    readonly groupMode: GroupMode;
    readonly folders: Folder[];
    readonly checkedItems: FileItemWrapper[];
    // readonly groupModeFields: { group1Field?: string, group2Field?: string, };
}
export interface State {
    views: {
        [token: string]: FileHistoryState;
    };
    lastOpenGroupMode: GroupMode;
}

let initialState: State;
export function reducer(state: State = { views: {}, lastOpenGroupMode: GroupMode.Default }, action: Actions.Any | any): State {

    const tmp = {};
    switch (action.type) {

        case Actions.INIT_FILE_HISTORY:
            tmp[action.token] = initView(state, action);
            return { ...state, views: { ...state.views, ...tmp } };


        case Actions.LOAD_FILE_HISTORY_GROUP:
            tmp[action.token] = {
                ...state.views[action.token],
                fileHistorData: { ...state.views[action.token].fileHistorData, loading: true }
            };
            return { ...state };


        case Actions.LOAD_FILE_HISTORY_GROUP_FAIL:
            tmp[action.token] = {
                ...state.views[action.token],
                fileHistorData: { ...state.views[action.token].fileHistorData, loading: false }
            };
            return { ...state };


        case Actions.LOAD_FILE_HISTORY_GROUP_SUCCESS:
            tmp[action.token] = fileHistoryGroupLoadSuccess(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };


        case Actions.EXPAND_FILE_HISTORY_GROUP:
            tmp[action.token] = fileHistorGroupItemsChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };




        case Actions.LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP:

            tmp[action.token] = fileHistorSetLoding(state.views[action.token], true);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_SUCCESS:
            tmp[action.token] = fileHistoryLoadByGroupSuccess(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_FILE_HISTORY_GRID_DATA_BY_GROUP_FAIL:
            tmp[action.token] = fileHistorSetLoding(state.views[action.token], false);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.FILE_HISTORY_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            let lastOpenGroupMode = state.lastOpenGroupMode;

            if (action.payload.kind === ViewChangeKind.GroupModeChange) {
                lastOpenGroupMode = action.payload.value;
            }
            return { ...state, views: { ...state.views, ...tmp }, lastOpenGroupMode: lastOpenGroupMode };

        case Core.MENU_TAB_CLOSE:
            const token = 'InitFileHistory' + action.payload.item.data.matterReferenceNo;
            const newViews = { ...state.views };
            delete newViews[token];
            return { ...state, views: { ...newViews } };

        case Actions.FILE_HISTORY_REFRESH:
            if (state.views[action.token]) {
                tmp[action.token] = Object.freeze({
                    ...state.views[action.token], documentViewOpened: false, fileHistorData: {}, checkedItems: []
                });
            }
            return { ...state, views: { ...state.views, ...tmp } };



        case Actions.LOAD_FILE_HISTORY_GRID_DATA:
            tmp[action.token] = preLoadData(state.views[action.token], action.request);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS:
            tmp[action.token] = fileHistoryLoadSuccess(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_FILE_HISTORY_GRID_DATA_LOAD_FAIL:
            tmp[action.token] = Object.freeze({ ...state.views[action.token], fileHistorData: {} });
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.XDRAFT_LOAD_FILE_HISTORY_GRID_DATA_LOAD_SUCCESS:
            tmp[action.token] = fileHistoryLoadSuccessWithHash(state.views[action.token], action.payload.response,
                action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.FILE_HISTORY_GRID_ROW_CHANGE:
            tmp[action.token] = rowChange(state.views[action.token], action, action.payload.row, action.token);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_DOCUMENT_URL_LOAD:
            tmp[action.token] = fileHistorListItemsDocumentURLLoading(state.views[action.token], action.request.row);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_DOCUMENT_URL_LOAD_SUCCESS:
            tmp[action.token] = documentLoadSuccess(state.views[action.token], action.payload.url, action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_DOCUMENT_URL_LOAD_FAIL:
            tmp[action.token] = documentLoadFaill(state.views[action.token], '', action.payload.request);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.SHOW_DOCUMENT_PASSWORD_FIELD:
            tmp[action.token] = { ...state.views[action.token], ...{ isDocPassword: true } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_EMAIL_ITEM_FROM_DIARY:
            tmp[action.token] = getEmailItem(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS:
            tmp[action.token] = {
                ...state.views[action.token],
                fileHistorData: getEmailItemSuccess(state.views[action.token], action.payload.row, action.payload.emailItem, action.token)
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.DELETE_DIARY_RECORDS_SUCCESS:
            // const stateData = state.views[action.token];
            // let documentViewOpened = stateData.documentViewOpened;
            // const openFile = openedFile(stateData);
            // if (documentViewOpened && stateData.fileHistorData. ) === row) {
            //     documentViewOpened = false;
            // }
            tmp[action.token] = getUndeletedRows(state.views[action.token], action.payload.isMulti);

            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.XDRAFT_ITEM_CHANGE_SUCCESS:
            tmp[action.token] = resetPagination(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_SIGN_TOKEN:
            tmp[action.token] = fileHistorRequestSignetureToken(state.views[action.token], true, false, null);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_SIGN_TOKEN_SUCCESS:
            tmp[action.token] = fileHistorRequestSignetureToken(state.views[action.token], false, true, action.payload.signatureTokenResponce.signatureToken);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_SIGN_TOKEN_FAIL:
            tmp[action.token] = fileHistorRequestSignetureToken(state.views[action.token], false, false, null);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_DOCUMENT_SIGN_AND_SEND:
            tmp[action.token] = signAndSenddocumentLoadSuccess(state.views[action.token], action.payload.url, action.payload.request);
            return { ...state, views: { ...state.views, ...tmp }, };
        case Actions.CLOSE_DOCUMENT_VIEW_POPUP:
            tmp[action.token] = closeDocumentViewPopup(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp }, };
        case Actions.XDRAFT_ITEM:
            tmp[action.token] = { ...state.views[action.token], loading: true };
            return { ...state, views: { ...state.views, ...tmp }, };
        case Actions.XDRAFT_ITEM_SUCCESS:
            tmp[action.token] = setSelectedRowData(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_FOLDER_LIST_SUCCESS:
            tmp[action.token] = setFolderSet(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_FOLDER_LIST_FAIL:
            tmp[action.token] = setFolderListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.MOVE_SELECTED_FOLDER:
            tmp[action.token] = { ...state.views[action.token], ...{ documentViewOpened: false } };
            return { ...state, views: { ...state.views, ...tmp } };

        // global document checkin handleing

        case DocAction.CHECKOUT_DIARY_ENTRY_DOC: {
            const _act = action as DocAction.CheckoutDiaryItemDoc;
            const _state = mutateFileItemWrapper(state, (item) => {
                return item.data.diary_UID === _act.payload.diaryId;
            }, (item) => {
                return { ...item, editingBusy: true };
            });

            return _state;
        }

        case DocAction.FILE_CHECKOUT_FAIL: {
            const _act = action as DocAction.FileCheckoutFailed;
            if (_act.fileMgrType !== FileManagerType.FileWithDiaryEntryManager) {
                return state;
            }

            const req = _act.requestPaylod as DocAction.DiaryEntryFileInfo;
            const _state = mutateFileItemWrapper(state, (item) => {
                return item.data.diary_UID === req.diaryId;
            }, (item) => {
                return { ...item, editingBusy: false };
            });
            return _state;
        }

        case DocAction.DISCARD_CHECKOUT:
        case DocAction.CHECKIN_FILE: {
            const _act = action as DocAction.EditingResultAction;

            if (_act.docCheckin.fileManagerType !== FileManagerType.FileWithDiaryEntryManager) {
                return state;
            }

            const _state = mutateFileItemWrapper(state, (item) => {
                return item.data.checkedOutHashKey === _act.docCheckin.hashKey;
            }, (item) => {
                return { ...item, editingBusy: true };
            });

            return _state;
        }

        case DocAction.DISCARD_CHECKOUT_FAIL:
        case DocAction.CHECKIN_FILE_FAIL: {
            const _act = action as DocAction.EditingResultAction;

            if (_act.docCheckin.fileManagerType !== FileManagerType.FileWithDiaryEntryManager) {
                return state;
            }

            const _state = mutateFileItemWrapper(state, (item) => {
                return item.data.checkedOutHashKey === _act.docCheckin.hashKey;
            }, (item) => {
                return { ...item, editingBusy: false };
            });

            return _state;
        }

        case DocAction.FILE_CHECKOUT_SUCCESS: {
            const _act = action as DocAction.FileCheckoutSuccess;
            if (_act.docCheckin.fileManagerType !== FileManagerType.FileWithDiaryEntryManager) {
                return state;
            }
            const req = _act.requestPaylod as DocAction.DiaryEntryFileInfo;
            const _state = mutateFileItemWrapper(state, (item) => {
                return item.data.diary_UID === req.diaryId;
            }, (item) => {
                return { ...item, editingBusy: false, data: { ...item.data, checkedOutHashKey: _act.docCheckin.hashKey } };
            });

            return _state;
        }

        case DocAction.DISCARD_CHECKOUT_SUCCESS:
        case DocAction.CHECKIN_FILE_SUCCESS:
            {
                const docCheckin = action.docCheckin as DocAction.IDocumentCheckin;
                if (docCheckin.fileManagerType !== FileManagerType.FileWithDiaryEntryManager) {
                    return state;
                }

                const _state = mutateFileItemWrapper(state, (item) => {
                    return !!item.data.checkedOutHashKey && item.data.checkedOutHashKey === docCheckin.hashKey;
                }, (item) => {
                    return {
                        ...item, editingBusy: false,
                        data: { ...item.data, checkedOutByUser: null, checkedOutHashKey: null }
                    }; // clear checkout object
                });

                return _state;
            }
        case Actions.GET_FILE_HISTORY_FULL_TEXT_SEARCH:
            tmp[action.token] = {
                ...state.views[action.token],
                isSearchFullText: action.isSearchFullText
            };
            return { ...state, views: { ...state.views, ...tmp } };
        default:
            { return state; }
    }
}

function getInitState() {
    if (!initialState) {
        initialState = { views: {}, lastOpenGroupMode: GroupMode.Default };
    }
    return initialState;
}


function initView(state: State, action: Actions.InitFileHistory): Partial<FileHistoryState> {

    const viewState: FileHistoryState = state.views[action.token];

    if (!viewState) {

        const columnDef = getColumnDef(state.lastOpenGroupMode);
        return {
            searchText: '',
            isSearchFullText: false,
            fileHistorData: {},
            pageEvent: { pageSize: 50, pageIndex: 0, length: 0 },
            matterInfo: action.payload.matterInfo,
            columnDef: columnDef,
            isDocPassword: false,
            userPassword: '',
            documentViewOpened: false,
            loadSignToken: false,
            signToken: null,
            groupMode: state.lastOpenGroupMode,
            checkedItems: []
        };
    }
    return viewState;
}


function paginatorChange(pagerDef: PageEvent): PageEvent {
    return {
        ...pagerDef,
        pageIndex: pagerDef.pageIndex,
        pageSize: pagerDef.pageSize
    };
}

function resetPagination(state: FileHistoryState) {
    return {
        ...state,
        pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: state.pageEvent.length }),

    };
}
function viewChange(state: FileHistoryState, action: Actions.FileHistoryViewChange): Partial<FileHistoryState> {
    switch (action.payload.kind) {

        case ViewChangeKind.GroupModeChange:
            const columnDef = getColumnDef(action.payload.value);
            return {
                ...state,
                groupMode: action.payload.value,
                columnDef: columnDef,
                documentViewOpened: false,
                // groupModeFields: action.payload.value.groupMode,
            };
        case ViewChangeKind.SearchText:
            return {
                ...state,
                searchText: action.payload.value,
                documentViewOpened: false,
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // fileHistorData: fileHistorData,
            };
        case ViewChangeKind.PageEvent:
            return {
                ...state,
                pageEvent: action.payload.value,
                documentViewOpened: false,
                // fileHistorData: fileHistorData,
            };
        case ViewChangeKind.ApplyColumnFilter:
            return {
                ...state,
                columnDef: applyColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                documentViewOpened: false,
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // fileHistorData: fileHistorData,
            };

        case ViewChangeKind.ClearColumnFilter:
            return {
                ...state,
                columnDef: clearColumnFilter(state.columnDef, action.payload.value as ColumnDef),
                documentViewOpened: false,
                pageEvent: paginatorChange({ pageIndex: 0, pageSize: 50, length: 0 }),
                // fileHistorData: fileHistorData,
            };
        case ViewChangeKind.ToggleFieldSort:
            return {
                ...state,
                columnDef: applyFieldSort(state.columnDef, action.payload.value as ColumnDef),
                documentViewOpened: false,
                // fileHistorData: fileHistorData,
            };
        default: {
            return state;
        }
    }
}

function mutateFileItemWrapper(state: State, predicate: (item: FileItemWrapper) => boolean,
    mutor: (item: FileItemWrapper) => FileItemWrapper): State {

    const handleItems = (items: FileItemWrapper[]) => {
        let isDirty = false;
        const newItems = items.map((item) => {
            if (predicate(item)) {
                isDirty = true;
                return mutor(item);
            }
            return item;
        });
        if (isDirty) {
            return newItems;
        }
        return items;
    };

    function handleFileHistoryViewState(viewState: FileHistoryViewState): FileHistoryViewState {
        const newData = handleItems(viewState.data);
        if (newData !== viewState.data) {
            return { ...viewState, data: newData };
        }
        return viewState;
    }

    const handleFileHistoryState = (historyState: FileHistoryState): FileHistoryState => {
        const newHistoryData = {};
        let isDirty = false;
        Object.keys(historyState.fileHistorData).forEach((cacheKey) => {
            const viewState = historyState.fileHistorData[cacheKey];
            const newState = handleFileHistoryViewState(viewState);
            if (viewState !== newState) {
                newHistoryData[cacheKey] = newState;
                isDirty = true;
            } else {
                newHistoryData[cacheKey] = viewState;
            }
        });

        if (isDirty) {
            return { ...historyState, fileHistorData: newHistoryData };
        }
        return historyState;
    };

    const handleTokenViews = (_state: State): State => {
        const newViews = {};
        let isDirty = false;
        Object.keys(_state.views).forEach((token) => {
            const _view = _state.views[token];
            const newView = handleFileHistoryState(_view);
            if (_view !== newView) {
                isDirty = true;
            }
            newViews[token] = newView;
        });
        if (isDirty) {
            return { ..._state, views: newViews };
        }
        return _state;
    };
    return handleTokenViews(state);
}




function getColumnDef(groupMode) {

    let columnDef = [];

    if (groupMode === GroupMode.Folder) {

        columnDef = [
            createDefultColumnDef('checkBox',
                { label: '', textAlign: 'center', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('action',
                { label: 'Actions', fxFlex: '65px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('dateDone',
                { label: 'Date Done', fxFlex: '115px', filterAnchor: 'start', filterHidden: true, disableShort: true }, FieldType.Date),
            createDefultColumnDef('folderName', {
                label: 'Folder', fxFlex: '10', filterAnchor: 'start', filterHidden: true,
                hidden: true
            }),
            createDefultColumnDef('type',
                { label: 'Type', fxFlex: '65px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
            createDefultColumnDef('by', { label: 'By', fxFlex: '54px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('note', { label: 'Note', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('from',
                { label: 'From', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('to', { label: 'To', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),

        ];

    } else if (groupMode === GroupMode.Date) {

        columnDef = [
            createDefultColumnDef('checkBox',
                { label: '', textAlign: 'center', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('action',
                { label: 'Actions', fxFlex: '65px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('dateDone',
                {
                    label: 'Date Done', fxFlex: '115px', filterAnchor: 'start', filterHidden: true,
                }, FieldType.Date),
            createDefultColumnDef('folderName', {
                label: 'Folder', fxFlex: '10', filterAnchor: 'start', filterHidden: true
            }),
            createDefultColumnDef('type',
                { label: 'Type', fxFlex: '65px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
            createDefultColumnDef('by', { label: 'By', fxFlex: '54px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('note', { label: 'Note', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('from',
                { label: 'From', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('to', { label: 'To', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        ];

    } else if (groupMode === GroupMode.Note || groupMode === GroupMode.Type) {

        columnDef = [
            createDefultColumnDef('checkBox',
                { label: '', textAlign: 'center', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('action',
                { label: 'Actions', fxFlex: '65px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('dateDone',
                { label: 'Date Done', fxFlex: '115px', filterAnchor: 'start' }, FieldType.Date),
            createDefultColumnDef('folderName', {
                label: 'Folder', fxFlex: '10', filterAnchor: 'start', filterHidden: true
            }),
            createDefultColumnDef('type',
                { label: 'Type', fxFlex: '65px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
            createDefultColumnDef('by', { label: 'By', fxFlex: '54px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('note', { label: 'Note', fxFlex: '', filterAnchor: 'end', hidden: true }),
            createDefultColumnDef('from',
                { label: 'From', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('to', { label: 'To', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),

        ];

    } else if (groupMode === GroupMode.FolderDate || groupMode === GroupMode.DateFolder) {
        columnDef = [
            createDefultColumnDef('checkBox',
                { label: '', textAlign: 'center', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('action',
                { label: 'Actions', fxFlex: '65px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('dateDone',
                {
                    label: 'Date Done', fxFlex: '115px', filterHidden: true, filterAnchor: 'start',
                }, FieldType.Date),
            createDefultColumnDef('folderName', {
                label: 'Folder', fxFlex: '10', filterAnchor: 'start', filterHidden: true,
                hidden: true
            }),
            createDefultColumnDef('type',
                { label: 'Type', fxFlex: '65px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
            createDefultColumnDef('by', { label: 'By', fxFlex: '54px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('note', { label: 'Note', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('from',
                { label: 'From', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('to', { label: 'To', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        ];
    } else {

        columnDef = [
            createDefultColumnDef('checkBox',
                { label: '', textAlign: 'center', fxFlex: '35px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('action',
                { label: 'Actions', fxFlex: '65px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('dateDone',
                { label: 'Date Done', fxFlex: '115px', filterAnchor: 'start' }, FieldType.Date),
            createDefultColumnDef('folderName', {
                label: 'Folder', fxFlex: '10', filterAnchor: 'start', filterHidden: true
            }),
            createDefultColumnDef('type',
                { label: 'Type', fxFlex: '65px', filterAnchor: 'start' }),
            createDefultColumnDef('by', { label: 'By', fxFlex: '54px', filterAnchor: 'start' }),
            createDefultColumnDef('note', { label: 'Note', fxFlex: '', filterAnchor: 'end' }),
            createDefultColumnDef('from',
                { label: 'From', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),
            createDefultColumnDef('to', { label: 'To', fxFlex: '14', filterAnchor: 'end', filterHidden: true, disableShort: true }),

        ];
    }

    return columnDef;
}



function clearColumnFilter(current: ColumnDef[], changedDef: ColumnDef) {
    return current.map((def) => {
        if (def.fieldName === changedDef.fieldName) {
            return clearFilters(def);
        }
        return def;
    });
}


function openedFile(state: FileHistoryState) {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    if (filesData) {
        const expandRow = filesData.find(row => row.isExpand);
        return expandRow;
    } return null;
}


function rowChange(state: FileHistoryState, action: Actions.FileHistoryGridRowChange,
    row: FileItemWrapper, token: string): Partial<FileHistoryState> {

    switch (action.payload.kind) {
        case RowItemChangeKind.IsExpand:

            const fileHistorData = fileHistorListItemsExpand(state, action.payload.value, row);
            return {
                ...state,
                fileHistorData: fileHistorData,
                documentViewOpened: true,
                checkedItems: !state.checkedItems.find(val => val.data.diary_UID === row.data.diary_UID) ? [row] : state.checkedItems
            };
        case RowItemChangeKind.DeleteRow:

            let documentViewOpened = state.documentViewOpened;
            if (documentViewOpened && openedFile(state) === row) {
                documentViewOpened = false;
            }
            const fileHistorDataAfterDelete = deleteFileHistorListItem(state, row);


            return {
                ...state,
                documentViewOpened: documentViewOpened,
                fileHistorData: fileHistorDataAfterDelete
            };
        case RowItemChangeKind.IsChecked:
            return {
                ...state,
                checkedItems: changeCheckStateFileHistorListItem(state.checkedItems, row)
            };
        case RowItemChangeKind.SetPassword:
            const fileHistorDataSetPassword = fileHistorListSetPasswordChange(state, action.payload.value, row, token);
            return {
                ...state,
                fileHistorData: fileHistorDataSetPassword,
                documentViewOpened: true,
            };
        case RowItemChangeKind.IsCollapse:
            const fileHistorDataItemsCollapse = fileHistorListItemsCollapse(state, action.payload.value, row, token);
            return {
                ...state,
                fileHistorData: fileHistorDataItemsCollapse,
                documentViewOpened: false,
            };
        case RowItemChangeKind.DocumentEditUpdate:
            const fileHistorDataDocumentEditUpdate = fileHistorListItemDocumentEditupdate(state, action.payload.value, row, token);
            return {
                ...state,
                fileHistorData: fileHistorDataDocumentEditUpdate
            };
        case RowItemChangeKind.SignDoc:
            const fileHistorDataSignAndSent = fileHistoryRequestSignAndSent(state, action.payload.value, row, token);
            return {
                ...state,
                fileHistorData: fileHistorDataSignAndSent,
            };
        default: {
            return state;
        }
    }
}

function fileHistorRequestSignetureToken(state: FileHistoryState, isLoading: boolean, viewOpened: boolean,
    token: string): Partial<FileHistoryState> {

    return {
        ...state, loadSignToken: isLoading, signToken: token, documentViewOpened: false, documentViewPopupOpened: viewOpened
    };
}

function fileHistorListItemsDocumentURLLoading(state: FileHistoryState, row: FileItemWrapper): Partial<FileHistoryState> {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === row.data && !row.isExpand) {
            return Object.freeze({ ...file, isExpand: true, documentUrl: '', documentUrlIsLoading: true });
        } else {
            return file;
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state, fileHistorData: tmp };
}


function fileHistorListSetPasswordChange(state: FileHistoryState,
    password: string, row: FileItemWrapper, token: string): FileHistoryGridView {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === row.data) {
            return Object.freeze({ ...file, isExpand: true, password: password });
        } else {
            return Object.freeze({ ...file, isExpand: false });
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state.fileHistorData, ...tmp };
}


function getFileType(fileItem: FileItemWrapper): string {
    if (fileItem && fileItem.data && fileItem.data.letter_name) {
        return getFileTypeByFullFileName(fileItem.data.letter_name);
        // if (fileItem.data.letter_name.split('.')[1].toLocaleLowerCase()) {
        //     return fileItem.data.letter_name.split('.')[1].toLocaleLowerCase();
        // }
    }
    return '';
}

function fileHistorListItemDocumentEditupdate(state: FileHistoryState, newValue: number, row: FileItemWrapper, token: string)
    : FileHistoryGridView {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {

        const extention = getFileType(file);
        const newLatterName = (extention === 'doc') ? file.data.letter_name.split('.')[0] + '.' + 'docx'
            : (extention === 'xls') ? file.data.letter_name.split('.')[0] + '.' + 'xlsx'
                : (extention === 'ppt') ? file.data.letter_name.split('.')[0] + '.' + 'pptx'
                    : file.data.letter_name;
        const newData = Object.freeze({ ...row.data, letter_name: newLatterName });

        if (file.data === row.data && extention && wopiConvertExtensions.filter(p => p === extention).length > 0) {
            return Object.freeze({ ...file, data: newData });
        } else {
            return file;
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state.fileHistorData, ...tmp };
}



function fileHistorListItemsCollapse(state: FileHistoryState, newValue: number, row: FileItemWrapper, token: string)
    : FileHistoryGridView {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === row.data) {
            return Object.freeze({ ...file, isExpand: false });
        } else {
            return Object.freeze({ ...file, isExpand: false });
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state.fileHistorData, ...tmp };
}



function fileHistoryGroupLoadSuccess(state: FileHistoryState,
    action: Actions.LoadFileHistoryGroupSuccess): Partial<FileHistoryState> {

    const hash = createViewhash(state);
    const tmp = {};

    const groupData = action.groups.map((group1) => {
        const group1Hash = group1.selectorField + '-' + group1.filterValue;
        let isLefNode = false;
        //    const  itemCount =  { currentPage: 0, itemPerPage: 2 , total: 0 };

        let items = [];
        if (group1.items) {
            items = group1.items.map((group2) => {

                const group2Hash = group1.selectorField + '-' + group1.filterValue + '/' + group2.selectorField + '-' + group2.filterValue;

                return {
                    data: group2, items: null, groupHash: group2Hash, isLefNode: true,
                    isExpand: false, groupMode: state.groupMode,
                    currentItems: 0,
                    groupIds: {
                        group1: group1.filterValue, group1Value: group1.value,
                        group2: group2.filterValue, group2Value: group2.value,
                        groupMode: state.groupMode
                    }
                };
            });
        }
        if (state.groupMode === GroupMode.Folder
            || state.groupMode === GroupMode.Date
            || state.groupMode === GroupMode.Note || state.groupMode === GroupMode.Type) {
            isLefNode = true;

        }
        return {
            data: group1, items: items, groupHash: group1Hash, isExpand: false, isLefNode: isLefNode, groupMode: state.groupMode,
            groupIds: {
                group1: group1.filterValue, group1Value: group1.value, group2: '', group2Value: '', groupMode: state.groupMode,
                currentItems: 0,
            }
        };
    });

    tmp[hash] = {
        ...state.fileHistorData[hash],
        loading: false,
        groupData: groupData,
    };
    return { ...state, fileHistorData: tmp };
}


function fileHistorGroupItemsChange(state: FileHistoryState, action: Actions.ExpandFileHistoryGroup)
    : Partial<FileHistoryState> {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].groupData;
    const tmp = {};
    const groupData = filesData.map((group1) => {

        if (group1.groupHash === action.payload.row.groupHash) {
            return { ...group1, isExpand: !group1.isExpand };
        } else {
            const group2Data = group1.items.map((group2) => {

                if (group2.groupHash === action.payload.row.groupHash) {

                    return { ...group2, isExpand: !group2.isExpand };

                } else {
                    return { ...group2 };
                }

            });
            return Object.freeze({ ...group1, items: group2Data });
        }
    });


    tmp[hash] = {
        ...state.fileHistorData[hash],
        loading: false,
        groupData: groupData,
    };
    return { ...state, fileHistorData: tmp };
}





function fileHistoGroupItemrUpdateDelete(state: FileHistoryState, row: FileItemWrapper)
    : FileHistoryGroup[] {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].groupData;
    const tmp = {};
    const groupData = filesData.map((group1) => {

        const group2Data = group1.items.map((group2) => {

            if (group2.groupIds.group2 === row.groupRow.groupIds.group2) {

                return { ...group2, data: { ...group2.data, count: group2.data.count - 1 } };

            } else {
                return { ...group2 };
            }

        });

        if (group1.groupIds.group1 === row.groupRow.groupIds.group1) {

            return { ...group1, data: { ...group1.data, count: group1.data.count - 1 }, items: group2Data };

        } else {

            return Object.freeze({ ...group1 });
        }
    });

    return groupData;

}




function fileHistoGroupItemrUpdateDeleteMultipale(groupData: FileHistoryGroup[], deletedRows: FileItemWrapper[])
    : FileHistoryGroup[] {

    const newGroupData = groupData.map((group1) => {

        const group2Data = group1.items.map((group2) => {

            const length = deletedRows.filter(item => item.groupRow.groupHash === group2.groupHash).length;

            return { ...group2, data: { ...group2.data, count: group2.data.count - length } };

        });

        const count = deletedRows.filter(item => item.groupRow.groupIds.group1 === group1.groupIds.group1).length;
        return { ...group1, data: { ...group1.data, count: group1.data.count - count }, items: group2Data };

    });

    return newGroupData;
}




function fileHistoGroupItemrUpdateAdd(state: FileHistoryState, row: FileItemWrapper)
    : FileHistoryGroup[] {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].groupData;
    const tmp = {};
    const groupData = filesData.map((group1) => {

        const group2Data = group1.items.map((group2) => {

            if (group2.groupIds.group2 === row.groupRow.groupIds.group2) {

                return { ...group2, data: { ...group2.data, count: group2.data.count + 1 } };

            } else {
                return { ...group2 };
            }

        });

        if (group1.groupIds.group1 === row.groupRow.groupIds.group1) {

            return { ...group1, data: { ...group1.data, count: group1.data.count + 1 }, items: group2Data };

        } else {

            return Object.freeze({ ...group1 });
        }
    });

    return groupData;

}






function fileHistorSetLoding(state: FileHistoryState, loading: boolean)
    : Partial<FileHistoryState> {
    const hash = createViewhash(state);
    const tmp = {};
    tmp[hash] = {
        ...state.fileHistorData[hash],
        loading: loading,
    };
    return { ...state, fileHistorData: tmp };
}






function fileHistoryRequestSignAndSent(state: FileHistoryState, newValue: number, row: FileItemWrapper, token: string)
    : FileHistoryGridView {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === row.data) {
            return Object.freeze({ ...file, isExpand: false, documentUrlIsLoading: true });
        } else {
            return Object.freeze({ ...file, isExpand: false, documentUrlIsLoading: false });
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state.fileHistorData, ...tmp };
}




function changeCheckStateFileHistorListItem(checkedItems: FileItemWrapper[], row: FileItemWrapper): FileItemWrapper[] {
    if (checkedItems.find(val => val.data.diary_UID === row.data.diary_UID)) {
        return checkedItems.filter(val => val.data.diary_UID !== row.data.diary_UID);
    }
    return checkedItems.concat([row]);
}

function deleteFileHistorListItem(state: FileHistoryState, row: FileItemWrapper)
    : FileHistoryGridView {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = filesData.filter(item => item.data !== row.data);
    const groupData = fileHistoGroupItemrUpdateDelete(state, row);

    tmp[hash] = {
        ...state.fileHistorData[hash],
        data: newfilesData,
        total: state.fileHistorData[hash].total - 1,
        groupData: groupData,
        loading: false
    };
    return { ...state.fileHistorData, ...tmp };
}

function fileHistorListItemsExpand(state: FileHistoryState, value: any, row: FileItemWrapper)
    : FileHistoryGridView {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (row && file.data === row.data && !row.isExpand) {
            return Object.freeze({ ...file, isExpand: true, signAndSendUrl: null });
        } else {
            return Object.freeze({ ...file, isExpand: false, signAndSendUrl: null });
        }
    }));
    let groupData = state.fileHistorData[hash].groupData;
    if (value === 'IsXdrafChange') {
        groupData = fileHistoGroupItemrUpdateAdd(state, row);
    }

    tmp[hash] = {
        ...state.fileHistorData[hash],
        groupData: groupData,
        data: newfilesData,
        total: state.fileHistorData[hash].total,
        loading: false
    };
    return { ...state.fileHistorData, ...tmp };
}




function closeDocumentViewPopup(state: FileHistoryState): FileHistoryState {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((row) => {
        return Object.freeze({
            ...row,
            isExpand: false,
            signAndSendUrl: null
        });
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state, fileHistorData: tmp, documentViewPopupOpened: false, };
}

function getEmailItem(state: FileHistoryState): Partial<FileHistoryState> {
    return Object.freeze({
        ...state
    });
}

function getEmailItemSuccess(state: FileHistoryState, row: FileItemWrapper, emailItem: boolean, token: string)
    : FileHistoryGridView {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === row.data) {
            return Object.freeze({ ...file, isExpand: true, emailItem: emailItem, documentUrlIsLoading: false });
        } else {
            return file;
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state.fileHistorData, ...tmp };
}


function setSelectedRowData(state: FileHistoryState, selectData) {

    return {
        ...state,
        xdraftViewSuccess: selectData,
        loading: false

    };
}

function setFolderSet(state: FileHistoryState, responce) {

    return {
        ...state,
        folders: responce.folderList,
        loading: false

    };
}

function setFolderListFail(state: FileHistoryState) {

    return {
        ...state,

        loading: false

    };
}

function getUndeletedRows(state: FileHistoryState, isMulti: boolean): FileHistoryState {
    if (isMulti) {
        return { ...state, checkedItems: [] };
    }

    return { ...state };
}


function documentLoadSuccess(state: FileHistoryState, url: string,
    request: DocumentURLRequest): Partial<FileHistoryState> {

    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === request.row.data) {
            return Object.freeze({
                ...file, isExpand: true, documentUrl: url,
                documentUrlLoadSuccess: true,
                documentUrlIsLoading: false
            });
        } else {
            return file;
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state, fileHistorData: tmp };
}

function signAndSenddocumentLoadSuccess(state: FileHistoryState, url: string,
    request: DocumentURLRequest): Partial<FileHistoryState> {

    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((row) => {
        if (row.data.diary_UID === request.row.data.diary_UID) {
            return Object.freeze({
                ...row,
                isExpand: true,
                documentUrlIsLoading: false,
                signAndSendUrl: url
            });
        } else {
            return row;
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state, fileHistorData: tmp, loadSignToken: false };
}

function documentLoadFaill(state: FileHistoryState, url: string,
    request: DocumentURLRequest): Partial<FileHistoryState> {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].data;
    const tmp = {};
    const newfilesData = Object.freeze(filesData.map((file) => {
        if (file.data === request.row.data) {
            return Object.freeze({
                ...file, documentUrl: url,
                documentUrlIsLoading: false,
                documentUrlLoadSuccess: !request.row.data.letter_name,
            });
        } else {
            return file;
        }
    }));
    tmp[hash] = { ...state.fileHistorData[hash], data: newfilesData, total: state.fileHistorData[hash].total, loading: false };
    return { ...state, fileHistorData: tmp };
}

function fileHistoryLoadSuccess(state: FileHistoryState, response: FileHistoryResponse, request: FileHistoryRequest)
    : Partial<FileHistoryState> {
    const newFileHistoryListData = [{ request, response }].reduce((accu, item) => {
        const data: FileItemWrapper[] = item.response.data.data.map((_item) => ({
            data: _item, isExpand: false,
            emailItem: null,
            documentUrl: null,
            documentUrlIsLoading: null,
            documentUrlLoadSuccess: null,
            password: ''
        }));
        accu[item.request.hash] = {
            ...state.fileHistorData[item.request.hash],
            data: data, loading: false, total: item.response.data.total
        };
        return accu;
    }, { ...state.fileHistorData });
    return { ...state, fileHistorData: newFileHistoryListData, };
}

function fileHistoryLoadByGroupSuccess(state: FileHistoryState,
    response: FileHistoryResponse,
    request: LoadFileHistoryGridDataByGroupRequest): Partial<FileHistoryState> {

    const newData: FileItemWrapper[] = response.data.data.map((_item) => {
        return {
            data: _item, isExpand: false,
            emailItem: null,
            documentUrl: null,
            documentUrlIsLoading: null,
            documentUrlLoadSuccess: null,
            password: '',
            groupHash: request.row.groupHash,
            groupRow: request.row,
        };
    });

    const groupData = state.fileHistorData[request.hash].groupData;

    const newGroupData = groupData.map((group1) => {

        if (group1.groupHash === request.row.groupHash) {
            return { ...group1, currentItems: request.dataSourceInfo.skip + 50, totalItems: response.data.total };
        } else {
            const group2Data = group1.items.map((group2) => {

                if (group2.groupHash === request.row.groupHash) {

                    return { ...group2, currentItems: request.dataSourceInfo.skip + 50, totalItems: response.data.total };

                } else {
                    return { ...group2 };
                }

            });
            return Object.freeze({ ...group1, items: group2Data });
        }
    });

    const temp = {};
    temp[request.hash] = {
        ...state.fileHistorData[request.hash]
        , data: state.fileHistorData[request.hash].data.concat(newData),
        loading: false,
        total: response.data.total,
        groupData: newGroupData,
    };

    return { ...state, fileHistorData: temp };
}



function fileHistoryLoadSuccessWithHash(state: FileHistoryState,
    response: FileHistoryResponse,
    request: FileHistoryRequest): Partial<FileHistoryState> {

    const groupHash = (request.row && request.row.groupHash) ? request.row.groupHash : '';
    const groupRow = (request.row && request.row) ? request.row : null;

    const newData: FileItemWrapper[] = response.data.data.map((_item) => {
        return {
            data: _item, isExpand: false,
            emailItem: null,
            documentUrl: null,
            documentUrlIsLoading: null,
            documentUrlLoadSuccess: null,
            password: '',
            groupHash: groupHash,
            groupRow: groupRow,
        };
    });

    const temp = {};
    temp[request.hash] = {
        ...state.fileHistorData[request.hash]
        , data: newData, loading: false, total: response.data.total,
    };

    return { ...state, fileHistorData: temp };
}






function preLoadData(state: FileHistoryState, request: FileHistoryRequest) {
    const newFileHistoryListData = [{ request }].reduce((accu, item) => {
        accu[item.request.hash] = { groupData: [], data: [], total: null, loading: true };
        return accu;
    }, { ...state.fileHistorData });
    return { ...state, fileHistorData: newFileHistoryListData, };
}

function createViewhash(state: FileHistoryState) {

    const filter = (state && state.columnDef) ? state.columnDef.map((data) => JSON.stringify((data.filter ? data.filter : null))) : '';
    const sort = (state && state.columnDef) ? state.columnDef.map((item) => JSON.stringify((item.sort ? item.sort.dir : null))) : '';

    const hash = state ? state.searchText + '/' + state.isSearchFullText + '/'
        + ((state.pageEvent) ? state.pageEvent.pageSize : '') + '/'
        + ((state.pageEvent) ? state.pageEvent.pageIndex : '') + '/'
        + ((state.matterInfo) ? state.matterInfo.AppCode : '') + '/'
        + ((state.matterInfo) ? state.matterInfo.AppId : '') + '/'
        + ((state.matterInfo) ? state.matterInfo.BranchId : '') + '/'
        + ((state.matterInfo) ? state.matterInfo.MatterReferenceNo : '') + '/'
        + ((state.matterInfo) ? state.matterInfo.FileId : '') + '/'
        + ((state.groupMode) ? state.groupMode : '') + '/'

        + JSON.stringify(filter) + '/'
        + JSON.stringify(sort) : null;
    return hash;
}

export const getViews = (state: State) => {
    return state.views;
};

export const getViewsTokensByAppId = (appId: number) => createSelector(getViews, (views) => {
    return Object.keys(views)
        .filter((token) => views[token].matterInfo.AppId === appId)
        .map((token) => {
            return token;
        });
});

export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});
export const getFileHistoryListByToken = (token) => createSelector(getViewByToken(token),
    (fileState) => {
        return fileState.fileHistorData;
    });




export const getCurrentHashByToken = (token) => createSelector(getViewByToken(token), createViewhash);


export const getColumnDefByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.checkedItems && state.checkedItems.length > 0 ?
            state.columnDef.map(val =>
                val.fieldName === 'checkBox' ? { ...val, extras: { ...val.extras, label: state.checkedItems.length } } : val
            ) : state.columnDef;
    }
});
export const getSearchTextByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.searchText;
    }
});
// state.searchText);
export const getDocumentViewOpenedByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.documentViewOpened;
        }
    });
export const getDocumentViewPopupOpenedByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.documentViewPopupOpened : null);
export const getFileHistoryPageEventByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.pageEvent;
        }
    });
// (state) => state.pageEvent);
export const getIsDocPasswordByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.isDocPassword;
        }
    });
// (state) => state.isDocPassword);
export const getUserPasswordForDoc = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.userPassword;
        }
    });

export const getFileHistoryGridDataByToken = (token) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), (state, hash) => {
        if (state) {
            return state.fileHistorData[hash];
        }
    });
export const getIsDataLoadedByToken = (token) => createSelector(getCurrentHashByToken(token),
    getFileHistoryListByToken(token), (hash, gridViews) => {
        return gridViews && gridViews[hash] !== undefined;
    }
);
export const getSelectedAttachmentsByToken = (token) => createSelector(getViewByToken(token), view => view ? view.checkedItems : []);

export const getSignandSendIsLoadingByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.loadSignToken;
    }
});

export const getSignToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.signToken;
    }
});
export const getXdraftViewSuccessByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.xdraftViewSuccess;
        }
    });


export const getGroupModeByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.groupMode;
        }
    });

export const getFileHistoryGroupDataByRow = (token, row) => createSelector(getViewByToken(token),
    getCurrentHashByToken(token), (state, hash) => {
        const groupHash = row.groupHash;
        if (state.fileHistorData[hash].data.filter(p => p.groupHash === groupHash).length > 0) {
            return state.fileHistorData[hash].data.filter(p => p.groupHash === groupHash);
        }
        return [];
    });

export const getFolderListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state) {
            return state.folders;
        }
    });
export const getIsSearchFullTextByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return state.isSearchFullText;
    }
});


