import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ItemUpload } from '../../models/interfaces';
import { ConnectionPositionPair } from '@angular/cdk/overlay';

@Component({
  selector: 'dps-azure-storage-upload-indicator',
  templateUrl: './azure-storage-upload-indicator.component.html',
  styleUrls: ['./azure-storage-upload-indicator.component.scss']
})
export class AzureStorageUploadIndicatorComponent implements OnInit {

  @Input() items: ItemUpload[];
  @Input() uploadinIitems: ItemUpload[];

  @Output() removeItem = new EventEmitter<ItemUpload>();

  showList = false;
  position: ConnectionPositionPair[] = [new ConnectionPositionPair({ originX: 'end', originY: 'bottom' },
    { overlayX: 'end', overlayY: 'top' })];


  constructor() { }

  ngOnInit() {
  }
  indicatorClick() {
    this.showList = !this.showList;
  }
  onRemoveItem(item) {
    this.removeItem.emit(item);
  }
}
