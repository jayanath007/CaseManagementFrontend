import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseOrganizerSettingsManager } from '../../organizer-settings-core/container/base-organizer-settings-manager';
import { OrganizerSettingsService } from '../../organizer-settings-core/services/organizer-settings-service';
import { AuthInfoStateService } from '../../auth';




@Component({
    selector: 'dps-organizer-settings-manager',
    template: `<dps-organizer-settings-layout [token]="token"
     [isChaserEnable]="isChaserEnable$ | async"
     [reminderSoundEnable]="reminderSoundEnable$ | async"
     [newMailSoundEnable]="newMailSoundEnable$ | async"
     [messageFormat]="messageFormat$|async"
     [isLoading]="isLoading$ | async"
     [isSignatureAutoAdd]="isSignatureAutoAdd$ | async"
     [timeZones]="timeZones$ | async"
     [userTimeZone]="userTimeZone$ | async"
     [automaticRepliesSetting]="automaticRepliesSetting$ | async"
     [signature] = "signature$ | async"
     [userResponse] = "userResponse$ | async"
     [isExtensionsSaveSuccess] ="isExtensionsSaveSuccess$ | async"
     [isSignatureSaveSuccess] ="isSignatureSaveSuccess$ | async"
     [isSaveSuccess] ="isSaveSuccess$ | async"
     [isSaveFail] ="isSaveFail$ | async"
     [userInfo] = "userInfo$  | async"
     [useGlobalSignature] = "useGlobalSignature$|async"
     [signatureTemplete]="signatureTemplete$|async"
     (updateChaserEnableChange)="chaserEnableChange($event)"
     (updateReminderSoundEnableChange)="reminderSoundEnableChange($event)"
     (updateNewMailSoundEnableChange)="newMailSoundEnablehange($event)"
     (updateMessageFormat)="onUpdateMessageFormat($event)"
     (updateAutoSignatureAddChange)="signatureAutoAddChange($event)"
     (updateTimeZoneChange)="timeZoneChangeChange($event)"
     (changeAutomaticRepliesSetting)="onChangeAutomaticRepliesSetting($event)"
     (updateSignatureChange) ="signatureChange($event)"
     (signatureReplaced) ="onReplaceSignature($event)"
     (clear)="clearState()"
     (onSubmit)="submit()"
     (updateImageFile)="onUpdateImageFile($event)"
     (cancel)="onCancel()"
     (updateUseGlobalSignature)="onUpdateIsUseGlobalSig($event)"
     (updateGlobalSignTemplete)="onUpdateGlobalSignTemplete($event)">
    </dps-organizer-settings-layout>`
})

export class OrganizerSettingsManagerComponent extends BaseOrganizerSettingsManager implements OnInit {
    @Input() inputData;
    @Input() token: string;
    @Output() cancel = new EventEmitter();

    constructor(store: Store<any>, service: OrganizerSettingsService, protected authService: AuthInfoStateService) {
        super(store, service, authService);
    }

    ngOnInit() {
        super.initSelectors(this.token, this.inputData);
    }

    onCancel() {
        this.cancel.emit();
    }
}



