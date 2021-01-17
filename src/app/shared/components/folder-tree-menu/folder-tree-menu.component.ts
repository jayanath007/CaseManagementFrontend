import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewEncapsulation  } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { Folder } from '../../../file-history-core/models/interface';
import { Router } from '@angular/router';

@Component({
  selector: 'dps-folder-tree-menu',
  templateUrl: './folder-tree-menu.component.html',
  styleUrls: ['./folder-tree-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FolderTreeMenuComponent implements OnInit {
  @Input() items: Folder[];

  @Output() updateSelectedFolder = new EventEmitter<Folder>();
  @ViewChild('childMenu') public childMenu;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  constructor(public router: Router) { }

  ngOnInit() {
  }
  onFolderChanged(selectedFolder) {
    this.updateSelectedFolder.emit(selectedFolder);
    // this.trigger.closeMenu();

  }

}
