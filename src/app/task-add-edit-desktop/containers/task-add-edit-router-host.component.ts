import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';
import { ComponentBase } from '../../core';

@Component({
    selector: 'dps-task-add-edit',
    template: `
        <dps-task-add-edit-manager #taskAddEditManager [taskAddEditToken]="data.token" [inputData]="data.input"
        (closePopup)="onClose($event)">
        <dps-task-add-edit-layout
            [addEditTaskLoading]="taskAddEditManager.addEditTaskLoading$ | async"
            [taskHeaderName]="taskAddEditManager.headerText$  | async"
            [feeEarnerList]="taskAddEditManager.feeEarnerList$ | async"
            [folderList]="taskAddEditManager.folderList$ | async"
            [actionTypeList]="taskAddEditManager.actionTypeList$ | async"
            [loginUser]="taskAddEditManager.loginUser$ | async"
            [isDirty]="taskAddEditManager.isDirty$ | async"
            [matterInfo]="taskAddEditManager.matterInfo$ | async"
            [taskDate]="taskAddEditManager.taskDate$ | async"
            [taskNote]="taskAddEditManager.taskNote$ | async"
            [fileUploadDisable]="'false'"
            [password]="taskAddEditManager.filePassWordInfo$ | async"
            [fileData]="taskAddEditManager.fileDataInfo$ | async"
            [infoMsg]="taskAddEditManager.infoMsg$ | async"
            [hasPassword]="taskAddEditManager.hasPassword$ | async"
            (upateSelectedDate)="taskAddEditManager.onDateChange(taskAddEditManager.taskAddEditToken,$event)"
            (updateNote)="taskAddEditManager.onNoteChange(taskAddEditManager.taskAddEditToken,$event)"
            (selectedFeeEarnerChanged)="taskAddEditManager.onFeeEarnerChanged(taskAddEditManager.taskAddEditToken,$event)"
            (selectedFolderChanged)="taskAddEditManager.onFolderChanged(taskAddEditManager.taskAddEditToken,$event)"
            (selectedActionChanged)="taskAddEditManager.onActionTypeChanged(taskAddEditManager.taskAddEditToken,$event)"
            (selectedMatterObj)="taskAddEditManager.onSelectedMatterObj(taskAddEditManager.taskAddEditToken,$event)"
            (uploadedFile) = "taskAddEditManager.uploadedFileData($event)"
            (updatePassword) = "taskAddEditManager.updatePasswordData($event)"
            (taskAddEditPopupClosed)="taskAddEditManager.taskAddEditPopupClosed($event)"
            (taskAddEditSaveData)="taskAddEditManager.taskAddEditSaveData(taskAddEditManager.taskAddEditToken,$event)"
            (unLockPassword)="taskAddEditManager.onUnLockPassword($event)"
        ></dps-task-add-edit-layout>
        </dps-task-add-edit-manager>
    `,
    styles: []
})
export class TaskAddEditRouterHostComponent implements OnInit {
    constructor( @Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
        public dialogRef: MatDialogRef<TaskAddEditRouterHostComponent>) { }

    ngOnInit() {

    }
    onClose(event) {
        this.dialogRef.close(event);
    }
}
