import { Component, OnInit } from '@angular/core';
import { ItemViewerBaseClass } from '../../class/item-viewer-base-class';

@Component({
  selector: 'dps-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent extends ItemViewerBaseClass implements OnInit {

  constructor() { super(); }

  ngOnInit() {

  }

}
