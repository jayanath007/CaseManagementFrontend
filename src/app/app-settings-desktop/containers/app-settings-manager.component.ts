import { Store } from '@ngrx/store';

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BaseAppSettingsManager } from '../../app-settings-core/containers/base-app-settings-manager';
@Component({
    selector: 'dps-app-settings-manager',
    template: `<dps-app-settings-layout (close)="onClose()" [token]="token" > </dps-app-settings-layout>`
})

export class AppSettingsManagerComponent extends BaseAppSettingsManager implements OnInit {
    @Input() inputData;
    @Input() token;
    @Output() close = new EventEmitter();

    constructor(store: Store<any>) {
        super(store);
    }

    ngOnInit() {
        super.initSelectors(this.token, this.inputData);
    }
    onClose() {
        this.close.emit();
    }
}
