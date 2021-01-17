
import { switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { MsgraphClientBase, AppConfig, ApiClientWrapper } from '../../core';
import { AuthInfoStateService } from '../../auth';
import { HttpClient } from '@angular/common/http';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { Observable, from } from 'rxjs';
import { Reminder } from '../../core/lib/microsoft-graph';
import { MgGraphBatchResponse, MgGraphBatchResponseItem } from '../../core/lib/graph-client-interfaces';
import * as _ from 'lodash';
import { SemaphoresService } from '../../shared';

@Injectable()
export class ReminderClientService {
    private msGraphClient: MsgraphClientBase = null;

    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
        private configs: ServiceEndpointConfig, private semaphoresService: SemaphoresService) {
    }
    private getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
    }
    private getAuthClient() {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }
    public batchRequest(requests) {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.batchRequest(requests, this.semaphoresService.getMsgraphSemaphoree());
    }

    getReminders(startDateTime: string, endDateTime: string, timeZone: string): Observable<Reminder[]> {
        const headers = {};
        headers['Prefer'] = `outlook.timezone="${timeZone}"`;
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/reminderView(startDateTime='${startDateTime}',endDateTime='${endDateTime}')`)
                .get(headers).pipe(map((result: any) => {
                    return result.value;
                }))
        ));
    }
    snoozeReminder(id: string, dateTime: string, timeZone: string) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/events/${id}/snoozeReminder`)
                .post({ newReminderTime: { dateTime: dateTime, timeZone: timeZone } }).pipe(map((result: any) => {
                    return true;
                }))
        ));
    }

    dismissReminder(id: string) {
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/events/${id}/dismissReminder`)
                .post(null).pipe(map((result: any) => {
                    return true;
                }))
        ));
    }
    public getAutomaticReplies() {
        return this.getAuthClient().pipe(switchMap(client => client.api('/me/mailboxSettings/automaticRepliesSetting')
            .get().pipe(
                map((result: any) => result))
        ));
    }
    public offAutomaticReplies() {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/mailboxSettings`)
                .patch({ automaticRepliesSetting: { status: 'disabled' } }).pipe(
                    map(result => result))
        ));
    }

}
