import { eBillingType } from './../../core/lib/matter';

import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import {
    TimeRecordInputData, TimeRecordingMsg, WorkType, Phase, Activiti,
    PhaseWiseTask,
    TimeRecordingInfo,
    ClientMatterData,
    PrecedentHRates, DiaryFileDetails
} from '../models/interfaces';
import { FeeEarner } from '../../core/lib/fee-earner';
import { StopStartInfo } from '../models/enum';


export const INIT_TIME_RECORDING = 'TIME_RECORDINGINIT_TIME_RECORDING';
export const INIT_TIME_RECORDING_SUCCESS = 'TIME_RECORDINGINIT_TIME_RECORDING_SUCCESS';


export const REQUEST_TIME_RECORDING_INFO = 'TIME_RECORDINGREQUEST_TIME_RECORDING_INFO';
export const LOAD_TIME_RECORDING_INFO = 'TIME_RECORDINGLOAD_TIME_RECORDING_INFO';

export const LOAD_DEFULT_FEEEARNER_SUCCESS = 'TIME_RECORDINGLOAD_DEFULT_FEEEARNER_SUCCESS';

export const LOAD_FEEEARNER_LIST = 'TIME_RECORDINGLOAD_FEEEARNER_LIST';
export const LOAD_FEEEARNER_LIST_SUCCESS = 'TIME_RECORDINGLOAD_FEEEARNER_LIST_SUCCESS';

export const CHANGE_UNIT = 'TIME_RECORDINGCHANGE_UNIT';
export const CHANGE_RATE = 'TIME_RECORDINGCHANGE_RATE';
export const CHANGE_FEEEARNER = 'TIME_RECORDINGCHANGE_FEEEARNER';
export const CHANGE_UNCHARGE = 'TIME_RECORDINGCHANGE_UNCHARGE';
export const CHANGE_DATE = 'TIME_RECORDINGCHANGE_DATE';
export const CHANGE_DETAILS = 'TIME_RECORDINGCHANGE_DETAILS';
export const CHANGE_NOTE = 'TIME_RECORDINGCHANGE_NOTE';

export const SUBMIT_TIME_RECORD = 'TIME_RECORDINGSUBMIT_TIME_RECORD';
export const TIME_RECORD_VALIDATION = 'TIME_RECORDINGTIME_RECORD_VALIDATION';
export const SAVE_WITHOUT_SUBMIT_TIME_RECORD = 'SAVE_WITHOUT_SUBMIT_TIME_RECORD';

export const SAVE_TIME_RECORD = 'TIME_RECORDINGSAVE_TIME_RECORD';
export const TIME_RECORD_SAVE_SUCCESS = 'TIME_RECORDINGTIME_RECORD_SAVE_SUCCESS';
export const TIME_RECORDING_ERROR = 'TIME_RECORDINGTIME_RECORDING_ERROR';

export const TIME_RECORDING_CLOSE = 'TIME_RECORDINGTIME_RECORDING_CLOSE';
export const SET_EDIT_DATA = 'TIME_RECORDINGTIME_RECORDING_SET_EDIT_DATA';
// eBilling Comment
export const LOAD_TIME_WORK_TYPE_LIST = 'TIME_RECORDINGLOAD_TIME_WORK_TYPE_LIST';
export const LOAD_TIME_WORK_TYPE_LIST_SUCCESS = 'TIME_RECORDINGLOAD_TIME_WORK_TYPE_LIST_SUCCESS';
export const LOAD_TIME_WORK_TYPE_LIST_FAIL = 'TIME_RECORDINGLOAD_TIME_WORK_TYPE_LIST_FAIL';
export const CHANGE_TIME_WORK_TYPE_LIST = 'TIME_RECORDINGCHANGE_TIME_WORK_TYPE_LIST';
export const LOAD_TIME_PHASE_LIST = 'TIME_RECORDINGLOAD_TIME_PHASE_LIST';
export const LOAD_TIME_PHASE_LIST_SUCCESS = 'TIME_RECORDINGLOAD_TIME_PHASE_LIST_SUCCESS';
export const LOAD_TIME_PHASE_LIST_FAIL = 'TIME_RECORDINGLOAD_TIME_PHASE_LIST_FAIL';
export const CHANGE_TIME_PHASE_LIST = 'TIME_RECORDINGCHANGE_TIME_PHASE_LIST';
export const LOAD_TIME_ACTIVITI_LIST = 'TIME_RECORDINGLOAD_TIME_ACTIVITI_LIST';
export const LOAD_TIME_ACTIVITI_LIST_SUCCESS = 'TIME_RECORDINGLOAD_TIME_ACTIVITI_LIST_SUCCESS';
export const LOAD_TIME_ACTIVITI_LIST_FAIL = 'TIME_RECORDINGLOAD_TIME_ACTIVITI_LIST_FAIL';
export const CHANGE_TIME_ACTIVITI_LIST = 'TIME_RECORDINGCHANGE_TIME_ACTIVITI_LIST';
export const LOAD_TIME_TASK_LIST = 'TIME_RECORDINGLOAD_TIME_TASK_LIST';
export const LOAD_TIME_TASK_LIST_SUCCESS = 'TIME_RECORDINGLOAD_TIME_TASK_LIST_SUCCESS';
export const LOAD_TIME_TASK_LIST_FAIL = 'TIME_RECORDINGLOAD_TIME_TASK_LIST_FAIL';
export const CHANGE_TIME_TASK_LIST = 'TIME_RECORDINGCHANGE_TIME_TASK_LIST';

export const CHANG_MATTER = 'TIME_RECORDING_CHANG_MATTER';
export const CHECK_TIME_RECORD_ENABLE = 'TIME_RECORDING_CHECK_TIME_RECORD_ENABLE';
export const CHECK_TIME_RECORD_ENABLE_SUCCESS = 'TIME_RECORDING_CHECK_TIME_RECORD_ENABLE_SUCCESS';
export const CHECK_TIME_RECORD_ENABLE_FAIL = 'TIME_RECORDING_CHECK_TIME_RECORD_ENABLE_FAIL';

export const TIME_RECORDING_TIME_UPDATING = 'DPS_TIME_RECORDING_TIME_UPDATING';
export const TR_STOP_START_CLOCK = 'DPS_TIME_RECORDING_STOP_START_CLOCK';
export const TIME_RECORDING_OPEN_RECORD_TIME_TAB = 'DPS_TIME_RECORDING_OPEN_RECORD_TIME_TAB';
export const TIME_RECORDING_TAB_DAT_INIT = 'DPS_TIME_RECORDING_TAB_DAT_INIT';

export const DELETE_TIME_RECORDING = 'DPS_DELETE_TIME_RECORDING';
export const DELETE_TIME_RECORDING_SUCCESS = 'DPS_DELETE_TIME_RECORDING_SUCCESS';
export const DELETE_TIME_RECORDING_FAIL = 'DPS_DELETE_TIME_RECORDING_FAIL';
export const TR_POPUP_MINIMIZE = 'DPS_TIME_RECORDING_POPUP_MINIMIZE';

export const LOAD_PH_RATE_LIST = 'DPS_LOAD_PH_RATE_LIST';
export const LOAD_PH_RATE_LIST_SUCCESS = 'DPS_LOAD_PH_RATE_LIST_SUCCESS';
export const LOAD_PH_RATE_LIST_FAIL = 'DPS_LOAD_PH_RATE_LIST_FAIL';

export const PH_RATE_CHANGE = 'DPS_PH_RATE_CHANGE';

export const EDIT_DOC = 'DPS_TIME_RECORDING_EDIT_DOC';
export const EDIT_DOC_SUCCESS = 'DPS_TIME_RECORDING_EDIT_DOC_SUCCESS';
export const EDIT_DOC_FAIL = 'DPS_TIME_RECORDING_EDIT_DOC_FAIL';

export const GET_DIARY_FILE_DATA_TIME_RECORDING = 'DPS_GET_DIARY_FILE_DATA_TIME_RECORDING';
export const GET_DIARY_FILE_DATA_TIME_RECORDING_SUCCESS = 'DPS_GET_DIARY_FILE_DATA_TIME_RECORDING_SUCCESS';
export const GET_DIARY_FILE_DATA_TIME_RECORDING_FAIL = 'DPS_GET_DIARY_FILE_DATA_TIME_RECORDING_FAIL';

export class InitTimeRecording extends TokenizeAction implements Action {
    readonly type = INIT_TIME_RECORDING;
    constructor(public token: string, public payload: { inputData: TimeRecordInputData, timeOffset: number }) {
        super(token);
    }
}

export class SetTimeRecordEditData extends TokenizeAction implements Action {
    readonly type = SET_EDIT_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class RequestTimeRecordingInfo extends TokenizeAction implements Action {
    readonly type = REQUEST_TIME_RECORDING_INFO;
    constructor(public token: string, public payload: { isFearnerChange: boolean }) {
        super(token);
    }
}
export class LoadTimeRecordingInfo extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_RECORDING_INFO;
    constructor(public token: string, public payload: { info: TimeRecordingInfo }) {
        super(token);
    }
}
export class LoadDefaultFeeEarnerSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DEFULT_FEEEARNER_SUCCESS;
    constructor(public token: string, public payload: { user: string }) {
        super(token);
    }
}
export class LoadFeeEarnerList extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FEEEARNER_LIST_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: FeeEarner[] }) {
        super(token);
    }
}
export class CatchTimeRecordingError extends TokenizeAction implements Action {
    readonly type = TIME_RECORDING_ERROR;
    constructor(public token: string, public payload: { timeRecordingError: TimeRecordingMsg }) {
        super(token);
    }
}
export class ChangeUnit extends TokenizeAction implements Action {
    readonly type = CHANGE_UNIT;
    constructor(public token: string, public payload: { unit: number }) {
        super(token);
    }
}
export class ChangeFeeEarner extends TokenizeAction implements Action {
    readonly type = CHANGE_FEEEARNER;
    constructor(public token: string, public payload: { feeEarner: FeeEarner }) {
        super(token);
    }
}

export class PhRateChange extends TokenizeAction implements Action {
    readonly type = PH_RATE_CHANGE;
    constructor(public token: string, public payload: { pHRate: PrecedentHRates }) {
        super(token);
    }
}


export class ChangeUncharge extends TokenizeAction implements Action {
    readonly type = CHANGE_UNCHARGE;
    constructor(public token: string, public payload: { uncharge: boolean }) {
        super(token);
    }
}
export class ChangeDate extends TokenizeAction implements Action {
    readonly type = CHANGE_DATE;
    constructor(public token: string, public payload: { date: string }) {
        super(token);
    }
}
export class ChangeDetails extends TokenizeAction implements Action {
    readonly type = CHANGE_DETAILS;
    constructor(public token: string, public payload: { details: string }) {
        super(token);
    }
}
export class ChangeNote extends TokenizeAction implements Action {
    readonly type = CHANGE_NOTE;
    constructor(public token: string, public payload: { note: string }) {
        super(token);
    }
}
export class SubmitTimeRecord extends TokenizeAction implements Action {
    readonly type = SUBMIT_TIME_RECORD;
    constructor(public token: string) {
        super(token);
    }
}
export class SubmitValidation extends TokenizeAction implements Action {
    readonly type = TIME_RECORD_VALIDATION;
    constructor(public token: string) {
        super(token);
    }
}
export class SaveWithoutSubmitTimeRecord extends TokenizeAction implements Action {
    readonly type = SAVE_WITHOUT_SUBMIT_TIME_RECORD;
    constructor(public token: string) {
        super(token);
    }
}
export class SaveTimeRecord extends TokenizeAction implements Action {
    readonly type = SAVE_TIME_RECORD;
    constructor(public token: string) {
        super(token);
    }
}
export class TimeRecordSaveSuccess extends TokenizeAction implements Action {
    readonly type = TIME_RECORD_SAVE_SUCCESS;
    constructor(public token: string, public payload: { timeRecordId: number }) {
        super(token);
    }
}
export class TimeRecordingClose extends TokenizeAction implements Action {
    readonly type = TIME_RECORDING_CLOSE;
    constructor(public token: string) {
        super(token);
    }
}
export class ChangeRate extends TokenizeAction implements Action {
    readonly type = CHANGE_RATE;
    constructor(public token: string, public payload: { rate: number }) {
        super(token);
    }
}
// eBilling Comment
// WorkType
export class LoadWorkTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_WORK_TYPE_LIST;
    constructor(public token: string, public payload: string) {
        super(token);
    }
}
export class LoadWorkTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_WORK_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { workTypeList: WorkType[] }) {
        super(token);
    }
}
export class LoadWorkTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_WORK_TYPE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeWorkType extends TokenizeAction implements Action {
    readonly type = CHANGE_TIME_WORK_TYPE_LIST;
    constructor(public token: string, public payload: { selectedWorkType: WorkType }) { super(token); }
}
// PHRate
export class LoadPHRateList extends TokenizeAction implements Action {
    readonly type = LOAD_PH_RATE_LIST;
    constructor(public token: string, public payload: { matterRef: string }) {
        super(token);
    }
}
export class LoadPHRateListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_PH_RATE_LIST_SUCCESS;
    constructor(public token: string, public payload: { precedentHRateList: any[] }) {
        super(token);
    }
}
export class LoadPHRateListFail extends TokenizeAction implements Action {
    readonly type = LOAD_PH_RATE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
// Phase
export class LoadPhaseList extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_PHASE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadPhaseListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_PHASE_LIST_SUCCESS;
    constructor(public token: string, public payload: { phaseList: Phase[] }) {
        super(token);
    }
}
export class LoadPhaseListFail extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_PHASE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangePhase extends TokenizeAction implements Action {
    readonly type = CHANGE_TIME_PHASE_LIST;
    constructor(public token: string, public payload: { selectedPhase: Phase }) { super(token); }
}
// activitiList
export class LoadActivitiList extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_ACTIVITI_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadActivitiListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_ACTIVITI_LIST_SUCCESS;
    constructor(public token: string, public payload: { activitiList: Activiti[] }) {
        super(token);
    }
}
export class LoadActivitiListFail extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_ACTIVITI_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeActiviti extends TokenizeAction implements Action {
    readonly type = CHANGE_TIME_ACTIVITI_LIST;
    constructor(public token: string, public payload: { selectedActiviti: Activiti }) { super(token); }
}
// TaskList
export class LoadTaskList extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TASK_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTaskListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TASK_LIST_SUCCESS;
    constructor(public token: string, public payload: { taskList: PhaseWiseTask[] }) {
        super(token);
    }
}
export class LoadTaskListFail extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TASK_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeTask extends TokenizeAction implements Action {
    readonly type = CHANGE_TIME_TASK_LIST;
    constructor(public token: string, public payload: { selectedTask: PhaseWiseTask }) { super(token); }
}

export class CheckTimeRecordEnable extends TokenizeAction implements Action {
    readonly type = CHECK_TIME_RECORD_ENABLE;
    constructor(public token: string, public payload: { matterRef: string, eBilling: eBillingType, feeEarner: string }) { super(token); }
}

export class CheckTimeRecordEnableSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_TIME_RECORD_ENABLE_SUCCESS;
    constructor(public token: string, public payload: { matterRef: string, eBilling: eBillingType, feeEarner: string }) { super(token); }
}

export class CheckTimeRecordEnableFail extends TokenizeAction implements Action {
    readonly type = CHECK_TIME_RECORD_ENABLE_FAIL;
    constructor(public token: string) { super(token); }
}

export class ChangMatter extends TokenizeAction implements Action {
    readonly type = CHANG_MATTER;
    constructor(public token: string, public payload: {
        matterRef: string, eBilling: eBillingType,
        feeEarner: string, clientMatterData: ClientMatterData, precedentHRateID: any
    }) { super(token); }
}
export class TimeRecordingTimeUpdating extends TokenizeAction implements Action {
    readonly type = TIME_RECORDING_TIME_UPDATING;
    constructor(public token: string, public payload: { timeRecordValue: any }) {
        super(token);
    }
}
export class StopStartClock extends TokenizeAction implements Action {
    readonly type = TR_STOP_START_CLOCK;
    constructor(public token: string, public payload: { isPulse: boolean }) {
        super(token);
    }
}
export class OpenRecordTimeTab extends TokenizeAction implements Action {
    readonly type = TIME_RECORDING_OPEN_RECORD_TIME_TAB;
    constructor(public token: string, public payload: { inputData: TimeRecordInputData, timeOffset: number }) { // recordTimeTabData: any
        super(token);
    }
}
export class LoadTabDataInit extends TokenizeAction implements Action {
    readonly type = TIME_RECORDING_TAB_DAT_INIT;
    constructor(public token: string) {
        super(token);
    }
}
export class DeleteTimeRecording extends TokenizeAction implements Action {
    readonly type = DELETE_TIME_RECORDING;
    constructor(public token: string, public payload: { timeRecordingId: number }) {
        super(token);
    }
}
export class DeleteTimeRecordingSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_TIME_RECORDING_SUCCESS;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class DeleteTimeRecordingFail extends TokenizeAction implements Action {
    readonly type = DELETE_TIME_RECORDING_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class TRPopupMinimize extends TokenizeAction implements Action {
    readonly type = TR_POPUP_MINIMIZE;
    constructor(public token: string) {
        super(token);
    }
}
export class EditDoc extends TokenizeAction {
    readonly type = EDIT_DOC;
    constructor(public token: string) {
        super(token);
    }
}
export class EditDocSuccess extends TokenizeAction {
    readonly type = EDIT_DOC_SUCCESS;
    constructor(public token: string, public diaryId: number, public url: string) {
        super(token);
    }
}
export class EditDocFail extends TokenizeAction {
    readonly type = EDIT_DOC_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class GetDiaryFileData extends TokenizeAction implements Action {
    readonly type = GET_DIARY_FILE_DATA_TIME_RECORDING;
    constructor(public token: string, public payload: { timeEventId: number }) {
        super(token);
    }
}
export class GetDiaryFileDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_DIARY_FILE_DATA_TIME_RECORDING_SUCCESS;
    constructor(public token: string, public payload: { diaryDetails: DiaryFileDetails }) {
        super(token);
    }
}
export class GetDiaryFileDataFail extends TokenizeAction implements Action {
    readonly type = GET_DIARY_FILE_DATA_TIME_RECORDING_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export type Any = InitTimeRecording | RequestTimeRecordingInfo | LoadTimeRecordingInfo | LoadDefaultFeeEarnerSuccess | LoadFeeEarnerList |
    LoadFeeEarnerListSuccess | CatchTimeRecordingError | ChangeUnit | ChangeFeeEarner | ChangeUncharge | ChangeDate | ChangeDetails |
    ChangeNote | SubmitTimeRecord | SubmitValidation | SaveTimeRecord | TimeRecordSaveSuccess | TimeRecordingClose | ChangeRate |
    SetTimeRecordEditData | LoadWorkTypeList | LoadWorkTypeListSuccess | LoadWorkTypeListFail | ChangeWorkType |
    LoadPhaseList | LoadPhaseListSuccess | LoadPhaseListFail | ChangePhase |
    LoadActivitiList | LoadActivitiListSuccess | LoadActivitiListFail | ChangeActiviti |
    LoadTaskList | LoadTaskListSuccess | LoadTaskListFail | ChangeTask | ChangMatter |
    CheckTimeRecordEnable | CheckTimeRecordEnableSuccess | CheckTimeRecordEnableFail |
    DeleteTimeRecording | DeleteTimeRecordingSuccess | DeleteTimeRecordingFail | TRPopupMinimize |
    TimeRecordingTimeUpdating | StopStartClock | OpenRecordTimeTab | LoadTabDataInit | SaveWithoutSubmitTimeRecord |
    LoadPHRateList | LoadPHRateListSuccess | LoadPHRateListFail | PhRateChange | EditDoc | EditDocSuccess | EditDocFail |
    GetDiaryFileData | GetDiaryFileDataSuccess | GetDiaryFileDataFail;
