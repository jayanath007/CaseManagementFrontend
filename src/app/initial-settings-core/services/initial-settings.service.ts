
import {map, switchMap} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthInfoStateService } from '../../auth/services/auth-info-state.service';
import { Injectable } from '@angular/core';
import { MsgraphClientBase } from '../../core/lib/msgraph-client-base';
import { InitialSettingsState } from '../reducers/initial-settings';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { AuthUserService } from '../../auth/services/auth-user-service';
import { ApiClientWrapper } from '../../core';
import { SemaphoresService } from '../../shared';




@Injectable()
export class InitialSettingsService {

    private msGraphClient: MsgraphClientBase = null;

    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
        private configs: ServiceEndpointConfig, private authUserService: AuthUserService, private semaphoresService: SemaphoresService) {
    }

    public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getBetaApiClient(this.semaphoresService.getMsgraphBetaSemaphore());
    }


    public getSupportedTimeZones() {
        console.log('getSupportedTimeZones-service');
        return this.authUserService.getSupportedTimeZones();
        // return this.getAuthClient()
        //     .switchMap(client => client.api('/me/outlook/SupportedTimeZones')
        //         .get()
        //         .map((result: any) => result.value)
        //     );
    }

    public getSupportedLanguages() {
        console.log('getSupportedLanguages-service');
        return this.getAuthClient().pipe(
            switchMap(client => client.api('/me/outlook/SupportedLanguages')
                .get().pipe(
                map((result: any) => result.value))
            ));
    }

    public getUserTimeZone() {
        console.log('getIsChaserEnable-service');
        return this.authUserService.getUserTimeZone();
        // return this.getAuthClient().switchMap(client => client.api('/me/mailboxSettings/timeZone')
        //     .get()
        //     .do(res => console.log('+-+-+-+-+-+88-+-+-+-+', res))
        //     .map((result: any) => result ? result.value : null)
        // );
    }

    public getUserLanguage() {
        console.log('getUserLanguages-service');
        return this.getAuthClient().pipe(switchMap(client => client.api('/me/mailboxSettings/language')
            .get().pipe(
            map((result: any) => result))
        ));
    }

    public updateInitialSettings(currentState: InitialSettingsState) {

        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/mailboxSettings`)
                .patch({
                    // language: {  locale: currentState.userLanguage.locale },
                    timeZone: currentState.userTimeZone
                }).pipe(
                map(result => result))
        ));
    }


}

