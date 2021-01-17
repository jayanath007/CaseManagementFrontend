import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../../core';
import { switchMap, repeatWhen, filter, take, map, delayWhen } from 'rxjs/operators';
import { DurableProxy, DurableTaskStatus, SessionToken } from '../models/interfaces';
import { timer } from 'rxjs';

@Injectable()
export class AzureHttpClientService {

    constructor(private http: HttpClient, private appConfig: AppConfig) { }

    public uploadEmailsAsMsg(itemAccess: { itemId: string, messageId: string, userEmail: string, token: string }[],
        audiance: string, isGoogle?: boolean) {
        return this.http.post<{ body: DurableProxy }>(
            `${this.appConfig.apiv3DocumentHandler}/${isGoogle ? 'Gmail' : 'Office365'}/Messages/CopyAsMsg/${audiance}`,
            { body: { itemAccess } }
        ).pipe(switchMap(response => this.checkStatus(response.body).pipe(map(status => ({ response: response.body, status })))));
    }

    public uploadDriveItems(itemRefs: { itemRef: string, token: string }[], driveId: string, audiance: string) {
        return this.http.post<{ body: DurableProxy }>(
            `${this.appConfig.apiv3DocumentHandler}/Drive/Items/Copy/${audiance}`, { body: { itemRefs, driveId } }
        ).pipe(switchMap(response => this.checkStatus(response.body)));
    }

    public uploadDiaryItems(itemAccessRefs: { itemRef: string | number, token: string }[],
        appCode: string, branchId: number, fileId: number) {
        return this.http.post<{ body: DurableProxy }>(
            `${this.appConfig.apiv3DiaryApi}/Diary/Files/CopyFrom/${appCode}/${branchId}/${fileId}`, { body: { itemAccessRefs } }
        ).pipe(switchMap(response => this.checkStatus(response.body)));
    }
    public uploadInboxItems(itemAccessRefs: { itemId: number, token: string }[], audiance: string) {
        return this.http.post<{ body: DurableProxy }>(
            `${this.appConfig.apiv3Inbox}/Inbox/Files/CopyTo/${audiance}`, { body: { itemAccessRefs } }
        ).pipe(switchMap(response => this.checkStatus(response.body)));
    }
    public generateProbateAccount(matterData: { branchID: number, appId: number, fileID: number }) {
        return this.http.get<{ body: DurableProxy }>(
            `${this.appConfig.apiv3ProbateApi}/Probate/GenarateAccounts?branchId=${matterData.branchID
            }&appId=${matterData.appId}&fileId=${matterData.fileID}`,
        ).pipe(switchMap(response => this.checkStatus(response.body)));
    }

    public generateProbateForms(matterData: { branchID: number, appId: number, fileID: number },
        data: { isForce400: boolean, isForce205: boolean }) {
        return this.http.get<{ body: DurableProxy }>(
            `${this.appConfig.apiv3ProbateApi}/Probate/PopulateIHTForms?branchId=${matterData.branchID}&appId=${matterData.appId
            }&fileId=${matterData.fileID}&isForce400=${data.isForce400}&isForce205=${data.isForce205}`,
        ).pipe(switchMap(response => this.checkStatus(response.body)));
    }

    private checkStatus({ hubName, instanceId }: DurableProxy) {
        return this.http.get<DurableTaskStatus>(
            `${this.appConfig.apiv3DurableProxy}/DurableTaskStatusProxy/${hubName}/${instanceId}`
        ).pipe(
            repeatWhen(completed => completed.pipe(delayWhen((event, i) => timer(Math.round(1000 * Math.pow(1.5, i)))))),
            filter(result => {
                switch (result.runtimeStatus) {
                    case 'Pending':
                    case 'ContinuedAsNew':
                    case 'Running':
                        return false;
                    default:
                        return true;
                }
            }),
            take(1),
            map(result => {
                if (result.runtimeStatus === 'Completed') {
                    if (result.output.items.find(val => !val.success)) {
                        throw result;
                    }
                    return result;
                } else {
                    throw result;
                }
            })
        );
    }

    public getDiaryWebViewToken(appCode: string, branchId: number, fileId: number) {
        return this.http.post<{ body: SessionToken }>(
            `${this.appConfig.apiv3DiaryApi}/Diary/Files/WebViewToken/${appCode}/${branchId}/${fileId}`, null).pipe(
                map(response => response.body)
            );
    }

    public getDiaryWebViewTokenByDiaryId(diaryId) {
        return this.http.post<{ body: SessionToken }>(
            `${this.appConfig.apiv3DiaryApi}/Diary/Files/WebViewTokenById/${diaryId}`, null).pipe(
                map(response => response.body)
            );
    }
}
