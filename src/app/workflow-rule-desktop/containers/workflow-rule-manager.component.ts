import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseWorkFlowRuleManager } from '../../workflow-rule-core/container/base-workflow-rule-manager';
import { WorkflowInputData } from '../../workflow-rule-core/models/interfaces';

@Component({
    selector: 'dps-workflow-rule-manager',
    template: `<ng-content></ng-content>`
})


// (clear)="clearState()"
// (onSubmit)="submit()"
// (cancel)="onCancel()"
//   [isSaveSuccess] ="isSaveSuccess$ | async"
export class WorkflowRuleManagerComponent extends BaseWorkFlowRuleManager implements OnInit {
    @Input() inputData: WorkflowInputData;
    @Input() token: string;
    //  @Output() onClose = new EventEmitter();

    constructor(store: Store<any>) {
        super(store);
    }

    ngOnInit() {
        super.initSelectors(this.token, this.inputData);
    }

    // onCancel() {
    //     this.onClose.emit();
    // }


}




