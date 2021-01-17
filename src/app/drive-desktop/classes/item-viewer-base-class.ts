import { DriveItem } from './../../core/lib/microsoft-graph';
import { Output, EventEmitter, Input } from '../../../../node_modules/@angular/core';
import { DriveListItemWrapper, ItemView, ItemClipboard } from '../../drive-core';
import { ItemChangeKind } from '../../safe-box-explorer-core';
import { MatDialog } from '@angular/material';
import {
    TextInsertDialogInput, TextInsertDialogComponent, AttachmentIconPipe,
    ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResult, ConfirmDialogResultKind,
    FailDialogData, FailDialogComponent, ConfirmDialogComponentWithCancel, ConfirmDialogWithCancelResultKind
} from '../../shared';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { MatterInputData, SafeBoxType } from '../../core';
import { DiaryRecType, LegalAid, MatterInfo } from '../../add-note-core';
import { AddNoteInPutData, AddNoteItemsType, AddNoteItem } from '../../core/lib/addNote';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


export class ItemViewerBaseClass {

    @Input() items: DriveListItemWrapper[];
    @Input() copyItems: ItemClipboard;
    @Input() activeView: ItemView;
    @Input() isPopup: boolean;
    @Input() isSearching: boolean;
    @Input() copyFrom: SafeBoxType;

    @Output() selecteItem = new EventEmitter<any>();
    @Output() changeItem = new EventEmitter<{
        kind: ItemChangeKind,
        value: DriveListItemWrapper | DriveListItemWrapper[] | string | DriveItem |
        {
            dragItems?: any,
            item: DriveListItemWrapper | DriveItem
            viewPath?: string,
            newName?: string,
            copyFrom?: SafeBoxType
        }
    }>();
    @Output() openItem = new EventEmitter();
    @Output() loadMore = new EventEmitter();

    dragElement;

    get selectedItems(): DriveListItemWrapper[] {
        return this.items ? this.items.filter(item => item.selected) : [];
    }

    constructor(protected dialog: MatDialog, protected attachmentIcon: AttachmentIconPipe,
        private popupService: SystemJsPopupLoaderService) { }

    contextmenuOpen(event, driveContextMenue, item: DriveListItemWrapper) {
        event.preventDefault();
        event.stopPropagation();
        if (this.isPopup) {
            return;
        }
        if (!(this.selectedItems && this.selectedItems.find(val => val.data.id === item.data.id))) {
            this.onSelect(event, item);
        }

        document.getElementById(item.data.id).style.top = event.pageY + 'px';
        document.getElementById(item.data.id).style.left = event.pageX + 'px';
        setTimeout(() => {
            driveContextMenue.contextMenu.openMenu();
        }, 10);
    }

    onSelect(event: MouseEvent, item: DriveListItemWrapper) {
        if (this.isPopup && item.data.folder) {
            return;
        }
        if (event.ctrlKey) {
            this.selecteItem.emit({ viewPath: this.activeView.viewPath, wrapper: item, isMulti: true });
        } else {
            this.selecteItem.emit({ viewPath: this.activeView.viewPath, wrapper: item, isMulti: false });
        }
    }

    isCutItem(item: DriveListItemWrapper) {
        return this.copyFrom === SafeBoxType.Drive && this.copyItems && this.copyItems.type === 'cut' &&
            this.copyItems.items ? (!!this.copyItems.items.find(val =>
                val.id === item.data.id)) : false;
    }
    onDownloadFile() {
        if (this.selectedItems) {
            this.changeItem.emit({ kind: ItemChangeKind.Download, value: this.selectedItems[0].data });
        }
    }
    onShareFile() {
        if (this.selectedItems) {
            this.changeItem.emit({ kind: ItemChangeKind.Share_File, value: this.selectedItems });
        }
    }

    onDeleteFile() {
        if (this.selectedItems) {
            const dialogData: ConfirmDialogData = {
                content: {
                    title: 'Delete?',
                    message: 'Are you sure you want to delete the item(s)?'
                },
                data: null
            };

            const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: dialogData,
                width: '350px',
                panelClass: 'dps-notification'
            });

            deleteDialogRef.afterClosed().subscribe((result: ConfirmDialogResult) => {
                if (result && result.kind === ConfirmDialogResultKind.Confirmed) {
                    const deleteItems = this.selectedItems.filter(val => !(val.data.folder && val.data.folder.childCount > 0));
                    if (deleteItems.length > 0) {
                        this.changeItem.emit({
                            kind: ItemChangeKind.Delete,
                            value: {
                                item: this.activeView.owner,
                                viewPath: this.activeView.viewPath, dragItems: deleteItems.map(val => val.data)
                            },
                        });
                    }
                    const unDeleteItems = this.selectedItems.filter(val => (val.data.folder && val.data.folder.childCount > 0));
                    if (unDeleteItems.length > 0) {

                        const dialogData1: FailDialogData = {
                            messageBody: 'You have to delete all the items in this folder(s) before you can delete the folder.',
                            messageHeader: unDeleteItems.length + ` item(s) wasn't delete`,
                            detailStatus: unDeleteItems
                                .map(val => ({
                                    title: val.data.name,
                                    message: 'Has ' + val.data.folder.childCount + ' item(s) in this folder'
                                })),
                        };
                        const dialogRef = this.dialog.open(FailDialogComponent, {
                            data: dialogData1,
                            width: '450px',
                            panelClass: 'dps-notification'
                        });
                    }
                }

            });
        }
    }

    onRenameFile() {
        if (this.selectedItems && this.selectedItems.length === 1) {
            const item = this.selectedItems[0];
            const extension = item.data.file ? '.' + this.attachmentIcon.transform(item.data.name, 'type') : '';
            const name = item.data.file ? item.data.name.replace(new RegExp(extension + '$'), '') : item.data.name;
            const dialogData: TextInsertDialogInput = {
                content: {
                    title: 'Rename',
                    details: '',
                    message: 'Enter a new name for ' + item.data.name,
                    placeholder: ''
                },
                allowEmpty: false,
                text: name,
                showCancelBtn: true,
                extension: extension
            };
            const dialogRef = this.dialog.open(TextInsertDialogComponent, {
                data: dialogData,
                width: '350px',
                disableClose: true,
                panelClass: 'dps-notification'
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.changeItem.emit({
                        kind: ItemChangeKind.Rename,
                        value: { item: item.data, newName: result + extension }
                    });
                }
            });
        }
    }
    onDragStart(event, item: DriveListItemWrapper) {
        this.dragElement = document.getElementById('dragPreView');
        if (!(this.selectedItems && this.selectedItems.find(val => val.data.id === item.data.id))) {
            this.onSelect(event, item);
        }
    }

    onDrop({ event, dragData, dragDataType }, item: DriveItem) {
        event.preventDefault();
        event.stopPropagation();
        if (dragDataType === 'Files') {
            for (let i = 0; i < dragData.length; i++) {
                this.changeItem.emit({
                    kind: ItemChangeKind.Upload,
                    value: { dragItems: dragData[i], item: item }
                });
            }
        } else if (dragDataType === 'driveFile') {
            this.changeItem.emit({
                kind: ItemChangeKind.Move,
                value: { dragItems: this.selectedItems.map(val => val.data), item: item, viewPath: this.activeView.viewPath }
            });
        }
    }

    onCut() {
        if (this.selectedItems) {
            this.changeItem.emit({ kind: ItemChangeKind.Cut, value: this.activeView.viewPath });
        }
    }

    onCopy() {
        if (this.selectedItems) {
            this.changeItem.emit({ kind: ItemChangeKind.Copy, value: this.activeView.viewPath });
        }
    }

    onPaste(item: DriveListItemWrapper) {
        this.changeItem.emit({
            kind: ItemChangeKind.Paste,
            value: { item: item.data, viewPath: this.activeView.viewPath, copyFrom: this.copyFrom }
        });
    }
    onOpen(item) {
        this.openItem.emit({ viewPath: this.activeView.viewPath, wrapper: item });
    }
    onLoadMore() {
        this.loadMore.emit(this.activeView.viewPath);
    }
    trackByFn(index, item) {
        return item ? item.data.id : '';
    }
    onAttachToDPSFile() {
        const matterInputData: MatterInputData = { isMatterSearch: false };
        this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData).subscribe((result: MatterInfo) => {
            if (!result) {
                return '';
            }
            const attachement = this.items.filter(item => item && item.selected && item.data.file).map(item => item.data);
            if (attachement && attachement.length > 0) {
                const matterData = {
                    MatterReferenceNo: result.MatterReferenceNo, BranchID: result.BranchID,
                    AppID: result.AppID, FeeEarner: result.FeeEarner,
                    ClientName: result.ClientName, RateCategory: null, FileID: result.FileID,
                    AppCode: result.AppCode, eBilling: result.eBilling, isPlotMasterMatter: result.isPlotMasterMatter,
                    isProspectMatter: result.isProspectMatter,
                    isLegalAid: result.isLegalAid
                };
                this.popupService.openAddNotePopupWithAttachments(
                    'mainAddNotePopup', attachement, AddNoteItemsType.DriveItems,
                    matterData, DiaryRecType.LETTER_IN, LegalAid.NotLegalAid
                );
            }
        });
    }

}





