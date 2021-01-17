import { Component, OnInit } from '@angular/core';
import { ItemViewerBaseClass } from '../../classes/item-viewer-base-class';
import { MatDialog } from '@angular/material';
import { AttachmentIconPipe } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
  selector: 'dps-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent extends ItemViewerBaseClass implements OnInit {

  constructor(dialog: MatDialog, attachmentIcon: AttachmentIconPipe, popupService: SystemJsPopupLoaderService) {
    super(dialog, attachmentIcon, popupService);
  }

  ngOnInit() {

  }

}
