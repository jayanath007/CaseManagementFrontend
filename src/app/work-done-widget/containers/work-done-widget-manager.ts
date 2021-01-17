import { getWorkDoneWidgetIsloading, getWorkDonesWidgetData } from '../reducers';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitWorkDoneWidget, RefreshWorkDoneWidget, GoToOpenCase } from '../actions/core';
import { BtnOption } from '../models/enumeration';
import { NavigateToView } from '../../layout-desktop';
import { GridData } from '../models/interfce';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User, getUser } from '../../auth';
import { filter, take } from 'rxjs/operators';

@Component({
    selector: 'dps-work-done-widget-manager',
    template: `<dps-work-done-widget-layout
    [isLoading] = "isLoading$ | async"
    [data] = "data$ | async"
    [layout]="layout"
    (clickOptionBtn)="onOptionBtnClick($event)"
    (openWorkDoneView)="openWorkDoneView()"
    (removeWidget)="onRemoveWidget()"
    (refreshData)="onRefreshWorkDoneWidget()"
    >
  </dps-work-done-widget-layout>`,
})
export class WorkDoneWidgetManagerComponent implements OnInit {

    @Input() layout: number;
    @Output() removeWidget = new EventEmitter();

    isLoading$: any;
    data$: any;
    user$: Observable<User>;

    constructor(protected store: Store<any>, private route: ActivatedRoute) { }

    ngOnInit() {
        this.user$ = this.store.select(getUser);
        const _user$ = this.user$.pipe(filter(user => !!user.general), take(1)).subscribe(user => {
            this.store.dispatch(new InitWorkDoneWidget(user.general.dateTimeOffset));
        });

        this.isLoading$ = this.store.select(getWorkDoneWidgetIsloading());
        this.data$ = this.store.select(getWorkDonesWidgetData());
    }

    onOptionBtnClick(value: { option: BtnOption, item: GridData }) {
        switch (value.option) {
            case BtnOption.OpenCase: {
                this.store.dispatch(new GoToOpenCase(value.item));
                break;
            }
        }
    }

    openWorkDoneView() {
        this.store.dispatch(new NavigateToView('work_done', this.route.parent));
    }

    onRemoveWidget() {
        this.removeWidget.emit();
    }

    onRefreshWorkDoneWidget() {
        this.store.dispatch(new RefreshWorkDoneWidget());
    }

}
