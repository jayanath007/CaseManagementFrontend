import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FolderItemWrapper, MailBox, GroupListItem } from './../../../mail-core';
import { SideBarMenuMode } from '../../models/enums';
import { RouterOutlets } from '../../models/enums';
import { ReadingPaneMode } from '../../../auth';

@Component({
  selector: 'dps-mail-layout',
  templateUrl: './mail-layout.component.html',
  styleUrls: ['./mail-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MailLayoutComponent implements OnInit {

  @Input() folders: FolderItemWrapper[];
  @Input() welknownFolders: FolderItemWrapper[];
  @Input() menuMode: SideBarMenuMode;
  @Input() isFolderLoading: boolean;
  @Input() selectedFolder: FolderItemWrapper;
  @Input() deleteItemsFolder: FolderItemWrapper;
  @Input() visibleOutlet: RouterOutlets;
  @Input() isSearching: boolean;
  @Input() readingPaneMode: ReadingPaneMode;
  @Input() mailBoxes: MailBox[];
  @Input() groups: GroupListItem[];
  @Input() isGroupExpanded: boolean;
  @Input() initView = false;
  @Input() isGroupMode: boolean;
  @Input() selectedGroup: GroupListItem;
  @Input() profile: { upn: string, name: string };
  @Input() activeOutlet: string;

  @Output() folderToggleExpand = new EventEmitter();
  @Output() folderSelect = new EventEmitter();
  @Output() folderEditOperations = new EventEmitter();
  @Output() folderMenuToggle = new EventEmitter();
  @Output() newMail = new EventEmitter();
  @Output() newRootFolder = new EventEmitter();
  @Output() moveItems = new EventEmitter();
  @Output() mailboxToggle = new EventEmitter();
  @Output() removeSharedFolder = new EventEmitter();
  @Output() addSharedFolder = new EventEmitter();
  @Output() groupsToggle = new EventEmitter();
  @Output() selectGroup = new EventEmitter();
  @Output() mailboxRefresh = new EventEmitter();
  @Output() folderRefresh = new EventEmitter();

  SideBarMenuMode = SideBarMenuMode;

  constructor() { }

  ngOnInit() {

  }
  onFolderSelect(event) {
    this.folderSelect.emit({ item: event, readingPaneMode: this.readingPaneMode });
  }
  onFolderRefresh(event) {
    this.folderRefresh.emit(event);
  }
  onCurrentFolderSelect() {
    this.folderSelect.emit({ item: this.selectedFolder, readingPaneMode: this.readingPaneMode });
  }
  onFolderEditOperation($event) {
    this.folderEditOperations.emit($event);
  }

  onFolderToggle($event) {
    this.folderToggleExpand.emit($event);
  }

  onFolderMenuToggle($event) {
    this.folderMenuToggle.emit($event);
  }
  onNewMail($event) {
    this.newMail.emit(this.readingPaneMode);
  }

  showSearchOptions($event) {

  }

  onNewRootFolder(displayName) {
    this.newRootFolder.emit(displayName);

  }

  onMoveItems(event) {
    this.moveItems.emit(event);
  }
  onMailboxToggle(event) {
    this.mailboxToggle.emit(event);
  }
  onMailboxRefresh(event) {
    this.mailboxRefresh.emit(event);
  }
  onRemoveSharedFolder(event) {
    this.removeSharedFolder.emit(event);
  }
  onAddSharedFolder(event) {
    this.addSharedFolder.emit(event);
  }
  onGroupsToggle() {
    this.groupsToggle.emit();
  }
  onSelectGroup(event) {
    this.selectGroup.emit({ event, readingPaneMode: this.readingPaneMode });
  }
  onSearchViewChange(event, searchOptionsViewManage) {
    if (this.isGroupMode) {
      // this.onFolderSelect(this.selectedFolder);
    } else {
      searchOptionsViewManage.onSearchViewChange(event);
    }
  }
}
