import { ActivatedRoute } from '@angular/router';
import { getTimeRecordedWidgetIsloading, getTimeRecordedsWidgetData } from '../reducers';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitTimeRecordedWidget, RefreshTimeRecordedWidget, GoToOpenCase } from '../actions/core';
import { BtnOption } from '../models/enumeration';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MainMenuService, NavigateToView } from '../../layout-desktop';
import { GridData } from '../models/interfce';
import { interval, Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { take, filter } from 'rxjs/operators';

@Component({
    selector: 'dps-time-recorded-widget-manager',
    template: `<dps-time-recorded-widget-layout
    [isLoading] = "isLoading$ | async"
    [data] = "data$ | async"
    (clickOptionBtn)="onOptionBtnClick($event)"
    (viewTimeRecorded)="goToTimeRecorded()"
    (removeWidget)="onRemoveWidget()"
    (refreshData)="onRefreshTimeRecordedWidget()"
    >
  </dps-time-recorded-widget-layout>`,
})
export class TimeRecordedWidgetManagerComponent implements OnInit {

    @Output() removeWidget = new EventEmitter();

    isLoading$: any;
    data$: any;
    user$: Observable<User>;

    constructor(protected store: Store<any>, private pageService: MainMenuService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.user$ = this.store.select(getUser);
        const _user$ = this.user$.pipe(filter(user => !!user.general), take(1)).subscribe(user => {
            this.store.dispatch(new InitTimeRecordedWidget(user.general.dateTimeOffset));
        });

        this.isLoading$ = this.store.select(getTimeRecordedWidgetIsloading());
        this.data$ = this.store.select(getTimeRecordedsWidgetData());
    }

    onOptionBtnClick(value: { option: BtnOption, item: GridData }) {
        switch (value.option) {
            case BtnOption.OpenCase: {
                this.store.dispatch(new GoToOpenCase(value.item));
                break;
            }
        }
    }

    goToTimeRecorded() {
        this.store.dispatch(new NavigateToView('time_recorded', this.route.parent));
    }

    onRemoveWidget() {
        this.removeWidget.emit();
    }

    onRefreshTimeRecordedWidget() {
        this.store.dispatch(new RefreshTimeRecordedWidget());
    }

}
