import { Component, OnInit } from '@angular/core';
import { ItemViewerBaseClass } from '../../class/item-viewer-base-class';

@Component({
  selector: 'dps-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent extends ItemViewerBaseClass implements OnInit {

  constructor() { super(); }

  ngOnInit() {

  }

}
