import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ScreenEditCloseInfo } from '../../../screen-edit-core/models/enum';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind, FailDialogComponent, FailDialogData } from '../../../shared';
import { MatDialog, MatSelectChange } from '@angular/material';
import { ScreenEditComponentTreeData, DropdownListData } from '../../../core';

@Component({
  selector: 'dps-screen-edit-content',
  templateUrl: './screen-edit-content.component.html',
  styleUrls: ['./screen-edit-content.component.scss']
})
export class ScreenEditContentComponent implements OnInit, OnChanges {

  @Input() selectedNode: ScreenEditComponentTreeData;
  @Input() treeData: ScreenEditComponentTreeData[];
  @Input() screenEditRuleListData: DropdownListData[];
  @Input() componentStructure: { [token: string]: string[] };

  @Output() submit = new EventEmitter();
  @Output() close = new EventEmitter();
  @Output() reset = new EventEmitter();
  titleCaption = '';

  constructor(private dialog: MatDialog) { }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedNode && changes.selectedNode.currentValue) {
      if (this.selectedNode.scL_System === true) {
        this.selectedNode.scL_Required = true;
        this.selectedNode.scL_ReadOnly = false;
        this.selectedNode.scL_Visible = true;
      }
      if (this.selectedNode.scL_IsTab) {
        this.selectedNode.scL_ReadOnly = false;
      }
    }
  }
  onChangeCaption() {
    if (this.selectedNode && this.selectedNode.scL_Name === 'Client') {
      this.treeData[0].children[0].children.find(i => i.scL_Name === 'INPtpgClient').scL_Caption = this.selectedNode.scL_Caption;
    } else if (this.selectedNode && this.selectedNode.scL_Name === 'Matter') {
      this.treeData[0].children[0].children.find(i => i.scL_Name === 'INPtpgMatter').scL_Caption = this.selectedNode.scL_Caption;
    } else if (this.selectedNode && this.selectedNode.scL_Name === 'INPtpgClient') {
      this.treeData[0].children[0].scL_Caption = this.selectedNode.scL_Caption;
    } else if (this.selectedNode && this.selectedNode.scL_Name === 'INPtpgMatter') {
      this.treeData[0].children[0].scL_Caption = this.selectedNode.scL_Caption;
    }
  }
  onChangeRuleType(event: MatSelectChange) {
    this.selectedNode.scL_Type = event.value;
  }
  onChangeRequired(event: MatSelectChange) {
    this.selectedNode.scL_Required = event.value;
    if (event.value === true) {
      this.selectedNode.scL_ReadOnly = false;
      this.selectedNode.scL_Visible = true;
    }
    this.onChangeVisible(null);
  }
  onChangeReadonly(event: MatSelectChange) {
    this.selectedNode.scL_ReadOnly = event.value;
  }

  onChangeVisible(event: MatSelectChange) {
    this.selectedNode.scL_Visible = event ? event.value : this.selectedNode.scL_Visible;
    const childs = this.componentStructure[this.selectedNode.scL_Name];
    const parent = this.findParent(this.treeData[0], this.selectedNode);
    if (childs && childs.length > 0) {
      childs.forEach(c => {
        const child = parent.children.find(node => node.scL_Name === c);
        child.scL_Visible = event ? event.value : this.selectedNode.scL_Visible;
      });
    }
    // Check All Childrent are hidden
    if (this.selectedNode.scL_ParentID > 0) {
      const compStructure = this.getComponentStructureByChild();
      if (!!compStructure) {
        const groupHeaderElement = parent.children.find(node => node.scL_Name === compStructure.key);
        if (this.selectedNode.scL_Visible === false) {
          let isAllChildHidden = true;
          compStructure.value.forEach(el => {
            const element = parent.children.find(node => node.scL_Name === el);
            if (element && element.scL_Visible === true) {
              isAllChildHidden = false;
              return;
            }
          });
          if (isAllChildHidden === true) {
            groupHeaderElement.scL_Visible = false;
            groupHeaderElement.scL_Required = false;
          }
        } else {
          if (groupHeaderElement.scL_Visible === false) {
            groupHeaderElement.scL_Visible = true;
          }
        }
      }
    }
    if (!this.selectedNode.scL_IsTab) {
      if (!this.checkRequiredFieldsValidation(this.selectedNode)) {
        setTimeout(() => {
          // if (this.selectedNode.scL_IsTab) {
          //   this.selectedNode.scL_Visible = true;
          // } else {
          this.selectedNode.scL_Required = false;
          // }
        }, 10);
      }
    }
  }
  // changeChieldVisibily(node: ScreenEditComponentTreeData, visible: boolean) {

  // }

  getComponentStructureByChild(): { key: string, value: string[] } {
    let structure: { key: string, value: string[] };
    Object.keys(this.componentStructure).forEach(key => {
      if (!!this.componentStructure[key].find(c => c === this.selectedNode.scL_Name)) {
        structure = { key: key, value: this.componentStructure[key] };
        return;
      }
    });
    return structure;
  }

  checkRequiredFieldsValidation(selectedNode: ScreenEditComponentTreeData): boolean {
    if (selectedNode.scL_IsTab) {
      if (selectedNode.scL_Visible !== false) {
        return true;
      }
      const transformToError = function (_item: ScreenEditComponentTreeData) {
        // let message = 'Is a User Required field and cannot be hidden';
        let message = '';
        if (_item.scL_System) {
          message = 'Is a DPS Required field and cannot be hidden';
        }
        return { title: _item.scL_Caption, message: message };
      };
      const requiredChildrens = this.filterToArray<{ title: string, message: string }>(
        selectedNode, (_item: ScreenEditComponentTreeData) => _item.scL_Required, transformToError);
      if (requiredChildrens.length > 0) {
        const dialogData: FailDialogData = {
          messageBody: 'You are trying to hide this tab but it has the following controls which are required and cannot be hidden',
          messageHeader: 'Tab Hide',
          detailStatus: requiredChildrens
        };
        const dialogRef = this.dialog.open(FailDialogComponent, {
          data: dialogData,
          width: '450px',
          panelClass: 'dps-notification'
        });
        return false;
      }
    } else {
      const parent = this.findParent(this.treeData[0], selectedNode);
      if (parent) {
        return this.checkRequiredFieldsValidation(parent);
      } else {
        return true;
      }
    }
    return true;
  }

  findParent(root: ScreenEditComponentTreeData, item: ScreenEditComponentTreeData): ScreenEditComponentTreeData {
    if (root.children) {
      const hasItem = root.children.find(val => val.scL_Name === item.scL_Name);
      if (hasItem) {
        return root;
      } else {
        for (const _item of root.children) {
          const parent = this.findParent(_item, item);
          if (parent) {
            return parent;
          }
        }
      }
    }
    return null;
  }
  filterToArray<T>(data: ScreenEditComponentTreeData, predicate: Function, transform?: Function): Array<T> {
    let r = [];
    if (predicate(data)) {
      if (typeof transform === 'function') {
        r.push(transform(data));
      } else {
        r.push(data);
      }
    }
    if (data.children) {
      data.children.forEach(val => {
        const found = this.filterToArray(val, predicate, transform);
        if (found.length > 0) {
          r = r.concat(found);
        }
      });
    }
    return r;
  }
  onReset() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Reset',
        message: '<p>This will reset all the controls to their default value</p>',
        acceptLabel: 'Reset',
        rejectLabel: 'Cancel'
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '305px',
      disableClose: false,
      panelClass: 'dps-notification',
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
        this.reset.emit();
      }
    });
  }
  onSubmit() {
    this.submit.emit();
  }

  onClose() {
    this.close.emit();
  }

}
