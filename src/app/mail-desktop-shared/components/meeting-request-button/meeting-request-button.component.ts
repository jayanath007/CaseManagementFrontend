import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MessageListItem } from '../../../mail-item-core';
import { EventMessageRequest } from '../../../core/lib/microsoft-graph';
import { MeetingResponseComentDialogComponent } from '../../../organizer-desktop-shared';

@Component({
  selector: 'dps-meeting-request-button',
  templateUrl: './meeting-request-button.component.html',
  styleUrls: ['./meeting-request-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingRequestButtonComponent implements OnInit {
  @Input() item: MessageListItem<Readonly<EventMessageRequest>>;
  @Output() onResponse = new EventEmitter();
  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  editResponseBeforeSending(type: string) {
    let title = '';
    switch (type) {
      case 'accept':
        title = 'Accept event and add a response';
        break;
      case 'decline':
        title = 'Decline event and add a response';
        break;
      case 'tentativelyAccept':
        title = 'Tentatively accept event and add a response';
        break;
    }
    const dialogRef = this.dialog.open(MeetingResponseComentDialogComponent, {
      width: '500px',
      height: '265px',
      data: { title: title },
      panelClass: 'dps-organizer-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onResponse.emit({ item: this.item, comment: result.value, sendResponse: true, type: type});
      }
    });
  }
  sendResponseNow(type: string) {
    this.onResponse.emit({ item: this.item, comment: '', sendResponse: true, type: type });
  }
  dontSendResponse(type: string) {
    this.onResponse.emit({ item: this.item, comment: '', sendResponse: false, type: type });
  }
}
