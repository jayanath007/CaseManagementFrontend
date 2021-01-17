
import { take, filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewManagerService } from '../services/view-manager.service';
import { ViewStateObserverService } from '../../shell-desktop';

@Component({
  selector: 'dps-mail-manager',
  template: `
      <dps-group-content-manager #groupManager></dps-group-content-manager>
      <dps-folder-content-manager #folderManager>
        <dps-mail-layout
          (newRootFolder)="folderManager.newRootFolder($event)"
          (removeSharedFolder)="folderManager.onRemoveSharedFolder($event)"
          (addSharedFolder)="folderManager.onAddSharedFolder($event)"
          (folderEditOperations)="folderManager.onItemEditOperation($event)"
          (folderToggleExpand)="folderManager.onFolderToggle($event)"
          (folderSelect)="folderManager.onFolderSelect($event)" [folders]="folderManager.folders$ | async"
          (folderRefresh)="folderManager.onFolderRefresh($event)"
          [welknownFolders]="folderManager.welknownFolders$ | async"
          [activeOutlet]="folderManager.activeOutlet$?(folderManager.activeOutlet$  | async):'mail'"
          [selectedFolder]="folderManager.selectedFolder$ | async"
          [menuMode]="folderManager.menuMode$ | async"
          [isFolderLoading]="folderManager.isFolderLoading$ | async"
          [isSearching] = "folderManager.isSearching$ | async"
          (folderMenuToggle)="folderManager.onFolderMenueToggle($event)"
          (mailboxToggle)="folderManager.onMailboxToggle($event)"
          (mailboxRefresh)="folderManager.onMailboxRefresh($event)"
          (newMail)="folderManager.onNewMail($event)"
          [deleteItemsFolder]="folderManager.deleteItemsFolder$ | async"
          [initView]="initView$ | async"
          [readingPaneMode]="(folderManager.user$|async)?.emailReadingPaneMode"
          [profile]="(folderManager.user$|async)?.profile"
          [mailBoxes]="folderManager.mailBoxes$|async"
          (moveItems)="folderManager.onMoveItems($event)"
          [isGroupMode]="groupManager.isGroupMode$ | async"
          [groups]="groupManager.groups$ | async"
          [selectedGroup]="groupManager.selectedGroup$ | async"
          [isGroupExpanded]="groupManager.isExpanded$ | async"
          (groupsToggle)="groupManager.onGroupsToggle()"
          (selectGroup)="groupManager.onSelectGroup($event)"
          > </dps-mail-layout>
      </dps-folder-content-manager>`
})
export class MailManagerComponent implements OnInit {

  initView$;
  constructor(private store: Store<any>, private route: ActivatedRoute, private router: Router,
    private viewManager: ViewManagerService, private shellStateManage: ViewStateObserverService) { }

  ngOnInit() {
    this.viewManager.initCore('inbox', this.route);
    this.initView$ = this.shellStateManage.getMailVisibility().pipe(filter((init) => init), take(1));
  }

}
