import { take, scan, filter, map, withLatestFrom, catchError, tap, takeUntil } from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, combineLatest, merge, Subject } from 'rxjs';

import { WorkflowConnection } from './workflow-connection';
import { UIContext } from './ui-context';
import { uuid } from '../../utils/uuid';
import * as Messages from './remote-messages';
import { MessageTypes, UserScreenCommand, DialogResult, SessionTypes } from './enums';
import * as Mediators from './mediators';
import * as _ from 'lodash';

export abstract class BaseWorkflowSession {

    protected workflowConnection: WorkflowConnection;
    // protected mediatorStack: Mediators.BaseMediator<any>[] = [];
    protected closeCleners: any[] = [];
    protected mediators$: Observable<Mediators.BaseMediator<any>[]>;
    protected mediatorActions$ = new Subject<(md: Mediators.BaseMediator<any>[]) => Mediators.BaseMediator<any>[]>();
    protected close$ = new Subject();
    private stated$ = new Subject<Messages.BaseMessage>();

    constructor(zone: NgZone, httpClient: HttpClient, getAuthToken: () => Observable<string>, url: string,
        private appId: number, private fileId: number, private branchId: number,
        protected uiContext: UIContext) {
        this.workflowConnection = new WorkflowConnection(zone, httpClient, getAuthToken, url, uuid());
        this.mediators$ = this.mediatorActions$.pipe(scan((mediators: any, action) => {
            return action(mediators);
        }, [] as Mediators.BaseMediator<any>[]));

    }

    start(): Promise<any> {
        return this.workflowConnection.callServerMethod('InitWorkerSession', [this.appId, this.fileId, this.branchId]);
    }

    public get stateChange(): Observable<{ mediators: Mediators.BaseMediator<any>[], message: Messages.BaseMessage }> {
        return merge(combineLatest(this.workflowConnection
            .workflowStream.pipe(
                filter((msg) => !!msg && _.isObject(msg) && !!msg.action)),
            this.mediators$, (message, mediators) => ({ message, mediators })),
            this.stated$.pipe(map((msg) => ({ message: msg, mediators: [] }))));
    }

    public onCommunicationEnd(): Observable<Messages.SessionComplete> {
        return this.workflowConnection.workflowStream.pipe(
            filter((msg) => !!msg && _.isObject(msg) && !!msg.action),
            filter((msg) => msg.action === MessageTypes.SessionComplete));
    }

    public onSucess() {
        return this.onCommunicationEnd().pipe(filter<Messages.SessionComplete>((msg) => !msg.errorMessage || msg.errorMessage === ''));
    }

    public holdUntilComplete(): Observable<any> {
        return Observable.create((observer) => {
            const subscription = this.workflowConnection.workflowStream.pipe(
                withLatestFrom(this.mediators$, (message, mediators) => ({ message, mediators })))
                .subscribe(({ message, mediators }) => {
                    const handled = this.onProtocalMessage(message, mediators as Mediators.BaseMediator<any>[]);
                },
                    (error) => observer.error(error),
                    () => observer.complete());

            // prime the empty list
            this.mediatorActions$.next((md) => []);

            this.stated$.next({ action: MessageTypes.InternalPreStart } as Messages.InternalPreStart);
            this.uiContext.sessionPreStart(this);

            this.start().then(() => observer.next(),
                (error) => {
                    this.stated$.error(error);
                    observer.error(error);
                }
            );

            return () => {
                subscription.unsubscribe();
                this.cleanup();
            };
        }).pipe(takeUntil(this.close$));
    }

    public addToMediatorStack(mediator: Mediators.BaseMediator<any>) {
        const clear = () => {
            this.mediatorActions$.next((mediators) => mediators.filter(_md => _md !== mediator));
        };
        this.mediatorActions$.next((md) => md.concat([mediator]));
        return clear;
    }

    protected connectToOutbound(pipe: Observable<{ method: string, params: any[] }>) {
        return new Promise((resolve, reject) => {
            const subscription = pipe.subscribe(result => {
                this.workflowConnection.callServerMethod(result.method, result.params).then(resolve, reject);
            });
            this.closeCleners.push(() => subscription.unsubscribe());
        });
    }

    isUserScreenLoaded(interactionId: string, mediatorStack: Mediators.BaseMediator<any>[]) {
        return mediatorStack
            .filter(mediator => mediator instanceof Mediators.UserScreenMediator)
            .filter((mediator: Mediators.UserScreenMediator) => mediator.interactionId === interactionId).length > 0;
    }

    onProtocalMessage(message: Messages.BaseMessage, mediators: Mediators.BaseMediator<any>[]) {
        console.log('onProtocalMessage', message);
        switch (message.action) {

            case MessageTypes.ShowMessageBox: {
                const mediator = new Mediators.MessageBoxMediator(this, message as Messages.ShowMessageBoxRequest);
                this.connectToOutbound(
                    this.uiContext.showMessageBox(mediator).pipe(
                        map((result) => !result || !result.isReply ? { dialogResult: DialogResult.Abort, isReply: true } : result),
                        catchError((error) => of({ dialogResult: DialogResult.Abort })),
                        map((result) => ({ method: 'MessageBoxResponse', params: [result.dialogResult] })))
                );
                return true;
            }
            case MessageTypes.ShowEChitScreenRequest: {
                const mediator = new Mediators.ShowEChitScreenMediator(this, message as Messages.ShowEChitScreenRequest);
                this.connectToOutbound(
                    this.uiContext.showEChitScreenScreen(mediator).pipe(
                        map((result) => !result || !result ? { dialogResult: DialogResult.Abort, isReply: true } : result),
                        catchError((error) => of({ dialogResult: DialogResult.Abort })),
                        map((result) => {
                            return ({ method: 'ShowEChitScreenResponse', params: [result.dialogResult, result['data']] });
                        }))
                );
                return true;
            }

            case MessageTypes.ShowOptionDialogBox: {
                const mediator = new Mediators.OptionDialogBoxMediator(this, message as Messages.ShowOptionDialogBoxRequest);
                this.connectToOutbound(
                    this.uiContext.showOptionDialogBox(mediator).pipe(
                        map((result) => !!result ? result : { dialogResult: DialogResult.Abort, checkedIndexes: [] }),
                        catchError((error) => of({ dialogResult: DialogResult.Abort, checkedIndexes: [] })),
                        map((result) => ({ method: 'OptionDialogResponse', params: [result.checkedIndexes, result.dialogResult] })))
                );
                return true;
            }

            case MessageTypes.ShowListLetterScreen: {
                const mediator = new Mediators.LinkedLettersMediator(this, message as Messages.ShowLinkedLettersScreenRequest);
                this.connectToOutbound(
                    this.uiContext.showLinkedLettersScreen(mediator).pipe(
                        map((result) => !!result ? result : { dialogResult: DialogResult.Abort, llCommandDto: null }),
                        tap(result => console.log('ShowListLetterScreen-Result', result)),
                        catchError((error) => of({ dialogResult: DialogResult.Abort, llCommandDto: null })),
                        map((result) => ({ method: 'ListLetterResponse', params: [result.llCommandDto, result.dialogResult] })))
                );
                return true;
            }

            case MessageTypes.ShowEmailRequest: {
                const mediator = new Mediators.ComposeEmailMediator(this, message as Messages.ShowEmailRequest);
                this.uiContext.showComposeEmailPopup(mediator);
                return true;
            }

            case MessageTypes.PlotSyncScreenRequest: {
                const mediator = new Mediators.PlotSyncMediator(this, message as Messages.PlotSyncScreenReques);
                this.uiContext.showPlotSyncPopup(mediator);
                return true;
            }

            case MessageTypes.ShowXMmenu: {
                this.uiContext.showXMmenu(this, message as Messages.ShowXMmenuRequest);
                return true;
            }

            case MessageTypes.ShowInputBox: {
                const mediator = new Mediators.InputBoxMediator(this, message as Messages.ShowInputBoxRequest);
                this.connectToOutbound(
                    this.uiContext.showInputBox(mediator).pipe(
                        map((result) => !!result ? result : { dialogResult: DialogResult.Abort, response: null }),
                        catchError((error) => of({ dialogResult: DialogResult.Abort, response: null })),
                        map((result) => ({ method: 'InputBoxResponse', params: [result.response, result.dialogResult] })))
                );
                return true;
            }

            case MessageTypes.ShowPostCodeMatchingPopup: {
                const mediator = new Mediators.PostCodeMatchingPopupMediator(this, message as Messages.ShowPostCodeMatchingPopupRequest);
                this.connectToOutbound(
                    this.uiContext.showPostCodeMatchingPopup(mediator).pipe(
                        map((result) => !!result ? result : { dialogResult: DialogResult.Abort, response: null }),
                        catchError((error) => of({ dialogResult: DialogResult.Abort, response: null })),
                        map((result) => ({ method: 'InputBoxResponse', params: [result.response, result.dialogResult] })))
                );
                return true;
            }

            case MessageTypes.ShowUserScreen: {
                if (this.isUserScreenLoaded((message as Messages.ShowUserScreen).interactionId, mediators)) {
                    return true;
                }

                const mediator = new Mediators.UserScreenMediator(this, message as Messages.ShowUserScreen,
                    this.workflowConnection.workflowStream);

                this.connectToOutbound(
                    this.uiContext.showUserScreen(mediator).pipe(
                        catchError((error) => of({})),
                        map((result) => ({ method: 'SendUserScreenCloseResponse', params: [] })))
                );
                return true;
            }

            case MessageTypes.LoadWebPage: {
                this.uiContext.loadWebpage((message as Messages.LoadWebPageMessage).url, null, null);
                return true;
            }

            case MessageTypes.ShowShareScreenRequest: {
                const mediator = new Mediators.ShareScreenMediator(this, message as Messages.ShowShareScreenRequest);
                this.connectToOutbound(this.uiContext.showShareScreen(mediator).pipe(
                    map((result) => !!result ? result : { dialogResult: DialogResult.Abort, result: {} as any }),
                    catchError((error) => of({ dialogResult: DialogResult.Abort, result: {} })),
                    map((res) => ({
                        method: 'ShowShareScreenResponse', params: [res.dialogResult, res.result.message,
                        res.result.reviewNote,
                        res.result.reviewDate,
                        res.result.selectedEmailList,
                        res.result.shareScreenOption]
                    }))));
                return true;
            }

            case MessageTypes.SessionComplete: {
                const tmp = message as Messages.SessionComplete;
                this.close(tmp.errorMessage);
                // if (!!tmp.errorMessage && tmp.errorMessage !== '') {
                //     this.uiContext.showError(tmp.errorMessage);
                // }
                return true;
            }

        }
        return false;
    }

    sendUserScreenResponse(ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean, command: UserScreenCommand) {
        // todo check retuen bool
        return this.workflowConnection.callServerMethod('SendUserScreenResponse', [ov, isDirty, isContactDirty, command]);
    }

    sendContactLinkedResponse(dialogResult: DialogResult, contactId: string, ov: Messages.IVarValue[],
        isDirty: boolean, isContactDirty: boolean) {
        // todo check retuen bool
        return this.workflowConnection.callServerMethod('SendContactLinkedResponse', [dialogResult, contactId, ov,
            isDirty, isContactDirty]);
    }

    private handleInteractionMessages(interactionId: string,
        handleTypes: Map<MessageTypes, (msg: Messages.BaseInteractionMessage) => void>) {
        return this.workflowConnection.workflowStream.pipe(
            filter((msg) => !!msg && !!msg.interactionId),
            filter(msg => msg.interactionId === interactionId),
            filter((msg) => Array.from(handleTypes.keys()).includes(msg.action)),
            take(1))
            .toPromise()
            .then((msg) => {
                handleTypes.get(msg.action)(msg);
            });
    }

    public sendScreenNavigationCommand(interactionId: string, ov: Messages.IVarValue[], isDirty: boolean,
        isContactDirty: boolean, command: UserScreenCommand): Promise<Messages.ShowUserScreen> {
        return new Promise((resolve, reject) => {
            const handleTypes = new Map<MessageTypes, (msg: Messages.BaseInteractionMessage) => void>();
            handleTypes.set(MessageTypes.ShowUserScreen, (msg: Messages.ShowUserScreen) => { resolve(msg); });
            handleTypes.set(MessageTypes.ScreenNavigationFail, (msg: Messages.ScreenNavigationFail) => { reject(msg.kind); });
            handleTypes.set(MessageTypes.CloseUserScreen, (msg: Messages.CloseUserScreen) => { reject('Closing'); });
            handleTypes.set(MessageTypes.FocusCurrentUserScreen, (msg: Messages.FocusCurrentUserScreen) => { reject(msg.reason); });
            this.handleInteractionMessages(interactionId, handleTypes)
                .catch(reject);
            this.sendUserScreenResponse(ov, isDirty, isContactDirty, command)
                .catch(reject);
        });
    }

    sendTabLogicCommand(interactionId: string, ov: Messages.IVarValue[], isDirty: boolean,
        isContactDirty: boolean): Promise<{ ov: Messages.IVarValue[] }> {
        return new Promise((resolve, reject) => {
            const handleTypes = new Map<MessageTypes, (msg: Messages.BaseInteractionMessage) => void>();
            handleTypes.set(MessageTypes.FocusCurrentUserScreen, (msg: Messages.FocusCurrentUserScreen) => { resolve({ ov: msg.ov }); });
            this.handleInteractionMessages(interactionId, handleTypes)
                .catch(reject);
            this.sendUserScreenResponse(ov, isDirty, isContactDirty, UserScreenCommand.TabLogic)
                .catch(reject);
        });
    }

    sendTabLogicPlotSyncCommand(interactionId: string, ov: Messages.IVarValue[], isDirty: boolean,
        isContactDirty: boolean): Promise<{ ov: Messages.IVarValue[] }> {
        return new Promise((resolve, reject) => {
            const handleTypes = new Map<MessageTypes, (msg: Messages.BaseInteractionMessage) => void>();
            handleTypes.set(MessageTypes.FocusCurrentUserScreen, (msg: Messages.FocusCurrentUserScreen) => { resolve({ ov: msg.ov }); });
            this.handleInteractionMessages(interactionId, handleTypes)
                .catch(reject);
            this.sendUserScreenResponse(ov, isDirty, isContactDirty, UserScreenCommand.PlotSync)
                .catch(reject);
        });
    }

    public sendContactSavecreenCommand(interactionId: string, ov: Messages.IVarValue[],
        isDirty: boolean, isContactDirty: boolean): Promise<{ newContactId: string, ov: Messages.IVarValue[] }> {
        return new Promise((resolve, reject) => {
            const handleTypes = new Map<MessageTypes, (msg: Messages.BaseInteractionMessage) => void>();
            handleTypes.set(MessageTypes.ContactSavedAcknowledge, (msg: Messages.ContactMergeRespose) => {
                resolve({ newContactId: msg.contactId, ov: msg.ov });
            });

            handleTypes.set(MessageTypes.FocusCurrentUserScreen, (msg: Messages.FocusCurrentUserScreen) => {
                reject(msg.reason);
            });

            this.handleInteractionMessages(interactionId, handleTypes)
                .catch(reject);
            this.sendUserScreenResponse(ov, isDirty, isContactDirty, UserScreenCommand.SaveNewContact)
                .catch(reject);
        });
    }

    public sendContactScreenResponse(interactionId: string, dialogResult: DialogResult,
        contactId: string, ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean): Promise<{ ov: Messages.IVarValue[] }> {

        return new Promise((resolve, reject) => {

            const handleTypes = new Map<MessageTypes, (msg: Messages.BaseInteractionMessage) => void>();
            handleTypes.set(MessageTypes.ContactLinkedAcknowledge, (msg: Messages.ContactMergeRespose) => { resolve({ ov: msg.ov }); });
            handleTypes.set(MessageTypes.FocusCurrentUserScreen, (msg: Messages.FocusCurrentUserScreen) => { reject({ ov: msg.reason }); });

            this.handleInteractionMessages(interactionId, handleTypes)
                .catch(reject);

            this.sendContactLinkedResponse(dialogResult, contactId, ov, isDirty,
                isContactDirty)
                .catch(reject);
        });
    }

    public sendContactSearchScreenCommand<TResult, TCustomData>(interactionId: string, ov: Messages.IVarValue[],
        isDirty: boolean, isContactDirty: boolean,
        parameters: Messages.SearchParameters, columns: Messages.SearchColumn,
        command: UserScreenCommand.SearchContacts | UserScreenCommand.SearchContactsOnFile,
        callBackData?: TCustomData):
        Promise<{ mediator: Mediators.ContactSearchMediator, result: Observable<TResult> }> {

        return new Promise((resolve, reject) => {

            const showContactSearchScreen = (message: Messages.ShowContactSearchScreen) => {
                const mediator = new Mediators.ContactSearchMediator(this, message);
                const result = this.uiContext.showContactSearchScreen<TResult, TCustomData>(mediator, callBackData);
                return { mediator, result };
            };

            const handleTypes = new Map<MessageTypes, (msg: Messages.BaseInteractionMessage) => void>();

            handleTypes.set(MessageTypes.ShowContactSearchScreen, (msg: Messages.ShowContactSearchScreen) => {
                resolve(showContactSearchScreen(msg));
            });

            //
            handleTypes.set(MessageTypes.ShowContactSearchScreenOnFile, (msg: Messages.ShowContactSearchScreen) => {
                resolve(showContactSearchScreen(msg));
            });

            handleTypes.set(MessageTypes.FocusCurrentUserScreen, (msg: Messages.FocusCurrentUserScreen) => { reject({ ov: msg.reason }); });

            this.handleInteractionMessages(interactionId, handleTypes)
                .catch(reject);

            this.sendUserScreenResponse(ov, isDirty, isContactDirty, command)
                .catch(reject);
        });
    }

    close(error = null) {
        console.log('%c Executed session closed' + this.workflowConnection.instanceId, 'color:blue;');
        this.cleanup();
        if (error) {
            this.close$.error(error);
        } else {
            this.close$.next();
        }
        this.close$.complete();
    }

    afterClose() {
        return this.close$;
    }

    cleanup() {
        this.closeCleners.forEach((cleaner) => {
            try {
                cleaner();
            } catch (error) {
                console.warn(error);
            }
        });
        this.workflowConnection.close();
        this.mediatorActions$.next((mediators) => {
            mediators.slice().forEach(mediator => mediator.discardWithError('session closed'));
            return [];
        });
    }

    abstract getType(): SessionTypes;
    abstract getInput(): any;

}
