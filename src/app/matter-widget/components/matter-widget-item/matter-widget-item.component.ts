import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatterSearchGridData } from '../../../core/lib/matter';

@Component({
  selector: 'dps-matter-widget-item',
  templateUrl: './matter-widget-item.component.html',
  styleUrls: ['./matter-widget-item.component.scss']
})
export class MatterWidgetItemComponent implements OnInit {

  @Input() item: MatterSearchGridData;
  @Output() openCase = new EventEmitter<MatterSearchGridData>();

  constructor() { }

  ngOnInit() {
  }

  onClickItem(item: MatterSearchGridData) {
    this.openCase.emit(item);
  }

}
