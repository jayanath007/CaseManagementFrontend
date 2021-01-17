import { Store } from '@ngrx/store';
import { OnInit, Component, Input } from '@angular/core';
import { BaseTeamEfficiencyManager } from '../../team-efficiency-core/container/base-team-efficiency-manager';


@Component({
    selector: 'dps-team-efficiency-manager',
    template: '<ng-content></ng-content>',
    styleUrls: []
})
export class TeamEfficiencyManagerComponent extends BaseTeamEfficiencyManager  implements OnInit {

    @Input() inputData;
    @Input() teamEfficiencyToken;
    constructor(store: Store<any>) {
         super(store);
    }

    ngOnInit() {
         super.initSelectors(this.teamEfficiencyToken);
    }
}
