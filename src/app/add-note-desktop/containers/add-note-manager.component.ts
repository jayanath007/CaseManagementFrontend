import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import { BaseAddNoteManager } from '../../add-note-core/containers';
import { AddNoteInPutData } from '../../core/lib/addNote';

@Component({
    selector: 'dps-add-note-manager',
    template: '<ng-content></ng-content>',
})

export class AddNoteManagerComponent extends BaseAddNoteManager implements OnInit {
    @Input() inputData: AddNoteInPutData;
    @Input() token;

    constructor(store: Store<any>) {
        super(store);
    }

    ngOnInit() {
        super.initSelectors(this.token, this.inputData);
    }
}

