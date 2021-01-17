import { Component, OnInit } from '@angular/core';
import { MainMenuItem } from '../../layout-desktop';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { LocalStorageKey } from '../../core';
import { MatterSearchGridData } from '../../core/lib/matter';

@Component({
    selector: 'dps-bundle-manager-router-host',
    template: `<dps-bundling-manager #manager [token]="this.token" [matterInfo]="this.matterInfo">
        <dps-bundling-layout
        [columnDef] ="manager.columnDef$ | async"
        [timeOffset]="(manager.user$ | async)?.general?.dateTimeOffset"
        [fileHistoryData] ="manager.fileHistoryList$ | async"
        [bundledFolderGroup] ="manager.bndledFolderGroup$ | async"
        [bundlingComponentTreeData] ="manager.bundlingComponentTreeData$ |  async"
        [groupData] ="manager.groupData$ | async"
        [gridData] ="manager.gridData$ | async"
        [bundlingItemList]="manager.bundlingItemList$|async"
        [bundlingAllItemList]="manager.bundlingAllItemList$|async"
        [loading] ="manager.loading$ | async"
        [selectGroupHash] ="manager.selectedGroupHash$ | async"
        [selectGroup]="manager.selectGroup$ | async"
        [documentViewOpened] ="manager.documentViewOpened$ | async"
        [matterInfo]="manager.matterInfo$| async"
        (openDocument) ="manager.onOpenDocument($event)"
        [selectedGridItems] ="manager.selectedFileHistoryItems$|async"
        [searchText] ="manager.searchText$|async"
        [bunldeId]="manager.bunldeId$|async"
        [isDirty]="manager.isDirty$|async"
        [vlidationInProgras]="manager.vlidationInProgras$|async"
        [uploadInProgras]="manager.uploadInProgras$|async"
        [vlidationMessage]="manager.vlidationMessage$|async"
        [isPreserveExistingPage]="manager.isPreserveExistingPage$|async"
        [fromToDate]="manager.fromToDate$|async"
        (fileDateEnable)="manager.onChangeFileDateEnable($event)"
        [bundleHeaderView]="manager.bundleHeaderView$|async"
        [coreBundleHeader]="manager.coreBundleHeader$|async"
        (nameTextSave)="manager.onNameTextSave($event)"
        (rowExpand)="manager.onRowExpand($event)"
        (dropData)="manager.onDropBundleData($event)"
        (folderRowChange) ="manager.onFolderRowChange($event)"
        (menuChange) ="manager.onMenuChange($event)"
        (onChnageFolderExpand)="manager.onExpanFolder($event)"
        (selectRow)="manager.onSelectRow($event)"
        (lableChange) ="manager.onLableChange($event)"
        (selectProfileItem)="manager.onSelectProfileItem($event)"
        (onClickEditLable) ="manager.clickEditLable($event)"
        (onDblClickDocView) ="manager.ondblClickDocView($event)"
        (closeViewer) ="manager.onCloseViewer()"
        (dragProfileItem)="manager.onDragProfileItem($event)"
        (startMoveItem)="manager.onStartMoveItem($event)"
        (changeDateDone)="manager.onChangeDateDone($event)"
        (historyGridFilterChange)="manager.onHistoryGridFilterChange($event)"
        (uploadCoverPage)="manager.onUploadCoverPage($event)"
        (changeSelectGroup)="manager.onSelectGroup($event)"
        (updateIsPreserveExistingPage)="manager.onChangePreserveExistingPage($event)"
        (openLogFile)="manager.onOpenLogFile($event)"
        (loadMoreData)="manager.onLoadMoreData($event)">
        </dps-bundling-layout>
 </dps-bundling-manager>`,

})
export class BundleManagerRouterHostComponent implements OnInit {

    constructor() { }

    token: string;
    matterInfo: MatterSearchGridData;

    ngOnInit() {
        const openCases: MainMenuItem<OpenCaseMenueData>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.OpenCaseMenuItems));
        const selectOpenCase = openCases.find(c => c.isSelected);
        if (selectOpenCase) {
            this.token = selectOpenCase.token;
            this.matterInfo = selectOpenCase.data.matterData.data;
        }
    }
}
