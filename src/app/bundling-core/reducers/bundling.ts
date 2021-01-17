
import { AddItem } from './../actions/core';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { ColumnDef, GridGroupData } from '../../core/lib/grid-model';
import {
    FileItemWrapper, GridDataObject, FileHistory, GroupMode, BundleTreeItem,
    BundlingHistoryGrid, BundlingDates, BundleItemsViewModel, FromToDateObject, PreserveCheckboxProperty
} from '../models/interface';
import { ViewKind, ValidationMessage, ItemRequest } from '../models/enum';
import { FileHistoryGroup } from '../../file-history-core/models/interface';
import { MatterInfo, MatterSearchGridData } from '../../core/lib/matter';
import { PageEvent } from '@angular/material';
import { FileHistoryFilterModel } from '../models/bundling-request';
import { applyGroupFilter, clearFilters } from '../../core/lib/grid-helpers';
import { MessageItemWrapper } from '../../mail-item-core';
import { Operator, FieldType } from '../../odata';
import { DatePipe } from '@angular/common';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';
import { dpsNewDate } from '../../utils/javascriptDate';
const datePipe = new DatePipe('en-US');

export interface State {
    readonly [token: string]: BundlingState;
}

export interface FileHistoryViewState {
    data: FileItemWrapper[];
    total: number;
    loading: boolean;
    groupData: FileHistoryGroup[];
}
export interface FileHistoryGridView { [hash: string]: FileHistoryViewState; }

export interface BundlingState {
    fileHistorData: FileHistoryGridView;
    readonly gridData: FileHistory[];
    readonly gridGroupData: GridGroupData[];
    readonly selectedInfo: FileHistoryFilterModel;
    readonly totalItem: number;
    readonly expandRow: FileHistory;
    readonly selectedGroup: GridGroupData;
    readonly selectedGroupHash: string[];
    readonly selectedItems: FileHistory[];
    readonly loadDocURL: boolean;
    readonly documentViewOpened: boolean;
    readonly removedDiaryItems: FileHistory[];

    matterInfo: MatterSearchGridData;
    columnDef: ColumnDef[];
    loading: boolean;
    readonly searchText: string;
    readonly pageEvent: PageEvent;
    readonly groupMode: GroupMode;
    readonly BundlingComponentTreeData: any;
    readonly bundlingFolderGroupData: any;
    readonly validationInPrograss: boolean;
    readonly validationMessage: ValidationMessage;
    readonly uploadInPrograss: boolean;
    readonly bundlingHistoryGrid: BundlingHistoryGrid;
    readonly bundleID: number;
    readonly fromToDateObject: FromToDateObject;
    readonly preserveExistingPage: PreserveCheckboxProperty;
    readonly bundleHeaderData: PDFBundleHeaderViewModel;
    readonly coreBundlePopupHeaderData: PDFBundleHeaderViewModel;
}

const initialState: State = {};

export function reducer(state: State = initialState, action: Actions.Any): State {
    const tmp = {};
    switch (action.type) {
        case Actions.INIT_BUNDLING:
            tmp[action.token] = initView(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.DROP_BUNDLE_FOLDER_DATA:
            tmp[action.token] = bundleFolderItem(state[action.token], action.payload.row);
            return { ...state, ...tmp };
        case Actions.LOAD_BUNDLING_GRID_DATA:
            tmp[action.token] = loadGridData(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_BUNDLING_GRID_DATA_SUCCESS:
            tmp[action.token] = loadGridDataSuccess(state[action.token], action, action.payload.pageData, action.payload.moveItemTOProfile);
            return { ...state, ...tmp };
        case Actions.LOAD_BUNDLING_GRID_DATA_FAIL:
            tmp[action.token] = loadGridDataFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_BUNDLING_FILE_HISTORY_GROUP:
            tmp[action.token] = {
                ...state[action.token],
                ...{ fileHistorData: { ...state[action.token].fileHistorData, loading: true } }
            };
            return { ...state };
        case Actions.LOAD_BUNDLING_FILE_HISTORY_GROUP_FAIL:
            tmp[action.token] = {
                ...state[action.token],
                ...{ fileHistorData: { ...state[action.token].fileHistorData, loading: false } }
            };
            return { ...state };
        case Actions.EXPAND_FILE_HISTORY_FOLDER:
            tmp[action.token] = fileHistorFolderItemsChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GROUP_BUNDLING_DATA_REQUEST:
            tmp[action.token] = requestGroupData(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.SELECTED_FILE_HISTORY_ITEM_UPDATE:
            tmp[action.token] = updateSelectItem(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.ADD_ITEM:
            tmp[action.token] = removeItemFilehistory(state[action.token], action.data);
            return { ...state, ...tmp };
        case Actions.ADD_ITEMS_WITH_FOLDER:
            tmp[action.token] = removeItemFilehistory(state[action.token], action.data);
            return { ...state, ...tmp };
        case Actions.GRID_ROW_EXPAND:
            tmp[action.token] = gridRowExpand(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GET_DOCUMENT_URL:
            tmp[action.token] = getDocURL(state[action.token], action.payload.gridRow);
            return { ...state, ...tmp };
        case Actions.GET_DOCUMENT_URL_SUCCESS:
            tmp[action.token] = getDocURLSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.GET_DOCUMENT_URL_FAIL:
            tmp[action.token] = getDocURLFail(state[action.token]);
            return { ...state, ...tmp };
        case Actions.LOAD_EMAIL_ITEM_FROM_DIARY_SUCCESS:
            tmp[action.token] = getEmailItemSuccess(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.CLOSE_VIEWER:
            tmp[action.token] = closeViever(state[action.token]);
            return { ...state, ...tmp };
        case Actions.REMOVE_ITEM:
            tmp[action.token] = addItemToFilehistory(state[action.token], action.item);
            return { ...state, ...tmp };
        case Actions.BUNDLING_GRID_VIEW_CHANGE:
            tmp[action.token] = historyGridFilterChange(state[action.token], action);
            return { ...state, ...tmp };
        case Actions.VALIDATE_DROPPED_ITEMS:
            tmp[action.token] = {
                ...state[action.token],
                validationInPrograss: true,
                validationMessage: ValidationMessage.DragDropMsg
            };
            return { ...state, ...tmp };
        case Actions.VALIDATE_DROPPED_ITEMS_SUCCESS:
            tmp[action.token] = {
                ...state[action.token],
                validationInPrograss: false,
                validationMessage: ''
            };
            return { ...state, ...tmp };
        case Actions.VALIDATE_DROPPED_ITEMS_FAIL:
            tmp[action.token] = {
                ...state[action.token],
                validationInPrograss: false,
                validationMessage: ''
            };
            return { ...state, ...tmp };
        case Actions.BUNDLING_DATA_SUBMIT_SAVE:
            tmp[action.token] = {
                ...state[action.token],
                validationInPrograss: true,
                validationMessage: ValidationMessage.SaveMsg
            };
            return { ...state, ...tmp };
        case (Actions.BUNDLING_DATA_SUBMIT_SAVE_SUCCESS):
            tmp[action.token] = updateBundleID(state[action.token], action.payload.newTreeItemList);
            return { ...state, ...tmp };
        case Actions.BUNDLING_DATA_SUBMIT_SAVE_FAIL:
            tmp[action.token] = {
                ...state[action.token],
                validationInPrograss: false,
                validationMessage: ''
            };
            return { ...state, ...tmp };
        case Actions.LOAD_SAVE_BUNDLE_DATA:
            tmp[action.token] = {
                ...state[action.token],
                validationInPrograss: true,
                validationMessage: ValidationMessage.LoadingMsg
            };
            return { ...state, ...tmp };
        case Actions.LOAD_SAVE_BUNDLE_DATA_SUCCESS:
            tmp[action.token] = setBundleIDAndSaveList(state[action.token],
                action.payload.itemListList, action.payload.selectedRow, action.payload.coreHeader);
            return { ...state, ...tmp };
        case Actions.LOAD_SAVE_BUNDLE_DATA_FAIL:
            tmp[action.token] = {
                ...state[action.token],
                validationInPrograss: false,
                validationMessage: ''
            };
            return { ...state, ...tmp };
        case Actions.UPLOAD_COVER_PAGE:
            tmp[action.token] = {
                ...state[action.token],
                uploadInPrograss: true,
                validationMessage: ValidationMessage.UploadMsg
            };
            return { ...state, ...tmp };
        case Actions.UPLOAD_COVER_PAGE_SUCCESS:
            tmp[action.token] = {
                ...state[action.token],
                uploadInPrograss: false,
                validationMessage: '',
                bundleHeaderData: {
                    ...state[action.token].bundleHeaderData,
                    pbH_OptionsFrontPageFilePath: action.path
                }
            };
            return { ...state, ...tmp };
        case Actions.UPLOAD_COVER_PAGE_FAIL:
            tmp[action.token] = {
                ...state[action.token],
                validationInPrograss: false,
                validationMessage: ''
            };
            return { ...state, ...tmp };
        case Actions.CHANGE_SELECTED_GROUP:
            tmp[action.token] = {
                ...state[action.token],
                selectedGroup: action.group
            };
            return { ...state, ...tmp };
        case Actions.CHANGE_PRESERVE_EXISTING_PAGINATOR:
            tmp[action.token] = {
                ...state[action.token],
                preserveExistingPage: action.iSPreserveExistingPaginator
            };
            return { ...state, ...tmp };
        case Actions.CHANGE_IS_CORE_BUNDLE:
            tmp[action.token] = {
                ...state[action.token],
                uploadInPrograss: false,
                validationMessage: '',
                bundleHeaderData: {
                    ...state[action.token].bundleHeaderData,
                    pbH_IsCoreBundle: true
                },
                preserveExistingPage: { ...state.preserveExistingPage, checked: true }
            };
            return { ...state, ...tmp };
        default:
            { return state; }
    }
}

function initialHeaderData(timeOffset): PDFBundleHeaderViewModel {
    const initDate = datePipe.transform(dpsNewDate(timeOffset).toString(), 'yyyy-MM-dd');
    return {
        pbH_BundleID: 0,
        pbH_MatterRef: '',
        pbH_CreatedDate: initDate,
        pbH_TotalDocuments: 0,
        pbH_QueuePosition: 0,
        pbH_Name: '',
        pbH_DateFrom: initDate,
        pbH_DateTo: initDate,
        pbH_BranchID: 0,
        pbH_AppID: 0,
        pbH_FileID: 0,
        pbH_CreateUser: '',
        pbH_Version: 0,
        pbH_LastSubmitUser: '',
        pbH_LastSubmitDate: initDate,
        pbH_LastModifiedDate: initDate,
        pbH_OwnerEmail: '',
        pbH_Status: 0,
        pbH_ProgressComplete: 0,
        pbH_ProgressText: '',
        pbH_ProcessStartDate: initDate,
        pbH_ProcessEndDate: initDate,
        pbH_LogPath: '',
        pbH_OptionsStopOnError: false,
        pbH_OptionIndexWithPageNum: true,
        pbH_OptionsPrefixIndexWithDate: true,
        pbH_OptionsIncludeTitlePage: false,
        pbH_OptionsKeepTitleOnFirstPage: false,
        pbH_OptionsIncludeEmailAttachments: false,
        pbH_OptionsDocumentPageNumType: 0,
        pbH_OptionsFrontPageFilePath: '',
        pbH_OptionsDocumentPageNumFormat: 0,
        pbH_BundleHost: '',
        pbH_OptionsPreservePagination: false,
        pbH_IsCoreBundle: false,
        pbH_ParentBundleID: 0,
        pbH_IndexFormattingProfile: '',

        OptionsShowIndexWithDate: false,
        OptionsDocumentPageNumLocation: 0,
        OptionsPreservePagination: false,
        ChkRestartPageNumberAtSection: false
    };
}

function initView(state: BundlingState, action: Actions.InitBundling): Partial<BundlingState> {
    if (state) {
        return state;
    }
    return {
        ...state,
        preserveExistingPage: { checked: false, enable: true },
        bundleHeaderData: initialHeaderData(action.payload.timeOffset),
        searchText: '',
        selectedInfo: {
            BranchId: action.payload.matterInfo.branchID,
            AppCode: action.payload.matterInfo.app_Code,
            FileId: action.payload.matterInfo.fileID,
            SearchText: ''
        },
        pageEvent: { pageSize: 50, pageIndex: 0, length: 0 },
        matterInfo: action.payload.matterInfo,
        columnDef: action.payload.columnDef,
        groupMode: GroupMode.Folder,
        documentViewOpened: false,
        selectedGroupHash: [],
        selectedItems: [],
        selectedGroup: null,
        bundleID: 0,
        fromToDateObject: {
            fromDate: datePipe.transform('01/01/1900', 'yyyy-MM-dd'),
            toDate: datePipe.transform(dpsNewDate(action.payload.timeOffset).toString(), 'yyyy-MM-dd')
        },
        coreBundlePopupHeaderData: null,
        removedDiaryItems: []
    };
}
function historyGridFilterChange(state: BundlingState, action: Actions.AllGridViewChange): Partial<BundlingState> {
    switch (action.payload.kind) {
        case ViewKind.periodColumnFilter:
            return {
                ...state,
                columnDef: clearColumnFilter(applyPeriodFilter(state.columnDef, action.payload.value), 'folderName'),
                fromToDateObject: { fromDate: action.payload.value.fromDate, toDate: action.payload.value.toDate }
            };
        case ViewKind.searchText:
            return {
                ...state,
                columnDef: clearColumnFilter(state.columnDef, 'folderName'),
                searchText: action.payload.value.searchTest,
                selectedInfo: {
                    ...state.selectedInfo,
                    SearchText: action.payload.value.searchTest,
                }
            };
        case ViewKind.clearFilter:
            return {
                ...state,
                columnDef: clearColumnFilter(applyPeriodFilter(state.columnDef, action.payload.value), 'folderName'),
                searchText: '',
                selectedInfo: {
                    ...state.selectedInfo,
                    SearchText: '',
                }
            };
        default: {
            return state;
        }
    }
}


function clearColumnFilter(current: ColumnDef[], changedColumName: string) {
    return current.map((def) => {
        if (def.fieldName === changedColumName) {
            return clearFilters(def);
        }
        return def;
    });
}
function setFromToDateObject(gridColumns: ColumnDef[], value: BundlingDates) {
    return gridColumns.map(val => {
        if (val.fieldName === 'dateDone') {
            return {
                ...val,
                filterActive: value.fromDate ? true : false,
                filter: {
                    ...val.filter,
                    filters: [{
                        field: 'dateDone', operator: Operator.GreaterThanOrEquel,
                        value: value.fromDate, fieldType: FieldType.Date
                    },
                    {
                        field: 'dateDone', operator: Operator.LessThanOrEquel,
                        value: value.toDate, fieldType: FieldType.Date
                    }]
                }
            };
        }
        return val;
    });
}

function applyPeriodFilter(gridColumns: ColumnDef[], value: BundlingDates): ColumnDef[] {
    return gridColumns.map(val => {
        if (val.fieldName === 'dateDone') {
            return {
                ...val,
                filterActive: value.fromDate ? true : false,
                filter: {
                    ...val.filter,
                    filters: [{
                        field: 'dateDone', operator: Operator.GreaterThanOrEquel,
                        value: value.fromDate, fieldType: FieldType.Date
                    },
                    {
                        field: 'dateDone', operator: Operator.LessThanOrEquel,
                        value: value.toDate, fieldType: FieldType.Date
                    }]
                }
            };
        }
        return val;
    });
}

function bundleFolderItem(state: BundlingState, groupData: FileHistoryGroup): Partial<BundlingState> {
    return {
        ...state,
        bundlingFolderGroupData: groupData.data,   // state.bundlingFolderGroupData.push(groupData.data),
    };
}

function loadGridData(state: BundlingState): Partial<BundlingState> {
    return { ...state, loading: true };
}
function setBundleIDAndSaveList(state: BundlingState, saveItemList: BundleItemsViewModel[], selectedRow: PDFBundleHeaderViewModel,
    coreHeader: PDFBundleHeaderViewModel) {
    return {
        ...state,
        bundleID: selectedRow.pbH_BundleID,
        bundleHeaderData: selectedRow,
        validationInPrograss: false,
        validationMessage: '',
        preserveExistingPage: selectedRow.pbH_IsCoreBundle ? { checked: true, enable: false } : { checked: false, enable: true },
        coreBundlePopupHeaderData: coreHeader
    };
}
function updateBundleID(state: BundlingState, responceData: any) {
    return {
        ...state,
        bundleID: responceData ? responceData.pdfBundleHeaderDto.pbH_BundleID : state.bundleID,
        validationInPrograss: false,
        validationMessage: '',
        bundleHeaderData: responceData ? responceData.pdfBundleHeaderDto : null
    };
}
function loadGridDataFail(state: BundlingState): Partial<BundlingState> {
    return { ...state, loading: false };
}
function mapGroupHash(group: GridGroupData[], hasKey: string, perentfilterValue?: string): GridGroupData[] {
    return group.map(g => {
        const groupHash = g.value + g.perentfilterValue + g.filterValue + g.selectorField + hasKey;
        return {
            ...g,
            groupHash: groupHash,
            currentItems: 0,
            items: g.items && g.items.length > 0 ? mapGroupHash(g.items, groupHash, g.filterValue) : [],
            perentfilterValue: perentfilterValue,
            count: g.count
        };
    });
}


function requestGroupData(state: BundlingState, action: Actions.GroupBundlingDataRequest): Partial<BundlingState> {
    let groupbyVal: string[];
    let filterValue: string[];
    if (action.payload.gridGroupData.selectorField === GroupMode.Folder) {
        filterValue = [action.payload.gridGroupData.filterValue];
        groupbyVal = ['folderName'];
    }

    return {
        ...state,
        columnDef: applyGroupFilter(state.columnDef, filterValue, groupbyVal),
        selectedGroupHash: action.payload.isLoadMore ? state.selectedGroupHash :
            selectGroup(state.selectedGroupHash, action.payload.gridGroupData.groupHash),
    };
}

function selectGroup(selectedGroupHashs: string[], selectedGroupHash: string): string[] {
    if (selectedGroupHashs.find(gh => gh === selectedGroupHash)) {
        return selectedGroupHashs.filter(gh => gh !== selectedGroupHash);
    } else {
        return selectedGroupHashs.concat(selectedGroupHash);
    }

}


function fileHistorFolderItemsChange(state: BundlingState, action: Actions.ExpandFileHistoryFolder)
    : Partial<BundlingState> {
    const hash = createViewhash(state);
    const filesData = state.fileHistorData[hash].groupData;
    const tmp = {};
    const groupData = filesData.map((group1) => {

        if (group1.groupHash === action.payload.group.groupHash) {
            return { ...group1, isExpand: !group1.isExpand };
        } else {
            const group2Data = group1.items.map((group2) => {

                if (group2.groupHash === action.payload.group.groupHash) {

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

function mapItems(removedItems: FileHistory[], currentData: FileHistory[], newData: FileHistory[], groupHash) {
    removedItems.forEach(i => newData = newData.map(ni => {
        if (ni.diary_UID === i.diary_UID) {
            return { ...ni, isRemove: true };
        } else {
            return ni;
        }

    }));
    return currentData.concat(newData.map(row => {
        return {
            ...row,
            groupHash: groupHash
        };
    }));
}

function loadGridDataSuccess(state: BundlingState, action, newData: GridDataObject, moveItemTOProfile: boolean): Partial<BundlingState> {
    if (action.payload.gridGroupData) {
        return {
            ...state,
            gridData: newData.data ? mapItems(state.removedDiaryItems,
                state.gridData, newData.data, action.payload.gridGroupData.groupHash) : [],
            loading: false,
            gridGroupData: state.gridGroupData ? changeGroupCurentItemCount(state.gridGroupData, action.payload.gridGroupData)
                : state.gridGroupData
        };

    } else {
        const hasKey = createViewhash(state);
        return {
            ...state,
            gridData: newData.data ? newData.data : [],
            totalItem: newData.total,
            gridGroupData: newData.group ? mapGroupHash(newData.group, hasKey) : [],
            loading: false,
            expandRow: !!newData.data && newData.data.length > 0 ? newData.data[0] : null,
            selectedGroupHash: []
        };
    }

}

function changeGroupCurentItemCount(group: GridGroupData[], selecGroup: GridGroupData) {
    return group.map(g => {
        if (g.groupHash === selecGroup.groupHash) {
            return {
                ...g,
                currentItems: g.currentItems + ItemRequest.ItemCount,
            };
        } else if (g.items && g.items.length > 0) {
            return {
                ...g,
                items: changeGroupCurentItemCount(g.items, selecGroup)
            };
        } else {
            return g;
        }

    });
}

function updateSelectItem(state: BundlingState, action: Actions.SelectedBundleItemUpdate) {
    return {
        ...state,
        selectedItems: action.isMuilti ? state.selectedItems.concat(action.selectedItem) : [action.selectedItem],
        selectedGroup: null
    };

}

function removeItemFilehistory(state: BundlingState, data: FileHistory[]) {
    return {
        ...state,
        removedDiaryItems: state.removedDiaryItems.concat(data),
        gridData: state.gridData.map(row => {
            if (data.find(i => i.diary_UID === row.diary_UID)) {
                return { ...row, isRemove: true };
            }
            return row;
        }),
        selectedItems: []
    };
}

function addItemToFilehistory(state: BundlingState, items: BundleTreeItem[]) {
    // const getFileHistoryItems = (tree: BundleTreeItem[]): FileHistory[] => {
    const fileHistoryItems: FileHistory[] = [];
    let newRemovedList: FileHistory[] = [];
    items.forEach(bundleItem => {
        if (!bundleItem.isFolder && !!bundleItem.data) {
            fileHistoryItems.push(bundleItem.data);
            newRemovedList = state.removedDiaryItems.filter(i => i.diary_UID !== bundleItem.data.diary_UID);
        }
    });

    // };
    // const fileHistoryItems: FileHistory[] = getFileHistoryItems(items);
    return {
        ...state,
        removedDiaryItems: newRemovedList,
        gridData: state.gridData.map(row => {
            if (fileHistoryItems.find(i => i.diary_UID === row.diary_UID)) {
                return { ...row, isRemove: false };
            }
            return row;
        }),
        selectedItems: []
    };
}

function gridRowExpand(state: BundlingState, action: Actions.GridRowExpand): Partial<BundlingState> {
    const currentExpand = state.expandRow ? state.expandRow.diary_UID : null;
    return {
        ...state,
        expandRow: action.payload.row.diary_UID !== currentExpand ? action.payload.row : null,
        // selectedGroupHash: []
    };
}

function getDocURL(state: BundlingState, item: FileHistory): Partial<BundlingState> {
    return {
        ...state,
        selectedItems: [item],
        documentViewOpened: true,
    };
}

function getDocURLSuccess(state: BundlingState, action: Actions.GetDocURLSuccess): Partial<BundlingState> {
    return {
        ...state,
        gridData: setDocumentUrl(state.gridData, action.payload.gridRow, action.payload.url), loadDocURL: false
    };
}

function getDocURLFail(state: BundlingState): Partial<BundlingState> {
    return { ...state, loading: false };
}


function setDocumentUrl(gridData: FileHistory[], selectedRow: FileHistory, url: string): FileHistory[] {
    return gridData.map(row => {
        if (row.diary_UID === selectedRow.diary_UID) {
            return Object.freeze({ ...row, docUrl: url, view: true });
        } else {
            return Object.freeze({ ...row, view: false });
        }
    });
}

function getEmailItemSuccess(state: BundlingState, action: Actions.GetEmailItemForMSGSuccess): Partial<BundlingState> {
    return { ...state, gridData: setImailItemUrl(state.gridData, action.payload.row, action.payload.emailItem), loadDocURL: false };
}

function createViewhash(state: BundlingState) {
    const hash = state ? state.searchText + '/'
        + state.pageEvent.pageSize + '/'
        + state.pageEvent.pageIndex + '/'
        + state.matterInfo.app_Code + '/'
        + state.matterInfo.appID + '/'
        + state.matterInfo.branchID + '/'
        + state.matterInfo.matterReferenceNo + '/'
        + state.matterInfo.fileID + '/'
        + state.groupMode + '/'
        + JSON.stringify(state.columnDef.map((data) => JSON.stringify((data.filter ? data.filter : null)))) + '/'
        + JSON.stringify(state.columnDef.map((item) => JSON.stringify((item.sort ? item.sort.dir : null)))) : null;
    return hash;
}


function setImailItemUrl(gridData: FileHistory[], selectedRow: FileHistory, emaiItem: boolean): FileHistory[] {
    return gridData.map(row => {
        if (row.diary_UID === selectedRow.diary_UID) {
            return Object.freeze({ ...row, emailItem: emaiItem, view: true });
        } else {
            return Object.freeze({ ...row, view: false });
        }
    });
}
function closeViever(state: BundlingState): Partial<BundlingState> {
    return { ...state, documentViewOpened: false };
}

export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);
export const getLoadingByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.loading : null);
export const getCurrentHashByToken = (token) => createSelector(getStateByToken(token), createViewhash);
export const getColumnDefByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.columnDef : null);
export const getBundlingComponentTreeDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.BundlingComponentTreeData : null);
export const getBundlingFolderGroupDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.bundlingFolderGroupData : null);
export const getGroupDataByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.gridGroupData : '');
export const getBundlingSelectedInfoByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedInfo : null);
export const getBundlingGridGroupDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state && state.gridGroupData ? state.gridGroupData : []);
export const getGridDataByToken = (token) => createSelector(getStateByToken(token), (state) => state && state.gridData ?
    state.gridData
    : []);
export const getGridExpandedRowByToken = (token) => createSelector(getStateByToken(token), (state) => state ? state.expandRow : null);
export const getselectedGroupHashByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedGroupHash : null);
export const getselectedGroupByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedGroup : []);
export const getSelectedItemsByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedItems : []);
export const getDocumentViewByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.documentViewOpened : null);
export const getMatterInfoByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.matterInfo : null);
export const getSearchTextByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedInfo.SearchText : '');
export const getValidationIsInProgras = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.validationInPrograss : false);
export const getUploadIsInProgras = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.uploadInPrograss : false);
export const getValidationMessage = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.validationMessage : '');
export const getbundleIdByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.bundleID : 0);
export const getFromToDateObjectByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.fromToDateObject : null);
export const getPreserveExistingPagination = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.preserveExistingPage : { checked: false, enable: true });
export const getPDFBundleHeaderViewModel = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.bundleHeaderData : null);
export const getCoreBundleHeaderData = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.coreBundlePopupHeaderData : null);
