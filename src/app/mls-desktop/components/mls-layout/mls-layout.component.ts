import {
  Component, Input, Output, EventEmitter, ViewChild,
  ElementRef, OnInit, OnChanges, SimpleChanges, AfterViewInit
} from '@angular/core';
import { MLSUser, ChatMessage } from './../../../core/lib/mls';
import { MatDialog } from '@angular/material';
import { TextInsertDialogInput, TextInsertDialogComponent } from '../../../shared';
import { RecipientInputComponent } from '../../../organizer-desktop-shared';
import { User } from '../../../auth';

@Component({
  selector: 'dps-mls-layout',
  templateUrl: './mls-layout.component.html',
  styleUrls: ['./mls-layout.component.scss']
})
export class MlsLayoutComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() isChatListLoading: boolean;
  @Input() users: MLSUser[];
  @Input() isChatMessageLoading: boolean;
  @Input() messages: ChatMessage[];
  @Input() selectedUser: MLSUser;
  @Input() user: User;
  @Input() isSending: boolean;
  @Input() notLoadedItem: boolean;
  @Output() selectUser = new EventEmitter<MLSUser>();
  @Output() sendMsg = new EventEmitter<string>();
  @Output() loadMore = new EventEmitter();
  @Output() changeCanViewMilestone = new EventEmitter();
  @Output() addUser = new EventEmitter<{ message: string, emailAddresses: string }>();

  clickLoadMore = false;
  hideSettingPanel = false;

  constructor(@ViewChild('mlsChatScroll') private myScrollContainer: ElementRef, private dialog: MatDialog) { }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.messages && !this.isChatMessageLoading) {
      if (!this.clickLoadMore) {
        this.scrollToBottom();
      } else if (!this.isChatMessageLoading) {
        this.clickLoadMore = false;
      }
    }
    if ((changes.selectedUser && !changes.selectedUser.isFirstChange())) {
      this.hideSettingPanel = true;
      setTimeout(() =>
        this.hideSettingPanel = false
        , 2);
    }
  }

  ngAfterViewInit() {
    if (!this.clickLoadMore) {
      this.scrollToBottom();
    } else if (!this.isChatMessageLoading) {
      this.clickLoadMore = false;
    }
  }

  onSelectUser(user: MLSUser) {
    this.selectUser.emit(user);
  }

  get senderFullName(): string {
    return this.selectedUser ? `${this.selectedUser.firstName} ${this.selectedUser.lastName}` : '';
  }

  onSendMessage(text: string) {
    this.scrollToBottom();
    this.sendMsg.emit(text);
  }

  get messageViewList(): ChatMessage[] {
    const msgList = JSON.parse(JSON.stringify(this.messages));
    return msgList.reverse();
  }

  scrollToBottom(): void {
    const scrollElm = document.getElementById('mlsChatScroll');
    if (scrollElm) {
      scrollElm.scrollTop = scrollElm.scrollHeight;
    }
  }

  onLoadMore() {
    this.clickLoadMore = true;
    this.loadMore.emit();
  }
  onAddRecipient({ name, address }: { name: string, address: string }, input: RecipientInputComponent) {
    const user = this.users.find(val => address && val.emailAddress.toLowerCase() === address.toLowerCase());
    if (user) {
      this.selectUser.emit(user);
    } else {
      const dialogData: TextInsertDialogInput = {
        content: {
          title: 'Send Message',
          details: 'Enter your first message to',
          message: name,
          placeholder: '',
          acceptLabel: 'Send'
        },
        allowEmpty: false,
        text: '',
        showCancelBtn: true,
      };
      const dialogRef = this.dialog.open(TextInsertDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.addUser.emit({ emailAddresses: address, message: result });
        }
        input.autocompleteTrigger.closePanel();
      });
    }
  }
  OnChangeCanViewMilestone() {
    this.changeCanViewMilestone.emit();
  }

}
