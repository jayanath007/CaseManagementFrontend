import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseRootFoldersListManager } from '../../drive-core/containers/base-root-folders-list-manager';
import { DriveItem } from '../../core/lib/microsoft-graph';
import { MatDialog } from '@angular/material';
import { TextInsertDialogInput, TextInsertDialogComponent } from '../../shared';

@Component({
    selector: 'dps-root-folders-list-manager',
    template: `
    <dps-root-folders-list
        [isDriveFolderSelect]="isDriveFolderSelect"
        [stikeyFolders]="stikeyFolders$|async"
        [activeView]="activeView$|async"
        [activeDrive]="activeDrive$|async"
        [loading]="loading$|async"
        [isPopup]="isPopup"
        (openItem)="onOpenItem($event)"
        (driveSearch)="onDriveSearch($event)"
        (addNew)="onAddNew($event)"
        (uploadItem)="onUploadItem($event)"
    ></dps-root-folders-list>
    `,
})
export class RootFoldersListManagerComponent extends BaseRootFoldersListManager implements OnInit {

    @Input() isDriveFolderSelect: boolean;
    @Input() isPopup: boolean;

    @Output() driveFolderSelect = new EventEmitter();

    constructor(store: Store<any>, protected dialog: MatDialog) {
        super(store);
    }
    ngOnInit() {
        super.onInit(this.isPopup);
    }

    onOpenItem(item: DriveItem) {
        super.onOpenItem(item);
        this.driveFolderSelect.emit();
    }
    onAddNew({ activeView, type }) {
        switch (type) {
            case 'Folder':
                this.onCreateFolder(activeView);
                break;
            default:
                this.onAddNewFile(activeView, type);
                break;
        }
    }
    onCreateFolder(activeView) {
        const dialogData: TextInsertDialogInput = {
            content: {
                title: 'Folder',
                details: '',
                message: 'Enter your folder name',
                placeholder: ''
            },
            allowEmpty: false,
            text: '',
            showCancelBtn: true,
        };
        const dialogRef = this.dialog.open(TextInsertDialogComponent, {
            data: dialogData,
            width: '350px',
            disableClose: true,
            panelClass: 'dps-notification'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                super.onCreateFolder(activeView, result);
            }
        });

    }
    onAddNewFile(activeView, type) {
        const dialogData: TextInsertDialogInput = {
            content: {
                title: 'New Document',
                details: '',
                message: 'Enter a name',
                placeholder: ''
            },
            allowEmpty: false,
            text: '',
            showCancelBtn: true,
            extension: type
        };
        const dialogRef = this.dialog.open(TextInsertDialogComponent, {
            data: dialogData,
            width: '350px',
            disableClose: true,
            panelClass: 'dps-notification'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                super.onAddNewFile(activeView, result + type);
            }
        });
    }
}
