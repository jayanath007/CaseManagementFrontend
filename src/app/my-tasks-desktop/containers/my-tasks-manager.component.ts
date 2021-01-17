import { WorkflowMenuMetaDataWrapper } from '../../workflow-menu-core/models/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Injector } from '@angular/core';
import { MainMenuService, getVisibleOutlet } from '../../layout-desktop';
import { BaseMyTasksManager } from '../../my-tasks-core/containers/my-taks-manager';
import { GridFilterUpdate, GridData } from '../../my-tasks-core/models/interfce';
import { GridButtonType } from '../../my-tasks-core/models/enumeration';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { AddEditTaskCloseInfo } from '../../task-add-edit-core/models/enums';
import { dpsNewDate } from '../../utils/javascriptDate';
import { take } from 'rxjs/operators';


@Component({
  selector: 'dps-my-tasks-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class MyTasksManagerComponent extends BaseMyTasksManager implements OnInit {

  @Input() token;

  public activeOutlet$: any;

  constructor(store: Store<any>, private router: ActivatedRoute,
    public popupService: SystemJsPopupLoaderService, public injector: Injector) {
    super(store, injector);
  }

  ngOnInit() {
    super.initSelectors(this.token);
    this.activeOutlet$ = this.store.select(getVisibleOutlet);
  }

  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo(this.token, value);
  }

  onLoadMore(value) {
    this.loadMore(this.token, value);
  }

  onRefresh() {
    this.gridRefresh(this.token);
  }

  onViewChange(value) {
    this.viewChange(this.token, value);
  }

  onGroupChange(value) {
    this.groupChange(this.token, value);
  }

  onSelectedGroupRowChange(value) {
    this.selectedGroupRowChange(this.token, value);
  }



  onRowExpanded(dataRow) {
    this.expandRow(this.token, dataRow);
  }
  newTaskClick() {
    this.user$.pipe(take(1)).subscribe(user => {
      const inputData: any = {
        loginUser: null,
        headerText: 'New Task',
        documentFlowStatus: null,
        matterInfo: getNewMatterInfoObject(user.general.dateTimeOffset)
      };
      this.openAddEditTask('NEW_TASK_POPUP', inputData);
    }).unsubscribe();

  }


  clickGridButton({ kind, value, menuInfo }: {
    kind: GridButtonType, value: GridData,
    menuInfo?: WorkflowMenuMetaDataWrapper
  }) {
    switch (kind) {
      case GridButtonType.OpenCase: {
        this.goToOpenCase(value);
        break;
      }
      case GridButtonType.AddTask: {
        const inputData: any = {
          loginUser: value.taskFor,
          headerText: 'Add Task',
          documentFlowStatus: value.documentFlowStatus,
          matterInfo: value
        };
        this.openAddEditTask('ADD_TASK_POPUP', inputData);
        break;
      }
      case GridButtonType.EditTask: {
        const inputData: any = {
          loginUser: value.taskFor,
          headerText: 'Edit Task',
          documentFlowStatus: value.documentFlowStatus,
          matterInfo: value
        };
        this.openAddEditTask('EDIT_TASK_POPUP', inputData);
        break;
      }
      case GridButtonType.Complete: {
        this.requestToComplete(this.token, value);
        break;
      }
      case GridButtonType.RunCommand: {
        this.runWorkflowCommand(this.token, value, menuInfo);
        break;
      }
    }
  }
  onChangeTeamMemberPanelMode(mode) {
    this.changeTeamMemberPanelMode(mode);
  }
  openAddEditTask(popupToken: string, addEditTaskInputData: any) {
    this.popupService.openAddEditTaskPopup(popupToken, addEditTaskInputData).subscribe((data: any) => {
      this.onRefresh();
      // if (data === AddEditTaskCloseInfo.ExitWithSaveSuccess) {
      //   this.onRefresh();
      // }
    });
  }

  onOpenAddTaskWithFile(event: { file: any, row: GridData }) {
    const inputData: any = {
      loginUser: event.row.taskFor,
      headerText: 'Add Task',
      documentFlowStatus: event.row.documentFlowStatus,
      matterInfo: event.row,
      file: event.file
    };
    this.openAddEditTask('ADD_TASK_POPUP', inputData);
  }

}
function getNewMatterInfoObject(timeOffset): GridData {
  // set appID only, Don't use others
  return {
    action: false,
    appCode: null,
    appID: 0,
    branchID: null,
    client: null,
    columnFolderId: null,
    date: dpsNewDate(timeOffset),
    dateBy: dpsNewDate(timeOffset),
    datedn: dpsNewDate(timeOffset),
    dateDone: dpsNewDate(timeOffset),
    documentFlowStatus: null,
    expanded: false,
    fileID: null,
    folderName: null,
    hasPassword: false,
    letter: null,
    matterDetails: null,
    matterReferenceNo: null,
    note: null,
    putOnBy: null,
    taskFor: null,
    taskID: null,
    workflowActions: null,
    selected: false,
    checkTREnable: false,
    isTimeRecordingEnabled: false,
    isProspectMatter: false,
    isLegalAid: false,
    billRequestId: 0
  };
}


