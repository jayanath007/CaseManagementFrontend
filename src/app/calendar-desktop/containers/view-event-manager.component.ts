import { Store } from '@ngrx/store';
import { OnInit, Component, Input } from '@angular/core';
import { ViewEventBaseManager } from '../../calendar-core/containers/view-event-base-manager';
import { AuthInfoStateService, User } from '../../auth';
import { MainMenuService } from '../../layout-desktop';
import { BodyHandlerService } from '../../organizer-desktop-shared';
import { Observable } from 'rxjs';

@Component({
    selector: 'dps-view-event-manager',
    template: '<ng-content></ng-content>',
    styles: []
})
export class ViewEventManagerComponent extends ViewEventBaseManager implements OnInit {

    @Input() calendarId: string;
    @Input() eventId: string;
    user$: Observable<User>;

    constructor(store: Store<any>, protected service: AuthInfoStateService,
        protected bodyHandlerService: BodyHandlerService, private layoutMenu: MainMenuService) {
        super(store, bodyHandlerService);
    }

    ngOnInit() {
        this.getCalendarEventById(this.calendarId, this.eventId);
        this.user$ = this.service.getUser();
    }
    onOpenMatter(subject: string) {
        if (window.opener && window.opener !== window) {
            localStorage.setItem('viewDpsFile', subject);
            localStorage.removeItem('viewDpsFile');
        } else {
            this.layoutMenu.goToOpenCaseByMailSubjectOrDiaryId({ subject, diaryId: null });
        }
    }
}
