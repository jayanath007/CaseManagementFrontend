import { Store } from '@ngrx/store';
import { Component, Input, OnInit } from '@angular/core';
import { BaseFileSecurityRightsManager } from '../../file-security-rights-core';
import { ColumnDef } from '../../core/lib/grid-model';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';


@Component({
    selector: 'dps-file-security-rights-manager',
    template: '<ng-content></ng-content>',
})

export class FileSecurityRightsManagerComponent extends BaseFileSecurityRightsManager implements OnInit {
    @Input() inputData;
    @Input() token;
    gridColoumns: ColumnDef[] = [
        createDefultColumnDef('UserRef',
            { label: 'User Ref', fxFlex: '125px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('UserName',
            { label: 'User Name', fxFlex: '', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('HasRights',
            { label: 'Has Rights', fxFlex: '95px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    ];
    constructor(protected store: Store<any>) {
        super(store);
    }

    ngOnInit() {
        super.initSelectors(this.inputData);
    }

}
