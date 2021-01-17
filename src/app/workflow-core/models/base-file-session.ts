import {
  scan,
  mergeMap,
  map,
  refCount,
  withLatestFrom,
  switchMap,
  catchError,
  publishReplay,
} from 'rxjs/operators';
import { NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Subject,
  Observable,
  empty,
  of,
  throwError as _throw,
  BehaviorSubject,
  merge
} from 'rxjs';
import { AuthInfoStateService } from '../../auth';
import { UIContext } from './ui-context';
import { BaseSessionManager } from './base-session-manager';
import { BaseWorkflowSession } from './base-workflow-session';
import { TemplateSession } from './template-session';
import { ScreenSession } from './screen-session';
import { FileLogicSession } from './file-logic-session';
import { FileLogicTypes, FileLogicStatus } from './enums';
import { MatterSearchGridData } from './../../core/lib/matter';
import { FormLibraryTemplateInfo } from '../../workflow-menu-core/models/interfaces';

export class BaseFileSession {
  private currentWorker$: Observable<BaseWorkflowSession>;
  protected workerStateChange$ = new Subject<(worker: BaseWorkflowSession) => BaseWorkflowSession>();
  private workerRoot;
  private entryLogicStatus$ = new BehaviorSubject<FileLogicStatus>(
    FileLogicStatus.NotStarted
  );
  private exitLogicStatus$ = new BehaviorSubject<FileLogicStatus>(
    FileLogicStatus.NotStarted
  );

  constructor(
    protected appId: number,
    protected fileId: number,
    protected branchId: number,
    protected uiContext: UIContext,
    protected manager: BaseSessionManager<BaseFileSession>,
    private zone: NgZone,
    private httpClient: HttpClient,
    protected auth: AuthInfoStateService,
    private hubUrl: string,
  ) {
    this.currentWorker$ = this.workerStateChange$.pipe(
      scan<(worker: BaseWorkflowSession) => BaseWorkflowSession, BaseWorkflowSession>((oldworker, action) => {
        return action(oldworker);
      }, null),
      publishReplay(1),
      refCount()
    );

    // prime the observable
    this.workerRoot = this.currentWorker$.subscribe(worker => { });
    this.workerStateChange$.next(_ => null);
  }

  get worker() {
    return this.currentWorker$;
  }

  get entryLogicStatus() {
    return this.entryLogicStatus$;
  }

  get exitLogicStatus() {
    return this.exitLogicStatus$;
  }

  protected fileLogicEnabled(logic: FileLogicTypes) {
    return this.uiContext.getCommonTemplateMetadata().pipe(
      map(result => {
        const myVal = result.find(item => item.appId === this.appId);
        if (myVal) {
          if (logic === FileLogicTypes.EntryLogic) {
            return myVal.isFileEntryLogicExists;
          } else if (logic === FileLogicTypes.ExitLogic) {
            return myVal.isFileExitLogicExists;
          }
        }
        return true;
      })
    );
  }

  public init() {
    console.log(
      'File session initialise',
      this.appId,
      this.fileId,
      this.branchId,
      this.uiContext
    );
    this.manager.addSession(this.appId, this.fileId, this.branchId, this);
  }

  public destroy() {
    this.manager.removeSession(this.appId, this.fileId, this.branchId);
    if (this.workerRoot) {
      this.workerRoot.unsubscribe();
    }
  }

  // to set arbitary status
  protected setFileLogicStatus(logic: FileLogicTypes, status: FileLogicStatus) {
    if (logic === FileLogicTypes.EntryLogic) {
      this.entryLogicStatus$.next(FileLogicStatus.Started);
      this.entryLogicStatus$.next(status);
    } else if (logic === FileLogicTypes.ExitLogic) {
      this.exitLogicStatus$.next(FileLogicStatus.Started);
      this.exitLogicStatus$.next(status);
    }
  }

  private runFileLogicIfEnabled(
    logic: FileLogicTypes,
    notifier: Subject<FileLogicStatus>
  ) {
    return this.fileLogicEnabled(logic).pipe(
      mergeMap(enabled => {
        if (enabled) {
          return this.runFileLogic(logic, notifier);
        } else {
          return Observable.create(observer => {
            notifier.next(FileLogicStatus.Started);
            notifier.next(FileLogicStatus.Success);
            observer.next({});
            observer.complete();
          });
        }
      })
    );
  }

  private runFileLogic(
    logic: FileLogicTypes,
    notifier: Subject<FileLogicStatus>
  ) {
    return Observable.create(observer => {
      notifier.next(FileLogicStatus.Started);

      const session = this.handleNewWorker(
        new FileLogicSession(
          this.zone,
          this.httpClient,
          () => this.auth.acquireDpsWebServiceToken(),
          this.hubUrl,
          this.appId,
          this.fileId,
          this.branchId,
          logic,
          this.uiContext
        )
      );

      const success = session.onSucess().subscribe(() => {
        notifier.next(FileLogicStatus.Success);
      });
      const rope = session.holdUntilComplete().subscribe(
        data => observer.next(data),
        error => {
          notifier.next(FileLogicStatus.Faild);
          observer.error(error);
        },
        () => observer.complete()
      );

      return () => {
        success.unsubscribe();
        rope.unsubscribe();
      };
    });
  }

  runEntryLogic() {
    return of(true).pipe(
      withLatestFrom(this.entryLogicStatus$, (_, run) => run),
      switchMap(status => {
        if (status === FileLogicStatus.NotStarted) {
          return this.runFileLogicIfEnabled(
            FileLogicTypes.EntryLogic,
            this.entryLogicStatus$
          );
        } else {
          return _throw('Already executed');
        }
      }),
      catchError(error => this.uiContext.showError(error))
    );
  }

  runExitLogic() {
    return of(true).pipe(
      withLatestFrom(this.entryLogicStatus$, (_, run) => run),
      switchMap(status => {
        if (status === FileLogicStatus.Success) {
          return this.runFileLogicIfEnabled(
            FileLogicTypes.ExitLogic,
            this.exitLogicStatus$
          );
        } else if (status === FileLogicStatus.Faild) {
          return _throw('File open logic was interrupted');
        } else {
          return _throw('File open logic pending');
        }
      }),
      catchError(error => this.uiContext.showError(error))
    );
  }

  runTempate(templateId, templateDescription, formLibInfo?: FormLibraryTemplateInfo) {
    return this.handleNewWorker(
      new TemplateSession(
        this.zone,
        this.httpClient,
        () => this.auth.acquireDpsWebServiceToken(),
        this.hubUrl,
        this.appId,
        this.fileId,
        this.branchId,
        templateId,
        templateDescription,
        this.uiContext,
        formLibInfo ? formLibInfo.isFormLibraryTemplate : false,
        formLibInfo ? formLibInfo.formLibraryTemplatePath : null,
      )
    );
  }

  runScreen(screenId: string, appId: number) {
    return this.handleNewWorker(
      new ScreenSession(
        this.zone,
        this.httpClient,
        () => this.auth.acquireDpsWebServiceToken(),
        this.hubUrl,
        this.appId,
        this.fileId,
        this.branchId,
        screenId,
        this.uiContext
      )
    );
  }

  handleNewWorker(worker: BaseWorkflowSession) {
    const mutation = (oldworker: BaseWorkflowSession) => {
      if (oldworker) {
        oldworker.close();
      }
      worker
        .afterClose()
        .pipe(catchError(error => of(error)))
        .subscribe(() => {
          if (!oldworker || oldworker === worker) {
            this.workerStateChange$.next(_old => null);
          }
        });
      return worker;
    };
    this.workerStateChange$.next(mutation);
    return worker;
  }

  runWorkflowCommand(data, title: string, materData?: MatterSearchGridData, formLibInfo?: FormLibraryTemplateInfo) {

    return of(true).pipe(
      withLatestFrom(this.entryLogicStatus$, (_, run) => run),
      switchMap(status => {
        if (status === FileLogicStatus.Success) {
          if (data.atN_Type === 4) {
            return this.runTempate(data.atN_Command, data.atN_Desc, formLibInfo)
              .holdUntilComplete()
              .pipe(catchError(error => this.uiContext.showError(error)));

          } else if (data.atN_Type === 2) {
            return this.runScreen(data.atN_Command, data.atN_AppID)
              .holdUntilComplete()
              .pipe(catchError(error => this.uiContext.showError(error)));
            // const session = this.runScreen(data.atN_Command, data.atN_AppID);
            // return merge(session.holdUntilComplete(), this.handleLinkedMatterVarsSync(data, session, materData, title))
            //   .pipe(catchError(error => this.uiContext.showError(error)));
          }
        } else if (status === FileLogicStatus.Faild) {
          return _throw('File opne logic was interrupted');
        } else {
          return _throw('File opne logic pending');
        }
      })
    );
  }

  handleLinkedMatterVarsSync(data, session: BaseWorkflowSession, matterData: MatterSearchGridData, title: string) {
    return session.onCommunicationEnd().pipe(
      switchMap(msg => {
        // Skip sync  popup on error
        if (msg.errorMessage && msg.errorMessage !== '') {
          return empty();
        }
        return this.uiContext.showLinkedMatterSyncPopup(data, matterData, title);
      })
    );
  }
}
