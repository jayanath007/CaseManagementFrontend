
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatterInfo } from './../../core/lib/matter';
import { MlsBaseManager } from './../../mls-core/containers/mls-base-manager';
import { Store } from '@ngrx/store';

@Component({
  selector: 'dps-mls-manager',
  template: `<dps-mls-layout *ngIf="showNow"
              [isChatListLoading]="isChatListLoading$|async"
              [users]="users$|async"
              [isChatMessageLoading]="isChatMessageLoading$|async"
              [messages]="messages$|async"
              [selectedUser]="selectedUser$|async"
              [user]="user$|async"
              [isSending]="isSending$|async"
              [notLoadedItem]="notLoadedItem$|async"
              (selectUser)="onSelectUser(token, $event)"
              (sendMsg)="onSendMessage(token, $event)"
              (loadMore)="onLoadMore(token)"
              (changeCanViewMilestone)="onChangeCanViewMilestone(token)"
              (addUser)="onAddUser(token, $event)"
              >
              </dps-mls-layout>`
})
export class MlsManagerComponent extends MlsBaseManager implements OnChanges {

  @Input() matterInfo: MatterInfo;
  @Input() refreshCount: number;
  @Input() showContent: boolean;
  showNow: boolean;
  token: string;

  constructor(store: Store<any>) {
    super(store);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterInfo) {
      this.token = 'InitCaseMLS' + changes.matterInfo.currentValue.MatterReferenceNo;
      this.initMLS(this.token, this.matterInfo);
    }
    if (changes.refreshCount && !changes.refreshCount.firstChange) {
      if (this.matterInfo) {
        this.refresh(this.token);
      }
    }
    if (changes.showContent) {
      setTimeout(() => {
        this.showNow = this.showContent ? true : false;
      }, 300);
    }
  }
}

