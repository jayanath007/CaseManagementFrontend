import { MatDialog } from '@angular/material';
import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';

import { PasswordConfirmDialoagComponent } from '../../../shared/components/password-confirm-dialog/password-confirm-dialog.component';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { AddNoteItemData } from '../../../add-note-core/models/interfaces';

@Component({
  selector: 'dps-add-note-file-upload',
  templateUrl: './add-note-file-upload.component.html',
  styleUrls: ['./add-note-file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNoteFileUploadComponent implements OnInit, OnChanges {
  @Input() itemDataList: AddNoteItemData[];
  @Input() password: string;
  @Input() fileUploadDisable: boolean;
  @Input() isEdit: boolean;
  @Input() isLoading: boolean;
  @Input() itemsLoading: boolean;

  @Output() uploadedFile = new EventEmitter<any>();
  @Output() updatePassword = new EventEmitter<string>();

  constructor(public dialog: MatDialog, public popupService: SystemJsPopupLoaderService) { }
  isEnableRemover = false;
  isEnablePassword = false;
  filename = '';
  isUpload = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.itemDataList) {
      if (this.itemDataList && this.itemDataList.length > 0) {
        const item = this.itemDataList[0];
        this.isEnablePassword = false;
        this.filename = item.letterName || item.name;
      } else {
        this.isEnablePassword = false;
        this.filename = '';
      }
    }
    this.isEnableRemover = !this.fileUploadDisable && this.itemDataList && this.itemDataList.length === 1;
  }

  fileUpload(files: File[]) {
    if (files) {
      this.uploadedFile.emit(files);
      this.isEnableRemover = files.length === 1;
    }
  }
  onCloud() {

    this.popupService.openDrivePopup(null, null).subscribe((val) => {
      const attachements = val ? val.filter(item => item.selected && item.data.file).map(item => item.data) : null;
      if (attachements) {
        this.uploadedFile.emit(attachements);
        this.isEnableRemover = attachements.length === 1;
      }
    });

  }
  fileRemove() {
    this.uploadedFile.emit(null);
    this.isEnableRemover = false;
  }


  onUploadBTNClick() {
    const fileUploadInput = document.getElementById('diaryFileUploader');
    const fileUploadBtn = document.getElementById('fileBtn');
    fileUploadInput.click();
  }
  ngOnInit() {
    if (this.itemDataList && this.itemDataList.length > 0) {
      this.filename = this.itemDataList[0].name;
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
}
