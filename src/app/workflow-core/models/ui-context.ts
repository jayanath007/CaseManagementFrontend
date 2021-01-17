import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DialogResult } from './enums';
import * as Mediators from './mediators';
import * as Messages from './remote-messages';
import { TemplateSession } from './template-session';
import { BaseWorkflowSession } from './base-workflow-session';
import { FileLogicMetadata } from './interfaces';
import { MatterSearchGridData } from './../../core/lib/matter';

@Injectable()
export abstract class UIContext {
    abstract showMessageBox(medator: Mediators.MessageBoxMediator): Observable<{ dialogResult: DialogResult, isReply: boolean }>;
    abstract showUserScreen(medator: Mediators.UserScreenMediator): Observable<Messages.UserScreenResult>;
    abstract showLinkedLettersScreen(mediator: Mediators.LinkedLettersMediator): Observable<Messages.LinkedLettersScreenResult>;
    abstract showComposeEmailPopup(mediator: Mediators.ComposeEmailMediator): void;
    abstract showXMmenu(session: BaseWorkflowSession, initData: Messages.ShowXMmenuRequest): void;
    abstract showInputBox(mediator: Mediators.InputBoxMediator): Observable<Messages.InputBoxResult>;
    abstract showPostCodeMatchingPopup(mediator: Mediators.PostCodeMatchingPopupMediator): Observable<Messages.InputBoxResult>;
    abstract showOptionDialogBox(mediator: Mediators.OptionDialogBoxMediator): Observable<Messages.OptionDialogResult>;
    abstract showDiaryScreen(mediator: Mediators.DiaryScreenMediator): Observable<Messages.DiaryScreenResult>;
    abstract showEChitScreenScreen(mediator: Mediators.ShowEChitScreenMediator): Observable<Messages.ShowEChitScreenResult>;


    abstract viewDocument(session: TemplateSession, initData: Messages.ViewOutputDocumentRequest): Observable<string>;
    abstract showContactSearchScreen<TResult, TCallbackData>(mediator: Mediators.ContactSearchMediator,
        callbackData: TCallbackData): Observable<TResult>;
    abstract confirmSaveToDiary(session: BaseWorkflowSession): Observable<DialogResult>;
    abstract onRemoteWorkerReady(session: BaseWorkflowSession);
    abstract loadWebpage(url: string, name: string, parentReferencePath: string);
    abstract loadPdfViwer(fileInfo: Messages.LoadPdfViewerRequest);
    abstract showError(error: string): Observable<any>;
    abstract showListLetterSaveButton(mediator: Mediators.LinkedLettersSaveConfirmMediator): Observable<DialogResult>;
    abstract getCommonTemplateMetadata(): Observable<FileLogicMetadata[]>;

    abstract showShareScreen(medator: Mediators.ShareScreenMediator):
        Observable<{ dialogResult: DialogResult, result: Messages.ShareScreenResult }>;

    public sessionPreStart(session: BaseWorkflowSession) {

    }
    abstract showLinkedMatterSyncPopup(data: any, matterData: MatterSearchGridData, title: string): Observable<any>;
    abstract showPlotSyncPopup(mediator: Mediators.PlotSyncMediator): void;
    abstract openCDS7ReportInfoPopup(mediator: Mediators.CDS7ReportScreenMediator): Observable<Messages.CDS7ReportDialogBoxResponse>;
}

