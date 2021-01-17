import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as MicrosoftGraph from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-calendar-widget-item',
  templateUrl: './calendar-widget-item.component.html',
  styleUrls: ['./calendar-widget-item.component.scss']
})
export class CalendarWidgetItemComponent implements OnInit {

  @Input() item: MicrosoftGraph.Event;
  @Output() selectItem = new EventEmitter<MicrosoftGraph.Event>();

  constructor() { }

  ngOnInit() {
  }

  onClickItem(item: MicrosoftGraph.Event) {
    this.selectItem.emit(item);
  }

}
