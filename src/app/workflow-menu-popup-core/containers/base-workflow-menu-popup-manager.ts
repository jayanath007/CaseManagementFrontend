import { MatterSearchGridData } from '../../core/lib/matter';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { ComponentBase } from '../../core/lib/component-base';
import { Store } from '@ngrx/store';
import { InitWorkFlowMenu, getPopupMenuIsLoadingByToken } from '..';
import { getPopupMenuTreeViewByToken } from '../reducers';
import { WorkFlowMenuPopupInput } from '../../core/lib/workflow';


export class BaseWorkflowMenuPopupManager extends ComponentBase {
    public WorkflowMenuList$: any;
    public loading$: any;


    constructor(protected store: Store<any>) {
        super();
    }

    protected initSelectors(workflowToken: string, inputData: WorkFlowMenuPopupInput) {
        this.store.dispatch(new InitWorkFlowMenu(workflowToken, {
            inputData: inputData
        }));

        this.WorkflowMenuList$ = this.store.select(getPopupMenuTreeViewByToken(workflowToken));
        this.loading$ = this.store.select(getPopupMenuIsLoadingByToken(workflowToken));
    }

}
