import { DecimalPipe } from '@angular/common';
import { CurrencySymbolsPipe } from '../../../shared/pipes/currency-symbols.pipe';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {
  Month, Department, AdgedDebChartData,
  BilledTimeChartData, CashReceivedChartData, MatterChartData, BarChartData, AllDayEventByYear
} from '../../../team-efficiency-core/models/interfaces';
import { TimeRecordedOption, MatterTypeEnum, ChartType } from '../../../team-efficiency-core/models/enums';
import { TeamMember } from '../../../core/lib/team-members';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material';
import { Module } from '../../../core/lib/app-settings';
import { AccessControlService } from '../../../auth/services/access-control.service';

@Component({
  selector: 'dps-team-efficiency-layout',
  templateUrl: './team-efficiency-layout.component.html',
  styleUrls: ['./team-efficiency-layout.component.scss']
})
export class TeamEfficiencyLayoutComponent implements OnInit, OnChanges {

  constructor(private currencySymbols: CurrencySymbolsPipe, private decimalPipe: DecimalPipe,
    private access: AccessControlService) { }

  @Input() loginUser;
  @Input() timeRecodedData: BarChartData[];
  @Input() monthList: Month[];
  @Input() departmentList: Department[];
  @Input() timeRecordOption: TimeRecordedOption;
  @Input() isTimeRecordDataLoading: boolean;
  @Input() selectedMonth: Month;
  @Input() selectedDepartment: number;
  @Input() selectedTeamMember;
  @Input() teamMemberCount;
  @Input() timeRecordChartTitle: string;
  @Input() isPageLoading: boolean;
  @Input() adgedDebData: AdgedDebChartData;
  @Input() billeTimesData: BilledTimeChartData;
  @Input() cashReceivedData: CashReceivedChartData;
  @Input() matterData: MatterChartData;
  @Input() homeCurrency: string;
  @Input() eventYearSummery: AllDayEventByYear[];
  @Input() userActivityLoading: boolean;
  @Input() activityTitle: string;

  @Output() updateTimeRecordOption = new EventEmitter<TimeRecordedOption>();
  @Output() updateMonth = new EventEmitter<Month>();
  @Output() updateMatterType = new EventEmitter<MatterTypeEnum>();
  @Output() updateDepartment = new EventEmitter<Department>();
  @Output() updateUser = new EventEmitter<TeamMember>();

  public chartHeight = 400;
  public piechartHeight = 400;
  public matterType = MatterTypeEnum;
  public timeOption = TimeRecordedOption;
  public chartType = ChartType;
  timeRecordChartType = ChartType.BarChart;
  billedChartType = ChartType.LineChart;
  cashResvChartType = ChartType.BarChart;
  matterOpenChart = ChartType.LineChart;

  public barChartInfoActivity: MatterChartData;
  public adgedDebDataActivity: AdgedDebChartData;

  public lineChartColors: Array<any> = [
    {
      backgroundColor: '#8ebc00',
      borderColor: '#fff',
    },
    {
      backgroundColor: '#309b46',
      borderColor: '#fff',
    },
    {
      backgroundColor: '#4f9af6',
      borderColor: '#fff',
    }
  ];

  public timeRecordedBarChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: label => this.homeCurrency && this.timeOption.VALUE === this.timeRecordOption ?
            this.currencySymbols.transform(this.homeCurrency) + ' ' + this.decimalPipe.transform(label, '1.2-2')
            : Math.floor(label) === label ? label : ''
        }
      }]
    }
  };

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: label => this.homeCurrency ?
            this.currencySymbols.transform(this.homeCurrency) + ' ' + this.decimalPipe.transform(label, '1.2-2')
            : Math.floor(label) === label ? label : ''
        }
      }]
    }
  };


  public matterBarChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: label => Math.floor(label) === label ? label : ''
        }
      }]
    }
  };

  public pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  isMemberNavExpan = false;
  mode = 'side';
  module = Module;

  ngOnInit() {
    this.isMemberNavExpan = window.outerWidth > 1400 ? true : false;
    this.isMemberNavExpan = true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedTeamMember && !changes.selectedTeamMember.isFirstChange()) {
      if (this.selectedTeamMember && this.selectedTeamMember.user) {
        this.updateUser.emit(this.selectedTeamMember);
      }

    }


  }

  getMovementDesc(typeId) {
    switch (typeId) {
      case 5:
        return 'Training';
        break;
      case 7:
        return 'Sick';
        break;
      case 8:
        return 'Holiday';
        break;


    }
  }

  get selectedDep() {
    if (this.selectedMonth && this.departmentList) {
      return this.departmentList.find(dep => dep.groupId === this.selectedDepartment);
    }
    return null;
  }

  get selectMonth() {
    if (this.selectedMonth && this.monthList) {
      return this.monthList.find(month => month.monthId === this.selectedMonth.monthId);
    }
    return null;
  }

  onMemberNavClick() {
    this.isMemberNavExpan = !this.isMemberNavExpan;
  }

  changeTimeRecordOption(value: TimeRecordedOption) {
    this.updateTimeRecordOption.emit(value);
  }

  OnDepartmentChanged(value) {
    this.updateDepartment.emit(value.value);
  }

  OnMonthChanged(value) {
    this.updateMonth.emit(value.value);
  }

  changeMatterType(value: MatterTypeEnum) {
    this.updateMatterType.emit(value);
  }

  removeSelectedUser() {
    this.updateDepartment.emit(this.selectedDep);
  }

  getMessage() {
    if (this.selectedDepartment.toString() === 'NaN' && this.selectedMonth && (this.selectedMonth.monthId <= 0)) {
      return 'Please select the department to view year summary';
    } else if (this.selectedMonth && (this.selectedMonth.monthId >= 0)) {
      return 'Chart not available for the month';
    } else {
      return 'Data not available';
    }
  }

  moduleIsActive(module: Module) {
    return this.access.checkModuleIsActive(module);
  }


}
