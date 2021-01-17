import { DriveItem } from './../../../azure-storage/models/interfaces';
import { AddNoteInPutData, AddNoteItemsType, AddNoteItem, MailItem, InboxItem, DiaryItem } from './../../../core/lib/addNote';
import { BasePopupType } from './../../../shared/models/consol-error';
import { MatterInputData } from './../../../core/lib/matter';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { GridData, GridButtonAction, SelectedInfo, } from '../../../post-office-core/models/interfce';
import { GridButtonType, GroupMode } from '../../../post-office-core/models/enumeration';
import { ColumnDef } from '../../../core/lib/grid-model';
import { MatMenuTrigger, MenuPositionX, MatDialog } from '@angular/material';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import { DiaryRecType, LegalAid } from './../../../add-note-core/models/enumeration';
import { MatterInfo } from './../../../add-note-core';
import { PostOfficeActionInputData } from './../../../post-office-action-core/models/interfaces';
import { ConfirmDialogWithCancelResultKind, ConfirmDialogComponentWithCancel, ConfirmDialogData } from '../../../shared';
import { from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'dps-post-office-grid-row',
  templateUrl: './post-office-grid-row.component.html',
  styleUrls: ['./post-office-grid-row.component.scss']
})
export class PostOfficeGridRowComponent implements OnInit {


  @Output() rowExpand = new EventEmitter<GridData>();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();


  @Input() gridData: GridData[];
  @Input() expandedRow: GridData;
  @Input() selectedInfo: SelectedInfo;
  @Input() columnDef: ColumnDef[];
  @Input() selectedGroup: GroupMode;
  @Input() isMuiltySelect: boolean;
  @Input() selectedRows: GridData[];


  xPosition: MenuPositionX;
  groupMode = GroupMode;
  menuClientX;
  menuClientY;
  tempRow;


  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  constructor(public popupService: SystemJsPopupLoaderService, protected dialog: MatDialog) { }

  ngOnInit() {
  }
  checkIsShow(row: GridData) {
    if (!this.isMuiltySelect) {
      return true;
    } else if (row.isChecked) {
      return true;
    }
    return false;
  }


  getHiddenProperty(index) {
    if (!this.columnDef) { return ''; }
    return !this.columnDef[index].extras.hidden;
  }

  getFxFlexProperty(index) {
    if (!this.columnDef) { return ''; }
    return this.columnDef[index]
      && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }

  onOpenDocument(event: Event, item: GridData) {
    if (item.inboxLettericon) {
      // event.stopPropagation();
      // this.rowExpand.emit(item);
      this.clickGridButton.emit({ kind: GridButtonType.viewDocument, value: item });
    }
  }

  clickMenuTrigge(event, row) {

    // event.preventDefault();
    // event.stopPropagation();
    // setTimeout(() => {
    //   this.clickRow(row, event);
    // });



    if (this.hasitem(row) || this.selectedRows.length === 0) {
      const action: GridButtonAction = {
        kind: GridButtonType.checkItem,
        value: row,
      };
      this.clickGridButton.emit(action);
      this.menuClientX = event.clientX;
      this.menuClientY = event.clientY;
      this.tempRow = row;
      this.contextMenu.openMenu();
    }

  }

  hasitem(row) {

    if (this.selectedRows) {
      if (this.selectedRows.find(value => value.inboxId === row.inboxId)) {
        return true;
      } else { return false; }
    }

  }

  clickRow(item, event) {

    if (!(event.target && event.target.id === 'menue')) {
      let action: GridButtonAction;
      if (!!event.ctrlKey) {
        action = {
          kind: GridButtonType.selectItem,
          value: item,
        };
      } else {
        action = {
          kind: GridButtonType.selectOneItem,
          value: item,
        };
      }
      this.clickGridButton.emit(action);
    }

  }

  delete(event) {

    const rows = this.getSelectedRow();
    let action: GridButtonAction;
    action = {
      kind: GridButtonType.deleteItem,
      value: rows[0],
    };
    this.clickGridButton.emit(action);

  }

  getSelectedRow() {
    if (this.selectedRows.length > 0) {
      return this.selectedRows;
    } else {
      const arr = [];
      arr.push(this.tempRow);
      return arr;
    }
  }


  itemAction(event) {
    // inputData
    const rows = this.getSelectedRow();
    const row = rows[0];
    const data: PostOfficeActionInputData = {
      status: row.inboxStatus,
      group: row.inboxGroupName,
      groupId: row.inboxGroupId,
      sendTo: row.inboxInUseBy,
      itemType: row.inboxDocType,
      createdBy: row.inboxCurUser,
      dateOn: row.inboxDateCreated,
      massage: '',
      note: row.inboxNote,
      document: row.inboxDocPath,
      action: row.inboxAction,
      statusName: row.inboxStatusName,
      attachAs: row.inboxStatus,
      rows: rows,
    };

    this.popupService.openPostOfficeActionPopup('TimeRecordingEditRecord-', data);


  }

  changeCheckbox(event, item) {
    event.preventDefault();
    event.stopPropagation();
    if (item.isChecked) {
      const action: GridButtonAction = {
        kind: GridButtonType.uncheckItem,
        value: item,
      };
      this.clickGridButton.emit(action);
    } else {
      const action: GridButtonAction = {
        kind: GridButtonType.checkItem,
        value: item,
      };
      this.clickGridButton.emit(action);
    }
  }


  attacheToDpsFile(event) {
    if (this.getSelectedRow().length > 0) {
      const matterInputData: MatterInputData = {
        isMatterSearch: false,
        basePopupType: BasePopupType.GlobalDocumentAttachDPSfile,
        emailList: null
      };
      this.popupService.openMatterSearchPopup('matterSearchPopup', matterInputData)
        .subscribe((result: MatterInfo) => {
          if (result) {
            const rows = Object.assign([], this.getSelectedRow());
            const matterData = {
              MatterReferenceNo: result.MatterReferenceNo,
              BranchID: result.BranchID,
              AppID: result.AppID,
              FeeEarner: result.FeeEarner,
              ClientName: result.ClientName || '',
              RateCategory: null,
              FileID: result.FileID,
              AppCode: result.AppCode,
              eBilling: result.eBilling,
              isPlotMasterMatter: result.isPlotMasterMatter,
              isProspectMatter: result.isProspectMatter,
              isLegalAid: result.isLegalAid
            };
            this.popupService.openAddNotePopupWithAttachments(
              'mainAddNotePopup', rows, AddNoteItemsType.InboxItems,
              matterData, DiaryRecType.FILE_NOTE, LegalAid.NotLegalAid
            );
          }
        });
    }

  }

}
