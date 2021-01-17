import { PageEvent } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatterInfo } from '../../../core/lib/matter';
import { ViewChangeKind } from '../../../case-task-core/actions/core';
import { CaseTaskViewState } from '../../../case-task-core';

@Component({
  selector: 'dps-case-task-layout',
  templateUrl: './case-task-layout.component.html',
  styleUrls: ['./case-task-layout.component.scss']
})
export class CaseTaskLayoutComponent implements OnInit {

  constructor() {

  }
  @Input() fontSizeClass: string;
  @Input()
  matterInfo: MatterInfo;
  @Input()
  token: string;
  @Input()
  caseTaskData: CaseTaskViewState;
  @Input()
  public pageInfo: any;
  @Input()
  public columnDef: any;
  pageSizeOptions = [25, 50, 100];


  @Output() rowChange = new EventEmitter();
  @Output() viewChange = new EventEmitter();
  @Output() addEditTaskOut = new EventEmitter();

  selectRow(event) {
    this.rowChange.emit(event);
  }

  onViewChange(event) {
    this.viewChange.emit(event);
  }

  onPageChange(pageEvent: PageEvent) {
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  }

  ngOnInit() {

  }
  onAddEditTaskOut(event) {
    this.addEditTaskOut.emit(event);
  }

}
