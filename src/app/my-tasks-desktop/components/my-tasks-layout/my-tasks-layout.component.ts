import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import {
  Department, UserPermission, GridData,
  GridFilterUpdate, SelectedInfo, Summery,
  GridButtonAction,
  MsgModel,
  GroupMode,
  GridGroupData
} from '../../../my-tasks-core/models/interfce';
import { TeamMember } from '../../../core/lib/team-members';
import { gridFilterKind } from '../../../my-tasks-core/models/enumeration';
import { InforDialogData, InforDialogComponent } from '../../../shared';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'dps-my-tasks-layout',
  templateUrl: './my-tasks-layout.component.html',
  styleUrls: ['./my-tasks-layout.component.scss']
})
export class MyTasksLayoutComponent implements OnInit, OnChanges {

  @Input() isLoading: boolean;
  @Input() gridColoum: ColumnDef[];
  @Input() totalItem: number;
  @Input() paginatorDef: PaginatorDef;
  @Input() department: Department[];
  @Input() userPermision: UserPermission;
  @Input() selectedTeamMember: TeamMember;
  @Input() teamMemberCount: number;
  @Input() gridData: GridData[];
  @Input() selectedInfo: SelectedInfo;
  @Input() summery: Summery;
  @Input() msg: MsgModel;
  @Input() memListPanelMode: boolean;
  @Input() groupMode: GroupMode;
  @Input() gridGroupData: GridGroupData[];
  @Input() activeOutlet: string;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  @Output() viewChange = new EventEmitter<any>();
  @Output() rowExpanded = new EventEmitter<GridData>();
  @Output() gridRefresh = new EventEmitter();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() updateNewTaskClick = new EventEmitter();
  @Output() changePanelMode = new EventEmitter<string>();
  @Output() openAddTaskWithFile = new EventEmitter<{ file: any, row: GridData }>();
  @Output() groupChange = new EventEmitter();
  @Output() selectedGroupRowChange = new EventEmitter<any>();
  @Output() loadMore = new EventEmitter<any>();


  isMemberNavExpan = false;
  fontSizeClass: string;

  constructor(private dialog: MatDialog, private breakpointObserver: BreakpointObserver) {
  }


  onLoadMore(event) {
    this.loadMore.emit(event);
  }

  onSelectedGroupRowChange(event) {
    this.selectedGroupRowChange.emit(event);
  }


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
    if (changes.msg && !changes.msg.isFirstChange()) {
      if (this.msg && this.msg.isShow) {
        setTimeout(() => {
          this.openMsgDialog(this.msg.msg);
        }, 100);
      }
    }
  }

  newTaskClick() {
    this.updateNewTaskClick.emit();
  }

  get selectedDepartment() {
    if (this.department && this.department.length > 0) {
      return this.department.find(dep => dep.groupId === this.selectedInfo.departmentId);
    } else {
      return null;
    }
  }

  onMemberNavClick() {
    this.isMemberNavExpan = !this.isMemberNavExpan;
  }

  onUpdateSelectedInfo(value: GridFilterUpdate) {
    this.updateSelectedInfo.emit(value);
  }

  onChangeGridFontSize(newClass) {
    this.fontSizeClass = newClass;
  }

  onViewChange(value) {
    this.viewChange.emit(value);
  }

  onGroupChange(value) {
    this.groupChange.emit(value);
  }

  onRowExpand(item: GridData) {
    this.rowExpanded.emit(item);
  }

  onGridRefresh() {
    this.gridRefresh.emit();
  }

  onClickGridButton(item: GridButtonAction) {
    this.clickGridButton.emit(item);
  }

  openMsgDialog(msg: string): void {
    const dialogData: InforDialogData = {
      content: {
        title: 'Message . . .',
        message: msg
      },
      data: { messageType: 'alert' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
  }

  onOpenAddTaskWithFile(event: { file: any, row: GridData }) {
    this.openAddTaskWithFile.emit(event);
  }

  onPrint() {
    const mywindow = window.open('', 'PRINT', 'height=400,width=700');
    const printContents = document.getElementById('my-tasks-print-section').innerHTML;
    mywindow.document.write(`
      <html>
        <head>
          <title>Spitfire - Tasks</title>
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
