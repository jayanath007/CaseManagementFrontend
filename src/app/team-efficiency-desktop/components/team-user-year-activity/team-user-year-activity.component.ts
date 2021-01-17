import { AllDayEventByYear, AdgedDebChartData, MatterChartData } from './../../../team-core/models/interface';
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
  @Input() eventYearSummery: AllDayEventByYear;
  public chartHeight = 300;
  public piechartHeight = 300;


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

  public holidayadgedDebData: AdgedDebChartData;
  public trainningdgedDebData: AdgedDebChartData;
  public sickDays: number;
  public trainning: number;


  public barChartInfo: MatterChartData;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventYearSummery) {
      //  let piChartDatatemp: { amount: number, debtPeriod: string }[] = [];
      //  let barChartDatatemp: BarChartData[] = [];
      this.holidayadgedDebData = null;
      this.trainningdgedDebData = null;
      this.sickDays = 0;
      if (!!this.eventYearSummery && this.eventYearSummery.allDayEvents.length > 0) {
        const Holi = this.eventYearSummery.allDayEventSum.find(f => f.userMovementTypeId === 8);

        if (Holi) {
          this.holidayadgedDebData = {
            data: [{ amount: Holi.sumOfMovementCount, debtPeriod: 'Holiday' },
            { amount: Holi.maxCount !== 0 ? (Holi.maxCount - Holi.sumOfMovementCount) : 0, debtPeriod: 'Remain' }],
            isLoading: false,
            title: 'Holiday'
          };

        } else {

          this.holidayadgedDebData = {
            data: [{ amount: 0, debtPeriod: 'Holiday' },
            { amount: 0, debtPeriod: 'Remain' }],
            isLoading: false,
            title: 'Holiday'
          };

        }

        // const Tra = this.eventYearSummery.find(f => f.userMovementTypeID === 10);
        // if (Tra) {
        //   this.trainningdgedDebData = {
        //     data: [{ amount: Tra.sumOfMovementCount ? Tra.sumOfMovementCount : 0, debtPeriod: 'Trainning' },
        //     { amount: Tra.maxCount - Tra.sumOfMovementCount, debtPeriod: 'Remain' }],
        //     isLoading: false,
        //     title: 'Trainning'
        //   };

        // } else {

        //   this.trainningdgedDebData = {
        //     data: [{ amount: 0, debtPeriod: 'Trainning' },
        //     { amount: 0, debtPeriod: 'Remain' }],
        //     isLoading: false,
        //     title: 'Trainning'
        //   };

        // }

        const tra = this.eventYearSummery.allDayEventSum.find(f => f.userMovementTypeId === 10);

        if (tra) {

          this.trainning = tra.sumOfMovementCount;
        } else {
          this.trainning = 0;

        }

        const sick = this.eventYearSummery.allDayEventSum.find(f => f.userMovementTypeId === 7);

        if (sick) {

          this.sickDays = sick.sumOfMovementCount;
        } else {
          this.sickDays = 0;

        }

        // this.eventYearSummery.forEach(i => {

        //   this.trainningdgedDebData = {
        //     data: [{ amount: 50, debtPeriod: 'aa' }, { amount: 50, debtPeriod: '' }],
        //     isLoading: false,
        //     title: this.getMovementDesc(i.userMovementTypeID)
        //   };

        //   piChartDatatemp = piChartDatatemp.concat({
        //     amount: i.sumOfMovementCount,
        //     debtPeriod: this.getMovementDesc(i.userMovementTypeID)
        //   });




        // });




        // this.eventYearSummery.forEach(i => {
        //   barChartDatatemp = [{
        //     currentYear: 10,
        //     lastYear: 10,
        //     target: 10,
        //     month: 'Jan',

        //   }, {
        //     currentYear: 10,
        //     lastYear: 2,
        //     target: 3,
        //     month: 'Feb',

        //   }, {
        //     currentYear: 10,
        //     lastYear: 4,
        //     target: 2,
        //     month: 'March',

        //   }, {
        //     currentYear: 10,
        //     lastYear: 5,
        //     target: 4,
        //     month: 'April',

        //   }, {
        //     currentYear: 10,
        //     lastYear: 8,
        //     target: 5,
        //     month: 'May',

        //   }, {
        //     currentYear: 6,
        //     lastYear: 3,
        //     target: 8,
        //     month: 'June',

        //   }, {
        //     currentYear: 1,
        //     lastYear: 5,
        //     target: 4,
        //     month: 'July',

        //   }, {
        //     currentYear: 9,
        //     lastYear: 5,
        //     target: 2,
        //     month: 'April',

        //   }, {
        //     currentYear: 6,
        //     lastYear: 1,
        //     target: 5,
        //     month: 'Augest',

        //   }, {
        //     currentYear: 10,
        //     lastYear: 5,
        //     target: 6,
        //     month: 'Oct',

        //   }, {
        //     currentYear: 10,
        //     lastYear: 9,
        //     target: 2,
        //     month: 'Nov',

        //   }, {
        //     currentYear: 8,
        //     lastYear: 3,
        //     target: 1,
        //     month: 'Dec',

        //   }];
        // });


        // this.adgedDebData = {
        //   data: piChartDatatemp, // { amount: 50, debtPeriod: 'aa' }, { amount: 50, debtPeriod: 'bb' }
        //   isLoading: false,
        //   title: 'ABCD'
        // };
        // this.barChartInfo = {
        //   data: barChartDatatemp,
        //   isLoading: false,
        //   title: 'DDD'
        // };





      }

    }
  }


  // getMovementDesc(typeId) {
  //   switch (typeId) {
  //     case 5:
  //       return 'Training';
  //       break;
  //     case 7:
  //       return 'Sick';
  //       break;
  //     case 8:
  //       return 'Holiday';
  //       break;


  //   }
  // }

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


  // getPieData(Id) {



  //   if (this.eventYearSummery) {
  //     const key = this.eventYearSummery.find(f => f.userMovementTypeID === Id);
  //  const PieData  = {
  //       data: [{ amount: key.sumOfMovementCount, debtPeriod: 'Holiday' }, { amount: 50, debtPeriod: 'Remaining' }],
  //       isLoading: false,
  //       title: 'Holiday'
  //     };

  //     return PieData;
  //     // return this.adgedDebData = {
  //     //   data: [{ amount: key.sumOfMovementCount, debtPeriod: 'Holiday' }, { amount: 50, debtPeriod: 'Remaining' }],
  //     //   isLoading: false,
  //     //   title: 'Holiday'
  //     // };



  //   }
  // }




}
