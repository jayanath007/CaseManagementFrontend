import { DocumenWindowPopupService } from './document-window-popup.service';
import { DocumentViewService } from './document-view.service';

import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'dps-document-view',
  templateUrl: './document-view.component.html',
  styleUrls: ['./document-view.component.scss']
})
export class DocumentViewComponent implements OnInit {

  @Input() documentUrl;
  @Input() documentHeight;
  @Input() documentUrlLoadSuccess;
  @Input() documentUrlIsLoading;
  @Input() extension: string;

  sanitizerDocumentUrl;
  iFrameLoaded = false;
  showDocumentEdit = false;
  isWopiUrl = false;

  constructor(private domSanitizer: DomSanitizer, private documenWindow: DocumenWindowPopupService,
    private documentViewService: DocumentViewService) {
  }
  onIFrameLoad() {
    this.iFrameLoaded = true;
    this.documentUrlIsLoading = false;
  }

  openDocumentEdit() {
    this.documenWindow.openPopup('key', this.documentViewService.editeUrl);
  }
  openInPopup() {
    this.documenWindow.openPopup('key', this.documentUrl);
  }

  ngOnInit() {

    if (this.extension === 'docx' || this.extension === 'xlsx' ||
      this.extension === 'pptx' || this.extension === 'ppt' ||
      this.extension === 'xls' || this.extension === 'rtf' ||
      this.extension === 'doc') {
      this.showDocumentEdit = true;
    }
    this.sanitizerDocumentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
    if (this.sanitizerDocumentUrl.includes('assets/wopi-host.html')) {
      this.isWopiUrl = true;
    }
  }

}
