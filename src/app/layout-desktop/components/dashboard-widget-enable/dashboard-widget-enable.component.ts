
import { getMLSWidgetData } from './../../../mls-widget/reducers/index';
import { getDashBoardWidgetList } from './../../reducers/index';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { DashBoardWidgetListActiveItem, DashBoardWidgetListDeactivateItem } from '../../actions/right-sidenav';
import { getHelpWidgetData } from '../../../help-videos-widget/reducers/index';
import { Observable } from 'rxjs';
import { ChatMessage } from '../../../core/lib/mls';


@Component({
  selector: 'dps-dashboard-widget-enable',
  templateUrl: './dashboard-widget-enable.component.html',
  styleUrls: ['./dashboard-widget-enable.component.scss']
})
export class DashboardWidgetEnableComponent implements OnInit {

  public widgetList$;
  public data$: Observable<ChatMessage[]>;
  public helpData$;
  panelOpenState = false;

  constructor(private store: Store<any>) {
    this.widgetList$ = store.select(getDashBoardWidgetList);
    this.data$ = this.store.select(getMLSWidgetData());
    this.helpData$ = this.store.select(getHelpWidgetData());
  }

  ngOnInit() {

  }

  onChange(item, event) {
    if (event.checked) {
      this.store.dispatch(new DashBoardWidgetListActiveItem({ id: item.id }));
    } else {
      this.store.dispatch(new DashBoardWidgetListDeactivateItem({ id: item.id }));
    }

  }


}
