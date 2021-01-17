import { BaseMatterCreationManager } from '../../matter-creation-core/containers/base-matter-creation-manager';

import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainMenuService } from '../../layout-desktop';
import { InputData } from '../../matter-creation-core';
import { Matter } from '../../matter-creation-core/models/interfaces';


@Component({
  selector: 'dps-matter-creation-manager',
  template: '<ng-content></ng-content>',
  styles: []
})
export class MatterCreationManagerComponent extends BaseMatterCreationManager implements OnInit {

  @Input() inputData: InputData;
  @Input() matterCreationToken;



  @Output() closePopup = new EventEmitter();

  constructor(protected store: Store<any>, protected pageService: MainMenuService) {
    super(store, pageService);
  }

  ngOnInit() {
    super.initSelectors(this.matterCreationToken, this.inputData);
  }

  onPopupClosed(event) {
    super.onPopupClosed(this.matterCreationToken);
    this.closePopup.emit(event);
  }
  onUpdateSelectedMatterData(event) {
    super.onUpdateSelectedMatterData(this.matterCreationToken, event);
  }
  onValueChanged(event) {
    super.onValueChanged(this.matterCreationToken, event);
  }
  onUpdateClient1(event) {
    super.onUpdateClient1(this.matterCreationToken, event);
  }
  onUpdateClient2(event) {
    super.onUpdateClient2(this.matterCreationToken, event);
  }
  onMattereAdd() {
    super.onMattereAdd(this.matterCreationToken);
  }
  onMattereClear() {
    super.onMattereClear(this.matterCreationToken);
  }
  onMattereDelete(event) {
    super.onMattereDelete(this.matterCreationToken, event);
  }
  onMattereSave(event: { data: Matter, openCase: boolean, closePopup: boolean }) {
    let closeAfterSave = false;
    if (!!event.openCase || !!event.closePopup) {
      closeAfterSave = true;
    }
    super.onMattereSave(this.matterCreationToken, event, closeAfterSave);
    // if (!!event.openCase || !!event.closePopup) {
    //   this.closePopup.emit(event);
    // }
  }
  onGetLeadUFN(event) {
    super.onGetLeadUFN(this.matterCreationToken, event);
  }
  onCloserProcessing(event) {
    super.onCloserProcessing(this.matterCreationToken, event);
  }
  onWriteOffNegativeWip(event) {
    super.onWriteOffNegativeWip(this.matterCreationToken, event);
  }
  onChengeIsCompletionNegWOEnabled(event) {
    super.onChengeIsCompletionNegWOEnabled(this.matterCreationToken, event);
  }
  onUpdateCompletionFields(event) {
    super.onUpdateCompletionFields(this.matterCreationToken, event);
  }
  onGetLAMatterTypesAvailable(event) {
    super.onGetLAMatterTypesAvailable(this.matterCreationToken, event);
  }
  onGetLegalAidCombosList(event) {
    super.onGetLegalAidCombosList(this.matterCreationToken, event);
  }
  onGetFileIsLocked(event) {
    super.onGetFileIsLocked(this.matterCreationToken, event);
  }
  onCheckOutstandingUndertakings(event) {
    super.onCheckOutstandingUndertakings(this.matterCreationToken, event);
  }
  // onDepartmentChange(departmentId) {
  //   super.onDepartmentChange(this.matterCreationToken, departmentId);
  // }
  // onMatterFeeEarnerChange(event) {
  //   super.onMatterFeeEarnerChange(this.matterCreationToken, event);
  // }
  addClient(event) {
    super.onAddClient(this.matterCreationToken, event);
  }
  onRemoveClient(clientRef: string) {
    super.removeClient(this.matterCreationToken, clientRef);
  }
  onPromoteClient(clientRef: string) {
    super.promoteClient(this.matterCreationToken, clientRef);
  }

}


