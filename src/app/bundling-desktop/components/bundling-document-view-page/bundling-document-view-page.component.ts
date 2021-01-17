import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dps-bundling-document-view-page',
  templateUrl: './bundling-document-view-page.component.html',
  styleUrls: ['./bundling-document-view-page.component.scss']
})
export class BundlingDocumentViewPageComponent implements OnInit, OnChanges {

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
      if (this.docUrl && !this.docUrl.includes('assets/wopi-host.html')) {
        iframe.setAttribute('sandbox', '');
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
        // this.errorHandling();
      };
      iframe.id = 'docView';
      this.docDiv.nativeElement.replaceChild(iframe, this.docDiv.nativeElement.childNodes[0]);
      this.cd.detectChanges();
    }
  }
}