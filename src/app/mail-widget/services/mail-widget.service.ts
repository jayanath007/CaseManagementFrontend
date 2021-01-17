
import { switchMap, map } from 'rxjs/operators';
import { MsgraphClientBase, ApiClientWrapper } from '../../core';
import { AuthInfoStateService } from '../../auth';
import { MailItemResponse } from '../models/interfce';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { SemaphoresService } from '../../shared';

@Injectable()
export class MailWidgetService {

    public testData: any;
    private msGraphClient: MsgraphClientBase = null;

    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
        private configs: ServiceEndpointConfig, private semaphoresService: SemaphoresService) {
    }
    public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }
    public getListMessageItems(): Observable<MailItemResponse> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/mailFolders/inbox/messages`)
                .top(13)
                .expand([
                    `singleValueExtendedProperties($filter=id eq 'Integer 0x1080')`
                ])
                .get().pipe(map(result =>
                    result['value']
                ))
        ));
    }

    public getInboxDetails() {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/mailFolders/inbox`)
                .get()
            // .map(result =>
            //     result['value']
            // )
        ));
    }

    createItem(message) {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/messages`).post(message ? message : {}).pipe(map((result: any) => result))));
    }

}
