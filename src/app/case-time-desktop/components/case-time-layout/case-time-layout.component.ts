import { PageEvent } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatterInfo } from '../../../core/lib/matter';
import { ViewChangeKind } from '../../../case-time-core/actions/core';
import { TimeItemWrapper } from '../../../time-core/models/interface';
import { GridButton } from '../../../case-time-core/models/enum';
import { ColumnDef } from '../../../core/lib/grid-model';
import { onCheckTimeType, AddTimeType } from '../../../core/lib/timeRecord';

@Component({
  selector: 'dps-case-time-layout',
  templateUrl: './case-time-layout.component.html',
  styleUrls: ['./case-time-layout.component.scss']
})
export class CaseTimeLayoutComponent {

  constructor() {

  }
  @Input() fontSizeClass: string;
  @Input()
  matterInfo: MatterInfo;
  @Input()
  token: string;
  @Input()
  caseTimeData: any;
  @Input()
  public pageInfo: any;
  @Input()
  public columnDef: ColumnDef[];
  pageSizeOptions = [25, 50, 100];

  @Output() rowChange = new EventEmitter<any>();
  @Output() viewChange = new EventEmitter();
  @Output() gridButton = new EventEmitter<{ kind: GridButton, row: TimeItemWrapper }>();

  get filterColumnDef(): ColumnDef[] {
    if (this.columnDef && this.matterInfo
      && onCheckTimeType(this.matterInfo.AppCode, this.matterInfo.eBilling, this.matterInfo.isLegalAid) !== AddTimeType.CrimeTime) {
      return this.columnDef.map(i => {
        if (i.fieldName === 'usUnits' || i.fieldName === 'usRate') {
          return { ...i, extras: {...i.extras, hidden: true} };
        }
        return i;
      });
    }
    return this.columnDef;
  }

  onSelectRow(item) {
    this.rowChange.emit(item);
  }
  onViewChange(event) {
    this.viewChange.emit(event);
  }

  onPageChange(pageEvent: PageEvent) {
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  }

  onEditTimeClick(info: { kind: GridButton, row: TimeItemWrapper }) {
    this.gridButton.emit(info);
  }

}
