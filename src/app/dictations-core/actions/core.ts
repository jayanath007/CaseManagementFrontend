import { GetGroupFail } from './../../mail-core/actions/groups';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
    DropdownListData, GridRowData, LoginUser, GroupInfo, StatusSummaryModel,
    TeamTalkAuthors, TeamTalkTemplateUrlViewModel, DocPathValidateResponceModel,
    TeamTalkCheckOutDocResponce, GridDataWithSummary, DownloadTokenResponce, TeamTalkUserSuccessInfo, ProfilingRequestModel
} from '../models/interface';
import { JobFolderType } from '../models/enum';
import { ItemUpload } from '../../azure-storage';




export const INIT_DICTATIONS = 'DPS_DICTATION_INIT_DICTATIONS';

export const GET_TEAM_TALKS_USER = 'DPS_DICTATION_GET_TEAM_TALKS_USER';
export const GET_TEAM_TALKS_USER_SUCCESS = 'DPS_DICTATION_GET_TEAM_TALKS_USER_SUCCESS';
export const GET_TEAM_TALKS_USER_FAIL = 'DPS_DICTATION_GET_TEAM_TALKS_USER_FAIL';

export const GET_TEAM_TALKS_AUTHORS = 'DPS_DICTATION_GET_TEAM_TALKS_AUTHORS';
export const GET_TEAM_TALKS_AUTHORS_SUCCESS = 'DPS_DICTATION_GET_TEAM_TALKS_AUTHORS_SUCCESS';
export const GET_TEAM_TALKS_AUTHORS_FAIL = 'DPS_DICTATION_GET_TEAM_TALKS_AUTHORS_FAIL';

export const GET_TEAM_TALKS_GROUPS = 'DPS_DICTATION_GET_TEAM_TALKS_GROUPS';
export const GET_TEAM_TALKS_GROUPS_SUCCESS = 'DPS_DICTATION_GET_TEAM_TALKS_GROUPS_SUCCESS';
export const GET_TEAM_TALKS_GROUPS_FAIL = 'DPS_DICTATION_GET_TEAM_TALKS_GROUPS_FAIL';

export const GET_TEAM_TALKS_GRID_DATA = 'DPS_DICTATION_GET_TEAM_TALKS_GRID_DATA';
export const GET_TEAM_TALKS_GRID_DATA_SUCCESS = 'DPS_DICTATION_GET_TEAM_TALKS_GRID_DATA_SUCCESS';
export const GET_TEAM_TALKS_GRID_DATA_FAIL = 'DPS_DICTATION_GET_TEAM_TALKS_GRID_DATA_FAIL';

export const CHANGE_JOB_STAGE = 'DPS_DICTATION_CHANGE_JOB_STAGE';
export const CHANGE_JOB_FOR = 'DPS_DICTATION_CHANGE_JOB_FOR';
export const TEAM_TALK_GRID_ROW_DOUBLE_CLICK = 'DPS_DICTATION_TEAM_TALK_GRID_ROW_DOUBLE_CLICK';
export const TEAM_TALK_OPEN_DOCUMENT_FILE = 'DPS_DICTATION_TEAM_TALK_OPEN_DOCUMENT_FILE';

export const GET_TEAM_TALK_JOB_STAGE = 'DPS_DICTATION_GET_TEAM_TALK_JOB_STAGE';
export const GET_TEAM_TALK_JOB_STAGE_SUCCESS = 'DPS_DICTATION_GET_TEAM_TALK_JOB_STAGE_SUCCESS';
export const GET_TEAM_TALK_JOB_STAGE_FAIL = 'DPS_DICTATION_GET_TEAM_TALK_JOB_STAGE_FAIL';

export const DICTATION_FINISH_JOB_FUNCTIONS = 'DPS_DICTATION_DICTATION_FINISH_JOB_FUNCTIONS';
export const DICTATION_FINISH_JOB_FUNCTIONS_SUCCESS = 'DPS_DICTATION_DICTATION_FINISH_JOB_FUNCTIONS_SUCCESS';
export const DICTATION_FINISH_JOB_FUNCTIONS_FAIL = 'DPS_DICTATION_DICTATION_FINISH_JOB_FUNCTIONS_FAIL';

export const ATTACHED_MATTER_FOR_JOB = 'DPS_DICTATION_ATTACHED_MATTER_FOR_JOB';

export const DICTATION_GRID_REFRESH = 'DPS_DICTATION_DICTATION_GRID_REFRESH';

// export const DICTATION_CHEKING = 'DPS_DICTATION_DICTATION_CHECKING_SAVE';
// export const DICTATION_CHECKING_SUCCESS = 'DPS_DICTATION_DICTATION_CHECKING_SUCCESS';
// export const DICTATION_CHECKING_FAIL = 'DPS_DICTATION_DICTATION_CHECKING_FAIL';

export const ROW_EXPAND = 'DPS_DICTATION_ROW_EXPAND';

export const DICTATION_JOB_STATUS_COUNTS = 'DPS_DICTATION_DICTATION_JOB_STATUS_COUNTS';
export const DICTATION_JOB_STATUS_COUNTS_SUCCESS = 'DPS_DICTATION_DICTATION_JOB_STATUS_COUNTS_SUCCESS';
export const DICTATION_JOB_STATUS_COUNTS_FAIL = 'DPS_DICTATION_DICTATION_JOB_STATUS_COUNTS_FAIL';

export const CHANGE_AUTHOR = 'DPS_DICTATION_CHANGE_AUTHOR';

export const CHECK_OUT_TEAM_TALK_TEMPLATE = 'DPS_DICTATION_CHECK_OUT_TEAM_TALK_TEMPLATE';
export const CHECK_OUT_TEAM_TALK_TEMPLATE_SUCCESS = 'DPS_DICTATION_CHECK_OUT_TEAM_TALK_TEMPLATE_SUCCESS';
export const CHECK_OUT_TEAM_TALK_TEMPLATE_FAIL = 'DPS_DICTATION_CHECK_OUT_TEAM_TALK_TEMPLATE_FAIL';

export const ADD_TEAM_TALK_DIARY_RECORD = 'DPS_DICTATION_ADD_TEAM_TALK_DIARY_RECORD';
export const ADD_TEAM_TALK_DIARY_RECORD_SUCCESS = 'DPS_DICTATION_ADD_TEAM_TALK_DIARY_RECORD_SUCCESS';
export const ADD_TEAM_TALK_DIARY_RECORD_FAIL = 'DPS_DICTATION_ADD_TEAM_TALK_DIARY_RECORD_FAIL';

export const VALIDATE_TEAM_TALK_DOC_PATH = 'DPS_DICTATION_VALIDATE_TEAM_TALK_DOC_PATH';
export const VALIDATE_TEAM_TALK_DOC_PATH_SUCCESS = 'DPS_DICTATION_VALIDATE_TEAM_TALK_DOC_PATH_SUCCESS';
export const VALIDATE_TEAM_TALK_DOC_PATH_FAIL = 'DPS_DICTATION_VALIDATE_TEAM_TALK_DOC_PATH_FAIL';

export const CHECK_IN_TEAM_TALK_TEMPLATE = 'DPS_DICTATION_CHECK_IN_TEAM_TALK_TEMPLATE';
export const CHECK_IN_TEAM_TALK_TEMPLATE_SUCCESS = 'DPS_DICTATION_CHECK_IN_TEAM_TALK_TEMPLATE_SUCCESS';
export const CHECK_IN_TEAM_TALK_TEMPLATE_FAIL = 'DPS_DICTATION_CHECK_IN_TEAM_TALK_TEMPLATE_FAIL';


export const DICTATION_COMPLETE = 'DPS_DICTATION_DICTATION_COMPLETE';
export const DICTATION_COMPLETE_SUCCESS = 'DPS_DICTATION_DICTATION_COMPLETE_SUCCESS';
export const DICTATION_COMPLETE_FAIL = 'DPS_DICTATION_DICTATION_COMPLETE_FAIL';

export const GET_DICTATION_PDF = 'DPS_DICTATION_GET_DICTATION_PDF';
export const GET_DICTATION_PDF_SUCCESS = 'DPS_DICTATION_GET_DICTATION_PDF_SUCCESS';
export const GET_DICTATION_PDF_FAIL = 'DPS_DICTATION_GET_DICTATION_PDF_FAIL';

export const GET_DICTATION_URL = 'DPS_DICTATION_GET_DICTATION_URL';
export const GET_DICTATION_URL_SUCCESS = 'DPS_DICTATION_GET_DICTATION_URL_SUCCESS';
export const GET_DICTATION_URL_FAIL = 'DPS_DICTATION_GET_DICTATION_URL_FAIL';

export const OPEN_DICTATION_PLAYER = 'DPS_DICTATION_OPEN_DICTATION_PLAYER';
export const CHANGE_PAGE = 'DPS_DICTATION_DICTATION_CHANGE_PAGE';

export const GET_MATTER_REF = 'DPS_DICTATION_GET_MATTER_REF';
export const GET_MATTER_REF_SUCCESS = 'DPS_DICTATION_GET_MATTER_REF_SUCCESS';
export const GET_MATTER_REF_FAIL = 'DPS_DICTATION_GET_MATTER_REF_FAIL';

export const UPLOAD_DICTATION_FILE = 'DPS_DICTATION_UPLOAD_DICTATION_FILE';
export const GET_JOB_ID_FOR_UPLOAD_FILE_SUCCESS = 'DPS_DICTATION_GET_JOB_ID_FOR_UPLOAD_FILE_SUCCESS';
export const GET_JOB_ID_FOR_UPLOAD_FILE_FAIL = 'DPS_DICTATION_GET_JOB_ID_FOR_UPLOAD_FILE_FAIL';

export const UPLOAD_FILE = 'DPS_DICTATION_UPLOAD_FILE';
export const UPLOAD_FILE_SUCCESS = 'DPS_DICTATION_UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_FAIL = 'DPS_DICTATION_UPLOAD_FILE_FAIL';

export const INIT_DICTATION_PROFILING = 'DPS_INIT_DICTATION_PROFILING';

export const GET_SECRETARY = 'DPS_GET_SECRETARY';
export const GET_SECRETARY_SUCCESS = 'DPS_GET_SECRETARY_SUCCESS';
export const GET_SECRETARY_FAIL = 'DPS_GET_SECRETARY_FAIL';

export const SUBMIT_PROFILING = 'DPS_SUBMIT_PROFILING';
export const SUBMIT_PROFILING_SUCCESS = 'DPS_SUBMIT_PROFILING_SUCCESS';
export const SUBMIT_PROFILING_FAIL = 'DPS_SUBMIT_PROFILING_FAIL';

export const GET_GROUPS = 'DPS_GET_GROUPS';
export const GET_GROUPS_SUCCESS = 'DPS_GET_GROUPS_SUCCESS';
export const GET_GROUPS_FAIL = 'DPS_GET_GROUPS_FAIL';

export const GET_JOB_DESCRIPTION = 'DPS_GET_JOB_DESCRIPTION';
export const GET_JOB_DESCRIPTION_SUCCESS = 'DPS_GET_JOB_DESCRIPTION_SUCCESS';
export const GET_JOB_DESCRIPTION_FAIL = 'DPS_GET_JOB_DESCRIPTION_FAIL';

export const GET_DICTATION_OPEN_CASE_DATA = 'DPS_GET_DICTATION_OPEN_CASE_DATA';
export const GET_DICTATION_OPEN_CASE_DATA_SUCCESS = 'DPS_GET_DICTATION_OPEN_CASE_DATA_SUCCESS';
export const GET_DICTATION_OPEN_CASE_DATA_FAIL = 'DPS_GET_DICTATION_OPEN_CASE_DATA_FAIL';

export class InitDictations extends TokenizeAction implements Action {
    readonly type = INIT_DICTATIONS;
    constructor(public token: string, public payload: {
        columnDefAuthor: ColumnDef[],
        columnDefSecretary: ColumnDef[]
        paginatorDef: PaginatorDef
        filterOperate: any
        userType: any
    }) { super(token); }
}

export class GetTeamTalkUser extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_USER;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class GetTeamTalkUserSuccess extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_USER_SUCCESS;
    constructor(public token: string, public payload: LoginUser) {
        super(token);
    }
}
export class GetTeamTalkUserFail extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_USER_FAIL;
    constructor(public token: string, public payload: { teamTalkUserSuccessInfo: TeamTalkUserSuccessInfo }) {
        super(token);
    }
}


export class GetTeamTalkGroup extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_GROUPS;
    constructor(public token: string, public payload: LoginUser) {
        super(token);
    }
}
export class GetTeamTalkGroupSuccess extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_GROUPS_SUCCESS;
    constructor(public token: string, public payload: GroupInfo[]) {
        super(token);
    }
}
export class GetTeamTalkGroupFail extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_GROUPS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}



export class GetTeamTalkAuthors extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_AUTHORS;
    constructor(public token: string, public payload: LoginUser) {
        super(token);
    }
}
export class GetTeamTalkAuthorsSuccess extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_AUTHORS_SUCCESS;
    constructor(public token: string, public payload: TeamTalkAuthors[]) {
        super(token);
    }
}
export class GetTeamTalkAuthorsFail extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_AUTHORS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class GetTeamTalkJobStage extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALK_JOB_STAGE;
    constructor(public token: string) {
        super(token);
    }
}
export class GetTeamTalkJobStageSuccess extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALK_JOB_STAGE_SUCCESS;
    constructor(public token: string, public payload: DropdownListData[]) {
        super(token);
    }
}
export class GetTeamTalkJobStageFail extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALK_JOB_STAGE_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class GetTeamTalkGridData extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_GRID_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class GetTeamTalkGridDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { data: GridDataWithSummary }) {
        super(token);
    }
}
export class GetTeamTalkGridDataFail extends TokenizeAction implements Action {
    readonly type = GET_TEAM_TALKS_GRID_DATA_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class ChangeJobStage extends TokenizeAction implements Action {
    readonly type = CHANGE_JOB_STAGE;
    constructor(public token: string, public payload: string) {
        super(token);
    }
}


export class ChangeJobFor extends TokenizeAction implements Action {
    readonly type = CHANGE_JOB_FOR;
    constructor(public token: string, public payload: string) {
        super(token);
    }
}

export class TeamTalkGridRowDoubleClick extends TokenizeAction implements Action {
    readonly type = TEAM_TALK_GRID_ROW_DOUBLE_CLICK;
    constructor(public token: string, public payload: string) {
        super(token);
    }
}

export class TeamTalkOpenDocumentFile extends TokenizeAction implements Action {
    readonly type = TEAM_TALK_OPEN_DOCUMENT_FILE;
    constructor(public token: string, public payload: string) {
        super(token);
    }
}


export class AttachedMatterForJob extends TokenizeAction implements Action {
    readonly type = ATTACHED_MATTER_FOR_JOB;
    constructor(public token: string, public payload: { attachementData: any, gridRowData: GridRowData }) {
        super(token);
    }
}

export class DictationFinishJobFunctions extends TokenizeAction implements Action {
    readonly type = DICTATION_FINISH_JOB_FUNCTIONS;
    constructor(public token: string, public payload: { itemRow: GridRowData, statusValue: JobFolderType }) {
        super(token);
    }
}
export class DictationFinishJobFunctionsSuccess extends TokenizeAction implements Action {
    readonly type = DICTATION_FINISH_JOB_FUNCTIONS_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class DictationFinishJobFunctionsFail extends TokenizeAction implements Action {
    readonly type = DICTATION_FINISH_JOB_FUNCTIONS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class DictationJobStatusCounts extends TokenizeAction implements Action {
    readonly type = DICTATION_JOB_STATUS_COUNTS;
    constructor(public token: string) {
        super(token);
    }
}
export class DictationJobStatusCountsSuccess extends TokenizeAction implements Action {
    readonly type = DICTATION_JOB_STATUS_COUNTS_SUCCESS;
    constructor(public token: string, public payload: { data: StatusSummaryModel }) {
        super(token);
    }
}
export class DictationJobStatusCountsFail extends TokenizeAction implements Action {
    readonly type = DICTATION_JOB_STATUS_COUNTS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}
export class DictationComplete extends TokenizeAction implements Action {
    readonly type = DICTATION_COMPLETE;
    constructor(public token: string, public payload: { itemRow: GridRowData, statusValue: JobFolderType }) {
        super(token);
    }
}
export class DictationCompleteSuccess extends TokenizeAction implements Action {
    readonly type = DICTATION_COMPLETE_SUCCESS;
    constructor(public token: string, public payload: { data: any, itemRow: GridRowData }) {
        super(token);
    }
}
export class DictationCompleteFail extends TokenizeAction implements Action {
    readonly type = DICTATION_COMPLETE_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class DictationGridRefresh extends TokenizeAction implements Action {
    readonly type = DICTATION_GRID_REFRESH;
    constructor(public token: string) {
        super(token);
    }
}

export class RowExpand extends TokenizeAction implements Action {
    readonly type = ROW_EXPAND;
    constructor(public token: string, public payload: GridRowData) {
        super(token);
    }
}

export class ChangeAuthor extends TokenizeAction implements Action {
    readonly type = CHANGE_AUTHOR;
    constructor(public token: string, public payload: TeamTalkAuthors) {
        super(token);
    }
}


export class CheckOutTeamTalkTemplate extends TokenizeAction implements Action {
    readonly type = CHECK_OUT_TEAM_TALK_TEMPLATE;
    constructor(public token: string, public payload: TeamTalkTemplateUrlViewModel) {
        super(token);
    }
}
export class CheckOutTeamTalkTemplateSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_OUT_TEAM_TALK_TEMPLATE_SUCCESS;
    constructor(public token: string, public payload: { data: TeamTalkCheckOutDocResponce, request: TeamTalkTemplateUrlViewModel }) {
        super(token);
    }
}
export class CheckOutTeamTalkTemplateFail extends TokenizeAction implements Action {
    readonly type = CHECK_OUT_TEAM_TALK_TEMPLATE_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class CheckInTeamTalkTemplate extends TokenizeAction implements Action {
    readonly type = CHECK_IN_TEAM_TALK_TEMPLATE;
    constructor(public token: string) {
        super(token);
    }
}
export class CheckInTeamTalkTemplateSuccess extends TokenizeAction implements Action {
    readonly type = CHECK_IN_TEAM_TALK_TEMPLATE_SUCCESS;
    constructor(public token: string, public payload: TeamTalkCheckOutDocResponce) {
        super(token);
    }
}
export class CheckInTeamTalkTemplateFail extends TokenizeAction implements Action {
    readonly type = CHECK_IN_TEAM_TALK_TEMPLATE_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class AddTeamTalkDiaryRecord extends TokenizeAction implements Action {
    readonly type = ADD_TEAM_TALK_DIARY_RECORD;
    constructor(public token: string, public payload: GridRowData) {
        super(token);
    }
}
export class AddTeamTalkDiaryRecordSuccess extends TokenizeAction implements Action {
    readonly type = ADD_TEAM_TALK_DIARY_RECORD_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class AddTeamTalkDiaryRecordFail extends TokenizeAction implements Action {
    readonly type = ADD_TEAM_TALK_DIARY_RECORD_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}




export class ValidateTeamTalkDocPath extends TokenizeAction implements Action {
    readonly type = VALIDATE_TEAM_TALK_DOC_PATH;
    constructor(public token: string, public payload: GridRowData) {
        super(token);
    }
}
export class ValidateTeamTalkDocPathSuccess extends TokenizeAction implements Action {
    readonly type = VALIDATE_TEAM_TALK_DOC_PATH_SUCCESS;
    constructor(public token: string, public payload: { data: DocPathValidateResponceModel }) {
        super(token);
    }
}
export class ValidateTeamTalkDocPathFail extends TokenizeAction implements Action {
    readonly type = VALIDATE_TEAM_TALK_DOC_PATH_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class OpenDictationPlayer extends TokenizeAction implements Action {
    readonly type = OPEN_DICTATION_PLAYER;
    constructor(public token: string, public payload: GridRowData) {
        super(token);
    }
}


export class OpenDictationPDF extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_PDF;
    constructor(public token: string, public payload: GridRowData) {
        super(token);
    }
}
export class GetDictationPdfSuccess extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_PDF_SUCCESS;
    constructor(public token: string, public payload: { data: any }) {
        super(token);
    }
}
export class GetDictationPdfFail extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_PDF_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class GetDictationUrl extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_URL;
    constructor(public token: string, public payload: { jobId: number }) {
        super(token);
    }
}
export class GetDictationUrlSuccess extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_URL_SUCCESS;
    constructor(public token: string, public payload: { data: DownloadTokenResponce }) {
        super(token);
    }
}
export class GetDictationUrlFail extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_URL_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class ChangePage extends TokenizeAction {
    readonly type = CHANGE_PAGE;
    constructor(public token: string, public pageDef: PaginatorDef) {
        super(token);
    }
}

export class GetMatterRef extends TokenizeAction implements Action {
    readonly type = GET_MATTER_REF;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class GetMatterRefSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTER_REF_SUCCESS;
    constructor(public token: string, public payload: { data: any, gridRowData: GridRowData }) {
        super(token);
    }
}
export class GetMatterRefFail extends TokenizeAction implements Action {
    readonly type = GET_MATTER_REF_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class UploadDictationFile extends TokenizeAction implements Action {
    readonly type = UPLOAD_DICTATION_FILE;
    constructor(public token: string, public payload: File) {
        super(token);
    }
}

export class GetJobIdForUploadFileSuccess extends TokenizeAction implements Action {
    readonly type = GET_JOB_ID_FOR_UPLOAD_FILE_SUCCESS;
    constructor(public token: string, public payload: { data: any, uploadFile: File }) {
        super(token);
    }
}

export class GetJobIdForUploadFileFail extends TokenizeAction implements Action {
    readonly type = GET_JOB_ID_FOR_UPLOAD_FILE_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class UploadFile extends TokenizeAction implements Action {
    readonly type = UPLOAD_FILE;
    constructor(public token: string, public payload: { jobId: number, file: File }) {
        super(token);
    }
}
export class UploadFileSuccess extends TokenizeAction implements Action {
    readonly type = UPLOAD_FILE_SUCCESS;
    constructor(public token: string, public payload: ItemUpload, public jobId: number) {
        super(token);
    }
}
export class UploadFileFail extends TokenizeAction implements Action {
    readonly type = UPLOAD_FILE_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}


export class InitDictationProfiling extends TokenizeAction implements Action {
    readonly type = INIT_DICTATION_PROFILING;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}

export class GetSecretary extends TokenizeAction implements Action {
    readonly type = GET_SECRETARY;
    constructor(public token: string, public category: any) {
        super(token);
    }
}
export class GetSecretarySuccess extends TokenizeAction implements Action {
    readonly type = GET_SECRETARY_SUCCESS;
    constructor(public token: string, public responce: any) {
        super(token);
    }
}
export class GetSecretaryFail extends TokenizeAction implements Action {
    readonly type = GET_SECRETARY_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class SubmitProfiling extends TokenizeAction implements Action {
    readonly type = SUBMIT_PROFILING;
    constructor(public token: string, public payload: ProfilingRequestModel) {
        super(token);
    }
}
export class SubmitProfilingSuccess extends TokenizeAction implements Action {
    readonly type = SUBMIT_PROFILING_SUCCESS;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}
export class SubmitProfilingFail extends TokenizeAction implements Action {
    readonly type = SUBMIT_PROFILING_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class GetGroups extends TokenizeAction implements Action {
    readonly type = GET_GROUPS;
    constructor(public token: string, public category: any) {
        super(token);
    }
}
export class GetGroupsSuccess extends TokenizeAction implements Action {
    readonly type = GET_GROUPS_SUCCESS;
    constructor(public token: string, public responce: any) {
        super(token);
    }
}
export class GetGroupsFail extends TokenizeAction implements Action {
    readonly type = GET_GROUPS_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}
export class GetJobDescription extends TokenizeAction implements Action {
    readonly type = GET_JOB_DESCRIPTION;
    constructor(public token: string, public category: any) {
        super(token);
    }
}
export class GetJobDescriptionSuccess extends TokenizeAction implements Action {
    readonly type = GET_JOB_DESCRIPTION_SUCCESS;
    constructor(public token: string, public responce: any) {
        super(token);
    }
}
export class GetJobDescriptionFail extends TokenizeAction implements Action {
    readonly type = GET_JOB_DESCRIPTION_FAIL;
    constructor(public token: string, public error: any) {
        super(token);
    }
}

export class GetDictationOpenCaseData extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_OPEN_CASE_DATA;
    constructor(public token: string, public payload: { matterRef: string }) {
        super(token);
    }
}
export class GetDictationOpenCaseDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_OPEN_CASE_DATA_SUCCESS;
    constructor(public token: string, public payload: { inputData: any }) {
        super(token);
    }
}
export class GetDictationOpenCaseDataFail extends TokenizeAction implements Action {
    readonly type = GET_DICTATION_OPEN_CASE_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) {
        super(token);
    }
}





export type Any = InitDictations | GetTeamTalkUser | GetTeamTalkUserSuccess | GetTeamTalkUserFail |
    GetTeamTalkGroup | GetTeamTalkGroupSuccess | GetTeamTalkGroupFail |
    GetTeamTalkGridData | GetTeamTalkGridDataSuccess | GetTeamTalkGridDataFail | ChangeJobStage | ChangeJobFor | ChangeAuthor |
    TeamTalkGridRowDoubleClick | GetTeamTalkJobStage |
    AttachedMatterForJob | DictationFinishJobFunctions | DictationFinishJobFunctionsSuccess | DictationFinishJobFunctionsFail |
    DictationGridRefresh | RowExpand | DictationJobStatusCounts | DictationJobStatusCountsSuccess | DictationJobStatusCountsFail |
    GetTeamTalkAuthors | GetTeamTalkAuthorsSuccess | GetTeamTalkAuthorsFail |
    AddTeamTalkDiaryRecord | AddTeamTalkDiaryRecordSuccess | AddTeamTalkDiaryRecordFail |
    CheckOutTeamTalkTemplate | CheckOutTeamTalkTemplateSuccess | CheckOutTeamTalkTemplateFail |
    ValidateTeamTalkDocPath | ValidateTeamTalkDocPathSuccess | ValidateTeamTalkDocPathFail |
    CheckInTeamTalkTemplate | CheckInTeamTalkTemplateSuccess | CheckInTeamTalkTemplateFail |
    DictationComplete | DictationCompleteSuccess | DictationCompleteFail | OpenDictationPlayer |
    OpenDictationPDF | GetDictationPdfSuccess | GetDictationPdfFail | GetDictationUrl | GetDictationUrlSuccess |
    GetDictationUrlFail | ChangePage | GetMatterRef | GetMatterRefSuccess | GetMatterRefFail | UploadDictationFile |
    GetJobIdForUploadFileSuccess | GetJobIdForUploadFileFail | UploadFile | UploadFileSuccess |
    UploadFileFail | InitDictationProfiling | GetSecretary | GetSecretarySuccess | GetSecretaryFail | SubmitProfiling |
    SubmitProfilingSuccess | SubmitProfilingFail | GetGroups | GetGroupsSuccess | GetGroupsFail |
    GetJobDescription | GetJobDescriptionSuccess |
    GetJobDescriptionFail | GetDictationOpenCaseData | GetDictationOpenCaseDataSuccess | GetDictationOpenCaseDataFail;

