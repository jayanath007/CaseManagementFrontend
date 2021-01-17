
import { map, filter, catchError, take, switchMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import * as Core from '../actions/core';
import { EmailListService } from '../services/email-list.service';
import { of, combineLatest } from 'rxjs';
import { Share } from '../models/interface';
import { SubmitType, MatterInfo } from '../../add-note-core';
import { getUser } from '../../auth';
import { MainMenuItem } from './../../layout-desktop/models/interfaces';
import { OpenCaseMenueData } from './../../core/lib/open-case';
import { getIsSilent, getMessage } from '../reducers';
import { LocalStorageKey } from './../../core/lib/local-storage';
import { OpenCaseRefresh } from './../../open-case-core/actions/core';
import { getDefaultMessageFormat } from '../../utils/organizer';
@Injectable()
export class EmailListEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: EmailListService) { }


    @Effect()
    getEmailList$ = this.actions$.pipe(ofType<Core.GetEmailList>(Core.GET_EMAIL_LIST),
        switchMap(action => {
            // if (action.payload.branchId && action.payload.appId && action.payload.fileId) {
            return this.service.getEmailList(action.payload.branchId, action.payload.appId, action.payload.fileId).pipe(
                map((result) => {
                    if (!result.reviewNote || result.reviewNote === '') {
                        result.reviewNote = action.payload.reviewNote;
                    }
                    if (!result.message || result.message === '') {
                        result.message = action.payload.message;
                    }
                    return result;
                }),
                map(result => new Core.GetEmailListSuccess(result)),
                catchError(error => of(new Core.GetEmailListFail(error))));
            // }
            // return of(new Core.GetEmailListSuccess([]));
        }
        ));


    @Effect()
    shareForWorkflow$ = this.actions$.pipe(ofType<Core.ShareAttachment>(Core.SHARE_ATTACHMENT),
        filter((action) => action.payload.submitType === SubmitType.WorkflowShare),
        map((action) => new Core.ShareAttachmentSuccess({
            submitType: action.payload.submitType,
            matterRef: action.payload.matterData ? action.payload.matterData.MatterReferenceNo : null
        }))); // just to close  the popup


    @Effect({ dispatch: false })
    refrshOpenCase$ = this.actions$.pipe(ofType<Core.ShareAttachmentSuccess>(Core.SHARE_ATTACHMENT_SUCCESS),
        map(action => {
            const openCases: MainMenuItem<OpenCaseMenueData>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.OpenCaseMenuItems));
            if (openCases && openCases.length > 0) {
                let selectOpenCase: MainMenuItem<OpenCaseMenueData>;
                if (action.payload && action.payload.matterRef) {
                    selectOpenCase = openCases.find(i => i.data && i.data.matterReferenceNo === action.payload.matterRef);
                }
                if (!selectOpenCase) {
                    selectOpenCase = openCases.find(i => i.isSelected);
                }
                if (selectOpenCase && selectOpenCase.token) {
                    return this.store.dispatch(new OpenCaseRefresh(selectOpenCase.token, {}));
                }
            }
        }));


    // eBilling Comment
    // @Effect()
    // loadWorkTypeListData$ = this.actions$.ofType<Core.LoadWorkTypeList>(Core.LOAD_WORK_TYPE_LIST)
    //     .switchMap((action: Core.LoadWorkTypeList) =>
    //         this.service.getWorkTypeList().map((response) =>
    //             new Core.LoadWorkTypeListSuccess(action.token, { workTypeList: response }))
    //             .catch(error => of(new Core.LoadWorkTypeListFail(action.token, error)))
    //     );
    // @Effect()
    // loadPhaseListData$ = this.actions$.ofType<Core.LoadPhaseList>(Core.LOAD_PHASE_LIST)
    //     .switchMap((action: Core.LoadPhaseList) =>
    //         this.service.getPhaseList().map((response) =>
    //             new Core.LoadPhaseListSuccess(action.token, { phaseList: response }))
    //             .catch(error => of(new Core.LoadPhaseListFail(action.token, error)))
    //     );
    // @Effect()
    // loadActivitiListData$ = this.actions$.ofType<Core.LoadActivitiList>(Core.LOAD_ACTIVITI_LIST)
    //     .switchMap((action: Core.LoadActivitiList) =>
    //         this.service.getActivitiList().map((response) =>
    //             new Core.LoadActivitiListSuccess(action.token, { activitiList: response }))
    //             .catch(error => of(new Core.LoadActivitiListFail(action.token, error)))
    //     );
    // @Effect()
    // loadTaskListData$ = this.actions$.ofType<Core.LoadTaskList>(Core.LOAD_TASK_LIST)
    //     .switchMap((action: Core.LoadTaskList) =>
    //         this.service.getTaskList().map((response) =>
    //             new Core.LoadTaskListSuccess(action.token, { taskList: response }))
    //             .catch(error => of(new Core.LoadTaskListFail(action.token, error)))
    //     );


    // -----ebill-----

    @Effect()
    shareAttachment$ = this.actions$.pipe(ofType<Core.ShareAttachment>(Core.SHARE_ATTACHMENT),
        filter((action) => action.payload.submitType !== SubmitType.WorkflowShare),
        switchMap(action =>
            combineLatest(
                this.store.select(getIsSilent),
                this.store.select(getMessage),
                ((isSilent, message) =>
                    ({ isSilent, message, action }))

            ).pipe(take(1))
        ),
        switchMap((info) => {
            return this.store.select(getUser).pipe(
                take(1),
                map((user) => {
                    const messageFormat = getDefaultMessageFormat(user.messageFormat);
                    const message = info.isSilent ? info.message : '';
                    const htmlBody = (user && user.isSignaturAutoAdd) ?
                        `${messageFormat} <div class="signature">${user.signature}</div>` : messageFormat;

                    return { action: info.action, htmlBody, isSilent: info.isSilent, message };
                }));
        }),
        switchMap(({ action, htmlBody, isSilent, message }) => this.shareAttachment(action.payload, htmlBody, isSilent, message).pipe(
            map(result => {
                if (result && result.id) {
                    this.openComposeUrlPoupByItemId(result.id);
                }
                return new Core.ShareAttachmentSuccess({
                    ...result,
                    submitType: action.payload.submitType,
                    matterRef: action.payload.matterData ? action.payload.matterData.MatterReferenceNo : null
                });
            }),
            catchError(error => of(new Core.ShareAttachmentFail(error))))
        ));
    shareAttachment(payload: {
        fileCredentials: { diaryId: number, password: string, letterName: string }[],
        subjectNote: string,
        signTokens: string[],
        safeBoxFileList: string[],
        submitType: SubmitType,
        matterData: MatterInfo,
        toRecipients: [string],
        ccRecipients: [string],
        reviewDate: string,
        reviewNote: string,
        message?: string,
        isEditable: boolean,
        share: Share
    }, htmlBody: string, isSilent: boolean, message: string) {
        if (payload.submitType === SubmitType.SafeBoxSheare) {
            return this.service.shareSafeBoxDocument(
                payload.safeBoxFileList,
                isSilent,
                payload.toRecipients,
                payload.ccRecipients,
                htmlBody,
                message
            );
        } else if (payload.submitType === SubmitType.SignAndShare) {
            if (payload.share === Share.SafeBox) {
                return this.service.shareSignedDPSFileViaSafeBox(
                    payload.matterData.MatterReferenceNo,
                    payload.signTokens,
                    isSilent,
                    payload.reviewDate,
                    payload.reviewNote,
                    payload.toRecipients,
                    payload.ccRecipients,
                    htmlBody,
                    message,
                    payload.fileCredentials,
                );
            } else if (payload.share === Share.MLSAndSafeChat) {
                return this.service.sendDocumentsToMLSBySigToken(
                    payload.matterData.MatterReferenceNo,
                    payload.reviewDate,
                    payload.reviewNote,
                    payload.message,
                    payload.toRecipients,
                    payload.signTokens,
                    payload.isEditable,
                    payload.fileCredentials,
                );
            } else {
                return this.service.sendSignedDocumentAsMailAttachment(
                    payload.matterData.MatterReferenceNo,
                    payload.signTokens,
                    isSilent,
                    payload.reviewDate,
                    payload.reviewNote,
                    payload.toRecipients,
                    payload.ccRecipients,
                    htmlBody,
                    message,
                    payload.fileCredentials,
                );
            }
        } else {
            if (payload.share === Share.SafeBox) {
                return this.service.shareDPSFileWithDiaryEntryViaSafeBox(
                    payload.matterData,
                    payload.toRecipients,
                    payload.ccRecipients,
                    isSilent,
                    payload.reviewDate,
                    payload.reviewNote,
                    payload.subjectNote,
                    payload.fileCredentials,
                    htmlBody,
                    message
                );
            } else if (payload.share === Share.MLSAndSafeChat) {
                return this.service.sendDocumentsToMLS(
                    payload.matterData.MatterReferenceNo,
                    payload.reviewDate,
                    payload.reviewNote,
                    payload.message,
                    payload.toRecipients,
                    payload.fileCredentials,
                    payload.isEditable
                );
            } else {
                return this.service.sendDocumentAsMailAttachment(
                    payload.matterData.MatterReferenceNo,
                    payload.share === Share.EmailAttachmentPDF,
                    isSilent,
                    payload.reviewDate,
                    payload.reviewNote,
                    payload.toRecipients,
                    payload.ccRecipients,
                    payload.fileCredentials,
                    htmlBody,
                    message
                );
            }
        }
    }
    public openComposeUrlPoupByItemId(id) {

        const encodeId = encodeURIComponent(id);
        const url = window.location.origin + `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;

        const popupWidth = 900;
        const popupHeight = 700;
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen['left'];
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen['top'];

        const width = window.innerWidth ? window.innerWidth :
            document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight :
            document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const left = ((width / 2) - (popupWidth / 2)) + dualScreenLeft;
        const top = ((height / 2) - (popupHeight / 2)) + dualScreenTop;
        const newWindow = window.open(url, id, 'scrollbars=yes, width=' + popupWidth + ', height='
            + popupHeight + ', top=' + top + ', left=' + left);

        if (window.focus) {
            newWindow.focus();
        }
    }

}
