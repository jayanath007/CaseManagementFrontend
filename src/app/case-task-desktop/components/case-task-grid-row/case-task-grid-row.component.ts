import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { TaskItemWrapper } from '../../../case-task-core';
import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-case-task-grid-row',
  templateUrl: './case-task-grid-row.component.html',
  styleUrls: ['./case-task-grid-row.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseTaskGridRowComponent implements OnInit {

  constructor() { }

  @Input() rowData: TaskItemWrapper;
  @Input() columnDef: ColumnDef[];

  ngOnInit() {
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index].extras.fxFlex;
  }
}
