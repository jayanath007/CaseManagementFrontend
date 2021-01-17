import { ItemChangeKind } from '../../../workflow-menu-core/models/enums';
import {
  WorkflowMenuMetaDataWrapper, ExportData, WorkflowMenuFileData,
  WorkflowMenuKeyUpDownData,
  MatterShortcuts
} from '../../../workflow-menu-core/models/interfaces';
import { MenuButtonClickType } from '../../../open-case-core/models/enums';
import { OpenCaseMenueData } from '../../../core/lib/open-case';
import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges,
  SimpleChanges, HostListener
} from '@angular/core';

import {
  InforDialogData, InforDialogComponent, ConfirmDialogData, ConfirmDialogComponent,
  ConfirmDialogResultKind, ConfirmDialogWithCancelResultKind,
} from '../../../shared';
import { MatDialog } from '@angular/material';

import {
  ConfirmDialogComponentWithCancel
} from '../../../shared/components/confirm-dialog-with-cancel/confirm-dialog-with-cancel.component';
import { NullAstVisitor } from '@angular/compiler';
import * as _ from 'lodash';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatterSearchGridData } from '../../../core/lib/matter';

@Component({
  selector: 'dps-workflow-menu-main-layout',
  templateUrl: './workflow-menu-main-layout.component.html',
  styleUrls: ['./workflow-menu-main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowMenuMainLayoutComponent implements OnInit, OnChanges {
  isCommandColumnShow = false;
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;
  gridFontSize: string;

  fontSizeEdit: number;
  fontSizeClassTagEdit: string;
  buttonActiveClassEdit: string;
  gridFontSizeEdit: string;
  propertiesPanelMode: string;

  @Input() menuTreeItems: WorkflowMenuMetaDataWrapper[];
  @Input() menuButtonClickType: MenuButtonClickType;
  @Input() selectedMenuChildList: WorkflowMenuMetaDataWrapper[];
  @Input() menuPropertyButtonClick: any;
  @Input() matterSummeryList: any;
  @Input() matterShortCutList: any;
  @Input() openFilePath: any;
  @Input() openFilePathHistory: any;
  @Input() forwardFilePathHistory: any;
  @Input() cutOrCopyItem: any;
  @Input() openCaseFileData: OpenCaseMenueData;
  @Input() matterInfo: MatterSearchGridData;
  @Input() exportedData: any;
  @Input() exportToServerTrigger: boolean;
  @Input() loading: boolean;
  @Input() requestToCancel: boolean;
  @Input() validationMessage: string;
  @Input() isShowDeleteMsg: boolean;
  @Input() searchText: string;
  @Input() wfSelectedItem: WorkflowMenuMetaDataWrapper;
  @Input() flatMenuList: WorkflowMenuMetaDataWrapper[];

  // menuTreeItems;
  @Output() itemChange = new EventEmitter<any>();
  @Output() exportMenus = new EventEmitter<any>();
  @Output() cancelExitEdit = new EventEmitter();
  @Output() exitEdit = new EventEmitter();
  @Output() saveMenuEdit = new EventEmitter();
  @Output() onImportMenu = new EventEmitter<WorkflowMenuFileData>();
  @Output() onKeyUpDown = new EventEmitter<WorkflowMenuKeyUpDownData>();
  @Output() msgReset = new EventEmitter<any>();
  @Output() deleteLinkItem = new EventEmitter<any>();
  @Output() menuduplicate = new EventEmitter<any>();
  // @Output() menuViewitemClick = new EventEmitter<any>();
  // @Output() menuViewItem = new EventEmitter<any>();

  @Output() onCheckin = new EventEmitter<WorkflowMenuMetaDataWrapper>();
  @Output() onDiscardCheckin = new EventEmitter<WorkflowMenuMetaDataWrapper>();
  @Output() wfSearchtext = new EventEmitter<string>();

  selectedItem: WorkflowMenuMetaDataWrapper;
  perentFileList: WorkflowMenuMetaDataWrapper[];

  constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }

  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event && this.menuButtonClickType === 'WorkflowMenuView') {
      // this.workflowRunInShortCut(event);
    }
  }

  // workflowRunInShortCut(event) {
  //   const keyText = {
  //     'F1': true, 'F2': true, 'F3': true, 'F4': true,
  //     'F5': true, 'F6': true, 'F7': true, 'F8': true, 'F9': true, 'F10': true, 'F11': true, 'F12': true, 'F13': true, 'F14': true
  //   };
  //   if (keyText[event.key] !== undefined && this.matterShortCutList.length > 0 && event.keyCode) {
  //     event.preventDefault();
  //     const openCaseData = this.openCaseFileData;
  //     this.matterShortCutList.forEach(item => {
  //       if (item.kbs_keycode === event.keyCode && item.kbs_item_variant === '4') { // template
  //         const newItemTemplate = getCreateItemNewMenuItem(openCaseData, item);
  //         this.itemChange.emit({ kind: ItemChangeKind.RunWorkFlow, value: newItemTemplate });
  //       } else if (item.kbs_keycode === event.keyCode && item.kbs_item_variant === '2') {// screen
  //         const newItemScreen = getCreateItemNewMenuItem(openCaseData, item);
  //         this.itemChange.emit({ kind: ItemChangeKind.RunWorkFlow, value: newItemScreen });
  //       }
  //     });
  //   }
  // }

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.WebLandscape
    ]).subscribe(result => {
      if (!result.matches) {
        this.propertiesPanelMode = 'over';
      } else {
        this.propertiesPanelMode = 'side';
      }
    });

    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';

    this.fontSizeEdit = 0;
    this.fontSizeClassTagEdit = 'font-increment-';
    this.buttonActiveClassEdit = '';
  }


  ngOnChanges(changes: SimpleChanges) {
    if (this.exportedData && changes.exportedData && !changes.exportedData.isFirstChange()) {
      if (window.navigator.userAgent.indexOf('Edge') > -1) {
        const binary_string = window.atob(this.exportedData.data);
        const blobObject = new Blob([this.base64ToArrayBuffer(this.exportedData.data)]);
        return window.navigator.msSaveBlob(blobObject, this.exportedData.name);
      } else {
        const url = 'data:application/zip;base64,' + this.exportedData.data;
        const link: any = document.createElement('a');
        link.download = this.exportedData.name;
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      }
    }
    if (this.isShowDeleteMsg && changes.isShowDeleteMsg.currentValue && !changes.isShowDeleteMsg.isFirstChange()) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Delete',
          message: `The selected item is linked to Menus in other locations in the Workflow.
          Deleting this item will remove it from those menus as well.
          Do you want to continue?`,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification'
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.deleteLinkItem.emit(true);
        } else {
          this.deleteLinkItem.emit(false);
        }
      });
    }

    if (changes.requestToCancel && !changes.requestToCancel.isFirstChange()) {
      if (this.requestToCancel) {
        setTimeout(() => {
          this.openValidationPopup();
        }, 100);
      }
    }
    if (changes.exportToServerTrigger && changes.exportToServerTrigger.currentValue
      && (changes.exportToServerTrigger.currentValue !== changes.exportToServerTrigger.previousValue)) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Export Menus',
          message: `Successfully exported`
        },
        contentParams: { displayName: '' },
        data: { messageType: 'success' }
      };

      const deleteDialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
        // disableClose: true
      });
      deleteDialogRef.afterClosed().subscribe(dialogResult => {
        this.msgReset.emit('Ok');
      });
    }

    if (this.validationMessage && changes.validationMessage && !changes.validationMessage.isFirstChange()) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Import Menus',
          message: this.validationMessage
        },
        contentParams: { displayName: '' },
        data: { messageType: 'general' }
      };

      const deleteDialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
        // disableClose: true
      });
      deleteDialogRef.afterClosed().subscribe(dialogResult => {
        this.msgReset.emit('Ok');
      });
    }
  }

  // get menuTreeItemsForView() {
  //   if (this.menuTreeItems && this.matterInfo && this.matterInfo.isProspectMatter) {
  //     return this.menuTreeItems.filter(i => i.data.atN_Desc.toLowerCase().replace(/' '/g, '').includes('opportunities-quotes'));
  //   }
  //   return this.menuTreeItems;
  // }

  // get selectedMenuChildListForView() {
  //   if (this.menuTreeItems && this.matterInfo && this.matterInfo.isProspectMatter) {
  //     this.menuTreeItems.filter(i => i.data.atN_Desc.toLowerCase().replace(/' '/g, '').includes('opportunities-quotes'));
  //   }
  //   return this.selectedMenuChildList;
  // }


  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  onItemChange(event) {
    if (event.kind === 'ROW_EDIT') {
      this.itemChange.emit(event);
    } else {
      this.itemChange.emit(event);
    }
  }
  onMenuDuplicate(event) {
    this.menuduplicate.emit(event);
  }
  onCommandColumnClick() {
    this.isCommandColumnShow = !this.isCommandColumnShow;
  }
  menuViewItemClick(menuItem) {
    this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: menuItem });

    // this.menuViewItem.emit(menuItem);
  }
  selectFilePath(menuItem) {
    this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: menuItem });
  }
  backwardMenuPath() {
    this.itemChange.emit({ kind: ItemChangeKind.BackwardMenuPath, value: null });
  }
  forwardMenuPath() {
    this.itemChange.emit({ kind: ItemChangeKind.ForwardMenuPath, value: null });
  }
  // runWorkFlow
  runWorkFlow(menuItem) {
    this.itemChange.emit({ kind: ItemChangeKind.RunWorkFlow, value: menuItem });
  }
  editTemplate(menuItem) {
    this.itemChange.emit({ kind: ItemChangeKind.editTemplate, value: menuItem });
  }
  downloadTemplate(menuItem) {
    this.itemChange.emit({ kind: ItemChangeKind.downloadTemplate, value: menuItem });
  }

  onExportMenus(menuExportData: ExportData) {
    this.exportMenus.emit(menuExportData);
  }
  importMenu(fullFileData: WorkflowMenuFileData) {
    this.onImportMenu.emit(fullFileData);
  }

  keyUpDown(data: WorkflowMenuKeyUpDownData) {
    this.onKeyUpDown.emit(data);
  }

  doCheckin(item) {
    this.onCheckin.emit(item);
  }

  doDiscardCheckin(item) {
    this.onDiscardCheckin.emit(item);
  }

  openValidationPopup() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Save Changes',
        message: `<p>Do you want to save changes to the current layout?</p>`,
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        cancelLabel: 'Cancel'
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponentWithCancel, {
      data: dialogData,
      width: '600px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {
        this.saveMenuEdit.emit();
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
        this.exitEdit.emit();
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
        this.cancelExitEdit.emit();
      }
    });
  }


  onRefresh() {
    // this.gridRefresh.emit();
  }
  onFontSizeMinusClick() {
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      // this.fontSize -= this.fontSize !== 1 ? 1 : 2;
      this.fontSize -= 1;
      this.gridFontSize = this.fontSizeClassTag + this.fontSize;
    }
  }
  onFontSizeResetClick() {
    this.buttonActiveClass = '';
    this.fontSize = 0;
    this.gridFontSize = this.fontSizeClassTag + this.fontSize;
  }
  onFontSizePlusClick() {
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      // this.fontSize += this.fontSize !== -1 ? 1 : 2;
      this.fontSize += 1;
      this.gridFontSize = this.fontSizeClassTag + this.fontSize;
    }
  }
  onFontSizeMinusClickEdit() {
    if (this.fontSizeEdit > -3) {
      this.buttonActiveClass = 'active';
      this.fontSizeEdit -= 1;
      this.gridFontSizeEdit = (this.fontSizeClassTagEdit + this.fontSizeEdit);
    }
  }
  onFontSizeResetClickEdit() {
    this.buttonActiveClassEdit = '';
    this.fontSizeEdit = 0;
    this.gridFontSizeEdit = (this.fontSizeClassTagEdit + this.fontSizeEdit);
  }
  onFontSizePlusClickEdit() {
    if (this.fontSizeEdit < 4) {
      this.buttonActiveClass = 'active';
      this.fontSizeEdit += 1;
      this.gridFontSizeEdit = (this.fontSizeClassTagEdit + this.fontSizeEdit);
    }
  }
  onWorkflowItemSearch(searchText) {
    this.perentFileList = [];
    this.wfSearchtext.emit(searchText);
  }
  onWorkflowItemSearchBykeyDown(event) {
    if (event.keyCode === 13) {
      this.perentFileList = [];
      this.wfSearchtext.emit(event.currentTarget.value)
    }
  }
  onWorkflowItemClear() {
    this.perentFileList = [];
    this.wfSearchtext.emit('');
  }
  getPerentList(items: WorkflowMenuMetaDataWrapper[], selectItem: WorkflowMenuMetaDataWrapper) {
    const perentList: WorkflowMenuMetaDataWrapper[] = [];
    if (selectItem && selectItem.data.atN_ParentMenu !== 'ROOT') {
      perentList.push(selectItem);
      let matchingItem: WorkflowMenuMetaDataWrapper = selectItem;
      while (matchingItem && matchingItem.treeId) {
        matchingItem = this.returnPerentItem(items, matchingItem.data.atN_ParentMenu);
        if (matchingItem && matchingItem.data.atN_ParentMenu === 'ROOT') {
          perentList.push(matchingItem);
          matchingItem = null;
        } else if (matchingItem) {
          perentList.push(matchingItem);
        }
      }
    } else if (selectItem && selectItem.data.atN_ParentMenu === 'ROOT') {
      perentList.push(selectItem);
    } else {
    }
    return perentList;
  }
  returnPerentItem(items: WorkflowMenuMetaDataWrapper[], perentCommand: string) {
    return items.find(item => item.data.atN_Command === perentCommand);
  }
  onDetailSelectedItem(selectItem) {
    this.selectedItem = selectItem;
    if (this.searchText) {
      const selectedPatheItem: WorkflowMenuMetaDataWrapper[] = this.getPerentList(this.flatMenuList, selectItem);
      this.perentFileList = selectedPatheItem.length ? selectedPatheItem.reverse() : []
    }
  }
}

// function getCreateItemNewMenuItem(openCaseFileData: OpenCaseMenueData, shortcutKeyInfo: MatterShortcuts) {
//   let newShortcutKuyNode: WorkflowMenuMetaDataWrapper = null;
//   if (openCaseFileData && openCaseFileData.matterData && shortcutKeyInfo) {
//     const newMenuNode: WorkflowMenuMetaItem = {
//       atN_AppID: +openCaseFileData.matterData.data.appID,
//       atN_Command: shortcutKeyInfo.kbs_item_name,
//       atN_Desc: shortcutKeyInfo.kbs_item_title,
//       atN_Help: '',
//       atN_ID: null,
//       atN_Level: 0,
//       atN_Order: 1,
//       atN_ParentID: null,
//       atN_ParentMenu: null,
//       atN_Type: +shortcutKeyInfo.kbs_item_variant, // Menu
//       createUser: '',
//       dateDone: '',
//       nodeStatus: 1,
//     };
//     const newNode: WorkflowMenuMetaDataWrapper = {
//       treeId: null,
//       parentId: null,
//       treeLevel: 0,
//       isRowEdit: false,
//       isRightClick: false,
//       isRowSelected: false,
//       indexId: 0,
//       data: newMenuNode,
//       items: [],
//       enabled: true,
//       isTreeNodeExpand: false,
//     };
//     newShortcutKuyNode = newNode;
//   }
//   return newShortcutKuyNode;
// }
