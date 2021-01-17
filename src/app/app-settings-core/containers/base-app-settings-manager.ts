import { Store } from '@ngrx/store';

export class BaseAppSettingsManager {

    public myToken: string;
    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string, inPutData: any) {
        this.myToken = myToken;
    }
}
