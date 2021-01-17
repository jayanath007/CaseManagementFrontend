

import { LookupInputData } from '../models/interfaces';

import { Store } from '@ngrx/store';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
// import {
//     DeleteWorkflowRule, ChangeWorkflowRuleTextVarNo, ChangeWorkflowRuleCriteria,
//     ChangeWorkflowRuleItem, ChangeWorkflowRuleDescription
// } from '../actions/core';
import { Output, EventEmitter } from '@angular/core';
import { ClearData } from '../../workflow-menu-popup-core/actions/core';
import {
    InitScreenLookup, SaveLookup, ChangeLookupItem, AddNewLookupSuccess,
    DeleteScreenLookup, UpdateDescription, CancelChanges, ExitClientLookupPopup
} from '../actions/core';
import { getScreenLookupListByToken, getScreenLookupIsLoadingByToken } from '../reducers';
import { GetScreenLookupData } from '../../client-creation-core/actions/core';


export class BaseClientScreenLookupManager {

    @Output() closePopup = new EventEmitter();

    myToken: string;
    screenLookupList$: any;
    isLoading$: any;
    // List$: any;
    // selectedWorkflowRuleList$: any;
    // isSaveApply$: any;
    // matterData$: any;
    // exportData$: any;
    // isDirty$: any;

    //   rulePopUpToken: string;

    constructor(protected store: Store<any>) {
    }
    columnsForScreenLookup = {
        columnDef:
            [
                // createDefultColumnDef('rowOrder', { label: 'No.', fxFlex: '45px', filterAnchor: 'start', filterHidden: true },
                //     FieldType.Text),
                createDefultColumnDef('wfR_Command',
                    { label: 'Display Name', fxFlex: '36', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('Description', { label: 'Description', fxFlex: '', filterAnchor: 'start', filterHidden: true },
                    FieldType.Text),
                createDefultColumnDef('Hide', { label: 'Hide', fxFlex: '6', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('', { label: 'Action', fxFlex: '6', filterAnchor: 'end', filterHidden: true }),
                // createDefultColumnDef('wfR_Command', { label: 'Item', fxFlex: '16', filterAnchor: 'end', filterHidden: true }),
                // createDefultColumnDef('wfR_Description', { label: 'Description', fxFlex: '', filterAnchor: 'end', filterHidden: true })

            ],
        paginatorDef: { currentPage: 0, itemPerPage: 50 }
    };

    protected initSelectors(myToken: string, inPutData: LookupInputData) {

        this.myToken = myToken;
        console.log('BaseClientScreenLookupManager-token', myToken);
        this.store.dispatch(new InitScreenLookup(myToken,
            { lookupTypeTag: inPutData.lookupTypeTag }));

        this.isLoading$ = this.store.select(getScreenLookupIsLoadingByToken(myToken));
        this.screenLookupList$ = this.store.select(getScreenLookupListByToken(myToken));
        // this.selectedWorkflowRuleList$ = this.store.select(getSelectedWorkflowRuleRuleListByToken(myToken));
        // this.isSaveApply$ = this.store.select(getIsSaveApplyByToken(myToken));
        // this.matterData$ = this.store.select(getMatterDataByToken(myToken));
        // this.exportData$ = this.store.select(getExportedDataByToken(myToken));
        // this.isDirty$ = this.store.select(getWorkflowRuleIsDirtyByToken(myToken));
    }



    onAddNewLookupClick() {
        this.store.dispatch(new AddNewLookupSuccess(this.myToken));
    }

    onSaveLookupClick() {

        this.store.dispatch(new SaveLookup(this.myToken));
    }

    onLookupItemChangeClick(changeItem) {

        this.store.dispatch(new ChangeLookupItem(this.myToken, {
            rowId: changeItem.rowId,
            changeValue: changeItem.changeValue, changeCol: changeItem.changeCol
        }));

    }


    onDeleteScreenLookupClick(lookupId: number) {
        // alert(lookupId);

        this.store.dispatch(new DeleteScreenLookup(this.myToken, { lookupId: lookupId }));
    }



    onChangeDescriptionClick(description) {
        this.store.dispatch(new UpdateDescription(this.myToken, { lookupTypeDescription: description }));
    }

    onCancelChangeClick() {
        this.store.dispatch(new CancelChanges(this.myToken));
    }

    onCloseLookupClick() {

    this.closePopup.emit();
   this.store.dispatch(new ExitClientLookupPopup(this.myToken));



    }
    onClosePopupClick() {
        this.closePopup.emit();
        this.store.dispatch(new ExitClientLookupPopup(this.myToken));
 
    }
    // onExitWorkflowRulesClick(isRefreshRequired: boolean) {
    //     this.closePopup.emit(isRefreshRequired);
    //     this.store.dispatch(new ExitWorkFlowRule(this.myToken));
    //     this.store.dispatch(new ClearData(this.rulePopUpToken));
    // }

    // onChangeRulePopUpToken(rulePopUpToken) {
    //     this.rulePopUpToken = rulePopUpToken;
    // }
}
