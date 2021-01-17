import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { FeeEarner, Folder, ActionType, AddEditTaskSaveSuccessInfo, AddEditTaskViewModel, MatterResponce } from '../models/interface';


export const INIT_ADD_EDIT_TASK = 'INIT_ADD_EDIT_TASK';

// Folder stuff
export const LOAD_FOLDER_LIST_ADD_EDIT_TASK = 'DPS_LOAD_FOLDER_LIST_ADD_EDIT_TASK';
export const LOAD_FOLDER_LIST_ADD_EDIT_TASK_SUCCESS = 'DPS_LOAD_FOLDER_LIST_ADD_EDIT_TASK_SUCCESS';
export const LOAD_FOLDER_LIST_ADD_EDIT_TASK_FAIL = 'DPS_LOAD_FOLDER_LIST_ADD_EDIT_TASK_FAIL';
export const CHANG_FOLDER_ADD_EDIT_TASK = 'DPS_CHANGE_FOLDER_ADD_EDIT_TASK';

// Default Folder stuff
export const LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK = 'DPS_LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK';
export const LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_SUCCESS = 'DPS_LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_SUCCESS';
export const LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_FAIL = 'DPS_LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_FAIL';

// FeeEarner stuff
export const LOAD_FE_LIST_ADD_EDIT_TASK = 'DPS_LOAD_FE_LIST_ADD_EDIT_TASK';
export const LOAD_FE_LIST_ADD_EDIT_TASK_SUCCESS = 'DPS_LOAD_FE_LIST_ADD_EDIT_TASK_SUCCESS';
export const LOAD_FE_LIST_ADD_EDIT_TASK_FAIL = 'DPS_LOAD_FE_LIST_ADD_EDIT_TASK_FAIL';
export const CHANGE_FE_LIST_ADD_EDIT_TASK = 'DPS_CHANGE_FE_LIST_ADD_EDIT_TASK';
// Action stuff
export const LOAD_ACTION_LIST_ADD_EDIT_TASK = 'DPS_LOAD_ACTION_LIST_ADD_EDIT_TASK';
export const LOAD_ACTION_LIST_ADD_EDIT_TASK_SUCCESS = 'DPS_LOAD_ACTION_LIST_ADD_EDIT_TASK_SUCCESS';
export const LOAD_ACTION_LIST_ADD_EDIT_TASK_FAIL = 'DPS_LOAD_ACTION_LIST_ADD_EDIT_TASK_FAIL';
export const CHANGE_ACTION_ADD_EDIT_TASK = 'DPS_CHANGE_ACTION_ADD_EDIT_TASK';

export const SUBMIT_ADD_EDIT_TASK = 'DPS_SUBMIT_ADD_EDIT_TASK';
export const SUBMIT_ADD_EDIT_TASK_SUCCESS = 'DPS_SUBMIT_ADD_EDIT_TASK_SUCCESS';
export const SUBMIT_ADD_EDIT_TASK_FAIL = 'DPS_SUBMIT_ADD_EDIT_TASK_FAIL';

export const TASK_ADD_EDIT_CLOSE_POPUP = 'DPS_TASK_ADD_EDIT_CLOSE_POPUP';
export const TASK_ADD_EDIT_SELECTED_MATTER_DATA = 'DPS_TASK_ADD_EDIT_SELECTED_MATTER_DATA';

export const TASK_ADD_EDIT_UPDATE_FILE_DATA = 'DPS_TASK_ADD_EDIT_UPDATE_FILE_DATA';
export const TASK_ADD_EDIT_UPDATE_FILE_PASSWORD = 'DPS_TASK_ADD_EDIT_UPDATE_FILE_PASSWORD';

export const TASK_ADD_EDIT_CHANGE_DATE = 'DPS_TTASK_ADD_EDIT_CHANGE_DATE';
export const TASK_ADD_EDIT_CHANGE_NOTE = 'DPS_TASK_ADD_EDIT_CHANGE_NOTE_DIARY';

export const CHECK_IS_TIME_RECORDING_ENABLE_SUCCESS = 'DPS_TASK_ADD_EDIT_CHECK_IS_TIME_RECORDING_ENABLE_SUCCESS';
export const CHECK_IS_TIME_RECORDING_ENABLE_FAIL = 'DPS_TASK_ADD_EDIT_CHECK_IS_TIME_RECORDING_ENABLE_FAIL';

export const SHOW_ERROR = 'DPS_TASK_ADD_EDIT_SHOW_ERROR';

export const ENTER_UNLOCK_PW = 'DPS_TASK_ADD_EDIT_ENTER_UNLOCK_PW';
export const PASSWORD_VALIDATION_SUCCESS = 'DPS_TASK_ADD_EDIT_PASSWORD_VALIDATION_SUCCESS';
export const PASSWORD_VALIDATION_FAIL = 'DPS_TASK_ADD_EDIT_PASSWORD_VALIDATION_FAIL';

export class InitAddEditTask extends TokenizeAction implements Action {
    readonly type = INIT_ADD_EDIT_TASK;
    constructor(public token: string, public payload: { inputData: any, timeOffset: number }) {
        super(token);
    }
}

export class ShowError extends TokenizeAction implements Action {
    readonly type = SHOW_ERROR;
    constructor(public token: string, public payload: { msg: string }) {
        super(token);
    }
}

export class ChangeAddEditTaskDate extends TokenizeAction implements Action {
    readonly type = TASK_ADD_EDIT_CHANGE_DATE;
    constructor(public token: string, public payload: { taskDate: string }) {
        super(token);
    }
}
export class ChangeNoteInAddEditTask extends TokenizeAction implements Action {
    readonly type = TASK_ADD_EDIT_CHANGE_NOTE;
    constructor(public token: string, public payload: { taskNote: string }) {
        super(token);
    }
}

export class CheckIsTREnableSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_IS_TIME_RECORDING_ENABLE_SUCCESS;
    constructor(public token: string, public payload: { isEnable: boolean }) {
        super(token);
    }
}
export class CheckIsTREnableFail extends TokenizeAction implements Action {
    readonly type = CHECK_IS_TIME_RECORDING_ENABLE_FAIL;
    constructor(public token: string) {
        super(token);
    }
}
// Submit add edit task stuff
export class SubmitAddEditTask extends TokenizeAction implements Action {
    readonly type = SUBMIT_ADD_EDIT_TASK;
    constructor(public token: string) {
        super(token);
    }
}
export class SubmitAddEditTaskSuccess extends TokenizeAction implements Action {
    readonly type = SUBMIT_ADD_EDIT_TASK_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}
export class SubmitAddEditTaskFail extends TokenizeAction implements Action {
    readonly type = SUBMIT_ADD_EDIT_TASK_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
// FeeEarner stuff
export class LoadFeeEarnerList extends TokenizeAction implements Action {
    readonly type = LOAD_FE_LIST_ADD_EDIT_TASK;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFeeEarnerListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FE_LIST_ADD_EDIT_TASK_SUCCESS;
    constructor(public token: string, public payload: { feeEarnerList: FeeEarner[] }) {
        super(token);
    }
}
export class LoadFeeEarnerListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FE_LIST_ADD_EDIT_TASK_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeFeeEarnerList extends TokenizeAction implements Action {
    readonly type = CHANGE_FE_LIST_ADD_EDIT_TASK;
    constructor(public token: string, public payload: { selectedFeeEarner: FeeEarner }) { super(token); }
}
// Folder stuff
export class LoadFolderList extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_ADD_EDIT_TASK;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadFolderListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_ADD_EDIT_TASK_SUCCESS;
    constructor(public token: string, public payload: { folderList: Folder[] }) {
        super(token);
    }
}
export class LoadFolderListFail extends TokenizeAction implements Action {
    readonly type = LOAD_FOLDER_LIST_ADD_EDIT_TASK_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeFolderList extends TokenizeAction implements Action {
    readonly type = CHANG_FOLDER_ADD_EDIT_TASK;
    constructor(public token: string, public payload: { selectedFolder: Folder }) { super(token); }
}
// Default Folder stuff
export class LoadDefaultFolderId extends TokenizeAction implements Action {
    readonly type = LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadDefaultFolderIdSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_SUCCESS;
    constructor(public token: string, public payload: { folderId: number }) {
        super(token);
    }
}
export class LoadDefaultFolderIdFail extends TokenizeAction implements Action {
    readonly type = LOAD_DEFAULT_FOLDER_ADD_EDIT_TASK_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
// Action Type stuff
export class LoadActionTypeList extends TokenizeAction implements Action {
    readonly type = LOAD_ACTION_LIST_ADD_EDIT_TASK;
    constructor(public token: string) {
        super(token);
    }
}
export class LoadActionTypeListSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ACTION_LIST_ADD_EDIT_TASK_SUCCESS;
    constructor(public token: string, public payload: { actionTypeList: ActionType[] }) {
        super(token);
    }
}
export class LoadActionTypeListFail extends TokenizeAction implements Action {
    readonly type = LOAD_ACTION_LIST_ADD_EDIT_TASK_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class ChangeActionTypeList extends TokenizeAction implements Action {
    readonly type = CHANGE_ACTION_ADD_EDIT_TASK;
    constructor(public token: string, public payload: { selectedActionType: ActionType }) { super(token); }
}
export class ChangeMatterData extends TokenizeAction implements Action {
    readonly type = TASK_ADD_EDIT_SELECTED_MATTER_DATA;
    constructor(public token: string, public payload: { selectedMatterData: MatterResponce, timeOffset: number }) { super(token); }
}
export class TaskAddEditPopupClose extends TokenizeAction implements Action {
    readonly type = TASK_ADD_EDIT_CLOSE_POPUP;
    constructor(public token: string) { super(token); }
}

export class UpdateFileData extends TokenizeAction implements Action {
    readonly type = TASK_ADD_EDIT_UPDATE_FILE_DATA;
    constructor(public token: string, public payload: { fileData: any }) { super(token); }
}

export class UpdatePassword extends TokenizeAction implements Action {
    readonly type = TASK_ADD_EDIT_UPDATE_FILE_PASSWORD;
    constructor(public token: string, public payload: { filePassword: string }) { super(token); }
}

export class EnterUnLockPassword extends TokenizeAction implements Action {
    readonly type = ENTER_UNLOCK_PW;
    constructor(public token: string, public payload: { password: string }) { super(token); }
}

export class PasswordValidationSuccess extends TokenizeAction implements Action {
    readonly type = PASSWORD_VALIDATION_SUCCESS;
    constructor(public token: string, public playload: { isValid: boolean }) { super(token); }
}

export class PasswordValidationFail extends TokenizeAction implements Action {
    readonly type = PASSWORD_VALIDATION_FAIL;
    constructor(public token: string) { super(token); }
}

export type Any = InitAddEditTask | SubmitAddEditTask | SubmitAddEditTaskSuccess | SubmitAddEditTaskFail |
    LoadFeeEarnerList | LoadFeeEarnerListSuccess | LoadFeeEarnerListFail | ChangeFeeEarnerList |
    LoadFolderList | LoadFolderListSuccess | LoadFolderListFail | ChangeFolderList |
    LoadActionTypeList | LoadActionTypeListSuccess | LoadActionTypeListFail | ChangeActionTypeList |
    LoadDefaultFolderId | LoadDefaultFolderIdSuccess | LoadDefaultFolderIdFail | TaskAddEditPopupClose |
    ChangeMatterData | ChangeAddEditTaskDate | ChangeNoteInAddEditTask |
    UpdateFileData | UpdatePassword | ShowError | EnterUnLockPassword | PasswordValidationSuccess | PasswordValidationFail;

