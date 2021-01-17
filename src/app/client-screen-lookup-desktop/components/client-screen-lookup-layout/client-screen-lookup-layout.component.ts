import { UpdateCol } from '../../../client-screen-lookup-core/models/interfaces';
import { PaginatorDef } from '../../../core/lib/grid-model';
import { ConfirmDialogData, ConfirmDialogResultKind } from '../../../shared/models/dialog';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { ConfirmDialogComponent } from '../../../shared';
import { LookupViewModel } from '../../../core';

@Component({
  selector: 'dps-client-screen-lookup-layout',
  templateUrl: './client-screen-lookup-layout.component.html',
  styleUrls: ['./client-screen-lookup-layout.component.scss']
})
export class ClientScreenLookupLayoutComponent implements OnInit {


  @Input() columnDef;
  @Input() screenLookupList: LookupViewModel;
  @Input() loading;

  @Output() onLookupClose = new EventEmitter();
  @Output() onDeleteScreenLookupClick = new EventEmitter<any>();
  @Output() onChangeDescription = new EventEmitter<any>();
  @Output() onAddNewLookupClick = new EventEmitter();
  @Output() closePopup = new EventEmitter<string>();
  @Output() onSaveScreenLookupClick = new EventEmitter();
  @Output() onCancelChangeClick = new EventEmitter();
  @Output() lookupItemChange = new EventEmitter<{ rowId: number, changeValue: any, changeCol: UpdateCol }>();

  constructor(private dialog: MatDialog, private popupService: SystemJsPopupLoaderService) { }

  ngOnInit() {
  }

  exitClientLookupClick() {
    this.closePopup.emit('close');

  }


  onChangeDescriptionClick(event) {


    this.onChangeDescription.emit(event);


  }
  onCancelChange() {

    this.onCancelChangeClick.emit(event);

  }

  onLookupItemChange(event) {

    this.lookupItemChange.emit(event);

  }

  deleteScreenLookupClick(event) {
    // --he if (this.selectedWorkflowRuleList && this.selectedWorkflowRuleList.length > 0) {
    const dialogData: ConfirmDialogData = {
      content: {
        title: ' Delete Note',
        message: `Are you sure you want to delete the selected row?`,
        acceptLabel: 'Yes',
        rejectLabel: 'No'
      },
      contentParams: { displayName: '' },
      data: null,
    };

    const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
      // disableClose: true
    });
    deleteDialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
        this.onDeleteScreenLookupClick.emit(event);
      } else {

      }
    });



  }

  scrollToBottom(): void {
    const ele = document.getElementsByClassName('screenLookup-scroll');
    const eleArray = <Element[]>Array.prototype.slice.call(ele);
    eleArray.map(val => {
      val.scrollTop = val.scrollHeight;
    });
  }

  screenLookupSave() {

    this.onSaveScreenLookupClick.emit();

  }

  screenLookupCancel() {
    this.onLookupClose.emit();

  //   closeAndDiscastClientPopup(token) {
  //     this.closePopup.emit();
  //     this.store.dispatch(new ExitClientSearchPopup(token));
  // }


  }

  AddNewLookupClick() {
    this.onAddNewLookupClick.emit();
     setTimeout(() => {
    this.scrollToBottom();
    }, 150);


  }

}
