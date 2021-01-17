
export interface ScreenEditNodes {
    id: number;
    name: string;
    children: ScreenEditNodes[];
}

export interface ScreenEditUpdateSuccessInfo {
    data: boolean;
    messageBody: string;
    status: string;
}


