import { MenuButtonClickType } from '../../open-case-core/models/enums';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';


@Component({
    selector: 'dps-workflow-menu-router-host',
    template: `
        <dps-workflow-menu-manager #workflowMenuManager [inputData]="inputData" [workflowMenuToken]="token">
        <dps-workflow-menu-main-layout
        [openFilePathHistory]="workflowMenuManager.openFilePathHistory$ | async"
        [forwardFilePathHistory]="workflowMenuManager.forwardFilePathHistory$ | async"
        [openFilePath]="workflowMenuManager.openFilePath$ | async"
        [menuButtonClickType]="menuButtonClickType"
        [menuPropertyButtonClick]="menuPropertyButtonClick"
        [menuTreeItems]="workflowMenuManager.WorkflowMenuList$ | async"
        (itemChange)="workflowMenuManager.onItemChange($event)"
        (exportMenus) ="workflowMenuManager.exportMenus($event)"
        (onImportMenu) ="workflowMenuManager.onImportMenu($event)"(onImportMenu) ="workflowMenuManager.onImportMenu($event)"
        (onKeyUpDown)="workflowMenuManager.onKeyUpDown($event)"
        [validationMessage] ="workflowMenuManager.validationMessage$ | async"
        [selectedMenuChildList]="workflowMenuManager.selectedMenuChildList$ | async"
        [matterSummeryList]="workflowMenuManager.matterSummeryList$ | async"
        [matterShortCutList]="workflowMenuManager.matterShortCutList$ | async"
        [exportedData] ="workflowMenuManager.exportedData$ | async"
        [exportToServerTrigger] ="workflowMenuManager.exportToServerTrigger$ | async"
        [loading] = "workflowMenuManager.loading$ | async"
        [requestToCancel]="workflowMenuManager.requestToCancel$ | async"
        (cancelExitEdit)="workflowMenuManager.onCancelExitEdit()"
        (exitEdit)="workflowMenuManager.onExitEdit()"
        (saveMenuEdit)="workflowMenuManager.onSaveEditMenu()"
        [cutOrCopyItem]="workflowMenuManager.cutOrCopyItem$ | async"
        (msgReset)="workflowMenuManager.onMsgReset($event)"
        [isShowDeleteMsg]="workflowMenuManager.isShowDeleteMsg$ | async"
        (deleteLinkItem)="workflowMenuManager.onDeleteLinkItem($event)"
        (treeParentListExpand)="workflowMenuManager.expandParentListItem($event)"
        [openCaseFileData]="workflowMenuManager.inputData"
        (menuduplicate)="workflowMenuManager.onMenuDuplicate($event)"
        (onCheckin)="workflowMenuManager.doCheckin($event)"
        (onDiscardCheckin)="workflowMenuManager.doDiscardCheckin($event)"
        [searchText]="workflowMenuManager.wfSearchText$ | async"
        [wfSelectedItem]="workflowMenuManager.wfSelectedItem$ | async"
        [flatMenuList]="workflowMenuManager.flatMenuList$ | async"
        (wfSearchtext)="workflowMenuManager.onWfSearchtext($event)"
        >
        </dps-workflow-menu-main-layout>
        </dps-workflow-menu-manager>
    `,
    styles: []
})
export class WorkflowMenuRouterHostComponent implements OnInit {
    @Input() inputData: OpenCaseMenueData;
    @Input() token: string;
    @Input() menuButtonClickType: any;
    @Input() menuPropertyButtonClick: any;

    constructor(private router: ActivatedRoute) {
    }

    // (menuViewitemClick)="workflowMenuManager.onMenuViewItemClick($event)"
    ngOnInit() {
        // [menuTreeItems]="workflowMenuManager.menuTreeItems"
        // this.router.data.subscribe((inputData) => console.log('workflow-menu-4444444444444', inputData));
        // combineLatest(this.router.params, this.router.data, (params, data) => ({
        //     token: params.token,
        //     input: data.inputData
        // }))
        //     .do((data) => {
        //     })
        //     .filter(({ token, input }) => !!token && !!input)
        //     // .take(1)
        //     .subscribe((data) => {
        //         this.inputData = data.input;
        //         this.token = data.token;
        //     });
        // {{inputData  | json}}@@
        // {{token  | json}}
    }
}
