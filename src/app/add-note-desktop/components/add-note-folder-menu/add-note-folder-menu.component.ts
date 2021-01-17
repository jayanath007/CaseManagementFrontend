import { Folder } from './../../../add-note-core/models/interfaces';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'dps-add-note-folder-menu',
  templateUrl: './add-note-folder-menu.component.html',
  styleUrls: ['./add-note-folder-menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddNoteFolderMenuComponent implements OnInit {
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
