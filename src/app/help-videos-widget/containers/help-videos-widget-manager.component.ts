import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { getHelpWidgetIsloading, getHelpWidgetData } from '../reducers';
import { NavigateToView } from '../../layout-desktop';
import { InitHelpVideoWidget } from '../actions/core';

@Component({
  selector: 'dps-help-videos-widget-manager',
  template: `<dps-help-videos-widget-layout
              [isLoading]="isLoading$|async"
              [urlList]="data$|async"
              (remove)="onWidgetRemove()"
              (openModule)="goToTeamEfficincy()"
              >
            </dps-help-videos-widget-layout>`,
})
export class HelpVideosWidgetManagerComponent implements OnInit {

  constructor(protected store: Store<any>, private route: ActivatedRoute) { }
  isLoading$: any;
  data$: any;
  @Output() removeWidget = new EventEmitter();

  ngOnInit() {
    this.store.dispatch(new InitHelpVideoWidget());
    this.isLoading$ = this.store.select(getHelpWidgetIsloading());
    this.data$ = this.store.select(getHelpWidgetData());
  }
  onWidgetRemove() {
    this.removeWidget.emit();
  }
  goToTeamEfficincy() {
    this.store.dispatch(new NavigateToView('team_efficiency', this.route.parent));
  }

}
