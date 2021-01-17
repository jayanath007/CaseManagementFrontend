
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthInfoStateService } from '../../auth/services/auth-info-state.service';
import { Injectable } from '@angular/core';
import { MsgraphClientBase } from '../../core/lib/msgraph-client-base';
import { OrganizerSettingsState } from '../reducers/organizer-settings';
import { ServiceEndpointConfig } from '../../core/configs/service-configs';
import { DomSanitizer } from '@angular/platform-browser';
import { AppConfig } from '../../core';
import { SemaphoresService } from '../../shared';

@Injectable()
export class OrganizerSettingsService extends MsgraphClientBase {

    constructor(authInfo: AuthInfoStateService, httpClient: HttpClient,
        private sanitizer: DomSanitizer, configs: ServiceEndpointConfig, private appConfig: AppConfig, private semaphoresService: SemaphoresService) {
        super(authInfo, httpClient, configs.getGraphApiConfig());
    }

    public getAuthClient<T>() {
        return this.getBetaApiClient<T>(this.semaphoresService.getMsgraphBetaSemaphore());
    }

    public getExtensions() {
        return this.getAuthClient().pipe(switchMap(client => client.api('/me?$select=id&$expand=extensions').get()));
    }

    public checkSignature() {
        return this.getAuthClient().pipe(switchMap(client => client.api('/me/drive/special/Documents:/DPS/DPS_SIGNATURE.html').get()));
    }

    public getSignature(signatureUrl: any) {
        return this.httpClient.get(signatureUrl, { responseType: 'text' });
    }

    public getSupportedTimeZones() {
        return this.getAuthClient().pipe(
            switchMap(client => client.api('/me/outlook/SupportedTimeZones')
                .get().pipe(
                    map((result: any) => result.value))
            ));
    }

    public getUserTimeZone() {
        return this.getAuthClient().pipe(switchMap(client => client.api('/me/mailboxSettings/timeZone')
            .get().pipe(
                map((result: any) => result ? result.value : null))
        ));
    }
    public getAutomaticRepliesSetting() {
        return this.getAuthClient().pipe(switchMap(client => client.api('/me/mailboxSettings/automaticRepliesSetting')
            .get().pipe(
                map((result: any) => result))
        ));
    }

    public updateExtensions(currentState: OrganizerSettingsState) {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/extensions/organizerSettings`)
                .patch({
                    isChaserEnable: currentState.isChaserEnable,
                    isSignaturAutoAdd: currentState.isSignaturAutoAdd,
                    dpsSharedMailBoxes: currentState.dpsSharedMailBoxes,
                    reminderSoundEnable: currentState.reminderSoundEnable,
                    newMailSoundEnable: currentState.newMailSoundEnable,
                    messageFormat: currentState.messageFormat,
                    useGlobalSignature: currentState.useGlobalSignature
                }).pipe(
                    map(result => result))
        ));
    }

    public updateSignature(currentState: OrganizerSettingsState) {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/drive/special/Documents:/DPS/DPS_SIGNATURE.html:/content`)
                .put(currentState.signature).pipe(
                    map(result => {
                        return result;
                    }))
        ));
    }

    public updateUserTimeZone(currentState: OrganizerSettingsState) {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/mailboxSettings`)
                .patch({ timeZone: currentState.userTimeZone }).pipe(
                    map(result => result))
        ));
    }
    public updateAutomaticRepliesSetting(currentState: OrganizerSettingsState) {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/mailboxSettings`)
                .patch({ automaticRepliesSetting: { ...currentState.automaticRepliesSetting, '@odata.context': undefined } }).pipe(
                    map(result => result))
        ));
    }
    public createExtensions(currentState: OrganizerSettingsState): Observable<any> {
        return this.getAuthClient().pipe(switchMap(client =>
            client.api(`/me/extensions`)
                .post({
                    '@odata.type': 'microsoft.graph.openTypeExtension',
                    extensionName: 'organizerSettings',
                    isChaserEnable: currentState.isChaserEnable,
                    isSignaturAutoAdd: currentState.isSignaturAutoAdd,
                    dpsSharedMailBoxes: currentState.dpsSharedMailBoxes,
                    reminderSoundEnable: currentState.reminderSoundEnable,
                    newMailSoundEnable: currentState.newMailSoundEnable,
                    messageFormat: currentState.messageFormat
                }).pipe(map(result => {
                    return result;
                }))
        ));
    }

    public saveGlobalSignature(template: string) {
        return this.httpClient.post<any>(this.appConfig.serviceBase
            + '/General/SaveGlobalSignatureTemplate', { content: template }).pipe(map((responce) => {
                return responce.data;
            }));
    }
}

