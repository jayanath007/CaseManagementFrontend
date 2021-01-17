import { InitSignatureProperties } from '../../organizer-signature-core/actions/core';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseSignatureSettingsManager } from '../../organizer-signature-core/container/base-signature-settings-manager';

@Component({
    selector: 'dps-signature-settings-manager',
    template: ``
})

// <dps-organizer-signature-layout> </dps-organizer-signature-layout>
// [token]="token"
// [logo]="logo$ | async"
// [signatureTemplate] = "signatureTemplate$ | async"
// (clear)="clearState()"
// (onSubmit)="submit()"
// (cancel)="onCancel()"

export class SignatureSettingsManagerComponent extends BaseSignatureSettingsManager implements OnInit {
    @Input() inputData;
    @Input() token: string;
    @Output() cancel = new EventEmitter();

    constructor(store: Store<any>) {
        super(store);
    }

    ngOnInit() {
        super.initSelectors(this.token, this.inputData);
    }
    onCancel() {
        this.cancel.emit();
    }
}




