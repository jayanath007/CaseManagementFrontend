import { Store } from '@ngrx/store';
import {
    getInitialSettingsTimeZonesByToken, getInitialSettingsUserTimeZoneByToken, getInitialSettingsIsLoadingByToken
} from '../reducers';
import {
    InitInitialSettings, InitialSettingsSubmit, InitialSettingsClearState,
    ChangeInitialSettingsUserTimeZone, ChangeInitialSettingsUserLanguage
} from '../actions/core';
import { getInitialSettingsUserLanguageByToken, getInitialSettingsLanguagesByToken,
     getInitialSettingsIsUpdateSuccessByToken, getInitialSettingsIsUpdateFailByToken,
      getInitialSettingsIsIsUpdatingByToken } from '..';


export class BaseInitialSettingsManager {
    myToken: string;

    isLoading$: any;
    timeZones$: any;
    userTimeZone$: any;
    languages$: any;
    userLanguage$: any;

    isUpdateSuccess$: any;
    isUpdateFail$: any;
    isUpdating$: any;

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string, inPutData: any) {
        this.myToken = myToken;
        console.log('InitialSettingsManagerComponent-token', myToken);
        this.store.dispatch(new InitInitialSettings(myToken));

        this.isLoading$ = this.store.select(getInitialSettingsIsLoadingByToken(myToken));
        this.timeZones$ = this.store.select(getInitialSettingsTimeZonesByToken(myToken));
        this.userTimeZone$ = this.store.select(getInitialSettingsUserTimeZoneByToken(myToken));
        this.languages$ = this.store.select(getInitialSettingsLanguagesByToken(myToken));
        this.userLanguage$ = this.store.select(getInitialSettingsUserLanguageByToken(myToken));
        this.isUpdateSuccess$ = this.store.select(getInitialSettingsIsUpdateSuccessByToken(myToken));
        this.isUpdateFail$ = this.store.select(getInitialSettingsIsUpdateFailByToken(myToken));
        this.isUpdating$ = this.store.select(getInitialSettingsIsIsUpdatingByToken(myToken));

    }

    submit() {
        this.store.dispatch(new InitialSettingsSubmit(this.myToken));
    }

    timeZoneChange(timeZone) {
        console.log('timeZoneChangeChange', timeZone);
        this.store.dispatch(new ChangeInitialSettingsUserTimeZone(this.myToken, timeZone));
    }
    languageChange(locale) {
        console.log('languageChangeChange', locale);
        this.store.dispatch(new ChangeInitialSettingsUserLanguage(this.myToken, locale));
    }

    clearState() {
        console.log('clearState');
       // this.store.dispatch(new InitialSettingsClearState(this.myToken));
    }

}
