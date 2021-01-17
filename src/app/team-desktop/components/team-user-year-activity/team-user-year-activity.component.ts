import { AllDayEventByYear, AdgedDebChartData, MatterChartData, BarChartData } from './../../../team-core/models/interface';
import { SummeryYearType, ChartType } from './../../../team-core/models/enum';

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dps-team-user-year-activity',
  templateUrl: './team-user-year-activity.component.html',
  styleUrls: ['./team-user-year-activity.component.scss']
})
export class TeamUserYearActivityComponent implements OnInit, OnChanges {

  @Input() columnDef;
  // @Input() adgedDebData: AdgedDebChartData;
  @Input() eventYearSummery: AllDayEventByYear[];
  public chartHeight = 350;
  public piechartHeight = 350;


  summeryYearType = SummeryYearType;
  matterOpenChart = ChartType.LineChart;
  constructor() { }

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

  public pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
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

  public adgedDebData: AdgedDebChartData;


  public barChartInfo: MatterChartData;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {

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

  // getAllowdCount(type): any {
  //   let allowd = 0;
  //   let taken = 0;
  //   let remain = 0;
  //   if (this.eventYearSummery) {
  //     this.eventYearSummery.forEach(a => {
  //       allowd += a.maxCount;
  //       taken += a.sumOfMovementCount;
  //       remain = allowd - taken;

  //     });

  //   }
  //   if (type === SummeryYearType.allowed) {
  //     return allowd;
  //   } else if (type === SummeryYearType.taken) {

  //     return taken;
  //   } else if (type === SummeryYearType.remain) {

  //     return remain;
  //   } else {
  //     return 0;
  //   }



  // }

}
