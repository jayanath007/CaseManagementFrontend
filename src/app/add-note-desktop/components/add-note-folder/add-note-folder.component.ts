import { Folder } from '../../../add-note-core/models/interfaces';
import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ComponentBase } from '../../../core';
import { Subject } from 'rxjs';

@Component({
  selector: 'dps-add-note-folder',
  templateUrl: './add-note-folder.component.html',
  styleUrls: ['./add-note-folder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNoteFolderComponent {

  @Input() folderList: Folder[] = [];
  @Input() placeholder: string;
  @Input() isSelectDefultFolder: boolean;
  @Input() customeSelectedfolder: number;
  @Output() updateSelectedFolder = new EventEmitter<Folder>();

  @ViewChild('childMenu') public childMenu;
  constructor() { }

  get selectedFolder() {
    if (this.folderList) {
      return this.folderList.find((folder) => folder.selected);
    }
    return this.folderList;
  }



  get rootFolders() {
    if (this.folderList) {
      const nodeData = this.list_to_tree(this.folderList);
      return nodeData;                   // this.folderList.filter((folder) => folder.parentId === 0);
    }
    return [];
  }
  childFolders(id) {
    if (this.folderList) {
      return this.folderList.filter((folder) => folder.parentId === id);
    }
    return [];
  }
  onFolderChanged(value) {
    this.updateSelectedFolder.emit(value);
  }

  list_to_tree(list: Folder[]) {
    const map = {};
    let node: Folder;
    const roots: Folder[] = [];
    let i;
    if (list && list.length > 0) {

      for (i = 0; i < list.length; i += 1) {
        map[list[i].folderId] = i; // initialize the map
        list[i].children = []; // initialize the children
      }

      for (i = 0; i < list.length; i += 1) {
        node = list[i];
        if (node.parentId !== 0) {
          // if you have dangling branches check that map[node.parentId] exists
          if (list[map[node.parentId]] && list[map[node.parentId]].children) {
            list[map[node.parentId]].children.push(node);
          }
        } else {
          roots.push(node);
        }
      }
      return roots;
    } else {

      return roots;
    }
  }

}
