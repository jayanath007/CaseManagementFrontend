import { State } from '../../../../add-note-core/reducers/add-note';
import { ScreenDesingnerState } from '../../../../screen-desingner-core/reducers/screen-desingner';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';
import { ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';
import { MatDialog } from '@angular/material';
import { ConfirmDialogData, ConfirmDialogComponent } from '../../../../shared';

@Component({
  selector: 'dps-align-fields',
  templateUrl: './align-fields.component.html',
  styleUrls: ['./align-fields.component.scss']
})
export class AlignFieldsComponent implements OnInit, OnChanges {

  space = 5;

  @Input()
  selectedContanerComponent;

  @Input()
  screenDesingnerState;

  @Input()
  masageCount;

  @Output()
  onComponentChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();


  onItemChange(event) {
    this.onComponentChange.emit(event);
  }

  leftalignControl() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.LeftAlignController, row: null, value: null });

  }
  // this.saveComponentListSate();
  leftalign() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.LeftAlign, row: null, value: null });
  }

  rightalign() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.RightAlign, row: null, value: null });
  }

  topAign() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.TopAlign, row: null, value: null });
  }

  bottomAlign() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.BottomAlign, row: null, value: null });
  }

  centeralign() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.CenterAlign, row: null, value: null });
  }

  arrangeSpaces() {
    this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.ArrangeSpace, row: null, value: this.space });
  }

  increaseSpace() {
    if (this.space < 15) {
      this.space = this.space + 1;
      this.arrangeSpaces();
    }

  }

  decreesSpace() {
    if (this.space > 0) {
      this.space = this.space - 1;
      this.arrangeSpaces();
    }
  }


  constructor(public dialog: MatDialog) { }


  ngOnInit() {

  }


  ngOnChanges(changes: SimpleChanges) {

    if (changes.masageCount && changes.masageCount.currentValue &&
      (changes.masageCount.previousValue
        !== changes.masageCount.currentValue && !changes.masageCount.isFirstChange())
    ) {

      const message = this.screenDesingnerState.displayMasages;

      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Align by Field Inputs (left or right)',
          message: message,
          acceptLabel: 'YES',
        },
        data: null
      };
      this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });

    }

  }

}
