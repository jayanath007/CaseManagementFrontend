import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { ProgressSteps } from '../../models/enums';
import { TemplateProsessingState } from '../../models/template-prosessing-state';
import { DialogResult, SessionTypes, FileLogicTypes } from '../../../workflow-core';

@Component({
  selector: 'dps-workflow-progress',
  templateUrl: './workflow-progress.component.html',
  styleUrls: ['./workflow-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowProgressComponent implements OnInit {

  ProgressSteps = ProgressSteps;
  DialogResult = DialogResult;
  SessionTypes = SessionTypes;
  FileLogicTypes = FileLogicTypes;

  @Input() state: TemplateProsessingState;
  @Input() type: SessionTypes;
  @Input() workerInput: any;
  @Output() openDocument = new EventEmitter();
  @Output() confirmSave = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

  onOpenDocument() {
    this.openDocument.emit();
  }

  onConfirmSaveToDiary(response: DialogResult) {
    if (this.state.getState() === 96) {
      return;
    }
    this.confirmSave.emit(response);
  }

}
