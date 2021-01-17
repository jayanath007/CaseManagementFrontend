import { RunWorkflowCommand } from '../../workflow-menu-core/actions/core';
import { BaseCaseTaskManager } from '../../case-task-core/containers/base-case-task-manager';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Injector } from '@angular/core';
import * as CaseTaskCore from '../../case-task-core';
import { ViewChangeKind, RowItemChangeKind, RequestToComplete } from '../../case-task-core/actions/core';
import { MatterInfo, MatterSearchGridData } from '../../core/lib/matter';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata/enums';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { AddEditTaskCloseInfo } from '../../task-add-edit-core/models/enums';
import { GridButtonType } from '../../my-tasks-core';
import { WorkflowMenuMetaDataWrapper } from '../../workflow-menu-core';
import { GridData } from '../../task-add-edit-core';


@Component({
  selector: 'dps-case-task-manager',
  template: `
  <dps-case-task-layout *ngIf="showContent"
  [fontSizeClass]="fontSizeClass"
  [matterInfo]="matterInfo"
  [token]="token"
  [caseTaskData]="caseTaskData$ | async"
  [pageInfo]="pageInfo$ | async"
  [columnDef]="columnDef$ | async"
  (viewChange)="onViewChange($event)"
  (rowChange)="onRowChange($event)"
  (addEditTaskOut)="onAddEditTaskOut($event)"
  (refresh)="onRefresh()"
  >
  </dps-case-task-layout>
 `,
  styleUrls: []
})
export class CaseTaskManagerComponent extends BaseCaseTaskManager implements OnInit, OnChanges {

  @Input() matterInfo: MatterInfo;


  public caseTaskData$: any;
  public searchText$: any;
  public pageInfo$: any;
  public columnDef$: any;

  @Input() token: string;
  @Input() refreshCount: number;
  @Input() fontSizeClass: string;
  @Input() openCaseToken: string;
  @Input() showContent: boolean;


  constructor(store: Store<any>, public popupService: SystemJsPopupLoaderService, private injector: Injector) {
    super(store);
  }
  onAddEditTaskOut(event: { kind: GridButtonType, value: CaseTaskCore.CaseTask | WorkflowMenuMetaDataWrapper }) {
    let gridData: GridData;
    if (event && event.kind !== GridButtonType.RunCommand) {
      gridData = {
        ...event.value as CaseTaskCore.CaseTask,
        appCode: this.matterInfo.AppCode,
        appID: this.matterInfo.AppId,
        branchID: this.matterInfo.BranchId,
        client: this.matterInfo.ClientName,
        fileID: this.matterInfo.FileId,
        dateDone: (event.value as CaseTaskCore.CaseTask).datedn,
        folderName: '',
        matterDetails: this.matterInfo.MatterDetails,
        matterReferenceNo: this.matterInfo.MatterReferenceNo,
      };
    }

    if (event && event.kind === GridButtonType.AddTask) {
      this.addTaskClick(gridData);
    } else if (event && event.kind === GridButtonType.EditTask) {
      this.editTaskClick(gridData);
    } else if (event && event.kind === GridButtonType.Complete) {
      this.store.dispatch(new RequestToComplete(this.token, { row: gridData }));
    } else if (event && event.kind === GridButtonType.RunCommand) {
      this.store.dispatch(new RunWorkflowCommand(this.openCaseToken, this.injector, event.value as WorkflowMenuMetaDataWrapper));
    }
  }
  onRowChange(item) {
    this.store.dispatch(new CaseTaskCore.CaseTaskGridRowChange
      (this.token, { kind: RowItemChangeKind.IsExpand, row: item, value: '' }));
  }
  onViewChange(item) {
    this.store.dispatch(new CaseTaskCore.CaseTaskViewChange(this.token, item));
  }
  onSearchTextChanged(searchText) {
    this.store.dispatch(new CaseTaskCore.CaseTaskViewChange
      (this.token, { kind: ViewChangeKind.SearchText, value: searchText }));
  }
  // onRunCommand(value) {
  //   this.store.dispatch(new fileHistoryCore.CaseTaskViewChange
  //     (this.token, { kind: ItemChangeKind.RunWorkFlow, value: value }));
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterInfo) {
      const columnDef = [
        createDefultColumnDef('Toggle', { label: '', fxFlex: '32px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
        createDefultColumnDef('DateBy', { label: 'Do By', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
        createDefultColumnDef('TaskFor', { label: 'For', fxFlex: '54px', filterAnchor: 'start' }),
        createDefultColumnDef('PutOnBy', { label: 'By', fxFlex: '54px', filterAnchor: 'start' }),
        createDefultColumnDef('Note', { label: 'Note', fxFlex: '', filterAnchor: 'end' }),
        createDefultColumnDef('Action', { label: 'Action', fxFlex: '70px', filterAnchor: 'end' }, FieldType.Boolen),
        // createDefultColumnDef('action', { label: 'Actions', fxFlex: '54px', filterAnchor: 'end',
        //  filterHidden: true, disableShort: true }),
      ];

      this.token = 'InitCaseTask' + changes.matterInfo.currentValue.MatterReferenceNo;
      this.onChange(this.token, { columnDef: columnDef, matterInfo: this.matterInfo });
      this.caseTaskData$ = this.getCurrentGridData(this.token);
      this.searchText$ = this.getSearchText(this.token);
      this.columnDef$ = this.getColumnDef(this.token);
      // this.pageInfo$ = this.getPageEventByToken(this.token);
      this.pageInfo$ = this.store.select(CaseTaskCore.getCaseTaskPageEventByToken(this.token));
    }

    if (changes.refreshCount && !changes.refreshCount.firstChange) {
      if (changes.matterInfo) {
        if (changes.matterInfo.previousValue === changes.matterInfo.currentValue) {
          this.refresh(this.token);
        }
      } else {
        this.refresh(this.token);
      }
    }
  }

  ngOnInit() {
  }

  onRefresh() {
    this.refresh(this.token);
  }

  addTaskClick(value: GridData) {
    const inputData: any = {
      loginUser: value.taskFor,
      headerText: 'Add Task',
      documentFlowStatus: value.documentFlowStatus,
      matterInfo: value
    };
    this.openAddEditTask('ADD_TASK_POPUP', inputData);
  }
  editTaskClick(value: GridData) {
    const inputData: any = {
      loginUser: value.taskFor,
      headerText: 'Edit Task',
      documentFlowStatus: value.documentFlowStatus,
      matterInfo: value
    };
    this.openAddEditTask('EDIT_TASK_POPUP', inputData);
  }

  openAddEditTask(popupToken: string, addEditTaskInputData: any) {
    this.popupService.openAddEditTaskPopup(popupToken, addEditTaskInputData).subscribe((data: any) => {
      this.onRefresh();
      // if (data === AddEditTaskCloseInfo.ExitWithSaveSuccess) {
      //   this.onRefresh();
      // }
    });
  }

}

