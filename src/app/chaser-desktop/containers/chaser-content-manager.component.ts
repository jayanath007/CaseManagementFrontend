import { ChaserInput } from '../../chaser-core/models/interfaces';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, Output, SimpleChanges } from '@angular/core';
import * as ChaserCore from '../../chaser-core';
import { BaseChaserManager } from '../../chaser-core/containers';
import { MatterInfo } from '../../chaser-core/models/interfaces';

@Component({
    selector: 'dps-chaser-content-manager',
    template: '<ng-content></ng-content>'
})

export class ChaserContentManagerComponent extends BaseChaserManager implements OnInit {
    @Input() inputData: ChaserInput;
    @Input() chaserToken: string;

    constructor(protected store: Store<any>) {
        super(store);
    }
    ngOnInit() {
        super.initSelectors(this.chaserToken, this.inputData);
    }

}
