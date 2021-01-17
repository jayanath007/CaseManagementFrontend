import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitMailWidget, NewCompose } from '../actions/core';
import { Message } from '../../core/lib/microsoft-graph';
import { OpenMailUrlPopup } from '../../mail-item-core/actions/item';
import { getMailWidgetIsloading, getMailWidgetData, getMailWidgetgInBoxInfo } from '../reducers';
import { NavigateToView } from '../../layout-desktop';
import { ActivatedRoute } from '@angular/router';
import { getUser, User } from '../../auth';
import { Observable } from 'rxjs';

@Component({
    selector: 'dps-mail-widget-manager',
    template: `<dps-mail-widget-layout
    [isLoading] = "isLoading$ | async"
    [data] = "data$ | async"
    [inboxInfo] = "inboxInfo$ | async"
    [layout]="layout"
    [companyCode] = "(user$|async)?.general?.companyCode"
    [timeZone]="(user$|async)?.userTimeZone?.info.alias"
    (openMail) = "onOpenMail($event)"
    (toMailView) = "goToMailView()"
    (removeWidget)="onRemoveWidget()"
    (newMailOut)="newMail()"
    >
  </dps-mail-widget-layout>`,
})
export class MailWidgetManagerComponent implements OnInit {
    isLoading$: any;
    data$: any;
    inboxInfo$: any;
    user$: Observable<User>;
    @Input() layout: number;
    @Output() removeWidget = new EventEmitter();

    constructor(protected store: Store<any>, private route: ActivatedRoute) { }

    ngOnInit() {
        this.store.dispatch(new InitMailWidget());
        this.isLoading$ = this.store.select(getMailWidgetIsloading());
        this.data$ = this.store.select(getMailWidgetData());
        this.inboxInfo$ = this.store.select(getMailWidgetgInBoxInfo());
        this.user$ = this.store.select(getUser);
    }

    onOpenMail(item: Message) {
        this.store.dispatch(new OpenMailUrlPopup({ owner: 'me', itemId: item.id, token: 'widgetMailItem' }));
    }

    goToMailView() {
        this.store.dispatch(new NavigateToView('mail', this.route.parent));
    }

    onRemoveWidget() {
        this.removeWidget.emit();
    }
    newMail() {
        this.store.dispatch(new NewCompose());
    }
}
