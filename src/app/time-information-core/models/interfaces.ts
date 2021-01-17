import { ColumnDef } from './../../core/lib/grid-model';
import { StatusType } from '../../core/lib/request';
import { LookupType, LoockupItem } from '../../shared';
import { RatesKey } from './enum';

export interface CrimeClassRatesResponce {
    data: CrimeClassRates;
    Status: StatusType;
}
export interface CrimeClassRates {
    classRates: any;
    others: any;
}

export class TimeInformationParentModel {
    attTypeId?: number;
    feeEarner?: string;
    date?: string;
    custTemplates: boolean;
}
export class TimeInformationModel {
    timeId: number;
    fileId: number;
    branchId: number;
    appId: number;
    classId: number;
    feeEarner?: string;
    totVal?: string;
    diaryNote?: string;
    attTypeId?: number;
    attTypeText?: string;
    date?: string;

    vatFaresVal?: string;
    nonVatFaresVal?: string;
    parkingVal?: string;
    userControlText?: string;
    custTemplates?: boolean;

    waiting?: string;
    workDoneSep?: string;
    court?: string;

    attConf?: string;
    result?: string;
    morning?: boolean;
    morningIn?: string;
    morningOut?: string;
    afternoon?: boolean;
    aftIn?: string;
    aftOut?: string;

    attendees1?: string;
    attendees2?: string;
    attendees3?: string;
    hearingTp1?: string;
    hearingTp2?: string;
    hearingTp3?: string;
    policeSt?: string;
    workCourt?: string;
    workReasonTrv?: string;
    reason?: string;
    grade?: string;
    sectionRate?: boolean;
    nextHearingDateCheck?: boolean;
    nextHearingDate?: string;
    courtName?: string;
    specialPrepRate?: boolean;
    londonRate?: boolean;
    attendeesSep1?: string;
    attendeesSep2?: string;
    attendeesSep3?: string;
    noteLn?: string;
    claimCommittal?: boolean;
    nextAppDateCheck?: boolean;
    nextAppDate?: string;
    dutySol?: boolean;
    weekEndWork?: boolean;
    initDuty?: boolean;
    arrTime?: string;
    depTime?: string;

    vatFares?: string;
    nonVatFares?: string;
    parking?: string;
    diaryRef?: number;
    ownSol?: boolean;
    guid?: string;

    totalValueLA: string;
    disbursements: string;
    letter?: string;
    adciceAssistanceLimit?: number;
    adciceAssistanceCurrentTotal?: number;

    attendance?: string;
    attendanceVal?: string;
    attendanceRate?: string;

    attConfVal?: string;
    attConfRate?: string;

    feeErnHrsMin?: string;
    feeErnRate?: string;
    feeErnVal?: string;

    waitPS?: string;
    waitRatePS: string;
    waitValPS?: string;


    waitRate?: string;
    waitingVal?: string;

    mileage?: string;
    mileageRate?: string;
    mileageVal?: string;

    travelFrom?: string;
    travelFromRate?: string;
    travFromVal?: string;

    travelTo: string;
    travelToRate?: string;
    travToVal?: string;

    travel?: string;
    travRate?: string;
    travelVal?: string;

    adv?: string;
    adviAssi?: string;
    advAssiRate: string;
    advAssiVal?: string;

    advVal?: string;
    advRate?: string;
    advValue?: string;

    attCsl?: string;
    attCslRate?: string;
    attCslVal?: string;

    prep?: string;
    prepRate?: string;
    prepVal?: string;
    totalfeeErnTime?: string;
    listedAs?: string;
}

export interface TimeRecordGridResponce {
    data: TimeInformationModel[];
    Status: StatusType;
}

export interface RateChangeModel {
    crimeRateDate: string;
    crimeRateId: number;
    crimeRatePercentage: string;
}

export interface CrimeLookupData {
    [LookupType.COURT]?: LoockupItem[];
    [LookupType.LISTED_AS]?: LoockupItem[];
    [LookupType.WORK_DONE]?: LoockupItem[];
    [LookupType.HEARING_TYPES]?: LoockupItem[];
    [LookupType.COURT_CODES]?: LoockupItem[];
    [LookupType.POLICE_ST_CODES]?: LoockupItem[];
    [LookupType.HEARING_TYPES]?: LoockupItem[];
    [LookupType.ATTENDEE_CODES]?: LoockupItem[];
    [LookupType.NOTE_FIXTURE]?: LoockupItem[];
    [LookupType.REASON]?: LoockupItem[];
    [LookupType.PRISON_CODES]?: LoockupItem[];
    [LookupType.LEADUFN_MATTERS]?: LoockupItem[];
}

export interface TimeRecordGridInput {
    gridColumnDef: ColumnDef[];
    timeRecordsGridData: TimeInformationModel[];
    allData: boolean;
    selectedType: number;
}


export interface RateResponce {
    [date: string]: {
        attendanceType: string,
        timeTypeWithRate: Rates;
    }[];
}

export interface Rates {
    [RatesKey.ADVICE]: number;
    [RatesKey.ADVICEUS]: number;
    [RatesKey.ADVOCACY]: number;
    [RatesKey.CALLSIN]: number;
    [RatesKey.CALLSOUT]: number;
    [RatesKey.LETIN]: number;
    [RatesKey.LETOUT]: number;
    [RatesKey.MILEAGERATE1]: number;
    [RatesKey.PREPATT]: number;
    [RatesKey.TELADVICE]: number;
    [RatesKey.TRAVELLING]: number;
    [RatesKey.TRAVELLINGFROM]: number;
    [RatesKey.TRAVELLINGFROMUS]: number;
    [RatesKey.TRAVELLINGTO]: number;
    [RatesKey.TRAVELLINGTOUS]: number;
    [RatesKey.WAITING]: number;
    [RatesKey.WAITINGUS]: number;
    [RatesKey.ATTWITHCOUNSEL]: number;
    [RatesKey.ATTENDANCE]: number;
    [RatesKey.MILEAGERATE2]: number;
    [RatesKey.PREPARATION]: number;
}

export interface RateSource {
    [classId: number]: RateResponce;
}






