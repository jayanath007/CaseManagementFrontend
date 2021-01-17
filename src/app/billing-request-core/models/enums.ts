
export enum PopupOpenMode {
    Edit = 'Edit',
    New = 'Add',
}
export enum RequestFormTypes {
    selectTime = 'Time',
    selectDisbursement = 'Disbursement',
    profitCost = 'Profit Cost',
    expense = 'Expense'
}
export enum RowUpdateStatus {
    Select = 'Select',
    Unselect = 'Unselect',
    WriteOff = 'WriteOff',
}
export enum BillingOptions {
    quickBillToDate = 'QuickBillToDate',
    quickBillToAmount = 'QuickBillToAmount',
    quickBillEverything = 'QuickBillToAmount',
    billSelectTime = 'QuickBillToAmount',
}
export enum ImportGridIsSelectVal {
    selected = 'OK',
    unSelected = 'NO',
    WriteOff = 'W/O',
}
export enum RecordTypes {
    TimeType = 'Time',
    ProfitCost = 'P', // ProfitCost
    Disbursment = 'Disbursment',
    Expense = 'E', // Expense,
    WriteOff = 'W/O' // Expense
}
export enum AddressType {
    Correspondence = 'C',
    Statement = 'S',
    Billing = 'B',
    Other = 'O',
}
export enum PrintStateControllers {
    chkShowTimeBreakdown = 'chkShowTimeBreakdown',
    chkShowDisbBreakdown = 'chkShowDisbBreakdown',
    chkGroupTimeReportByFeeEarner = 'chkGroupTimeReportByFeeEarner',
    chkShowGrandTotal = 'chkShowGrandTotal',
    chkShowFESubTotals = 'chkShowFESubTotals',
    chkShowValues = 'chkShowValues',
    chkShowTimeNotes = 'chkShowTimeNotes',
    chkShowMinutes = 'chkShowMinutes',
    chkPromptForMoneyOnAccount = 'chkPromptForMoneyOnAccount',
    chkShowTimeDates = 'chkShowTimeDates',
    chkShowTimeDetails = 'chkShowTimeDetails',
    bIL_ShowPreviousDPB = 'bIL_ShowPreviousDPB',
    billDropDownSelectedData = 'billDropDownSelectedData',
    timeDropDownSelectedData = 'timeDropDownSelectedData',
    disbDropDownSelectedData = 'disbDropDownSelectedData',
}
export enum SaveButtonTypeText {
    Print = 'Print',
    Request = 'Request',
    Post = 'Post'
}
export enum AddewssChangeView {
    address1 = 'address1',
    address2 = 'address2',
    address3 = 'address3',
    address4 = 'address4',
    postCode = 'postcode',
}
export enum DropDownPropertyName {
    Nominal = 'Nominal',
    FeeEarner = 'FeeEarner'
}
export enum BillingRequestReportType {
    Request = 'Request',
    Print = 'Print',
    Post = 'Post',
}

