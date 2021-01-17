
import { map } from 'rxjs/operators';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material';
import { TreeNodeItem, Blob } from '../../../safe-box-explorer-core/models/interfaces';
import { ExplorerViewType, ItemChangeKind } from '../../../safe-box-explorer-core';
import { TextInsertDialogInput } from '../../../shared';
import { TextInsertDialogComponent } from '../../../shared/components/text-insert-dialog/text-insert-dialog.component';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { SubmitType } from '../../../add-note-core';
import { InputData } from '../../../email-list-core';
import { checkUploadFileIsBlacklisted, showInforDialog, InfoDialogType } from '../../../core/utility/DpsUtility';
import { SafeBoxType } from '../../../core';

@Component({
  selector: 'dps-safe-box-explorer-layout',
  templateUrl: './safe-box-explorer-layout.component.html',
  styleUrls: ['./safe-box-explorer-layout.component.scss']
})
export class SafeBoxExplorerLayoutComponent implements OnInit {

  @Input() treeNodeItem: TreeNodeItem;
  @Input() selectedBlobData: any[];
  @Input() loading: boolean;
  @Input() viewType: ExplorerViewType;
  @Input() selectedTreeNodeItem: TreeNodeItem;
  @Input() initView: boolean;
  @Input() backpaths: string[];
  @Input() nextpaths: string[];
  @Input() copyItems: { type: 'copy' | 'cut', path: string[] };
  @Input() selectedFolder: string;
  @Input() selectedSafeBoxType: SafeBoxType;
  @Input() isGoogle: boolean;
  @Input() activeOutlet: string;
  @Input() copyFrom: SafeBoxType;

  @Output() onExpand = new EventEmitter<string>();
  @Output() selectedBlob = new EventEmitter<{ selectedBlob: Blob }>();
  @Output() onExpandCollapsed = new EventEmitter<{ item: TreeNodeItem }>();
  @Output() navigete = new EventEmitter<{ type: string, prefix: string }>();

  @Output() changeFolderItem = new EventEmitter<{ kind: ItemChangeKind, value: any, newName?: string }>();
  @Output() onChangeViewType = new EventEmitter<{ viewType: ExplorerViewType }>();
  @Output() onUploadFile = new EventEmitter<{ file: any, path: string }>();
  @Output() onMoveItem = new EventEmitter<{ item: Blob[], path: string }>();
  @Output() changeFileItem = new EventEmitter<{ kind: ItemChangeKind, value: Blob | Blob[] | { item: any, path: string } }>();
  @Output() changeSafeBoxType = new EventEmitter<SafeBoxType>();

  ExplorerViewType = ExplorerViewType;
  SafeBoxType = SafeBoxType;

  sidenavMode = 'side';
  isSidenavOpen = true;

  get filePathList() {
    if (this.selectedTreeNodeItem && this.selectedTreeNodeItem.prefix) {
      return this.selectedTreeNodeItem.prefix.split('/').filter(path => path);
    }
    return [];
  }

  constructor(private dialog: MatDialog, private popupService: SystemJsPopupLoaderService,
    public breakpointObserver: BreakpointObserver) { }


  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.WebLandscape
    ]).subscribe(result => {
      if (!result.matches) {
        this.sidenavMode = 'over';
        this.isSidenavOpen = false;
      } else {
        this.sidenavMode = 'side';
        this.isSidenavOpen = true;
      }
    });
  }

  contextmenuFolderOpen(event, safeboxContextMenue) {
    if (this.selectedSafeBoxType === SafeBoxType.Blob) {
      event.preventDefault();
      event.stopPropagation();
      document.getElementById('dps-safebox-folder-menu').style.top = event.pageY + 'px';
      document.getElementById('dps-safebox-folder-menu').style.left = event.pageX + 'px';
      setTimeout(() => {
        safeboxContextMenue.contextMenu.openMenu();
      }, 10);
    }
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
  onSidenavClose() {
    this.isSidenavOpen = false;
  }


  onFileChange(files) {
    if (this.checkUploadedFile(files)) {
      this.onUploadFile.emit({ file: files, path: this.selectedTreeNodeItem.prefix });
    }
  }

  checkUploadedFile(file: any[]): boolean {
    let valid = true;
    let notValidList = '';
    for (let i = 0; i < file.length; i++) {
      if (checkUploadFileIsBlacklisted(file[i].name)) {
        notValidList = `${notValidList} <br> ${file[i].name}`;
        valid = false;
      }
    }
    if (notValidList) {
      showInforDialog('Harmful file detection',
        `You are try to upload harmful file type, please contact admin.
       <br> ${notValidList}`, InfoDialogType.warning, this.dialog);
      valid = false;
    }
    return valid;
  }

  expand(event: { item: TreeNodeItem }) {
    this.onExpand.emit(event.item.prefix);
  }

  expandCollapsed(event) {
    this.onExpandCollapsed.emit(event);
  }

  changeViewType(event) {
    this.onChangeViewType.emit(event);
  }

  onSelectedBlobCon(event) {
    this.selectedBlob.emit(event);
  }

  onChangeFolderItem(event: { kind: ItemChangeKind, value: { item: any, path: string } }) {
    if (event.kind === ItemChangeKind.Upload) {
      if (this.checkUploadedFile(event.value.item)) {
        this.onUploadFile.emit({ file: event.value.item, path: event.value.path });
      }
    } else if (event.kind === ItemChangeKind.Move) {
      this.onMoveItem.emit({ item: event.value.item, path: event.value.path });
    } else {
      this.changeFolderItem.emit(event);
    }

  }

  onChangeFileItem(event: { kind: ItemChangeKind, value: any, newName?: string }) {
    if (event.kind === ItemChangeKind.Share_File) {
      const inputData: InputData = {
        signTokens: null,
        fileCredentials: null,
        subjectNote: '',
        safeBoxFileList: event.value.map(val => val.Name),
        submitType: SubmitType.SafeBoxSheare,
        url: null,
        matterData: null
      };
      return this.popupService.openEmailListPopup('EmailListPopup', inputData).pipe(map(data => {
      }));
    } else if (event.kind === ItemChangeKind.Rename) {
      this.OnTextEnterDialog(event);
    } else {
      this.changeFileItem.emit(event);
    }
  }

  onDrop({ event, dragData, dragDataType }) {
    if (dragDataType === 'Files' && this.checkUploadedFile(dragData)) {
      this.onUploadFile.emit({ file: dragData, path: this.selectedTreeNodeItem.prefix });
    }
  }

  // Rename dialog
  OnTextEnterDialog(event: { kind: ItemChangeKind, value: Blob, newName?: string }): void {
    const dialogData: TextInsertDialogInput = {
      content: {
        title: 'Rename',
        details: '',
        message: 'Enter a new name for ' + event.value.displayName,
        placeholder: ''
      },
      allowEmpty: false,
      text: '',
      showCancelBtn: true
    };
    const dialogRef = this.dialog.open(TextInsertDialogComponent, {
      data: dialogData,
      width: '350px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        event.newName = result;
        this.changeFileItem.emit(event);
      }
    });
  }

  clickNavigation(type: string) {
    if (type === 'back') {
      const backPath = this.backpaths[1];
      this.navigete.emit({ type: type, prefix: backPath });
    } else if (type === 'next') {
      const nextPath = this.nextpaths[0];
      this.navigete.emit({ type: type, prefix: nextPath });
    }
  }

  onGoToPath(path: string) {
    const fullPath = this.selectedTreeNodeItem.prefix.split(`${path}/`)[0] + `${path}/`;
    this.onExpand.emit(fullPath);
  }

  onRefresh() {
    this.onExpand.emit(this.selectedTreeNodeItem.prefix);
  }

  onPaste() {
    this.changeFileItem.emit({ kind: ItemChangeKind.Paste, value: { item: this.copyItems, path: this.selectedTreeNodeItem.prefix } });
  }
  onDriveFolderSelect() {
    this.changeSafeBoxType.emit(SafeBoxType.Drive);
  }
  onAppSelect() {
    this.changeSafeBoxType.emit(SafeBoxType.Template);
  }
  // onKeyDown(e: KeyboardEvent) {
  //   if (e.ctrlKey) {
  //     if (e.keyCode === 67) { // copy
  //       if (this.selectedBlobData) {
  //         this.changeFileItem.emit({ kind: ItemChangeKind.Copy, value: this.selectedBlobData });
  //       }
  //     } else if (e.keyCode === 86) { // past
  //       this.onPaste();
  //     }
  //     //  else if (e.keyCode === 86) { // past
  //     // }
  //   }
  // }

}
