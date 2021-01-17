import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-auto-reply-msg-item',
  templateUrl: './auto-reply-msg-item.component.html',
  styleUrls: ['./auto-reply-msg-item.component.scss']
})
export class AutoReplyMsgItemComponent implements OnInit {

  @Output() offAutoReply = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  onAutoReplyOff(event) {
    this.offAutoReply.emit(event);
  }
}
