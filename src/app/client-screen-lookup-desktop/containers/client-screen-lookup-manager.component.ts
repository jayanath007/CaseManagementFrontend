import { BaseClientScreenLookupManager } from '../../client-screen-lookup-core/containers/base-client-screen-lookup-manager';
import { ChaserInput } from '../../chaser-core/models/interfaces';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import * as ChaserCore from '../../chaser-core';
import { BaseChaserManager } from '../../chaser-core/containers';
import { MatterInfo } from '../../chaser-core/models/interfaces';
import { LookupInputData } from '../../client-screen-lookup-core/models/interfaces';


@Component({
    selector: 'dps-client-screen-lookup-manager',
    template: '<ng-content></ng-content>'
})

export class ClientScreenLookupManagerComponent extends BaseClientScreenLookupManager implements OnInit {
     @Input() inputData: LookupInputData;
     @Input() token: string;

    constructor(protected store: Store<any>) {
        super(store);
    }
    ngOnInit() {
     super.initSelectors(this.token, this.inputData);
    }

}
