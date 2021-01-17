import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { ScreenEditCloseInfo } from '../../../screen-edit-core/models/enum';
import { ScreenEditComponentTreeData } from '../../../core';


@Component({
  selector: 'dps-screen-edit-layout',
  templateUrl: './screen-edit-layout.component.html',
  styleUrls: ['./screen-edit-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenEditLayoutComponent implements OnInit, OnChanges {

  @Input() options;
  @Input() screenEditComponentTreeData: ScreenEditComponentTreeData[];
  @Input() screenEditRuleListData;
  @Input() isSubmited: boolean;
  @Input() isLoading: boolean;
  @Input() componentStructure: { [token: string]: string[] };

  @Output() close = new EventEmitter();
  @Output() submit = new EventEmitter();

  selectedNode: ScreenEditComponentTreeData;
  treeData: ScreenEditComponentTreeData[];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.screenEditComponentTreeData && !changes.screenEditComponentTreeData.previousValue &&
      changes.screenEditComponentTreeData.currentValue) {
      this.treeData = JSON.parse(JSON.stringify(changes.screenEditComponentTreeData.currentValue));
      this.selectedNode = this.treeData[0].children[0].children[0];
    }
    if (changes.isSubmited && changes.isSubmited.currentValue === true) {
      this.onClose();
    }
  }

  onClose() {
    this.close.emit();
  }

  onChangeSelectedNode(node: ScreenEditComponentTreeData) {
    if (node.scL_Name === 'Screens') {
      this.selectedNode = null;
    } else {
      this.selectedNode = node;
    }
  }

  onSubmit() {
    const updatedData = [];
    this.getChangedElements(this.screenEditComponentTreeData[0].children[0], this.treeData[0].children[0], updatedData);
    if (updatedData.length > 0) {
      this.submit.emit({ updatedData: updatedData, treeData: this.treeData });
      this.selectedNode = this.treeData[0].children[0].children[0];
    } else {
      this.close.emit();
    }
  }

  getChangedElements(tree: ScreenEditComponentTreeData, dirtyTree: ScreenEditComponentTreeData, result: ScreenEditComponentTreeData[]) {
    if (tree.scL_Caption !== dirtyTree.scL_Caption ||
      tree.scL_Required !== dirtyTree.scL_Required ||
      tree.scL_Type !== dirtyTree.scL_Type ||
      tree.scL_ReadOnly !== dirtyTree.scL_ReadOnly ||
      tree.scL_Visible !== dirtyTree.scL_Visible) {
      result.push({
        scL_ID: dirtyTree.scL_ID,
        scL_SCT_ID: dirtyTree.scL_SCT_ID,
        scL_Name: dirtyTree.scL_Name,
        scL_Caption: dirtyTree.scL_Caption,
        scL_DefaultCaption: dirtyTree.scL_DefaultCaption,
        scL_Visible: dirtyTree.scL_Visible,
        scL_Type: dirtyTree.scL_Type,
        scL_Required: dirtyTree.scL_Required,
        scL_MinLength: dirtyTree.scL_MinLength,
        scL_IsTab: dirtyTree.scL_IsTab,
        scL_ReadOnly: dirtyTree.scL_ReadOnly,
        scL_ParentID: dirtyTree.scL_ParentID,
        scL_DisplayOrder: dirtyTree.scL_DisplayOrder,
        scL_System: dirtyTree.scL_System,
      });
    }
    if (!tree.children || tree.children.length < 1) {
      return;
    }
    for (let i = 0; i < tree.children.length; i++) {
      this.getChangedElements(tree.children[i], dirtyTree.children[i], result);
    }
  }
  resetDataTree(tree) {
    const resetItem = function (_item: ScreenEditComponentTreeData) {
      if (_item.scL_ID < 0) {
        return;
      }
      _item.scL_Visible = true;
      _item.scL_Caption = _item.scL_DefaultCaption;
      _item.scL_Type = 0;

      if (_item.scL_System === true) {
        _item.scL_Required = true;
        _item.scL_ReadOnly = false;
      }
    };
    const tmp: ScreenEditComponentTreeData[] = JSON.parse(JSON.stringify(this.screenEditComponentTreeData));
    this.traverse(tmp[0], resetItem);

    if (tmp[0].children[0].children.find(i => i.scL_Name === 'INPtpgClient')) {
      tmp[0].children[0].scL_Caption = tmp[0].children[0].children.find(i => i.scL_Name === 'INPtpgClient').scL_Caption;
    } else if (tmp[0].children[0].children.find(i => i.scL_Name === 'INPtpgMatter')) {
      tmp[0].children[0].scL_Caption = tmp[0].children[0].children.find(i => i.scL_Name === 'INPtpgMatter').scL_Caption;
    }

    this.treeData = tmp;
    this.selectedNode = this.treeData[0].children[0].children[0];
    tree.ngAfterViewInit();
  }
  traverse(item: ScreenEditComponentTreeData, callback) {
    callback(item);
    if (item.children) {
      item.children.forEach(_item => {
        this.traverse(_item, callback);
      });
    }
  }
}
