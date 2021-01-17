import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as MicrosoftGraph from '../../../core/lib/microsoft-graph';
import { Theme } from '../../../dashboard-desktop/components/dashboard-layout/enum';


@Component({
  selector: 'dps-calendar-widget-layout',
  templateUrl: './calendar-widget-layout.component.html',
  styleUrls: ['./calendar-widget-layout.component.scss']
})
export class CalendarWidgetLayoutComponent implements OnInit {

  @Input() isLoading: boolean;
  @Input() data: MicrosoftGraph.Event[];
  @Input() layout: number;
  @Input() theme: Theme;


  @Output() openMail = new EventEmitter<MicrosoftGraph.Event>();
  @Output() removeWidget = new EventEmitter();
  @Output() toCalendar = new EventEmitter();


  Theme = Theme;
  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  get emptyListForClasic() {
    if ( this.data && this.data.length < 4) {
      return Array(4 - this.data.length).fill('').map((x, i) => i);
    }
    return [];
  }

  get emptyList() {
    let max = 0;
    if (document.getElementById('widget_calender_events')) {
      const width = document.getElementById('widget_calender_events').clientWidth;
      if (width >= 770) {
        max = 5;
      } else if (width >= 610) {
        max = 4;
      } else if (width >= 460) {
        max = 3;
      } else {
        max = 2;
      }
    }

    if (this.data && this.data.length < max) {
      return Array(max - this.data.length).fill('').map((x, i) => i);
    }
    return [];
  }
  get canNavigate() {
    const div = document.getElementById('widget_calender_events');
    return div && div.scrollWidth > div.clientWidth;
  }
  get canNavigateLeft() {
    const div = document.getElementById('widget_calender_events');
    return div && div.scrollLeft !== 0;
  }
  get canNavigateRight() {
    const div = document.getElementById('widget_calender_events');
    return div && div.scrollLeft < (div.scrollWidth - div.clientWidth);
  }
  openItem(item: MicrosoftGraph.Event) {
    this.openMail.emit(item);
  }

  onRemove() {
    this.removeWidget.emit();
  }

  goToCalendar() {
    this.toCalendar.emit();
  }
  clickNavigateFefore() {
    document.getElementById('widget_calender_events').scrollLeft -= this.getScrollWidth();
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 500);
  }
  clickNavigateNext() {
    document.getElementById('widget_calender_events').scrollLeft += this.getScrollWidth();
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 500);
  }
  getScrollWidth() {
    let max = 0;
    if (document.getElementById('widget_calender_events')) {
      const width = document.getElementById('widget_calender_events').clientWidth;
      if (width >= 770) {
        max = 775;
      } else if (width >= 610) {
        max = 620;
      } else if (width >= 460) {
        max = 465;
      } else {
        max = 310;
      }
    }
    return max;
  }
}
