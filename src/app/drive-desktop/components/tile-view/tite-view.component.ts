import { Component, OnInit } from '@angular/core';
import { ItemViewerBaseClass } from '../../classes/item-viewer-base-class';
import { MatDialog } from '@angular/material';
import { AttachmentIconPipe } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';

@Component({
    selector: 'dps-tile-view',
    templateUrl: './tile-view.component.html',
    styleUrls: ['./tile-view.component.scss']
})
export class TileViewComponent extends ItemViewerBaseClass implements OnInit {

    constructor(dialog: MatDialog, attachmentIcon: AttachmentIconPipe, popupService: SystemJsPopupLoaderService) {
        super(dialog, attachmentIcon, popupService);
    }

    ngOnInit() {

    }

}
