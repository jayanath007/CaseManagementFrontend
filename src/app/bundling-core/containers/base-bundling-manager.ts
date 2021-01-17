import {
    getColumnDefByToken, getBundlingComponentTreeDataByToken,
    getBundlingFolderGroupDataByToken, getGroupDataByToken, getBundlingGridDataByToken, getBundlingItemList,
    getLoadingByToken, getGridExpandedRowByToken, getselectedGroupHashByToken, getSelectedItemsByToken,
    getDocumentViewByToken, getOptionIsLoading, getBundlePageNoLocationByToken, getBundleOptionsByToken,
    getMatterInfoByToken, getSearchTextByToken, isTreeDirtyByToken, getValidationIsInProgras, getBundleNameTextByToken,
    getBundlingAllItemList, getbundleIdByToken, getselectedGroupByToken, getPreserveExistingPagination,
    getValidationMessage, getUploadIsInProgras, getPDFBundleHeaderViewModel, getFromToDateObjectByToken, getCoreBundleHeaderData
} from './../reducers/index';
import { Store } from '@ngrx/store';
import { ColumnDef, GridGroupData } from '../../core/lib/grid-model';
import {
    InitBundling, GroupBundlingDataRequest, AddFolder, MoveSelectedUp,
    MoveSelectedDown, RemoveItem, SelectItem, GridRowExpand, GetDocURL, RequestToAddItems,
    ToggleExpand, SelectedBundleItemUpdate, UpdateLable, SetEditLabelItem, CloseViewer, OpenOptionPopup,
    ChangeOption, BundleSubmit, StartItemMove, MoveItem, UpdateDate, UploadCoverPage, AllGridViewChange,
    LoadSavedBundleData, RequestToAddItemsFromMenu, ChangeSelectedGroup, ChangePreserveExistingPaginator,
    ChangedIsCoreBundle, ChangeFileDateEnable, GetLogFile
} from '../actions/core';
import { ViewChangeKind, FileHistory, BundleTreeItem, BundlingDates } from '../models/interface';
import { MatterSearchGridData } from '../../core/lib/matter';
import { ViewKind } from '../models/enum';
import { PDFBundleHeaderViewModel } from '../../core/lib/bundle';
import { getUser, User, LoadOrganizerSettings } from '../../auth';
import { Observable } from 'rxjs';
import { InitSettingCore } from '../../setting-core';
import { filter, take } from 'rxjs/operators';

export class BaseBundlingManager {

    bundleObject$: any;
    public bundlingComponentTreeDat$: any;
    myToken: string;
    user$: Observable<User>;

    constructor(protected store: Store<any>) {
    }
    getColumnDef(token) {
        return this.store.select(getColumnDefByToken(token));
    }
    getBundledFolderGroup(token) {
        return this.store.select(getBundlingFolderGroupDataByToken(token));
    }
    getBundledItemDataList(token) {
        return this.store.select(getBundlingItemList(token));
    }
    getBundledAllItemDataList(token) {
        return this.store.select(getBundlingAllItemList(token));
    }
    getBundlingComponentTreeData(token) {
        return this.store.select(getBundlingComponentTreeDataByToken(token));
    }
    getBundlingGridData(token) {
        return this.store.select(getBundlingGridDataByToken(token));
    }
    getLoading(token) {
        return this.store.select(getLoadingByToken(token));
    }
    getGridGroupData(token) {
        return this.store.select(getGroupDataByToken(token));
    }
    getGridExpandedRowData(token) {
        return this.store.select(getGridExpandedRowByToken(token));
    }
    getSelectedGroupHash(token) {
        return this.store.select(getselectedGroupHashByToken(token));
    }
    getSelectedGroup(token) {
        return this.store.select(getselectedGroupByToken(token));
    }
    getSelectedFileHistoryItems(token) {
        return this.store.select(getSelectedItemsByToken(token));
    }
    getDocumentViewOpend(token) {
        return this.store.select(getDocumentViewByToken(token));
    }
    getMatterInfo(token) {
        return this.store.select(getMatterInfoByToken(token));
    }
    getSearchText(token) {
        return this.store.select(getSearchTextByToken(token));
    }
    isTreeDirty(token) {
        return this.store.select(isTreeDirtyByToken(token));
    }

    getValidationIsInProgras(token) {
        return this.store.select(getValidationIsInProgras(token));
    }
    getUploadIsInProgras(token) {
        return this.store.select(getUploadIsInProgras(token));
    }
    getValidationMessage(token) {
        return this.store.select(getValidationMessage(token));
    }
    getBundleId(token) {
        return this.store.select(getbundleIdByToken(token));
    }
    getIsPreserveExistingPage(token) {
        return this.store.select(getPreserveExistingPagination(token));
    }
    onInit(token, matterData: MatterSearchGridData, columnDef: ColumnDef[]) {
        this.user$ = this.store.select(getUser);
        this.store.dispatch(new InitSettingCore());
        this.store.dispatch(new LoadOrganizerSettings());
        const _user$ = this.user$.pipe(filter(user => !!user.general), take(1)).subscribe(user => {

            this.store.dispatch(new InitBundling(token, {
                matterInfo: matterData,
                columnDef: columnDef,
                timeOffset: user.general.dateTimeOffset
            }));
        });

    }
    onGroupRowChange(token: string, group: GridGroupData) {
        this.store.dispatch(new GroupBundlingDataRequest(token, { gridGroupData: group, moveItemTOProfile: false }));
    }
    dropBundleData(token, data: { group: GridGroupData, dragDataType: string, bundleTreeItem: BundleTreeItem, itemType: string }) {
        if (data.itemType === 'ByItem' || data.itemType === 'WithNewFolder') {
            this.store.dispatch(new RequestToAddItems(token, data.bundleTreeItem ? data.bundleTreeItem.id : null,
                data.group.value, data.itemType));
        } else {
            this.store.dispatch(new GroupBundlingDataRequest(token, { gridGroupData: data.group, moveItemTOProfile: true }));
        }
    }
    expandRow(token: string, rowData: FileHistory) {
        this.store.dispatch(new GridRowExpand(token, { row: rowData }));
    }
    getDocUrl(token: string, item: FileHistory) {
        this.store.dispatch(new GetDocURL(token, { gridRow: item }));
    }
    expanFolder(token, folderId: string) {
        this.store.dispatch(new ToggleExpand(token, folderId));
    }
    onMenuChangeBundling(token, event: { kind: ViewChangeKind; value: any }) {
        if (event && event.kind === ViewChangeKind.Add) {
            this.store.dispatch(new RequestToAddItemsFromMenu(token));
        } else if (event && event.kind === ViewChangeKind.Up) {
            this.store.dispatch(new MoveSelectedUp(token));
        } else if (event && event.kind === ViewChangeKind.Down) {
            this.store.dispatch(new MoveSelectedDown(token));
        } else if (event && event.kind === ViewChangeKind.Heading) {
            if (event.value && event.value.id) {
                this.store.dispatch(new AddFolder(token, event.value.id, 'New Folder'));
            } else {
                this.store.dispatch(new AddFolder(token, null, 'New Folder'));
            }
        } else if (event && event.kind === ViewChangeKind.Rmove) {
            this.store.dispatch(new RemoveItem(token, event.value));
        }
    }
    selectRow(token: string, event: { item: FileHistory, isMuilti: boolean }) {
        this.store.dispatch(new SelectedBundleItemUpdate(token, event.item, event.isMuilti));
    }
    selectProfileItem(token: string, selectedItem: BundleTreeItem) {
        this.store.dispatch(new SelectItem(token, selectedItem.id));
    }
    lableChange(token, event) {
        this.store.dispatch(new UpdateLable(token, event.item.id, event.value));
    }
    changeDateDone(token: string, event: { item: BundleTreeItem, date: string }) {
        this.store.dispatch(new UpdateDate(token, event.item.id, event.date));
    }
    onClickEditLable(token, id) {
        this.store.dispatch(new SetEditLabelItem(token, id));
    }
    closeViewer(token) {
        this.store.dispatch(new CloseViewer(token));
    }
    dragProfileItem(token, { itemId, anchorId }) {
        this.store.dispatch(new MoveItem(token, itemId, anchorId));
    }
    startMoveItem(token, item) {
        if (item.isCoverPage !== true) {
            this.store.dispatch(new StartItemMove(token, item.id));
        }
    }
    // Option
    onOpenOptionPopup(token: string) {
        this.store.dispatch(new OpenOptionPopup(token));
    }
    getOptionsIsLoading(token: string) {
        return this.store.select(getOptionIsLoading(token));
    }
    getBundlePageNoLocation(token: string) {
        return this.store.select(getBundlePageNoLocationByToken(token));
    }
    getBundleOptions(token: string) {
        return this.store.select(getBundleOptionsByToken(token));
    }
    changeOption(event: { key: string, value: any }, token: string) {
        this.store.dispatch(new ChangeOption(token, event));
    }
    submit(token: string, bundleObjectId: string, bundleName: string) {
        this.store.dispatch(new BundleSubmit(token, bundleObjectId, bundleName, true));
    }
    historyGridViewChange(token: string, { kind, value }: { kind: ViewKind, value: BundlingDates }) {
        this.store.dispatch(new AllGridViewChange(token, { kind, value }));
    }
    uploadCoverPage(token: string, data: { isFromDiary: boolean, diaryId: number, file: any }) {
        this.store.dispatch(new UploadCoverPage(token, data));
    }
    loadSaveBundleData(token: string, rowData: PDFBundleHeaderViewModel) {
        this.store.dispatch(new LoadSavedBundleData(token, rowData));
    }
    getBundleNameText(token: string) {
        return this.store.select(getBundleNameTextByToken(token));
    }
    onGetFromToDate(token) {
        return this.store.select(getFromToDateObjectByToken(token));
    }
    saveBundleData(token: string, bundleNameText: string, bundleObjectId: string) {
        this.store.dispatch(new BundleSubmit(token, bundleObjectId, bundleNameText, false));
    }
    getBundleHeaderViewModel(token) {
        return this.store.select(getPDFBundleHeaderViewModel(token));
    }
    getCoreBundleHeader(token) {
        return this.store.select(getCoreBundleHeaderData(token));
    }
    onChangeSelectGroup(token: string, groupData: GridGroupData) {
        this.store.dispatch(new ChangeSelectedGroup(token, groupData));
    }
    changePreserveExistingPage(token: string, checked: boolean) {
        this.store.dispatch(new ChangePreserveExistingPaginator(token, { checked: checked, enable: true }));
    }
    onChangedCoreBundleId(token, payload: { ids: string[], rootElementId: string, bundleName: string }) {
        this.store.dispatch(new ChangedIsCoreBundle(token, payload));
    }
    onFileDateEnable(token: string, event) {
        this.store.dispatch(new ChangeFileDateEnable(token, event.id, event.value));
    }
    openLogFile(token: string, bundleId) {
        this.store.dispatch(new GetLogFile(token, bundleId));
    }
    loadMoreData(token: string, groupData: GridGroupData) {
        this.store.dispatch(new GroupBundlingDataRequest(token, { gridGroupData: groupData, moveItemTOProfile: false, isLoadMore: true }));
    }
}
