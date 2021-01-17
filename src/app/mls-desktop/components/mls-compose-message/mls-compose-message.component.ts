import { OnChanges, Component, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dps-mls-compose-message',
  templateUrl: './mls-compose-message.component.html',
  styleUrls: ['./mls-compose-message.component.scss']
})
export class MlsComposeMessageComponent implements OnChanges {

  @Input() isSending: boolean;
  @Output() sendMsg = new EventEmitter<string>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isSending && !this.isSending && !changes.isSending.isFirstChange()) {
      const textInput = <HTMLInputElement>document.getElementById('messageInput');
      textInput.value = '';
    }
  }

  onSendMessage(text: string) {
    if (!!text) {
      this.sendMsg.emit(text);
    }
  }

  onInsertMessageKeydown(event: any, text: string) {
    if (event.keyCode === 13) {
      this.onSendMessage(text);
    }
  }

}
