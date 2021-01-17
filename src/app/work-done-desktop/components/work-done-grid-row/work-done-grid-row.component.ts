import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { GridData, GridButtonAction, SelectedInfo, GroupMode } from '../../../work-done-core/models/interfce';
import { GridButtonType } from '../../../work-done-core/models/enumeration';

import { ColumnDef } from '../../../core/lib/grid-model';

@Component({
  selector: 'dps-work-done-grid-row',
  templateUrl: './work-done-grid-row.component.html',
  styleUrls: ['./work-done-grid-row.component.scss']
})
export class WorkDoneGridRowComponent implements OnInit {



  @Output() rowExpand = new EventEmitter<GridData>();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();



  @Input() gridData: GridData[];
  @Input() expandedRow: GridData;
  @Input() homeCurrancy;
  @Input() searchText: string;
  @Input() selectedInfo: SelectedInfo;
  @Input() columnDef: ColumnDef[];
  @Input() selectedGroup: GroupMode;

  groupMode = GroupMode;

  constructor() { }

  ngOnInit() {
  }


  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index]
      && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onOpenDocument(event: Event, item: GridData) {
    if (item.letter_icon) {
      event.stopPropagation();
      this.rowExpand.emit(item);
      this.clickGridButton.emit({ kind: GridButtonType.viewDocument, value: item });
    }
  }
  public onClickGridButton(action: GridButtonAction) {
    this.clickGridButton.emit(action);
  }

  public gridRowExpan(row: GridData, event: MouseEvent): void {
    event.preventDefault();
    this.rowExpand.emit(row);
    this.onCloseViewer();
  }

  onCloseViewer() {
    const action: GridButtonAction = { kind: GridButtonType.closeViewer, value: null };
    this.clickGridButton.emit(action);
  }

}
