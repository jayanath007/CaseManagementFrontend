

import {
  Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ViewChild,
  OnChanges, SimpleChanges, ElementRef, HostListener
} from '@angular/core';
import { ItemChangeKind, MenuExportFileType, ItemDragTo, ImportButtonType } from '../../../workflow-menu-core/models/enums';
import {
  WorkflowMenuMetaDataWrapper, WorkflowMenuMetaItem,
  MoveMenuItem, WorkflowMenuMetaDataRap, ExportData, WorkflowMenuFileData, WorkflowMenuKeyUpDownData,
} from '../../../workflow-menu-core/models/interfaces';



import { OptionDialogInput, InforDialogData, InforDialogComponent } from '../../../shared';
import { MatDialog } from '@angular/material';
import { OptionDialogComponent } from '../../../shared/components/option-dialog/option-dialog.component';
import { MenuNodeStatus } from '../../../workflow-menu-core';

@Component({
  selector: 'dps-ui-tree',
  templateUrl: './ui-tree.component.html',
  styleUrls: ['./ui-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTreeComponent implements OnInit, OnChanges {
  // selectedIndex: number;
  // @ViewChild('aLocalVariableCalledAsYouWant') el: ElementRef;
  @Input() menuTreeItems: any;
  @Input() cutOrCopyItem: any;
  @Input() gridFontSizeEdit: any;

  doubleClick = false;
  exportToLocalClick = false;
  exportToServerClick = false;
  importClick = false;
  editActive = 0;
  isRowEditCompleted = true;

  @Output() itemChange = new EventEmitter<any>();
  @Output() exportMenus = new EventEmitter<any>();
  @Output() onImportMenuClick = new EventEmitter<WorkflowMenuFileData>();
  @Output() keyUpDown = new EventEmitter<WorkflowMenuKeyUpDownData>();
  @Output() onImportMenu = new EventEmitter<any>();
  @Output() menuduplicate = new EventEmitter<any>();

  @ViewChild('editCommand') private editCommand: ElementRef;
  menuSelectMenuItem;

  constructor(private dialog: MatDialog) { }

  // @HostListener('window:keydown', ['$event'])
  // keyboardInput(event: KeyboardEvent) {
  //   if (event && this.menuSelectMenuItem && (event.keyCode === 38 || event.keyCode === 40)) {
  //     this.onkeyDownMenu(event);
  //   }
  // }

  onkeyDownMenu(event) {
    const data: WorkflowMenuKeyUpDownData = {
      keyCode: event.keyCode,
      selectMenuItem: this.menuSelectMenuItem,
      // index: 0
    };
    // this.onKeyUpDown.emit(data);
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.menuTreeItems && changes.menuTreeItems && !changes.menuTreeItems.isFirstChange()) {
      setTimeout(() => {
        const element = <HTMLInputElement>document.getElementsByClassName('edit-tree-row-select').item(0);
        if (element) {
          element.focus();
        }
      }, 200);
    }
  }

  onEnter(type, selectedNode: WorkflowMenuMetaDataWrapper, event) {
    if (!this.isRowEditCompleted) {
      return;
    } else if (type === 'atN_Desc' && event && event.target.value) {
      const updateItem = {
        treeId: selectedNode.treeId,
        atN_Desc: event.target.value,
        atN_Command: selectedNode.data.atN_Command
      };
      this.commenValidation();
      this.itemChange.emit({ kind: ItemChangeKind.RowEnter, value: updateItem });
    } else if (type === 'atN_Command' && event && event.target.value) {
      let updateItem;
      if (selectedNode.data.atN_Type === 2) {
        const newCommand = this.addUStoCommand(event.target.value);
        updateItem = {
          treeId: selectedNode.treeId,
          atN_Desc: selectedNode.data.atN_Desc,
          atN_Command: newCommand
        };
      } else {
        updateItem = {
          treeId: selectedNode.treeId,
          atN_Desc: selectedNode.data.atN_Desc,
          atN_Command: event.target.value
        };
      }
      this.commenValidation();
      this.itemChange.emit({ kind: ItemChangeKind.RowEnter, value: updateItem });
    }
  }
  onExportMenus(menuExportData: ExportData) {
    if (!this.isRowEditCompleted) {
      return;
    }
    this.commenValidation();
    this.exportMenus.emit(menuExportData);
  }

  public dpsTreeNodeExpandClick(event, selectedNode: WorkflowMenuMetaDataWrapper) {
    if (!this.isRowEditCompleted) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.itemChange.emit({ kind: ItemChangeKind.RowNodeExpand, value: selectedNode });
  }

  public onDpsTreeRowClick(event, selectedNode: WorkflowMenuMetaDataWrapper) {
    if (!this.isRowEditCompleted) {
      return;
    }
    this.commenValidation();
    setTimeout(() => {
      if (!this.doubleClick) {
        if (!selectedNode.isRowSelected) {
          this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: selectedNode });
        }
      } else {
        this.doubleClick = false;
        if (!selectedNode.isRowSelected) {
          this.itemChange.emit({ kind: ItemChangeKind.RowSelected, value: selectedNode });
        }
      }
    }, 275);
  }

  public onDpsTreeRowDoubleClick(event, selectedNode: WorkflowMenuMetaDataWrapper) {
    if (!this.isRowEditCompleted) {
      return;
    }
    this.commenValidation();
    event.preventDefault();
    event.stopPropagation();
    this.doubleClick = true;
    this.itemChange.emit({ kind: ItemChangeKind.RowEdit, value: selectedNode });
  }

  public onDpsTreeRowRightClick(event, selectedNode: WorkflowMenuMetaDataWrapper) {
    if (!this.isRowEditCompleted) {
      return;
    }
    this.commenValidation();
    event.preventDefault();
    event.stopPropagation();
    this.itemChange.emit({ kind: ItemChangeKind.RowRightClick, value: selectedNode });
  }

  onItemChange(event) {
    if (event.kind === 'ROW_EDIT') {
      this.itemChange.emit(event);
    } else {
      this.itemChange.emit(event);
    }
  }
  descriptionChange(selectedNode: WorkflowMenuMetaDataWrapper, event) {
    const updateItem = {
      treeId: selectedNode.treeId,
      atN_Desc: event.target.value,
    };
    if (selectedNode.data.atN_Desc !== event.target.value) {
      this.itemChange.emit({ kind: ItemChangeKind.EditDescriptionUpdate, value: updateItem });
    }
  }
  menuTypeChange(selectedNode: WorkflowMenuMetaDataWrapper, value) {
    const updateItem = {
      treeId: selectedNode.treeId,
      atN_Type: value,
      atN_Command: selectedNode.data.atN_Command
    };
    if (this.TypeChangeValidation(selectedNode)) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Change Item Type',
          message: 'You can only change Menus to another type if it has no items.'
        },
        contentParams: {},
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
    } else {
      if (value === 2) {
        updateItem.atN_Command = this.addUStoCommand(selectedNode.data.atN_Command);
      }
      this.editActive = value;
      this.itemChange.emit({ kind: ItemChangeKind.EditTypeUpdate, value: updateItem });
    }
  }

  public TypeChangeValidation(selectedNode: WorkflowMenuMetaDataWrapper) {
    let rtn = false;
    if (selectedNode.data.atN_Type === 1 && selectedNode.items && selectedNode.items.length > 0) {
      rtn = true;
    } else {
      rtn = false;
    }
    return rtn;
  }

  public addUStoCommand(selectedCommand: string): string {
    let newSelectedCommand = selectedCommand;
    if (newSelectedCommand.indexOf('[') !== 0) {
      if (newSelectedCommand.indexOf('US') !== 0 && newSelectedCommand.indexOf('us') !== 0) {
        // ! start [US then add US
        newSelectedCommand = 'US' + newSelectedCommand;
      }
      // add [
      newSelectedCommand = '[' + newSelectedCommand;
    } else {
      if (newSelectedCommand.indexOf('[US') !== 0 && newSelectedCommand.indexOf('[us') !== 0) {
        // add US
        newSelectedCommand = newSelectedCommand.slice(0, 1) + 'US' + newSelectedCommand.slice(1);
      }
    }
    if (newSelectedCommand.lastIndexOf(']') !== newSelectedCommand.length - 1) {
      newSelectedCommand = newSelectedCommand + ']';
    }
    return newSelectedCommand;
  }

  commandTextChange(selectedNode: WorkflowMenuMetaDataWrapper, event) {
    if (event && !event.target.value) {
      this.isRowEditCompleted = false;
      const dialogData: InforDialogData = {
        content: {
          title: 'Invalid entry',
          message: 'Name is required.'
        },
        contentParams: {},
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.editCommand.nativeElement.focus();
      });
    } else {
      let updateItem;
      this.isRowEditCompleted = true;
      if (selectedNode.data.atN_Type === 2) {
        const newCommand = this.addUStoCommand(event.target.value);
        updateItem = {
          treeId: selectedNode.treeId,
          atN_Command: newCommand,
        };
      } else {
        updateItem = {
          treeId: selectedNode.treeId,
          atN_Command: event.target.value,
        };
      }
      if (selectedNode.data.atN_Command !== event.target.value) {
        this.itemChange.emit({ kind: ItemChangeKind.EditCommandUpdate, value: updateItem });
      }
    }
  }
  addNewItemAbove() {
    this.itemChange.emit({ kind: ItemChangeKind.AddItemAbove, value: this.createNewRowItem(4) });
  }
  addNewMenuAbove() {
    this.itemChange.emit({ kind: ItemChangeKind.AddMenuAbove, value: this.createNewRowItem(1) });
  }
  addItemAbove(selectedNode) {
    this.itemChange.emit({ kind: ItemChangeKind.AddItemAbove, value: selectedNode });
  }
  addItemBelow(selectedNode) {
    this.itemChange.emit({ kind: ItemChangeKind.AddItemBelow, value: selectedNode });
  }
  addMenuAbove(selectedNode) {
    this.itemChange.emit({ kind: ItemChangeKind.AddMenuAbove, value: selectedNode });
  }
  addMenuBelow(selectedNode) {
    this.itemChange.emit({ kind: ItemChangeKind.AddMenuBelow, value: selectedNode });
  }
  cutItem(selectedNode) {
    this.itemChange.emit({ kind: ItemChangeKind.CutItem, value: selectedNode });
  }
  copyItem(selectedNode) {
    this.itemChange.emit({ kind: ItemChangeKind.CopyItem, value: selectedNode });
  }
  onMenuDuplicate(selectedNode: WorkflowMenuMetaDataWrapper) {
    this.menuduplicate.emit(selectedNode);
  }
  paseteItem(selectedNode) {
    this.itemChange.emit({ kind: ItemChangeKind.PaseteItem, value: selectedNode });
  }
  deleteItem(selectedNode) {
    this.itemChange.emit({ kind: ItemChangeKind.DeleteItem, value: selectedNode });
  }
  onExportToLocalClick() {
    this.exportToLocalClick = !this.exportToLocalClick;
    this.exportToServerClick = false;
    this.importClick = false;
  }

  onExportToServerClick() {
    this.exportToServerClick = !this.exportToServerClick;
    this.exportToLocalClick = false;
    this.importClick = false;
  }

  onImportButtonClick() {
    this.exportToLocalClick = false;
    this.exportToServerClick = false;
    this.importClick = !this.importClick;
  }
  // OnExportAllMenus(menuExportFileType: MenuExportFileType) {
  //   this.exportMenusToLocal.emit(menuExportFileType);
  // }
  // OnExportFirstMenuOnly(menuExportFileType: MenuExportFileType) {
  //   this.exportMenusToLocal.emit(menuExportFileType);
  // }
  commenValidation() {
    this.exportToLocalClick = false;
    this.exportToServerClick = false;
    this.importClick = false;
  }
  OnExportMenu(menuExportFileType: MenuExportFileType, isToServer: boolean) {
    const menuExportData: ExportData = {
      menuExportFileType: menuExportFileType,
      isToServer: isToServer
    };
    this.exportMenus.emit(menuExportData);
  }
  onDragSuccess(event) {
    // console.log('drag', event);
  }
  onDrop(dragItem: WorkflowMenuMetaDataWrapper, dropItem: WorkflowMenuMetaDataWrapper) {
    const itemDragTo: ItemDragTo = ItemDragTo.Position;
    if (dropItem.data.atN_Type === 1) {
      this.getUserResult(dragItem, dropItem, itemDragTo);
    } else {
      this.itemMove(dragItem, dropItem, itemDragTo);
    }
  }
  importMenuItem(fileData, importButtonType: ImportButtonType) {
    event.preventDefault();
    event.stopPropagation();
    if (fileData && fileData.length === 1 && fileData[0].type &&
      fileData[0].type === 'text/xml' && fileData[0].name.split('.').pop() === 'xml') {
      const fullData: WorkflowMenuFileData = {
        fileData: fileData,
        importButtonType: importButtonType
      };
      this.onImportMenu.emit(fullData);
    }
  }
  importMenu(fullFileData: WorkflowMenuFileData) {
    this.onImportMenu.emit(fullFileData);
  }

  itemMove(dragItem: WorkflowMenuMetaDataWrapper, dropItem: WorkflowMenuMetaDataWrapper, dragTo: ItemDragTo) {
    const value: MoveMenuItem = {
      dragItem: dragItem,
      dropItem: dropItem,
      ItemDragTo: dragTo,
    };
    // console.log('drag', dragItem);
    // console.log('drop', dropItem);
    // console.log('to', dragTo);
    if (dragItem && dropItem && dragTo) {
      this.itemChange.emit({ kind: ItemChangeKind.MenuDragItem, value: value });
    }
  }

  upDownClick(event, item: WorkflowMenuMetaDataWrapper) {
    if (event.keyCode === 38 || event.keyCode === 40) {
      const data: WorkflowMenuKeyUpDownData = {
        keyCode: event.keyCode,
        selectMenuItem: item,
      };
      this.keyUpDown.emit(data);
    }
  }

  onKeyUpDown(data: WorkflowMenuKeyUpDownData) {
    this.keyUpDown.emit(data);
  }

  getUserResult(dragItem: WorkflowMenuMetaDataWrapper, dropItem: WorkflowMenuMetaDataWrapper, dragTo: ItemDragTo) {
    const dialogData: OptionDialogInput = {
      content: {
        actionName: 'Ok',
        cancelBtn: 'Cancel',
        title: 'Moving Item!'
      },
      list: [
        {
          value: ItemDragTo.Into,
          displyName: 'Move item into ' + dropItem.data.atN_Desc + '?',
          isSelect: true
        },
        {
          value: ItemDragTo.Position,
          displyName: 'Move position of selected item?',
          isSelect: false
        }
      ],
      isMultipleSelect: false,
      needOneSelected: true
    };
    const dialogRef = this.dialog.open(OptionDialogComponent, {
      data: dialogData,
      width: '600px',
      disableClose: true,
      panelClass: 'dps-notification'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        const temp = dialogResult.find(val => val.isSelect);
        if (temp) {
          dragTo = temp.value;
          this.itemMove(dragItem, dropItem, dragTo);
        }
      }

    });
  }

  public createNewRowItem(menuType: number)
    : WorkflowMenuMetaDataWrapper {
    const maxMenuKeyID = 10; // ATN_ID
    const maxParentID = 10; // ATN_ParentID;

    const newMenuItemData: WorkflowMenuMetaItem = {
      atN_AppID: 3, // temporary set app id
      atN_Command: 'TEMPLATE.XML',
      atN_Desc: 'Enter a description',
      atN_Help: '',
      atN_ID: maxMenuKeyID,
      atN_Level: 0,
      atN_Order: 1,
      atN_ParentID: maxParentID,
      atN_ParentMenu: 'ROOT',
      atN_Type: menuType,
      createUser: '',
      dateDone: '',
      nodeStatus: MenuNodeStatus.NotChange,
    };
    const rapNewItem: WorkflowMenuMetaDataWrapper = {
      treeId: maxMenuKeyID,
      parentId: maxParentID,
      treeLevel: 0,
      isRowEdit: true,
      isRightClick: false,
      isRowSelected: false,
      indexId: 0,
      data: newMenuItemData,
      items: [],
      enabled: true,
      isTreeNodeExpand: false,
    };
    return rapNewItem;
  }

}
