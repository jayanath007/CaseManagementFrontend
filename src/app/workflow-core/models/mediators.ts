
import { take, merge, filter, delay, takeUntil } from 'rxjs/operators';
import { BaseMessage } from './remote-messages';
import { BaseWorkflowSession } from './base-workflow-session';
import { Subject, Observable } from 'rxjs';
import * as Messages from './remote-messages';
import { MessageTypes, UserScreenCommand, DialogResult } from './enums';

export abstract class BaseMediator<TMessage extends BaseMessage> {

    protected _lifecycleController = new Subject<any>();

    protected _lifecycle: Observable<BaseMessage> = new Subject().pipe(
        merge(this._lifecycleController));

    protected destroyCleners = [];

    constructor(protected session: BaseWorkflowSession, protected message: TMessage) {
        this.destroyCleners.push(this.session.addToMediatorStack(this));
    }

    ready(): Promise<TMessage> {
        return new Promise((resolve, reject) => {
            resolve(this.message);
        });
    }

    discardWithError(error) {
        this._lifecycleController.error(error);
        this.destroy();
    }

    get lifecycle() {
        return this._lifecycle;
    }

    destroy() {
        this.destroyCleners.forEach((cleaner) => {
            try {
                cleaner();
            } catch (error) {
                console.warn(error);
            }
        });
    }

    public waitingForInput() {
        return true;
    }

    // public isEditableDocx() {
    //     return false;
    // }

}

export class MessageBoxMediator extends BaseMediator<Messages.ShowMessageBoxRequest> {

}

export class UserScreenMediator extends BaseMediator<Messages.ShowUserScreen> {
    constructor(protected session: BaseWorkflowSession, protected message: Messages.ShowUserScreen,
        private workflowStream: Observable<Messages.BaseInteractionMessage>) {
        super(session, message);
    }

    get lifecycle(): Observable<any> {
        const myMessages = this.workflowStream.pipe(filter((msg) => !!msg && !!msg.interactionId),
            filter(msg => msg.interactionId === this.interactionId));
        const complete = myMessages.pipe(filter(msg => msg.action === MessageTypes.CloseUserScreen), delay(500));
        return myMessages.pipe(takeUntil(complete)).pipe(merge(this._lifecycle));
    }

    onClose() {
        return new Promise((resolve, reject) => {
            this.workflowStream.pipe(filter((msg) => !!msg && !!msg.interactionId),
                filter(msg => msg.interactionId === this.interactionId),
                filter(msg => msg.action === MessageTypes.CloseUserScreen),
                take(1))
                .toPromise()
                .then(() => {
                    console.log('Closing the screen popup');
                    resolve();
                });
        });
    }

    get interactionId() {
        return this.message.interactionId;
    }

    public previous(ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean): Promise<Messages.ShowUserScreen> {
        return this.session.sendScreenNavigationCommand(this.interactionId, ov, isDirty, isContactDirty, UserScreenCommand.PreviousScreen);
    }

    public next(ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean): Promise<Messages.ShowUserScreen | boolean> {
        return this.session.sendScreenNavigationCommand(this.interactionId, ov, isDirty, isContactDirty, UserScreenCommand.NextScreen);
    }

    public exit(ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean) {
        // Changed by Eranda
        return new Promise<boolean>((resolve, reject) => {
            this.session.sendScreenNavigationCommand(this.interactionId, ov, isDirty, isContactDirty, UserScreenCommand.Exit)
                .then(() => resolve(true), (error) => error === 'Closing' ? resolve(true) : reject(error));
        });
    }

    public tabLogic(ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean) {
        return this.session.sendTabLogicCommand(this.interactionId, ov, isDirty, isContactDirty);
    }

    public tabLogicPlotSync(ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean) {
        return this.session.sendTabLogicPlotSyncCommand(this.interactionId, ov, isDirty, isContactDirty);
    }

    public saveContact(ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean): Promise<any> {
        return this.session.sendContactSavecreenCommand(this.interactionId, ov, isDirty, isContactDirty);
    }

    public sendLinkedContact(contactId: string, ov: Messages.IVarValue[],
        isDirty: boolean, isContactDirty: boolean): Promise<{ ov: Messages.IVarValue[] }> {
        return this.session.sendContactScreenResponse(this.interactionId, DialogResult.Ok, contactId, ov, isDirty, isContactDirty);
    }

    public showContactsSearch<TResult, TCallbackData>(ov: Messages.IVarValue[], isDirty: boolean, isContactDirty: boolean,
        parameters: Messages.SearchParameters, columns: Messages.SearchColumn,
        command: UserScreenCommand.SearchContacts | UserScreenCommand.SearchContactsOnFile,
        callBackData?: TCallbackData
    ) {
        return this.session.sendContactSearchScreenCommand<TResult, TCallbackData>(this.interactionId, ov, isDirty,
            isContactDirty, parameters, columns, command, callBackData);
    }

    public abortContactScreen() {
        return this.session.sendContactScreenResponse(this.interactionId, DialogResult.Abort, null, null, false, false);
    }

    public createNewContact() {
        return this.session.sendContactScreenResponse(this.interactionId, DialogResult.No, null, null, false, false);
    }

}

export class InputBoxMediator extends BaseMediator<Messages.ShowInputBoxRequest>  {

}

export class PostCodeMatchingPopupMediator extends BaseMediator<Messages.ShowPostCodeMatchingPopupRequest>  {

}


export class OptionDialogBoxMediator extends BaseMediator<Messages.ShowOptionDialogBoxRequest>  {

}

export class ConfirmSaveDiaryMediator extends BaseMediator<any>  {

}

export class ContactSearchMediator extends BaseMediator<Messages.ShowContactSearchScreen>  {

}

export class DiaryScreenMediator extends BaseMediator<Messages.ShowDiaryScreenRequest>  {

}

export class ShowEChitScreenMediator extends BaseMediator<Messages.ShowEChitScreenRequest>  {

}


export class ComposeEmailMediator extends BaseMediator<Messages.ShowEmailRequest> {

}

export class PlotSyncMediator extends BaseMediator<Messages.PlotSyncScreenReques> {

}

export class LinkedLettersMediator extends BaseMediator<Messages.ShowLinkedLettersScreenRequest> {

}

export class LinkedLettersSaveConfirmMediator extends BaseMediator<Messages.ShowListLetterSaveButtonRequest> {

}

export class ShareScreenMediator extends BaseMediator<Messages.ShowShareScreenRequest> {

}

export class SaveToDiaryConfirmation extends BaseMediator<Messages.SaveToDiaryConfirmationRequest> {

}

export class CDS7ReportScreenMediator extends BaseMediator<Messages.CDS7ReportDialogBoxRequest>  {

}

