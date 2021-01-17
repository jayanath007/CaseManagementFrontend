import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig, wopiExtensions } from '../../core';
import { SessionToken } from '../models/interfaces';
import { map, switchMap, filter, take, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { getDiaryWebViewTokensByIds, getDiaryWebViewTokensByDiaryId } from '../reducers';
import { ChangeDiaryWebViewToken, ChangeDiaryWebViewTokenByDiaryId } from '../actions/azure';
import { getExtention } from '../../utils/file';
import { ValidateEmailPipe } from '../../shared';
import { DPSConstants } from '../../core/lib/dpsConstant';

@Injectable({ providedIn: 'root' })
export class WebViewService {

    constructor(private http: HttpClient, private appConfig: AppConfig,
        private store: Store<any>, private validateEmail: ValidateEmailPipe) { }

    private getDiaryWebViewToken(appCode: string, branchId: number, fileId: number) {

        return this.store.select(getDiaryWebViewTokensByIds(appCode, branchId, fileId)).pipe(
            take(1),
            tap(token => {
                if (!(token && token.token && token.expireTimeValue > (new Date().valueOf()))) {
                    this.store.dispatch(new ChangeDiaryWebViewToken(appCode, branchId, fileId, { ...token, isRequesting: true }));
                }
            }),
            switchMap(() => this.store.select(getDiaryWebViewTokensByIds(appCode, branchId, fileId)).pipe(
                filter(token => token && token.token && token.expireTimeValue > (new Date().valueOf()) && !token.isRequesting),
                take(1),
                map(token => token.token)
            ))
        );
    }

    private getDiaryWebViewTokenByDiaryId(diaryId: number) {
        return this.store.select(getDiaryWebViewTokensByDiaryId(diaryId)).pipe(
            take(1),
            tap(token => {
                if (!(token && token.token && token.expireTimeValue > (new Date().valueOf()))) {
                    this.store.dispatch(new ChangeDiaryWebViewTokenByDiaryId(diaryId, { ...token, isRequesting: true }));
                }
            }),
            switchMap(() => this.store.select(getDiaryWebViewTokensByDiaryId(diaryId)).pipe(
                filter(token => token && token.token && token.expireTimeValue > (new Date().valueOf()) && !token.isRequesting),
                take(1),
                map(token => token.token)
            ))
        );
    }

    getDiaryWebViewUrl(appCode: string, branchId: number, fileId: number, itemRef: string | number, attachmentName: string) {
        const extention = getExtention(attachmentName);
        let name = attachmentName || 'No Name';
        if (extention && wopiExtensions.includes(extention.toLowerCase())) {
            name = attachmentName.slice(0, attachmentName.lastIndexOf('.' + extention)) + '.pdf';
        }
        return this.getDiaryWebViewToken(appCode, branchId, fileId).pipe(
            map(token => `${this.appConfig.apiv3DocumentHandlerProxy}/DiaryFilesWebViewProxy/${token}/${itemRef
                }/${encodeURIComponent(name.replace(/[/\\?%*:|"<>]/g, '_'))}`)
        );
    }

    getDiaryWebViewUrlByDiaryId(diaryId: number, attachmentName: string) {
        const extention = getExtention(attachmentName);
        let name = attachmentName || 'No Name';
        if (extention && wopiExtensions.includes(extention.toLowerCase())) {
            name = attachmentName.slice(0, attachmentName.lastIndexOf('.' + extention)) + '.pdf';
        }
        return this.getDiaryWebViewTokenByDiaryId(diaryId).pipe(
            map(token => `${this.appConfig.apiv3DocumentHandlerProxy}/DiaryFilesWebViewProxy/${token}/${diaryId
                }/${encodeURIComponent(name.replace(/[/\\?%*:|"<>]/g, '_'))}`)
        );
    }

    getDiaryWebViewByDiaryId(diaryId: number, attachmentName?: string) {
        const extention = getExtention(attachmentName);
        let options = {};
        if (extention === 'html' || extention === 'txt') {
            options = { responseType: 'text' };
        }
        return this.getDiaryWebViewUrlByDiaryId(diaryId, attachmentName).pipe(
            switchMap(url => this.http.get<any>(url, options))
        );
    }

    getDiaryWebView(appCode: string, branchId: number, fileId: number, itemRef: string | number, attachmentName: string) {
        const extention = getExtention(attachmentName);
        let options = {};
        if (extention === 'html' || extention === 'txt') {
            options = { responseType: 'text' };
        }
        return this.getDiaryWebViewUrl(appCode, branchId, fileId, itemRef, attachmentName).pipe(
            switchMap(url => this.http.get<any>(url, options))
        );
    }

    getDiaryAttachmentDownloadUrl(appCode: string, branchId: number, fileId: number, itemRef: string | number, attachmentName: string) {
        return this.getDiaryWebViewToken(appCode, branchId, fileId).pipe(
            map(token => `${this.appConfig.apiv3DocumentHandlerProxy}/DiaryFilesWebViewProxy/${token}/${itemRef
                }/${encodeURIComponent(attachmentName.replace(/[/\\?%*:|"<>]/g, '_'))}?download=true`)
        );
    }

    getDiaryWebViewUrlForInlineAttachment(appCode: string, branchId: number, fileId: number, itemRef: string | number,
        attachmentRef: string, attachmentName: string) {
        const extention = getExtention(attachmentName);
        let name = attachmentName || 'No Name';
        if (extention && wopiExtensions.includes(extention.toLowerCase())) {
            name = attachmentName.slice(0, attachmentName.lastIndexOf('.' + extention)) + '.pdf';
        }
        return this.getDiaryWebViewToken(appCode, branchId, fileId).pipe(
            map(token => `${this.appConfig.apiv3DocumentHandlerProxy}/DiaryFilesWebViewProxy/${token}/${itemRef
                }/${encodeURIComponent(name.replace(/[/\\?%*:|"<>]/g, '_'))}?attachment=${attachmentRef}`)
        );
    }

    getDiaryWebViewForInlineAttachment(appCode: string, branchId: number, fileId: number, itemRef: string | number,
        attachmentRef: string, attachmentName: string) {
        return this.getDiaryWebViewUrlForInlineAttachment(appCode, branchId, fileId, itemRef, attachmentRef, attachmentName).pipe(
            switchMap(url => this.http.get<any>(url))
        );
    }
    getDiaryInlineAttachmentDownloadUrl(appCode: string, branchId: number, fileId: number, itemRef: string | number,
        attachmentRef: string, attachmentName: string) {
        return this.getDiaryWebViewToken(appCode, branchId, fileId).pipe(
            map(token => `${this.appConfig.apiv3DocumentHandlerProxy}/DiaryFilesWebViewProxy/${token}/${itemRef
                }/${encodeURIComponent(attachmentName.replace(/[/\\?%*:|"<>]/g, '_'))}?attachment=${attachmentRef}&download=true`)
        );
    }
    private getMailAttachementViewToken(owner: string, itemId: string, attachmentId: string) {
        return this.http.post<{ body: SessionToken }>(
            `${this.appConfig.apiv3DocumentHandler}/Office365/Messages/GetMailAttachementViewToken`, {
            body: { itemId, attachmentId, userEmail: this.validateEmail.transform(owner) ? owner : null }
        }).pipe(
            map(response => response.body)
        );
    }
    getMailAttachementWebViewUrl(owner: string, itemId: string, attachmentId: string, attachmentName: string) {
        const extention = getExtention(attachmentName);
        let name = attachmentName || 'No Name';
        if (extention && wopiExtensions.includes(extention.toLowerCase())) {
            name = attachmentName.slice(0, attachmentName.lastIndexOf('.' + extention)) + '.pdf';
        }
        return this.getMailAttachementViewToken(owner, itemId, attachmentId).pipe(
            map(({ token }) => `${this.appConfig.apiv3DocumentHandlerProxy}/MailAttachmentWebViweProxy/${token}/${extention
                }/${encodeURIComponent(name.replace(/[/\\?%*:|"<>]/g, '_'))}`)
        );
    }
    getMailAttachementWebView(owner: string, itemId: string, attachmentId: string, attachmentName: string) {

        return this.getMailAttachementWebViewUrl(owner, itemId, attachmentId, attachmentName).pipe(
            switchMap(url => this.http.get<any>(url))
        );
    }

    getMailAttachementDownloadUrl(owner: string, itemId: string, attachmentId: string, attachmentName: string) {
        const extention = getExtention(attachmentName);
        return this.getMailAttachementViewToken(owner, itemId, attachmentId).pipe(
            map(({ token }) => `${this.appConfig.apiv3DocumentHandlerProxy}/MailAttachmentWebViweProxy/${token}/${extention
                }/${encodeURIComponent(attachmentName.replace(/[/\\?%*:|"<>]/g, '_'))}?download=true`)
        );
    }

    getMailAttachementWebViewUrlForInlineAttachment(owner: string, itemId: string, attachmentId: string, parentExtention: 'eml' | 'msg',
        attachmentName: string, attachmentRef: string) {
        const extention = getExtention(attachmentName);
        let name = attachmentName || 'No Name';
        if (extention && wopiExtensions.includes(extention.toLowerCase())) {
            name = attachmentName.slice(0, attachmentName.lastIndexOf('.' + extention)) + '.pdf';
        }
        return this.getMailAttachementViewToken(owner, itemId, attachmentId).pipe(
            map(({ token }) => `${this.appConfig.apiv3DocumentHandlerProxy}/MailAttachmentWebViweProxy/${token}/${parentExtention
                }/${encodeURIComponent(name.replace(/[/\\?%*:|"<>]/g, '_'))}?attachment=${attachmentRef}`)
        );
    }

    getMailAttachementWebViewForInlineAttachment(owner: string, itemId: string, attachmentId: string, parentExtention: 'eml' | 'msg',
        attachmentName: string, attachmentRef: string) {

        return this.getMailAttachementWebViewUrlForInlineAttachment(owner, itemId, attachmentId,
            parentExtention, attachmentName, attachmentRef).pipe(
                switchMap(url => this.http.get<any>(url))
            );
    }

    getMailAttachementDownloadUrlForInlineAttachment(owner: string, itemId: string, attachmentId: string, parentExtention: 'eml' | 'msg',
        attachmentName: string, attachmentRef: string) {
        return this.getMailAttachementViewToken(owner, itemId, attachmentId).pipe(
            map(({ token }) => `${this.appConfig.apiv3DocumentHandlerProxy}/MailAttachmentWebViweProxy/${token}/${parentExtention
                }/${encodeURIComponent(attachmentName.replace(/[/\\?%*:|"<>]/g, '_'))}?attachment=${attachmentRef}&download=true`)
        );
    }
}
