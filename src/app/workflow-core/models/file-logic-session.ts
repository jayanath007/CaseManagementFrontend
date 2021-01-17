import { NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseWorkflowSession } from './base-workflow-session';
import { UIContext } from './ui-context';
import { SessionTypes, FileLogicTypes } from './enums';

export class FileLogicSession extends BaseWorkflowSession {
    constructor(zone: NgZone, httpClient: HttpClient, getAuthToken: () => Observable<string>, url: string,
        appId: number, fileId: number, branchId: number,
        private logicType: FileLogicTypes, uiContext: UIContext) {
        super(zone, httpClient, getAuthToken, url, appId, fileId, branchId, uiContext);
    }

    start() {
        return super.start().then((result) => {
            return this.workflowConnection
                .callServerMethod('StartFileLogic', [this.logicType]);
        });
    }

    getType(): SessionTypes {
        return SessionTypes.FileLogic;
    }

    getInput() {
        return { logicType: this.logicType };
    }

}
