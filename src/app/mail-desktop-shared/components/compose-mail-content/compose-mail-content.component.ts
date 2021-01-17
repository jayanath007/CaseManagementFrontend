import { InfoDialogType } from './../../../core/utility/DpsUtility';
import { InforDialogData } from './../../../shared/models/dialog';
import { InforDialogComponent } from './../../../shared/components/infor-dialog/infor-dialog.component';
import { distinctUntilChanged, debounceTime, take } from 'rxjs/operators';
import {
  Component, OnInit, ChangeDetectionStrategy, Input, Output,
  EventEmitter, SimpleChanges, ViewChild, AfterViewInit, OnChanges, ElementRef
} from '@angular/core';
import { Attachment, Message, FileAttachment, ItemAttachment, Recipient, ItemBody } from '../../../core/lib/microsoft-graph';
import { AttachmentWrapper } from '../../../compose-mail-core';
import { uuid } from '../../../utils/uuid';
import { MessageItemWrapper } from '../../../mail-item-core';
import { Subject } from 'rxjs';
import { RecipientInputComponent } from '../../../organizer-desktop-shared';
import { FileItemWrapper } from '../../../file-history-core';
import { MatDialog } from '@angular/material';
import { checkUploadFileIsBlacklisted, showInforDialog } from '../../../core/utility/DpsUtility';
import { FormControl } from '@angular/forms';
import _ from 'lodash';
import { DpsCkEditorComponent } from '../../../ck-editor';

@Component({
  selector: 'dps-compose-mail-content',
  templateUrl: './compose-mail-content.component.html',
  styleUrls: ['./compose-mail-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComposeMailContentComponent implements OnInit, AfterViewInit, OnChanges {
  _item: Message;
  @Input() refItem: Message;
  @Input() followUpText: string;
  @Input() signature: string;
  @Input() listAttachements: AttachmentWrapper[];
  @Input() lastInlineAttachment: AttachmentWrapper;

  @Output() addToRecipient = new EventEmitter();
  @Output() removeToRecipient = new EventEmitter();
  @Output() addCcRecipient = new EventEmitter();
  @Output() removeCcRecipient = new EventEmitter();
  @Output() addBccRecipient = new EventEmitter();
  @Output() removeBccRecipient = new EventEmitter();
  @Output() downloardFileAttachment = new EventEmitter();
  @Output() deleteAttachment = new EventEmitter();
  @Output() subjectChange = new EventEmitter();
  @Output() bodyChange = new EventEmitter();
  @Output() addAttachment = new EventEmitter();
  @Output() openAttachement = new EventEmitter();

  @ViewChild('toRecipientInput') toRecipientInput: RecipientInputComponent;
  @ViewChild('ccRecipientInput') ccRecipientInput: RecipientInputComponent;
  @ViewChild('bccRecipientInput') bccRecipientInput: RecipientInputComponent;
  @ViewChild('mailBody') mailBody: ElementRef<HTMLDivElement>;
  @ViewChild('subjectInput') subjectInput: ElementRef<HTMLInputElement>;
  @ViewChild(DpsCkEditorComponent) ckEditor: DpsCkEditorComponent;

  onBodyChange = new Subject<string>();
  inputCtrl = new FormControl();
  body = '';
  readonlyBody = '';
  editableBody = '';
  hideCcBcc = true;
  isPopup = false;
  // get showCcBcc() {
  //   return (this.item && this.item.ccRecipients.length > 0) || (this.item && this.item.bccRecipients.length > 0) || !this.hideCcBcc;
  // }

  constructor(public dialog: MatDialog) { }

  @Input() set item(value: Message) {
    if (value && (this.body === '' || (this._item && this._item.id && this._item.id !== value.id))) {
      this.readonlyBody = '';
      if (value.body.contentType === 'text') {
        this.body = value.body.content;
        this.editableBody = value.body.content;
        if (this.mailBody) {
          this.mailBody.nativeElement.style.display = 'none';
        }
      } else {
        if (this.mailBody) {
          this.separateBody(value.body);
        } else {
          setTimeout(() => {
            this.separateBody(value.body);
          }, 10);
        }

      }
    }
    this._item = value;
  }

  get item() {
    return this._item;
  }


  ngOnInit() {
    if (window.opener && window.opener !== window && window.name !== 'mail') {
      // you are in a popup
      this.isPopup = true;
    }
    this.inputCtrl.valueChanges.subscribe((value: string) => {
      this.onBodyChange.next(value);
    });
  }
  ngAfterViewInit() {
    // const subject1 = new Subject<string>();
    const subject2 = new Subject<string>();
    // subject1.pipe(
    //   debounceTime(2000),
    //   distinctUntilChanged())
    //   .subscribe((event) => {
    //     this.bodyChange.emit({ body: event, isLocal: false });
    //   });
    subject2.pipe(
      distinctUntilChanged())
      .subscribe((event) => {
        this.bodyChange.emit({ body: event, isLocal: true });
      });
    this.onBodyChange.subscribe(event => {
      this.editableBody = event;
      const body = this.getFullMessage(event);
      // subject1.next(body);
      subject2.next(body);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.item && (!changes.item.previousValue || changes.item.previousValue.id !== changes.item.currentValue.id)) {
      this.hideCcBcc = !((this.item && this.item.ccRecipients && this.item.ccRecipients.length > 0) ||
        (this.item && this.item.bccRecipients && this.item.bccRecipients.length > 0));
    }
  }
  onAddToRecipient(recipient) {
    this.addToRecipient.emit(recipient);
  }
  onAddCcRecipient(recipient) {
    this.addCcRecipient.emit(recipient);
  }
  onAddBccRecipient(recipient) {
    this.addBccRecipient.emit(recipient);
  }
  onRemoveToRecipient(recipient) {
    this.removeToRecipient.emit(recipient);
  }
  onRemoveCcRecipient(recipient) {
    this.removeCcRecipient.emit(recipient);
  }
  onRemoveBccRecipient(recipient) {
    this.removeBccRecipient.emit(recipient);
  }
  onDownloardFileAttachment({ attachment, type }) {
    this.downloardFileAttachment.emit({ owner: 'me', itemId: this.item.id, attachment: attachment, type });
  }
  onDeleteAttachment(attachment: Attachment) {
    this.deleteAttachment.emit({ itemId: this.item.id, attachmentId: attachment.id });
  }
  onOpenAttachement(attachment: Attachment) {
    this.openAttachement.emit({ itemId: this.item.id, attachment: attachment });
  }
  onSubjectChange(subject: string) {
    this.subjectChange.emit(subject);
  }
  // onBodyChange(event) {
  //   this.bodyChange.emit();
  // }

  onInlineAttachemnt(event) {
    const parts = event.base64.split(',');
    const base64Str = parts[1];
    // const uid = uuid();
    const attachment: FileAttachment = {
      name: event.file.name,
      contentBytes: base64Str,
      size: event.file.size,
      contentType: event.file.type,
      contentId: event.contentId,
      isInline: true
    };
    this.addAttachment.emit({ attachment: attachment, uid: event.elementId, type: 'fileAttachment' });
  }

  onFileAttachement(files: File[]) {
    let totalSize = 0;
    for (let i = 0; i < files.length; i++) {
      totalSize = totalSize + files[i].size;
    }
    if (this.validateTotleSizeOfUploadingAttachments(totalSize)) {

      let backListedItem = '';

      for (let i = 0; i < files.length; i++) {
        if (checkUploadFileIsBlacklisted(files[i].name)) {
          backListedItem = `${backListedItem} <br>${files[i].name}`;
        } else {
          const reader: FileReader = new FileReader();
          let attachment: FileAttachment;
          reader.onload = (evt) => {
            const parts = (<any>reader.result).split(',');
            const base64Str = parts[1];
            attachment = {
              name: files[i].name,
              contentBytes: base64Str,
              size: files[i].size,
              contentType: files[i].type,
              isInline: false
            };
          };
          reader.readAsDataURL(files[i]);
          reader.onloadend = (evt) => {
            attachment['@odata.type'] = '#microsoft.graph.fileAttachment';
            this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'fileAttachment' });
          };

        }
      }
      if (backListedItem) {
        showInforDialog('Harmful file detection',
          `You are try to upload harmful file type, please contact admin.
           <br> Following items not uploaded <br> ${backListedItem}`, InfoDialogType.warning, this.dialog);
      }
    }
    // const parts = event.base64.split(',');
    // const base64Str = parts[1];
    // const attachment: FileAttachment = {
    //   name: event.file.name,
    //   contentBytes: base64Str,
    //   size: event.file.size,
    //   contentType: event.file.type,
    //   isInline: false
    // };
    // attachment['@odata.type'] = '#microsoft.graph.fileAttachment';
    // this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'fileAttachment' });
  }
  validateTotleSizeOfUploadingAttachments(size: number) {
    const totalSize = this.listAttachements.map(val => val.attachment.size).reduce((total, val) => total + val, 0);
    if (totalSize + size > 34000000) {
      const limit = Math.round(((34000000 - totalSize) / 100000)) / 10;
      const dialogData: InforDialogData = {
        content: {
          title: `Attachments`,
          message: `The total size of attachments that can be attached is 34 MB. Please try attaching less than ${limit} MB item(s).`
        },
        data: { messageType: 'alert' },
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
      return false;
    }
    return true;
  }
  onItemAttachement(event) {
    if (event.itemType === 'mailItem') {
      const items: MessageItemWrapper[] = JSON.parse(event.jsonString);
      if (items && items.length > 0) {
        items.forEach(val => {
          const attachment: ItemAttachment = {
            name: val.data.subject || 'No subject',
            size: 0,
            isInline: false,
            item: val.data
          };
          attachment['@odata.type'] = '#microsoft.graph.itemAttachment';
          this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'itemAttachment' });
        });
      }
    } else if (event.itemType === 'fileHistorData') {
      const items: FileItemWrapper[] = JSON.parse(event.jsonString);
      if (items && items.length > 0) {
        items.forEach(val => {
          if (val.data.letter_name) {
            const attachment: ItemAttachment = {
              name: val.data.letter_name,
              size: 0,
              isInline: false,
              item: <any>val.data
            };
            attachment['@odata.type'] = '#microsoft.graph.fileAttachment';
            this.addAttachment.emit({ attachment: attachment, uid: uuid(), type: 'diaryAttachment' });
          }
        });
      }
    }
  }
  public setRecipients() {
    if (this.toRecipientInput) {
      this.toRecipientInput.focuseOut();
    }
    if (this.ccRecipientInput) {
      this.ccRecipientInput.focuseOut();
    }
    if (this.bccRecipientInput) {
      this.bccRecipientInput.focuseOut();
    }
  }
  onDrop(event: DragEvent, textarea) {
    if (event.dataTransfer.files.length === 0) {
      const dropZones: [string] = JSON.parse(localStorage.getItem('dpsDropZones'));
      if (event.dataTransfer.types && event.dataTransfer.types.length === 1 && dropZones && dropZones.includes('mailCompose')) {
        const parts = event.dataTransfer.getData('text').split(/;jsonString,(.+)/);
        const jsonString = parts[1];
        const dragDataType = parts[0].split('text/')[1];
        if (dragDataType === 'recipient') {
          const resp: Recipient = JSON.parse(jsonString);
          const respString = event.dataTransfer.getData('text');
          const respText = ` ${resp.emailAddress.name} (${resp.emailAddress.address})`;
          setTimeout(() => {
            textarea.value = textarea.value.replace(respString, respText);
          });
        } else {
          event.preventDefault();
          event.stopPropagation();
          this.onItemAttachement({ jsonString: jsonString, itemType: dragDataType });
        }
      }
    } else {
      event.preventDefault();
      event.stopPropagation();
      const files = _.range(event.dataTransfer.files.length).map((index) => files.dataTransfer.files[index]);
      this.onFileAttachement(files);
    }
  }

  separateBody(value: ItemBody) {

    if (!this.mailBody) {
      setTimeout(() => {
        this.separateBody(value);
      }, 10);
      return;
    }
    setTimeout(() => {
      if (!this.item.toRecipients || this.item.toRecipients.length < 1) {
        this.toRecipientInput.focus();
      } else if (!this.item.subject) {
        this.subjectInput.nativeElement.focus();
      } else {
        if (this.ckEditor) {
          this.ckEditor.editorFocus();
        }
      }
    }, 1000);
    this.mailBody.nativeElement.style.display = 'none';
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    // iframe.setAttribute('sandbox', '');
    iframe.onload = () => {

      const updateHeight = () => {
        setTimeout(() => {
          if (iframe.contentWindow && iframe.contentWindow.document) {
            iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
          }
        }, 100);
        setTimeout(() => {
          if (iframe.contentWindow && iframe.contentWindow.document) {
            iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
          }
        }, 1000);
        setTimeout(() => {
          if (iframe.contentWindow && iframe.contentWindow.document) {
            iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
          }
        }, 5000);
      };

      let body = value.content;
      body = `<style>
        .dps-white-gray-scroll::-webkit-scrollbar {
          height: 15px;
          width: 15px;
          background-color: rgba(0, 0, 0, 0);
        }
        .dps-white-gray-scroll::-webkit-scrollbar-thumb {
          background-color: #c1c1c1;
          -webkit-border-radius: 10px;
          border-radius: 10px;
          border: 4px solid rgba(0, 0, 0, 0);
          background-clip: padding-box;
          height: 40px;
          width: 40px;
        }
        .dps-white-gray-scroll{
          scrollbar-face-color: #c1c1c1;
          overflow-x: auto;
          overflow-y: hidden;
        }
      </style>` + body;
      body = body.replace(/<base[^>]+>/g, '');
      iframe.contentDocument.write(body);
      if (iframe.contentDocument.head && iframe.contentWindow.document && iframe.contentWindow.document.body) {
        const div = document.createElement('div');
        let isRplyFwd = false;
        const textBody = value.content.replace(/<[^>]*>/g, '');
        if (textBody.length > 5000) {
          const hrTags = iframe.contentWindow.document.getElementsByTagName('hr');
          if (!hrTags || hrTags.length < 1 || !hrTags[0].nextElementSibling || hrTags[0].nextElementSibling.id !== 'divRplyFwdMsg') {
            const wordSection1 = iframe.contentWindow.document.body.firstElementChild;
            if (wordSection1 && wordSection1.className.includes('WordSection1')) {
              for (let index = 0; index < wordSection1.children.length; index++) {
                if (wordSection1.children[index].tagName === 'DIV') {
                  const child = <HTMLElement>wordSection1.children[index].firstElementChild;
                  if (child && child.style.borderTop && child.innerHTML.includes('>From:<')) {
                    for (let ind = 0; ind < index; ind++) {
                      div.appendChild(wordSection1.children[0]);
                    }
                    isRplyFwd = true;
                  }
                  break;
                }
              }
            }
          } else {
            isRplyFwd = true;
            const parentElements: HTMLElement[] = [hrTags[0]];
            while (parentElements[0].tagName !== 'BODY') {
              parentElements.unshift(parentElements[0].parentElement);
            }
            parentElements.forEach((element, i) => {
              if ((parentElements.length - 1) > i) {
                for (let index = 0; index < element.children.length; index++) {
                  if (element.children[index] === parentElements[i + 1]) {
                    for (let ind = 0; ind < index; ind++) {
                      div.appendChild(element.children[0]);
                    }
                    break;
                  }
                }
              }
            });
          }
        }

        if (isRplyFwd) {
          this.body = div.innerHTML;
          this.editableBody = div.innerHTML;
        } else {
          this.body = body;
          this.editableBody = body;
          return;
        }
        setTimeout(() => {
          this.ckEditor.writeValue(this.body);
        }, 10);

        div.remove();
        this.readonlyBody = iframe.contentWindow.document.body.innerHTML.trim();
        this.mailBody.nativeElement.style.display = 'block';
        iframe.contentWindow.document.body.childNodes.forEach(node => {
          if (node.nodeType !== 3) {
            node['className'] = node['className'] + ' dps-white-gray-scroll';
          }
        });
        const base = document.createElement('base');
        base.target = '_blank';
        iframe.contentDocument.head.appendChild(base);
        const imgs = iframe.contentDocument.querySelectorAll<HTMLImageElement>('img[src]');
        for (let i = 0; i < imgs.length; i++) {
          const src = imgs[i].src;
          const styleWidth = imgs[i].style.width;
          const styleHeight = imgs[i].style.height;
          const width = imgs[i].width;
          const height = imgs[i].height;
          imgs[i].style.width = '150px';
          imgs[i].style.height = '150px';
          imgs[i].removeAttribute('height');
          imgs[i].removeAttribute('width');
          let retryCount = 1;
          imgs[i].onload = (event: Event) => {
            if (event.target['src'] === src) {
              imgs[i].style.width = styleWidth;
              imgs[i].style.height = styleHeight;
              if (width) {
                imgs[i].setAttribute('width', width + 'px');
              }
              if (height) {
                imgs[i].setAttribute('height', height + 'px');
              }
              setTimeout(() => {
                if (iframe.contentWindow && iframe.contentWindow.document) {
                  iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
                }
              }, 100);
            }
          };
          imgs[i].onerror = (event: Event) => {

            if (retryCount < 4) {
              event.target['src'] = '/assets/img-loading.gif';
              setTimeout(() => {
                event.target['src'] = src;
                retryCount++;
              }, 1000 * retryCount);
            } else {
              event.target['onerror'] = null;
              imgs[i].style.width = styleWidth;
              imgs[i].style.height = styleHeight;
              if (width) {
                imgs[i].setAttribute('width', width + 'px');
              }
              if (height) {
                imgs[i].setAttribute('height', height + 'px');
              }
              setTimeout(() => {
                if (iframe.contentWindow && iframe.contentWindow.document) {
                  iframe.height = iframe.contentWindow.document.body.scrollHeight + 'px';
                }
              }, 100);
            }
          };
        }
        updateHeight();
      }
    };
    this.mailBody.nativeElement.replaceChild(iframe, this.mailBody.nativeElement.childNodes[0]);
  }

  onEditFullMessage() {
    this.body = this.getFullMessage(this.editableBody);
    this.editableBody = this.body;
    this.readonlyBody = '';
    this.mailBody.nativeElement.style.display = 'none';
  }

  getFullMessage(event) {
    let body = '';
    if (this.readonlyBody
      .startsWith('<div class="dps-email-body" style="font-family:Arial,Helvetica,sans-serif; font-size:10pt; color:#000000">')) {
      body = this.readonlyBody
        .replace('<div class="dps-email-body" style="font-family:Arial,Helvetica,sans-serif; font-size:10pt; color:#000000">',
          `<div class="dps-email-body" style="font-family:Arial,Helvetica,sans-serif; font-size:10pt; color:#000000">
              ${event}
            `
        ) +
        '<style>p{margin: 0; line-height: 1.3;}</style>';
    } else if (this.readonlyBody
      .startsWith('<div class="WordSection1">')) {
      body = this.readonlyBody
        .replace('<div class="WordSection1">',
          `<div class="WordSection1 dps-email-body" style="font-family:Arial,Helvetica,sans-serif; font-size:10pt; color:#000000">
              ${event}
            `
        ) +
        '<style>p{margin: 0; line-height: 1.3;}</style>';
    } else if (this.readonlyBody
      .startsWith(
        '<div class="WordSection1 dps-email-body" style="font-family:Arial,Helvetica,sans-serif; font-size:10pt; color:#000000">')) {
      body = this.readonlyBody
        .replace(
          '<div class="WordSection1 dps-email-body" style="font-family:Arial,Helvetica,sans-serif; font-size:10pt; color:#000000">',
          `<div class="WordSection1 dps-email-body" style="font-family:Arial,Helvetica,sans-serif; font-size:10pt; color:#000000">
              ${event}
            `
        ) +
        '<style>p{margin: 0; line-height: 1.3;}</style>';
    } else {
      body = '<div class="dps-email-body" style="font-family: Arial,Helvetica,sans-serif; font-size: 10pt; color: #000000;">' +
        event + this.readonlyBody +
        '</div><style>p{margin: 0; line-height: 1.3;}</style>';
    }
    return body;
  }

}
