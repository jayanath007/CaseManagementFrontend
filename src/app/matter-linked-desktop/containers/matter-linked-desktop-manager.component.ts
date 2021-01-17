import { BaseMatterLinkedManager } from '../../matter-linked-core/containers/base-matter-linked-manager';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { MatterLinkedType } from '../../matter-linked-core/models/enum';
import { MatterDataInput } from './../../matter-linked-core/models/interfaces';

@Component({
  selector: 'dps-matter-linked-desktop-manager',
  template: '<ng-content></ng-content>',
})
export class MatterLinkedDesktopManagerComponent extends BaseMatterLinkedManager implements OnInit, OnChanges {
  @Input() matterRef;
  @Input() token;
  @Input() openFrom: MatterLinkedType = MatterLinkedType.MatterCreation;
  @Input() matterData: MatterDataInput;
  @Input() screenId?: any;
  @Input() diaryIds?: any;
  @Input() materLinkParentType;
  @Input() parentToken;







  onlySelectMatter = false;
  constructor(store: Store<any>) {
    super(store);
  }
  ngOnInit() {
    this.onlySelectMatter = this.openFrom === MatterLinkedType.OpenCase || this.openFrom === MatterLinkedType.MatterCreation ? false : true;
    super.initSelectors(this.token, this.matterRef, this.openFrom, this.onlySelectMatter, this.matterData, this.screenId, this.diaryIds,
      this.parentToken);

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterRef && changes.matterRef.previousValue && changes.matterRef.currentValue
      && changes.matterRef.previousValue !== changes.matterRef.currentValue) {
      super.initSelectors(this.token, this.matterRef, this.openFrom, this.onlySelectMatter, this.matterData, this.screenId,
        this.diaryIds, this.parentToken);
      this.onlySelectMatter = this.openFrom === MatterLinkedType.OpenCase ||
        this.openFrom === MatterLinkedType.MatterCreation ? false : true;
    }

    if (changes.matterData && changes.matterData.previousValue && changes.matterData.currentValue
      && changes.matterData.previousValue !== changes.matterData.currentValue) {
      this.onChangeMatterData(this.matterData);
    }
  }



}
