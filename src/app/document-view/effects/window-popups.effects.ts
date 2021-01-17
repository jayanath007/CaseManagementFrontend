
import { switchMap, catchError, mergeMap, filter, take, tap, map } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import * as WindowPopup from '../actions/window-popups';
import * as DocEdit from '../actions/document-editing';
import { WindowPopupsManagerService } from '../services/window-popups-manager.service';
import { FileUrlResolverService } from '../services/file-url-resolver.service';
import { fitWindow, centerToWindow } from '../../utils/bounds';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { FileUrlCache } from '../../core/lib/files';
import * as _ from 'lodash';
import { Message, Recipient } from '../../core/lib/microsoft-graph';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { getUser } from '../../auth';
import { MatSnackBar } from '@angular/material';
import { IS_GOOGLE } from '../../shared';
import { Base64 } from '../../utils/base64';
import { of, empty } from 'rxjs';
import { getExtention } from '../../utils/file';
import { getFileTypeByFullFileName } from '../../core/utility/DpsUtility';
import { getDefaultMessageFormat } from '../../utils/organizer';
import { DatePipe } from '@angular/common';
import { WebViewService } from '../../azure-storage';
import { MsgViewerInput } from '../../msg-viewer';
import { uuid } from '../../utils/uuid';


@Injectable()
export class WindowPopupsEffects {

    constructor(protected store: Store<any>, private actions$: Actions,
        private webViewService: WebViewService,
        private popupService: WindowPopupsManagerService,
        private inApppopup: SystemJsPopupLoaderService,
        private datePipe: DatePipe,
        public snackBar: MatSnackBar,
        private urlResolver: FileUrlResolverService, private urlPopupService: UrlPopupService,
        @Inject(IS_GOOGLE) public isGoogle: boolean) { }

    @Effect()
    mailAttachements$ = this.actions$.pipe(ofType<WindowPopup.OpenEmailAttachemnt>(WindowPopup.OPEN_EMAIL_ATTACHEMENT),
        map((action) => action.payload),
        tap(val => {
            if (this.isGoogle) {
                this.popupService.openWindow(val.attachement.id,
                    Base64().createObjectURL(val.attachement.contentBytes, val.attachement.contentType,
                    ), { ...fitWindow() }, val.attachement ? getExtention(val.attachement.name) : '');
            }
        }),
        filter(val => !this.isGoogle),
        mergeMap((data) => {
            if (data.attachement['@odata.type'] === '#microsoft.graph.fileAttachment' || data.attachement['attachmentType'] === 'Item') {

                const id = `Attachement - ${data.attachement.name}`;

                if (data.isEmail) {

                    if (this.urlResolver.isV3CanViewFile(data.attachement.name) && data.attachement['attachmentType'] !== 'Item') {
                        const popupSpec = { ...fitWindow() };
                        if (data.attachmentId && data.attachmentId !== data.attachement.id) {
                            return this.webViewService.getMailAttachementWebViewUrlForInlineAttachment(data.owner, data.itemId,
                                data.attachmentId, 'eml', data.attachement.name, data.attachement['viewReferance']).pipe(map(url =>
                                    new WindowPopup.OpenByUrl({ id: id, url, spec: popupSpec, attachmentName: data.attachement.name })
                                ));
                        } else if (this.urlResolver.isConvertionFile(data.attachement.name)) {
                            return this.webViewService.getMailAttachementWebViewUrl(data.owner, data.itemId,
                                data.attachement.id, data.attachement.name).pipe(map(url =>
                                    new WindowPopup.OpenByUrl({ id: id, url, spec: popupSpec, attachmentName: data.attachement.name })
                                ));
                        } else {
                            return this.urlResolver.createAttachemntRawContentPath(data.owner, data.itemId, data.attachement.id)
                                .pipe(map(url =>
                                    new WindowPopup.OpenByUrl({ id: id, url, spec: popupSpec, attachmentName: data.attachement.name })
                                ));
                        }


                    } else if (getExtention(data.attachement.name).toLowerCase() === 'msg' ||
                        getExtention(data.attachement.name).toLowerCase() === 'eml' || data.attachement['attachmentType'] === 'Item') {
                        let parentExtention;
                        let attachmentId;
                        if (data.attachmentId && data.attachmentId !== data.attachement.id) {
                            parentExtention = 'eml';
                            attachmentId = data.attachmentId;
                        } else {
                            parentExtention = getExtention(data.attachement.name);
                            attachmentId = data.attachement.id;
                        }
                        const input: MsgViewerInput = {
                            viewerFrom: 'email',
                            emailInput: {
                                owner: data.owner, itemId: data.itemId, parentExtention: parentExtention,
                                attachmentId: attachmentId, attachment: data.attachement
                            }
                        };
                        this.inApppopup.openMsgViewer(input);
                        return empty();

                    } else {
                        this.popupService.showUnsupportedFileMessage(data.attachement.name);
                        return empty();
                    }

                } else {
                    if (!this.urlResolver.isSupportedFile(data.attachement.name)) {
                        this.popupService.showUnsupportedFileMessage(data.attachement.name);
                        return empty();
                    }

                    return this.urlResolver.deriveAttachmentUrl(data.attachement)
                        .pipe(
                            map((cacheInfo) => {
                                return this.getOpenAction(cacheInfo, id, data.attachement.name);
                            }), catchError((error) => {
                                if (error) {
                                    console.error('error downlaoding files', error);
                                }
                                return empty();
                            })
                        );
                }


            } else if (data.attachement['@odata.type'] === '#microsoft.graph.itemAttachment') {
                const encodeItemId = encodeURIComponent(data.itemId);
                const encodeAttachementId = encodeURIComponent(data.attachement.id);
                const urlPath = `/mail-item/${encodeURIComponent(btoa(data.owner))}/${encodeItemId}/${encodeAttachementId}`;
                const opened = this.urlPopupService.openWithUrlPoup(urlPath, encodeItemId + encodeAttachementId, false, false);
                return empty();
            }
            return empty();

        }));

    @Effect()
    openWopiDocumentEditPoup$ = this.actions$.pipe(ofType<WindowPopup.OpenWopiDocumentEditPoup>(WindowPopup.OPEN_WOPI_DOCUMENT_EDIT_POUP),
        filter((action) => action.request.row.data.offlineStates !== 3),
        map((action) => {
            return new DocEdit.CheckoutDiaryItemDoc({ diaryId: action.request.row.data.diary_UID });
        })
    );


    @Effect()
    openPDFDocumentEditPoup$ = this.actions$.pipe(ofType<WindowPopup.OpenPDFDocumentEditPoup>(WindowPopup.OPEN_PDF_DOCUMENT_EDIT_POUP),
        switchMap(action =>
            this.urlResolver.getEditablePDFUrlByLetterName(
                action.matterInfo.BranchId,
                action.matterInfo.AppId,
                action.matterInfo.FileId,
                action.letterName).pipe(map(url =>
                    new WindowPopup.OpenByUrl({
                        url: url,
                        id: uuid(),
                        spec: {
                            ...fitWindow(),
                            toolbar: false,
                            location: false,
                            directories: false,
                            status: false,
                            menubar: false,
                            scrollbars: false,
                        },
                        attachmentName: action.letterName
                    })))));



    @Effect()
    openWopi$ = this.actions$.pipe(ofType<WindowPopup.OpenEmailAttachemntWithWopi>(WindowPopup.OPEN_EMAIL_ATTACHEMENT_WITH_WOPI),
        mergeMap((action) =>
            this.urlResolver.getAttachmentDataUrlInMail(action.payload.attachement.id).pipe((map((url) =>
                ({ url: url, id: `Attachement - ${action.payload.attachement.name}`, }))))
        ),
        map(({ url, id }) =>
            new WindowPopup.OpenByUrl({
                id: id, url: url, spec: {
                    ...fitWindow(),
                    toolbar: false,
                    location: false,
                    directories: false,
                    status: false,
                    menubar: false,
                    scrollbars: false,
                },
                attachmentName: id
            })
        ));

    @Effect({ dispatch: false })
    openWindow$ = this.actions$.pipe(ofType<WindowPopup.OpenByUrl>(WindowPopup.OPEN_BY_URL),
        map(action => action.payload),
        tap(data => {
            this.popupService.openWindow(data.id, data.url, data.spec, getExtention(data.attachmentName));
        }));

    @Effect({ dispatch: false })
    openByOfficeUriSchemes$ = this.actions$.pipe(ofType<WindowPopup.OpenByOfficeUriSchemes>(WindowPopup.OPEN_BY_OFFICE_URI_SCHEMES),
        tap(({ schemes, isEdit }) => {
            schemes.callURI(isEdit);
        }));

    // @Effect({ dispatch: false })
    // openDriveEditDoc$ = this.actions$.pipe(ofType<WindowPopup.OpenDriveEditableDoc>(WindowPopup.OPEN_DRIVE_EDITABLE_DOC),
    //     tap(action => {
    //         this.popupService.openCheckinWindow(action.docCheckin,
    //             {
    //                 ...fitWindow(),
    //                 toolbar: false,
    //                 location: false,
    //                 directories: false,
    //                 status: false,
    //                 menubar: false,
    //                 scrollbars: false
    //             });
    //     }));

    @Effect({ dispatch: false })
    openMsgView$ = this.actions$.pipe(ofType<WindowPopup.OpenMsgView>(WindowPopup.OPEN_MSG_VIEW),
        map(action => action.payload),
        tap(data => {
            this.inApppopup.openMsgFilePopup('MggEmailAttachemnt', { emailItem: data });
        }));


    @Effect()
    downloadDiaryMsgAttachemntToCloud$ = this.actions$.pipe(ofType<WindowPopup.DownloadDiaryInlineAttachmentToCloud>(
        WindowPopup.DOWNLOAD_DIARY_INLINE_ATTACHMENT_TO_CLOUD),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) => {
            const snackBar = this.snackBar.open('Downloading to personal folder', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            return this.urlResolver.downloadMSGFileToCloud(
                action.payload.diaryId,
                action.payload.attachmentName,
                user.profile.upn.split('@')[0]).pipe(
                    switchMap((result) => {
                        snackBar.dismiss();
                        return this.snackBar.open('Download complete', result && result.data && result.data.fileUrl ? 'Open' : null, {
                            duration: 5000,
                            verticalPosition: 'top',
                            horizontalPosition: 'right',
                            panelClass: 'dps-download-complete-snackbar'
                        }).onAction().pipe(map(() => new WindowPopup.OpenByUrl({
                            url: result.data.fileUrl,
                            id: result.data.fileId,
                            spec: { ...centerToWindow(800, 600) },
                            attachmentName: ''
                        })));
                    }), catchError(errer => {
                        snackBar.dismiss();
                        return empty();
                    }));
        }));

    @Effect({ dispatch: false })
    downloadAttachmentToCloud$ = this.actions$.pipe(
        ofType<WindowPopup.DownloadDPSFileToOneDrive>(WindowPopup.DOWNLOAD_DPS_FILE_TO_ONE_DRIVE),
        switchMap(action => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) => {
            const snackBar = this.snackBar.open('Downloading to personal folder', null, {
                verticalPosition: 'top',
                horizontalPosition: 'right'
            });
            return this.urlResolver.downloadDPSFileToOneDrive(action.payload.diaryId, user.profile.upn.split('@')[0]).pipe(
                tap((result) => {
                    snackBar.dismiss();
                    this.snackBar.open('Download complete', result && result.data && result.data.fileUrl ? 'Open' : null, {
                        duration: 5000,
                        verticalPosition: 'top',
                        horizontalPosition: 'right',
                        panelClass: 'dps-download-complete-snackbar'
                    }).onAction()
                        .subscribe(() => {
                            this.store.dispatch(
                                new WindowPopup.OpenByUrl({
                                    url: result.data.fileUrl,
                                    id: result.data.fileId,
                                    spec: { ...centerToWindow(800, 600) },
                                    attachmentName: ''
                                }));
                        });
                }), catchError(errer => {
                    snackBar.dismiss();
                    return empty();
                }));
        }));

    @Effect({ dispatch: false })
    downloadDPSFileToLocal$ = this.actions$.pipe(
        ofType<WindowPopup.DownloadDPSFileToLocal>(WindowPopup.DOWNLOAD_DPS_FILE_TO_LOCAL),
        switchMap((action => this.webViewService.getDiaryAttachmentDownloadUrl(
            action.payload.appCode, action.payload.branchId, action.payload.fileId,
            action.payload.itemRef, action.payload.attachmentName
        ))),
        tap((url) => {
            window.open(url as string, '_blank');
        })
    );

    @Effect({ dispatch: false })
    openDPSFileInPopup$ = this.actions$.pipe(
        ofType<WindowPopup.OpenDPSFileInPopup>(WindowPopup.OPEN_DPS_FILE_IN_POPUP),
        switchMap((action =>
            this.webViewService.getDiaryWebViewUrl(
                action.payload.appCode, action.payload.branchId, action.payload.fileId,
                action.payload.itemRef, action.payload.attachmentName
            ).pipe(map(url => ({ url, action })))
        )),
        tap(({ url, action }) => {
            const spec = {
                ...centerToWindow(800, 600),
                toolbar: false,
                location: false,
                directories: false,
                status: false,
                menubar: false,
                scrollbars: false,
            };
            const uid = uuid();
            this.popupService.openWindow(uid, url, spec, action.payload.attachmentName.split('.').pop());
        })
    );


    @Effect({ dispatch: false })
    downloadTemplateData$ = this.actions$.pipe(ofType<WindowPopup.DownloadTemplateData>(
        WindowPopup.DOWNLOAD_TEMPLATE_DATA),
        switchMap((action) => this.urlResolver.downloadTemplateData(action.payload.appId, action.payload.name, action.payload.isCommon)),
        tap((url) => {
            window.open(url as string, '_blank');
        }));

    @Effect()
    requestDraftId$ = this.actions$.pipe(
        ofType<WindowPopup.RequstReplayToMailForDiaryMsg>(WindowPopup.REQUST_REPLAY_TO_MAIL_FOR_DIARY_MSG),
        switchMap((action) =>
            this.store.select(getUser).pipe(
                map((user) => {
                    return { user, payload: action.payload };
                }),
                take(1))),
        switchMap((action) =>
            this.urlResolver.getDraftMailId(action.payload.diaryId, action.payload.password, action.payload.type).pipe(
                switchMap(result => {
                    if (result && result.itemId) {
                        return this.urlResolver.getMailItem(result.itemId.id).pipe(switchMap(massage => {
                            let cc = '';
                            const ccAddress: Recipient[] = [];
                            if (result.ccRecipients && result.ccRecipients.length > 0) {
                                result.ccRecipients.forEach(val => {
                                    cc += ((val.name || val.emailAddress) + '; ');
                                    if (!!action.user && !!action.user.profile && action.user.profile.upn !== val.emailAddress) {
                                        ccAddress.push({ emailAddress: { name: val.name, address: val.emailAddress } });
                                    }
                                });
                            }
                            let to = '';
                            const toAddress: Recipient[] = [];
                            if (result.toRecipients && result.toRecipients.length > 0) {
                                result.toRecipients.forEach(val => {
                                    to += ((val.name || val.emailAddress) + '; ');
                                    if (!!action.user && !!action.user.profile && action.user.profile.upn !== val.emailAddress) {
                                        toAddress.push({ emailAddress: { name: val.name, address: val.emailAddress } });
                                    }
                                });
                            }
                            const messageFormat = getDefaultMessageFormat(action.user.messageFormat);
                            const rplyFwdMsg = (action.user.isSignaturAutoAdd ?
                                `${messageFormat} <div class="signature">` + action.user.signature + '</div>' +
                                '<div id ="divRplyFwdMsg"></div>' : `${messageFormat} <div id ="divRplyFwdMsg"></div>`) + `
                                <hr tabindex="-1" style="display:inline-block; width:98%">
                                <div id="divRplyFwdMsg" dir="ltr">
                                    <font face="Calibri, sans-serif" color="#000000" style="font-size:11pt">
                                        <b>From:</b> ${result.from ? result.displayTo || result.from : ''}<br>
                                        <b>Sent:</b> ${result.sent ? this.datePipe.transform(result.sent, 'full') : ''}<br>
                                        <b>To:</b> ${to}<br>` +
                                (cc ? `<b>Cc:</b> ${cc}<br>` : ``) + `
                                        <b>Subject:</b> ${result.subject}
                                    </font>
                                    <div><br></div>
                                </div>
                                `;

                            let _massage: Message;
                            if (action.payload.type === 'createReplyAll') {
                                if (!!action.user && !!action.user.profile && action.user.profile.upn !== result.from) {
                                    toAddress.push({ emailAddress: { name: null, address: result.from } });
                                }
                                _massage = {
                                    body: {
                                        contentType: massage.body.contentType, content: rplyFwdMsg + massage.body.content
                                    },
                                    toRecipients: toAddress,
                                    ccRecipients: ccAddress
                                };
                            } else if (action.payload.type === 'createForward') {

                                _massage = {
                                    body: {
                                        contentType: massage.body.contentType, content: rplyFwdMsg + massage.body.content
                                    },
                                    toRecipients: []
                                };
                            } else {
                                _massage = {
                                    body: { contentType: massage.body.contentType, content: rplyFwdMsg + massage.body.content }
                                };
                            }

                            return this.urlResolver.updateMailItem(result.itemId.id, _massage, massage).pipe(switchMap(data => {
                                const encodeId = encodeURIComponent(result.itemId.id);
                                const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                                this.urlPopupService.openWithUrlPoup(urlPath, result.itemId.id, false, false);
                                return empty();
                            }));
                        }));
                    } else {
                        const encodeId = encodeURIComponent(result['id']);
                        const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                        this.urlPopupService.openWithUrlPoup(urlPath, result['id'], false, false);
                    }
                    return empty();

                }), catchError(error => empty()))
        ));



    getOpenAction(urlCache: FileUrlCache, id: string, attachmentName: string) {
        const popupSpec = { ...fitWindow() };
        if (_.isString(urlCache.view)) {
            return new WindowPopup.OpenByUrl({ id: id, url: urlCache.view as string, spec: popupSpec, attachmentName });
        } else {
            return new WindowPopup.OpenMsgView({ data: urlCache.view as Message });
        }
    }


    // getFileType(fileItem: FileItemWrapper): string {
    getFileType(fileItem: any): string {
        if (fileItem && fileItem.data && fileItem.data.letter_name) {
            return getFileTypeByFullFileName(fileItem.data.letter_name);
            // if (fileItem.data.letter_name.split('.')[1].toLocaleLowerCase()) {
            //     return fileItem.data.letter_name.split('.')[1].toLocaleLowerCase();
        } else if (fileItem && fileItem.letter_name) {
            return getFileTypeByFullFileName(fileItem.letter_name);
            // if (fileItem.letter_name.split('.')[1].toLocaleLowerCase()) {
            //     return fileItem.letter_name.split('.')[1].toLocaleLowerCase();
        }
        return '';
    }
}
