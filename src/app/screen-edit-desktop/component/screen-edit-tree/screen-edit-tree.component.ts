import { Component, OnInit, Input, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { ITreeNode } from 'angular-tree-component/dist/defs/api';
import { TreeComponent } from 'angular-tree-component';
import { ScreenEditComponentTreeData } from '../../../core';

@Component({
  selector: 'dps-screen-edit-tree',
  templateUrl: './screen-edit-tree.component.html',
  styleUrls: ['./screen-edit-tree.component.scss']
})
export class ScreenEditTreeComponent implements OnInit, AfterViewInit {

  @Input() options;
  @Input() screenEditComponentTreeData: ScreenEditComponentTreeData;
  @Output() selectNode = new EventEmitter<any>();
  @ViewChild(TreeComponent) tree: TreeComponent;

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.tree.treeModel.getFirstRoot().getFirstChild().getFirstChild().toggleActivated();
  }
  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.screenEditComponentTreeData && !changes.screenEditComponentTreeData.firstChange &&
  //     !changes.screenEditComponentTreeData.previousValue) {
  //       const someNode = this.tree.treeModel.getNodeById('1046');
  //       someNode.expand();
  //       const firstRoot = this.tree.treeModel.roots[0];
  //       firstRoot.expand();
  //   }
  // }

  onClick(node: ITreeNode) {
    this.selectNode.emit(node);
  }
}
