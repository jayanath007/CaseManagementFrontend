export interface AgedDebtorRespone {
    data: PieChartData[];
}

export interface PieChartData {
    amount: number;
    debtPeriod: string;
}

export interface DataRequestModel {
    users: string;
    month: number;
    department: number;
}

export interface AdgedDebChartData {
    data: PieChartData[];
    isLoading: boolean;
}
