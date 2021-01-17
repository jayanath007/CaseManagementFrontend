import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import { Component, OnInit, Input, Output, ChangeDetectionStrategy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  UserPermission, GridFilterUpdate, GridData, SelectedInfo, Summery,
  Department, GridButtonAction
} from '../../../time-recorded-core/models/interfce';
import { gridFilterKind, GridButtonType } from '../../../time-recorded-core';
import { Breakpoints } from '@angular/cdk/layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GridGroupData } from '../../../core/lib/grid-model';
import { TimeRecordingState } from '../../../time-recording-core';


@Component({
  selector: 'dps-time-recorded-layout',
  templateUrl: './time-recorded-layout.component.html',
  styleUrls: ['./time-recorded-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeRecordedLayoutComponent implements OnInit, OnChanges {

  @Input() homeCurrancy;
  @Input() isLoading: boolean;
  @Input() columnDef;
  @Input() paginatorDef;
  @Input() departmentList: Department[];
  @Input() typeList;
  @Input() periodList;
  @Input() selectedTeamMember;
  @Input() teamMemberCount: string;
  @Input() userPermision: UserPermission;
  @Input() gridData: GridData[];
  @Input() selectedInfo: SelectedInfo;
  @Input() totalItem: number;
  @Input() summery: Summery;
  @Input() memListPanelMode: string;
  @Input() groupMode: string;
  @Input() groupData: GridGroupData;
  @Input() canMinimizeViews: { token: string; view: TimeRecordingState; isActive: boolean; }[];
  @Input() timeOffset: number;

  @Output() updateSelectedInfo = new EventEmitter<GridFilterUpdate>();
  @Output() viewChange = new EventEmitter<any>();
  @Output() rowSelect = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Output() selectRow = new EventEmitter<GridData>();
  @Output() changePanelMode = new EventEmitter<string>();
  @Output() onGroupBy = new EventEmitter<string>();
  @Output() selectGroup = new EventEmitter<GridGroupData>();
  @Output() clickGridButton = new EventEmitter<GridButtonAction>();
  @Output() loadMoreData = new EventEmitter<GridGroupData>();
  @Output() exportToExcel = new EventEmitter();

  @Output() timeUpdateValue = new EventEmitter<any>();
  @Output() timeUpdateStartStop = new EventEmitter<any>();
  @Output() saveTimeRecording = new EventEmitter<any>();
  @Output() dateTypeChanged = new EventEmitter();

  fontSizeClass: string;
  isMemberNavExpan = false;

  constructor(public popupService: SystemJsPopupLoaderService,
    private breakpointObserver: BreakpointObserver) { }

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
  }

  get selectedDepartment() {
    if (this.departmentList && this.departmentList.length) {
      return this.departmentList.find(item => item.groupId === this.selectedInfo.departmentId);
    }
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
  onChangeSelectedRow(data: GridData) {
    this.selectRow.emit(data);
  }
  onToggleExpand(value) {

  }
  groupBy(type: string) {
    this.onGroupBy.emit(type);
  }

  onSelectGroup(data: GridGroupData) {
    this.selectGroup.emit(data);
  }

  onClickGridButton(action: GridButtonAction) {
    this.clickGridButton.emit(action);
  }

  loadMore(data) {
    if (!this.isLoading) {
      this.loadMoreData.emit(data);
    }
  }
  newTimeClick() {
    this.clickGridButton.emit({ kind: GridButtonType.addTimeRecording, value: null });
  }
  oneExportToExcel() {
    this.exportToExcel.emit();
  }
  onTimeUpdating(event) {
    this.timeUpdateValue.emit(event);
  }
  onStopStartTimeRecording(value) {
    this.timeUpdateStartStop.emit(value);
  }
  onSaveTimeRecording(token) {
    this.saveTimeRecording.emit(token);
  }
  onDateTypeChanged(eventValue) {
    this.dateTypeChanged.emit(eventValue);
  }
}
