
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { checkExceedsMaximumFileSize, getConvertFileToMB } from '../../core/lib/files';
import { MatDialog } from '@angular/material';
import { getExtention } from '../../utils/file';
import { checkUploadFileIsBlacklisted } from '../../core/utility/DpsUtility';
import { FailDialogComponent } from './fail-dialog/fail-dialog.component';

@Component({
    selector: 'dps-file-uploader',
    template: ` <input [id]="inputId?inputId:'fileInput'" type="file" class="ng-hide" [accept]="accept"
                    (change)="onFileUpload($event)" style="display:none" multiple *ngIf="multiple===true"/>
                <input [id]="inputId?inputId:'fileInput'" type="file" class="ng-hide"
                    (change)="onFileUpload($event)" style="display:none" *ngIf="multiple!==true" [accept]="accept"/>`
})
export class FileUploaderComponent implements OnInit {
    @Input() multiple: boolean;
    @Input() inputId: string;
    @Input() accept: string;
    @Input() maxSize = 30;
    @Output() fileUpload = new EventEmitter<File[]>();
    constructor(private dialog: MatDialog) { }

    ngOnInit() {
    }
    onFileUpload(event) {
        if (event.srcElement.files && event.srcElement.files.length > 0) {
            const validFiles: File[] = [];
            const failDialogDetails: { title: string, message: string }[] = [];
            for (let i = 0; i < event.srcElement.files.length; i++) {
                const f = event.srcElement.files[i];
                if (checkExceedsMaximumFileSize(f, this.maxSize)) {
                    failDialogDetails.push({
                        title: f.name,
                        message: `Exceeds the maximum file-size -${getConvertFileToMB(f).toFixed(2).toString()} MB`
                    });
                } else if (checkUploadFileIsBlacklisted(f.name)) {
                    failDialogDetails.push({
                        title: f.name,
                        message: `Harmful file type -${getExtention(f.name)}`
                    });
                } else {
                    validFiles.push(f);
                }
            }
            if (failDialogDetails && failDialogDetails.length > 0) {
                const dialogRef = this.dialog.open(FailDialogComponent, {
                    data: {
                        messageHeader: 'Uploading file',
                        messageBody: `The total size of attachment(s) that can be attached is 30MB.
                         Please try to attach less than 30 MB item(s).`,
                        detailStatus: failDialogDetails
                    },
                    width: '400px',
                    disableClose: true,
                    hasBackdrop: true,
                    panelClass: 'dps-notification'
                });
                dialogRef.afterClosed().subscribe(() => this.fileUpLoading(validFiles));
            } else {
                this.fileUpLoading(validFiles);
            }
        }
    }

    fileUpLoading(files: File[]) {
        if (files && files.length > 0) {
            this.fileUpload.emit(files);
        }
    }

    public onFileUploadBtnClick() {
        const fileUploadInput = <HTMLInputElement>document.getElementById(this.inputId ? this.inputId : 'fileInput');
        fileUploadInput.value = null;
        fileUploadInput.click();
    }
    clearFiles() {
        const fileUploadInput = <HTMLInputElement>document.getElementById(this.inputId ? this.inputId : 'fileInput');
        fileUploadInput.value = null;
    }


}
