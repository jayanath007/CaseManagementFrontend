import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { OpportunitySaveViewModel } from './../../opportunity-core/models/interfaces';
import { BaseOpportunityManager } from './../../opportunity-core/containers/base-opportunity-manager';

@Component({
    selector: 'dps-opportunity-quote-run-popup-manager',
    template: `<dps-opportunity-quote-run-popup
                    [isQuoteRunLoading]="isQuoteRunLoading$|async"
                    [templete]="templete$|async"
                    [feeEarnerList]="feeEarnerList$|async"
                    [opportunity]="data.item"
                    [departmentList]="departmentList$|async"
                    [homeCurrency]="homeCurrency$|async"
                    [closePopup]="closePopup$|async"
                    (generateProcess)="onGenerateProcess(data.token, $event)"
                    (quoteRunPopupClose)="onClose($event)">
             </dps-opportunity-quote-run-popup>`
})
export class OpportunityQuoteRunPopupManagerComponent extends BaseOpportunityManager implements OnInit {

    constructor(store: Store<any>, @Inject(MAT_DIALOG_DATA)
    public data: { token: string, item: OpportunitySaveViewModel, isNewOpertunity: boolean, isEditQuote: boolean },
        public dialogRef: MatDialogRef<OpportunityQuoteRunPopupManagerComponent>) {
        super(store);
    }
    ngOnInit() {
        this.initQuoteRunPopup(this.data.token, this.data.item);
    }

    onClose(status: string) {
        if (status === 'success' && this.data.isNewOpertunity) {
            this.onClearInputOpportunity(this.data.token);
        }
        this.dialogRef.close();
    }

}
