import { Component, OnInit, Input } from '@angular/core';
import { BaseTimeRecordingManager } from '../../time-recording-core/containers/base-time-recording-manager';
import { Store } from '@ngrx/store';
import { SystemJsPopupLoaderService } from '../../shell-desktop';

@Component({
  selector: 'dps-time-recording-manager',
  template: '<ng-content></ng-content>',
})
export class TimeRecordingManagerComponent extends BaseTimeRecordingManager implements OnInit {
  @Input() inputData;
  @Input() token;

  constructor(store: Store<any>) {
    super(store);
  }
  ngOnInit() {
    super.initSelectors(this.token, this.inputData);
  }

}
