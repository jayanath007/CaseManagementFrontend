import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseWorkflowMenuPopupManager } from '../../workflow-menu-popup-core/containers/base-workflow-menu-popup-manager';
import { WorkFlowMenuPopupInput } from '../../core/lib/workflow';

@Component({
  selector: 'dps-workflow-menu-popup-manager',
  template: '<ng-content></ng-content>',
})
export class WorkFlowMenuPopupManagerComponent extends BaseWorkflowMenuPopupManager implements OnInit {

  constructor(store: Store<any>) {
    super(store);
  }
  @Input() token: string;
  @Input() inputData: WorkFlowMenuPopupInput;
  
  @Output() closePopup = new EventEmitter();

  ngOnInit() {
    super.initSelectors(this.token, this.inputData);
  }

  onViewChange(value) {
    // this.viewChange(this.token, value);
  }

  onSelectRow(row): void {
    // this.selectRow(this.token, row);
  }

  onSelectNood(data) {
    this.closePopup.emit(data);
  }

  close() {
    this.closePopup.emit();
  }

}
