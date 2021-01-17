import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { ActionType, Attachments } from '../../../add-note-core/models/interfaces';
import { PasswordConfirmDialoagComponent } from '../../../shared/components/password-confirm-dialog/password-confirm-dialog.component';
import { InsertPasswordDialog } from '../../../shared';
import { PasswordInsertComponent } from '../../../shared/components/password-insert-dialog/password-insert.component';
import { checkUploadFileIsBlacklisted, showInforDialog } from '../../../core/utility/DpsUtility';
import { InfoDialogType } from './../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-add-edit-task-file-upload',
  templateUrl: './add-edit-task-file-upload.component.html',
  styleUrls: ['./add-edit-task-file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddEditTaskFileUploadComponent implements OnInit, OnChanges {
  @Input() fileData: any;
  @Input() password: string;
  @Input() fileUploadDisable: boolean;
  @Input() hasPassword: boolean;

  @Output() uploadedFile = new EventEmitter<any>();
  @Output() updatePassword = new EventEmitter<string>();
  @Output() unLockPassword = new EventEmitter<string>();
  constructor(public dialog: MatDialog) { }
  isEnableRemover = false;
  isEnablePassword = false;
  filename = '';
  isUpload = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fileData) {
      if (this.fileData) {
        this.isEnablePassword = true;
        this.isEnableRemover = true;
        this.filename = this.fileData.name;
      } else {
        this.isEnablePassword = false;
        this.filename = '';
      }
    }
  }

  fileUpload(files) {
    if (files[0]) {
      if (checkUploadFileIsBlacklisted(files[0].name)) {
        showInforDialog('Harmful file detection',
          'You are try to upload harmful file type, please contact admin', InfoDialogType.warning, this.dialog);
      } else {
        this.changeFileData(files[0], files[0].name);
        this.isEnableRemover = true;
      }
    }
  }

  fileRemove() {
    this.changeFileData(null, '');
    this.isEnableRemover = false;
    // const fileUploadInput = <HTMLInputElement>document.getElementById('taskFileUploader');
    // fileUploadInput.value = null;
  }
  changeFileData(file, newfileName) {
    this.uploadedFile.emit(file);
    this.filename = newfileName;
  }

  // onUploadBTNClick() {
  //   const fileUploadInput = document.getElementById('taskFileUploader');
  //   const fileUploadBtn = document.getElementById('fileBtn');
  //   fileUploadInput.click();
  // }
  ngOnInit() {
    if (this.fileData) {
      this.filename = this.fileData.name;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PasswordConfirmDialoagComponent, {
      width: '255px',
      data: { name: 'Document Password', password: this.password, confirmPassword: this.password, passwordHide: true },
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePassword.emit(result.password);
      }
    }
    );
  }

  onOpenEnterPassword(): void {
    const dialogData: InsertPasswordDialog = {
      content: { title: 'Change Document', details: 'This document is protected. You must provide a password to change it.', message: '' },
      data: { password: '' }
    };

    const dialogRef = this.dialog.open(PasswordInsertComponent, {
      width: '250px',
      data: dialogData,
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(result => {
      {
        if (result) {
          this.unLockPassword.emit(result.data.password);
        } else {

        }
      }
    });
  }
}
