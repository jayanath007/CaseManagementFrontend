import { DataSourceRequestViewModel } from '../../file-history-core/models/file-history-request';

export interface TimesFinancialFigure {
  billNo: number;
  billed: boolean;
  classId: number;
  crimeTimeId: number;
  dateBilled: string;
  dateDone: string;
  description: string;
  details: string;
  eBilling: string;
  eBillingActivityID: string;
  eBillingPhaseID: string;
  eBillingTaskID: string;
  feeEarner: string;
  mpu: number;
  netBilled: string;
  postingDate: string;
  rate: string;
  subClassId: string;
  timeUniqueRef: string;
  unBilled: number;
  units: number;
  usUnits: any;
  value: number;
  workType: any;
}
export interface TimesFinancialFiguresResponse {
  data: TimesFinancialFigure; // { DateLastBill: string, UnpaidBill: number, ClientBal: number, WIPSum: number, WIPLimit: number };
  status: string;
}



export class ScreensContactTypeRequest {
  constructor(public appId: number,
    public dataSourceInfo: DataSourceRequestViewModel) { }

  public toPost() {
    return {
      dataSourceRequestViewModel: this.dataSourceInfo,
      appId: this.appId,
    };
  }
}

// export interface FdDetails {
//   billedAmount: number;
//   unBilledAmount: number;
// }

export interface ScreensContactType {
  screenId: string;
  roleOnFile: string;
  contactTypeId: number;
}


export interface BannerMsgResponce {
  id: number;
  message: string;

}



