import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitTeamWidget } from '../actions/core';
import { getTeamWidgetIsloading, getTeamWidgetData } from '../reducers';
import { NavigateToView } from '../../layout-desktop';

@Component({
  selector: 'dps-team-widget-manager',
  template: `<dps-team-widget-layout
              [isLoading]="isLoading$|async"
              [eventYearSummery]="data$|async"
              (remove)="onWidgetRemove()"
              (openModule)="goToTeamEfficincy()"
              >
            </dps-team-widget-layout>`,
})
export class TeamWidgetManagerComponent implements OnInit {

  constructor(protected store: Store<any>, private route: ActivatedRoute) { }
  isLoading$: any;
  data$: any;
  @Output() removeWidget = new EventEmitter();

  ngOnInit() {
    this.store.dispatch(new InitTeamWidget());
    this.isLoading$ = this.store.select(getTeamWidgetIsloading());
    this.data$ = this.store.select(getTeamWidgetData());
  }
  onWidgetRemove() {
    this.removeWidget.emit();
  }
  goToTeamEfficincy() {
    this.store.dispatch(new NavigateToView('team_efficiency', this.route.parent));
}

}
