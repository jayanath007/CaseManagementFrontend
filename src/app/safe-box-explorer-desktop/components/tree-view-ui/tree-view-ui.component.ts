
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TreeNodeItem, Blob } from '../../../safe-box-explorer-core/models/interfaces';
import { ItemChangeKind } from '../../../safe-box-explorer-core/models/enum';

@Component({
  selector: 'dps-tree-view-ui',
  templateUrl: './tree-view-ui.component.html',
  styleUrls: ['./tree-view-ui.component.scss']
})
export class TreeViewUiComponent implements OnInit {

  @Input() treeItem;
  @Input() level: number;
  @Input() selectedBlobData: Blob[];
  @Input() copyItems: { type: 'copy' | 'cut', path: string[] };
  @Input() isBlobSelect: boolean;

  @Output() onExpand = new EventEmitter<{ item: TreeNodeItem }>();
  @Output() changeFolderItem = new EventEmitter<{ kind: ItemChangeKind, value: { item: any, path: string } }>();
  @Output() onExpandCollapsed = new EventEmitter<{ item: TreeNodeItem }>();
  @Output() changeFileItem = new EventEmitter<{ kind: ItemChangeKind, value: Blob | Blob[] | { item: any, path: string } }>();



  nodes: TreeNodeItem;

  constructor() { }


  expand(item, event: Event) {
    event.stopPropagation();
    this.onExpand.emit({ item: item });
  }

  expandCollapsed(item, event: Event) {
    event.stopPropagation();
    this.onExpandCollapsed.emit({ item: item });
  }

  expandEvent(item) {
    this.onExpand.emit(item);
  }

  expandCollapsedEvent(item) {
    this.onExpandCollapsed.emit(item);
  }

  ngOnInit() {

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

  onChangeFolderItem(event) {
    this.changeFolderItem.emit(event);
  }

  contextmenuFolderOpen(event: MouseEvent, safeboxContextFolderMenue, node: TreeNodeItem) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('dps-safe-box-tree-item' + node.prefix).style.top = event.pageY + 'px';
    document.getElementById('dps-safe-box-tree-item' + node.prefix).style.left = event.pageX + 'px';
    setTimeout(() => {
      safeboxContextFolderMenue.contextMenu.openMenu();
    }, 10);
  }

  onPaste(treeNodeItem: TreeNodeItem) {
    this.changeFileItem.emit({ kind: ItemChangeKind.Paste, value: { item: this.copyItems, path: treeNodeItem.prefix } });
  }

  onChangeFileItem(event) {
    this.changeFileItem.emit(event);
  }

}
