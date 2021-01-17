import { Store } from '@ngrx/store';
import {
    getOrganizerSignatureStateByToken,
    getOrganizerSignatureLogoByToken
} from '../reducers';
import {
    InitSignatureProperties, ChangeSignatureTemplate, SubmitSignature, UserSignatureClearState
} from '../actions/core';


export class BaseSignatureSettingsManager {
    myToken: string;

    logo$: any;
    signatureTemplate$: any;

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string, inPutData: any) {
        this.myToken = myToken;
        console.log('OrganizerSettingsManagerComponent-token', myToken);
        this.store.dispatch(new InitSignatureProperties(myToken));

        this.logo$ = this.store.select(getOrganizerSignatureStateByToken(myToken));
        this.signatureTemplate$ = this.store.select(getOrganizerSignatureLogoByToken(myToken));
    }

    signatureTemplateChange(value) {
        console.log('signatureChange', value);
        this.store.dispatch(new ChangeSignatureTemplate(this.myToken, value));
    }

    submit() {
        this.store.dispatch(new SubmitSignature(this.myToken));
    }

    clearState() {
        console.log('clearState');
        this.store.dispatch(new UserSignatureClearState(this.myToken));
    }

}
