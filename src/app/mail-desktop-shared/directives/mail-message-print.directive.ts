import { DatePipe } from '@angular/common';
import { Directive, HostListener, Input } from '@angular/core';
import { Message } from '../../core/lib/microsoft-graph';
import { TimezonePipe } from '../../shared/pipes/timezone.pipe';

@Directive({
  selector: '[dpsMailMessagePrint]'
})
export class MailMessagePrintDirective {

  @Input() item: Message;
  @Input() timeZone: Message;

  constructor(public timezonePipe: TimezonePipe, public datePipe: DatePipe) { }

  @HostListener('click', ['$event'])
  click(event: Event) {
    const mywindow = window.open('', 'PRINT', 'height=400,width=700');

    mywindow.document.write(`<html><head>
      <title>Spitfire - ${this.item.subject ? this.item.subject : ''}</title>
      <style>
        .dps-text{
          font-weight: normal;
          font-family: Roboto, "Helvetica Neue", sans-serif;
        }
      </style>
      </head><body>
    `);
    // <h3>${this.item.}</h3>
    // <div style=" width: 100%; height: 20px; border:1px solid red; margin-bottom:0px;margin-top:0px; >
    // <img src="http://www.dpsutils.co.uk/DPSFileRepositry/Images/DPSLogo.jpg" alt="DPS Software" style="height:50px;width:50px;">

    // </div>
    mywindow.document.write(`
      <div style="border-top:1px solid black;border-bottom:1px solid black;">
        <h2 class="dps-text">${this.item.subject ? this.item.subject : '(No subject)'}</h2>
      </div>
      <div>
    `);

    if (!(this.item.from && this.item.sender &&
      this.item.from.emailAddress.address !== this.item.sender.emailAddress.address)) {

      mywindow.document.write(`
        <h3 class="dps-text" style="margin-bottom: 0px;">
          ${this.item.from ? this.item.from.emailAddress.name : (this.item.sender ?
          this.item.sender.emailAddress.name : '(No name)')}
          &lt;${this.item.from ? this.item.from.emailAddress.address : (this.item.sender ?
            this.item.sender.emailAddress.address : '')}&gt;
        </h3>
      `);
    } else {
      mywindow.document.write(`
        <h3 class="dps-text" style="margin-bottom: 0px;">
          <span>${this.item.sender.emailAddress.name + '&lt;' + this.item.sender.emailAddress.address + '&gt;'}</span> on behalf of
          <span>${this.item.from.emailAddress.name + '&lt;' + this.item.from.emailAddress.address + '&gt;'}</span>
        </h3>
      `);
    }

    mywindow.document.write(`
          <h5 class="dps-text" style="margin-top: 0px;float:right;">
            ${this.datePipe.transform(this.timezonePipe.transform(this.item.receivedDateTime, this.timeZone), 'EEE dd/MM/yyyy h:mm a')}
          </h5>
          </div>
        `);

    if (this.item.toRecipients && this.item.toRecipients.length > 0) {
      let recipients = ' ';
      this.item.toRecipients.forEach(val => {
        recipients = recipients + ' ' + val.emailAddress.name + '&lt;' + val.emailAddress.address + '&gt;' + ';';
      });
      mywindow.document.write(`
        <h5 class="dps-text">
          <strong>To:</strong>
          <span>${recipients}</span>
        </h5>
      `);
    }

    if (this.item.ccRecipients && this.item.ccRecipients.length > 0) {
      let recipients = ' ';
      this.item.ccRecipients.forEach(val => {
        recipients = recipients + ' ' + val.emailAddress.name + '&lt;' + val.emailAddress.address + '&gt;' + ';';
      });
      mywindow.document.write(`
        <h5 class="dps-text">
          <strong>Cc:</strong>
          <span>${recipients}</span>
        </h5>
      `);
    }

    if (this.item.bccRecipients && this.item.bccRecipients.length > 0) {
      let recipients = ' ';
      this.item.bccRecipients.forEach(val => {
        recipients = recipients + ' ' + val.emailAddress.name + '&lt;' + val.emailAddress.address + '&gt;' + ';';
      });
      mywindow.document.write(`
        <h5 class="dps-text">
          <strong>Cc:</strong>
          <span>${recipients}</span>
        </h5>
      `);
    }

    if (this.item.importance && this.item.importance !== 'normal') {
      mywindow.document.write(`
        <h5 class="dps-text">This message was sent with ${this.item.importance} importance.</h5>
      `);
    }

    if (this.item.flag && this.item.flag.flagStatus && this.item.flag.flagStatus === 'complete') {
      mywindow.document.write(`
        <h5 class="dps-text">
          Flag for follow up. Completed on
         ${this.datePipe.transform(this.timezonePipe.transform(
           this.item.flag.completedDateTime.dateTime, this.timeZone), 'EEE dd/MM/yyyy h:mm a')}.
        </h5>
      `);
    }

    if (this.item.flag && this.item.flag.flagStatus && this.item.flag.flagStatus === 'flagged') {
      let follow = '';
      if (this.item.flag.startDateTime) {
        follow = ' Start by ' +
          this.datePipe.transform(
            this.timezonePipe.transform(this.item.flag.startDateTime.dateTime, this.timeZone), 'EEE dd/MM/yyyy h:mm a') + '.';
      }
      if (this.item.flag.dueDateTime) {
        follow = follow + ' Due by ' +
          this.datePipe.transform(this.timezonePipe.transform(
            this.item.flag.dueDateTime.dateTime, this.timeZone), 'EEE dd/MM/yyyy h:mm a') + '.';
      }
      mywindow.document.write(`
        <h5 class="dps-text">
          Flag for follow up. ${follow}
        </h5>
      `);
    }

    if (this.item.hasAttachments === true) {
      let attachments = '';
      let attachmentsSize = 0;
      let attachmentsCount = 0;
      let attachmentsSizeText = '';
      this.item.attachments.forEach(val => {
        if (val.isInline === false) {
          attachmentsSize = attachmentsSize + val.size;
          attachments = attachments + val.name + '; ';
          attachmentsCount++;
        }
      });
      if (attachmentsCount > 0) {
        if (attachmentsSize > 1000000) {
          attachmentsSizeText = Math.round(attachmentsSize / 1000000) + ' MB';
        } else if (attachmentsSize > 1024) {
          attachmentsSizeText = Math.round(attachmentsSize / 1000) + ' KB';
        } else {
          attachmentsSizeText = attachmentsSize + ' bytes';
        }
        mywindow.document.write(`
          <h5 class="dps-text" style="margin-bottom: 0px;">
            ${attachmentsCount} ${attachmentsCount < 2 ? 'attachment' : 'attachments'} (${attachmentsSizeText})
          </h5>
          <h5 class="dps-text" style="margin-top: 0px;">${attachments}</h5>
        `);
      }
    }

    mywindow.document.write(`${this.item.body.content}`);

    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();
  }
}
