import { Component, OnInit, Inject } from '@angular/core';
import { BaseBundlingManager } from '../../bundling-core/containers';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'dps-bundling-option-manager',
  template: `<dps-bundled-options
                [isLoading] = "isLoading$|async"
                [pageNoLoactions] = "pageNoLoactions$|async"
                [bundlingItemList] ="bundleItemObject$ | async"
                [options] = "options$|async"
                (changeOption)= "onChangeOption($event)"
                [bundleHeaderView]="bundleHeaderView$|async"
                [preserveExistingPage]="getIsPreserveExistingPage(data.token) | async"
                (submit)="onSubmit($event)"
                (close)="onClose()">
             </dps-bundled-options>`
})
export class BundlingOptionManagerComponent extends BaseBundlingManager implements OnInit {

  constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA) public data: { input: any, token: string },
    public dialogRef: MatDialogRef<BundlingOptionManagerComponent>) {
    super(store);
  }

  isLoading$: any;
  pageNoLoactions$: any;
  options$: any;
  bundleItemObject$: any;
  bundleHeaderView$: any;

  ngOnInit() {
    this.isLoading$ = this.getOptionsIsLoading(this.data.token);
    this.pageNoLoactions$ = this.getBundlePageNoLocation(this.data.token);
    this.options$ = this.getBundleOptions(this.data.token);
    this.bundleItemObject$ = this.getBundleNameText(this.data.token);
    this.bundleHeaderView$ = this.getBundleHeaderViewModel(this.data.token);
  }

  onChangeOption(event: { key: string, value: any }) {
    this.changeOption(event, this.data.token);
  }

  onSubmit(bundleRoot) {
    this.submit(this.data.token, bundleRoot.bundleObjectId, bundleRoot.bundleName);
    this.dialogRef.close();
  }
  onClose() {
    this.dialogRef.close();
  }
}
