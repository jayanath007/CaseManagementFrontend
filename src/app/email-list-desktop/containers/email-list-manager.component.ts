
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { InputData, BaseEmailListManager } from '../../email-list-core';
import { ColumnDef } from '../../core/lib/grid-model';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';

@Component({
    selector: 'dps-email-list-manager',
    template: '<ng-content></ng-content>'
})

export class EmailListManagerComponent extends BaseEmailListManager implements OnInit {
    @Input() input: InputData;
    @Input() token: boolean;

    gridColoumns: ColumnDef[] = [
        createDefultColumnDef('ContactType',
            { label: 'Contact Type', fxFlex: '125px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Name',
            { label: 'Name', fxFlex: '', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Email',
            { label: 'Email', fxFlex: '200px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('To',
            { label: 'To', fxFlex: '45px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        // createDefultColumnDef('Cc',
        //     { label: 'Cc', fxFlex: '45px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    ];
    constructor(protected store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        this.getEmailList(
            this.input.matterData ? this.input.matterData.BranchID : 0,
            this.input.matterData ? this.input.matterData.AppID : 0,
            this.input.matterData ? this.input.matterData.FileID : 0,
            this.input.matterData ? this.input.matterData.reviewNote : '',
            this.input.matterData ? this.input.matterData.message : '');
    }

}
