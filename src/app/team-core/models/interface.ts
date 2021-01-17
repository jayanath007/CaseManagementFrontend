import { DayUserMovements } from './../../user-movement-core/models/interfaces';
import { Moment } from 'moment';
import { ScheduleInformation } from '../../core/lib/microsoft-graph';



export interface SelectedYearAndMonth {
    selectedYear: Moment;
    selectedMonth: Moment;
}
export interface TeamUserRequest {
    user?: string;
    departmentId?: number;
    // userNameSearch?: string;
    isInactiveFeeEarners?: boolean;
    membereSearchText?: string;
}

export interface MonthActivity {
    dateTime: string;
    userDes: string;
    userId: string;
    userMovementTypeId: number;
}

export interface UserRequestViewModel {
    userId: string;
    year: number;
    month?: number;
    day?: number;
}

export interface UserRequestByDepartmentViewModel {
    departmentId: string;
    year: number;

}



export interface UserMovementTypesWithDaysResponce {
    userMovementTypesWithDays: MonthActivityResponce;
    holiDays: Holydays[];
}


export interface MonthActivityResponce {
    day: number;
    userMovementTypes: UserMovementTypes[];
}

export interface UserMovementTypes {
    key: number;
    value: string;
}

export interface Holydays {
    key: number;
    value: string;
}


export interface TeamMemberResponse {
    aggregates: string;
    data: TeamMember[];
    total: number;
}

export interface Department {
    readonly groupId: number;
    readonly groupName: string;
}

export interface TeamMember {
    userId: number;
    user: string;
    fullName: string;
    userMobileNo: string;
    userEmail: string;
    directDialNo: string;
    jobTitle: string;
    path: string;
    designation: string;
    enabled: number;
    selected: boolean;
    lastMovement?: MonthActivity;
    dayMovements?: CurrentDayUserMovement;
    calanderEvents?: ScheduleInformation;
}


export interface CurrentDayUserMovement {
    userId: string;
    userMovements: DayUserMovements[];


}

export interface AdgedDebChartData {
    data: AdgedDeb[];
    isLoading: boolean;
    title: string;
}
export interface AdgedDeb {
    amount: number;
    debtPeriod: string;
}


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

export interface AllDayEventSum {

    userMovementTypeId: number;
    sumOfMovementCount: number;
    maxCount: number;

}


export interface ActivityMembersResponse {
    aggregates: string;
    data: ActivityMembers[];
    total: number;
}


export interface ActivityMembers {
    user: string;
    fullName: string;
    userMobileNo: string;
    userEmail: string;
    title: string;
    country: string;
    city: string;
    address: string;
    homePhone: string;
    notes: string;
    path: string;
    designation: string;
    enabled: number;
    selected: boolean;
}

export interface DayActivity {
    dateTime: string;
    notes: string;
    userDes: string;
    userId: string;
    userMovementTypeId: number;
}
export interface DropdownListData {
    key: number;
    value: string;
}





export interface MatterChartData {
    data: BarChartData[];
    isLoading: boolean;
    title: string;
}


export interface BarChartData {
    currentYear: number;
    lastYear: number;
    month: string;
    target: number;
}
