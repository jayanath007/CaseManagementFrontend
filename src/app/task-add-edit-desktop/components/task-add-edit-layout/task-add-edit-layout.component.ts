
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import {
  ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind,
  InforDialogComponent, InforDialogData
} from '../../../shared';
import { MatDialog, MatSnackBar } from '@angular/material';
import { FeeEarner, Folder, ActionType, MatterResponce, MSGInfo, GridData } from '../../../task-add-edit-core/models/interface';
import { AddEditTaskCloseInfo } from '../../../task-add-edit-core/models/enums';
import { BillingRequestInputData } from '../../../billing-request-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
  selector: 'dps-task-add-edit-layout',
  templateUrl: './task-add-edit-layout.component.html',
  styleUrls: ['./task-add-edit-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskAddEditLayoutComponent implements OnInit, OnChanges {

  @Input() addEditTaskLoading: boolean;
  @Input() taskHeaderName: string;
  @Input() feeEarnerList: FeeEarner[];
  @Input() folderList: Folder[];
  @Input() actionTypeList: ActionType[];
  @Input() fileUploadDisable: boolean;
  @Input() password: string;
  @Input() fileData: any;
  @Input() loginUser: string;
  @Input() isDirty: boolean;
  @Input() matterInfo: GridData;
  @Input() taskDate: string;
  @Input() taskNote: string;
  @Input() infoMsg: MSGInfo;
  @Input() hasPassword: boolean;

  @Output() selectedFeeEarnerChanged = new EventEmitter<FeeEarner>();
  @Output() selectedFolderChanged = new EventEmitter<Folder>();
  @Output() selectedActionChanged = new EventEmitter<ActionType>();
  @Output() selectedMatterObj = new EventEmitter<MatterResponce>();
  @Output() upateSelectedDate = new EventEmitter<string>();
  @Output() updateNote = new EventEmitter<string>();
  @Output() unLockPassword = new EventEmitter<string>();
  @Output() uploadedFile = new EventEmitter<any>();
  @Output() taskAddEditPopupClosed = new EventEmitter<AddEditTaskCloseInfo>();
  @Output() updatePassword = new EventEmitter<string>();
  @Output() taskAddEditSaveData = new EventEmitter<any>();

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.infoMsg && !changes.infoMsg.isFirstChange() && changes.infoMsg.currentValue) {
      if (this.infoMsg.showMsg && this.infoMsg.exitPopUp) {

        this.taskAddEditPopupClosed.emit(AddEditTaskCloseInfo.ExitWithSaveSuccess);
        // setTimeout(() => {
        //   this.openMSGBox(this.infoMsg.msg, 'success', true);
        // }, 100);
      } else if (this.infoMsg.showMsg && !this.infoMsg.exitPopUp) {
        setTimeout(() => {
          this.openMSGBox(this.infoMsg.msg, 'alert', false);
        }, 100);
      }
    }
  }

  openInfoSnackBar(msg) {
    if (msg) {
      this.snackBar.open(msg, '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  onFeeEarnerChanged(value: FeeEarner) {
    this.selectedFeeEarnerChanged.emit(value);
  }
  onFolderChanged(value: Folder) {
    this.selectedFolderChanged.emit(value);
  }
  onActionTypeChanged(value: ActionType) {
    this.selectedActionChanged.emit(value);
  }
  onDateChange(event) {
    this.upateSelectedDate.emit(event);
  }
  onNoteChange(event) {
    this.updateNote.emit(event);
  }
  onUploadedFile(uploadedFile) {
    this.uploadedFile.emit(uploadedFile);
  }
  onUpdatePassword(password) {
    this.updatePassword.emit(password);
  }
  changMatterObj(event) {
    this.selectedMatterObj.emit(event);
  }

  openMSGBox(msg: string, type, isClose: boolean) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Task Add/Edit',
        message: msg
      },
      contentParams: {},
      data: { messageType: type }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification',
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (isClose) {
        this.taskAddEditPopupClosed.emit(AddEditTaskCloseInfo.ExitWithSaveSuccess);
      }
    });
  }

  onClose() {
    if (this.isDirty) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Confirm . . .',
          message: 'Changes have been made! Do you want to go back and save them?',
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
          this.taskAddEditPopupClosed.emit(AddEditTaskCloseInfo.ExitByUser);
        }
      });
    } else {
      this.taskAddEditPopupClosed.emit(AddEditTaskCloseInfo.ExitByUser);
    }
  }
  onSubmitData() {
    let displayMsg = null;
    if (this.taskHeaderName !== 'Edit Task' &&
      (!this.matterInfo || !this.matterInfo.branchID || !this.matterInfo.appID || !this.matterInfo.fileID)) {
      displayMsg = 'Please select the matter';
    } else if (!this.taskNote) {
      displayMsg = 'Note for diary is a required field and must be provided.';
    } else {
      displayMsg = null;
    }
    if (displayMsg) {
      this.openMSGBox(displayMsg, 'alert', false);
    } else {
      this.taskAddEditSaveData.emit('save');
    }
  }

  onUnLockPassword(password: string): void {
    this.unLockPassword.emit(password);
  }

  onEditBill() {
    const billingRequestInputData: BillingRequestInputData = {
      matterData: { matterReferenceNo: this.matterInfo.matterReferenceNo, branchID: this.matterInfo.branchID },
      billRequestId: this.matterInfo.billRequestId,
      diaryId: this.matterInfo.taskID
    };
    this.popupService.billingRequestPopup('billingRequestViewPopup', billingRequestInputData);
  }

}
