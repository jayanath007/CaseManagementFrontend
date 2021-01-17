import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getSortedUploadItems, getUploadingItems } from '../reducers';
import { RemoveUploadedItem } from '../actions/azure';

@Component({
  selector: 'dps-azure-storag-indicator-manager',
  template: `
    <dps-azure-storage-upload-indicator
      [items]="items$|async"
      [uploadinIitems]="uploadinIitems$|async"
      (removeItem)="onRemoveItem($event)">
    </dps-azure-storage-upload-indicator>
  `,
  styles: [],
})
export class AzureStorageIndicatorManagerComponent implements OnInit {

  items$;
  uploadinIitems$;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.items$ = this.store.select(getSortedUploadItems);
    this.uploadinIitems$ = this.store.select(getUploadingItems);
  }
  onRemoveItem(item) {
    this.store.dispatch(new RemoveUploadedItem(item));
  }
}

