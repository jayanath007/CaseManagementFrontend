import { Component, OnInit, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Message } from '../../core/lib/microsoft-graph';
import { BaseComposeMailStoreManager } from '../../compose-mail-core/containers/base-compose-mail-store-manager';
import { ReadingPaneMode } from '../../auth';

@Component({
  selector: 'dps-compose-mail-store-manager',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeMailStoreManagerComponent extends BaseComposeMailStoreManager implements OnInit, OnChanges {

  @Input() composeItem: Message;
  @Input() emailReadingPaneMode: ReadingPaneMode;
  constructor(store: Store<any>) {
    super(store);
  }
  ngOnInit() {
    this.setComposeItem(this.composeItem, this.emailReadingPaneMode);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.emailReadingPaneMode !== 'hide' && changes.composeItem && !changes.composeItem.isFirstChange() &&
      changes.composeItem.previousValue.id !== changes.composeItem.currentValue.id) {
      this.saveAndClearComposeMail(changes.composeItem.previousValue.id);
      this.setComposeItem(changes.composeItem.currentValue, this.emailReadingPaneMode);
    }
  }
}
