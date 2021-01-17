import { DriveContextMenueComponent } from './../components/drive-context-menue/drive-context-menue.component';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExplorerViewType, ItemChangeKind } from '../../safe-box-explorer-core';
import { BaseDriveFolderContentManager } from '../../drive-core/containers/base-drive-folder-content-manager';
import { ItemView, SEARCH_VIEW_ID, ItemClipboard } from '../../drive-core';
import { MatDialog } from '@angular/material';
import { TextInsertDialogInput, TextInsertDialogComponent, InforDialogData, InforDialogComponent } from '../../shared';
import { SafeBoxType } from '../../core';

@Component({
    selector: 'dps-drive-folder-content-manager',
    template: `
        <mat-progress-bar mode="indeterminate" *ngIf="(activeView$|async)?.loading || (isCopying$|async)"></mat-progress-bar>
        <div class="dps-drive-folder-content" *ngIf="activeView$|async"
            (contextmenu)="contextmenuFolderOpen($event,driveFolderMenuInContent)">
            <dps-detail-view *ngIf="viewType===ExplorerViewType.Detail"
                [activeView]="activeView$|async"
                [items]="itemList$|async"
                [copyItems]="clipboard$|async"
                [isPopup]="isPopup"
                [sortOrder]="sortOrder$|async"
                [isSearching]="isSearching$|async"
                [copyFrom]="copyFrom$|async"
                (openItem)="onOpenItem($event)"
                (selecteItem)="onSelecteItem($event)"
                (changeItem)="onChangeItem($event)"
                (loadMore)="onLoadMore($event)"
                (changeSortOrder)="onChangeSortOrder($event)"
            ></dps-detail-view>
            <dps-tile-view *ngIf="viewType===ExplorerViewType.Tile"
                [activeView]="activeView$|async"
                [items]="itemList$|async"
                [copyItems]="clipboard$|async"
                [isSearching]="isSearching$|async"
                [copyFrom]="copyFrom$|async"
                (openItem)="onOpenItem($event)"
                (selecteItem)="onSelecteItem($event)"
                (changeItem)="onChangeItem($event)"
                (loadMore)="onLoadMore($event)"
            ></dps-tile-view>
            <dps-icon-view *ngIf="viewType===ExplorerViewType.Icon"
                [activeView]="activeView$|async"
                [items]="itemList$|async"
                [copyItems]="clipboard$|async"
                [isSearching]="isSearching$|async"
                [copyFrom]="copyFrom$|async"
                (openItem)="onOpenItem($event)"
                (selecteItem)="onSelecteItem($event)"
                (changeItem)="onChangeItem($event)"
                (loadMore)="onLoadMore($event)"
            ></dps-icon-view>
            <dps-list-view *ngIf="viewType===ExplorerViewType.List"
                [activeView]="activeView$|async"
                [items]="itemList$|async"
                [copyItems]="clipboard$|async"
                [isSearching]="isSearching$|async"
                [copyFrom]="copyFrom$|async"
                (openItem)="onOpenItem($event)"
                (selecteItem)="onSelecteItem($event)"
                (changeItem)="onChangeItem($event)"
                (loadMore)="onLoadMore($event)"
            ></dps-list-view>
            <div class="dps-empty-folder" [ngStyle]="{'margin-left': isPopup?'68px':''}"
                *ngIf="(itemList$|async)?.length < 1 && !(activeView$|async)?.loading">
                <h2>
                    <i class="fa fa-folder-open-o" aria-hidden="true"></i>
                </h2>
                <h3>This folder is empty.</h3>
            </div>
            <dps-drive-context-menue #driveFolderMenuInContent id="dps-drive-folder-menu"
                [activeView]="activeView$|async"
                [cutCopyItems]="clipboard$|async"
                [copyFrom]="copyFrom$|async"
                (paste)="onPaste($event)"
                (refresh)="onRefresh($event)"
                (addNew)="onAddNew($event)"
            ></dps-drive-context-menue>
        </div>
    `,
    styles: [`
        .dps-empty-folder{
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -66px;
            margin-left: -83px;
            font-weight: 100;
            color: #666666;
        }
        .dps-empty-folder h2{
            font-size:64px;
            text-align: center;
            margin: 0px;
        }
        .dps-empty-folder h3{
            text-align: center;
            font-family: $primary-font-stack;
            font-weight: 400;
        }
        .dps-drive-folder-content{
            height:calc(100% - 5px);
        }
        dps-drive-context-menue{
            position: fixed;
        }
    `]
})
export class DriveFolderContentManagerComponent extends BaseDriveFolderContentManager implements OnInit {

    @Input() viewType: ExplorerViewType;
    @Input() isPopup: boolean;

    ExplorerViewType = ExplorerViewType;

    constructor(store: Store<any>, protected dialog: MatDialog) {
        super(store);
    }
    ngOnInit() {
        super.onInit(this.isPopup);
    }

    contextmenuFolderOpen(event, driveContextMenue: DriveContextMenueComponent) {
        event.preventDefault();
        event.stopPropagation();
        if (driveContextMenue.activeView.viewPath !== SEARCH_VIEW_ID && !this.isPopup) {
            document.getElementById('dps-drive-folder-menu').style.top = event.pageY + 'px';
            document.getElementById('dps-drive-folder-menu').style.left = event.pageX + 'px';
            setTimeout(() => {
                driveContextMenue.contextMenu.openMenu();
            }, 10);
        }

    }
    onPaste({ activeView, cutCopyItems, copyFrom }: { activeView: ItemView, cutCopyItems: ItemClipboard, copyFrom: SafeBoxType }) {
        if (cutCopyItems && cutCopyItems.type === 'cut' &&
            activeView.owner.parentReference.driveId !== cutCopyItems.items[0].parentReference.driveId) {
            const dialogInfoData: InforDialogData = {
                content: {
                    title: 'Cut and paste',
                    message: `<p>The option to cut and paste is not supported from one drive to another.
                     Therefore, your request is processed as a copy and paste.</p>`
                },
                contentParams: {},
                data: { messageType: 'alert' }
            };
            const dialogInfoRef = this.dialog.open(InforDialogComponent, {
                data: dialogInfoData,
                width: '350px',
                panelClass: 'dps-notification'
            });
            dialogInfoRef.afterClosed().subscribe(() => {
                this.onChangeItem({
                    kind: ItemChangeKind.Paste, value: {
                        item: activeView.owner,
                        viewPath: activeView.viewPath, copyFrom
                    }
                });
            });
        } else {
            this.onChangeItem({ kind: ItemChangeKind.Paste, value: { item: activeView.owner, viewPath: activeView.viewPath, copyFrom } });
        }

    }

    onRefresh(item: ItemView) {
        super.onRefresh(item.viewPath);
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
