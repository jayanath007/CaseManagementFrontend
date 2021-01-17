import { ViewChangeKind } from '../models/enums';

import { InitPage, SelectNarrativeGroup, ViewChange, BillingNattativeGroupAndItemSave, SelectNarrativeGroupItem, DeleteSelectedNarrativeItem, DeleteSelectedGroup } from '../actions/core';
import { ComponentBase } from '../../core/lib/component-base';
import { Store } from '@ngrx/store';
import { getStateIsLoadingByToken,
    getNarrativeInfoByToken, getNarrativeDataModelByToken, getNarrativeGroupsItemsByToken } from '../reducers';
import { NarrativeGroup } from '../models/interfaces';

export class BaseBillingNarrativeManager extends ComponentBase {

    public myToken: any;
    public isLoading$: any;
    public narrativeGroups$: any;
    public narrativeGroupItems$: any;
    public narrativeInfo$: any;

    // public WorkflowMenuList$: any;
    // public selectedMenuChildList$: any;
    // public matterSummeryList$: any;
    // public matterShortCutList$: any;

    constructor(protected store: Store<any>) {
        super();
    }

    protected initSelectors(billingNarrativeToken: string, inputData: any) {
        this.store.dispatch(new InitPage(billingNarrativeToken, {
            inputData: inputData
        }));
        this.myToken = billingNarrativeToken;
        this.isLoading$ = this.store.select(getStateIsLoadingByToken(billingNarrativeToken));
        this.narrativeGroups$ = this.store.select(getNarrativeDataModelByToken(billingNarrativeToken));
       this.narrativeGroupItems$ = this.store.select(getNarrativeGroupsItemsByToken(billingNarrativeToken));
        this.narrativeInfo$ = this.store.select(getNarrativeInfoByToken(billingNarrativeToken));


        // this.selectedMenuChildList$ = this.store.select(getMenuSelectedChildListByToken(workflowToken));
        // this.matterSummeryList$ = this.store.select(getMatterSummeryByToken(workflowToken));
        // this.matterShortCutList$ = this.store.select(getShortcutKeysByToken(workflowToken));
    }

    onSelectNarrativeGroup(group) {

        this.store.dispatch(new SelectNarrativeGroup(this.myToken, group));

    }

    onViewChange(data) {

        this.store.dispatch(new ViewChange(this.myToken, { kind: data.kind, value: data.value }));

    }

    onSaveNarrationInfo() {

        this.store.dispatch(new BillingNattativeGroupAndItemSave(this.myToken));

    }

    onSaveNarrativeInfo() {

        this.store.dispatch(new BillingNattativeGroupAndItemSave(this.myToken));

    }

    onSelectNarrativeGroupItem(narrativeItem) {

        this.store.dispatch(new SelectNarrativeGroupItem(this.myToken, narrativeItem));
    }

    onDeleteNarrativeItem() {

        this.store.dispatch(new DeleteSelectedNarrativeItem(this.myToken));
    }

    onDeleteGroup() {

        this.store.dispatch(new DeleteSelectedGroup(this.myToken));
    }

}

