import { Component, OnInit, OnDestroy, ChangeDetectorRef, ApplicationRef } from '@angular/core';
import { UIContext } from '../../workflow-core';
import { GenericUiContextService } from '../services/generic-ui-context.service';
import { FileSessionService } from '../services/file-session.service';
import { Injector } from '@angular/core';
import { TemplateProsessingState } from '../models/template-prosessing-state';
import { DialogResult, SessionTypes, FileLogicTypes } from '../../workflow-core';
import { ProgressSteps } from '../models/enums';

@Component({
  selector: 'dps-file-session',
  template: `
    <dps-workflow-progress *ngIf="progressState && progressState.getState() != ProgressSteps.Invisible &&
    ((sessionService.worker | async)?.getType() === SessionTypes.Templete ||
    (sessionService.worker | async)?.getType() === SessionTypes.FileLogic &&
     (sessionService.worker | async)?.getInput()?.logicType ===  FileLogicTypes.EntryLogic)"
    [type]="(sessionService.worker | async)?.getType()"
    [workerInput]="(sessionService.worker | async)?.getInput()"
    [state]="progressState"
      (openDocument)="onOpenDocument()"
      (confirmSave)="onConfirmSaveToDiary($event)" ></dps-workflow-progress>
    <dps-screen-backdrop *ngIf="progressState && progressState.getState() != ProgressSteps.Invisible &&
    (sessionService.worker | async)?.getType() === SessionTypes.Screen"></dps-screen-backdrop>
    `,
  styles: [],
  providers: [
    FileSessionService,
    GenericUiContextService
  ]
})
export class FileSessionComponent implements OnInit, OnDestroy {

  public progressState: TemplateProsessingState;
  public SessionTypes = SessionTypes;
  public ProgressSteps = ProgressSteps;
  public FileLogicTypes = FileLogicTypes;

  constructor(private injector: Injector, public sessionService: FileSessionService,
    private cdRef: ChangeDetectorRef,
    private uiContext: GenericUiContextService,
    private appRef: ApplicationRef) {

    this.sessionService.progressState.subscribe((state) => {
      this.updateUi(state);
    }, () => {
      this.updateUi(null);
    });
  }

  private updateUi(state) {
    this.progressState = state;
    console.log('%cWorkflow worker change', state);
    this.cdRef.markForCheck();
  }

  ngOnInit() {
    this.sessionService.init();
  }

  ngOnDestroy(): void {
    this.sessionService.destroy();
  }

  onOpenDocument() {
    this.uiContext.openCurrentDocument();
  }

  onConfirmSaveToDiary(response: DialogResult) {
    this.uiContext.confirmSave.next(response);
  }

}
