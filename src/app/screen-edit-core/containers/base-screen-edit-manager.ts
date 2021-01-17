import { EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { SubmitScreenEdit, ScreenEditClose } from '../actions/screen-edit';
import {
    getScreenEditComponentTreeDataByToken, getScreenEditRuleListData, getIsSubmitedByToken, getIsLoadingByToken,
    getScreenEditComponentStructure
} from './../reducers';

export class BaseScreenEditManager {
    public myToken: string;
    public isLoading$: any;
    public screenEditComponentTreeData$: any;
    public screenEditRuleListData$: any;
    public isSubmited$: any;
    public componentStructure$: any;

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(myToken: string, inputData: any) {
        this.myToken = myToken;
        this.screenEditComponentTreeData$ = this.store.select(getScreenEditComponentTreeDataByToken(myToken));
        this.screenEditRuleListData$ = this.store.select(getScreenEditRuleListData);
        this.isSubmited$ = this.store.select(getIsSubmitedByToken(myToken));
        this.isLoading$ = this.store.select(getIsLoadingByToken(myToken));
        this.componentStructure$ = this.store.select(getScreenEditComponentStructure);
    }

    updateControlList(event) {
        this.store.dispatch(new SubmitScreenEdit(this.myToken, event));
    }
    screenEditClose() {
        this.store.dispatch(new ScreenEditClose(this.myToken));
    }
}
