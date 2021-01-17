import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    selector: 'dps-diary-folder-popup',
    template: `<dps-diary-folder-manager #manager
                    [inputData]="data.input"
                    [token]="data.token"
                    (closePopUp)="onClose()">
                        <dps-diary-folder-layout
                            [isLoading]="manager.isLoading$|async"
                            [folders]="manager.folders$|async"
                            [isSaving]="manager.isSaving$|async"
                            [folderDataSource]="manager.folderDataSource$ | async"
                            [folderFlatData]="manager.folderFlatData$ | async"
                            [isDurty]="manager.isDurty$ | async"
                            (addFolder)="manager.onAddFolder($event)"
                            (deleteFolder)="manager.onDeleteFolder($event)"
                            (cancelDeletedFolder)="manager.onCancelDeletedFolder($event)"
                            (changeIsDefault)="manager.onChangeIsDefault($event)"
                            (saveFoldersChanges)="manager.onSaveFolders($event)"
                            (changeFolderName)="manager.onChangeFolderName($event)"
                            (changeRootFolder)="manager.onChangeRootFolder($event)"
                            (addRootFolder)="manager.onAddRootFolder($event)"
                            (addNewRootFolder)="manager.onAddNewRootFolder($event)"
                            (closePopUp)="onClose()">
                        </dps-diary-folder-layout>
                </dps-diary-folder-manager>`,
    styles: []
})



export class DiaryFolderPopupComponent implements OnInit {

    constructor(@Inject(MAT_DIALOG_DATA) public data: { input: number, token: string },
        public dialogRef: MatDialogRef<DiaryFolderPopupComponent>) { }

    ngOnInit() {

    }

    onClose() {
        this.dialogRef.close();
    }

}
