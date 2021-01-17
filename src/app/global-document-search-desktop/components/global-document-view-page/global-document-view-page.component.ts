import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'dps-global-document-view-page',
  templateUrl: './global-document-view-page.component.html',
  styleUrls: ['./global-document-view-page.component.scss']
})
export class GlobalDocumentViewPageComponent implements OnInit, OnChanges {

  constructor(private cd: ChangeDetectorRef) { }

  @Input() docUrl: string;
  @Input() documentViewOpened: boolean;

  @ViewChild('docDiv') docDiv: ElementRef;


  iFrameLoading = true;


  ngOnInit() {
    this.iFrameLoading = true;
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.docUrl && changes.docUrl.currentValue) {
      // this.sanitizerDocumentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.documentUrl);
      const iframe = document.createElement('iframe');
      iframe.style.height = '100%';
      iframe.style.width = '100%';
      iframe.style.border = '0px';
      iframe.src = this.docUrl;
      this.iFrameLoading = true;
      iframe.onload = () => {
        this.iFrameLoading = false;
        this.cd.detectChanges();
      };
      if (this.docUrl && !this.docUrl.includes('assets/wopi-host.html')) {
        // iframe.setAttribute('sandbox', '');
      }

      iframe.onloadeddata = () => {
        const x = document.getElementsByClassName('pre')[0];
        if (x) {
          alert(x.textContent);
        }
        console.log('element', x);
      };
      iframe.onerror = () => {
        // this.errorHandling();
      };
      iframe.id = 'docView';
      this.docDiv.nativeElement.replaceChild(iframe, this.docDiv.nativeElement.childNodes[0]);
      this.cd.detectChanges();
    }
  }

}
