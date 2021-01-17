import { GridData } from './../../case-task-core/models/interface';
import { PlotMatterDiaryRecordsInfoViewModel } from './../../matter-linked-core/models/request';
import { MatterSearchGridData } from '../../core/lib/matter';

import { ChaserOutPutType } from '../models/enums';
import { ChaserInput, ContactEmailsViewModel, ContactMapResponce, ChaserViewModel } from '../models/interfaces';

import { FeeEarner, Folder, TimeType, MatterInfo, ChaserError } from '../models/interfaces';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { Message, Recipient } from '../../core/lib/microsoft-graph';
import { PrecedentHSModel, WorkType } from '../../core/lib/precedentHS';
import { AttType } from '../../core/lib/timeRecord';
import { ClassObj } from '../../crime-management-core/models/interfaces';
import { CivilClassObj } from '../../civil-class-management';
import { CivilDropDownData } from '../../civil-time-recording-desktop';

export const INIT_CHASER = 'DPS_CHASER_INIT_CHASER';
export const INIT_CHASER_SUCCESS = 'DPS_CHASER_INIT_CHASER_SUCCESS';
export const INIT_CHASER_FAIL = 'DPS_CHASER_INIT_CHASER_FAIL';
// Folder stuff
export const LOAD_FOLDER_LIST = 'DPS_CHASER_LOAD_FOLDER_LIST';
export const LOAD_FOLDER_LIST_SUCCESS = 'DPS_CHASER_LOAD_FOLDER_LIST_SUCCESS';
export const LOAD_FOLDER_LIST_FAIL = 'DPS_CHASER_LOAD_FOLDER_LIST_FAIL';
export const CHANGE_FOLDER_LIST = 'DPS_CHASER_CHANGE_FOLDER_LIST';
// FeeEarner stuff
export const LOAD_FE_LIST = 'DPS_CHASER_LOAD_FE_LIST';
export const LOAD_FE_LIST_SUCCESS = 'DPS_CHASER_LOAD_FE_LIST_SUCCESS';
export const LOAD_FE_LIST_FAIL = 'DPS_CHASER_LOAD_FE_LIST_FAIL';
export const CHANGE_FE_LIST = 'DPS_CHASER_CHANGE_FE_LIST';
// Time Type stuff
export const LOAD_TIME_TYPE_LIST = 'DPS_CHASER_LOAD_TIME_TYPE_LIST';
export const LOAD_TIME_TYPE_LIST_SUCCESS = 'DPS_CHASER_LOAD_TIME_TYPE_LIST_SUCCESS';
export const LOAD_TIME_TYPE_LIST_FAIL = 'DPS_CHASER_LOAD_TIME_TYPE_LIST_FAIL';
export const CHANGE_TIME_TYPE_LIST = 'DPS_CHASER_CHANGE_TIME_TYPE_LIST';
// File no stuff
export const LOAD_FILE_NO = 'DPS_CHASER_LOAD_FILE_NO';
export const LOAD_FILE_NO_SUCCESS = 'DPS_CHASER_LOAD_FILE_NO_SUCCESS';
export const LOAD_FILE_NO_FAIL = 'DPS_CHASER_LOAD_FILE_NO_FAIL';

// Default folder stuff
export const LOAD_DEFAULT_FOLDER = 'DPS_CHASER_LOAD_DEFAULT_FOLDER';
export const LOAD_DEFAULT_FOLDER_SUCCESS = 'DPS_CHASER_LOAD_DEFAULT_FOLDER_SUCCESS';
export const LOAD_DEFAULT_FOLDER_FAIL = 'DPS_CHASER_LOAD_DEFAULT_FOLDER_FAIL';

// Open File stuff
export const CHANGE_OPEN_FILE = 'DPS_CHASER_CHANGE_OPEN_FILE';

// Unit value stuff
export const CHANGE_UNIT_VALUE = 'DPS_CHASER_CHANGE_UNIT_VALUE';
// File note value stuff
export const CHANGE_FILE_NOTE_VALUE = 'DPS_CHASER_CHANGE_FILE_NOTE_VALUE';

export const SHOW_ERROR = 'DPS_CHASER_SHOW_ERROR';
// Send email
export const SEND_CHASER_EMAIL = 'DPS_CHASER_SEND_CHASER_EMAIL';
export const SEND_CHASER_EMAIL_SUCCESS = 'DPS_CHASER_SEND_CHASER_EMAIL_SUCCESS';
export const SEND_CHASER_EMAIL_FAIL = 'DPS_CHASER_SEND_CHASER_EMAIL_FAIL';

// FeeEarner Rate Value Disable
export const FEE_EARNER_RATE_VALUE_DISABLE = 'DPS_CHASER_FEE_EARNER_RATE_VALUE_DISABLE';
export const FEE_EARNER_RATE_VALUE_DISABLE_SUCCESS = 'DPS_CHASER_FEE_EARNER_RATE_VALUE_DISABLE_SUCCESS';
export const FEE_EARNER_RATE_VALUE_DISABLE_FAIL = 'DPS_CHASER_FEE_EARNER_RATE_VALUE_DISABLE_FAIL';

export const CLEAR_CHASER_DATA = 'DPS_CHASER_CLEAR_CHASER_DATA';

export const LOAD_MATTER_DATA_FROM_SUBJECT = 'DPS_CHASER_LOAD_MATTER_DATA_FROM_SUBJECT';
export const LOAD_MATTER_DATA_FROM_SUBJECT_SUCCESS = 'DPS_CHASER_LOAD_MATTER_DATA_FROM_SUBJECT_SUCCESS';
export const LOAD_MATTER_DATA_FROM_SUBJECT_FAIL = 'DPS_CHASER_LOAD_MATTER_DATA_FROM_SUBJECT_FAIL';

export const LOAD_MATTER_LIST_BY_EMAIL = 'DPS_CHASER_LOAD_MATTER_LIST_BY_EMAIL';
export const LOAD_MATTER_LIST_BY_EMAIL_SUCCESS = 'DPS_CHASER_LOAD_MATTER_LIST_BY_EMAIL_SUCCESS';
export const LOAD_MATTER_LIST_BY_EMAIL_FAIL = 'DPS_CHASER_LOAD_MATTER_LIST_BY_EMAIL_FAIL';

// Matter Detail by mat ref stuff
// export const LOAD_MATTER_DETAIL_BY_MATTER = 'DPS_CHASER_LOAD_MATTER_DETAIL_BY_MATTER';
// export const LOAD_MATTER_DETAIL_BY_MATTER_SUCCESS = 'DPS_CHASER_LOAD_MATTER_DETAIL_BY_MATTER_SUCCESS';
// export const LOAD_MATTER_DETAIL_BY_MATTER_FAIL = 'DPS_CHASER_LOAD_MATTER_DETAIL_BY_MATTER_FAIL';

// Check email address is mapping to matter
export const CHECK_IS_EMAIL_ADDRESS_MAP = 'CHASER_CHECK_IS_EMAIL_ADDRESS_MAP';
export const CHECK_IS_EMAIL_ADDRESS_MAP_SUCCESS = 'CHASER_CHECK_IS_EMAIL_ADDRESS_MAP_SUCCESS';
export const CHECK_IS_EMAIL_ADDRESS_MAP_FAIL = 'CHASER_CHECK_IS_EMAIL_ADDRESS_MAP_FAIL';

export const LOAD_CONTACT_ROLE = 'DPS_CHASER_LOAD_CONTACT_ROLE';
export const LOAD_CONTACT_ROLE_SUCCESS = 'DPS_CHASER_LOAD_CONTACT_ROLE_SUCCESS';
export const LOAD_CONTACT_ROLE_FAIL = 'DPS_CHASER_LOAD_CONTACT_ROLE_FAIL';

export const LOAD_CHASER_TYPE_VALIDATION = 'DPS_CHASER_LOAD_CHASER_TYPE_VALIDATION';

export const CHASER_LOADING_DISABLE = 'DPS_CHASER_CHASER_LOADING_DISABLE';

export const LINK_CONTACT_WITH_MATTER = 'DPS_CHASER_LINK_CONTACT_WITH_MATTER';
export const LINK_CONTACT_WITH_MATTER_SUCCESS = 'DPS_CHASER_LINK_CONTACT_WITH_MATTER_SUCCESS';
export const LINK_CONTACT_WITH_MATTER_FAIL = 'DPS_CHASER_LINK_CONTACT_WITH_MATTER_FAIL';

// eBilling Comment
export const LOAD_CHASER_WORK_TYPE_LIST = 'DPS_LOAD_CHASER_WORK_TYPE_LIST';
export const LOAD_CHASER_WORK_TYPE_LIST_SUCCESS = 'DPS_LOAD_CHASER_WORK_TYPE_LIST_SUCCESS';
export const LOAD_CHASER_WORK_TYPE_LIST_FAIL = 'DPS_LOAD_CHASER_WORK_TYPE_LIST_FAIL';
export const CHANGE_CHASER_WORK_TYPE_LIST = 'DPS_CHANGE_CHASER_WORK_TYPE_LIST';
export const LOAD_CHASER_PHASE_LIST = 'DPS_LOAD_CHASER_PHASE_LIST';
export const LOAD_CHASER_PHASE_LIST_SUCCESS = 'DPS_LOAD_CHASER_PHASE_LIST_SUCCESS';
export const LOAD_CHASER_PHASE_LIST_FAIL = 'DPS_LOAD_CHASER_PHASE_LIST_FAIL';
export const CHANGE_CHASER_PHASE_LIST = 'DPS_CHANGE_CHASER_PHASE_LIST';
export const LOAD_CHASER_ACTIVITI_LIST = 'DPS_LOAD_CHASER_ACTIVITI_LIST';
export const LOAD_CHASER_ACTIVITI_LIST_SUCCESS = 'DPS_LOAD_CHASER_ACTIVITI_LIST_SUCCESS';
export const LOAD_CHASER_ACTIVITI_LIST_FAIL = 'DPS_LOAD_CHASER_ACTIVITI_LIST_FAIL';
export const CHANGE_CHASER_ACTIVITI_LIST = 'DPS_CHANGE_CHASER_ACTIVITI_LIST';
export const LOAD_CHASER_TASK_LIST = 'DPS_LOAD_CHASER_TASK_LIST';
export const LOAD_CHASER_TASK_LIST_SUCCESS = 'DPS_LOAD_CHASER_TASK_LIST_SUCCESS';
export const LOAD_CHASER_TASK_LIST_FAIL = 'DPS_LOAD_CHASER_TASK_LIST_FAIL';
export const CHANGE_CHASER_TASK_LIST = 'DPS_CHANGE_CHASER_TASK_LIST';
export const CHANGE_CHASER_PRECEDENTHS_RATE = 'DPS_CHANGE_CHASER_PRECEDENTHS_RATE';
export const CHANGE_CHASER_PRECEDENTHS_UNIT = 'DPS_CHANGE_CHASER_PRECEDENTHS_UNIT';

// Crime
export const GET_CLASS_TYPE = 'DPS_CHANGE_CHASER_GET_CLASS_TYPE';
export const GET_CLASS_TYPE_SUCCESS = 'DPS_CHANGE_CHASER_GET_CLASS_SUCCESS';
export const GET_CLASS_TYPE_FAIL = 'DPS_CHANGE_CHASER_GET_CLASS_FAIL';
export const CHANGE_CLASS_TYPE = 'DPS_CHANGE_CHASER_CHANGE_CLASS_TYPE';
export const LOAD_ATT_TYPE_LIST = 'CHASER_LOAD_ATT_TYPE_LIST';
export const LOAD_ATT_TYPE_LIST_SUCCESS = 'CHASER_LOAD_ATT_TYPE_LIST_SUCCESS';
export const LOAD_ATT_TYPE_LIST_FAIL = 'CHASER_LOAD_ATT_TYPE_LIST_FAIL';
export const CHANGE_ATT_TYPE = 'DPS_CHANGE_CHASER_CHANGE_ATT_TYPE';

// Civil
export const GET_CIVIL_CLASS = 'DPS_CHANGE_CHASER_GET_CIVIL_CLASS';
export const GET_CIVIL_CLASS_SUCCESS = 'DPS_CHANGE_CHASER_GET_CIVIL_CLASS_SUCCESS';
export const GET_CIVIL_CLASS_FAIL = 'DPS_CHANGE_CHASER_GET_CIVIL_CLASS_FAIL';
export const GET_CIVIL_LEVELS = 'DPS_CHASER_GET_CIVIL_LEVELS';
export const GET_CIVIL_LEVELS_SUCCESS = 'DPS_CHASER_GET_CIVIL_LEVELS_SUCCESS';
export const GET_CIVIL_LEVELS_FAIL = 'DPS_CHASER_GET_CIVIL_LEVELS_FAIL';
export const CHANGE_CIVIL_CLASS = 'DPS_CHANGE_CHASER_CIVIL_CLASS';
export const CHANGE_CIVIL_LEVEL = 'DPS_CHANGE_CHASER_CIVIL_LEVEL';

export const CHANGE_SECTION_51 = 'DPS_CHANGE_CHASER_CHANGE_SECTION_51';
export const CHANGE_IS_BUILK = 'DPS_CHANGE_CHASER_IS_BUILK';
export const CHANGE_NO_OF_ENTRIES = 'DPS_CHANGE_CHASER_NO_OF_ENTRIES';

export const CHANGE_UNCHARGE = 'CHASER_CHANGE_UNCHARGE';

export const LOAD_LINKED_MATTER_POPUP = 'DPS_LOAD_LINKED_MATTER_POPUP';

export const ADD_DIARY_RECORD_FOR_PLOT_MATTER = 'DPS_ADD_CHASER_DIARY_RECORD_FOR_PLOT_MATTER';
export const ADD_DIARY_RECORD_FOR_PLOT_MATTER_SUCCESS = 'DPS_ADD_CHASER_DIARY_RECORD_FOR_PLOT_MATTER_SUCCESS';
export const ADD_DIARY_RECORD_FOR_PLOT_MATTER_FAIL = 'DPS_ADD_CHASER_DIARY_RECORD_FOR_PLOT_MATTER_FAIL';

export const GET_MAIL_SUBJECT_PREFIX = 'DPS_CHASER_GET_MAIL_SUBJECT_PREFIX';
export const GET_MAIL_SUBJECT_PREFIX_SUCCESS = 'DPS_CHASER_GET_MAIL_SUBJECT_PREFIX_SUCCESS';
export const GET_MAIL_SUBJECT_PREFIX_FAIL = 'DPS_CHASER_GET_MAIL_SUBJECT_PREFIX_FAIL';


export class ChaserLoadingDisable extends TokenizeAction implements Action {
    readonly type = CHASER_LOADING_DISABLE;
    constructor(public token: string) {
        super(token);
    }
}
export class InitChaser extends TokenizeAction implements Action {
    readonly type = INIT_CHASER;
    constructor(public token: string, public payload: { inputData: ChaserInput }) {
        super(token);
    }
}
export class ClearChaserData extends TokenizeAction implements Action {
    readonly type = CLEAR_CHASER_DATA;
    constructor(public token: string) {
        super(token);
    }
}
// Load Matter List by email
export class LoadMatterList extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_LIST_BY_EMAIL;
    constructor(public token: string, public payload: { recipientList: Recipient[] }) {
        super(token);
    }
}
export class LoadMatterListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_LIST_BY_EMAIL_SUCCESS;
    constructor(public token: string, public payload: { emailMatterList: [] }) {
        super(token);
    }
}
export class LoadMatterListFail extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_LIST_BY_EMAIL_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
// FeeEarner Rate Value Disable
export class FeeEarnerRateValueDisable extends TokenizeAction implements Action {
    readonly type = FEE_EARNER_RATE_VALUE_DISABLE;
    constructor(public token: string) {
        super(token);
    }
}
export class FeeEarnerRateValueDisableSuccess extends TokenizeAction implements Action {
    readonly type = FEE_EARNER_RATE_VALUE_DISABLE_SUCCESS;
    constructor(public token: string, public payload: { isTypeDisable: boolean }) {
        super(token);
    }
}
export class FeeEarnerRateValueDisableFail extends TokenizeAction implements Action {
    readonly type = FEE_EARNER_RATE_VALUE_DISABLE_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
// Send email stuff
export class SendChaserEmail extends TokenizeAction implements Action {
    readonly type = SEND_CHASER_EMAIL;
    constructor(public token: string, public payload: { linkMattes: string[], composeToken: string }) {
        super(token);
    }
}
export class SendChaserEmailSuccess extends TokenizeAction implements Action {
    readonly type = SEND_CHASER_EMAIL_SUCCESS;
    constructor(public token: string, public payload: {
        chaserOutPut: ChaserOutPutType, diaryIds: number[],
        chaserSendSuccess: boolean, linkMattes: string[]
    }) {
        super(token);
    }
}
export class SendChaserEmailFail extends TokenizeAction implements Action {
    readonly type = SEND_CHASER_EMAIL_FAIL;
    constructor(public token: string, public payload: {
        emailModel: {
            id: string;
            changeKey: string;
        };
        chaserModel: ChaserViewModel;
    }, public error: any) {
        super(token);
    }
}
// File no stuff
export class LoadFileNo extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_NO;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFileNoSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_NO_SUCCESS;
    constructor(public token: string, public payload: { fileNo: string }) {
        super(token);
    }
}
export class LoadFileNoFail extends TokenizeAction implements Action {
    readonly type = LOAD_FILE_NO_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
// Open File stuff
export class ChangeOpenFile extends TokenizeAction implements Action {
    readonly type = CHANGE_OPEN_FILE;
    constructor(public token: string, public payload: { selectedMatterInfo: MatterInfo }) {
        super(token);
    }
}
// Unit value stuff
export class ChangeUnitValue extends TokenizeAction implements Action {
    readonly type = CHANGE_UNIT_VALUE;
    constructor(public token: string, public payload: { unitValue: number }) {
        super(token);
    }
}
// File note value stuff
export class ChangeFileNoteValue extends TokenizeAction implements Action {
    readonly type = CHANGE_FILE_NOTE_VALUE;
    constructor(public token: string, public payload: { fileNoteValue: string }) {
        super(token);
    }
}
// FeeEarner stuff
export class LoadFeeEarnerList extends TokenizeAction implements Action {
    readonly type = LOAD_FE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FE_LIST_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: FeeEarner[] }) {
        super(token);
    }
}
export class LoadFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeFeeEarnerList extends TokenizeAction implements Action {
    readonly type = CHANGE_FE_LIST;
    constructor(public token: string, public payload: { selectedFeeEarner: FeeEarner }) { super(token); }
}
// Folder stuff
export class LoadFolderList extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFolderListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_SUCCESS;
    constructor(public token: string, public payload: { folderList: Folder[] }) {
        super(token);
    }
}
export class LoadFolderListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeFolderList extends TokenizeAction implements Action {
    readonly type = CHANGE_FOLDER_LIST;
    constructor(public token: string, public payload: { selectedFolder: Folder }) { super(token); }
}
// Time Type stuff
export class LoadTimeTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TYPE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTimeTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { timeTypeList: TimeType[] }) {
        super(token);
    }
}
export class LoadTimeTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TYPE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeTimeTypeList extends TokenizeAction implements Action {
    readonly type = CHANGE_TIME_TYPE_LIST;
    constructor(public token: string, public payload: { selectedTimeType: TimeType }) { super(token); }
}
// Default folder stuff
export class LoadDefaultFolder extends TokenizeAction implements Action {
    readonly type = LOAD_DEFAULT_FOLDER;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadDefaultFolderSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DEFAULT_FOLDER_SUCCESS;
    constructor(public token: string, public payload: { defaultFolder: Folder }) {
        super(token);
    }
}
export class LoadDefaultFolderFail extends TokenizeAction implements Action {
    readonly type = LOAD_DEFAULT_FOLDER_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ShowError extends TokenizeAction implements Action {
    readonly type = SHOW_ERROR;
    constructor(public token: string, public payload: { error: ChaserError }) {
        super(token);
    }
}
// Mater Data From Mail Subject stuff
export class LoadMaterDataFromMailSubject extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_DATA_FROM_SUBJECT;
    constructor(public token: string, public payload: { dpsSubject: string }) {
        super(token);
    }
}
export class LoadMaterDataFromMailSubjectSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_DATA_FROM_SUBJECT_SUCCESS;
    constructor(public token: string, public payload: { MatterInfo: MatterInfo }) {
        super(token);
    }
}
export class LoadMaterDataFromMailSubjectFail extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_DATA_FROM_SUBJECT_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
// Check email address is mapping to matter
export class CheckEmailMailAddressIsMap extends TokenizeAction implements Action {
    readonly type = CHECK_IS_EMAIL_ADDRESS_MAP;
    constructor(public token: string) {
        super(token);
    }
}
export class CheckEmailMailAddressIsMapSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_IS_EMAIL_ADDRESS_MAP_SUCCESS;
    constructor(public token: string, public payload: { contactMapResponce: ContactMapResponce }) {
        super(token);
    }
}
export class CheckEmailMailAddressIsMapFail extends TokenizeAction implements Action {
    readonly type = CHECK_IS_EMAIL_ADDRESS_MAP_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadContacRole extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACT_ROLE;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadContacRoleSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACT_ROLE_SUCCESS;
    constructor(public token: string, public payload: { unlinkContact: ContactEmailsViewModel[], role: string[] }) {
        super(token);
    }
}
export class LoadContacRoleFail extends TokenizeAction implements Action {
    readonly type = LOAD_CONTACT_ROLE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadChaserTypeValidation extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_TYPE_VALIDATION;
    constructor(public token: string, public payload: {
        emailmodelData: {
            id: string;
            internetMessageId: string;
        }, errorMsg: string
    }) {
        super(token);
    }
}

// Link matter with contact
export class LinkContactWithMatter extends TokenizeAction implements Action {
    readonly type = LINK_CONTACT_WITH_MATTER;
    constructor(public token: string, public payload: { contactEmailsViewModel: ContactEmailsViewModel[] }) {
        super(token);
    }
}
export class LinkContactWithMatterSuccess extends TokenizeAction implements Action {
    readonly type = LINK_CONTACT_WITH_MATTER_SUCCESS;
    constructor(public token: string, public payload: { result: any, sentEmailList: any }) {
        super(token);
    }
}
export class LinkContactWithMatterFail extends TokenizeAction implements Action {
    readonly type = LINK_CONTACT_WITH_MATTER_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

// eBilling Comment
// WorkType
export class LoadWorkTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_WORK_TYPE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadWorkTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_WORK_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { workTypeList: WorkType[] }) {
        super(token);
    }
}
export class LoadWorkTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_WORK_TYPE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeWorkType extends TokenizeAction implements Action {
    readonly type = CHANGE_CHASER_WORK_TYPE_LIST;
    constructor(public token: string, public payload: { selectedWorkType: PrecedentHSModel }) { super(token); }
}
// Phase
export class LoadPhaseList extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_PHASE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadPhaseListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_PHASE_LIST_SUCCESS;
    constructor(public token: string, public payload: { phaseList: PrecedentHSModel[] }) {
        super(token);
    }
}
export class LoadPhaseListFail extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_PHASE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangePhase extends TokenizeAction implements Action {
    readonly type = CHANGE_CHASER_PHASE_LIST;
    constructor(public token: string, public payload: { selectedPhase: PrecedentHSModel }) { super(token); }
}
// activitiList
export class LoadActivitiList extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_ACTIVITI_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadActivitiListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_ACTIVITI_LIST_SUCCESS;
    constructor(public token: string, public payload: { activitiList: PrecedentHSModel[] }) {
        super(token);
    }
}
export class LoadActivitiListFail extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_ACTIVITI_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeActiviti extends TokenizeAction implements Action {
    readonly type = CHANGE_CHASER_ACTIVITI_LIST;
    constructor(public token: string, public payload: { selectedActiviti: PrecedentHSModel }) { super(token); }
}
// TaskList
export class LoadTaskList extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_TASK_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTaskListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_TASK_LIST_SUCCESS;
    constructor(public token: string, public payload: { taskList: PrecedentHSModel[] }) {
        super(token);
    }
}
export class LoadTaskListFail extends TokenizeAction implements Action {
    readonly type = LOAD_CHASER_TASK_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeTask extends TokenizeAction implements Action {
    readonly type = CHANGE_CHASER_TASK_LIST;
    constructor(public token: string, public payload: { selectedTask: PrecedentHSModel }) { super(token); }
}
export class ChangePrecedentRate extends TokenizeAction implements Action {
    readonly type = CHANGE_CHASER_PRECEDENTHS_RATE;
    constructor(public token: string, public payload: { rateValue: number }) { super(token); }
}
export class ChangePrecedentUnit extends TokenizeAction implements Action {
    readonly type = CHANGE_CHASER_PRECEDENTHS_UNIT;
    constructor(public token: string, public payload: { unitValue: number }) { super(token); }
}

export class LoadAttTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadAttTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { attTypes: AttType[] }) {
        super(token);
    }
}
export class LoadAttTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ATT_TYPE_LIST_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeSection51 extends TokenizeAction implements Action {
    readonly type = CHANGE_SECTION_51;
    constructor(public token: string, public payload: { isSection51: boolean }) {
        super(token);
    }
}
export class ChangeIsBuilk extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_BUILK;
    constructor(public token: string, public payload: { isBuilk: boolean }) {
        super(token);
    }
}
export class ChangeNoOfEntry extends TokenizeAction implements Action {
    readonly type = CHANGE_NO_OF_ENTRIES;
    constructor(public token: string, public payload: { noOfEntry: number }) {
        super(token);
    }
}

export class ChangeClassType extends TokenizeAction implements Action {
    readonly type = CHANGE_CLASS_TYPE;
    constructor(public token: string, public payload: { selectedClass: ClassObj }) { super(token); }
}

export class ChangeAttType extends TokenizeAction implements Action {
    readonly type = CHANGE_ATT_TYPE;
    constructor(public token: string, public payload: { type: AttType }) { super(token); }
}

export class GetClassType extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE;
    constructor(public token: string, public payload: {
        branchId: number,
        appId: number,
        fileId: number

    }) { super(token); }
}

export class GetClassTypeSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE_SUCCESS;
    constructor(public token: string, public payload: { list: ClassObj[] }) { super(token); }
}

export class GetClassTypeFail extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE_FAIL;
    constructor(public token: string) { super(token); }
}

export class ChangeIsUncharge extends TokenizeAction implements Action {
    readonly type = CHANGE_UNCHARGE;
    constructor(public token: string, public payload: { uncharged: boolean }) { super(token); }
}

export class LoadLinkedMatterPopup extends TokenizeAction implements Action {
    readonly type = LOAD_LINKED_MATTER_POPUP;
    constructor(public token: string, public payload: { selectedMatterInfo: MatterSearchGridData, diaryIds: any }) { super(token); }

}

export class AddDiaryRecordsForPlotMattters extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD_FOR_PLOT_MATTER;
    constructor(public token: string, public request: PlotMatterDiaryRecordsInfoViewModel) {
        super(token);
    }
}

export class AddDiaryRecordsForPlotMatttersSuccess extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD_FOR_PLOT_MATTER_SUCCESS;
    constructor(public token: string, public payload: { data: GridData }) {
        super(token);
    }
}

export class AddDiaryRecordsForPlotMattterstFail extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_RECORD_FOR_PLOT_MATTER_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

// Civil 
export class GetCivilClass extends TokenizeAction implements Action {
    readonly type = GET_CIVIL_CLASS; constructor(public token: string, public payload: {
        branchId: number,
        appId: number,
        fileId: number
    }) { super(token); }
}

export class GetMailSubjectPrefix extends TokenizeAction implements Action {
    readonly type = GET_MAIL_SUBJECT_PREFIX;
    constructor(public token: string, public payload: {
        branchId: number,
        appId: number,
        fileId: number
    }) {
        super(token);
    }
}

export class GetCivilClassSuccess extends TokenizeAction implements Action {
    readonly type = GET_CIVIL_CLASS_SUCCESS;
    constructor(public token: string, public payload: { list: CivilClassObj[] }) { super(token); }
}

export class GetCivilClassFail extends TokenizeAction implements Action {
    readonly type = GET_CIVIL_CLASS_FAIL;
    constructor(public token: string) { super(token); }
}


export class LoadCivilLevelList extends TokenizeAction implements Action {
    readonly type = GET_CIVIL_LEVELS;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadCivilLevelListSuccess extends TokenizeAction implements Action {
    readonly type = GET_CIVIL_LEVELS_SUCCESS;
    constructor(public token: string, public payload: { list: CivilDropDownData[] }) {
        super(token);
    }
}

export class LoadCivilLevelListFail extends TokenizeAction implements Action {
    readonly type = GET_CIVIL_LEVELS_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class ChangeCivilClass extends TokenizeAction implements Action {
    readonly type = CHANGE_CIVIL_CLASS;
    constructor(public token: string, public payload: { selectClasss: CivilClassObj }) {
        super(token);
    }
}

export class ChangeCivilLevel extends TokenizeAction implements Action {
    readonly type = CHANGE_CIVIL_LEVEL;
    constructor(public token: string, public payload: { selectLevel: CivilDropDownData }) {
        super(token);
    }
}
export class GetMailSubjectPrefixSuccess extends TokenizeAction implements Action {
    readonly type = GET_MAIL_SUBJECT_PREFIX_SUCCESS;
    constructor(public token: string, public payload: {
        prefix: string, branchId: number,
        appId: number,
        fileId: number
    }) { super(token); }
}

export class GetMailSubjectPrefixFail extends TokenizeAction implements Action {
    readonly type = GET_MAIL_SUBJECT_PREFIX_FAIL;
    constructor(public token: string, public error, public payload: {
        branchId: number,
        appId: number,
        fileId: number
    }) { super(token); }
}

export type Any = InitChaser | LoadFileNo | LoadFileNoSuccess | LoadFileNoFail |
    LoadMatterList | LoadMatterListSuccess | LoadMatterListFail |
    LoadFeeEarnerList | LoadFeeEarnerListSuccess | LoadFeeEarnerListFail | ChangeFeeEarnerList |
    LoadFolderList | LoadFolderListSuccess | LoadFolderListFail | ChangeFolderList |
    LoadTimeTypeList | LoadTimeTypeListSuccess | LoadTimeTypeListFail | ChangeTimeTypeList |
    LoadDefaultFolder | LoadDefaultFolderSuccess | LoadDefaultFolderFail | ChangeOpenFile |
    ChangeUnitValue | ChangeFileNoteValue | ShowError |
    SendChaserEmail | SendChaserEmailSuccess | SendChaserEmailFail |
    FeeEarnerRateValueDisable | FeeEarnerRateValueDisableSuccess | FeeEarnerRateValueDisableFail |
    ClearChaserData | LoadMaterDataFromMailSubject | LoadMaterDataFromMailSubjectSuccess | LoadMaterDataFromMailSubjectFail |
    CheckEmailMailAddressIsMap | CheckEmailMailAddressIsMapSuccess | CheckEmailMailAddressIsMapFail |
    LoadContacRole | LoadContacRoleSuccess | LoadContacRoleFail | LoadChaserTypeValidation | ChaserLoadingDisable |
    LinkContactWithMatter | LinkContactWithMatterSuccess | LinkContactWithMatterFail | LoadWorkTypeList | LoadWorkTypeListSuccess |
    LoadWorkTypeListFail | ChangeWorkType | LoadPhaseList | LoadPhaseListSuccess | LoadPhaseListFail | ChangePhase | LoadActivitiList |
    LoadActivitiListSuccess | LoadActivitiListFail | ChangeActiviti | LoadTaskList | LoadTaskListSuccess | LoadTaskListFail | ChangeTask
    | GetClassType | GetClassTypeSuccess | GetClassTypeFail
    | LoadAttTypeList | LoadAttTypeListSuccess | LoadAttTypeListFail | ChangeClassType | ChangeAttType
    | ChangeSection51 | ChangeIsBuilk | ChangeNoOfEntry | ChangeIsUncharge | ChangePrecedentRate | ChangePrecedentUnit |
    LoadLinkedMatterPopup | AddDiaryRecordsForPlotMattters | AddDiaryRecordsForPlotMatttersSuccess | AddDiaryRecordsForPlotMattterstFail |
    GetCivilClass | GetCivilClassSuccess | GetCivilClassFail | LoadCivilLevelList | LoadCivilLevelListSuccess | LoadCivilLevelListFail |
    ChangeCivilClass | ChangeCivilLevel | GetMailSubjectPrefix | GetMailSubjectPrefixSuccess | GetMailSubjectPrefixFail;


