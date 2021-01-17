import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FolderListItem } from '../../../mail-core/models/interfaces';
import * as MsGraphBeta from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-welknown-folder-list-view',
  templateUrl: './welknown-folder-List-view.component.html',
  styleUrls: ['./welknown-folder-List-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelknownFolderListViewComponent implements OnInit {
  @Input() folders: FolderListItem<MsGraphBeta.MailFolder>[];
  @Input() isGroupMode: boolean;
  @Output() itemSelect = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  getIcon(wellKnownName: string): string {
    switch (wellKnownName) {
      case 'inbox': return 'inbox';
      case 'drafts': return 'drafts';
      case 'sentitems': return 'unarchive';
      case 'deleteditems': return 'delete';
      case 'archive': return 'archive';
      case 'junkemail': return 'do_not_disturb';
      case 'outbox': return 'folder';
      default: return 'folder';
    }
  }
  selectItem(item, event) {
    this.itemSelect.emit(item);
  }
}
