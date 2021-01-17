import { GridButtonType, GroupMode } from '../../../post-office-core/models/enumeration';
import { MatDialog } from '@angular/material';
import { ColumnDef, PaginatorDef, GridGroupData } from '../../../core/lib/grid-model';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  GridData, GridFilterUpdate, GridButtonAction, SelectedInfo,
  Group
} from '../../../post-office-core/models/interfce';
import { InsertPasswordDialog, InforDialogData } from '../../../shared';
import { PasswordInsertComponent } from '../../../shared/components/password-insert-dialog/password-insert.component';
import { Department } from './../../../post-office-core/models/interfce';
import { TeamMember } from './../../../core/lib/team-members';

@Component({
  selector: 'dps-post-office-layout',
  templateUrl: './post-office-layout.component.html',
  styleUrls: ['./post-office-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostOfficeLayoutComponent implements OnInit, OnChanges {

  constructor(private dialog: MatDialog) { }

  @Input() isLoading: boolean;
  @Input() columnDef: ColumnDef[];
  @Input() groupList: Group[];
  @Input() loookForList: any[];
  @Input() userList;
  @Input() gridData: GridData[];
  @Input() totalItem: number;
  @Input() expandedRow: GridData;
  @Input() selectedInfo: SelectedInfo;
  @Input() passWordRequestRow: GridData;
  @Input() showmsg: boolean;
  @Input() paginatorDef: PaginatorDef;
  @Input() groupMode: string;
  @Input() groupData: any;
  @Input() selectGroupHash: string[];
  @Input() departments: Department[];
  @Input() selectedTeamMember: TeamMember;
  @Input() teamMemberCount: number;
  @Input() memListPanelMode: string;
  @Input() timeOffset: number;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  @Output() viewChange = new EventEmitter<any>();
  @Output() rowSelect = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() userPassword = new EventEmitter<{ row: GridData, password: string }>();
  @Output() removePasswordRequest = new EventEmitter();
  @Output() changePanelMode = new EventEmitter<string>();
  @Output() selectGroup = new EventEmitter<GridGroupData>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();
  @Output() menuChange = new EventEmitter<any>();
  @Output() groupChange = new EventEmitter<GroupMode>();

  fontSizeClass: string;
  isMemberNavExpan = false;

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.passWordRequestRow && !changes.passWordRequestRow.isFirstChange()) {
      if (this.passWordRequestRow) {
        setTimeout(() => {
          this.openPasswordDialog(this.passWordRequestRow);
        }, 100);
      }
    }
    if (changes.showmsg && !changes.showmsg.isFirstChange()) {
      if (this.showmsg) {
        setTimeout(() => {
          this.openMsgDialog('Invalid password, please try again.');
        }, 100);
      }
    }
  }

  // get selectedGroup() {
  //   if (this.groupList && this.groupList.length) {
  //     return this.groupList.find(item => item.groupId === this.selectedInfo.groupId);
  //   }
  // }

  onMemberNavClick() {
    this.isMemberNavExpan = !this.isMemberNavExpan;
  }

  onRowSelect(event) {
    this.rowSelect.emit(event);
  }

  onFontSizeClassChange(value) {
    this.fontSizeClass = value;
  }

  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo.emit(value);
  }

  onGridRefresh() {
    this.refresh.emit();
  }

  onViewChange(value) {
    this.viewChange.emit(value);
  }

  onChangeGridFontSize(newClass) {
    this.fontSizeClass = newClass;
  }

  public onClickGridButton(action: GridButtonAction) {
    if (action.kind === GridButtonType.viewDocument) {
      this.isMemberNavExpan = false;
    }
    this.clickGridButton.emit(action);
  }

  openPasswordDialog(item: GridData): void {
    const dialogData: InsertPasswordDialog = {
      content: { title: 'View Document', details: 'This document is protected. You must provide a password to view it.', message: '' },
      data: { password: '' }
    };

    const dialogRef = this.dialog.open(PasswordInsertComponent, {
      width: '350px',
      data: dialogData,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(result => {
      {
        if (result) {
          // this.rowChangeEvent.emit({ kind: RowItemChangeKind.ValidateUserPassword, row: item, value: result.data.password });
          this.userPassword.emit({ row: item, password: result.data.password });
        } else {
          this.removePasswordRequest.emit();
        }
      }
    });
  }

  openMsgDialog(msg: string): void {
    const dialogData: InforDialogData = {
      content: {
        title: 'DPS Spitfire',
        message: msg
      },
      data: { messageType: 'warning' }
    };
  }


  onSelectGroup(data: GridGroupData) {
    this.selectGroup.emit(data);
  }

  loadMore(data: GridGroupData) {
    this.loadMoreData.emit(data);
  }

  onMenuChange(event) {
    this.menuChange.emit(event);
  }

  onGroupChange(value) {
    this.groupChange.emit(value);
  }

}
