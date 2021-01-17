import { switchMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { Observable, of } from 'rxjs';
import { MsgraphClientBase, AppConfig, ApiClientWrapper } from '../../core';
import { AuthInfoStateService } from '../../auth';
import { SemaphoresService } from '../../shared';

@Injectable()
export class SettingCoreService {
    private msGraphClient: MsgraphClientBase = null;
    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
        private appConfig: AppConfig, private configs: ServiceEndpointConfig, private semaphoresService: SemaphoresService) {
    }

    private getOrCreateClient() {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient;
    }

    public getBetaApiClient<T>(): Observable<ApiClientWrapper<T>> {
        return this.getOrCreateClient().getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
    }

    public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        return this.getOrCreateClient().getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }

    public getHomeCurrency(): Observable<string> {
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/Home/GetHomeCurrencyCode').pipe(
            map(response => response.data));
    }

    public getSupportedTimeZones() {
        if (this.authInfo.isGoogle()) {
            // TODO  need to checked by Hiran
            return of([]);
        }
        return this.getAuthClient().pipe(
            switchMap(client => client.api('/me/outlook/SupportedTimeZones')
                .get().pipe(
                    map((result: any) => result.value))
            ));
    }
    public CheckDiaryModeCurrentUser(): Observable<boolean> {
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/Diary/CheckDiaryModeCurrentUser').pipe(
            map(response => response.data));
    }
    public GetTimeUseFeeEarnerGradesValueDisable(): Observable<boolean> {
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/Diary/GetTimeUseFeeEarnerGradesValueDisable').pipe(
            map(response => response.data));
    }

}

