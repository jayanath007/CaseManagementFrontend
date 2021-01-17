import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConversationListItem } from '../../../mail-core';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResult, ConfirmDialogResultKind } from '../../../shared';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-conversation-short-list-item',
  templateUrl: './conversation-short-list-item.component.html',
  styleUrls: ['./conversation-short-list-item.component.scss']
})
export class ConversationShortListItemComponent implements OnInit {
  @Input() conversation: ConversationListItem;
  @Input() timeZone: string;
  @Input() companyCode: string;

  @Output() conversationDelete = new EventEmitter();
  @Output() conversationSelect = new EventEmitter();
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }
  select(event) {
    this.conversationSelect.emit(this.conversation.data.id);
  }
  delete(event) {
    event.preventDefault();
    event.stopPropagation();
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Delete this conversation?',
        message: `<p>The entire conversation will be removed from the group. Copies of the conversation may not be deleted. Continue?</p>`
      },
      contentParams: {},
      data: null
    };

    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '348px',
      panelClass: 'dps-notification'
    });

    deleteDialogRef.afterClosed().subscribe((result: ConfirmDialogResult) => {
      if (result.kind === ConfirmDialogResultKind.Confirmed) {
        this.conversationDelete.emit(this.conversation.data.id);
      }
    });

  }
}
