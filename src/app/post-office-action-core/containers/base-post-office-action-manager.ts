
import { Store } from '@ngrx/store';
import {
    InitPostOfficeAction, PostOfficeActionModelChange, LoadFeeEarnerList
    , SaveTimeRecords, ClosePopup, PrintDoc, NewForm
} from '../actions/core';
import {
    getFeeEarnerList,
    getModelByToken,
    getGroupList,
    getIsLoadingByToken,
    getEnabaleControlers,
    getActionList,
    getDiaryFoldesList,
    getItemTypeList,
    getInputDataByToken,
    getIsClose,
} from '../reducers';
import { Output, EventEmitter } from '@angular/core';
import { ButtonAction } from '../models/enum';
import { PostOfficeActionInputData } from '../models/interfaces';


export class BasePostOfficeActionManager {

    constructor(protected store: Store<any>) {
    }

    @Output() closePopup = new EventEmitter();

    myToken: string;
    isLoading$: any;
    feeEarnerList$: any;
    groupList$: any;
    actionList$: any;
    itemTypeList$: any;
    diaryFoldesList$: any;
    model$: any;
    enabaleControlers$: any;
    inputData$: any;
    isClose$: any;


    protected initSelectors(myToken: string, inputData: PostOfficeActionInputData) {
        this.myToken = myToken;
        this.store.dispatch(new InitPostOfficeAction(myToken,
            {
                inputData: inputData,
            }));
        this.isLoading$ = this.store.select(getIsLoadingByToken(myToken));
        this.feeEarnerList$ = this.store.select(getFeeEarnerList(myToken));
        this.groupList$ = this.store.select(getGroupList(myToken));
        this.actionList$ = this.store.select(getActionList(myToken));
        this.itemTypeList$ = this.store.select(getItemTypeList(myToken));
        this.diaryFoldesList$ = this.store.select(getDiaryFoldesList(myToken));
        this.model$ = this.store.select(getModelByToken(myToken));
        this.enabaleControlers$ = this.store.select(getEnabaleControlers(myToken));
        this.inputData$ = this.store.select(getInputDataByToken(myToken));
        this.isClose$ = this.store.select(getIsClose(myToken));
    }

    onModelChange(data) {
        this.store.dispatch(new PostOfficeActionModelChange(this.myToken, data ));
    }

    onGroupChange(event) {
        this.store.dispatch(new LoadFeeEarnerList(this.myToken, { groupId: event }));
    }

    close() {
        this.store.dispatch(new ClosePopup(this.myToken));
        this.closePopup.emit();
    }

    onClickAction(action: ButtonAction) {
        switch (action) {
            case ButtonAction.New:
                this.store.dispatch(new NewForm(this.myToken));
                break;
            case ButtonAction.Save:
                this.store.dispatch(new SaveTimeRecords(this.myToken));
                break;
            case ButtonAction.Print:
                this.store.dispatch(new PrintDoc(this.myToken));
                break;
            default:
                break;
        }
    }

}
