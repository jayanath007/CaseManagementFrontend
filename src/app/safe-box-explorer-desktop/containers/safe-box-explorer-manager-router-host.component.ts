import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'dps-safe-box-explorer-manager-router-host',

    template: `<dps-safe-box-explorer-manager  #safeBoxExplorerManager [token]="'SafeBoxExplorerPage'">
                    <dps-safe-box-explorer-layout
                    (onExpand) ="safeBoxExplorerManager.onExpand($event)"
                    (onUploadFile) ="safeBoxExplorerManager.onUploadFile($event)"
                    (onExpandCollapsed)="safeBoxExplorerManager.onExpandCollapsed($event)"
                    (selectedBlob) = "safeBoxExplorerManager.onSelectedBlob($event)"
                    (changeFolderItem) = "safeBoxExplorerManager.onChangeFolderItem($event)"
                    (changeFileItem) = "safeBoxExplorerManager.onChangeFileItem($event)"
                    (onChangeViewType)= "safeBoxExplorerManager.onChangeViewType($event)"
                    (onMoveItem) = "safeBoxExplorerManager.onMoveItem($event)"
                    (navigete) = "safeBoxExplorerManager.onNavigete($event)"
                    [treeNodeItem]="safeBoxExplorerManager.treeData$ | async"
                    [selectedTreeNodeItem]="safeBoxExplorerManager.selectedTreeNodeItem$ | async"
                    [selectedBlobData]="safeBoxExplorerManager.selectedBlob$ | async"
                    [activeOutlet]="safeBoxExplorerManager.activeOutlet$ | async"
                    [loading]="safeBoxExplorerManager.loading$ | async"
                    [viewType]="safeBoxExplorerManager.viewType$ | async"
                    [backpaths]="safeBoxExplorerManager.backpaths$ | async"
                    [nextpaths]="safeBoxExplorerManager.nextpaths$ | async"
                    [copyItems]="safeBoxExplorerManager.copyItems$ | async"
                    [selectedFolder]="safeBoxExplorerManager.selectedFolder$ | async"
                    [isGoogle]="safeBoxExplorerManager.isGoogle"
                    [selectedSafeBoxType]="safeBoxExplorerManager.selectedSafeBoxType$| async"
                    [copyFrom]="safeBoxExplorerManager.copyFrom$| async"
                    (changeSafeBoxType)="safeBoxExplorerManager.onChangeSafeBoxType($event)"
                    >
                    </dps-safe-box-explorer-layout>
                </dps-safe-box-explorer-manager>`,

})



// [treeData]='treeData$ | async'
export class SafeBoxExplorerManagerRouterHostComponent implements OnInit {

    token = 'SafeBoxExplorerPage';
    constructor() { }

    ngOnInit() {
    }

}
