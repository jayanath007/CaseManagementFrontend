
import { catchError, switchMap, scan, tap, map, withLatestFrom } from 'rxjs/operators';
import { Injectable, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';




import { of, merge } from 'rxjs';

import { APP_ID, BRANCH_ID, FILE_ID } from '../../core/lib/workflow-tokens';
import {
  BaseFileSession, BaseMediator,
  MessageTypes, FileLogicTypes, FileLogicStatus, SaveToDiaryConfirmationRequest
} from '../../workflow-core';
import { WorkflowSessionManagerService } from './workflow-session-manager.service';

import { AuthInfoStateService } from '../../auth';

import { AppConfig } from '../../core/configs/app-config';
import { ProgressSteps } from '../models/enums';
import { TemplateProsessingState } from '../models/template-prosessing-state';
import { GenericUiContextService } from './generic-ui-context.service';
import { Store } from '@ngrx/store';

@Injectable()
export class FileSessionService extends BaseFileSession {

  public progressState;

  constructor(@Inject(APP_ID) appId: number, @Inject(BRANCH_ID) branchId: number,
    @Inject(FILE_ID) fileId: number, sessionManager: WorkflowSessionManagerService, uiContext: GenericUiContextService,
    zone: NgZone, httpClient: HttpClient, auth: AuthInfoStateService, config: AppConfig) {
    super(appId, fileId, branchId, uiContext, sessionManager, zone, httpClient, auth, config.workflowStreamingUrl);
    this.progressState = this.createProgressState();
  }

  public skipEntryLogic() {
    this.setFileLogicStatus(FileLogicTypes.EntryLogic, FileLogicStatus.Success);
  }

  public skipExitLogic() {
    this.setFileLogicStatus(FileLogicTypes.ExitLogic, FileLogicStatus.Success);
  }

  private createProgressState() {
    return this.worker.pipe(switchMap((worker) => {
      if (!!worker) {

        const inbound = worker.stateChange.pipe(map(({ message, mediators }) => {
          return { messageType: message.action, mediators, isEditableDocx: message.isEditableDocx };
        }));

        const outbound = (this.uiContext as GenericUiContextService).documetLoaded.pipe(
          withLatestFrom(worker.stateChange, (_, state) => ({
            messageType: 'DOCUMENT_READY', mediators: state.mediators,
            isEditableDocx: false
          })));

        return merge(inbound, outbound).pipe(
          map(({ messageType, mediators, isEditableDocx }) => {
            const waitingForInput = (mediators as BaseMediator<any>[]).some((md) => md.waitingForInput());
            return { messageType, waitingForInput, mediators, isEditableDocx };
          }), catchError(() => of(null)));
      }
      return of(null);
    }), scan((oldState: TemplateProsessingState, info: {
      messageType: MessageTypes | 'DOCUMENT_READY',
      waitingForInput: boolean,
      isEditableDocx: boolean
    }) => {
      console.log('workflow state scan', info);

      if (info) {

        if (info.messageType === MessageTypes.InternalPreStart) {
          return new TemplateProsessingState(ProgressSteps.Started);
        }

        if (oldState.isCurrentState(ProgressSteps.Invisible)) {
          return oldState;
        }

        switch (info.messageType) {
          case MessageTypes.WorkerReady:
            {
              return oldState.continue(ProgressSteps.Processing, info.waitingForInput);
            }
          case 'DOCUMENT_READY':
            {
              return oldState.continue(ProgressSteps.ViewDoc, info.waitingForInput);
            }
          case MessageTypes.SaveToDiaryConfirmation:
            {
              const st = ProgressSteps.SaveConfirm | ProgressSteps.EditDoc;
              return oldState.continue(info.isEditableDocx ? st : ProgressSteps.SaveConfirm, info.waitingForInput);
            }
          case MessageTypes.SessionComplete: {
            return oldState.continue(ProgressSteps.Invisible, false);
          }
        }

        return oldState.continue(oldState.currentState, info.waitingForInput);
      }
      return new TemplateProsessingState();
    }, new TemplateProsessingState()
    ), catchError(() => of(new TemplateProsessingState())),
      tap((info) => { console.log('Workflow progress state', info); }));
  }
}
