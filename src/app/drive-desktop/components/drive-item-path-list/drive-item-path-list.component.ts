import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, QueryList, ViewChild } from '@angular/core';
import { Navigation, CopyingItem, UploadingItem } from '../../../drive-core';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'dps-drive-item-path-list',
  templateUrl: './drive-item-path-list.component.html',
  styleUrls: ['./drive-item-path-list.component.scss']
})
export class DriveItemPathListComponent implements OnInit, OnChanges {

  @Input() navigations: Navigation[];
  @Input() searchText: string;
  @Input() copyingItems: CopyingItem[];
  @Input() uploadingItems: UploadingItem[];

  @Output() navigate = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() clearCopyingItems = new EventEmitter();
  @Output() clearUploadingItems = new EventEmitter();

  @ViewChild('copyingMenuTrigger', { read: MatMenuTrigger }) protected copyingMenuTrigger: MatMenuTrigger;
  @ViewChild('uploadingMenuTrigger', { read: MatMenuTrigger }) protected uploadingMenuTrigger: MatMenuTrigger;

  public get _copyingItems(): CopyingItem[] {
    return this.copyingItems ? this.copyingItems.filter(item => item.operation.status === 'inProgress') : [];
  }
  public get _uploadingItems(): UploadingItem[] {
    return this.uploadingItems ? this.uploadingItems.filter(item => item.status === 'inProgress') : [];
  }
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.copyingItems && changes.copyingItems.previousValue &&
      changes.copyingItems.previousValue.length === 0 && changes.copyingItems.currentValue.length > 0) {
      setTimeout(() => {
        this.copyingMenuTrigger.openMenu();
      }, 10);
    }
    if (changes.copyingItems && changes.copyingItems.currentValue &&
      changes.copyingItems.currentValue.length > 0 && this._copyingItems.length === 0 && !this.copyingMenuTrigger.menuOpen) {
      this.copyingMenuTrigger.openMenu();
    }

    if (changes.uploadingItems && changes.uploadingItems.previousValue &&
      changes.uploadingItems.previousValue.length === 0 && changes.uploadingItems.currentValue.length > 0) {
      setTimeout(() => {
        this.uploadingMenuTrigger.openMenu();
      }, 10);
    }
    if (changes.uploadingItems && changes.uploadingItems.currentValue &&
      changes.uploadingItems.currentValue.length > 0 && this._uploadingItems.length === 0 && !this.uploadingMenuTrigger.menuOpen) {
      this.uploadingMenuTrigger.openMenu();
    }
  }
  onNavigate(navigation: Navigation) {
    this.navigate.emit(navigation.viewPath);
  }
  onRefresh() {
    this.refresh.emit(this.navigations[this.navigations.length - 1].viewPath);
  }
  onCopyingMenueClosed() {
    if (this._copyingItems.length === 0) {
      this.clearCopyingItems.emit();
    }
  }
  onUploadingMenueClosed() {
    if (this._uploadingItems.length === 0) {
      this.clearUploadingItems.emit();
    }
  }
}
