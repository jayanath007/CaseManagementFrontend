import { AllDayEventByYear } from './../../../team-core/models/interface';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dps-team-user-grid-row',
  templateUrl: './team-user-grid-row.component.html',
  styleUrls: ['./team-user-grid-row.component.scss']
})
export class TeamUserGridRowComponent implements OnInit {

  @Input() eventYearSummery: AllDayEventByYear;



  // summery =
  //   {
  //     'allDayEvents': [
  //       {
  //         'month': 'Apr',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'May',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Jun',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Jul',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Aug',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Sep',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Oct',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 2
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 1
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 1
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Nov',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Dec',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Jan',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Feb',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Mar',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 1
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       },
  //       {
  //         'month': 'Apr',
  //         'allDayEvent': [
  //           {
  //             'userMovementTypeId': 7,
  //             'movementTypeDes': 'Sick',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 8,
  //             'movementTypeDes': 'Holiday',
  //             'eventCount': 0
  //           },
  //           {
  //             'userMovementTypeId': 10,
  //             'movementTypeDes': 'Training (AllDay)',
  //             'eventCount': 0
  //           }
  //         ]
  //       }
  //     ],
  //     'allDayEventSum': [
  //       {
  //         'userMovementTypeId': 7,
  //         'sumOfMovementCount': 2,
  //         'maxCount': 1596
  //       },
  //       {
  //         'userMovementTypeId': 8,
  //         'sumOfMovementCount': 2,
  //         'maxCount': 100
  //       },
  //       {
  //         'userMovementTypeId': 10,
  //         'sumOfMovementCount': 1,
  //         'maxCount': 0
  //       }
  //     ]
  //   };
  //  summery = [{
  //   month:'10/2018',
  //   values: [
  //       {
  //           'userMovementTypeId': 7,
  //           'movementTypeDes': 'Sick',
  //           'eventCount': 2
  //       },
  //       {
  //           'userMovementTypeId': 8,
  //           'movementTypeDes': 'Holiday',
  //           'eventCount': 1
  //       },
  //       {
  //           'userMovementTypeId': 10,
  //           'movementTypeDes': 'Training (AllDay)',
  //           'eventCount': 1
  //       }
  //     ]},{
  //   month:'11/2018',
  //   values: [{
  //           'userMovementTypeId': 7,
  //           'movementTypeDes': 'Sick',
  //           'eventCount': 2
  //       },
  //       {
  //           'userMovementTypeId': 8,
  //           'movementTypeDes': 'Holiday',
  //           'eventCount': 1
  //       },
  //       {
  //           'userMovementTypeId': 10,
  //           'movementTypeDes': 'Training (AllDay)',
  //           'eventCount': 1
  //       }]},
  //  month: '12/2018',
  //  value: [ {
  //           'userMovementTypeId': 7,
  //           'movementTypeDes': 'Sick',
  //           'eventCount': 2
  //       },
  //       {
  //           'userMovementTypeId': 8,
  //           'movementTypeDes': 'Holiday',
  //           'eventCount': 1
  //       },
  //       {
  //           'userMovementTypeId': 10,
  //           'movementTypeDes': 'Training (AllDay)',
  //           'eventCount': 1
  //       }]
  // }];


  // summery = [{
  //   eventCountWithMonth: [{ month: 'jan', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 },
  //   { month: 'jan', 'eventCount': 2 }, { month: 'feb', 'eventCount': 5 }, { month: 'jan', 'eventCount': 2 },
  //   { month: 'jan', 'eventCount': 2 }, { month: 'March', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 }],
  //   maxCount: 5,
  //   sumOfMovementCount: 4,
  //   userMovementTypeID: 2,

  // }, {
  //   eventCountWithMonth: [{ month: 'jan', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 },
  //   { month: 'jan', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 },
  //   { month: 'jan', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 }, { month: 'june', 'eventCount': 6 }],
  //   maxCount: 5,
  //   sumOfMovementCount: 4,
  //   userMovementTypeID: 2,

  // }, {
  //   eventCountWithMonth: [{ month: 'jan', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 },
  //   { month: 'jan', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 }, { month: 'jan', 'eventCount': 2 },
  //   { month: 'jan', 'eventCount': 2 }, { month: 'March', 'eventCount': 5 }, { month: 'jan', 'eventCount': 2 }],
  //   maxCount: 5,
  //   sumOfMovementCount: 4,
  //   userMovementTypeID: 2,

  // }];
  constructor() { }

  ngOnInit() {


    // this.aa = this.aa + this.maxCount;
    // this.aa =  this.item.maxCount - this.item.sumOfMovementCount;
  }
  getMovementDesc(typeId) {
    switch (typeId) {
      case 10:
        return 'Training';
        break;
      case 7:
        return 'Sick';
        break;
      case 8:
        return 'Holiday';
        break;

        default:
          return 'Movement';

    }
  }
  // getMonthCol() {


  //   return this.summery[0].eventCountWithMonth.map(i => i.month);


  // }





  // eventCountWithMonth: EventCountWithMonth[];
  // maxCount: number;
  // sumOfMovementCount: number;
  // userMovementTypeID: number;

  // countSummury(taken,allowed){



  // }



}
