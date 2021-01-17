
import { catchError, map } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { WorkflowConnection } from './workflow-connection';
import { uuid } from '../../utils/uuid';
import * as Messages from './remote-messages';
import { MessageTypes, UserScreenCommand, DialogResult, SessionTypes } from './enums';
import * as Mediators from './mediators';

import { BaseWorkflowSession } from './base-workflow-session';
import { UIContext } from './ui-context';

export class TemplateSession extends BaseWorkflowSession {

    constructor(zone: NgZone, httpClient: HttpClient, getAuthToken: () => Observable<string>, url: string,
        appId: number, fileId: number, branchId: number,
        private templateId: string, private templateDescription: string, uiContext: UIContext,
        private isFormLibraryTemplate, private formLibraryTemplatePath) {
        super(zone, httpClient, getAuthToken, url, appId, fileId, branchId, uiContext);
    }

    getType(): SessionTypes {
        return SessionTypes.Templete;
    }

    onProtocalMessage(message: Messages.BaseMessage, mediators: Mediators.BaseMediator<any>[]) {
        const handled = super.onProtocalMessage(message, mediators);
        if (handled) {
            return true;
        }
        switch (message.action) {
            case MessageTypes.SaveToDiaryConfirmation:
                {
                    const mediator = new Mediators.ConfirmSaveDiaryMediator(this, message);
                    this.connectToOutbound(
                        this.uiContext.confirmSaveToDiary(this).pipe(
                            map((result) => !result ? DialogResult.Abort : result),
                            catchError((error) => of(DialogResult.Abort)),
                            map((result) => ({ method: 'ConfirmSaveToDiary', params: [result] })))
                    );
                    return true;
                }

            case MessageTypes.ShowListLetterSaveButton:
                {
                    const mediator = new Mediators.LinkedLettersSaveConfirmMediator(this,
                        message as Messages.ShowListLetterSaveButtonRequest);
                    this.connectToOutbound(
                        this.uiContext.showListLetterSaveButton(mediator).pipe(
                            map((result) => !result ? DialogResult.Abort : result),
                            catchError((error) => of(DialogResult.Abort)),
                            map((result) => ({ method: 'ListLetterSaveResponse', params: [result] })))
                    );
                    return true;
                }

            case MessageTypes.ShowDiaryScreen:
                {
                    const mediator = new Mediators.DiaryScreenMediator(this, message as Messages.ShowDiaryScreenRequest);
                    this.connectToOutbound(
                        this.uiContext.showDiaryScreen(mediator).pipe(
                            map((result) => !result ? { dialogResult: DialogResult.Abort } : result),
                            catchError((error) => of({ dialogResult: DialogResult.Abort })),
                            map((result) => ({ method: 'DiaryScreenResponse', params: [result.dialogResult] })))
                    );
                    return true;
                }

            case MessageTypes.ShowEChitScreenRequest:
                {
                    const mediator = new Mediators.ShowEChitScreenMediator(this, message as Messages.ShowEChitScreenRequest);
                    this.connectToOutbound(
                        this.uiContext.showEChitScreenScreen(mediator).pipe(
                            map((result) => {
                                return !result ? { dialogResult: DialogResult.Abort } : result;
                            }),
                            catchError((error) => of({ dialogResult: DialogResult.Abort })),
                            map((result) => {
                                return ({ method: 'ShowEChitScreenResponse', params: [result.dialogResult, result['data']] });
                            }))
                    );
                    return true;
                }

            case MessageTypes.ViewDocument:
                {
                    this.uiContext.viewDocument(this, message as Messages.ViewOutputDocumentRequest);
                    return true;
                }

            case MessageTypes.LoadPdfViewer:
                {
                    this.uiContext.loadPdfViwer(message as Messages.LoadPdfViewerRequest);
                    return true;
                }
            case MessageTypes.CDS7ReportDialogBox:
                {
                    const mediator = new Mediators.CDS7ReportScreenMediator(this, message as Messages.CDS7ReportDialogBoxRequest);
                    this.connectToOutbound(
                        this.uiContext.openCDS7ReportInfoPopup(mediator).pipe(
                            map((result) => !result ? { dialogResult: DialogResult.Abort } : result),
                            catchError((error) => of({ dialogResult: DialogResult.Abort })),
                            map((result) => ({ method: 'CDS7ReportDialogBoxResponse', params: [result.dialogResult] })))
                    );
                    return true;
                }

        }

        return false;
    }

    start() {
        return super.start().then((result) => {
            return this.workflowConnection
                .callServerMethod('StartTemplateSession',
                    [this.templateId, this.templateDescription, this.isFormLibraryTemplate, this.formLibraryTemplatePath]);
        });
    }

    getInput() {
        return { templateId: this.templateId, templateDescription: this.templateDescription };
    }
}
