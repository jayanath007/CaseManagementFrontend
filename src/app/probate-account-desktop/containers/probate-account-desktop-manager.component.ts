
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseProbateAccountManager } from '../../probate-account-core/containers';

@Component({
  selector: 'dps-probate-account-desktop-manager',
  template: '<ng-content></ng-content>',
})
export class ProbateAccountDesktopManagerComponent extends BaseProbateAccountManager implements OnInit, OnChanges {
  @Input() token;
  @Input() openFrom: any;
  @Input() matterData: any;
  @Input() title: string;
  @Input() isPopup: boolean;
  @Input() editData: any;
  @Input() probateTransId: number;
  @Input() legacyPercentage: number;





  constructor(store: Store<any>) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.token, this.openFrom, this.title, this.isPopup, this.matterData, this.editData, this.probateTransId);

  }
  ngOnChanges(changes: SimpleChanges) {
    // if (changes.matterRef && changes.matterRef.previousValue && changes.matterRef.currentValue
    //   && changes.matterRef.previousValue !== changes.matterRef.currentValue) {
    //   super.initSelectors(this.token, this.matterRef, this.openFrom, this.onlySelectMatter, this.matterData, this.screenId,
    //     this.diaryIds, this.parentToken);
    //   this.onlySelectMatter = this.openFrom === MatterLinkedType.OpenCase ||
    //     this.openFrom === MatterLinkedType.MatterCreation ? false : true;
    // }

    // if (changes.matterData && changes.matterData.previousValue && changes.matterData.currentValue
    //   && changes.matterData.previousValue !== changes.matterData.currentValue) {
    //   this.onChangeMatterData(this.matterData);
    // }
  }



}
