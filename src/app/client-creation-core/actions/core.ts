import { ClientGridRowRapper } from '../../client-search-core/models/interfaces';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
import { Mode, UploadDocumentType } from '../models/enums';
import {
    InitClientCreationData, ClientModel, ClientEventModel,
    MatterGridResponce, ClientRiskAssessmentQuestion, RiskAssessmentData, CaseFileIdentity,
} from '../models/interfaces';

import { PaginatorDef } from '../../core/lib/grid-model';



export const INIT_CLIENT_CREATION = 'INIT_CLIENT_CREATION';
export const CLEAR_CLIENT_DATA = 'DPS_CLEAR_CLIENT_CREATION_CLIENT_DATA';

export const GET_FULL_CLIENT_DATA = 'DPS_GET_CLIENT_CREATION_FULL_CLIENT_DATA';
export const GET_FULL_CLIENT_DATA_SUCCESS = 'DPS_GET_CLIENT_CREATION_FULL_CLIENT_DATA_SUCCESS';
export const GET_FULL_CLIENT_DATA_FAIL = 'DPS_GET_CLIENT_CREATION_FULL_CLIENT_DATA_FAIL';

export const GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS = 'DPS_GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS';
export const GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS_SUCCESS = 'DPS_GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS_SUCCESS';
export const GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS_FAIL = 'DPS_GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS_FAIL';

export const GET_CLIENT_CREATION_INT_DATA = 'DPS_GET_CLIENT_CREATION_INT_DATA';
export const GET_CLIENT_CREATION_INT_DATA_SUCESS = 'DPS_GET_CLIENT_CREATION_INT_DATA_SUCESS';
export const GET_CLIENT_CREATION_INT_DATA_FAIL = 'DPS_GET_CLIENT_CREATION_INT_DATA_FAIL';

export const UPDATE_CLIENT = 'DPS_UPDATE_CLIENT';
export const ADD_CLIENT = 'DPS_CLIENT_CREATION_ADD_CLIENT';
export const CLOSE_CLIENT_CREATION = 'DPS_CLOSE_CLIENT_CREATION';

export const ADD_UPDATE_CLIENT = 'DPS_ADD_UPDATE_CLIENT';
export const ADD_UPDATE_CLIENT_SUCCESS = 'DPS_ADD_UPDATE_CLIENT_SUCCESS';
export const ADD_UPDATE_CLIENT_FAIL = 'DPS_ADD_UPDATE_CLIENT_FAIL';

export const DELETE_CLIENT = 'DPS_DELETE_CLIENT';
export const DELETE_CLIENT_SUCCESS = 'DPS_DELETE_CLIENT_SUCCESS';
export const DELETE_CLIENT_FAIL = 'DPS_DELETE_CLIENT_FAIL';

export const PRE_FILL_LATTER_AND_CONTRACT_NAME = 'DPS_PRE_FILL_LATTER_AND_CONTRACT_NAME';
export const COPY_FORM_CORRESPONDENCE = 'DPS_COPY_FORM_CORRESPONDENCE';
export const FIRST_NAME_AS_DIRECTOR = 'DPS_FIRST_NAME_AS_DIRECTOR';
export const PRIVATE_INDIVIDUAL = 'DPS_PRIVATE_INDIVIDUAL';
export const GET_SCREEN_LOOKUP_DATA = 'GET_SCREEN_LOOKUP_DATA';

// Note
export const ADD_NEW_NOTE = 'ADD_NEW_CLIENT_NOTE';
export const CHANGE_NOTE = 'ADD_NEW_CLIENT_CHANGE_NOTE';
export const DELETE_NOTE = 'ADD_NEW_CLIENT_DELETE_NOTE';
export const CANCEL_NOTE_CHANGES = 'ADD_NEW_CLIENT_CANCEL_NOTE_CHANGES';
// Document
export const FILE_UPLOAD = 'ADD_CLIENT_FILE_UPLOAD';
export const FILE_UPLOAD_SUCCESS = 'ADD_CLIENT_FILE_UPLOAD__SUCCESS';
export const FILE_UPLOAD_FAIL = 'ADD_CLIENT_FILE_UPLOAD_FAIL';
export const GET_SCREEN_LOOKUP_DATA_SUCESS = 'GET_SCREEN_LOOKUP_DATA_SUCESS';
export const GET_SCREEN_LOOKUP_DATA_FAIL = 'GET_SCREEN_LOOKUP_DATA_FAIL';
export const AML_CHECK_FOR_CLIENT = 'DPS_AML_CHECK_FOR_CLIENT';
export const AML_CHECK_FOR_CLIENT_SUCCESS = 'DPS_AML_CHECK_FOR_CLIENT_SUCCESS';
export const AML_CHECK_FOR_CLIENT_FAIL = 'DPS_AML_CHECK_FOR_CLIENT_FAIL';
// client type
export const CLIENT_TYPE_CMB_CHANGES = 'CLIENT_TYPE_CMB_CHANGES';
export const UPDATE_SELECTED_MATER = 'UPDATE_SELECTED_MATER';
export const DELETE_DOCUMENT_NOTE = 'DELETE_DOCUMENT_NOTE';
export const DELETE_DOCUMENT_NOTE_SUCCESS = 'DELETE_DOCUMENT_NOTE_SUCCESS';
export const DELETE_DOCUMENT_NOTE_FAIL = 'DELETE_DOCUMENT_NOTE_FAIL';
export const GET_HAS_CRIME_MATTERS = 'GET_HAS_CRIME_MATTERS';
export const GET_HAS_CRIME_MATTERS_SUCCESS = 'GET_HAS_CRIME_MATTERS_SUCCESS';
export const GET_HAS_CRIME_MATTERS_FAIL = 'GET_HAS_CRIME_MATTERS_FAIL';
export const CLIENTL_LOAD_DOCUMENT_URL_LOAD = 'CLIENTL_LOAD_DOCUMENT_URL_LOAD';
export const CLIENTL_LOAD_DOCUMENT_URL_LOAD_SUCCESS = 'CLIENTL_LOAD_DOCUMENT_URL_LOAD_SUCCESS';
export const CLIENTL_LOAD_DOCUMENT_URL_LOAD_FAIL = 'CLIENTL_LOAD_DOCUMENT_URL_LOAD_FAIL';

export const CLIENT_EVENT_GRID_REFRESH = 'DPS_CLIENT_EVENT_GRID_REFRESH';
export const CLIENT_EVENT_GRID_REFRESH_SUCCESS = 'DPS_CLIENT_EVENT_GRID_REFRESH_SUCCESS';
export const CLIENT_EVENT_GRID_REFRESH_FAIL = 'DPS_CLIENT_EVENT_GRID_REFRESH_FAIL';

export const CLIENT_MATTERS_GRID_REFRESH = 'CLIENT_MATTERS_GRID_REFRESH';
export const CLIENT_MATTERS_GRID_REFRESH_SUCCESS = 'CLIENT_MATTERS_GRID_REFRESH_SUCCESS';
export const CLIENT_MATTERS_GRID_REFRESH_FAIL = 'CLIENT_MATTERS_GRID_REFRESH_FAIL';
export const COPPY_AND_OPEN_MATTER = 'COPPY_AND_OPEN_MATTER';
export const COPPY_AND_OPEN_MATTER_SUCCESS = 'COPPY_AND_OPEN_MATTER_SUCCESS';
export const COPPY_AND_OPEN_MATTER_FAIL = 'COPPY_AND_OPEN_MATTER_FAIL';

export const CLIENT_VALIDATION_POPUP = 'DPS_CLIENT_VALIDATION_POPUP';

export const SWITCH_AML_AND_CLIENT_SAVE = 'DPS_SWITCH_AML_AND_CLIENT_SAVE';

export const SET_USER_BRANCH_TO_NEW_CLIENT = 'DPS_CLIENT_SET_USER_BRANCH_TO_NEW_CLIENT';
export const CHECK_AND_UPDATE = 'DPS_CHECK_AND_UPDATE';

export const CLIENT_CREATION_POPUP_CLOSE = 'CLIENT_CREATION_POPUP_CLOSE';

export const AML_CHECK = 'DPS_AML_CHECK';

export const CHANGE_RISK_ASSESSMENT_QUATION = 'CLIENT_CREATION_CHANGE_RISK_ASSESSMENT_QUATION';

export const ADD_UPDATE_RISK_ASSESSMENT_DATA = 'ADD_UPDATE_RISK_ASSESSMENT_DATA';
export const ADD_UPDATE_RISK_ASSESSMENT_DATA_SUCCESS = 'ADD_UPDATE_RISK_ASSESSMENT_DATA_SUCCESS';
export const ADD_UPDATE_RISK_ASSESSMENT_DATA_FAIL = 'ADD_UPDATE_RISK_ASSESSMENT_DATA_FAIL';
export const GET_MATTERS = 'DPS_CLIENT_CREATION_GET_MATTERS';
export const GET_MATTERS_SUCCESS = 'DPS_CLIENT_CREATION_GET_MATTERS_SUCCESS';
export const GET_MATTERS_FAIL = 'DPS_CLIENT_CREATION_GET_MATTERS_FAIL';
export const CHANGE_MATTERS_PAGE = 'DPS_CLIENT_CREATION_CHANGE_MATTERS_PAGE';

export const GET_DEFUILT_RISK_ASSESMENT_DATA = 'GET_DEFUILT_RISK_ASSESMENT_DATA';
export const GET_DEFUILT_RISK_ASSESMENT_DATA_SUCCESS = 'GET_DEFUILT_RISK_ASSESMENT_DATA_SUCCESS';
export const GET_DEFUILT_RISK_ASSESMENT_DATA_FAIL = 'GET_DEFUILT_RISK_ASSESMENT_DATA_FAIL';


export class InitClientCreation extends TokenizeAction implements Action {
    readonly type = INIT_CLIENT_CREATION;
    constructor(public token: string, public payload: { mode: Mode, userBranchId: number, caseFileIdentity: CaseFileIdentity }) {
        super(token);
    }
}


export class ClientCreationPopupClose extends TokenizeAction implements Action {
    readonly type = CLIENT_CREATION_POPUP_CLOSE;
    constructor(public token: string) {
        super(token);
    }
}

export class EventGridRefresh extends TokenizeAction implements Action {
    readonly type = CLIENT_EVENT_GRID_REFRESH;
    constructor(public token: string, public payload: { clientId: number }) {
        super(token);
    }
}
export class EventGridRefreshSuccess extends TokenizeAction implements Action {
    readonly type = CLIENT_EVENT_GRID_REFRESH_SUCCESS;
    constructor(public token: string, public payload: ClientModel) {
        super(token);
    }
}
export class EventGridRefreshFail extends TokenizeAction implements Action {
    readonly type = CLIENT_EVENT_GRID_REFRESH_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class ClientMattersGridRefresh extends TokenizeAction implements Action {
    readonly type = CLIENT_MATTERS_GRID_REFRESH;
    constructor(public token: string, public payload: { clientId: number }) {
        super(token);
    }
}
export class ClientMattersGridRefreshSuccess extends TokenizeAction implements Action {
    readonly type = CLIENT_MATTERS_GRID_REFRESH_SUCCESS;
    constructor(public token: string, public payload: ClientModel) {
        super(token);
    }
}
export class ClientMattersGridRefreshFail extends TokenizeAction implements Action {
    readonly type = CLIENT_MATTERS_GRID_REFRESH_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}




export class UpdateClient extends TokenizeAction implements Action {
    readonly type = UPDATE_CLIENT;
    constructor(public token: string, public payload: { value: any, property: string }) {
        super(token);
    }
}
export class AddClient extends TokenizeAction implements Action {
    readonly type = ADD_CLIENT;
    constructor(public token: string, public payload: { timeOffset: number }) {
        super(token);
    }
}
export class CloseClientCreation extends TokenizeAction implements Action {
    readonly type = CLOSE_CLIENT_CREATION;
    constructor(public token: string) {
        super(token);
    }
}
export class AddUpdateClient extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_CLIENT;
    constructor(public token: string, public payload: { clientModel: ClientModel, withClose?: boolean }) {
        super(token);
    }
}
export class AddUpdateClientSuccess extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_CLIENT_SUCCESS;
    constructor(public token: string, public payload: ClientModel, public withClose?: boolean,
        public isAMLNeedToCheck?: boolean) {
        super(token);
    }
}
export class AddUpdateClientFail extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_CLIENT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class AMLCheckForClient extends TokenizeAction implements Action {
    readonly type = AML_CHECK_FOR_CLIENT;
    constructor(public token: string, public payload: {
        clientModel: ClientModel,
        isAMLShow: boolean,
        gridPara: Array<string>,
        withClose: boolean,
        addUpdateClientResult: any,
        isAMLNeedToCheck?: boolean
    }) {
        super(token);
    }
}
export class AMLCheckForClientSuccess extends TokenizeAction implements Action {
    readonly type = AML_CHECK_FOR_CLIENT_SUCCESS;
    constructor(public token: string, public payload: { result: any }) {
        super(token);
    }
}
export class AMLCheckForClientFail extends TokenizeAction implements Action {
    readonly type = AML_CHECK_FOR_CLIENT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class ClearClientData extends TokenizeAction implements Action {
    readonly type = CLEAR_CLIENT_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class GetFullClientData extends TokenizeAction implements Action {
    readonly type = GET_FULL_CLIENT_DATA;
    constructor(public token: string, public payload: {
        matter?: {
            fileId: number,
            appId: number,
            branchId: number,
        },
        clientId?: number,
        clientSeatchList?: ClientGridRowRapper[],
        clientIndex?: number
    }) {
        super(token);
    }
}
export class GetFullClientDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_FULL_CLIENT_DATA_SUCCESS;
    constructor(public token: string, public payload: {
        clientModel: ClientModel,
        clientSeatchList: ClientGridRowRapper[],
        clientIndex: number,
        hasCrimematters: boolean
    }) {
        super(token);
    }
}
export class GetFullClientDataFail extends TokenizeAction implements Action {
    readonly type = GET_FULL_CLIENT_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class GetFullClientDataGridParams extends TokenizeAction implements Action {
    readonly type = GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS;
    constructor(public token: string, public payload: {
        clientId: number,
        gridPara?: Array<string>,
        withClose?: boolean,
        addUpdateClientResult?: any
    }) {
        super(token);
    }
}
export class GetFullClientDataGridParamsSuccess extends TokenizeAction implements Action {
    readonly type = GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS_SUCCESS;
    constructor(public token: string, public payload: {
        clientModel: ClientModel,
        withClose?: boolean,
    }) {
        super(token);
    }
}
export class GetFullClientDataGridParamsFail extends TokenizeAction implements Action {
    readonly type = GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}
export class ClientLoadDocument extends TokenizeAction implements Action {
    readonly type = CLIENTL_LOAD_DOCUMENT_URL_LOAD;
    constructor(public token: string, public payload: { row: ClientEventModel }) {
        super(token);
    }
}
export class ClientLoadDocumentURLSuccess extends TokenizeAction implements Action {
    readonly type = CLIENTL_LOAD_DOCUMENT_URL_LOAD_SUCCESS;
    constructor(public token: string, public payload: { url: string, }) {
        super(token);
    }
}
export class ClientLoadDocumentURLFail extends TokenizeAction implements Action {
    readonly type = CLIENTL_LOAD_DOCUMENT_URL_LOAD_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}






export class DeleteClient extends TokenizeAction implements Action {
    readonly type = DELETE_CLIENT;
    constructor(public token: string, public payload: { clientId: number }) {
        super(token);
    }
}
export class DeleteClientSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_CLIENT_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}
export class DeleteClientFail extends TokenizeAction implements Action {
    readonly type = DELETE_CLIENT_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class GetHasCrimeMatters extends TokenizeAction implements Action {
    readonly type = GET_HAS_CRIME_MATTERS;
    constructor(public token: string, public payload: { clientId: number }) {
        super(token);
    }
}
export class GetHasCrimeMattersSuccess extends TokenizeAction implements Action {
    readonly type = GET_HAS_CRIME_MATTERS_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}
export class GetHasCrimeMattersFail extends TokenizeAction implements Action {
    readonly type = GET_HAS_CRIME_MATTERS_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}







export class GetInitClientCreationData extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_CREATION_INT_DATA;
    constructor(public token: string, public request: any) { super(token); }
}

export class GetInitClientCreationDataSuccess extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_CREATION_INT_DATA_SUCESS;
    constructor(public token: string, public payload: { response: InitClientCreationData, }) {
        super(token);
    }
}
export class GetInitClientCreationDataFail extends TokenizeAction implements Action {
    readonly type = GET_CLIENT_CREATION_INT_DATA_FAIL;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}

export class PrefillLetterAndContactName extends TokenizeAction implements Action {
    readonly type = PRE_FILL_LATTER_AND_CONTRACT_NAME;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}
// type
export class ClientTypeComboChanged extends TokenizeAction implements Action {
    readonly type = CLIENT_TYPE_CMB_CHANGES;
    constructor(public token: string, public payload: number) {
        super(token);
    }
}

export class CopyFromCorrespondence extends TokenizeAction implements Action {
    readonly type = COPY_FORM_CORRESPONDENCE;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}

export class PrivateIndividual extends TokenizeAction implements Action {
    readonly type = PRIVATE_INDIVIDUAL;
    constructor(public token: string, public payload: { value: any, property: string }) {
        super(token);
    }
}

export class FirstNameAsDirector extends TokenizeAction implements Action {
    readonly type = FIRST_NAME_AS_DIRECTOR;
    constructor(public token: string, public payload: {}) {
        super(token);
    }
}

export class GetScreenLookupData extends TokenizeAction implements Action {
    readonly type = GET_SCREEN_LOOKUP_DATA;
    constructor(public token: string, public payload: { lookupTypeTag: string }) {
        super(token);
    }
}

export class GetScreenLookupSuccess extends TokenizeAction implements Action {
    readonly type = GET_SCREEN_LOOKUP_DATA_SUCESS;
    constructor(public token: string, public payload: { lookupList: any, lookupTypeTag: string }) {
        super(token);
    }
}
export class GetScreenLookupFail extends TokenizeAction implements Action {
    readonly type = GET_SCREEN_LOOKUP_DATA_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

// Note
export class AddNewNote extends TokenizeAction implements Action {
    readonly type = ADD_NEW_NOTE;
    constructor(public token: string, public payload: { noteBy: string, timeOffset: number }) {
        super(token);
    }
}
export class ChangeNote extends TokenizeAction implements Action {
    readonly type = CHANGE_NOTE;
    constructor(public token: string, public payload: { kind: string, row: number; value: any }) {
        super(token);
    }
}
export class DeleteNote extends TokenizeAction implements Action {
    readonly type = DELETE_NOTE;
    constructor(public token: string, public payload: { row: number }) {
        super(token);
    }
}
export class CancelNoteChanges extends TokenizeAction implements Action {
    readonly type = CANCEL_NOTE_CHANGES;
    constructor(public token: string) {
        super(token);
    }
}

// Document
export class UploadDocument extends TokenizeAction implements Action {
    readonly type = FILE_UPLOAD;
    constructor(public token: string, public payload: {
        file: File,
        note: string,
        clientId: number,
        clientRef: string,
        uploadDocumentType: UploadDocumentType,
    }) {
        super(token);
    }
}
export class UploadDocumentSuccess extends TokenizeAction implements Action {
    readonly type = FILE_UPLOAD_SUCCESS;
    constructor(public token: string, public payload: { clientId: number, uploadDocumentType: UploadDocumentType }) {
        super(token);
    }
}
export class UploadDocumentFail extends TokenizeAction implements Action {
    readonly type = FILE_UPLOAD_FAIL;
    constructor(public token: string, public payload: { clientId: number, uploadDocumentType: UploadDocumentType }) {
        super(token);
    }
}

export class UpdateSelectedMater extends TokenizeAction implements Action {
    readonly type = UPDATE_SELECTED_MATER;
    constructor(public token: string, public payload: { selectedMatterId: number }) {
        super(token);
    }
}


export class DeleteDocumentNote extends TokenizeAction implements Action {
    readonly type = DELETE_DOCUMENT_NOTE;
    constructor(public token: string, public payload: { row: ClientEventModel }) {
        super(token);
    }
}

export class DeleteDocumentNoteSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_DOCUMENT_NOTE_SUCCESS;
    constructor(public token: string, public payload: { row: ClientEventModel }) {
        super(token);
    }
}

export class DeleteDocumentNoteFail extends TokenizeAction implements Action {
    readonly type = DELETE_DOCUMENT_NOTE_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}





export class CoppyAndOpenMatter extends TokenizeAction implements Action {
    readonly type = COPPY_AND_OPEN_MATTER;
    constructor(public token: string, public payload: { clientId: number, matterId: number }) {
        super(token);
    }
}

export class CoppyAndOpenMatterSuccess extends TokenizeAction implements Action {
    readonly type = COPPY_AND_OPEN_MATTER_SUCCESS;
    constructor(public token: string, public payload: { matterId: string }) {
        super(token);
    }
}

export class CoppyAndOpenMatterFail extends TokenizeAction implements Action {
    readonly type = COPPY_AND_OPEN_MATTER_FAIL;
    constructor(public token: string, public payload: any) {
        super(token);
    }
}

export class SetUserBarnchToNewClient extends TokenizeAction implements Action {
    readonly type = SET_USER_BRANCH_TO_NEW_CLIENT;
    constructor(public token: string) {
        super(token);
    }
}

export class ClientValidationPopup extends TokenizeAction implements Action {
    readonly type = CLIENT_VALIDATION_POPUP;
    constructor(public token: string, public payload: { clientModel: ClientModel, withClose?: boolean }) {
        super(token);
    }
}

export class SwitchAmlAndClientSave extends TokenizeAction implements Action {
    readonly type = SWITCH_AML_AND_CLIENT_SAVE;
    constructor(public token: string, public payload: { clientModel: ClientModel, withClose?: boolean, onlyAml?: boolean }) {
        super(token);
    }
}

export class CheckAndUpdate extends TokenizeAction implements Action {
    readonly type = CHECK_AND_UPDATE;
    constructor(public token: string) {
        super(token);
    }
}

export class AmlCheck extends TokenizeAction implements Action {
    readonly type = AML_CHECK;
    constructor(public token: string, public payload: ClientModel, public withClose?: boolean,
        public isAMLNeedToCheck?: boolean) {
        super(token);
    }
}
export class ChangeRiskAssessmentQuation extends TokenizeAction implements Action {
    readonly type = CHANGE_RISK_ASSESSMENT_QUATION;
    constructor(public token: string, public item: ClientRiskAssessmentQuestion) {
        super(token);
    }
}

export class AddUpdateRiskAssessment extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_RISK_ASSESSMENT_DATA;
    constructor(public token: string) {
        super(token);
    }
}
export class GetMatters extends TokenizeAction implements Action {
    readonly type = GET_MATTERS;
    constructor(public token) { super(token); }
}

export class GetMattersSuccess extends TokenizeAction implements Action {
    readonly type = GET_MATTERS_SUCCESS;
    constructor(public token, public mattersData: MatterGridResponce) { super(token); }
}
export class GetMattersFail extends TokenizeAction implements Action {
    readonly type = GET_MATTERS_FAIL;
    constructor(public token) { super(token); }
}

export class ChangeMatterPage extends TokenizeAction implements Action {
    readonly type = CHANGE_MATTERS_PAGE;
    constructor(public token, public matterPaginatorDef: PaginatorDef) { super(token); }
}


export class AddUpdateRiskAssessmentSuccess extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_RISK_ASSESSMENT_DATA_SUCCESS;
    constructor(public token: string, public riskAsseData: RiskAssessmentData, public model: ClientModel) {
        super(token);
    }
}
export class AddUpdateRiskAssessmentFail extends TokenizeAction implements Action {
    readonly type = ADD_UPDATE_RISK_ASSESSMENT_DATA_FAIL;
    constructor(public token: string) {
        super(token);
    }
}

export class GetDefuiltRiskAseesData implements Action {
    readonly type = GET_DEFUILT_RISK_ASSESMENT_DATA;
    constructor() { }
}


export class GetDefuiltRiskAseesDataSuccess implements Action {
    readonly type = GET_DEFUILT_RISK_ASSESMENT_DATA_SUCCESS;
    constructor(public riskAsseData: RiskAssessmentData) { }
}

export class GetDefuiltRiskAseesDataFail implements Action {
    readonly type = GET_DEFUILT_RISK_ASSESMENT_DATA_FAIL;
    constructor() { }
}

export type Any = InitClientCreation | UpdateSelectedMater |
    CoppyAndOpenMatter | CoppyAndOpenMatterSuccess | CoppyAndOpenMatterFail |
    GetHasCrimeMatters | GetHasCrimeMattersSuccess | GetHasCrimeMattersFail |
    DeleteDocumentNote | DeleteDocumentNoteSuccess | DeleteDocumentNoteFail |
    GetInitClientCreationData | GetInitClientCreationDataSuccess | GetInitClientCreationDataFail | ClearClientData |
    GetFullClientData | GetFullClientDataSuccess | GetFullClientDataFail |
    UpdateClient | AddClient | CloseClientCreation |
    AddUpdateClient | AddUpdateClientSuccess | AddUpdateClientFail |
    AMLCheckForClient | AMLCheckForClientSuccess | AMLCheckForClientFail |
    DeleteClient | DeleteClientSuccess | DeleteClientFail | PrefillLetterAndContactName | CopyFromCorrespondence |
    PrivateIndividual | FirstNameAsDirector | GetScreenLookupData |
    GetFullClientDataGridParams | GetFullClientDataGridParamsSuccess | GetFullClientDataGridParamsFail |
    FirstNameAsDirector | GetScreenLookupData | GetScreenLookupSuccess | GetScreenLookupFail | AddNewNote |
    AddNewNote | ChangeNote | DeleteNote | CancelNoteChanges | ClientTypeComboChanged |
    UploadDocument | UploadDocumentSuccess | UploadDocumentFail |
    ClientLoadDocument | ClientLoadDocumentURLSuccess | ClientLoadDocumentURLFail |
    EventGridRefresh | EventGridRefreshSuccess | EventGridRefreshFail |
    ClientMattersGridRefresh | ClientMattersGridRefreshSuccess | ClientMattersGridRefreshFail |
    ClientCreationPopupClose | SetUserBarnchToNewClient | ClientValidationPopup | SwitchAmlAndClientSave | CheckAndUpdate | AmlCheck |
    ChangeRiskAssessmentQuation | AddUpdateRiskAssessment | AddUpdateRiskAssessmentSuccess | AddUpdateRiskAssessmentFail |
    GetMatters | GetMattersSuccess | GetMattersFail | ChangeMatterPage |
    GetDefuiltRiskAseesData | GetDefuiltRiskAseesDataSuccess | GetDefuiltRiskAseesDataFail;
