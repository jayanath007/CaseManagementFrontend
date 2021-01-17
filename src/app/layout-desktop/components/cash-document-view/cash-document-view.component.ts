
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'dps-cash-document-view',
  templateUrl: './cash-document-view.component.html',
  styleUrls: ['./cash-document-view.component.scss']
})
export class CashDocumentViewComponent implements OnInit {
  sanitizerDocumentUrl: any;
  preloadUrls: Array<{ index: number, url: any, count: number }> = [];

  constructor(private domSanitizer: DomSanitizer, private layoutService: LayoutService) { }


  ngOnInit() {
    // this.layoutService.getPreloadUrls().subscribe((data) => {
    //   data.forEach((element, index) => {
    //     this.sanitizerDocumentUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(element.fullUrl);
    //     const item: { index: number, url: string, count: number } = { index: index, url: this.sanitizerDocumentUrl, count: 1 };
    //     this.preloadUrls.push(item);
    //   });
    // });
  }

  onIFrameLoad(event, item) {
    if (item && item.count && item.count === 1) {
      const blankUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('about:blank');
      const newItem: { index: number, url: any, count: number } = { index: item.index, url: blankUrl, count: 500 };
      this.preloadUrls[item.index] = newItem;
      item.count = item.count + 1;
    }
  }
}
