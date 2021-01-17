
import { switchMap, filter, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { SignAndShareOrShare, SIGN_AND_SHARE_OR_SHARE, SubmitType, AddNoteSaveSuccess } from '../../add-note-core';
import { DocumentViewPopupInput } from '../../document-view';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { InputData } from '../../email-list-core';
import { OpenMsgViewerPopup, OPEN_MSG_VIEWER_POPUP, ShowRateError, SHOW_RATE_ERROR } from '../../add-note-core/actions/core';
import { MatDialog } from '@angular/material';
import { FailDialogComponent, FailDialogData } from '../../shared';



@Injectable()
export class AddNoteEffects {
    constructor(private actions$: Actions, private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) { }

    @Effect()
    signAndShareOrShare$ = this.actions$.pipe(ofType<SignAndShareOrShare>(SIGN_AND_SHARE_OR_SHARE),
        switchMap(action => {
            const inputData: InputData = {
                signTokens: [action.payload.signToken],
                fileCredentials: action.payload.fileCredentials.map(val => ({
                    diaryId: val.diaryId, password: action.payload.password, letterName: val.letterName
                })),
                subjectNote: action.payload.subjectNote,
                safeBoxFileList: null,
                submitType: action.payload.submitType,
                url: action.payload.url,
                matterData: action.payload.matterData
            };
            if (action.payload.submitType === SubmitType.SignAndShare) {
                const input: DocumentViewPopupInput = {
                    fileItem: { signAndSendUrl: action.payload.url },
                    signandSendToken: action.payload.signToken,
                    title: 'Sign and Share',
                    icon: 'border_color'
                };
                return this.popupService.openDocumentViewPopup('DocumentViewPopup', input).pipe(switchMap(data => {
                    if (data) {
                        return this.showEmailListPopup({ ...inputData, fileCredentials: [] }, action.token, action.payload.isloop);
                    }
                    if (action.payload.isloop) {
                        return of(new AddNoteSaveSuccess(action.token,
                            { AddNoteSuccessInfo: { isSuccess: true, msg: 'Successfully saved.' } }));
                    }
                    return of();
                }));
            } else if (action.payload.submitType === SubmitType.Share) {
                return this.showEmailListPopup(inputData, action.token, action.payload.isloop);
            }
            if (action.payload.isloop) {
                return of(new AddNoteSaveSuccess(action.token,
                    { AddNoteSuccessInfo: { isSuccess: true, msg: 'Successfully saved.' } }));
            }
            return of();
        }));
    @Effect()
    _signAndShareOrShare$ = this.actions$.pipe(ofType<SignAndShareOrShare>(SIGN_AND_SHARE_OR_SHARE),
        filter(action => !action.payload.isloop),
        map(action => new AddNoteSaveSuccess(action.token,
            { AddNoteSuccessInfo: { isSuccess: true, msg: 'Successfully saved.' } })));

    @Effect()
    openMsgViewerPopup$ = this.actions$.pipe(ofType<OpenMsgViewerPopup>(OPEN_MSG_VIEWER_POPUP),
        switchMap(action => this.popupService.openMsgViewer({ viewerFrom: 'diary', diaryInput: action }).pipe(
            switchMap(data => of())
        ))
    );

    @Effect({ dispatch: false })
    showRateError$ = this.actions$.pipe(ofType<ShowRateError>(SHOW_RATE_ERROR),
        tap(action => {
            const dialogData: FailDialogData = {
                messageHeader: 'Validation Error',
                messageBody: '',
                detailStatus: action.payload
            };
            this.dialog.open(FailDialogComponent, {
                data: dialogData,
                width: '450px',
                panelClass: 'dps-notification'
            });
        })
    );

    showEmailListPopup(input: InputData, token, isloop: boolean) {
        return this.popupService.openEmailListPopup('EmailListPopup', input).pipe(switchMap(data => {
            if (isloop) {
                return of(new AddNoteSaveSuccess(token,
                    { AddNoteSuccessInfo: { isSuccess: true, msg: 'Successfully saved.' } }));
            }
            return of();
        }));
    }
}


