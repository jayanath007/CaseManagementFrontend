import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { SafeBoxType } from '../../../core';

@Component({
  selector: 'dps-safebox-context-menue',
  templateUrl: './safebox-context-menue.component.html',
  styleUrls: ['./safebox-context-menue.component.scss']
})
export class SafeboxContextMenueComponent implements OnInit {

  @Input() isMultiSelect: boolean;
  @Input() copyItems: { type: 'copy' | 'cut', path: string[] };
  @Input() isFolder?: boolean;
  @Input() isRefresh?: boolean;
  @Input() isTemplate?: boolean;
  @Input() copyFrom: SafeBoxType;

  @Output() download = new EventEmitter();
  @Output() share = new EventEmitter();
  @Output() delete = new EventEmitter();
  @Output() rename = new EventEmitter();
  @Output() cut = new EventEmitter();
  @Output() copy = new EventEmitter();
  @Output() paste = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() addNew = new EventEmitter();

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
    this.paste.emit();
  }

  onRefresh() {
    this.refresh.emit();
  }

  onAdd(type) {
    this.addNew.emit(type);
  }

}
