export enum GradeList {
    'a' = 'A',
    'b' = 'B',
    'c' = 'C'
}

export enum ButtonAction {
    New = 'NEW',
    Save = 'SAVE',
    Print = 'PRINT',
    Delete = 'DELETE'
}

export enum DocumentFlowStatus {
    Unopened = 0,
    SentForReview = 10,
    Approved = 20,
    AttachedToDiary = 30,
    SendForPrint = 40,
    Rescheduled = 50,
    Pending = 60,
    Completed = 200,
    RejectedBill = 1000,
    External = 2000,
}

export enum WorkflowActions {
    Complete = 10,
    Review = 20,
    Approve = 30,
    SendForPrint = 40,
    Reschedule = 50,
    AttachToDiary = 60,
    RejectBill = 70,
}








