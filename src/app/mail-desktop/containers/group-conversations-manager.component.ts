import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseConversationsManager } from '../../mail-core/containers';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewManagerService } from '../services/view-manager.service';
import { AuthInfoStateService } from '../../auth';
import { RouterOutlets } from '../models/enums';
import { PopFromVisibilityStack } from '../actions/folder-menu';
import { getVisibleOutlet } from '../reducers';
import { map } from 'rxjs/operators';

@Component({
    selector: 'dps-group-conversations-manager',
    template: `
        <dps-group-content-short-layout
        [selectedGroup]="selectedGroup$|async"
        [selectedconversation]="selectedconversation$|async"
        [conversations]="conversations$|async"
        [isConversationsLoading]="isConversationsLoading$|async"
        [hidden]="!(showGroup$|async)"
        [timeZone]="(user$|async)?.userTimeZone?.info.alias"
        [companyCode]="(user$|async)?.general?.companyCode"
        (conversationSelect)="onConversationSelect($event)"
        (conversationDelete)="onConversationDelete($event)"
        (loadMoreConversations)=" onLoadMoreConversations($event)"
        ></dps-group-content-short-layout>
    `,
})
export class GroupConversationsManagerComponent extends BaseConversationsManager implements OnInit, OnDestroy {
    visibleOutlet$;
    showGroup$;

    constructor(store: Store<any>, private route: ActivatedRoute, private router: Router,
        private viewManager: ViewManagerService, public service: AuthInfoStateService) {
        super(store, service);
    }
    ngOnInit() {
        this.visibleOutlet$ = this.store.select(getVisibleOutlet);
        this.showGroup$ = this.visibleOutlet$.pipe(map(outlet => outlet === RouterOutlets.Groups));
        this.user$ = this.getUser();
    }
    ngOnDestroy(): void {
        this.store.dispatch(new PopFromVisibilityStack(this.route.snapshot.outlet as RouterOutlets));
    }
    onConversationSelect(event) {
        super.onConversationSelect(event);
        const myRoute = [{ outlets: { [RouterOutlets.MessageItemCommon]: 'posts-viwer' } }];
        if (this.route) {
            const route = [{ outlets: { [RouterOutlets.MessageItemCommon]: null } }];
            this.router.navigate(route, { relativeTo: this.route.parent }).then(() => {
                const t = this.router.createUrlTree(myRoute, { relativeTo: this.route }).toString();
                this.router.navigate(myRoute, { relativeTo: this.route });
            });
            this.store.dispatch(new PopFromVisibilityStack(RouterOutlets.MessageItemCommon));
        }
    }
}

