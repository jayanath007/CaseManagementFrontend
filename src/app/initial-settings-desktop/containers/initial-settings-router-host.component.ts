import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '../../core/lib/component-base';
import { Component, OnInit, EventEmitter } from '@angular/core';
@Component({
    selector: 'dps-initial-settings-router-host',
    template: `<dps-initial-settings-manager [inputData]="inputData" [token]="token">
    </dps-initial-settings-manager>`,
    styles: []
})
export class InitialSettingsRouterHostComponent extends ComponentBase implements OnInit {
    inputData;
    token: string;
    close = new EventEmitter();

    constructor() {
        super();
    }
    ngOnInit() {
        this.token = 'mainInitialSettings';
    }
}
