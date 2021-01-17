import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNodeItem, Blob } from '../../../safe-box-explorer-core/models/interfaces';
import { ExplorerViewType } from '../../../safe-box-explorer-core/models/enum';

@Component({
  selector: 'dps-folder-view-container',
  template: '<ng-content></ng-content>',
  styleUrls: ['./folder-view-container.component.scss']
})
export class FolderViewContainerComponent implements OnInit {

  constructor() { }

  @Input()
  treeNodeItem: TreeNodeItem;
  @Input()
  selectedBlobD: Blob;

  @Output()
  onExpand = new EventEmitter<{ item: TreeNodeItem }>();

  @Input()
  viewType: ExplorerViewType;

  ngOnInit() {
  }


}
