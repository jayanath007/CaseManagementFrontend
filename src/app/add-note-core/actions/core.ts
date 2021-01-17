import { DriveItem } from './../../core/lib/microsoft-graph';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import {
    DiaryType, ActionType, FeeEarner, Folder, Grade, FolderOnAttachment, NoteOnAttachment, ConditiOnAttachment,
    ExtraTimeType, AddNoteValidationInfo, AddNoteSuccessInfo, EditViewData, MatterInfo, UpdateDeletePostEntriesRequest,
    AddNoteItemData, ViewingInlineAttachement, Attachments
} from '../models/interfaces';
import { AddNoteInPutData } from '../../core/lib/addNote';
import { SubmitType } from '../models/enumeration';
import { AttType } from '../../core/lib/timeRecord';
import { WorkType, PrecedentHSModel } from '../../core/lib/precedentHS';
import { ClassObj } from '../../crime-management-core/models/interfaces';
import { DetailStatus } from '../../shared';
import { CivilClassObj } from '../../civil-class-management';
import { CivilDropDownData } from '../../civil-time-recording-desktop';

export const INIT_ADD_NOTE = 'DPS_INIT_ADD_NOTE';
export const INIT_ADD_NOTE_SUCCESS = 'DPS_INIT_ADD_NOTE_SUCCESS';
export const INIT_ADD_NOTE_FAIL = 'DPS_INIT_ADD_NOTE_FAIL';
export const ALL_DATA_UPDATE = 'DPS_ADD_NOTE_ALL_DATA_UPDATE';

export const UPLOAD_ITEMS = 'DPS_ADD_NOTE_UPLOAD_ITEMS';
export const UPLOAD_ITEMS_SUCCESS = 'DPS_ADD_NOTE_UPLOAD_ITEMS_SUCCESS';
export const UPLOAD_ITEMS_FAIL = 'DPS_ADD_NOTE_UPLOAD_ITEMS_FAIL';

export const GET_MSG_DATA = 'DPS_ADD_NOTE_GET_MSG_DATA';
export const GET_MSG_DATA_SUCCESS = 'DPS_ADD_NOTE_GET_MSG_DATA_SUCCESS';
export const GET_MSG_DATA_FAIL = 'DPS_ADD_NOTE_GET_MSG_DATA_FAIL';

export const VIEW_MSG_INLINE_ATTACHEMENT = 'DPS_ADD_NOTE_VIEW_MSG_INLINE_ATTACHEMENT';
export const DOWNLOAD_MSG_INLINE_ATTACHEMENT = 'DPS_ADD_NOTE_DOWNLOAD_MSG_INLINE_ATTACHEMENT';
export const OPEN_MSG_VIEWER_POPUP = 'DPS_ADD_NOTE_OPEN_MSG_VIEWER_POPUP';

export const LOAD_FOLDER_LIST = 'DPS_ADD_NOTE_LOAD_FOLDER_LIST';
export const LOAD_FOLDER_LIST_SUCCESS = 'DPS_ADD_NOTE_LOAD_FOLDER_LIST_SUCCESS';
export const LOAD_FOLDER_LIST_FAIL = 'DPS_ADD_NOTE_LOAD_FOLDER_LIST_FAIL';

export const GET_MATTER_DATA_FROM_MATTER_RAF = 'DPS_ADD_NOTE_GET_MATTER_DATA_FROM_MATTER_RAF';
export const GET_MATTER_DATA_FROM_MATTER_RAF_SUCCESS = 'DPS_ADD_NOTE_GET_MATTER_DATA_FROM_MATTER_RAF_SUCCESS';
export const GET_MATTER_DATA_FROM_MATTER_RAF_FAIL = 'DPS_ADD_NOTE_GET_MATTER_DATA_FROM_MATTER_RAF_FAIL';

export const LOAD_DEFULT_FOLDER = 'DPS_ADD_NOTE_LOAD_DEFULT_FOLDER';
export const LOAD_DEFULT_FOLDER_SUCCESS = 'DPS_ADD_NOTE_LOAD_DEFULT_FOLDER_SUCCESS';
export const LOAD_DEFULT_FOLDER_FAIL = 'DPS_ADD_NOTE_LOAD_DEFULT_FOLDER_FAIL';

export const LOAD_USER_GRADE_LIST = 'DPS_ADD_NOTE_LOAD_USER_GRADE_LIST';
export const LOAD_USER_GRADE_LIST_SUCCESS = 'DPS_ADD_NOTE_LOAD_USER_GRADE_LIST_SUCCESS';
export const LOAD_USER_GRADE_LIST_FAIL = 'DPS_ADD_NOTE_LOAD_USER_GRADE_LIST_FAIL';

export const LOAD_FEE_EARNER_LIST = 'DPS_ADD_NOTE_LOAD_FEE_EARNER_LIST';
export const LOAD_FEE_EARNER_LIST_SUCCESS = 'DPS_ADD_NOTE_LOAD_FEE_EARNER_LIST_SUCCESS';
export const LOAD_FEE_EARNER_LIST_FAIL = 'DPS_ADD_NOTE_LOAD_FEE_EARNER_LIST_FAIL';

export const LOAD_TIME_TYPE_LIST = 'DPS_ADD_NOTE_LOAD_TIME_TYPE_LIST';
export const LOAD_TIME_TYPE_LIST_SUCCESS = 'DPS_ADD_NOTE_LOAD_TIME_TYPE_LIST_SUCCESS';
export const LOAD_TIME_TYPE_LIST_FAIL = 'DPS_ADD_NOTE_LOAD_TIME_TYPE_LIST_FAIL';

export const LOAD_DIARY_TYPE_LIST = 'DPS_ADD_NOTE_LOAD_DIARY_TYPE_LIST';
export const LOAD_DIARY_TYPE_LIST_SUCCESS = 'DPS_ADD_NOTE_LOAD_DIARY_TYPE_LIST_SUCCESS';
export const LOAD_DIARY_TYPE_LIST_FAIL = 'DPS_ADD_NOTE_LOAD_DIARY_TYPE_LIST_FAIL';

export const LOAD_ACTION_LIST = 'DPS_ADD_NOTE_LOAD_ACTION_LIST';
export const LOAD_ACTION_LIST_SUCCESS = 'DPS_ADD_NOTE_LOAD_ACTION_LIST_SUCCESS';
export const LOAD_ACTION_LIST_FAIL = 'DPS_ADD_NOTE_LOAD_ACTION_LIST_FAIL';

export const REQUEST_ITEM_RATE = 'DPS_ADD_NOTE_REQUEST_ITEM_RATE';
export const GET_ITEM_RATE = 'DPS_ADD_NOTE_GET_ITEM_RATE';
export const SHOW_RATE_ERROR = 'DPS_ADD_NOTE_SHOW_RATE_ERROR';
export const REQUEST_EXTRA_RATE = 'DPS_ADD_NOTE_AN_REQUEST_EXTRA_RATE';
export const GET_EXTRA_RATE = 'DPS_ADD_NOTE_AN_GET_EXTRA_RATE';
export const UPDATE_CRIME_CLASS_TOTALS = 'DPS_ADD_NOTE_UPDATE_CRIME_CLASS_TOTALS';

export const CREATE_ADD_NOTE_HEADER = 'DPS_ADD_NOTE_CREATE_ADD_NOTE_HEADER';

export const CHANGE_FOLDER = 'DPS_ADD_NOTE_CHANGE_FOLDER';
export const CHANGE_FEE_EARNER = 'DPS_ADD_NOTE_CHANGE_FEE_EARNER';
export const CHANGE_DIARY_TYPE = 'DPS_ADD_NOTE_CHANGE_DIARY_TYPE';
export const CHANGE_ACTION_TYPE = 'DPS_ADD_NOTE_CHANGE_ACTION_TYPE';
export const CHANGE_EXTRA_TYPE = 'DPS_ADD_NOTE_CHANGE_EXTRA_TYPE';
export const CHANGE_EXTRA_RATE = 'DPS_ADD_NOTE_CHANGE_EXTRA_RATE';
export const CHANGE_EXTRA_UNIT = 'DPS_ADD_NOTE_CHANGE_EXTRA_UNIT';
export const CHANGE_RATE = 'DPS_ADD_NOTE_CHANGE_RATE';
export const CHANGE_UNIT = 'DPS_ADD_NOTE_CHANGE_UNIT';
export const CHANGE_GRADE = 'DPS_ADD_NOTE_CHANGE_GRADE';
export const CHANGE_UNCHARGE = 'DPS_ADD_NOTE_CHANGE_UNCHARGE';
export const CHANGE_NOTE = 'DPS_ADD_NOTE_CHANGE_NOTE';
export const CHANGE_EXTRA_TIME_TYPE = 'DPS_ADD_NOTE_CHANGE_EXTRA_TIME_TYPE';
export const CHANGE_FILE_DATA = 'DPS_ADD_NOTE_CHANGE_FILE_DATA';
export const CHANGE_PASSWORD = 'DPS_ADD_NOTE_CHANGE_PASSWORD';
export const CHANGE_DATE_DONE = 'DPS_ADD_NOTE_CHANGE_DATE_DONE';
export const CHANGE_FOLDER_ON_ATTACHMENT = 'DPS_ADD_NOTE_CHANGE_FOLDER_ON_ATTACHMENT';
export const CHANGE_NOTE_ON_ATTACHMENT = 'DPS_ADD_NOTE_CHANGE_NOTE_ON_ATTACHMENT';
export const CHANGE_IS_ATTACH_ON_ATTACHMENT = 'DPS_ADD_NOTE_CHANGE_IS_ATTACH_ON_ATTACHMENT';
export const CHANGE_IS_UNCHARGE_ON_ATTACHMENT = 'DPS_ADD_NOTE_CHANGE_IS_UNCHARGE_ON_ATTACHMENT';
export const OPEN_ATTACHMENT = 'DPS_ADD_NOTE_OPEN_ATTACHMENT';

export const GET_DOCUMENT_URL = 'DPS_ADD_NOTE_GET_DOCUMENT_URL';
export const GET_DOCUMENT_URL_FAIL = 'DPS_ADD_NOTE_GET_DOCUMENT_URL_FAIL';

export const CALCULATE_ITEM_VALUE = 'DPS_ADD_NOTE_CALCULATE_ITEM_VALUE';
export const CALCULATE_EXTRA_ITEM_VALUE = 'DPS_ADD_NOTE_CALCULATE_EXTRA_ITEM_VALUE';

export const ADD_NOTE_SUBMIT = 'DPS_ADD_NOTE_SUBMIT';
export const ADD_NOTE_VALIDATION = 'DPS_ADD_NOTE_VALIDATION';
export const ADD_NOTE_SUBMIT_SCCEESS = 'DPS_ADD_NOTE_SUBMIT_SCCEESS';

export const ADD_NOTE_SAVE_SCCEESS = 'DPS_ADD_NOTE_SAVE_SCCEESS';
export const ADD_NOTE_SAVE_FAIL = 'DPS_ADD_NOTE_SAVE_FAIL';


// -------------------------------------------------------

// export const FILE_UPLOAD = 'FILE_UPLOAD';
// export const GET_ATTACHMENT = 'GET_ATTACHMENT';

export const ADD_NOTE_CLOSE = 'DPS_ADD_NOTE_CLOSE';

export const CHECK_ADD_NOTE_ACCESS = 'DPS_ADD_NOTE_CHECK_ADD_NOTE_ACCESS';
export const CHECK_ADD_NOTE_ACCESS_SUCCESS = 'DPS_ADD_NOTE_CHECK_ADD_NOTE_ACCESS_SUCCESS';
export const CHECK_ADD_NOTE_ACCESS_FAIL = 'DPS_ADD_NOTE_CHECK_ADD_NOTE_ACCESS_FAIL';

export const GET_EDIT_VIEW_DATA = 'DPS_ADD_NOTE_GET_EDIT_VIEW_DATA';
export const GET_EDIT_VIEW_DATA_SUCCESS = 'DPS_ADD_NOTE_GET_EDIT_VIEW_DATA_SUCCESS';
export const GET_EDIT_VIEW_DATA_FAIL = 'DPS_ADD_NOTE_GET_EDIT_VIEW_DATA_FAIL';

export const EMAIL_IN_VALIDATION = 'DPS_ADD_NOTE_EMAIL_IN_VALIDATION';

export const CHANGE_SEND_FOR_SIGNATURE = 'DPS_ADD_NOTE_CHANGE_SEND_FOR_SIGNATURE';
export const CHANGE_SEND_FOR_SIGNATURE_TO = 'DPS_ADD_NOTE_CHANGE_SEND_FOR_SIGNATURE_TO';
export const SIGN_AND_SHARE_OR_SHARE = 'DPS_ADD_NOTE_SIGN_AND_SHARE_OR_SHARE_1';
export const ADD_DIARY_ID = 'DPS_ADD_NOTE_ADD_DIARY_ID';

// eBilling Comment
export const LOAD_ADD_NOTE_WORK_TYPE_LIST = 'DPS_LOAD_ADD_NOTE_WORK_TYPE_LIST';
export const LOAD_ADD_NOTE_WORK_TYPE_LIST_SUCCESS = 'DPS_LOAD_ADD_NOTE_WORK_TYPE_LIST_SUCCESS';
export const LOAD_ADD_NOTE_WORK_TYPE_LIST_FAIL = 'DPS_LOAD_ADD_NOTE_WORK_TYPE_LIST_FAIL';
export const CHANGE_ADD_NOTE_WORK_TYPE_LIST = 'DPS_CHANGE_ADD_NOTE_WORK_TYPE_LIST';
export const LOAD_ADD_NOTE_PHASE_LIST = 'DPS_LOAD_ADD_NOTE_PHASE_LIST';
export const LOAD_ADD_NOTE_PHASE_LIST_SUCCESS = 'DPS_LOAD_ADD_NOTE_PHASE_LIST_SUCCESS';
export const LOAD_ADD_NOTE_PHASE_LIST_FAIL = 'DPS_LOAD_ADD_NOTE_PHASE_LIST_FAIL';
export const CHANGE_ADD_NOTE_PHASE_LIST = 'DPS_CHANGE_ADD_NOTE_PHASE_LIST';
export const LOAD_ADD_NOTE_ACTIVITI_LIST = 'DPS_LOAD_ADD_NOTE_ACTIVITI_LIST';
export const LOAD_ADD_NOTE_ACTIVITI_LIST_SUCCESS = 'DPS_LOAD_ADD_NOTE_ACTIVITI_LIST_SUCCESS';
export const LOAD_ADD_NOTE_ACTIVITI_LIST_FAIL = 'DPS_LOAD_ADD_NOTE_ACTIVITI_LIST_FAIL';
export const CHANGE_ADD_NOTE_ACTIVITI_LIST = 'DPS_CHANGE_ADD_NOTE_ACTIVITI_LIST';
export const LOAD_ADD_NOTE_TASK_LIST = 'DPS_LOAD_ADD_NOTE_TASK_LIST';
export const LOAD_ADD_NOTE_TASK_LIST_SUCCESS = 'DPS_LOAD_ADD_NOTE_TASK_LIST_SUCCESS';
export const LOAD_ADD_NOTE_TASK_LIST_FAIL = 'DPS_LOAD_ADD_NOTE_TASK_LIST_FAIL';
export const CHANGE_ADD_NOTE_TASK_LIST = 'DPS_CHANGE_ADD_NOTE_TASK_LIST';

// Crime
export const GET_CLASS_TYPE = 'DPS_CHANGE_ADD_NOTE_GET_CLASS_TYPE';
export const GET_CLASS_TYPE_SUCCESS = 'DPS_CHANGE_ADD_NOTE_GET_CLASS_SUCCESS';
export const GET_CLASS_TYPE_FAIL = 'DPS_CHANGE_ADD_NOTE_GET_CLASS_FAIL';
export const CHANGE_CLASS_TYPE = 'DPS_CHANGE_ADD_NOTE_CHANGE_CLASS_TYPE';

export const LOAD_ATT_TYPE_LIST = 'DPS_ADD_NOTE_LOAD_ATT_TYPE_LIST';
export const LOAD_ATT_TYPE_LIST_SUCCESS = 'DPS_ADD_NOTE_LOAD_ATT_TYPE_LIST_SUCCESS';
export const LOAD_ATT_TYPE_LIST_FAIL = 'DPS_ADD_NOTE_LOAD_ATT_TYPE_LIST_FAIL';
export const CHANGE_ATT_TYPE = 'DPS_CHANGE_ADD_NOTE_CHANGE_ATT_TYPE';

// Civil
export const GET_CIVIL_CLASS = 'DPS_CHANGE_ADD_NOTE_GET_CIVIL_CLASS';
export const GET_CIVIL_CLASS_SUCCESS = 'DPS_CHANGE_ADD_NOTE_GET_CIVIL_CLASS_SUCCESS';
export const GET_CIVIL_CLASS_FAIL = 'DPS_CHANGE_ADD_NOTE_GET_CIVIL_CLASS_FAIL';
export const GET_CIVIL_LEVELS = 'DPS_ADD_NOTE_GET_CIVIL_LEVELS';
export const GET_CIVIL_LEVELS_SUCCESS = 'DPS_ADD_NOTE_GET_CIVIL_LEVELS_SUCCESS';
export const GET_CIVIL_LEVELS_FAIL = 'DPS_ADD_NOTE_GET_CIVIL_LEVELS_FAIL';
export const CHANGE_CIVIL_CLASS = 'DPS_CHANGE_ADD_NOTE_CIVIL_CLASS';
export const CHANGE_CIVIL_LEVEL = 'DPS_CHANGE_ADD_NOTE_CIVIL_LEVEL';
export const CHANGE_CIVIL_COURT = 'DPS_CHANGE_ADD_NOTE_CIVIL_COURT';


export const CHANGE_SECTION_51 = 'DPS_CHANGE_ADD_NOTE_CHANGE_SECTION_51';
export const CHANGE_IS_BUILK = 'DPS_CHANGE_ADD_NOTE_IS_BUILK';
export const CHANGE_NO_OF_ENTRIES = 'DPS_CHANGE_ADD_NOTE_NO_OF_ENTRIES';
export const CHANGE_IS_TELEPHONE_ADV = 'DPS_CHANGE_ADD_NOTE_IS_TELEPHONE_ADV';

export const OPEN_SIGN_AND_SHARE = 'DPS_OPEN_SIGN_AND_SHARE';
export const UPDATE_DELETE_POST_ENTRY = 'DPS_ADD_NOTE_UPDATE_DELETE_POST_ENTRY';
export const UPDATE_DELETE_POST_ENTRY_SUCCESS = 'DPS_ADD_NOTE_UPDATE_DELETE_POST_ENTRY_SUCCESS';
export const UPDATE_DELETE_POST_ENTRY_FAIL = 'DPS_ADD_NOTE_UPDATE_DELETE_POST_ENTRY_FAIL';
export const OPEN_SIGN_AND_SHARE_FAIL = 'DPS_ADD_NOTE_OPEN_SIGN_AND_SHARE_FAIL';

export class InitAddNote extends TokenizeAction implements Action {
    readonly type = INIT_ADD_NOTE;
    constructor(public token: string, public payload: {
        inPutData: AddNoteInPutData,
        loginUser: string
        timeUseFeeEarnerGradesValueDisable: boolean;
        dateTimeOffset: number;
        isAttachmentUC: boolean;
    }) {
        super(token);
    }
}

export class InitAddNoteSuccess extends TokenizeAction implements Action {
    readonly type = INIT_ADD_NOTE_SUCCESS;
    constructor(public token: string, public payload: { isEdit: boolean }) {
        super(token);
    }
}

export class UploadItems extends TokenizeAction implements Action {
    readonly type = UPLOAD_ITEMS;
    constructor(public token: string, public payload: { inPutData: AddNoteInPutData }) {
        super(token);
    }
}

export class UploadItemsSuccess extends TokenizeAction implements Action {
    readonly type = UPLOAD_ITEMS_SUCCESS;
    constructor(public token: string, public payload: { itemDataList: AddNoteItemData[] }) {
        super(token);
    }
}

export class UploadItemsFail extends TokenizeAction implements Action {
    readonly type = UPLOAD_ITEMS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class GetMsgData extends TokenizeAction implements Action {
    readonly type = GET_MSG_DATA;
    constructor(public token: string, public payload: { itemData: AddNoteItemData }) {
        super(token);
    }
}
export class GetMsgDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_MSG_DATA_SUCCESS;
    constructor(public token: string, public payload: { itemData: AddNoteItemData, dateTimeOffset: number }) {
        super(token);
    }
}
export class GetMsgDataFail extends TokenizeAction implements Action {
    readonly type = GET_MSG_DATA_FAIL;
    constructor(public token: string, public payload: { itemData: AddNoteItemData, error: any }) {
        super(token);
    }
}
export class ViewMsgInlineAttachement extends TokenizeAction implements Action {
    readonly type = VIEW_MSG_INLINE_ATTACHEMENT;
    constructor(public token: string, public payload: { parentItemIndex: number, attachment: Attachments }) {
        super(token);
    }
}

export class DownloadMsgInlineAttachement extends TokenizeAction implements Action {
    readonly type = DOWNLOAD_MSG_INLINE_ATTACHEMENT;
    constructor(public token: string, public payload: { parentItemIndex: number, attachment: Attachments }) {
        super(token);
    }
}
export class OpenMsgViewerPopup implements Action {
    readonly type = OPEN_MSG_VIEWER_POPUP;
    constructor(public appCode: string, public branchId: number,
        public fileId: number, public itemRef: string, public attachmentRef: string, public attachmentName: string) {
    }
}
export class AllDataUpDate extends TokenizeAction implements Action {
    readonly type = ALL_DATA_UPDATE;
    constructor(public token: string) {
        super(token);
    }
}

export class LoadFolderList extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST;
    constructor(public token: string) { super(token); }
}

export class LoadFolderListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_SUCCESS;
    constructor(public token: string, public payload: { folderList: Folder[] }) { super(token); }
}

export class LoadFolderListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}

export class LoadDefultFolder extends TokenizeAction implements Action {
    readonly type = LOAD_DEFULT_FOLDER;
    constructor(public token: string) { super(token); }
}
export class LoadDefultFolderSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DEFULT_FOLDER_SUCCESS;
    constructor(public token: string, public payload: { defualtFolder: number }) { super(token); }
}
export class LoadDefultFolderFail extends TokenizeAction implements Action {
    readonly type = LOAD_DEFULT_FOLDER_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}

// user grade stuf
export class LoadUserGradeList extends TokenizeAction implements Action {
    readonly type = LOAD_USER_GRADE_LIST;
    constructor(public token: string) { super(token); }
}
export class LoadUserGradeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_USER_GRADE_LIST_SUCCESS;
    constructor(public token: string, public payload: { userGradeList: Grade[], defualtUserGrade: Grade }) { super(token); }
}
export class LoadUserGradeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_USER_GRADE_LIST_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}

// Fee Earner stuf
export class LoadFeeEarnerList extends TokenizeAction implements Action {
    readonly type = LOAD_FEE_EARNER_LIST;
    constructor(public token: string) { super(token); }
}
export class LoadFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FEE_EARNER_LIST_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: FeeEarner[] }) { super(token); }
}
export class LoadFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FEE_EARNER_LIST_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}

// diary type stuf
export class LoadDiaryTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_DIARY_TYPE_LIST;
    constructor(public token: string) { super(token); }
}
export class LoadDiaryTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DIARY_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { diaryTypeList: DiaryType[], appId: number }) { super(token); }
}
export class LoadDiaryTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_DIARY_TYPE_LIST_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}

// Extra type stuf
export class LoadExtraTimeTypeTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TYPE_LIST;
    constructor(public token: string) { super(token); }
}
export class LoadExtraTimeTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { extraTimeType: ExtraTimeType[] }) { super(token); }
}
export class LoadExtraTimeTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_TIME_TYPE_LIST_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}

// Change Action stuf
export class LoadActionList extends TokenizeAction implements Action {
    readonly type = LOAD_ACTION_LIST;
    constructor(public token: string) { super(token); }
}
export class LoadActionListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ACTION_LIST_SUCCESS;
    constructor(public token: string, public payload: { ActionTypeList: ActionType[] }) { super(token); }
}
export class LoadActionListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ACTION_LIST_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}

export class ChangeFolder extends TokenizeAction implements Action {
    readonly type = CHANGE_FOLDER;
    constructor(public token: string, public payload: { folder: Folder }) { super(token); }
}

export class ChangefeeEarner extends TokenizeAction implements Action {
    readonly type = CHANGE_FEE_EARNER;
    constructor(public token: string, public payload: string) { super(token); }
}

export class ChangeUnit extends TokenizeAction implements Action {
    readonly type = CHANGE_UNIT;
    constructor(public token: string, public payload: { unit: number }) { super(token); }
}

export class ChangeGrade extends TokenizeAction implements Action {
    readonly type = CHANGE_GRADE;
    constructor(public token: string, public payload: { Grade: Grade }) { super(token); }
}
export class CreateAddNoteHeader extends TokenizeAction implements Action {
    readonly type = CREATE_ADD_NOTE_HEADER;
    constructor(public token: string) { super(token); }
}
export class ChangeNote extends TokenizeAction implements Action {
    readonly type = CHANGE_NOTE;
    constructor(public token: string, public payload: { note: string }) { super(token); }
}
export class ChangeFileData extends TokenizeAction implements Action {
    readonly type = CHANGE_FILE_DATA;
    constructor(public token: string, public payload: { fileDataList: File[] | DriveItem[] }) { super(token); }
}
export class ChangePassword extends TokenizeAction implements Action {
    readonly type = CHANGE_PASSWORD;
    constructor(public token: string, public payload: { password: string }) { super(token); }
}
export class ChangeDeteDone extends TokenizeAction implements Action {
    readonly type = CHANGE_DATE_DONE;
    constructor(public token: string, public payload: { dateDone: string }) { super(token); }
}
export class ChangeFolderOnAttachment extends TokenizeAction implements Action {
    readonly type = CHANGE_FOLDER_ON_ATTACHMENT;
    constructor(public token: string, public payload: FolderOnAttachment) { super(token); }
}
export class ChangeNoteOnAttachment extends TokenizeAction implements Action {
    readonly type = CHANGE_NOTE_ON_ATTACHMENT;
    constructor(public token: string, public payload: NoteOnAttachment) { super(token); }
}
export class ChangeIsAttachOnAttachment extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_ATTACH_ON_ATTACHMENT;
    constructor(public token: string, public payload: ConditiOnAttachment) { super(token); }
}
export class ChangeIsUnchargeOnAttachment extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_UNCHARGE_ON_ATTACHMENT;
    constructor(public token: string, public payload: ConditiOnAttachment) { super(token); }
}
export class ChangeDiaryType extends TokenizeAction implements Action {
    readonly type = CHANGE_DIARY_TYPE;
    constructor(public token: string, public payload: { diaryType: DiaryType }) { super(token); }
}
export class ChangeActionType extends TokenizeAction implements Action {
    readonly type = CHANGE_ACTION_TYPE;
    constructor(public token: string, public payload: { actionType: ActionType }) { super(token); }
}
export class ChangeIsUncharge extends TokenizeAction implements Action {
    readonly type = CHANGE_UNCHARGE;
    constructor(public token: string, public payload: { uncharged: boolean }) { super(token); }
}
export class ChangeRate extends TokenizeAction implements Action {
    readonly type = CHANGE_RATE;
    constructor(public token: string, public payload: { rate: number }) { super(token); }
}

export class ChangeExtraRate extends TokenizeAction implements Action {
    readonly type = CHANGE_EXTRA_RATE;
    constructor(public token: string, public payload: { extraRate: number }) { super(token); }
}
export class ChangeSendForSignature extends TokenizeAction implements Action {
    readonly type = CHANGE_SEND_FOR_SIGNATURE;
    constructor(public token: string, public payload: boolean) { super(token); }
}
export class ChangeSendForSignatureTo extends TokenizeAction implements Action {
    readonly type = CHANGE_SEND_FOR_SIGNATURE_TO;
    constructor(public token: string, public payload: string) { super(token); }
}

export class ChangeExtraUnit extends TokenizeAction implements Action {
    readonly type = CHANGE_EXTRA_UNIT;
    constructor(public token: string, public payload: { extraUnit: number }) { super(token); }
}

export class ClaculateItemValue extends TokenizeAction implements Action {
    readonly type = CALCULATE_ITEM_VALUE;
    constructor(public token: string, public payload: { fileNoteValue: number }) { super(token); }
}

export class ClaculateExtraItemValue extends TokenizeAction implements Action {
    readonly type = CALCULATE_EXTRA_ITEM_VALUE;
    constructor(public token: string, public payload: { extraValue: number }) { super(token); }
}

export class ChangeExtraTimeType extends TokenizeAction implements Action {
    readonly type = CHANGE_EXTRA_TIME_TYPE;
    constructor(public token: string, public payload: { extraTimeType: ExtraTimeType }) { super(token); }
}

export class AddNoteSubmit extends TokenizeAction implements Action {
    readonly type = ADD_NOTE_SUBMIT;
    constructor(public token: string, public payload: {
        submitSuccess: boolean, fileIndex: number, submitType: SubmitType, password: string
    }) { super(token); }
}

export class AddNoteValidation extends TokenizeAction implements Action {
    readonly type = ADD_NOTE_VALIDATION;
    constructor(public token: string, public payload: { validation: AddNoteValidationInfo }) { super(token); }
}

export class AddNoteSubmitSuccess extends TokenizeAction implements Action {
    readonly type = ADD_NOTE_SUBMIT_SCCEESS;
    constructor(public token: string, public payload: {
        submitSuccess: boolean, fileIndex: number, submitType: SubmitType, password: string
    }) { super(token); }
}

export class AddNoteSaveSuccess extends TokenizeAction implements Action {
    readonly type = ADD_NOTE_SAVE_SCCEESS;
    constructor(public token: string, public payload: { AddNoteSuccessInfo: AddNoteSuccessInfo }) { super(token); }
}

export class AddNoteSaveFail extends TokenizeAction implements Action {
    readonly type = ADD_NOTE_SAVE_FAIL;
    constructor(public token: string, public payload: { AddNoteSuccessInfo: AddNoteSuccessInfo }) { super(token); }
}

export class AddNoteClose extends TokenizeAction implements Action {
    readonly type = ADD_NOTE_CLOSE;
    constructor(public token: string) { super(token); }
}

export class CheckAddNoteAccess extends TokenizeAction implements Action {
    readonly type = CHECK_ADD_NOTE_ACCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class CheckAddNoteAccessSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_ADD_NOTE_ACCESS_SUCCESS;
    constructor(public token: string, public payload: { isAccess: boolean }) {
        super(token);
    }
}

export class CheckAddNoteAccessFail extends TokenizeAction implements Action {
    readonly type = CHECK_ADD_NOTE_ACCESS_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}

export class GetEditViewData extends TokenizeAction implements Action {
    readonly type = GET_EDIT_VIEW_DATA;
    constructor(public token: string) {
        super(token);
    }
}

export class GetEditViewDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_EDIT_VIEW_DATA_SUCCESS;
    constructor(public token: string, public payload: { editViewData: EditViewData }) {
        super(token);
    }
}

export class GetEditViewDataFail extends TokenizeAction implements Action {
    readonly type = GET_EDIT_VIEW_DATA_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}

export class EmailInValidation extends TokenizeAction implements Action {
    readonly type = EMAIL_IN_VALIDATION;
    constructor(public token: string, public payload: { validation: AddNoteValidationInfo, fileData: any }) { super(token); }
}

export class RequestItemRate extends TokenizeAction implements Action {
    readonly type = REQUEST_ITEM_RATE;
    constructor(public token: string) { super(token); }
}
export class GetItemRate extends TokenizeAction implements Action {
    readonly type = GET_ITEM_RATE;
    constructor(public token: string, public payload: { rate: number, error: DetailStatus[] }) { super(token); }
}

export class ShowRateError extends TokenizeAction implements Action {
    readonly type = SHOW_RATE_ERROR;
    constructor(public token: string, public payload: DetailStatus[]) { super(token); }
}

export class UpdateCrimeClassTotals extends TokenizeAction implements Action {
    readonly type = UPDATE_CRIME_CLASS_TOTALS;
    constructor(public token: string, public payload: { branchId: number, fileId: number, classId: number }) { super(token); }
}

export class RequestExtraRate extends TokenizeAction implements Action {
    readonly type = REQUEST_EXTRA_RATE;
    constructor(public token: string) { super(token); }
}
export class GetExtraRate extends TokenizeAction implements Action {
    readonly type = GET_EXTRA_RATE;
    constructor(public token: string, public payload: { rate: number }) { super(token); }
}

// get matter data stuf
export class LoadMatterDataList extends TokenizeAction implements Action {
    readonly type = GET_MATTER_DATA_FROM_MATTER_RAF;
    constructor(public token: string) { super(token); }
}
export class LoadMatterDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTER_DATA_FROM_MATTER_RAF_SUCCESS;
    constructor(public token: string, public payload: { matterRefCat: string }) {
        super(token);
    }
}
export class LoadMatterDataFail extends TokenizeAction implements Action {
    readonly type = GET_MATTER_DATA_FROM_MATTER_RAF_FAIL;
    constructor(public token: string, public payload: any) { super(token); }
}
export class OpenAttachment extends TokenizeAction implements Action {
    readonly type = OPEN_ATTACHMENT;
    constructor(public token: string, public payload: { reference: string, parentItemIndex: number }) { super(token); }
}
export class GetDocumentURL extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_URL;
    constructor(public token: string, public payload: ViewingInlineAttachement) { super(token); }
}
export class GetDocumentURLFail extends TokenizeAction implements Action {
    readonly type = GET_DOCUMENT_URL_FAIL;
    constructor(public token: string, public payload: { validation: AddNoteValidationInfo }) { super(token); }
}

export class SignAndShareOrShare extends TokenizeAction implements Action {
    readonly type = SIGN_AND_SHARE_OR_SHARE;
    constructor(public token: string, public payload: {
        fileCredentials: { diaryId: number, letterName: string }[], signToken: string, submitType: SubmitType,
        url: string, matterData: MatterInfo, password: string, isloop: boolean, subjectNote: string,
    }) { super(token); }
}
export class AddDiaryId extends TokenizeAction implements Action {
    readonly type = ADD_DIARY_ID;
    constructor(public token: string, public payload: { diaryId: number }) { super(token); }
}


export class LoadWorkTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_WORK_TYPE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadWorkTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_WORK_TYPE_LIST_SUCCESS;
    constructor(public token: string, public payload: { workTypeList: WorkType[] }) {
        super(token);
    }
}
export class LoadWorkTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_WORK_TYPE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeWorkType extends TokenizeAction implements Action {
    readonly type = CHANGE_ADD_NOTE_WORK_TYPE_LIST;
    constructor(public token: string, public payload: { selectedWorktype: WorkType }) { super(token); }
}
// Phase

export class LoadPhaseList extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_PHASE_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadPhaseListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_PHASE_LIST_SUCCESS;
    constructor(public token: string, public payload: { phaseList: PrecedentHSModel[] }) {
        super(token);
    }
}
export class LoadPhaseListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_PHASE_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}

export class ChangePhase extends TokenizeAction implements Action {
    readonly type = CHANGE_ADD_NOTE_PHASE_LIST;
    constructor(public token: string, public payload: { selectedPhase: PrecedentHSModel }) { super(token); }
}
// activitiList
export class LoadActivitiList extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_ACTIVITI_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadActivitiListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_ACTIVITI_LIST_SUCCESS;
    constructor(public token: string, public payload: { activitiList: PrecedentHSModel[] }) {
        super(token);
    }
}
export class LoadActivitiListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_ACTIVITI_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeActiviti extends TokenizeAction implements Action {
    readonly type = CHANGE_ADD_NOTE_ACTIVITI_LIST;
    constructor(public token: string, public payload: { selectedActiviti: PrecedentHSModel }) { super(token); }
}
// TaskList

export class LoadTaskList extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_TASK_LIST;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadTaskListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_TASK_LIST_SUCCESS;
    constructor(public token: string, public payload: { taskList: PrecedentHSModel[] }) {
        super(token);
    }
}
export class LoadTaskListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ADD_NOTE_TASK_LIST_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeTask extends TokenizeAction implements Action {
    readonly type = CHANGE_ADD_NOTE_TASK_LIST;
    constructor(public token: string, public payload: { selectedTask: PrecedentHSModel }) { super(token); }
}

// Crime
export class GetClassType extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE;
    constructor(public token: string, public payload: {
        branchId: number,
        appId: number,
        fileId: number

    }) {
        super(token);
    }
}

export class GetClassTypeSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE_SUCCESS;
    constructor(public token: string, public payload: { list: ClassObj[] }) { super(token); }
}

export class GetClassTypeFail extends TokenizeAction implements Action {
    readonly type = GET_CLASS_TYPE_FAIL;
    constructor(public token: string) { super(token); }
}

// Civil
export class GetCivilClass extends TokenizeAction implements Action {
    readonly type = GET_CIVIL_CLASS;
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

export class ChangeClassType extends TokenizeAction implements Action {
    readonly type = CHANGE_CLASS_TYPE;
    constructor(public token: string, public payload: { selectedClass: ClassObj }) { super(token); }
}

export class ChangeAttType extends TokenizeAction implements Action {
    readonly type = CHANGE_ATT_TYPE;
    constructor(public token: string, public payload: { type: AttType }) { super(token); }
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
export class ChangeCivilCourt extends TokenizeAction implements Action {
    readonly type = CHANGE_CIVIL_COURT;
    constructor(public token: string, public payload: { selectCourt: CivilDropDownData }) {
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

export class ChangeIsTelephoneAdv extends TokenizeAction implements Action {
    readonly type = CHANGE_IS_TELEPHONE_ADV;
    constructor(public token: string, public payload: { isTelephoneAdv: boolean }) {
        super(token);
    }
}

export class OpenSignAndShare extends TokenizeAction implements Action {
    readonly type = OPEN_SIGN_AND_SHARE;
    constructor(public token: string,
        public payload: {
            password: string, fileCredentials?: { diaryId: number, letterName: string }[],
            isloop: boolean, matterData: any, subjectNote: string
        }) {
        super(token);
    }
}

export class OpenSignAndShareFail extends TokenizeAction implements Action {
    readonly type = OPEN_SIGN_AND_SHARE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}


export class UpdateDeletePostEntries extends TokenizeAction implements Action {
    readonly type = UPDATE_DELETE_POST_ENTRY;
    constructor(public token: string, public payload: { request: UpdateDeletePostEntriesRequest }) {
        super(token);
    }
}


export class UpdateDeletePostEntriesSuccess extends TokenizeAction implements Action {
    readonly type = UPDATE_DELETE_POST_ENTRY_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class UpdateDeletePostEntriesFail extends TokenizeAction implements Action {
    readonly type = UPDATE_DELETE_POST_ENTRY_FAIL;
    constructor(public token: string) {
        super(token);
    }
}


export type Any = InitAddNote | ChangeUnit | ChangeFolder | ChangeGrade |
    LoadFolderList | LoadFolderListSuccess | LoadFolderListFail |
    LoadUserGradeList | LoadUserGradeListFail | LoadUserGradeListSuccess |
    LoadFeeEarnerList | LoadFeeEarnerListSuccess | LoadFeeEarnerListFail |
    LoadDiaryTypeList | LoadDiaryTypeListSuccess | LoadDiaryTypeListFail |
    LoadActionList | LoadActionListSuccess | LoadActionListFail |
    LoadDefultFolder | LoadDefultFolderSuccess | LoadDefultFolderFail |
    CreateAddNoteHeader | ChangeNote | ChangePassword |
    ChangeDeteDone | ChangeFolderOnAttachment | ChangeNoteOnAttachment |
    ChangeIsAttachOnAttachment | ChangeIsUnchargeOnAttachment |
    ChangefeeEarner | ChangeDiaryType | ChangeIsUncharge | ChangeRate |
    ClaculateItemValue | ChangeExtraRate | ChangeExtraUnit |
    ClaculateExtraItemValue | LoadExtraTimeTypeTypeList | LoadExtraTimeTypeListSuccess |
    LoadExtraTimeTypeListFail | ChangeExtraTimeType | AddNoteSubmit | AddNoteSubmitSuccess |
    AddNoteValidation | ChangeActionType | InitAddNoteSuccess |
    AddNoteSaveSuccess | AddNoteSaveFail | AddNoteClose |
    CheckAddNoteAccess | CheckAddNoteAccessSuccess | CheckAddNoteAccessFail |
    GetEditViewData | GetEditViewDataSuccess | GetEditViewDataFail |
    EmailInValidation | GetItemRate | LoadMatterDataList | LoadMatterDataSuccess | LoadMatterDataFail |
    OpenAttachment | GetDocumentURL | GetDocumentURLFail | RequestItemRate | AllDataUpDate |
    RequestExtraRate | GetExtraRate | ChangeSendForSignature | ChangeSendForSignatureTo | SignAndShareOrShare |
    ChangeFileData | AddDiaryId | LoadWorkTypeList | LoadWorkTypeListSuccess | LoadWorkTypeListFail | ChangeWorkType |
    LoadPhaseList | LoadPhaseListSuccess | LoadPhaseListFail | ChangePhase |
    LoadActivitiList | LoadActivitiListSuccess | LoadActivitiListFail | ChangeActiviti |
    LoadTaskList | LoadTaskListSuccess | LoadTaskListFail | ChangeTask |
    GetClassType | GetClassTypeSuccess | GetClassTypeFail |
    LoadAttTypeList | LoadAttTypeListSuccess | LoadAttTypeListFail | ChangeClassType | ChangeAttType |
    ChangeSection51 | ChangeIsBuilk | ChangeNoOfEntry | ChangeIsTelephoneAdv |
    UpdateDeletePostEntries | UpdateDeletePostEntriesSuccess | UpdateDeletePostEntriesFail |
    UploadItems | UploadItemsSuccess | UploadItemsFail |
    GetMsgData | GetMsgDataSuccess | GetMsgDataFail |
    OpenSignAndShareFail | GetCivilClass | GetCivilClassSuccess | GetCivilClassFail |
    LoadCivilLevelList | LoadCivilLevelListSuccess | LoadCivilLevelListFail | ChangeCivilClass | ChangeCivilLevel | ChangeCivilCourt;
