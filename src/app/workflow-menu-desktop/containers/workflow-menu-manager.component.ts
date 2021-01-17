import { ItemChangeKind } from '../../workflow-menu-core/models/enums';
import { BaseWorkflowMenuManager } from '../../workflow-menu-core/containers/base-workflow-menu-manager';
import { combineLatest } from 'rxjs';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { Store } from '@ngrx/store';
import { MainMenuService } from '../../layout-desktop/services/main-menu.service';
import { SystemJsPopupLoaderService } from '../../shell-desktop/services/system-js-popup-loader.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MenuExportFileType } from '../../workflow-menu-core';
import { ExportData, WorkflowMenuFileData, WorkflowMenuKeyUpDownData } from '../../workflow-menu-core/models/interfaces';
import { Injector } from '@angular/core';



@Component({
  selector: 'dps-workflow-menu-manager',
  template: '<ng-content></ng-content>',
  styles: []
})
export class WorkflowMenuManagerComponent extends BaseWorkflowMenuManager implements OnInit, OnChanges {


  @Input() inputData: OpenCaseMenueData;
  @Input() workflowMenuToken: string;

  constructor(store: Store<any>, injector: Injector) {
    super(store, injector);
  }

  ngOnInit() {
    if (this.workflowMenuToken && this.inputData) {
      // super.initSelectors(this.workflowMenuToken, this.inputData);

      // this.WorkflowMenuList$ = this.getWorkflowMenuList();
      // this.selectedMenuChildList$ = this.getSelectedMenuChildList();
      // this.matterSummeryList$ = this.getMatterSummeryList();
      // this.matterShortCutList$ = this.getMatterShortCutList();
      // this.selectedMenuChildList$.subscribe(function (data) {
      //   console.log('$$4444444444444444444', data);
      // });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.inputData.currentValue && changes.workflowMenuToken.currentValue) {
      super.initSelectors(changes.workflowMenuToken.currentValue, changes.inputData.currentValue);
    }
  }
  expandParentListItem(value: any) {
    this.expandParentList(this.workflowMenuToken, 'ACCOUNT_MANAGE.MNU');
  }

  onMsgReset(value: string) {
    this.msgReset(this.workflowMenuToken, value);
  }
  onDeleteLinkItem(value: boolean) {
    this.deleteLinkItem(this.workflowMenuToken, value);
  }
  onMenuDuplicate(selectedMenu) {
    this.duplicateMenu(this.workflowMenuToken, selectedMenu);
  }
  // super.workFlowMenuTabChange(changes.workflowMenuToken.currentValue);
  onItemChange({ kind, value }: { kind: ItemChangeKind, value: any }) {
    this.itemChange(this.workflowMenuToken, kind, value);
    if (kind === ItemChangeKind.RunWorkFlow) {
      this.runWorkflow(this.workflowMenuToken, this.injector, value);
    }
  }

  exportMenus(menuExportData: ExportData) {
    this.onExportMenus(this.workflowMenuToken, menuExportData);
  }
  onImportMenu(fullFileData: WorkflowMenuFileData) {
    this.importMenu(this.workflowMenuToken, fullFileData);
  }

  onKeyUpDown(data: WorkflowMenuKeyUpDownData) {
    this.keyUpDown(this.workflowMenuToken, data);
  }

  onRefresh() {

  }
  closeMatterPopup() {
    //  this.closeAndDiscastMatterPopup(this.matterSearchToken);
  }
  onCancelExitEdit() {
    this.cancelExitEditView(this.workflowMenuToken);
  }
  onExitEdit() {
    this.exitEditView(this.workflowMenuToken);
  }
  onSaveEditMenu() {
    this.saveEditView(this.workflowMenuToken);
  }
  onWfSearchtext(searchtext) {
    this.onWfItemSearchtext(this.workflowMenuToken, searchtext);
  }
}


