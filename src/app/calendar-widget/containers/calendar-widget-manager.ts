import { ActivatedRoute } from '@angular/router';
import { NavigateToView } from '../../layout-desktop/actions/main-menu';
import { getMailWidgetIsloading, getMailWidgetData } from '../reducers';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitCalendarWidget } from '../actions/core';
import { Message } from '../../core/lib/microsoft-graph';


@Component({
    selector: 'dps-calendar-widget-manager',
    template: `<dps-calendar-widget-layout
    [isLoading] = "isLoading$ | async"
    [data] = "data$ | async"
    [layout]="layout"
    [theme]="theme"
    (openMail) = "onOpenMail($event)"
    (removeWidget)="onRemoveWidget()"
    (toCalendar)="openCalendar()"
    >
  </dps-calendar-widget-layout>`,
})
export class CalendarWidgetManagerComponent implements OnInit {

    isLoading$: any;
    data$: any;
    @Input() layout: number;
    @Input() theme;

    @Output() removeWidget = new EventEmitter();

    constructor(protected store: Store<any>, private route: ActivatedRoute) { }

    ngOnInit() {
        this.store.dispatch(new InitCalendarWidget());
        this.isLoading$ = this.store.select(getMailWidgetIsloading());
        this.data$ = this.store.select(getMailWidgetData());
    }

    onOpenMail(item: Message) {
    }

    onRemoveWidget() {
        this.removeWidget.emit();
    }

    openCalendar() {
        this.store.dispatch(new NavigateToView('calendar', this.route.parent));
    }

}
