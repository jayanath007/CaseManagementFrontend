import { Store } from '@ngrx/store';
import { OrganizerSettingsService } from '../services/organizer-settings-service';
import {
    getOrganizerSettingsIsChaserEnableByToken, getOrganizerSettingsIsLoadingByToken,
    getOrganizerSettingsIsSignatureAutoAddByToken, getOrganizerSettingsUserResponseByToken,
    getOrganizerSettingsTimeZonesByToken, getOrganizerSettingsUserTimeZoneByToken, getOrganizerSettingSignatureByToken,
    getOrganizerSettingsIsExtensionsSaveSuccessByToken, getOrganizerSettingsIsSignatureSaveSuccessByToken,
    getOrganizerSettingsIsAllSettingSSaveFailByToken, getOrganizerSettingsIsAllSettingSSaveSuccessByToken,
    getOrganizerSettingsAutomaticRepliesSettingByToken,
    getReminderSoundEnableByToken,
    getNewMailSoundEnableByToken,
    getMessageFormatByToken, getIsGlobalSignatureByToken
} from '../reducers';
import {
    InitOrganizerSettings, ChangeIsAutoSignatureAdd, ChangeIsChaserDesable, Submit, ChangeUserTimeZone,
    ChangeSignature,
    ClearState,
    ReplaceSignatureByTool,
    ChangeAutomaticRepliesSetting,
    ChangeReminderSoundEnable,
    ChangeNewMailSoundEnable,
    ChangeMessageFormat,
    ChangeUseGlobalSignature,
    ChangeGlobalSignatureTemplete
} from '../actions/core';
import { AuthInfoStateService, getGlobalSignatureTemp } from '../../auth';
import { UpdateProfileImage } from '../../auth/actions/auth';


export class BaseOrganizerSettingsManager {
    myToken: string;

    isChaserEnable$: any;
    isLoading$: any;
    isSignatureAutoAdd$: any;
    userResponse$: any;
    timeZones$: any;
    userTimeZone$: any;
    signature$: any;
    isExtensionsSaveSuccess$: any;
    isSignatureSaveSuccess$: any;
    isSaveSuccess$: any;
    isSaveFail$: any;
    userInfo$: any;
    automaticRepliesSetting$: any;
    reminderSoundEnable$: any;
    newMailSoundEnable$: any;
    messageFormat$: any;
    useGlobalSignature$: any;
    signatureTemplete$: any;

    constructor(protected store: Store<any>, protected service: OrganizerSettingsService, protected authService: AuthInfoStateService) {
    }

    protected initSelectors(myToken: string, inPutData: any) {
        this.myToken = myToken;
        this.store.dispatch(new InitOrganizerSettings(myToken));

        this.isChaserEnable$ = this.store.select(getOrganizerSettingsIsChaserEnableByToken(myToken));
        this.isLoading$ = this.store.select(getOrganizerSettingsIsLoadingByToken(myToken));
        this.isSignatureAutoAdd$ = this.store.select(getOrganizerSettingsIsSignatureAutoAddByToken(myToken));
        this.userResponse$ = this.store.select(getOrganizerSettingsUserResponseByToken(myToken));
        this.timeZones$ = this.store.select(getOrganizerSettingsTimeZonesByToken(myToken));
        this.userTimeZone$ = this.store.select(getOrganizerSettingsUserTimeZoneByToken(myToken));
        this.automaticRepliesSetting$ = this.store.select(getOrganizerSettingsAutomaticRepliesSettingByToken(myToken));
        this.signature$ = this.store.select(getOrganizerSettingSignatureByToken(myToken));
        this.isExtensionsSaveSuccess$ = this.store.select(getOrganizerSettingsIsExtensionsSaveSuccessByToken(myToken));
        this.isSignatureSaveSuccess$ = this.store.select(getOrganizerSettingsIsSignatureSaveSuccessByToken(myToken));
        this.isSaveSuccess$ = this.store.select(getOrganizerSettingsIsAllSettingSSaveSuccessByToken(myToken));
        this.isSaveFail$ = this.store.select(getOrganizerSettingsIsAllSettingSSaveFailByToken(myToken));
        this.userInfo$ = this.authService.getUser();
        this.reminderSoundEnable$ = this.store.select(getReminderSoundEnableByToken(myToken));
        this.newMailSoundEnable$ = this.store.select(getNewMailSoundEnableByToken(myToken));
        this.messageFormat$ = this.store.select(getMessageFormatByToken(myToken));
        this.useGlobalSignature$ = this.store.select(getIsGlobalSignatureByToken(myToken));
        this.signatureTemplete$ = this.store.select(getGlobalSignatureTemp());
    }


    chaserEnableChange(value) {
        this.store.dispatch(new ChangeIsChaserDesable(this.myToken, value));
    }
    reminderSoundEnableChange(value) {
        this.store.dispatch(new ChangeReminderSoundEnable(this.myToken, value));
    }
    newMailSoundEnablehange(value) {
        this.store.dispatch(new ChangeNewMailSoundEnable(this.myToken, value));
    }

    onUpdateImageFile(value) {
        this.store.dispatch(new UpdateProfileImage(this.myToken, { image: value }));
    }
    signatureAutoAddChange(value) {
        this.store.dispatch(new ChangeIsAutoSignatureAdd(this.myToken, value));
    }

    signatureChange(value) {
        this.store.dispatch(new ChangeSignature(this.myToken, value));
    }

    submit() {
        this.store.dispatch(new Submit(this.myToken));
    }

    timeZoneChangeChange(timeZone) {
        this.store.dispatch(new ChangeUserTimeZone(this.myToken, timeZone));
    }

    clearState() {
        this.store.dispatch(new ClearState(this.myToken));
    }

    onReplaceSignature(signature: string) {
        this.store.dispatch(new ReplaceSignatureByTool(this.myToken, { signature: signature }));
    }
    onChangeAutomaticRepliesSetting(event) {
        this.store.dispatch(new ChangeAutomaticRepliesSetting(this.myToken, { value: event }));
    }
    onUpdateMessageFormat(event) {
        this.store.dispatch(new ChangeMessageFormat(this.myToken, { value: event }));
    }
    onUpdateIsUseGlobalSig(isUse: boolean) {
        this.store.dispatch(new ChangeUseGlobalSignature(this.myToken, { value: isUse }));
    }
    onUpdateGlobalSignTemplete(templete: string) {
        this.store.dispatch(new ChangeGlobalSignatureTemplete(this.myToken, templete));
    }
}
