import { Store } from '@ngrx/store';
import {
    InitWorkFlowRule, getWorkflowRuleIsLoadingByToken,
    getWorkflowRuleRuleListByToken, AddNewWorkFlowRule,
    SelectWorkflowRule, ChangeWorkflowRuleUp, ChangeWorkflowRuleDown,
    getSelectedWorkflowRuleRuleListByToken, getIsSaveApplyByToken,
    ExitWorkFlowRule, SaveWorkflowRule, ChangeWorkflowRuleOperator, ChangeWorkflowRuleAction,
    ExportWorkflowRule, ImportWorkflowRule, getExportedDataByToken, SelectWorkflowRuleItem,
    getMatterDataByToken, getWorkflowRuleIsDirtyByToken
} from '..';
import {
    WorkflowInputData, WorkflowRuleOperatorItemData, WorkflowRuleActionItemData,
    WorkflowRuleTextValuChangeData,
    WorkflowRuleFileData
} from '../models/interfaces';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata';
import {
    DeleteWorkflowRule, ChangeWorkflowRuleTextVarNo, ChangeWorkflowRuleCriteria,
    ChangeWorkflowRuleItem, ChangeWorkflowRuleDescription
} from '../actions/core';
import { Output, EventEmitter } from '@angular/core';
import { ClearData } from '../../workflow-menu-popup-core/actions/core';


export class BaseWorkFlowRuleManager {

    @Output() closePopup = new EventEmitter();

    myToken: string;

    isLoading$: any;
    workflowRuleList$: any;
    selectedWorkflowRuleList$: any;
    isSaveApply$: any;
    matterData$: any;
    exportData$: any;
    isDirty$: any;

    rulePopUpToken: string;

    constructor(protected store: Store<any>) {
    }
    columnsForWorkflowRule = {
        columnDef:
            [
                createDefultColumnDef('rowOrder', { label: 'No.', fxFlex: '45px', filterAnchor: 'start', filterHidden: true },
                    FieldType.Text),
                createDefultColumnDef('wfR_Command',
                    { label: 'Test Var.No.', fxFlex: '12', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('operatorText', { label: 'Operator', fxFlex: '16', filterAnchor: 'start', filterHidden: true },
                    FieldType.Text),
                createDefultColumnDef('wfR_Command', { label: 'Criteria', fxFlex: '14', filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('actionText', { label: 'Action', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('wfR_Command', { label: 'Item', fxFlex: '16', filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('wfR_Description', { label: 'Description', fxFlex: '', filterAnchor: 'end', filterHidden: true })

            ],
        paginatorDef: { currentPage: 0, itemPerPage: 50 }
    };

    protected initSelectors(myToken: string, inPutData: WorkflowInputData) {

        this.myToken = myToken;
        console.log('BaseWorkFlowRuleManager-token', myToken);
        this.store.dispatch(new InitWorkFlowRule(myToken,
            { appId: inPutData.AppId, fileId: inPutData.FileId, branchId: inPutData.BranchId, isProspectMatter: inPutData.isProspectMatter }));

        this.isLoading$ = this.store.select(getWorkflowRuleIsLoadingByToken(myToken));
        this.workflowRuleList$ = this.store.select(getWorkflowRuleRuleListByToken(myToken));
        this.selectedWorkflowRuleList$ = this.store.select(getSelectedWorkflowRuleRuleListByToken(myToken));
        this.isSaveApply$ = this.store.select(getIsSaveApplyByToken(myToken));
        this.matterData$ = this.store.select(getMatterDataByToken(myToken));
        this.exportData$ = this.store.select(getExportedDataByToken(myToken));
        this.isDirty$ = this.store.select(getWorkflowRuleIsDirtyByToken(myToken));
    }

    onExportRulesClick() {
        this.store.dispatch(new ExportWorkflowRule(this.myToken));
    }

    onImportRulesClick(fullFileData: WorkflowRuleFileData) {
        this.store.dispatch(new ImportWorkflowRule(this.myToken, { fullFileData: fullFileData }));
    }

    onAddNewRuleClick() {
        this.store.dispatch(new AddNewWorkFlowRule(this.myToken));
    }

    onSaveWorkflowRuleClick() {
        this.store.dispatch(new SaveWorkflowRule(this.myToken));
    }
    onRowClick(selectedRow) {
        this.store.dispatch(new SelectWorkflowRule(this.myToken, { selectedItemData: selectedRow }));
    }

    onOperatorItemClick(selectedRow: WorkflowRuleOperatorItemData) {
        this.store.dispatch(new ChangeWorkflowRuleOperator(this.myToken,
            { selectedItem: selectedRow.item, operator: selectedRow.operator }));
    }

    onActionItemClick(selectedRow: WorkflowRuleActionItemData) {
        this.store.dispatch(new ChangeWorkflowRuleAction(this.myToken,
            { selectedItem: selectedRow.item, action: selectedRow.action }));
    }

    onTestVarNoItemClick(selectedRow: WorkflowRuleTextValuChangeData) {
        this.store.dispatch(new ChangeWorkflowRuleTextVarNo(this.myToken,
            { selectedItem: selectedRow.item, wfR_Test: selectedRow.value }));
    }

    onCriteriaChange(selectedRow: WorkflowRuleTextValuChangeData) {
        this.store.dispatch(new ChangeWorkflowRuleCriteria(this.myToken,
            { selectedItem: selectedRow.item, wfR_Control: selectedRow.value }));
    }
    onItemChange(selectedRow: WorkflowRuleTextValuChangeData) {
        this.store.dispatch(new ChangeWorkflowRuleItem(this.myToken,
            { selectedItem: selectedRow.item, wfR_Command: selectedRow.value }));
    }

    onItemSelect(selectedRow: WorkflowRuleTextValuChangeData) {
        this.store.dispatch(new SelectWorkflowRuleItem(this.myToken,
            {
                selectedItem: selectedRow.item, wfR_Command: selectedRow.value, wfR_Description: selectedRow.value2,
                wfR_CommandNodeID: selectedRow.atN_ID
            }));
    }

    onDescriptionChange(selectedRow: WorkflowRuleTextValuChangeData) {
        this.store.dispatch(new ChangeWorkflowRuleDescription(this.myToken,
            { selectedItem: selectedRow.item, wfR_Description: selectedRow.value }));
    }

    onRuleUpClick() {
        this.store.dispatch(new ChangeWorkflowRuleUp(this.myToken));
    }

    onRuleDownClick() {
        this.store.dispatch(new ChangeWorkflowRuleDown(this.myToken));
    }

    onDeleteWorkflowRulesClick() {
        this.store.dispatch(new DeleteWorkflowRule(this.myToken));
    }

    onExitWorkflowRulesClick(isRefreshRequired: boolean) {
        this.closePopup.emit(isRefreshRequired);
        this.store.dispatch(new ExitWorkFlowRule(this.myToken));
        this.store.dispatch(new ClearData(this.rulePopUpToken));
    }

    onChangeRulePopUpToken(rulePopUpToken) {
        this.rulePopUpToken = rulePopUpToken;
    }
}
