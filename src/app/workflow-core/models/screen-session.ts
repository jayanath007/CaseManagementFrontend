import { NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseWorkflowSession } from './base-workflow-session';
import { UIContext } from './ui-context';
import { SessionTypes } from './enums';

export class ScreenSession extends BaseWorkflowSession {

    constructor(zone: NgZone, httpClient: HttpClient, getAuthToken: () => Observable<string>, url: string,
        appId: number, fileId: number, branchId: number,
        private screenId: string, uiContext: UIContext) {
        super(zone, httpClient, getAuthToken, url, appId, fileId, branchId, uiContext);
    }

    start() {
        return super.start().then((result) => {
            console.log('init result', result);
            return this.workflowConnection
                .callServerMethod('StartScreenSession', [this.screenId]);
        });
    }

    getType(): SessionTypes {
        return SessionTypes.Screen;
    }

    getInput() {
        return { screenId: this.screenId };
    }
}
