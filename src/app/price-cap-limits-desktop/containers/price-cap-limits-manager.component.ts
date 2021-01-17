import { BasePriceCapManager } from './../../price-cap-limits-core/containers/base-price-cap-manager';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { PriceCapLimitInput } from '../../core/lib/priceCapLimit';
import { take } from 'rxjs/operators';
import { getUser } from '../../auth';

@Component({
  selector: 'dps-price-cap-limits-manager',
  template: `<dps-price-cap-limits-layout
               [isLoading]="isLoading$|async"
               [currentLimit]="currentLimit$|async"
               [userInput]="userInput$|async"
               [hitory]="hitory$|async"
               (changeUserInput)="changeUserInput(data.token, $event)"
               (addToLimitHistory)="onAddToLimitHistory(data.token)"
               (deleteHistoryRow)="onDeleteHistoryRow(data.token, $event)"
               (closePopup)="closePopup()">
              </dps-price-cap-limits-layout>`,
})
export class PriceCapLimitsManagerComponent extends BasePriceCapManager implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    input: PriceCapLimitInput,
    token: string
  },
    public dialogRef: MatDialogRef<PriceCapLimitsManagerComponent>,
    protected store: Store<any>) { super(store); }

  ngOnInit() {
    if (!this.data.input.user) {
      this.store.select(getUser).pipe(take(1)).subscribe(user =>
        this.initSelectors(this.data.token, { ...this.data.input, user: user.general.user })
      );
    } else {
      this.initSelectors(this.data.token, this.data.input);
    }
  }

  closePopup() {
    this.clearStore(this.data.token);
    this.dialogRef.close();
  }

}
