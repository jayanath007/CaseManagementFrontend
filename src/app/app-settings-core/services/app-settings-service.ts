
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthInfoStateService } from '../../auth/services/auth-info-state.service';
import { Injectable } from '@angular/core';
import { MsgraphClientBase } from '../../core/lib/msgraph-client-base';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import * as _ from 'lodash';
import { SemaphoresService } from '../../shared';


@Injectable()
export class AppSettingsService extends MsgraphClientBase {

    constructor(authInfo: AuthInfoStateService, httpClient: HttpClient,
        configs: ServiceEndpointConfig, private semaphoresService: SemaphoresService) {
        super(authInfo, httpClient, configs.getGraphApiConfig());
    }

    public getIsChaserEnable() {
        return this.getAuthClient(this.semaphoresService.getMsgraphSemaphoree())
            .pipe(switchMap(client => client.api('/me/mailFolders').get()));
    }

    public updateMailFolder(id: string, displayName: string) {
        return this.getAuthClient(this.semaphoresService.getMsgraphSemaphoree()).pipe(switchMap(client =>
            client.api(`/me/mailFolders/${id}`)
                .patch({ displayName: displayName }).pipe(map((result: any) => _.omitBy(result, (__, key) => key.startsWith('@'))))
        ));
    }

    public createItem(message?: any): Observable<any> {
        return this.getAuthClient(this.semaphoresService.getMsgraphSemaphoree()).pipe(switchMap(client =>
            client.api(`/me/messages`)
                .post(message ? message : {}).pipe(map(result => {
                    return result;
                }))
        ));
    }
}
