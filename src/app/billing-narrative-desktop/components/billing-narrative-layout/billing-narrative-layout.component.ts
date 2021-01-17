import { ConfirmDialogComponentWithCancel, InforDialogComponent } from './../../../shared';

import { ConfirmDialogData, ConfirmDialogWithCancelResultKind, InforDialogData } from './../../../shared/models/dialog';

import { NarrativeGroup, NarrativesInfo, NarrativeItem, NarrativeDataModel } from './../../../billing-narrative-core/models/interfaces';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ViewChangeKind } from './../../../billing-narrative-core/models/enums';
import { MatDialog } from '@angular/material';



@Component({
  selector: 'dps-billing-narrative-layout',
  templateUrl: './billing-narrative-layout.component.html',
  styleUrls: ['./billing-narrative-layout.component.scss']
})
export class BillingNarrativeLayoutComponent {
  @Input() isLoading: boolean;
  @Input() narrativeData: NarrativeDataModel[];
  @Input() narrativeGroupItems: NarrativeItem[];
  @Input() narrativeInfo: NarrativesInfo;


  @Output() closeNarrativePopup = new EventEmitter<any>();
  @Output() selectNarrativeGroup = new EventEmitter<NarrativeGroup>();
  @Output() selectNarrativeGroupItem = new EventEmitter<NarrativeItem>();
  @Output() saveNarrativeInfo = new EventEmitter<any>();
  @Output() selectNarrativePopup = new EventEmitter<any>();
  @Output() deleteNarratives = new EventEmitter<any>();
  @Output() deleteGroup = new EventEmitter<any>();

  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();


  isdurty: boolean;

  constructor(private dialog: MatDialog) { }

  onClose(event) {
    this.closeNarrativePopup.emit(event);
  }


  onSelect(event) {
    this.selectNarrativePopup.emit(this.narrativeInfo);
  }

  selectGroup(event, group: NarrativeGroup) {

    this.selectNarrativeGroup.emit(group);
  }
  selectGroupItem(event, item) {

    this.selectNarrativeGroupItem.emit(item);

  }

  onChangeGroup(group) {
    this.isdurty = true;
    this.viewChange.emit({ kind: ViewChangeKind.ChangeGroup, value: group });

  }

  onChangeItem(items) {
    this.isdurty = true;
    this.viewChange.emit({ kind: ViewChangeKind.ChangeItem, value: items });
  }

  onChangeNarrativeText(narrativeText) {
    this.isdurty = true;

    this.viewChange.emit({ kind: ViewChangeKind.ChangeNarrativeText, value: narrativeText });
  }

  onSaveNarrativeInfo(event) {
    this.isdurty = false;
    this.saveNarrativeInfo.emit();
  }

  onDeleteGroup() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Delete Narrative Group',
        message: 'Do you wish to delete this group from the narrative list? Your changes can not be undone.',
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponentWithCancel, {
      data: dialogData,
      width: '350px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {
        this.deleteGroup.emit();
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {

      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
      }
    });

  }


  deleteNarrative() {
    if (this.narrativeGroupItems.length > 0) {

      this.deleteNarratives.emit();

    } else {

      const dialogData: InforDialogData = {
        content: {
          title: 'Message',
          message: 'There are no narratives to delete.',
        },
        data: { messageType: 'warning' }
      };
      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '300px',
        disableClose: true,
        panelClass: 'dps-notification'
      });


    }


  }

  addNarrative() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Use Narrative as template?',
        message: 'Do you wish to use the current narrative as a template?',
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponentWithCancel, {
      data: dialogData,
      width: '350px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {
        this.viewChange.emit({ kind: ViewChangeKind.AddCurrentNarrativeText, value: null });
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
        this.viewChange.emit({ kind: ViewChangeKind.AddNewNarrativeText, value: null });
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
      }
    });

  }
}
