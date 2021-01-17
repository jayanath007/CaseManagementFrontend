import { Output, EventEmitter, Input, OnInit } from '../../../../node_modules/@angular/core';
import { TreeNodeItem, Blob } from '../../safe-box-explorer-core';
import { ItemChangeKind } from '../../safe-box-explorer-core/models/enum';


export class ItemViewerBaseClass {

    @Input() treeNodeItem: TreeNodeItem;
    @Input() selectedBlobData: Blob[];
    @Input() copyItems: { type: 'copy' | 'cut', path: string[] };
    @Input() selectedFolder: string;
    @Output() onExpand = new EventEmitter<{ item: TreeNodeItem }>();
    @Output() selectedBlobCon = new EventEmitter<Blob[]>();
    @Output() changeFolderItem = new EventEmitter<{ kind: ItemChangeKind, value: { item: any, path: string } }>();
    @Output() changeFileItem = new EventEmitter<{ kind: ItemChangeKind, value: Blob | Blob[] | { item: any, path: string } }>();

    dragElement;
    constructor() { }

    expand(event) {
        this.onExpand.emit({ item: event });
    }

    contextmenuOpen(event, safeboxContextMenue, blob: Blob) {
        if (!(this.selectedBlobData && this.selectedBlobData.find(val => val.Name === blob.Name))) {
            this.onSelectedBlob(event, blob);
        }
        event.preventDefault();
        event.stopPropagation();
        document.getElementById(blob.Name).style.top = event.pageY + 'px';
        document.getElementById(blob.Name).style.left = event.pageX + 'px';
        setTimeout(() => {
            safeboxContextMenue.contextMenu.openMenu();
        }, 10);
    }

    contextmenuFolderOpen(event, safeboxContextFolderMenue, item: TreeNodeItem) {
        event.preventDefault();
        event.stopPropagation();
        document.getElementById(item.prefix).style.top = event.pageY + 'px';
        document.getElementById(item.prefix).style.left = event.pageX + 'px';
        setTimeout(() => {
            safeboxContextFolderMenue.contextMenu.openMenu();
        }, 10);
    }

    onSelectedBlob(event: MouseEvent, blob: Blob) {
        if (event.ctrlKey) {
            if (this.selectedBlobData && this.selectedBlobData.find(val => val.Name === blob.Name)) {
                this.selectedBlobCon.emit(this.selectedBlobData.filter(val => val.Name !== blob.Name));
            } else if (this.selectedBlobData) {
                this.selectedBlobCon.emit(this.selectedBlobData.concat(blob));
            } else {
                this.selectedBlobCon.emit([blob]);
            }
        } else {
            this.selectedBlobCon.emit([blob]);
        }
    }
    isSelected(blob: Blob, selectedBlobData: Blob[]) {
        return selectedBlobData ? (!!selectedBlobData.find(val => val.Name === blob.Name)) : false;
    }
    isCutItem(blob: Blob) {
        return this.copyItems && this.copyItems.type === 'cut' && this.copyItems.path ? (!!this.copyItems.path.find(val =>
            val === blob.Name)) : false;
    }
    onDownloadFile() {
        if (this.selectedBlobData) {
            this.changeFileItem.emit({ kind: ItemChangeKind.Download, value: this.selectedBlobData[0] });
        }
    }
    onShareFile() {
        if (this.selectedBlobData) {
            this.changeFileItem.emit({ kind: ItemChangeKind.Share_File, value: this.selectedBlobData });
        }
    }

    onDeleteFile() {
        if (this.selectedBlobData) {
            this.changeFileItem.emit({ kind: ItemChangeKind.Delete, value: this.selectedBlobData });
        }
    }

    onRenameFile() {
        if (this.selectedBlobData) {
            this.changeFileItem.emit({ kind: ItemChangeKind.Rename, value: this.selectedBlobData[0] });
        }
    }
    onViewFile(blob) {
        this.selectedBlobCon.emit([blob]);
        this.changeFileItem.emit({ kind: ItemChangeKind.View, value: blob });
    }
    onDragStart(event, blob) {
        this.dragElement = document.getElementById('dragPreView');
        if (!(this.selectedBlobData && this.selectedBlobData.find(val => val.Name === blob.Name))) {
            this.onSelectedBlob(event, blob);
        }
    }

    onDrop({ event, dragData, dragDataType }, treeNodeItem) {
        event.preventDefault();
        event.stopPropagation();
        if (dragDataType === 'Files') {
            this.changeFolderItem.emit({ kind: ItemChangeKind.Upload, value: { item: dragData, path: treeNodeItem.prefix } });
        } else if (dragDataType === 'safeBoxFile') {
            this.changeFolderItem.emit({ kind: ItemChangeKind.Move, value: { item: this.selectedBlobData, path: treeNodeItem.prefix } });
        }
    }

    onCut() {
        if (this.selectedBlobData) {
            this.changeFileItem.emit({ kind: ItemChangeKind.Cut, value: this.selectedBlobData });
        }
    }

    onCopy() {
        if (this.selectedBlobData) {
            this.changeFileItem.emit({ kind: ItemChangeKind.Copy, value: this.selectedBlobData });
        }
    }

    onPaste(treeNodeItem: TreeNodeItem) {
        this.changeFileItem.emit({ kind: ItemChangeKind.Paste, value: { item: this.copyItems, path: treeNodeItem.prefix } });
    }

    selectFolder(treeNodeItem: TreeNodeItem) {
        if (this.selectedFolder !== treeNodeItem.prefix) {
            this.changeFolderItem.emit({ kind: ItemChangeKind.Select, value: { item: null, path: treeNodeItem.prefix } });

        }
    }

}
