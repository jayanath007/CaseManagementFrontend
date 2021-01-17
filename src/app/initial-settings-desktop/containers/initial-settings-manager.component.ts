import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseInitialSettingsManager } from '../../initial-settings-core/container/base-initial-settings-manager';

@Component({
    selector: 'dps-initial-settings-manager',
    template: `<dps-initial-settings-layout [token]="token"
     [timeZones]="timeZones$ | async"
     [userTimeZone]="userTimeZone$ | async"
     [languages] = "languages$ | async"
     [userLanguage] = "userLanguage$ | async"
     [isLoading] = "isLoading$ | async"
     [isUpdateSuccess] = "isUpdateSuccess$ | async"
     [isUpdateFail] = "isUpdateFail$ | async"
     [isUpdating] = "isUpdating$ | async"

     (updateTimeZoneChange)="timeZoneChange($event)"
     (updateLanguageChange)="languageChange($event)"
     (onSubmit)="submit()"
     (cancel)="onCancel()"
   >
    </dps-initial-settings-layout>`
})


// (clear)="clearState()"
// (onSubmit)="submit()"
// (cancel)="onCancel()"
//   [isSaveSuccess] ="isSaveSuccess$ | async"
export class InitialSettingsManagerComponent extends BaseInitialSettingsManager implements OnInit {
    @Input() inputData;
    @Input() token: string;
    @Output() onClose = new EventEmitter();

    constructor(store: Store<any>) {
        super(store);
    }

    ngOnInit() {
        super.initSelectors(this.token, this.inputData);
    }

    onCancel() {
        this.onClose.emit();
    }
}




