import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormViewRequestViewModel } from '../../screen-view-core/models/request';
import { UserScreenMediator } from '../../workflow-core';

@Component({
  selector: 'dps-screen-view-popup-manager',
  template: `
      <dps-screen-view-manager  [inputData]="data.medator"
        [token]="data.token" #screenView="screenViewManage" >
        <dps-screen-view
          (onLoadingData)="screenView.onFormDataLoading(data.token,$event)"
          (onTabLogicUpdate)="screenView.onUpdateTabLogic(data.token,$event)"
          (onViewChange)="screenView.onFormViewChange(data.token,$event)"
          (onCurrentContactId)="screenView.onSetCurrentContactId(data.token, $event)"
          (refreshContactOnFlag)="screenView.onRefreshContactOnFlag(data.token, $event)"
          (onNewVarValues)="screenView.onNewVarValues(data.token, $event)"
          (onClearFormData)="screenView.onClearFormData(data.token)"
          (onContactDirty)="screenView.onContactDirty(data.token, $event)"
          (onScreenControlValuesDirty)="screenView.onScreenControlValuesDirty(data.token, $event)"
          (onEnableSaving)="screenView.onEnableSaving(data.token, $event)"
          (onIncrmentContactsOnFile)="screenView.onIncrementContactsOnFile(data.token)"
          (onDecrementContactsOnFile)="screenView.onDecrementContactsOnFile(data.token)"
          (onUnlinkContact)="screenView.onUnlinkContact(data.token, $event)"
          (onScreenControlValuesDirty)="screenView.onScreenControlValuesDirty(data.token, $event)"
          (onResetContactList)="screenView.onResetContactList(data.token)"
          (onDisableSearchButtons)="screenView.onDisableSearchButtons(data.token, $event)"
          (onAtachmentUpload)="screenView.onAtachmentUpload(data.token, $event)"

          [medator]="data.medator"
          [formView]="screenView.curentFormView$ | async "
          [screenViewState]="screenView.screenViewState$ | async "
          [initialInfor]="screenView.initialInforData$ | async "
          [matterDetails]="screenView.matterDetails$ | async "
          [contactDirty]="screenView.contactDirty$ | async "
          [contactsOnFile]="screenView.contactsOnFile$ | async "
          [enableSaving]="screenView.enableSaving$ | async"
          [currentContactId]="screenView.currentContactId$ | async "
          [disableSearchButtons]="screenView.disableSearchButtons$ | async "
          [token] ="data.token"
          [screenControlValuesIsDirty]="screenView.screenControlValuesisDirty$ | async"
          >
      </dps-screen-view>
    </dps-screen-view-manager>
    `,
  styles: []
})
export class ScreenViewPopupManagerComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data:
    { medator: UserScreenMediator, token: string }) {

  }

  ngOnInit() {
  }
}
