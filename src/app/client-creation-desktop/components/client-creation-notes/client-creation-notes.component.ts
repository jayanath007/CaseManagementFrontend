import { ClientNoteModel } from '../../../client-creation-core/models/interfaces';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent, MatDialog } from '@angular/material';
import { ColumnDef } from '../../../core/lib/grid-model';
import { createDefultColumnDef } from '../../../core/lib/grid-helpers';
import { DropdownListData } from '../../../core';
import { ConfirmDialogComponent, ConfirmDialogData, ConfirmDialogResultKind } from '../../../shared';

@Component({
  selector: 'dps-client-creation-notes',
  templateUrl: './client-creation-notes.component.html',
  styleUrls: ['./client-creation-notes.component.scss']
})
export class ClientCreationNotesComponent implements OnInit {

  constructor(private dialog: MatDialog) { }
  @Input() rowData: ClientNoteModel[];
  @Input() isEnable: boolean;
  @Input() feeEarnerList: DropdownListData[];
  @Output() addNewNote = new EventEmitter();
  @Output() changeNote = new EventEmitter<{ kind: string, row: number; value: any }>();
  @Output() deleteNote = new EventEmitter<number>();
  @Output() cancelChanges = new EventEmitter();
  columnDef: ColumnDef[];
  selectIndex: number;

  ngOnInit() {
    this.columnDef =
      [
        createDefultColumnDef('Date', { label: 'Date', fxFlex: '130px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('By', { label: 'By', fxFlex: '300px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Note', { label: 'Note', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Delete', { label: '', fxFlex: '50px', filterAnchor: 'end', filterHidden: true }),
      ];
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index].extras.fxFlex;
  }

  onRowClick(rowIndex: number) {
    this.selectIndex = rowIndex;
  }

  add() {
    this.addNewNote.emit();
    this.selectIndex = 0;
  }

  onByChanged(item, row: number) {
    this.changeNote.emit({ kind: 'BY', row: row, value: item });
  }

  onChangeDate(event: MatDatepickerInputEvent<Date>, row: number) {
    this.changeNote.emit({ kind: 'DATE', row: row, value: event.value });
  }

  onNoteChange(event, row: number) {
    this.changeNote.emit({ kind: 'NOTE', row: row, value: event.target.value });
  }

  onDelete(row: number) {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Delete Note . . .',
        message: '<p>Are you sure you want to delete the selected row?</p>',
        acceptLabel: 'Yes',
        rejectLabel: 'No'
      },
      contentParams: {},
      data: null
    };
    this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '600px',
      disableClose: true,
      panelClass: 'dps-notification',
      hasBackdrop: true,
    }).afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
        this.deleteNote.emit(row);
      }
    });
  }
  reset() {
    this.cancelChanges.emit();
  }

}
