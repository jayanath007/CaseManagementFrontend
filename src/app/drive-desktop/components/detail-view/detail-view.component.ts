import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemViewerBaseClass } from '../../classes/item-viewer-base-class';
import { MatDialog } from '@angular/material';
import { AttachmentIconPipe } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { ItemView } from '../../../drive-core';

@Component({
  selector: 'dps-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent extends ItemViewerBaseClass implements OnInit {

  @Input() sortOrder: { sortBy: string, orderBy: string };

  @Output() changeSortOrder = new EventEmitter<{ sortBy: string, orderBy: string, activeView: ItemView }>();

  constructor(dialog: MatDialog, attachmentIcon: AttachmentIconPipe, popupService: SystemJsPopupLoaderService) {
    super(dialog, attachmentIcon, popupService);
  }

  ngOnInit() {

  }
  onHeaderClick(sortBy: string) {
    if (!this.isSearching) {
      if (sortBy === this.sortOrder.sortBy) {
        this.changeSortOrder.emit({ sortBy, orderBy: this.sortOrder.orderBy === 'asc' ? 'desc' : 'asc', activeView: this.activeView });
      } else {
        this.changeSortOrder.emit({ sortBy, orderBy: 'asc', activeView: this.activeView });
      }
    }

  }

}
