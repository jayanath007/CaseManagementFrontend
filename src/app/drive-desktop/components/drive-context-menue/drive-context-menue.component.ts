import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { ItemView, ItemClipboard } from '../../../drive-core';
import { DriveItem } from '../../../core/lib/microsoft-graph';
import { SafeBoxType } from '../../../core';

@Component({
  selector: 'dps-drive-context-menue',
  templateUrl: './drive-context-menue.component.html',
  styleUrls: ['./drive-context-menue.component.scss']
})
export class DriveContextMenueComponent implements OnInit {

  @Input() isMultiSelect: boolean;
  @Input() cutCopyItems: ItemClipboard;
  @Input() activeView: ItemView;
  @Input() item: DriveItem;
  @Input() copyFrom: SafeBoxType;

  @Output() download = new EventEmitter<any>();
  @Output() share = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() rename = new EventEmitter<any>();
  @Output() cut = new EventEmitter<any>();
  @Output() copy = new EventEmitter<any>();
  @Output() paste = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Output() addNew = new EventEmitter<any>();
  @Output() attachToDPSFile = new EventEmitter<any>();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  SafeBoxType = SafeBoxType;

  constructor() { }

  ngOnInit() {
  }

  onDownload() {
    this.download.emit();
  }

  onShare() {
    this.share.emit();
  }

  onDelete() {
    this.delete.emit();
  }

  onRename() {
    this.rename.emit();
  }

  onCut() {
    this.cut.emit();
  }

  onCopy() {
    this.copy.emit();
  }

  onPaste() {
    this.paste.emit({ activeView: this.activeView, cutCopyItems: this.cutCopyItems, copyFrom: this.copyFrom });
  }
  onRefresh() {
    this.refresh.emit(this.activeView);
  }
  onAdd(type) {
    this.addNew.emit({ activeView: this.activeView, type });
  }
  onAttachToDPSFile() {
    this.attachToDPSFile.emit();
  }
}
