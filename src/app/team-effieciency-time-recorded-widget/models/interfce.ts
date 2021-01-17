export interface TimeRecordRespone {
    data: BarChartData[];
}

export interface BarChartData {
    currentYear: number;
    lastYear: number;
    month: string;
    target: number;
}

export interface DataRequestModel {
    user: string;
    month: number;
    option: string;
    department: number;
}
