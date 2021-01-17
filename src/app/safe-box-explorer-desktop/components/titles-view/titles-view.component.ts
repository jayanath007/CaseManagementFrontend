import { Component, OnInit } from '@angular/core';
import { ItemViewerBaseClass } from '../../class/item-viewer-base-class';

@Component({
  selector: 'dps-titles-view',
  templateUrl: './titles-view.component.html',
  styleUrls: ['./titles-view.component.scss']
})
export class TitlesViewComponent extends ItemViewerBaseClass implements OnInit {

  constructor() { super(); }

  ngOnInit() {

  }

}
