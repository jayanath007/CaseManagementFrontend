
import { Component, OnInit } from '@angular/core';
import { ItemViewerBaseClass } from '../../class/item-viewer-base-class';

@Component({
  selector: 'dps-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss']
})
export class ContentViewComponent extends ItemViewerBaseClass implements OnInit {

  constructor() { super(); }

  ngOnInit() {

  }


}
