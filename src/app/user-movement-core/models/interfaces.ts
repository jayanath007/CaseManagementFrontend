
import { ScheduleItem, FreeBusyError, WorkingHours } from '../../core/lib/microsoft-graph';



export interface CurrentDayUserMovement {
    userId: string;
    userMovements: DayUserMovements[];


}

export interface NextAvailableMovementType {
    movementTypeId: number;
    movementTypeDes: string;
    isAllDayMovementType: boolean;
    parentId: number;
}



export interface DayUserMovements {
    dateTime: string;
    notes: string;
    userDes: string;
    userId: string;
    userMovementTypeId: number;
    location: string;
    isAllDayMovementType: boolean;
    isHalfDayMovementType: boolean;
    userMovementType: string;
    width?: string;
    endTime?: string;
    duration?: number;
}

// export interface DisplayDayUserMovements extends DayUserMovements {
//     width?: string;
//     endTime?: string;
//     duration?: number;
// }




export interface AddMovementDetailsViewModel {
    fromDate?: string;
    toDate?: string;
    notes: string;
    userId: string;
    userMovementTypeId: number;
    location: string;

}

