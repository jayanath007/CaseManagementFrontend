import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { InboxMessageNotification } from '../../../core/notifications';
import { SimpleChange } from '@angular/core/src/change_detection/change_detection_util';

@Component({
  selector: 'dps-new-mail-indicator-item',
  templateUrl: './new-mail-indicator-item.component.html',
  styleUrls: ['./new-mail-indicator-item.component.scss']
})
export class NewMailIndicatorItemComponent implements OnInit, OnChanges {

  @Input() event: InboxMessageNotification;
  showProfileImg = false;
  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.event) {
      this.showProfileImg = false;
    }
  }
  ngOnInit() {
  }
}
