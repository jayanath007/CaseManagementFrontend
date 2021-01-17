import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitTEPieChartWidget, RefreshTEPieChartData } from '../actions/core';
import { getHomeCurrency } from '../../setting-core';
import { getTFPieChartWidgetData, getTFPieChartWidgetTitle } from '../reducers';
import { NavigateToView } from '../../layout-desktop';
import { interval } from 'rxjs';

@Component({
    selector: 'dps-te-pie-chart-widget-manager',
    template: `<dps-te-pie-chart-widget-layout
    (openTeamEf)="goToTeamEfficincy()"
    (removeWidget)="onRemoveWidget()"
    (refreshData)="onRefreshTEPieChartData()"
    [data] = "data$ | async"
    [title] = "title$ | async"
    >
  </dps-te-pie-chart-widget-layout>`,
})
export class TEPieChartWidgetManagerComponent implements OnInit {

    data$: any;
    title$: any;
    homeCurrency$: any;
    @Output() removeWidget = new EventEmitter();

    constructor(protected store: Store<any>, private route: ActivatedRoute) { }

    ngOnInit() {
        this.store.dispatch(new InitTEPieChartWidget());
        this.data$ = this.store.select(getTFPieChartWidgetData());
        this.title$ = this.store.select(getTFPieChartWidgetTitle());
    }


    goToTeamEfficincy() {
        this.store.dispatch(new NavigateToView('team_efficiency', this.route.parent));
    }

    onRemoveWidget() {
        this.removeWidget.emit();
    }

    onRefreshTEPieChartData() {
        this.store.dispatch(new RefreshTEPieChartData());
    }

}
