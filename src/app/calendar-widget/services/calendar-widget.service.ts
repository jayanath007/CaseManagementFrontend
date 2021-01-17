
import { map, switchMap } from 'rxjs/operators';
import { MsgraphClientBase, ApiClientWrapper } from '../../core';
import { AuthInfoStateService } from '../../auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import * as MicrosoftGraph from '../../core/lib/microsoft-graph';
import { SemaphoresService } from '../../shared';

@Injectable()
export class CalendarWidgetService {

    private msGraphClient: MsgraphClientBase = null;
    public testData: any;

    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
        private configs: ServiceEndpointConfig, private semaphoresService: SemaphoresService) {
    }

    public getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
    }

    public loadCalendarEvent(start: string, end: string, timeZone: string): Observable<MicrosoftGraph.Event[]> {
        const headers = {};
        headers['Prefer'] = `outlook.timezone="${timeZone}"`;
        return this.getBetaApiClient().pipe(switchMap(client =>
            client.api(`/me/calendar/calendarView?startDateTime=${start}&endDateTime=${end}`)
                .top(500)
                .get(headers).pipe(map((result: any) => {
                    return result.value;
                }))
        ));
    }


}
