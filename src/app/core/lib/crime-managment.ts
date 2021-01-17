import { CrimeClassIdentityViewModel, ClassType, AttType } from './timeRecord';
import { ClassObj } from './../../crime-management-core/models/interfaces';
import { Matter } from './matter';
import { LookupType } from '../../shared';
import { RateResponce, Rates } from '../../time-information-core';


export interface CrimeManagementInitials {
  MatterInfo: Matter;
}

export interface CrimeManagementBoostrapComponent {
  token: string;
  inputData: CrimeManagementInitials;
}

export interface CrimeClassInforComponent {
  token: string;
  inputData: CrimeClassInforInitials;
}
export interface CrimeClassInforInitials {
  MatterInfo: Matter;
  CrimeClassInforType: CrimeClassInforType;
}

export enum CrimeClassInforType {
  Proceeding = 'Proceeding',
  InvestigationClass = 'InvestigationClass'
}

export enum OpenType {
  Edit = 'Edit',
  New = 'New',
}

export interface TimeInformationInputData {
  matterReferenceNo: string;
  branchId: number;
  fileId: number;
  appId: number;
  classId?: number;
  isEdit: boolean;
  crimeTimeId: number;
  ufnDate: string;
  classList?: ClassObj[];
}

export interface CrimeManagementInput {
  matterReferenceNo: string;
  branchId: number;
  appId: number;
  fileId: number;
  ufnValue: string;
  classList?: ClassObj[];
}

export interface FeeEarner {
  id: number;
  userCCGrade: string;
  userId: string;
  userRate: number;
  selected?: boolean;
}

export interface FeeEarnerResponce {
  data: FeeEarner[];
  Status: StatusType;
}

export enum StatusType {
  Fail = 0,
  Success = 1,
}


export class CrimeClassRequest {
  constructor(
    public branchId: number,
    public fileId: number,
    public classId: number
  ) { }

  public CrimeClassIdentityViewModel() {
    return {
      branchId: this.branchId,
      fileId: this.fileId,
      classId: this.classId
    };
  }
}

export class CrimeTimeSettings {
  crimeSettings: { IsCheckedLondonRate: boolean, IsCrimeSupervisor: boolean, IsClassClosed: boolean };
  mpu: number;
  policeStation: string;
  repOderDate: string;
  ufnDate: string;
}

export function storeCrimeTimeDataKey(model: CrimeClassIdentityViewModel): string {
  return `${model.branchId}-${model.fileId}-${model.fileId}`;
}

export interface CCInvestigationInfoInput {
  appId: number;
  fileId: number;
  classObj: ClassObj;
  ufn: string;
  isRecursiveFormDisplay: boolean;
}

export interface CrimeProceedingClassInfoInput {
  crimeClassIdentityViewModel: CrimeClassIdentityViewModel;
  ufnValue: string;
}

export interface DropDownItem {
  key: string;
  value: string;
}

export interface CrimeLookUpFiled {
  title: string;
  secondTitle: string;
}

export const CRIME_LOOKUP_FILEDS: Record<LookupType, CrimeLookUpFiled> = {
  [LookupType.COURT]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
  [LookupType.LISTED_AS]: { title: 'Crime Lookups', secondTitle: 'Listed As' },
  [LookupType.WORK_DONE]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
  [LookupType.COURT_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
  [LookupType.POLICE_ST_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
  [LookupType.MA_COURT_CODES]: { title: 'Crime Lookups', secondTitle: 'Location' },
  [LookupType.POLICE_ST_USER_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
  [LookupType.HEARING_TYPES]: { title: 'Crime Lookups', secondTitle: 'Hearing Types' },
  [LookupType.ATTENDEE_CODES]: { title: 'Crime Lookups', secondTitle: 'Attendee Code' },
  [LookupType.NOTE_FIXTURE]: { title: 'Crime Lookups', secondTitle: 'Note' },
  [LookupType.REASON]: { title: 'Crime Lookups', secondTitle: 'Reason' },
  [LookupType.PRISON_CODES]: { title: 'Crime Lookups', secondTitle: 'Work Name' },
  [LookupType.LEADUFN_MATTERS]: { title: 'Crime Lookups', secondTitle: 'Work Name' }
};

export enum SummeryViewType {
  ProfitCost = 'profitCostSummary',
  Travel = 'travelSummary',
  Waiting = 'waitingSummary',
  Disbursements = 'disbursementSummary',
  FeeEarnerTotal = 'feeEarnerTotalSummary',
}

export interface ControlerProperty {
  readonly [token: string]: {
    enabled: boolean;
    visible: boolean;
  };
}
// enableAgfs
// **  this is tempery filter, **need to remove after clarification
export function filterClassType(classType: ClassObj[], enableAgfs = false): ClassObj[] {
  if (!!classType && classType.length > 0) {
    if (enableAgfs) {
      return classType.filter(i => i.rectype === 3 || i.rectype === 4 || i.rectype >= 100 && i.rectype <= 119);
    }
    return classType.filter(i => i.rectype === 3 || i.rectype === 4);
  }
  return [];
}

export function filterAttTypeList(attTypeList: AttType[], selectedClassId: number): AttType[] {
  if (!!selectedClassId && selectedClassId === 4 && attTypeList && attTypeList.length > 0) {
    return attTypeList.filter(i => i.attId < 6);
  }
  return attTypeList;
}

export enum Validation {
  ufnDateCloseDate = 'Class open date cannot be before UFN Date',
  openDateCloseDate = 'Class open date cannot be after class close date, shall I set close date to be the same as open date?',
  billDate = 'Cannot close class without a billed date',
  billDateOpenDate = 'Billed date cannot be before date opened',
  ufnDateValidation = 'Please update UFN value on the matter',
  policeStationId = 'Add police station ID',
  needIC2Record = 'Cannot close class without an IC-2 Police Station Advi + Assi time record for this stage code',
  billDateCloseDate = 'Billed date cannot be before date close'
}

export class ClassListRequest {
  constructor(public branchId: number,
    public appId: number,
    public fileId: number,
    public displayDataString?: string) { }

  public DataRequestToPost() {
    return {
      branchId: this.branchId,
      appId: this.appId,
      fileId: this.fileId,
      displayDataString: this.displayDataString
    };
  }
}


export interface CrimeClassTotalsSummaryViewModel {
  disbursementSummary: BreakdownsSummaryViewModel;
  profitCostSummary: BreakdownsSummaryViewModel;
  travelSummary: BreakdownsSummaryViewModel;
  waitingSummary: BreakdownsSummaryViewModel;
  feeEarnerTotalSummary: FeeEarnerTotalBreakdownsSummaryViewModel;
}

export interface BreakdownsSummaryViewModel {
  summaryTotals: BreakDownViewModel[];
  netTotal: number;
  vatTotal: number;
  grossTotal: number;
}

export interface BreakDownViewModel {
  description: string;
  rate: number;
  units: string;
  net: number;
  vaT: number;
  gross: number;
}

export interface FeeEarnerTotalBreakdownsSummaryViewModel {
  summaryTotals: FeeEarnerAttendanceViewModel[];
  feeEarnerTotal: number;
  legalAidTotal: number;
}

export interface FeeEarnerAttendanceViewModel {
  feeEarner: string;
  hrsMin: string;
  hrsRate: number;
  callLetUnits: number;
  callLetUnitRate: number;
  feeErnVal: number;
  legalAidVal: number;
}


export function getRunTimeCaseTypeList(caseTypes: DropDownItem[], stageReached: string): DropDownItem[] {
  const tempList: DropDownItem[] = [];
  if (!!caseTypes && caseTypes.length > 0) {
    caseTypes.forEach(i => {
      switch (stageReached) {
        case 'PROC':
        case 'PROE':
        case 'PROF':
        case 'PROG':
        case 'PROH':
        case 'PROI':
        case 'PROK':
        case 'PROL':
        case 'PROM':
        case 'PROP':
        case 'PROT':
        case 'PROU':
          {
            if (i.key === '(1)') {
              tempList.push({ ...i, value: `${i.value} (Either Way)` });
              tempList.push({ ...i, value: `${i.value} (Summary only)` });
            } else if (i.key === '(2)' || i.key === '(N)') {
              tempList.push(i);
            }
          }
          break;
        case 'PROV':
          {
            if (i.key === '(U)' || i.key === '(C)') {
              tempList.push(i);
            }
            break;
          }
        default:
          break;
      }
    });
  }
  return tempList;
}


export function getRateForDate(ratesDataSource: RateResponce, dateToCheck: string, attendanceTypekey: string): Rates {
  if (!!ratesDataSource) {
    let selectedItems: { attendanceType: string, timeTypeWithRate: Rates; }[];
    // tslint:disable-next-line: forin
    for (const key in ratesDataSource) {
      if (new Date(key) < new Date(dateToCheck)) {
        selectedItems = ratesDataSource[key];
      }
    }

    if (selectedItems && selectedItems.length > 0) {
      const selectedItem = selectedItems.find(i =>
        i.attendanceType.toLocaleLowerCase() === attendanceTypekey.toLocaleLowerCase());
      return selectedItem ? selectedItem.timeTypeWithRate : null;
    }
  }
  return null;
}

