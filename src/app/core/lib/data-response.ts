export interface DPSResponse<T> {
    data: T;
    status: string;
    messageBody: string;
    messageHeader: string;
    detailStatus: DetailStatusViewModel[];
    // totalBillOutstandingBalance: number;
    // totalMatterCount: number;
}
export interface DetailStatusViewModel {
    Code: string;
    message: string;
    Reference: string;
    MessageType: string;
    SeverityLevel: string;
    ExceptionType: string;
}


