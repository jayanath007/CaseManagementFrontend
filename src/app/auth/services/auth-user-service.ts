import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthInfoStateService } from './auth-info-state.service';
import { Injectable } from '@angular/core';
import { MsgraphClientBase } from '../../core/lib/msgraph-client-base';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { AppConfig, ApiClientWrapper } from '../../core';
import { GeneralData } from '../models/auth';
import { SemaphoresService } from '../../shared';


@Injectable()
export class AuthUserService {

    private msGraphClient: MsgraphClientBase = null;
    constructor(private authInfo: AuthInfoStateService, private httpClient: HttpClient,
        private configs: ServiceEndpointConfig, private appConfig: AppConfig, private semaphoresService: SemaphoresService) {
    }

    public getAuthClient<T>(): Observable<ApiClientWrapper<T>> {
        if (!this.msGraphClient) {
            this.msGraphClient = new MsgraphClientBase(this.authInfo, this.httpClient, this.configs.getGraphApiConfig());
        }
        return this.msGraphClient.getAuthClient(this.semaphoresService.getMsgraphSemaphoree());
    }

    public getExtensions() {
        return this.getAuthClient().pipe(switchMap(client => client.api('/me?$select=id&$expand=extensions').get()));
    }

    public checkSignature() {
        console.log('getSignature-service');
        return this.getAuthClient().pipe(switchMap(client => client.api('/me/drive/special/Documents:/DPS/DPS_SIGNATURE.html').get()));
    }

    public getSignature(signatureUrl: any) {
        console.log('getSignature-service');
        return this.httpClient.get(signatureUrl, { responseType: 'text' });
    }

    public getUserTimeZone() {
        if (this.authInfo.isGoogle()) {
            // TODO | check by Hiran get user local timezone from the moment
            return of('UTC');
        } else {
            return this.getAuthClient().pipe(switchMap(client => client.api('/me/mailboxSettings/timeZone')
                .get().pipe(
                    map((result: any) => result ? result.value : result))
            ));
        }
    }

    public getSupportedTimeZones() {
        if (this.authInfo.isGoogle()) {
            // TODO | check by Hiran get user local timezone from the moment
            return of([]);
        } else {
            return this.getAuthClient().pipe(
                switchMap(client => client.api('/me/outlook/SupportedTimeZones')
                    .get().pipe(
                        map((result: any) => result.value))
                ));
        }
    }

    public updateUserImage(image: any) {
        console.log('update User Image');
        return this.getAuthClient()
            .pipe(switchMap(client => client.api('/me/photo/$value').put(image, { 'Content-type': 'image/jpeg' }).pipe(
                map((result: any) => result.value))
            ));
    }

    public getOwaViewStateOptions() {
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/MailBox/GetOwaViewStateOptions').pipe(
            map(response => response));
    }
    public getUserGeneralData(): Observable<GeneralData> {
        return this.httpClient.get<{ data: GeneralData }>(this.appConfig.serviceBase + '/General/GetInitialData')
            .pipe(
                map(response => {
                    // const hiddenModule: Module[] = response.data ? this.settupItem(response.data.hiddenModule) : [];
                    return (response.data);
                })
            );
    }
    public getJwtTokenForPDFViewer() {
        return this.httpClient.get<any>(this.appConfig.serviceBase + '/File/GetJwtTokenForPDFViewer').pipe(
            map(response => response.data));
    }
    public setOwaViewStateOptions(data: { dictionaryKey: string, dictionaryValue: any[] }) {
        return this.httpClient.post<any>(this.appConfig.serviceBase + '/MailBox/SetOwaViewStateOptions', data).pipe(
            map(response => response));
    }

    // public getUserPermission() {
    //     return this.httpClient.get<UserPermissionResponse>(this.appConfig.serviceBase + '/Dashboard/GetUserPermissions').pipe(
    //         map(response => response.data));
    // }

    public getGlobalSignatureTemplete() {
        return this.httpClient.get<{ data: string }>(this.appConfig.serviceBase + '/General/GetGlobalSignatureTemplate').pipe(
            map(response => response.data));
    }

}

