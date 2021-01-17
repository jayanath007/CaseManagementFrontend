import { getSavedDataByToken, getLoadingByToken } from './../reducers/index';
import {
    getColumnDefByToken,
} from './../../matter-linked-core/reducers/index';


import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitProbateAccount, SaveProbateAccountItem } from '../actions/core';




export class BaseProbateAccountManager {
    @Output() closePopup = new EventEmitter<any>();

    public myToken: string;
    public matterData: any;
    public isPopup: boolean;
    public title: string;
    public editData: any;
    public probateTransId: any;
    public legacyPercentage: number;


    public isLoading$: any;
    public savedData$: any;




    constructor(protected store: Store<any>) {
    }


    protected initSelectors(myToken: string, openFrom: any, title: string, isPopup: boolean,
        matterData: any, editData: any, probateTransId?: number, legacyPercentage?: number) {

        this.myToken = myToken;
        this.matterData = matterData;

        this.isLoading$ = this.store.select(getLoadingByToken(myToken));
        this.savedData$ = this.store.select(getSavedDataByToken(myToken));



        this.store.dispatch(new InitProbateAccount(myToken,
            {
                matterData: matterData,
                openFrom: openFrom,
                title: title,
                isPopup: isPopup,
                editData: editData

            }));

    }


    // createLinkedMatter(plotNumbers: string) {
    //     this.store.dispatch(new CreateLinkedMatter(this.myToken, plotNumbers));
    // }

    close(event) {

        this.closePopup.emit(event);
    }




    onSubmitSaveData(event) {
        this.store.dispatch(new SaveProbateAccountItem(this.myToken, event));
    }


}
