import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '../../core/lib/component-base';
import { Component, OnInit, EventEmitter } from '@angular/core';
@Component({
    selector: 'dps-app-settings-router-host',
    template: `<dps-app-settings-manager [inputData]="inputData" [token]="token">
    </dps-app-settings-manager>`,
    styles: []
})
export class AppSettingsRouterHostComponent extends ComponentBase implements OnInit {
    inputData;
    token: string;
    close = new EventEmitter();

    constructor() {
        super();
    }
    ngOnInit() {
        this.token = 'mainAppSettingsPage';
    }
}
