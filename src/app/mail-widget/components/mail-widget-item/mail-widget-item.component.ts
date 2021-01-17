import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Message } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-mail-widget-item',
  templateUrl: './mail-widget-item.component.html',
  styleUrls: ['./mail-widget-item.component.scss']
})
export class MailWidgetItemComponent implements OnInit, OnChanges {

  @Input() item: any;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() layout: number;
  @Output() selectItem = new EventEmitter<Message>();

  showProfileImg = false;

  constructor() { }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.item) {
      this.showProfileImg = false;
    }
  }

  onClickItem(item: Message) {
    this.selectItem.emit(item);
  }

}
