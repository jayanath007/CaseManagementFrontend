import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Post, Attachment } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-post-view-content',
  templateUrl: './post-view-content.component.html',
  styleUrls: ['./post-view-content.component.scss']
})
export class PostViewContentComponent implements OnInit, OnChanges {
  @Input() timeZone: string;
  @Input() post: Post;
  @Input() companyCode: any;


  @Output() viewDpsFile = new EventEmitter();
  @Output() downloardFileAttachment = new EventEmitter();
  @Output() openAttachement = new EventEmitter();
  @Output() separateWindow = new EventEmitter();
  @Output() forward = new EventEmitter();
  @Output() replyAll = new EventEmitter();
  @Output() deleteReply = new EventEmitter();
  @Output() replyForward = new EventEmitter();

  @ViewChild('mailBody') mailBody: ElementRef;

  attachments: Attachment[];
  showProfileImg = false;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.post && (changes.post.isFirstChange() ||
      (changes.post.previousValue.id !== changes.post.currentValue.id))) {
      if (!changes.post.isFirstChange() && changes.post.previousValue.from && changes.post.currentValue.from &&
        changes.post.previousValue.from.emailAddress.address !== changes.post.currentValue.from.emailAddress.address) {
        this.showProfileImg = false;
      }
      this.attachments = [];
      if (this.post.attachments && this.post.attachments.length) {
        this.attachments = this.post.attachments
          .filter(att => !!att) // msg view send null Attachments
          .filter(value => !value.isInline);
      }
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

        let body = this.post.body.content;
        if (this.post.body.contentType !== 'html') {
          body = body.replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
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

        iframe.contentDocument.write(body);
        if (iframe.contentDocument.head && iframe.contentWindow.document && iframe.contentWindow.document.body) {
          const base = document.createElement('base');
          base.target = '_blank';
          iframe.contentDocument.head.appendChild(base);
          const imgs = iframe.contentDocument.querySelectorAll<HTMLImageElement>('img[src]');
          for (let i = 0; i < imgs.length; i++) {
            const src = imgs[i].src;
            imgs[i].src = '//:0';
            const title = imgs[i].title;
            imgs[i].title = 'Click here to view image';
            const styleWidth = imgs[i].style.width;
            const styleHeight = imgs[i].style.height;
            const width = imgs[i].width;
            const height = imgs[i].height;
            imgs[i].style.width = '20px';
            imgs[i].style.height = '20px';
            imgs[i].removeAttribute('height');
            imgs[i].removeAttribute('width');
            let retryCount = 1;
            imgs[i].onload = (event: Event) => {
              if (event.target['src'] === src) {
                for (let ind = 0; ind < imgs.length; ind++) {
                  if (imgs[ind].onclick) {
                    imgs[ind].click();
                    break;
                  }
                }
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
              if (event.target['src'] !== 'http://:0/') {
                if (retryCount < 4) {
                  event.target['src'] = '/assets/img-loading.gif';
                  imgs[i].style.width = '150px';
                  imgs[i].style.height = '150px';
                  setTimeout(() => {
                    event.target['src'] = src;
                    retryCount++;
                  }, 1000 * retryCount);
                } else {
                  imgs[i].src = '//:0';
                  imgs[i].style.width = '20px';
                  imgs[i].style.height = '20px';
                  imgs[i].title = 'Click here to view image';
                  retryCount = 1;
                  imgs[i].onclick = (e: MouseEvent) => {
                    e.target['src'] = src;
                    e.target['title'] = title;
                    e.preventDefault();
                    e.stopPropagation();
                    setTimeout(() => {
                      imgs[i].onclick = null;
                    }, 100);
                  };
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

  }
  onForward() {
    // this.forward.emit(this.post.id);
    this.replyForward.emit({ post: this.post, type: 'createForward' });
  }
  onReplyAll() {
    // this.replyAll.emit(this.post.id);
    this.replyForward.emit({ post: this.post, type: 'createReplyAll' });
  }
  onSeparateWindow() {
    this.separateWindow.emit(this.post.id);
  }
  onDeleteReply() {
    this.deleteReply.emit(this.post.id);
  }
  onOpenMatter(event) {
    this.viewDpsFile.emit(event);
  }
  onOpenAttachement(attachment: Attachment) {
    this.openAttachement.emit({ itemId: this.post.id, attachment: attachment });
  }
  onDownloardFileAttachment(attachment: Attachment) {
    this.downloardFileAttachment.emit({ itemId: this.post.id, attachment: attachment });
  }
}
