import { MatterTypeEnum } from './enums';

export interface Month {
    monthId: number;
    monthName: string;
}

export interface Department {
    groupId: number;
    groupName: string;
}


export interface TimeRecordRespone {
    data: BarChartData[];
}

export interface AdgedDeb {
    amount: number;
    debtPeriod: string;
}

export interface AdgedDebRespone {
    data: AdgedDeb[];
}

export interface TimeRecordRespone {
    data: BarChartData[];
}

export interface AdgedDebChartData {
    data: AdgedDeb[];
    isLoading: boolean;
    title: string;
}

export interface BilledTime {
    currentYear: number;
    lastYear: number;
    month: string;
    target: number;
}

export interface BilledTimeRespone {
    data: BilledTime[];
}

export interface BilledTimeChartData {
    data: BilledTime[];
    isLoading: boolean;
    title: string;
}

export interface CashRecivedRespone {
    data: CashRecived[];
}

export interface CashRecived {
    currentYear: number;
    lastYear: number;
    month: string;
    target: number;
}

export interface CashReceivedChartData {
    data: CashRecived[];
    isLoading: boolean;
    title: string;
}

export interface MatterRespone {
    data: BarChartData[];
}


export interface MatterChartData {
    data: BarChartData[];
    isLoading: boolean;
    title: string;
}

export interface MatterType {
    type: MatterTypeEnum;
}


export interface BarChartData {
    currentYear: number;
    lastYear: number;
    month: string;
    target: number;
}

export interface Activity {
    user: number;
    month: number;
    department: string;
    year: number;


}

// export interface AllDayEventByYear {
// //   forEach(arg0: (i: any) => void);
//   eventCountWithMonth: EventCountWithMonth[];
//   maxCount: number;
//   sumOfMovementCount: number;
//   userMovementTypeID: number;
//   movementTypeDes: string;
// }
// export interface EventCountWithMonth {
//     month: string;
//     eventCount: number;
// }

export interface AllDayEventByYear {
    allDayEvents: EventCountWithMonth[];
    allDayEventSum: AllDayEventSum[];
    // sumOfMovementCount: number;
    // userMovementTypeID: number;
}
export interface EventCountWithMonth {

    month: string;
    allDayEvent: AllDayEvent[];
}

export interface AllDayEvent {
    userMovementTypeId: number;
    movementTypeDes: string;
    eventCount: number;
}
export interface CurrentActivitySum {
    maxCount: number;
    sumOfMovementCount: number;
    userMovementTypeId: number;

}


export interface AllDayEventSum {

    userMovementTypeId: number;
    sumOfMovementCount: number;
    maxCount: number;

}



