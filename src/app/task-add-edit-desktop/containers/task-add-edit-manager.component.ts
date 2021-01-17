import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import { BaseTaskAddEditManager } from '../../task-add-edit-core/containers/base-task-add-edit-manager';
import { TaskAddEditPopupClose } from '../../task-add-edit-core';

@Component({
    selector: 'dps-task-add-edit-manager',
    template: '<ng-content></ng-content>'
})

export class TaskAddEditManagerComponent extends BaseTaskAddEditManager implements OnInit {
    @Input() inputData: any;
    @Input() taskAddEditToken: string;

    constructor(protected store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        super.initSelectors(this.taskAddEditToken, this.inputData);
    }
    taskAddEditPopupClosed(value) {
        this.closePopup.emit(value);
        this.store.dispatch(new TaskAddEditPopupClose(this.taskAddEditToken));
    }
    uploadedFileData(value) {
        this.uploadedFile(this.taskAddEditToken, value);
    }
    updatePasswordData(value) {
        this.updatePassword(this.taskAddEditToken, value);
    }
    taskAddEditSaveData(value) {
        this.taskAddEditSave(this.taskAddEditToken, value);
    }
    onUnLockPassword(value: string): void {
        this.enterUnLockPW(this.taskAddEditToken, value);
    }
}
