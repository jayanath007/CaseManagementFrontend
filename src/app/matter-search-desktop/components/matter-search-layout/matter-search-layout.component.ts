import { ColumnDef } from './../../../core/lib/grid-model';
import { map } from 'rxjs/operators';
import { TeamMemberManagerComponent } from '../../../team-member-desktop/containers/team-member-manager.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import { MessageDialogComponent } from '../../../shared/components/msg-dialog/msg-dialog.component';
import { MessageDialogData } from '../../../shared/models/dialog';
import { MatRadioChange, MatDialog } from '@angular/material';
import { TeamMember } from '../../../core/lib/team-members';
import { ViewChangeKind, MatterViews, GridRowItemWrapper } from '../../../matter-search-core';
import {
  Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter,
  OnChanges, SimpleChanges, ViewChild
} from '@angular/core';
import { MatterMenu } from './../../../matter-search-core/models/enums';
import { MainMenuItem } from './../../../layout-desktop/models/interfaces';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-matter-search-layout',
  templateUrl: './matter-search-layout.component.html',
  styleUrls: ['./matter-search-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterSearchLayoutComponent implements OnInit, OnChanges {

  @Input() homeCurrancy;
  @Input() departmentList;
  @Input() columnDef: ColumnDef[];
  @Input() matterData: GridRowItemWrapper[];
  @Input() paginatorDef;
  @Input() searchText;
  @Input() isInactiveFeeEarner;
  @Input() isClosedMatters;
  @Input() isCompletedMatters;
  @Input() totalItems;
  @Input() totalBillsOutstanding;
  @Input() totalMatterCount;
  @Input() activeView;
  @Input() selectedDepartment;
  @Input() isDepartmentLoading: boolean;
  @Input() isGridLoading: boolean;
  @Input() selectedTeamMember: TeamMember;
  @Input() teamMemberToken: string;
  @Input() teamMemberCount: string;
  @Input() isUserExpandRow: any;
  @Input() initView: boolean;
  @Input() memListPanelMode: boolean;
  @Input() activeOutlet: string;
  @Input() isMLSEnableMatter: boolean;
  @Input() menuItem: MainMenuItem<any>[];
  @Input() isPlotUser: boolean;
  @Input() plotVarValues: string[];

  @Output() viewChange = new EventEmitter();
  @Output() rowSelect = new EventEmitter();
  @Output() toggleExpand = new EventEmitter();
  @Output() onUpdateOpenCaseClick = new EventEmitter<GridRowItemWrapper>();
  @Output() onUpdateTimeRecordingClick = new EventEmitter<GridRowItemWrapper>();
  @Output() onUpdateNewMailClick = new EventEmitter<GridRowItemWrapper>();
  @Output() refresh = new EventEmitter();
  @Output() ledgerCardClick = new EventEmitter<GridRowItemWrapper>();
  @Output() changePanelMode = new EventEmitter<string>();
  @Output() mlsEnableChange = new EventEmitter<boolean>();
  @Output() openMLS = new EventEmitter<GridRowItemWrapper>();
  @Output() clickMatterMenu = new EventEmitter<MatterMenu>();
  @Output() openEChitWithMatter = new EventEmitter<GridRowItemWrapper>();
  @Output() openBillingRequest = new EventEmitter<GridRowItemWrapper>();
  @Output() openReferralNoteAndDate = new EventEmitter<any>();


  @ViewChild(TeamMemberManagerComponent) form: TeamMemberManagerComponent;

  MatterViews = MatterViews;
  fontSizeClass: string;
  isMemberNavExpan = true;

  constructor(private dialog: MatDialog, public popupService: SystemJsPopupLoaderService, private menu: MainMenuItemResolverService,
    private breakpointObserver: BreakpointObserver) {
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
      let employeeModel = null;
      if (this.selectedTeamMember) {
        employeeModel = {
          User: changes.selectedTeamMember.currentValue.user,
          Path: changes.selectedTeamMember.currentValue.path,
          Full_Name: changes.selectedTeamMember.currentValue.fullName,
          Designation: changes.selectedTeamMember.currentValue.path,
          User_Email: changes.selectedTeamMember.currentValue.userEmail,
          User_MobileNo: changes.selectedTeamMember.currentValue.userMobileNo
        };
      }
      this.onViewChange({ kind: ViewChangeKind.Employee, value: employeeModel });
    }
    if (changes.matterData && changes.matterData.currentValue) {

      if (changes.matterData.currentValue.length > 0 && changes.matterData.currentValue[0].data) {
        if (!this.isUserExpandRow) {
          this.onToggleExpand(changes.matterData.currentValue[0]);
        }

      }
    }
  }
  onMemberNavClick() {
    this.isMemberNavExpan = !this.isMemberNavExpan;
  }
  onViewChange(event) {
    this.viewChange.emit(event);
  }

  onRowSelect(event) {
    this.rowSelect.emit(event);
  }

  onToggleExpand(event) {
    // this.expandedDataRow = event;
    this.toggleExpand.emit(event);
  }
  public onOpenCaseClick(selectedMatter: GridRowItemWrapper) {
    this.onUpdateOpenCaseClick.emit(selectedMatter);
  }
  public onTimeRecordingClick(selectedMatter: GridRowItemWrapper) {
    this.onUpdateTimeRecordingClick.emit(selectedMatter);
  }
  public onNewMailClick(selectedMatter: GridRowItemWrapper) {

    this.onUpdateNewMailClick.emit(selectedMatter);
  }

  onClosedMattersChange(value) {
    this.viewChange.emit({ kind: ViewChangeKind.ClosedMatters, value: value });
  }

  onCompletedMattersChange(value) {
    this.viewChange.emit({ kind: ViewChangeKind.CompletedMatters, value: value });
  }

  onInactiveFeeEarnersChange(value) {
    // this.isMemberNavExpan = true;
    this.viewChange.emit({ kind: ViewChangeKind.InactiveFeeEarners, value: value });
  }

  onSearchTextChanged(value) {
    // this.isMemberNavExpan = true;
    this.viewChange.emit({ kind: ViewChangeKind.SearchText, value: value });
  }

  onDepartmentChange(value) {
    // this.isMemberNavExpan = true;
    this.viewChange.emit({ kind: ViewChangeKind.Department, value: value });
    console.log('asd', this.teamMemberCount);
  }

  changeMatterView(event: MatRadioChange) {
    if (event.value) {
      this.viewChange.emit({ kind: ViewChangeKind.MainView, value: event.value });
    }
  }
  onFontSizeClassChange(value) {
    this.fontSizeClass = value;
  }
  openPopup() {
    const dialogData: MessageDialogData = {
      content: {
        message: 'Time Zone successfully updated'
      }
    };

    const dialogRef = this.dialog.open(MessageDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: false,
      panelClass: 'dps-msg-dialog',
    });
    return dialogRef.afterClosed().pipe(map<any, boolean>(dialogResult => {
      return false;
    }));
  }
  onRefresh() {
    this.refresh.emit();
  }
  onOpenLedgerCard(matterData) {
    this.ledgerCardClick.emit(matterData);
  }
  onMLSEnableChange(value) {
    this.viewChange.emit({ kind: ViewChangeKind.IsEnableMLSMatters, value: value });
  }
  onMLSClick(matterData: GridRowItemWrapper) {
    this.openMLS.emit(matterData);
  }
  onOpenEChitWithMatter(matterData: GridRowItemWrapper) {
    this.openEChitWithMatter.emit(matterData);
  }
  onOpenBillingRequestPopup(matterData: GridRowItemWrapper) {
    this.openBillingRequest.emit(matterData);
  }
  onOpenReferralNoteAndDate(matterData: GridRowItemWrapper) {
    this.openReferralNoteAndDate.emit(matterData.data);

  }

  onPrint() {
    const mywindow = window.open('', 'PRINT', 'height=400,width=700');
    const printContents = document.getElementById('matter-search-print-section').innerHTML;
    mywindow.document.write(`
      <html>
        <head>
          <title>Spitfire - Matter search</title>
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

  onClickMatterMenu(kind: MatterMenu) {
    this.clickMatterMenu.emit(kind);
  }

  get matterCreationTitle(): string {
    if (!this.menuItem) {
      return '';
    }
    return this.menuItem.find(i => i.id === 'matter_creation').label;
  }
  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }

}
