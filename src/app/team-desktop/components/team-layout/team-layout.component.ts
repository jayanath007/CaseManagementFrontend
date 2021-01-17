import { UserViewType } from './../../../team-core/models/enum';
import {
  Department, TeamMember, SelectedYearAndMonth, MonthActivityResponce,
  DayActivity, AllDayEventByYear
} from '../../../team-core/models/interface';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-team-layout',
  templateUrl: './team-layout.component.html',
  styleUrls: ['./team-layout.component.scss']
})
export class TeamLayoutComponent implements OnInit {

  @Input() columnDef;
  @Input() teamUsersLoading: boolean;
  @Input() departmentList: Department[];
  @Input() teamUsersList: TeamMember[];
  @Input() selectedViewType: UserViewType;
  @Input() selectYearAndMonth: SelectedYearAndMonth;
  @Input() selectedTeamUser: TeamMember;
  @Input() monthActivityList: MonthActivityResponce[];
  @Input() activityListByDay: DayActivity[];
  @Input() eventYearSummery: AllDayEventByYear;
  @Input() loading: boolean;
  @Input() loginUser: TeamMember;

  @Output() addMovement = new EventEmitter<any>();
  @Output() changeViewType = new EventEmitter<any>();
  @Output() searchTextcahange = new EventEmitter<any>();
  @Output() departmentChange = new EventEmitter<any>();
  @Output() selectYearAndMonthClick = new EventEmitter<{ selectdate: any, kind: UserViewType }>();
  @Output() teamUserChange = new EventEmitter<any>();
  @Output() selectedDay = new EventEmitter<any>();


  constructor(private popupService: SystemJsPopupLoaderService) { }

  viewType = UserViewType;

  ngOnInit() {
  }

  onAddMovement() {

    // const matterData: MatterSearchGridData = {
    //   appID: this.matterInfo.AppId,
    //   fileID: this.matterInfo.FileId,
    //   app_Code: this.matterInfo.AppCode,
    //   branchID: this.matterInfo.BranchId,
    //   feeEarner: this.matterInfo.FeeEarner,
    //   reviewDate: null,
    //   clientName: this.matterInfo.ClientName,
    //   reviewNote: '',
    //   company_Name: '',
    //   matterDetails: this.matterInfo.MatterDetails,
    //   matterReferenceNo: this.matterInfo.MatterReferenceNo,
    //   matterCounter: this.matterInfo.MatterCounter,
    //   ufnValue: this.matterInfo.ufnValue,
    //   eBilling: this.matterInfo.eBilling,
    //   isPlotMatter: this.matterInfo.isPlotMatter,
    //   isPlotMasterMatter: this.matterInfo.isPlotMasterMatter,

    // };

    this.popupService.openUserMovementPopup('userMovementPopup', this.teamUsersList, this.departmentList).subscribe((result: any) => {
      if (!result) {
        return '';
      }
    });

    // this.addMovement.emit();
  }







  onSearchTextcahange(value) {

    this.searchTextcahange.emit(value);

  }

  onChangeViewType(value) {
    this.changeViewType.emit(value);

  }

  onChangeDepartment(event) {
    this.departmentChange.emit(event);

  }

  onSelectYearAndMonth(event) {
    this.selectYearAndMonthClick.emit(event);

  }

  onTeamUserChange(event) {
    this.teamUserChange.emit(event);
  }

  onSelectedDay(event) {
    this.selectedDay.emit(event);

  }
}
