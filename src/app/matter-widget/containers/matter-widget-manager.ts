import { getMatterWidgetIsloading, getMattersWidgetData } from '../reducers';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitMatterWidget, RefreshData, GoToOpenCase } from '../actions/core';
import { NavigateToView } from '../../layout-desktop';
import { ActivatedRoute } from '@angular/router';
import { getGeneralMenueItems } from './../../layout-desktop/reducers/index';
import { MatterSearchGridData } from '../../matter-search-core';

@Component({
    selector: 'dps-matter-widget-manager',
    template: `<dps-matter-widget-layout
    [isLoading] = "isLoading$ | async"
    [data] = "data$ | async"
    [layout]="layout"
    [menuItem]="menuItem$|async"
    (openCase) = "onOpenCase($event)"
    (myMatterView) ="goToMyMatterView()"
    (removeWidget)="onRemoveWidget()"
    (refreshData)="onRefreshData()"
    >
  </dps-matter-widget-layout>`,
})
export class MatterWidgetManagerComponent implements OnInit {

    isLoading$: any;
    data$: any;
    menuItem$: any;
    @Input() layout: number;
    @Output() removeWidget = new EventEmitter();

    constructor(protected store: Store<any>, private route: ActivatedRoute) { }

    ngOnInit() {
        this.store.dispatch(new InitMatterWidget());
        this.isLoading$ = this.store.select(getMatterWidgetIsloading());
        this.data$ = this.store.select(getMattersWidgetData());
        this.menuItem$ = this.store.select(getGeneralMenueItems);
    }

    onOpenCase(item: MatterSearchGridData) {
        this.store.dispatch(new GoToOpenCase({ data: item }));
    }

    goToMyMatterView() {
        this.store.dispatch(new NavigateToView('matter_search', this.route.parent));
    }

    onRemoveWidget() {
        this.removeWidget.emit();
    }
    onRefreshData() {
        this.store.dispatch(new RefreshData());
    }

}
