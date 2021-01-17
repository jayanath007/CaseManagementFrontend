import { GridButtonType, ViewChangeKind } from '../../../work-done-core/models/enumeration';
import { MatDialog } from '@angular/material';
import { ColumnDef, PaginatorDef, GridGroupData } from '../../../core/lib/grid-model';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  GridData, GridFilterUpdate, GridButtonAction, Summery, SelectedInfo,
  Department,
  GroupMode,
  Periods
} from '../../../work-done-core/models/interfce';
import { gridFilterKind } from '../../../work-done-core/models/enumeration';
import { InsertPasswordDialog, InforDialogData } from '../../../shared';
import { PasswordInsertComponent } from '../../../shared/components/password-insert-dialog/password-insert.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'dps-work-done-layout',
  templateUrl: './work-done-layout.component.html',
  styleUrls: ['./work-done-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkDoneLayoutComponent implements OnInit, OnChanges {

  constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver) { }

  @Input() isLoading: boolean;
  @Input() columnDef: ColumnDef[];
  @Input() departmentList: Department[];
  @Input() periodList: Periods[];
  @Input() selectedTeamMember;
  @Input() teamMemberCount: string;
  @Input() gridData: GridData[];
  @Input() totalItem: number;
  @Input() summery: Summery;
  @Input() expandedRow: GridData;
  @Input() selectedInfo: SelectedInfo;
  @Input() passWordRequestRow: GridData;
  @Input() showmsg: boolean;
  @Input() paginatorDef: PaginatorDef;
  @Input() memListPanelMode: boolean;
  @Input() timeZone: string;
  @Input() companyCode: any;
  @Input() groupMode: string;
  @Input() groupData: any;
  @Input() selectGroupHash: string[];
  @Input() activeOutlet: string;
  @Input() timeOffset: number;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  @Output() viewChange = new EventEmitter<any>();
  @Output() rowSelect = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() userPassword = new EventEmitter<{ row: GridData, password: string }>();
  @Output() removePasswordRequest = new EventEmitter();
  @Output() changePanelMode = new EventEmitter<string>();
  @Output() menuChange = new EventEmitter<any>();
  @Output() selectGroup = new EventEmitter<GridGroupData>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();

  homeCurrancy;
  fontSizeClass: string;
  isMemberNavExpan = false;
  GroupMode = GroupMode;

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.WebLandscape
    ]).subscribe(result => {
      if (!result.matches) {
        this.changePanelMode.emit('over');
        this.isMemberNavExpan = false;
      } else {
        this.changePanelMode.emit('side');
      }
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedTeamMember && !changes.selectedTeamMember.isFirstChange()) {
      if (this.selectedTeamMember && this.selectedTeamMember.user) {
        const user = this.selectedTeamMember.user;
        const newValue = { kind: gridFilterKind.user, value: user };
        this.updateSelectedInfo.emit(newValue);
      }
    }
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

  get selectedDepartment() {
    if (this.departmentList && this.departmentList.length) {
      return this.departmentList.find(item => item.groupId === this.selectedInfo.departmentId);
    }
  }
  get selectedPeriod() {
    if (this.periodList && this.periodList.length > 0 && this.selectedInfo) {
      return this.periodList.find((period) => period.groupId === this.selectedInfo.periodId);
    }
    return null;
  }

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

  onMenuChange(event) {
    this.menuChange.emit(event);
  }

  onSelectGroup(data: GridGroupData) {
    this.selectGroup.emit(data);
  }

  loadMore(data: GridGroupData) {
    this.loadMoreData.emit(data);
  }
  onPrint() {
    const mywindow = window.open('', 'PRINT', 'height=400,width=700');
    const printContents = document.getElementById('work-done-print-section').innerHTML;
    mywindow.document.write(`
      <html>
        <head>
          <title>Spitfire - Work done</title>
          <style>
            .dps-text{
              font-weight: normal;
              font-family: Roboto, "Helvetica Neue", sans-serif;
            }

            td, th {
              text-align: left;
              padding: 4px;
              font-size: 12px;
            }
            tr:nth-child(even) {
              background-color: #dddddd;
            }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>
    `);
    mywindow.document.write('</body></html>');

    mywindow.document.close();
  }
}
