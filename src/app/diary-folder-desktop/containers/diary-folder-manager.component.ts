
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngrx/store';
import { BaseDiaryFolderManager } from '../../diary-folder-core/containers/base-diary-folder-manager';

@Component({
  selector: 'dps-diary-folder-manager',
  template: '<ng-content></ng-content>',
  styles: []
})
export class DiaryFolderManagerComponent extends BaseDiaryFolderManager implements OnInit {

  constructor(store: Store<any>) {
    super(store);
  }

  @Input() inputData: number;
  @Input() token: string;
  @Input() isPopup: boolean;

  @Output() closePopUp = new EventEmitter();

  ngOnInit() {
    super.initSelectors(this.token, this.inputData);
    this.isSaved$.subscribe(val => {
      if (val) {
        this.closePopUp.emit();
      }
    });
  }
  onSaveFolders(type) {
    super.onSaveFolders(type);
  }
}
