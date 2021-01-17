import { Component, OnInit, Output, EventEmitter, ViewChild, Inject, Input } from '@angular/core';
import { IS_GOOGLE } from '../../../shared';

@Component({
  selector: 'dps-attachment-upload-menu',
  templateUrl: './attachment-upload-menu.component.html',
  styleUrls: ['./attachment-upload-menu.component.scss']
})
export class AttachmentUploadMenuComponent implements OnInit {

  @Input() mailItemData: any;

  @Output() fromComputer = new EventEmitter();
  @Output() fromCloud = new EventEmitter();

  @ViewChild('contextMenu') contextMenu;

  constructor(@Inject(IS_GOOGLE) public isGoogle: string) { }

  ngOnInit() {
  }
  onComputer(event) {
    this.fromComputer.emit(event);
  }
  onCloud(event) {
    this.fromCloud.emit(event);
  }
}
