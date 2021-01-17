
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { getUser, User } from '../../auth';
import { Observable } from 'rxjs';
import { RequstReplayToMailForDiaryMsg } from '../../document-view';

@Component({
    selector: 'dps-msg-content-manager',
    template: '<ng-content></ng-content>'
})

export class MsgPopupManagerComponent implements OnInit {
    @Input() input;
    @Input() msgToken: string;

    @Output() closePopup = new EventEmitter();

    user$: Observable<User>;

    constructor(protected store: Store<any>) {
        // super(store);
    }
    ngOnInit() {
        // super.initSelectors(this.chaserToken, this.inputData);
        this.user$ = this.store.select(getUser);
    }
    onchaserPopupClosed(value) {
        this.closePopup.emit();
    }
    onFileHistoryMsgReply(event) {
        this.store.dispatch(new RequstReplayToMailForDiaryMsg(event));
    }

}
