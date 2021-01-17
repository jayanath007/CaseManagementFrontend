
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ItemViewerBaseClass } from '../../classes/item-viewer-base-class';
import { MatDialog } from '@angular/material';
import { AttachmentIconPipe } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
  selector: 'dps-icon-view',
  templateUrl: './icon-view.component.html',
  styleUrls: ['./icon-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconViewComponent extends ItemViewerBaseClass implements OnInit {

  constructor(dialog: MatDialog, attachmentIcon: AttachmentIconPipe, popupService: SystemJsPopupLoaderService) {
    super(dialog, attachmentIcon, popupService);
  }

  ngOnInit() {

  }


}
