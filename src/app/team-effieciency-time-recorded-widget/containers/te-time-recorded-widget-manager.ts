import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitTETimeRecordedWidget, RefreshTRChartWidgetData } from '../actions/core';
import { getTFTimeRecordedWidgetIsloading, getTFTimeRecordedWidgetData, getTFBarChartWidgetTitle } from '../reducers';
import { getHomeCurrency } from '../../setting-core';
import { NavigateToView } from '../../layout-desktop';
import { interval } from 'rxjs';

@Component({
    selector: 'dps-te-time-recorded-widget-manager',
    template: `<dps-te-time-recorded-widget-layout
    [isLoading] = "isLoading$ | async"
    [data] = "data$ | async"
    [title] = "title$ | async"
    [homeCurrency] = "homeCurrency$ | async"
    (openTeamEf) = "goToTeamEfficincy()"
    (removeWidget)="onRemoveWidget()"
    (refreshData)="onRefreshTRChartWidgetData()"
    >
  </dps-te-time-recorded-widget-layout>`,
})
export class TETimeRecordedWidgetManagerComponent implements OnInit {

    isLoading$: any;
    data$: any;
    title$: any;
    homeCurrency$: any;
    @Output() removeWidget = new EventEmitter();

    constructor(protected store: Store<any>, private route: ActivatedRoute) { }

    ngOnInit() {
        this.store.dispatch(new InitTETimeRecordedWidget());
        this.isLoading$ = this.store.select(getTFTimeRecordedWidgetIsloading());
        this.data$ = this.store.select(getTFTimeRecordedWidgetData());
        this.title$ = this.store.select(getTFBarChartWidgetTitle());
        this.homeCurrency$ = this.store.select(getHomeCurrency());
    }

    goToTeamEfficincy() {
        this.store.dispatch(new NavigateToView('team_efficiency', this.route.parent));
    }

    onRemoveWidget() {
        this.removeWidget.emit();
    }

    onRefreshTRChartWidgetData() {
        this.store.dispatch(new RefreshTRChartWidgetData());
    }

}
