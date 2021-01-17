import {
  OnChanges, Output, EventEmitter, ElementRef, SimpleChanges, ViewChild, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject
} from '@angular/core';
import { Component, OnInit, Input } from '@angular/core';
import { centerToWindow } from '../../../utils/bounds';
import { WindowPopupsManagerService } from '../../services/window-popups-manager.service';
import { uuid } from '../../../utils/uuid';
import {
  OpenWopiDocumentEditPoup, DownloadDPSFileToOneDrive,
  DownloadDPSFileToLocal, OpenDPSFileInPopup, OpenPDFDocumentEditPoup
} from '../../actions/window-popups';
import { Store } from '@ngrx/store';
import { FileItemWrapper } from '../../../file-history-core/models/interface';
import { IS_GOOGLE } from '../../../shared';
import { getFileTypeByFullFileName } from '../../../core/utility/DpsUtility';
import { wopiEditExtensions, harmfullFileForView, MatterInfo } from '../../../core';
import { getExtention } from '../../../utils/file';

@Component({
  selector: 'dps-document-view-page',
  templateUrl: './document-view-page.component.html',
  styleUrls: ['./document-view-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentViewPageComponent implements OnInit, OnChanges {


  @Input() fileItem: FileItemWrapper;
  @Input() token: string;
  @Input() documentUrl: string;
  @Input() documentUrlLoadSuccess;
  @Input() documentUrlIsLoading;
  @Input() extension: string;
  @Input() isSignDoc = false;
  @Input() signandSendToken: string;
  @Input() isPopup: boolean;
  @Input() noSandBox: boolean;
  @Input() showDocumentEdit = true;
  @Input() matterInfo: MatterInfo;

  @Output() editDocument = new EventEmitter();
  @Output() sendSignDoc = new EventEmitter<FileItemWrapper>();

  @ViewChild('docDiv') docDiv: ElementRef;



  sanitizerDocumentUrl;
  iFrameLoading = true;
  // showDocumentEdit = false;

  constructor(private windowPopupsManagerService: WindowPopupsManagerService,
    private cd: ChangeDetectorRef,
    private store: Store<any>,
    @Inject(IS_GOOGLE) public isGoogle: string
  ) { }

  ngOnInit() {
    window.addEventListener('message', (event) => {
      if (event.data.token === 'signAndSendRequestDraftId' && this.isSignDoc) {
        this.iFrameLoading = true;
        this.cd.detectChanges();
      } else if (event.data.token === 'signAndSendDraftId' && this.isSignDoc) {
        this.iFrameLoading = false;
        this.cd.detectChanges();
        this.sendSignDoc.emit();
        // const encodeId = encodeURIComponent(event.data.data.Id);
        // const urlPath = '/mail-item/' + encodeId;
        // this.urlPopupService.openWithUrlPoup(urlPath, event.data.data.Id);
      }
    });
  }

  isEditableDoc() {
    const fileType = this.getFileType(this.fileItem);
    return (fileType && fileType.toLowerCase() === 'pdf') || wopiEditExtensions.filter(p => p === fileType).length > 0;
  }

  isCheckoutBySomeoneElse() {
    if (!this.fileItem || !this.fileItem.data) {
      return false;
    }

    // checkout by me
    if (this.fileItem.data.checkedOutHashKey && this.fileItem.data.checkedOutHashKey !== '') {
      return false;
    }
    // should someone else editing
    return this.fileItem.data.checkedOutByUser && this.fileItem.data.checkedOutByUser !== '';
  }

  get showDocumentEditButton() {
    if (!this.showDocumentEdit) {
      return false;
    }
    return this.isEditableDoc() && !this.isCheckoutBySomeoneElse();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.documentUrl) {
      const type = this.documentUrl.split('.').pop();
      if (type !== 'mp4') {
        const fileType = this.getFileType(this.fileItem);
        // if (wopiEditExtentions.filter(p => p === fileType).length > 0) {
        //   this.showDocumentEdit = true;
        // } else {
        //   this.showDocumentEdit = false;
        // }
        // this.sanitizerDocumentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
        const iframe = document.createElement('iframe');
        iframe.style.height = '100%';
        iframe.style.width = '100%';
        iframe.style.border = '0px';
        iframe.src = this.documentUrl;
        if (!this.isSignDoc) {
          this.noSandBox = this.documentUrl.includes('assets/wopi-host.html') ? true : this.noSandBox;
          if (harmfullFileForView.includes(this.extension)) {
            iframe.setAttribute('sandbox', '');
          } if (iframe.hasAttribute('sandbox') && this.noSandBox) {
            iframe.removeAttribute('sandbox');
          }
        }

        iframe.onload = () => {
          this.iFrameLoading = false;
          this.cd.detectChanges();
        };
        iframe.onloadeddata = () => {
          const x = document.getElementsByClassName('pre')[0];
          if (x) {
            alert(x.textContent);
          }
          console.log('element', x);
        };
        iframe.onerror = () => {
          this.errorHandling();
        };
        iframe.id = 'docView';
        this.docDiv.nativeElement.replaceChild(iframe, this.docDiv.nativeElement.childNodes[0]);
        this.cd.detectChanges();
      } else {
        const video = document.createElement('video');
        video.style.height = 'auto';
        video.style.width = '100%';
        video.src = this.documentUrl;
        video.id = 'docView';
        video.controls = true;
        this.docDiv.nativeElement.replaceChild(video, this.docDiv.nativeElement.childNodes[0]);
        this.iFrameLoading = false;
        this.cd.detectChanges();
      }
    }
  }

  errorHandling() {
    // JSON.parse(document.getElementById('docView').contentWindow.document.getElementsByTagName("pre")[0].innerHTML).status
    const doc = <any>document.getElementById('docView');
    if (doc && doc.contentWindow && doc.contentWindow.document && doc.contentWindow.document.getElementsByTagName('pre')[0]) {
      const status = JSON.parse(doc.contentWindow.document.getElementsByTagName('pre')[0].innerHTML).status;
      if (status === 'Exception') {
        alert('error');
      }
    }
  }

  openDocumentEdit() {
    this.editDocument.emit(this.fileItem);
    if (this.fileItem && this.fileItem.data && this.fileItem.data.letter_name) {
      const extention = getExtention(this.fileItem.data.letter_name);
      if (extention && extention.toLocaleLowerCase().trim() === 'pdf') {
        this.store.dispatch(new OpenPDFDocumentEditPoup(this.fileItem.data.letter_name, this.matterInfo));
        return;
      }
    }
    this.store.dispatch(new OpenWopiDocumentEditPoup({ row: this.fileItem }));
  }
  onCloudDownload() {
    this.store.dispatch(new DownloadDPSFileToOneDrive({ diaryId: this.fileItem.data.diary_UID }));
  }
  onDownload() {
    this.store.dispatch(new DownloadDPSFileToLocal({
      appCode: this.matterInfo.AppCode, branchId: this.matterInfo.BranchId,
      fileId: this.matterInfo.FileId,
      itemRef: this.fileItem.data.diary_UID, attachmentName: this.fileItem.data.letter_name
    }));
  }
  openInPopup() {
    if (this.fileItem.data.diary_UID && this.matterInfo && this.matterInfo.AppCode && this.matterInfo.BranchId &&
      this.matterInfo.FileId && this.fileItem.data.letter_name) {
      this.store.dispatch(new OpenDPSFileInPopup({
        appCode: this.matterInfo.AppCode, branchId: this.matterInfo.BranchId,
        fileId: this.matterInfo.FileId,
        itemRef: this.fileItem.data.diary_UID, attachmentName: this.fileItem.data.letter_name
      }));
    }
    // const spec = {
    //   ...centerToWindow(800, 600),
    //   toolbar: false,
    //   location: false,
    //   directories: false,
    //   status: false,
    //   menubar: false,
    //   scrollbars: false,
    // };
    // const uid = uuid();
    // this.windowPopupsManagerService.openWindow(uid, this.documentUrl, spec, this.extension);
  }

  getFileType(fileItem: any): string {
    if (fileItem && fileItem.data && fileItem.data.letter_name) {
      return getFileTypeByFullFileName(fileItem.data.letter_name);
      // if (fileItem.data.letter_name.split('.')[1].toLocaleLowerCase()) {
      //   return fileItem.data.letter_name.split('.')[1].toLocaleLowerCase();
      // }
    }
    return '';
  }
}
