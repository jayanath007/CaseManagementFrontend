import { CivilClassObj } from './../../civil-class-management/model/interfaces';
import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import {
    Folder, FeeEarner, DiaryType, ActionType, MatterInfo, Grade, Attachments,
    FolderOnAttachment, NoteOnAttachment, ConditiOnAttachment, ExtraTimeType,
    AddNoteValidationInfo, AddNoteSuccessInfo, EditViewData, AddNoteItemData, ViewingInlineAttachement
} from '../models/interfaces';
import { LegalAid, DiaryRecType, CheckedType } from '../models/enumeration';
import { DriveItem } from '../../core/lib/microsoft-graph';
import { AttType, } from '../../core/lib/timeRecord';
import { PrecedentHSModel, WorkType } from '../../core/lib/precedentHS';
import { eBillingType, MatterAppCode } from '../../core/lib/matter';
import { dpsNewDate } from '../../utils/javascriptDate';
import { AddNoteInPutData, AddNoteItemsType } from '../../core/lib/addNote';
import { checkTimeRecordType } from '../../auth';
import { ClassObj } from '../../crime-management-core/models/interfaces';
import { DetailStatus } from '../../shared';
import { CivilDropDownData } from '../../civil-time-recording-desktop';

export interface State {
    readonly views: { [token: string]: AddNoteState };
    readonly diaryTypesByAppId: { [appid: number]: DiaryType[] };
}

export interface AddNoteState {
    readonly addNoteHeader: string;
    readonly disableFileUpload: boolean;
    readonly loginUser: string;
    readonly feeEarnerLoading: boolean;
    readonly loading: boolean;
    readonly folderLoading: boolean;
    readonly defultfolderLoading: boolean;
    readonly defultfolder: Folder;
    readonly userGradeLoading: boolean;
    readonly diaryTypeLoading: boolean;
    readonly actionTypeLoading: boolean;
    readonly matterDataLoading: boolean;
    readonly init: boolean;
    readonly matterData: MatterInfo;
    readonly legalAid: LegalAid;
    readonly fileUploadButtonVisible: boolean;
    readonly feeEarnerList: FeeEarner[];
    readonly folderList: Folder[];
    readonly userGradeList: Grade[];
    readonly diaryTypeList: DiaryType[];
    readonly actionTypeList: ActionType[];
    readonly note: string;
    readonly addNoteItemsType?: AddNoteItemsType;
    readonly itemDataList: AddNoteItemData[];
    readonly itemDataListLoading: boolean;
    readonly password: string;
    readonly dateDone: string | Date;
    readonly initialUser: string;
    readonly diaryTypeId: DiaryRecType;
    readonly uncharged: boolean;
    readonly rate: number;
    readonly rateError: DetailStatus[];
    readonly unit: number;
    readonly fileNoteValue: string;
    readonly extraTimeType: ExtraTimeType[];
    readonly extraTimeTypeLoading: boolean;
    readonly extraRate: number;
    readonly extraUnit: number;
    readonly extraValue: number;
    readonly submitSuccess: boolean;
    readonly validation: AddNoteValidationInfo;
    readonly saveStart: boolean;
    readonly AddNoteSuccessInfo: AddNoteSuccessInfo;
    readonly fileExtension: string;
    readonly showTimeAndCost: boolean;
    readonly isDisableDiaryType: boolean;
    readonly isTimeRecordingEnabled: boolean;
    readonly isEdit: boolean;
    readonly uid: number;
    readonly putOnBy: string;
    readonly isDirty: boolean;
    readonly isDateDoneDirty: boolean;
    readonly matRatCategory: number;
    readonly timeUseFeeEarnerRatesValueDisable: boolean;
    readonly sendForSignatureToList: FeeEarner[];
    readonly sendForSignature: boolean;
    readonly diaryIds: number[];
    readonly editViewData: EditViewData;
    readonly classType: ClassObj[];
    readonly classTypeLoading: boolean;
    readonly loadingAttTypeList: boolean;
    readonly attTypes: AttType[];
    readonly section51: boolean;
    readonly bulkEntry: boolean;
    readonly noOfEntry: number;
    readonly eBillingType: eBillingType;
    readonly workTypeList: WorkType[];
    readonly activitiList: PrecedentHSModel[];
    readonly phaseList: PrecedentHSModel[];
    readonly phaseWiseTaskList: PrecedentHSModel[];
    readonly telephoneAdvice: boolean;
    readonly isBilled: boolean;
    readonly isAttachmentUC: boolean;
    readonly template?: string;
    readonly anchorType?: string;
    readonly columnFolderId?: number;
    readonly retrySignature: number;
    readonly viewingInlineAttachement: ViewingInlineAttachement;
    readonly civilClassList: CivilClassObj[];
    readonly civilLevelList: CivilDropDownData[];
    readonly civilCourtList: CivilDropDownData[]
}
const initialState: State = {
    views: {},
    diaryTypesByAppId: {}
};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};

    switch (action.type) {
        case Actions.INIT_ADD_NOTE:
            temp[action.token] = getInitViewData(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.INIT_ADD_NOTE_SUCCESS:
            temp[action.token] = getInitViewDataSuccess(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.UPLOAD_ITEMS:
            temp[action.token] = uploadItems(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.UPLOAD_ITEMS_SUCCESS:
            temp[action.token] = state.views[action.token] ?
                uploadItemsSuccess(state.views[action.token], action.payload.itemDataList) : null;
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.UPLOAD_ITEMS_FAIL:
            temp[action.token] = state.views[action.token] ? uploadItemsFail(state.views[action.token]) : null;
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_MSG_DATA:
            temp[action.token] = state.views[action.token] ? getMsgData(state.views[action.token], action.payload.itemData) : null;
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_MSG_DATA_SUCCESS:
            temp[action.token] = state.views[action.token] ?
                getMsgDataSuccess(state.views[action.token], action.payload.itemData, action.payload.dateTimeOffset) : null;
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_MSG_DATA_FAIL:
            temp[action.token] = state.views[action.token] ? getMsgDataFail(state.views[action.token], action.payload.itemData) : null;
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_FOLDER_LIST:
            temp[action.token] = getFolderListData(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_FOLDER_LIST_SUCCESS:
            temp[action.token] = getFolderListDataSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_FOLDER_LIST_FAIL:
            temp[action.token] = getFolderListDataFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_DEFULT_FOLDER:
            temp[action.token] = getDefultFolderData(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_DEFULT_FOLDER_SUCCESS:
            temp[action.token] = getDefultFolderDataSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_DEFULT_FOLDER_FAIL:
            temp[action.token] = getDefultFolderDataFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_USER_GRADE_LIST:
            temp[action.token] = getUserGradeListData(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_USER_GRADE_LIST_SUCCESS:
            temp[action.token] = getUserGradeListDataSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_USER_GRADE_LIST_FAIL:
            temp[action.token] = getUserGradeListDataFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_FEE_EARNER_LIST:
            temp[action.token] = getFeeEarnerListData(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_FEE_EARNER_LIST_SUCCESS:
            temp[action.token] = getFeeEarnerListDataSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_FEE_EARNER_LIST_FAIL:
            temp[action.token] = getFeeEarnerListDataFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_DIARY_TYPE_LIST:
            temp[action.token] = getDiaryTypeListData(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_DIARY_TYPE_LIST_SUCCESS:
            temp[action.token] = getDiaryTypeListDataSuccess(state.views[action.token], action.payload);
            return {
                ...state,
                views: { ...state.views, ...temp },
                diaryTypesByAppId: { ...state.diaryTypesByAppId, ...{ [action.payload.appId]: action.payload.diaryTypeList } }
            };
        case Actions.LOAD_DIARY_TYPE_LIST_FAIL:
            temp[action.token] = getDiaryTypeListDataFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_TIME_TYPE_LIST:
            temp[action.token] = getExtraTimeTypeListData(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_TIME_TYPE_LIST_SUCCESS:
            temp[action.token] = getExtraTimeTypeListDataSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_TIME_TYPE_LIST_FAIL:
            temp[action.token] = getExtraTimeTypeListDataFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_ACTION_LIST:
            temp[action.token] = getActionListData(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_ACTION_LIST_SUCCESS:
            temp[action.token] = getActionListDataSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_ACTION_LIST_FAIL:
            temp[action.token] = getActionListDataFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ITEM_RATE:
            temp[action.token] = getItemRate(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EXTRA_RATE:
            temp[action.token] = getExtraRate(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_FOLDER:
            temp[action.token] = changeFolder(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_FEE_EARNER:
            temp[action.token] = changeFeeEarner(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_GRADE:
            temp[action.token] = changeGrade(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CREATE_ADD_NOTE_HEADER:
            temp[action.token] = createAddNoteHeader(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_NOTE:
            temp[action.token] = changeNote(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_FILE_DATA:
            temp[action.token] = changeFileData(state.views[action.token], action.payload.fileDataList);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_PASSWORD:
            temp[action.token] = changePassword(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_DATE_DONE:
            temp[action.token] = changeDateDone(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_FOLDER_ON_ATTACHMENT:
            temp[action.token] = changeFolderOnAttachmet(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_NOTE_ON_ATTACHMENT:
            temp[action.token] = changeNoteOnAttachment(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_IS_ATTACH_ON_ATTACHMENT:
            temp[action.token] = changeIsAttachOnAttachmet(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_IS_UNCHARGE_ON_ATTACHMENT:
            temp[action.token] = changeIsUnChargeOnAttachment(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_DIARY_TYPE:
            temp[action.token] = changeDiaryType(state.views[action.token], action.payload.diaryType);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_UNCHARGE:
            temp[action.token] = changeUncharge(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_RATE:
            temp[action.token] = changeRate(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_UNIT:
            temp[action.token] = changeUnit(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_EXTRA_RATE:
            temp[action.token] = changeExtraRate(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_EXTRA_UNIT:
            temp[action.token] = changeExtraUnit(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CALCULATE_ITEM_VALUE:
            temp[action.token] = calculateItemValue(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CALCULATE_EXTRA_ITEM_VALUE:
            temp[action.token] = calculateExtraItemValue(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_EXTRA_TIME_TYPE:
            temp[action.token] = changeExtraTimeType(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ADD_NOTE_SUBMIT:
            temp[action.token] = addNoteSubmit(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ADD_NOTE_SUBMIT_SCCEESS:
            temp[action.token] = addNoteSubmitSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ADD_NOTE_VALIDATION:
            temp[action.token] = addNoteValidation(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ADD_NOTE_SAVE_SCCEESS:
            temp[action.token] = addNoteSaveSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ADD_NOTE_SAVE_FAIL:
            temp[action.token] = addNoteSaveFail(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ADD_NOTE_CLOSE:
            temp[action.token] = null;
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EDIT_VIEW_DATA:
            temp[action.token] = loadingEditViewData(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EDIT_VIEW_DATA_SUCCESS:
            temp[action.token] = setEditViewData(state.views[action.token], action.payload.editViewData);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EDIT_VIEW_DATA_FAIL:
            temp[action.token] = getEditViewDataFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.EMAIL_IN_VALIDATION:
            temp[action.token] = EmailInValidation(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_MATTER_DATA_FROM_MATTER_RAF:
            temp[action.token] = setMatterDataLoading(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_MATTER_DATA_FROM_MATTER_RAF_SUCCESS:
            temp[action.token] = setMaterRatCat(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_MATTER_DATA_FROM_MATTER_RAF_FAIL:
            temp[action.token] = { ...state, loading: false, matterDataLoading: false, matRatCategory: 0 };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.OPEN_ATTACHMENT:
            temp[action.token] = { ...state.views[action.token], viewingInlineAttachement: { loading: true } };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_DOCUMENT_URL:
            temp[action.token] = { ...state.views[action.token], viewingInlineAttachement: action.payload };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_DOCUMENT_URL_FAIL:
            temp[action.token] = { ...state.views[action.token], viewingInlineAttachement: { loading: false } };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_SEND_FOR_SIGNATURE:
            temp[action.token] = { ...state.views[action.token], sendForSignature: action.payload };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_SEND_FOR_SIGNATURE_TO:
            temp[action.token] = {
                ...state.views[action.token],
                feeEarnerList: changeSelectedFreeEarner(state.views[action.token].feeEarnerList, action.payload), isDirty: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ADD_DIARY_ID:
            temp[action.token] = {
                ...state.views[action.token],
                diaryIds: state.views[action.token].diaryIds.concat([action.payload.diaryId])
            };
            return { ...state, views: { ...state.views, ...temp } };

        // ebilling comment
        case (Actions.LOAD_ADD_NOTE_WORK_TYPE_LIST):
            temp[action.token] = getWorkTypeList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_ADD_NOTE_WORK_TYPE_LIST_SUCCESS):
            temp[action.token] = getWorkTypeListSuccess(state.views[action.token], action.payload.workTypeList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_ADD_NOTE_WORK_TYPE_LIST_FAIL):
            temp[action.token] = getWorkTypeListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_ADD_NOTE_WORK_TYPE_LIST:
            temp[action.token] = changeWorkTypeList(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };

        case (Actions.LOAD_ADD_NOTE_PHASE_LIST):
            temp[action.token] = getPhaseList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_ADD_NOTE_PHASE_LIST_SUCCESS):
            temp[action.token] = getPhaseListSuccess(state.views[action.token], action.payload.phaseList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_ADD_NOTE_PHASE_LIST_FAIL):
            temp[action.token] = getPhaseListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_ADD_NOTE_PHASE_LIST:
            temp[action.token] = changePhaseList(state.views[action.token], action.payload.selectedPhase);
            return { ...state, views: { ...state.views, ...temp } };

        case (Actions.LOAD_ADD_NOTE_ACTIVITI_LIST):
            temp[action.token] = getActivitiList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_ADD_NOTE_ACTIVITI_LIST_SUCCESS):
            temp[action.token] = getActivitiListSuccess(state.views[action.token], action.payload.activitiList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_ADD_NOTE_ACTIVITI_LIST_FAIL):
            temp[action.token] = getActivitiListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_ADD_NOTE_ACTIVITI_LIST:
            temp[action.token] = changeActivitiList(state.views[action.token], action.payload.selectedActiviti);
            return { ...state, views: { ...state.views, ...temp } };

        case (Actions.LOAD_ADD_NOTE_TASK_LIST):
            temp[action.token] = getTaskList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_ADD_NOTE_TASK_LIST_SUCCESS):
            temp[action.token] = getTaskListSuccess(state.views[action.token], action.payload.taskList);
            return { ...state, views: { ...state.views, ...temp } };
        case (Actions.LOAD_ADD_NOTE_TASK_LIST_FAIL):
            temp[action.token] = getTaskListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_ADD_NOTE_TASK_LIST:
            temp[action.token] = changeTaskList(state.views[action.token], action.payload.selectedTask);
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.GET_CLASS_TYPE:
            temp[action.token] = { ...state.views[action.token], classTypeLoading: true, };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CLASS_TYPE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                classTypeLoading: false,
                classType: changeClassType(action.payload.list,
                    !!state.views[action.token].editViewData ? state.views[action.token].editViewData.classId : 3)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CLASS_TYPE_FAIL:
            temp[action.token] = { ...state.views[action.token], classTypeLoading: false };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_ATT_TYPE_LIST:
            temp[action.token] = { ...state.views[action.token], loadingAttTypeList: true };
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.LOAD_ATT_TYPE_LIST_SUCCESS:
            const selectAttType = state.views[action.token].editViewData && state.views[action.token].editViewData.subClassId ?
                state.views[action.token].editViewData.subClassId : 2;
            temp[action.token] = {
                ...state.views[action.token],
                attTypes: changeAttType(action.payload.attTypes, selectAttType),
                loadingAttTypeList: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.LOAD_ATT_TYPE_LIST_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loadingAttTypeList: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_CLASS_TYPE:
            temp[action.token] = {
                ...state.views[action.token],
                classType: changeClassType(state.views[action.token].classType, action.payload.selectedClass.rectype)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_ATT_TYPE:
            temp[action.token] = {
                ...state.views[action.token],
                attTypes: changeAttType(state.views[action.token].attTypes, action.payload.type.attId)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_SECTION_51:
            temp[action.token] = {
                ...state.views[action.token],
                section51: action.payload.isSection51
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_IS_BUILK:
            temp[action.token] = {
                ...state.views[action.token],
                bulkEntry: action.payload.isBuilk,
                noOfEntry: !action.payload.isBuilk ? 1 : state.views[action.token].noOfEntry
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_NO_OF_ENTRIES:
            temp[action.token] = {
                ...state.views[action.token],
                noOfEntry: action.payload.noOfEntry
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_IS_TELEPHONE_ADV:
            temp[action.token] = {
                ...state.views[action.token],
                telephoneAdvice: action.payload.isTelephoneAdv
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.OPEN_SIGN_AND_SHARE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loading: false,
                retrySignature: state.views[action.token].retrySignature + 1
            };
            return { ...state, views: { ...state.views, ...temp } };

        // Civil 
        case Actions.GET_CIVIL_CLASS:
            temp[action.token] = { ...state.views[action.token], classTypeLoading: true, };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CIVIL_CLASS_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                classTypeLoading: false,
                civilClassList: changeCivilClassType(action.payload.list,
                    !!state.views[action.token].editViewData ? state.views[action.token].editViewData.classId : null)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CIVIL_CLASS_FAIL:
            temp[action.token] = { ...state.views[action.token], classTypeLoading: false };
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.GET_CIVIL_LEVELS:
            temp[action.token] = { ...state.views[action.token], loadingAttTypeList: true };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CIVIL_LEVELS_SUCCESS:
            const selectCivilLevel = state.views[action.token].editViewData && state.views[action.token].editViewData.subClassId ?
                state.views[action.token].editViewData.subClassId : 0;
            temp[action.token] = {
                ...state.views[action.token],
                civilLevelList: changeCivilLevel(action.payload.list, selectCivilLevel),
                loadingAttTypeList: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_CIVIL_LEVELS_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                loadingAttTypeList: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.CHANGE_CIVIL_CLASS:
            temp[action.token] = {
                ...state.views[action.token],
                civilClassList: changeCivilClassType(state.views[action.token].civilClassList, action.payload.selectClasss.legalAidCaseId)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_CIVIL_LEVEL:
            temp[action.token] = {
                ...state.views[action.token],
                civilLevelList: changeCivilLevel(state.views[action.token].civilLevelList, action.payload.selectLevel.id),
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.CHANGE_CIVIL_COURT:
            temp[action.token] = {
                ...state.views[action.token],
                civilCourtList: changeCivilCourt(state.views[action.token].civilCourtList, action.payload.selectCourt.id),
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.REQUEST_ITEM_RATE:
            temp[action.token] = { ...state.views[action.token], loading: true };
            return { ...state, views: { ...state.views, ...temp } };
        default:
            {
                return state;
            }
    }
}

function setMaterRatCat(state: AddNoteState, payload): Partial<AddNoteState> {
    return {
        ...state, matRatCategory: payload.matterRefCat, matterDataLoading: false
    };
}

function setMatterDataLoading(state: AddNoteState): Partial<AddNoteState> {
    return {
        ...state, matterDataLoading: true
    };
}

function getInitViewData(state: AddNoteState, payload: {
    inPutData: AddNoteInPutData,
    loginUser: string
    timeUseFeeEarnerGradesValueDisable: boolean;
    dateTimeOffset: number;
    isAttachmentUC: boolean;
}): Partial<AddNoteState> {
    let template = null;
    let columnFolderId = null;
    let anchorType = null;
    if (payload.inPutData.addNoteItemsType === AddNoteItemsType.LetterEnginItems &&
        payload.inPutData.letterEnginItemList && payload.inPutData.letterEnginItemList.length > 0) {
        template = payload.inPutData.letterEnginItemList[0].template;
        columnFolderId = payload.inPutData.letterEnginItemList[0].columnFolderId;
        anchorType = payload.inPutData.letterEnginItemList[0].diaryAnchorType;
    }
    const civilCourtList = [
        { id: 0, value: 'N/A' },
        { id: 1, value: 'Judge of high court or Court of Protection, Section 9/Deputy Judge of the High' },
        { id: 2, value: 'District Judge, Circuit Judge, Costs Judge (County Court)' },
        { id: 3, value: 'Assistant of justices clerk, Justices Clerk, Lay Justice (Family Proceeding Court)' }
    ]
    return {
        ...state,
        init: true,
        disableFileUpload: isDisableFileUpload(payload.inPutData),
        matterData: payload.inPutData.matterData,
        legalAid: payload.inPutData.legalAid,
        note: '',
        password: '',
        dateDone: getIniteDateDone(payload.inPutData, payload.dateTimeOffset),
        initialUser: payload.loginUser,
        diaryTypeId: getIniteDiaryTypeId(payload.inPutData),
        uncharged: payload.isAttachmentUC ? payload.isAttachmentUC : false,
        rate: 0.00,
        unit: 1,
        fileNoteValue: '0',
        extraRate: 1.00,
        extraUnit: 0,
        extraValue: 0.00,
        validation: { status: false, msg: 'is Ok' },
        AddNoteSuccessInfo: { isSuccess: false, msg: '' },
        showTimeAndCost: isShowHideTimeandCost(payload.inPutData.diaryType),
        isDisableDiaryType: isDisableDiaryType(payload.inPutData),
        isTimeRecordingEnabled: null,
        isEdit: payload.inPutData.isEdit,
        uid: payload.inPutData.uid,
        isDirty: false,
        fileExtension: '',
        timeUseFeeEarnerRatesValueDisable: payload.timeUseFeeEarnerGradesValueDisable,
        isDateDoneDirty: false,
        diaryIds: [],
        section51: false,
        bulkEntry: false,
        noOfEntry: 1,
        telephoneAdvice: false,
        eBillingType: payload.inPutData.matterData.eBilling,
        matterDataLoading: false,
        isAttachmentUC: payload.isAttachmentUC ? payload.isAttachmentUC : false,
        template,
        columnFolderId,
        anchorType,
        retrySignature: 0,
        viewingInlineAttachement: { loading: false },
        civilCourtList: changeCivilCourt(civilCourtList, 0)
    };

    function getItems(inPutData: AddNoteInPutData) {

        switch (inPutData.addNoteItemsType) {
            case AddNoteItemsType.FileItems:
                return inPutData.fileItemList;
            case AddNoteItemsType.MailItems:
                return inPutData.mailItemList;
            case AddNoteItemsType.DriveItems:
                return inPutData.driveItemList;
            case AddNoteItemsType.DiaryItems:
                return inPutData.diaryItemList;
            case AddNoteItemsType.InboxItems:
                return inPutData.inboxItemList;
            case AddNoteItemsType.LetterEnginItems:
                return inPutData.letterEnginItemList;
            default:
                return null;
        }

    }
    function getIniteDateDone(inPutData: AddNoteInPutData, dateTimeOffset: number) {
        if (inPutData.addNoteItemsType === AddNoteItemsType.MailItems && inPutData.mailItemList && inPutData.mailItemList.length > 0 &&
            (inPutData.diaryType === DiaryRecType.EMAIL_IN || inPutData.diaryType === DiaryRecType.EMAIL_OUT)) {
            return dpsNewDate(dateTimeOffset, inPutData.mailItemList[0].data.receivedDateTime);
        }
        return dpsNewDate(dateTimeOffset);
    }
    function getIniteDiaryTypeId(inPutData: AddNoteInPutData): DiaryRecType {
        const items = getItems(inPutData);
        if (items && items.length > 0) {
            if (inPutData.matterData.isProspectMatter) {
                return DiaryRecType.FILE_NOTE;
            } if (inPutData.addNoteItemsType === AddNoteItemsType.MailItems) {
                const item = inPutData.mailItemList[0];
                return (items.length === 1 && item.folderWellKnownId === 'sentitems') ? DiaryRecType.EMAIL_OUT : DiaryRecType.EMAIL_IN;
            } else {
                let name = '';
                if (inPutData.addNoteItemsType === AddNoteItemsType.FileItems) {
                    const item = inPutData.fileItemList[0];
                    name = item.name;
                } else if (inPutData.addNoteItemsType === AddNoteItemsType.DriveItems) {
                    const item = inPutData.driveItemList[0];
                    name = item.name;
                } else if (inPutData.addNoteItemsType === AddNoteItemsType.DiaryItems) {
                    const item = inPutData.diaryItemList[0];
                    name = item.letterName;
                } else if (inPutData.addNoteItemsType === AddNoteItemsType.InboxItems) {
                    const item = inPutData.inboxItemList[0];
                    const docNames = item.inboxDocPath.split('\\');
                    name = docNames[docNames.length - 1];
                } else if (inPutData.addNoteItemsType === AddNoteItemsType.LetterEnginItems) {
                    const item = inPutData.letterEnginItemList[0];
                    name = item.letter;
                }
                const fileExtension = name ? name.split('.').pop().toLowerCase() : null;
                if (fileExtension) {
                    return (fileExtension === 'msg' || fileExtension === 'eml') ? DiaryRecType.EMAIL_IN : inPutData.diaryType;
                }
            }
        }
        return inPutData.diaryType;
    }
    function isDisableFileUpload(inPutData: AddNoteInPutData) {
        const items = getItems(inPutData);
        return (items && items.length > 1) || (inPutData.addNoteItemsType &&
            inPutData.addNoteItemsType !== AddNoteItemsType.FileItems && inPutData.addNoteItemsType !== AddNoteItemsType.DriveItems);
    }
    function isDisableDiaryType(inPutData: AddNoteInPutData) {
        const items = getItems(inPutData);
        return (items && items.length > 1);
    }
}

function getInitViewDataSuccess(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false });
}

function uploadItems(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, itemDataListLoading: true });
}
function uploadItemsSuccess(state: AddNoteState, itemDataList: AddNoteItemData[]): Partial<AddNoteState> {
    return Object.freeze({
        ...state, itemDataListLoading: false,
        itemDataList: itemDataList, note: state.note || itemDataList[0].note, fileExtension: itemDataList[0].extension
    });
}
function uploadItemsFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, itemDataListLoading: false });
}

function getMsgData(state: AddNoteState, itemData: AddNoteItemData): Partial<AddNoteState> {
    return Object.freeze({
        ...state,
        itemDataList: state.itemDataList.map(item => (item.token === itemData.token ? { ...item, isAttachmentLoading: true } : item))
    });
}
function getMsgDataSuccess(state: AddNoteState, itemData: AddNoteItemData, dateTimeOffset: number): Partial<AddNoteState> {
    const index = state.itemDataList.findIndex(item => item.token === itemData.token);
    const selectedDiaryType = state.diaryTypeList ? state.diaryTypeList.find(val => val.selected) : null;
    const successMsg = `This item has attachments. Click on the
        Attachments tab to preview and change file Note for each items`;
    return Object.freeze({
        ...state,
        validation: {
            status: !(index === 0 && itemData.attachments && itemData.attachments.length > 0 && selectedDiaryType &&
                (selectedDiaryType.value === DiaryRecType.EMAIL_IN || selectedDiaryType.value === DiaryRecType.EMAIL_OUT)),
            msg: successMsg
        },
        note: (index === 0 && state.note === state.itemDataList[index].note) ? itemData.note : state.note,
        dateDone: index === 0 ? dpsNewDate(dateTimeOffset, itemData.dateDn) : state.dateDone,
        itemDataList: state.itemDataList.map(item =>
            (item.token === itemData.token ?
                { ...itemData, isAttachmentLoading: false, attachments: setAttachmentsData(itemData.attachments, state.isAttachmentUC) }
                : item)
        )
    });
}

function getMsgDataFail(state: AddNoteState, itemData: AddNoteItemData): Partial<AddNoteState> {
    return Object.freeze({
        ...state,
        itemDataList: state.itemDataList.map(item => (item.token === itemData.token ? { ...item, isAttachmentLoading: false } : item))
    });
}

// Folder list stufs
function getFolderListData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, folderLoading: true });
}


function getFolderListDataSuccess(state: AddNoteState, payload): Partial<AddNoteState> {
    return Object.freeze({
        ...state, folderLoading: false,
        folderList: payload.folderList
    });
}
function getFolderListDataFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, folderLoading: false });
}
function getDefultFolderData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, defultfolderLoading: state.isEdit ? state.defultfolderLoading : true });
}
function getDefultFolderDataSuccess(state: AddNoteState, payload): Partial<AddNoteState> {

    if (state.isEdit) {
        return state;
    } else {
        return Object.freeze({
            ...state, folderList: changeSelectedFolder(state.folderList,
                state.isEdit && state.editViewData ? state.editViewData.columnFolderId : parseInt(payload.defualtFolder, 10)),
            defultfolderLoading: false
        });
    }
}
function getDefultFolderDataFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, defultfolderLoading: false });
}

// User Grade list stufs
function getUserGradeListData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, userGradeLoading: true });
}
function getUserGradeListDataSuccess(state: AddNoteState, payload): Partial<AddNoteState> {
    return Object.freeze({
        ...state, userGradeLoading: false,
        userGradeList: changeSelectedUserGrade(payload.userGradeList, payload.defualtUserGrade)
    });
}
function getUserGradeListDataFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, userGradeLoading: false });
}

// User Grade list stufs
function getDiaryTypeListData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, diaryTypeLoading: true });
}
function getDiaryTypeListDataSuccess(state: AddNoteState,
    payload: { diaryTypeList: DiaryType[]; diaryType?: DiaryRecType; }): Partial<AddNoteState> {
    return Object.freeze({
        ...state, diaryTypeList: changeSelectedDiaryType(payload.diaryTypeList, payload.diaryType ? payload.diaryType : state.diaryTypeId),
        diaryTypeLoading: false,
    });
}
function getDiaryTypeListDataFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, diaryTypeLoading: false });
}


// extra time type list stufs
function getExtraTimeTypeListData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, extraTimeTypeLoading: true });
}
function getExtraTimeTypeListDataSuccess(state: AddNoteState, payload): Partial<AddNoteState> {
    return Object.freeze({
        ...state, extraTimeTypeLoading: false,
        extraTimeType: changeSelectedExtraTimeType(payload.extraTimeType, payload.extraTimeType[0])
    });
}
function getExtraTimeTypeListDataFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, extraTimeTypeLoading: false });
}

// Action list stufs
function getActionListData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, actionTypeLoading: true });
}
function getActionListDataSuccess(state: AddNoteState, payload): Partial<AddNoteState> {
    return Object.freeze({
        ...state, actionTypeLoading: false,
        actionTypeList: changeSelectedActionList(payload.ActionTypeList, 'Complete')
    });
}
function getActionListDataFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, actionTypeLoading: false });
}


// Fee Earner list stufs
function getFeeEarnerListData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, feeEarnerLoading: true });
}
function getFeeEarnerListDataSuccess(state: AddNoteState, payload): Partial<AddNoteState> {
    return Object.freeze({
        ...state, feeEarnerLoading: false,
        feeEarnerList: changeSelectedFreeEarner(payload.feeEarnerList, state.initialUser),
        sendForSignatureToList: changeSelectedFreeEarner(payload.feeEarnerList, state.initialUser)
    });

}
function getFeeEarnerListDataFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, feeEarnerLoading: false });
}

function changeGrade(state: AddNoteState, payload) {
    return Object.freeze({ ...state, userGradeList: changeSelectedUserGrade(state.userGradeList, payload), isDirty: true });
}
function changeNote(state: AddNoteState, payload) {
    return Object.freeze({ ...state, note: payload, isDirty: true });
}

function changeFileData(state: AddNoteState, files: File[] | DriveItem[]) {
    const diaryTypeId = getDiaryTypeId();
    return Object.freeze({
        ...state,
        diaryTypeId: diaryTypeId,
        // diaryTypeList: changeSelectedDiaryType(state.diaryTypeList, diaryTypeId),
        itemDataList: null,
        password: '',
        fileExtension: '',
        note: (files && files.length > 0) ? state.note :
            ((state.itemDataList && state.itemDataList.length > 0 && state.itemDataList[0].note === state.note) ? '' : state.note),
        // showTimeAndCost: isShowHideTimeandCost(diaryTypeId),
        isDisableDiaryType: files && files.length > 1
    });
    function getDiaryTypeId(): DiaryRecType {
        if (files && files.length > 1) {
            if (state.matterData.isProspectMatter) {
                return DiaryRecType.FILE_NOTE;
            } else {
                const name = files[0].name;
                const fileExtension = name ? name.split('.').pop().toLowerCase() : null;
                if (fileExtension) {
                    return (fileExtension === 'msg' || fileExtension === 'eml') ? DiaryRecType.EMAIL_IN : DiaryRecType.LETTER_IN;
                }
            }
        }
        return (state.diaryTypeList && state.diaryTypeList.find(val => val.selected)) ?
            state.diaryTypeList.find(val => val.selected).value : state.diaryTypeId;
    }
}

function changePassword(state: AddNoteState, payload) {
    return Object.freeze({ ...state, password: payload, isDirty: true });
}

function changeDateDone(state: AddNoteState, payload) {
    return Object.freeze({ ...state, dateDone: payload, isDirty: true, isDateDoneDirty: true });
}

function changeNoteOnAttachment(state: AddNoteState, info: NoteOnAttachment) {
    return Object.freeze({
        ...state,
        itemDataList: state.itemDataList.map((item, i) =>
            (i === info.parentItemIndex ? { ...item, attachments: updateNoteOnAttachmet(item.attachments, info) } : item)
        ),
        isDirty: true
    });
}
function updateNoteOnAttachmet(attachments: Attachments[], info: NoteOnAttachment) {
    return attachments.map((attahment) => {
        if (attahment.reference === info.reference) {
            return Object({ ...attahment, fileNote: info.note });
        }
        return attahment;
    });
}
function changeIsAttachOnAttachmet(state: AddNoteState, info: ConditiOnAttachment) {
    return Object.freeze({
        ...state,
        itemDataList: state.itemDataList.map((item, i) =>
            (i === info.parentItemIndex ? { ...item, attachments: updateIsAttachOnAttachmet(item.attachments, info) } : item)
        ),
        isDirty: true
    });
}
function updateIsAttachOnAttachmet(attachments: Attachments[], info: ConditiOnAttachment) {
    if (info.checkedType === CheckedType.All) {
        return attachments.map((attahment) => {
            return Object({
                ...attahment,
                isSelected: info.condition
            });

        });
    } else {
        return attachments.map((attahment) => {
            if (attahment.reference === info.reference) {
                return Object({ ...attahment, isSelected: info.condition });
            }
            return attahment;
        });
    }

}

function changeIsUnChargeOnAttachment(state: AddNoteState, info: ConditiOnAttachment) {
    return Object.freeze({
        ...state,
        itemDataList: state.itemDataList.map((item, i) =>
            (i === info.parentItemIndex ? { ...item, attachments: updateUnChargeOnAttachmet(item.attachments, info) } : item)
        ),
        isDirty: true
    });
}
function updateUnChargeOnAttachmet(attachments: Attachments[], info: ConditiOnAttachment) {
    if (info.checkedType === CheckedType.All) {
        return attachments.map((attahment) => {
            return Object({
                ...attahment,
                isUncharge: info.condition
            });
        });
    } else {
        return attachments.map((attahment) => {
            if (attahment.reference === info.reference) {
                return Object({ ...attahment, isUncharge: info.condition });
            }
            return attahment;
        });
    }
}

function changeFolderOnAttachmet(state: AddNoteState, info: FolderOnAttachment) {
    return Object.freeze({
        ...state,
        itemDataList: state.itemDataList.map((item, i) =>
            (i === info.parentItemIndex ? { ...item, attachments: updateAttachmentfolderOnAttachmet(item.attachments, info) } : item)
        ),
        isDirty: true
    });
}

function updateAttachmentfolderOnAttachmet(attachments: Attachments[], info: FolderOnAttachment) {
    return attachments.map((attahment) => {
        if (attahment.reference === info.reference) {
            return Object.freeze({ ...attahment, diaryFolderId: info.folder.folderId });
        }
        return attahment;
    });
}

function changeSelectedActionList(currentActionList: ActionType[], selectedAction: string) {
    return currentActionList.map((action) => {
        if (action.text === selectedAction) {
            return Object.freeze({ ...action, selected: true });
        } else if (action.selected) {
            return Object.freeze({ ...action, selected: false });
        } return action;
    });
}

function changeUncharge(state: AddNoteState, payload) {
    return Object.freeze({ ...state, loading: true, uncharged: payload, isDirty: true });
}

function changeRate(state: AddNoteState, payload) {
    // return Object.freeze({ ...state, rate: payload });
    return Object.freeze({ ...state, loading: true, rate: parseFloat(payload).toFixed(2), isDirty: true });
}

function changeUnit(state: AddNoteState, payload) {
    return Object.freeze({ ...state, loading: true, unit: payload < 1 ? 1 : parseFloat(payload).toFixed(0), isDirty: true });
}

function changeExtraRate(state: AddNoteState, payload) {
    // return Object.freeze({ ...state, rate: payload });
    return Object.freeze({ ...state, loading: true, extraRate: parseFloat(payload).toFixed(2), isDirty: true });
}

function changeExtraUnit(state: AddNoteState, payload) {
    return Object.freeze({ ...state, loading: true, extraUnit: parseFloat(payload).toFixed(0), isDirty: true });
}

function calculateItemValue(state: AddNoteState, payload) {
    return Object.freeze({ ...state, loading: false, fileNoteValue: payload.fileNoteValue });
}

function calculateExtraItemValue(state: AddNoteState, payload) {
    return Object.freeze({ ...state, loading: false, extraValue: payload.extraValue });
}


function changeDiaryType(state: AddNoteState, diaryType: DiaryType) {
    const successMsg = `This item has attachments. Click on the
        Attachments tab to preview and change file Note for each items`;
    const itemData = (state.itemDataList && state.itemDataList.length > 0) ? state.itemDataList[0] : null;
    const selectedDiaryType = state.diaryTypeList ? state.diaryTypeList.find(val => val.selected) : null;
    return Object.freeze({
        ...state, showTimeAndCost: isShowHideTimeandCost(diaryType.value),
        diaryTypeList: changeSelectedDiaryType(state.diaryTypeList, diaryType.value),
        validation: {
            status: !(itemData && itemData.attachments && itemData.attachments.length > 0 &&
                !(selectedDiaryType.value === DiaryRecType.EMAIL_IN || selectedDiaryType.value === DiaryRecType.EMAIL_OUT) &&
                (diaryType.value === DiaryRecType.EMAIL_IN || diaryType.value === DiaryRecType.EMAIL_OUT)),
            msg: successMsg
        },
        isDirty: true,
        note: getDataLogicForNote(state.itemDataList, state.note)
    });
}

function changeSelectedDiaryType(currentDiaryTypeList: DiaryType[], selectetDiaryType: DiaryRecType) {
    return currentDiaryTypeList.map((diaryType) => {
        if (diaryType.value === selectetDiaryType) {
            return Object.freeze({ ...diaryType, selected: true });
        } else if (diaryType.selected) {
            return Object.freeze({ ...diaryType, selected: false });
        } return diaryType;
    });
}

function changeClassType(classes: ClassObj[], selectetClassId: number) {
    let tempClasses: ClassObj[] = [];
    if (classes && classes.length > 0) {
        tempClasses = classes.filter(i => !i.dateclsd);
    }
    if (!tempClasses || tempClasses.length === 0) {
        return [];
    }
    if (!tempClasses.find(cl => cl.rectype === selectetClassId)) {
        return tempClasses.map((cl, i) => {
            if (i === 0) {
                return Object.freeze({ ...cl, selected: true });
            }
            return cl;
        });
    }
    return tempClasses.map((cl) => {
        if (cl.rectype === selectetClassId) {
            return Object.freeze({ ...cl, selected: true });
        } else if (cl.selected) {
            return Object.freeze({ ...cl, selected: false });
        } return cl;
    });
}

function changeCivilClassType(classes: CivilClassObj[], selectetClassId: number) {
    let tempClasses: CivilClassObj[] = [];
    if (classes && classes.length > 0) {
        tempClasses = classes.filter(i => !i.closeDate);
    }
    if (!tempClasses || tempClasses.length === 0) {
        return [];
    }
    if (!tempClasses.find(cl => cl.legalAidCaseId === selectetClassId)) {
        return tempClasses.map((cl, i) => {
            if (i === 0) {
                return Object.freeze({ ...cl, selected: true });
            }
            return cl;
        });
    }
    return tempClasses.map((cl) => {
        if (cl.legalAidCaseId === selectetClassId) {
            return Object.freeze({ ...cl, selected: true });
        } else if (cl.selected) {
            return Object.freeze({ ...cl, selected: false });
        } return cl;
    });
}

function changeAttType(type: AttType[], selectetId: number) {
    if (!type.find(t => t.attId === selectetId)) {
        return type.map((t, i) => {
            if (i === 0) {
                return Object.freeze({ ...t, selected: true });
            }
            return t;
        });
    } else {
        return type.map((t) => {
            if (t.attId === selectetId) {
                return Object.freeze({ ...t, selected: true });
            } else if (t.selected) {
                return Object.freeze({ ...t, selected: false });
            } return t;
        });
    }
}

function changeCivilLevel(type: CivilDropDownData[], selectetId: number) {
    type = !!type ? type : [];
    if (!type.find(t => t.id === selectetId)) {
        return type.map((t, i) => {
            if (i === 0) {
                return Object.freeze({ ...t, selected: true });
            }
            return t;
        });
    } else {
        return type.map((t) => {
            if (t.id === selectetId) {
                return Object.freeze({ ...t, selected: true });
            } else if (t.selected) {
                return Object.freeze({ ...t, selected: false });
            } return t;
        });
    }
}

function changeCivilCourt(type: CivilDropDownData[], selectetId: number) {
    return type.map((t) => {
        if (t.id === selectetId) {
            return Object.freeze({ ...t, selected: true });
        } else if (t.selected) {
            return Object.freeze({ ...t, selected: false });
        } return t;
    });
}


function changeExtraTimeType(state: AddNoteState, payload) {
    return Object.freeze({ ...state, extraTimeType: changeSelectedExtraTimeType(state.extraTimeType, payload), isDirty: true });
}

function changeSelectedExtraTimeType(currentExtraTimeType: ExtraTimeType[], selectetRecType: ExtraTimeType) {
    return currentExtraTimeType.map((extarTime) => {
        if (extarTime.dtL_RecType === selectetRecType.dtL_RecType) {
            return Object.freeze({ ...extarTime, selected: true });
        } else if (extarTime.selected) {
            return Object.freeze({ ...extarTime, selected: false });
        }
        return extarTime;
    });
}

function changeFeeEarner(state: AddNoteState, payload) {
    return Object.freeze({ ...state, feeEarnerList: changeSelectedFreeEarner(state.feeEarnerList, payload), isDirty: true });
}

function changeSelectedFreeEarner(currentFeeEarnerList: FeeEarner[], user: string) {
    if (currentFeeEarnerList.find((feeErner) => feeErner.groupName === user)) {
        return currentFeeEarnerList.map((feeEarner) => {
            if (feeEarner.groupName === user) {
                return Object.freeze({ ...feeEarner, selected: true });
            } else if (feeEarner.selected) {
                return Object.freeze({ ...feeEarner, selected: false });
            }
            return feeEarner;
        });
    } else {
        return currentFeeEarnerList.map((feeEarner, index) => {
            if (index === 0) {
                return Object.freeze({ ...feeEarner, selected: true });
            } else if (feeEarner.selected) {
                return Object.freeze({ ...feeEarner, selected: false });
            }
            return feeEarner;
        });
    }
}

function changeSelectedFreeEarnerInEditMode(currentFeeEarnerList: FeeEarner[], groupName: string) {
    if (currentFeeEarnerList && currentFeeEarnerList.find((feeErner) => feeErner.groupName === groupName)) {
        return currentFeeEarnerList.map((feeEarner) => {
            if (feeEarner.groupName === groupName) {
                return Object.freeze({ ...feeEarner, selected: true });
            } else if (feeEarner.selected) {
                return Object.freeze({ ...feeEarner, selected: false });
            }
            return feeEarner;
        });
    } else if (currentFeeEarnerList) {
        return currentFeeEarnerList.map((feeEarner, index) => {
            if (index === 0) {
                return Object.freeze({ ...feeEarner, selected: true });
            } else if (feeEarner.selected) {
                return Object.freeze({ ...feeEarner, selected: false });
            }
            return feeEarner;
        });
    } else {
        return currentFeeEarnerList;
    }
}

function changeFolder(state: AddNoteState, payload) {
    return Object.freeze({ ...state, folderList: changeSelectedFolder(state.folderList, payload.folderId), isDirty: true });
}

function getItemRate(state: AddNoteState, payload: { rate: number, error: DetailStatus[] }) {
    return Object.freeze({
        ...state,
        rate: !state.isEdit || (state.matterData.AppCode === MatterAppCode.MA && state.matterData.isLegalAid) ? parseFloat(payload.rate.toString()).toFixed(2) : state.rate,
        unit: (state.matterData.AppCode === MatterAppCode.CR && state.matterData.isLegalAid) ? 1 : state.unit,
        rateError: payload.error,
        loading: false
    });
}

function getExtraRate(state: AddNoteState, payload) {
    return Object.freeze({
        ...state,
        extraRate: parseFloat(payload.rate).toFixed(2)
    });
}

function changeSelectedFolder(currentFolderList: Folder[], newFolderID: number) {
    if (currentFolderList && newFolderID && currentFolderList.find(folder => folder.folderId === newFolderID)) {
        return currentFolderList.map((folder) => {
            if (folder.folderId === newFolderID) {
                return Object.freeze({ ...folder, selected: true });
            } else if (folder.selected) {
                return Object.freeze({ ...folder, selected: false });
            }
            return folder;
        });
    } else if (currentFolderList) {
        return currentFolderList.map((folder, index) => {
            if (index === 0) {
                return Object.freeze({ ...folder, selected: true });
            } else if (folder.selected) {
                return Object.freeze({ ...folder, selected: false });
            }
            return folder;
        });
    } else {
        return currentFolderList;
    }

}
function changeUserGrade(state: AddNoteState, payload) {
    return Object.freeze({ ...state, userGradeList: changeSelectedUserGrade(state.userGradeList, payload.userGrade), isDirty: true });
}

function changeSelectedUserGrade(currentUserGradeList: Grade[], newUserGrade: Grade) {
    if (newUserGrade && currentUserGradeList.find((userGrade) => userGrade.value === newUserGrade.value)) {
        return currentUserGradeList.map((userGrade) => {
            if (userGrade.value === newUserGrade.value) {
                return Object.freeze({ ...userGrade, selected: true });
            } else if (userGrade.selected) {
                return Object.freeze({ ...userGrade, selected: false });
            } else {
                return userGrade;
            }
        });
    } else {
        return currentUserGradeList.map((feeEarner, index) => {
            if (index === 0) {
                return Object.freeze({ ...feeEarner, selected: true });
            } else if (feeEarner.selected) {
                return Object.freeze({ ...feeEarner, selected: false });
            }
            return feeEarner;
        });
    }
}

function addNoteSubmit(state: AddNoteState, payload) {
    return Object.freeze({
        ...state, saveStart: true,
        submitSuccess: payload.submitSuccess, fileExtension: getExtension(state.itemDataList),
        // loading: false
    });
}

function addNoteValidation(state: AddNoteState, payload) {
    return Object.freeze({ ...state, validation: payload.validation, loading: false });
}

function EmailInValidation(state: AddNoteState, payload) {
    return Object.freeze({ ...state, validation: payload.validation, fileData: payload.fileData, loading: false });
}

function addNoteSubmitSuccess(state: AddNoteState, payload) {
    return Object.freeze({ ...state, submitSuccess: payload.submitSuccess, loading: true });

}

function addNoteSaveSuccess(state: AddNoteState, payload) {
    return Object.freeze({ ...state, loading: false, AddNoteSuccessInfo: payload.AddNoteSuccessInfo, saveStart: false });
}

function addNoteSaveFail(state: AddNoteState, payload) {
    return Object.freeze({ ...state, loading: false, AddNoteSuccessInfo: payload.AddNoteSuccessInfo, saveStart: false });
}

function setEditViewData(state: AddNoteState, editViewData: EditViewData) {
    if (state.isEdit) {
        let workTypeList = state ? state.workTypeList : [];
        let phaseList = state ? state.phaseList : [];
        let activitiList = state ? state.activitiList : [];
        let phaseWiseTaskList = state ? state.phaseWiseTaskList : [];
        let classList: ClassObj[] = [];
        let subClassList: AttType[] = [];
        let civilClassList: CivilClassObj[] = [];
        let civilLevelList: CivilDropDownData[] = [];
        let civilCourtList: CivilDropDownData[] = [];

        if (state.workTypeList && state.workTypeList.length > 0 && editViewData && editViewData.classId) {
            workTypeList = setWorkTypeSelection(state.workTypeList, editViewData.classId);
        }
        if (state.phaseList && state.phaseList.length > 0 && editViewData && editViewData.eBillingPhaseId) {
            phaseList = setSelection(state.phaseList, editViewData.eBillingPhaseId);
        }
        if (state.activitiList && state.activitiList.length > 0 && editViewData && editViewData.eBillingActivityId) {
            activitiList = setSelection(state.activitiList, editViewData.eBillingActivityId);
        }
        if (state.phaseWiseTaskList && state.phaseWiseTaskList.length > 0 && editViewData && editViewData.eBillingTaskId) {
            phaseWiseTaskList = setSelection(state.phaseWiseTaskList, editViewData.eBillingTaskId);
        }
        if (state.classType && state.classType.length > 0 && editViewData) {
            classList = changeClassType(state.classType, editViewData.classId);
        }
        if (state.attTypes && state.attTypes.length > 0 && editViewData) {
            subClassList = changeAttType(state.attTypes, editViewData.subClassId);
        }
        if (state.civilClassList && state.civilClassList.length > 0 && editViewData) {
            civilClassList = changeCivilClassType(state.civilClassList, editViewData.classId)
        }
        if (state.civilLevelList && state.civilLevelList.length > 0 && editViewData) {
            civilLevelList = changeCivilLevel(state.civilLevelList, editViewData.subClassId)
        }
        if (state.civilCourtList && state.civilCourtList.length > 0 && editViewData) {
            civilCourtList = changeCivilCourt(state.civilCourtList, editViewData.legalAidCourt)
        }
        return Object.freeze({
            ...state,
            loading: false,
            // set input data
            note: editViewData.note,
            diaryTypeList: changeSelectedDiaryType(state.diaryTypeList, editViewData.recType),
            folderList: changeSelectedFolder(state.folderList, editViewData.columnFolderId),
            columnFolderId: editViewData.columnFolderId,
            template: editViewData.template,
            anchorType: editViewData.anchorType,
            dateDone: editViewData.dateDn,
            putOnBy: editViewData.curUser,
            feeEarnerList: changeSelectedFreeEarnerInEditMode(state.feeEarnerList, editViewData.feeEarner),
            rate: editViewData.recType !== DiaryRecType.FILE_NOTE ? parseFloat(editViewData.itemRate.toString()).toFixed(2) : 0.00,
            unit: editViewData.recType !== DiaryRecType.FILE_NOTE ? parseFloat(editViewData.itemUnits.toString()).toFixed(0) : 0,
            fileNoteValue: isEditTimeRecord(editViewData.recType) ?
                editViewData.itemValue : getFileNoteValue(editViewData.recType.toString()),
            // extraRate: state.diaryTypeId !== 'FN' ? parseFloat(editViewData.itemRate.toString()).toFixed(2) : 0.00,
            // extraUnit: state.diaryTypeId !== 'FN' ? parseFloat(editViewData.itemUnits.toString()).toFixed(0) : 0,
            // extraValue: editViewData.itemValue,
            addNoteHeader: 'Completed [FEE EARNER RATES IN USE]', // ToDo: Need to refactor according to the OneOffice Source
            showTimeAndCost: editViewData.recType === DiaryRecType.FILE_NOTE ? false : true,
            eBillingType: editViewData.eBilling,
            workTypeList: workTypeList,
            activitiList: activitiList,
            phaseList: phaseList,
            phaseWiseTaskList: phaseWiseTaskList,
            telephoneAdvice: editViewData.telephoneAdvice,
            uncharged: editViewData.uncharge,
            classType: classList,
            attTypes: subClassList,
            // isBilled: editViewData.isBilled
            isBilled: false,
            editViewData: editViewData,
            civilClassList: civilClassList,
            civilLevelList: civilLevelList,
            civilCourtList: civilCourtList
        });
    } else {
        return Object.freeze({
            ...state,
            loading: false,
        });
    }
    function setWorkTypeSelection(workTypeList: WorkType[], selectedId: any) {
        return workTypeList.map((item) => {
            if (item.key === selectedId) {
                return Object.freeze({ ...item, selected: true });
            } else if (item.selected) {
                return Object.freeze({ ...item, selected: false });
            }
            return item;
        });
    }
    function setSelection(precedentHSModel: PrecedentHSModel[], selectedId: any) {
        return precedentHSModel.map((item) => {
            if (item.phaseID === selectedId) {
                return Object.freeze({ ...item, selected: true });
            } else if (item.selected) {
                return Object.freeze({ ...item, selected: false });
            }
            return item;
        });
    }

    function isEditTimeRecord(rectype: number): boolean {
        switch (rectype) {
            case DiaryRecType.TIME1: {
                return true;
            }
            case DiaryRecType.TIME2: {
                return true;
            }
            case DiaryRecType.TIME3: {
                return true;
            }
            case DiaryRecType.TIME4: {
                return true;
            }
            case DiaryRecType.TIME5: {
                return true;
            }
            default: {
                return false;
            }
        }
    }

    function getFileNoteValue(diaryTypeId) {
        if (diaryTypeId === DiaryRecType.CALL_IN || diaryTypeId === DiaryRecType.CALL_OUT) {
            return editViewData.rate2;
        } else {
            return editViewData.rate1;
        }
    }
}

function loadingEditViewData(state: AddNoteState) {
    return Object.freeze({
        ...state,
        loading: true
    });
}

function getEditViewDataFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false, });
}

function setAttachmentsData(attachments: Attachments[], isAttachmentUC: boolean) {
    if (attachments) {
        return attachments.map((attachment: Attachments) => {
            const extension = attachment.name.split('.').pop();
            return {
                ...attachment,
                isUncharge: isAttachmentUC,
                isSelected: true,
                fileNote: attachment.name.slice(0, attachment.name.lastIndexOf('.' + extension)),
                extension: extension
            };
        });
    } else {
        return attachments;
    }
}

function createAddNoteHeader(state: AddNoteState) {
    if (!state.isEdit) {
        let headerText = '';
        if (state.matterData.ClientName && state.matterData.AppCode) {
            headerText = 'New Entry: ' + state.matterData.ClientName + ' - ' + state.matterData.AppCode +
                ':' + state.matterData.MatterReferenceNo + ' [FEE EARNER RATES IN USE]';
        } else if (!state.matterData.ClientName && !state.matterData.AppCode) {
            headerText = 'New Entry: ' + state.matterData.MatterReferenceNo + ' [FEE EARNER RATES IN USE]';
        } else if (state.matterData.ClientName) {
            headerText = 'New Entry: ' + state.matterData.ClientName + ':' +
                state.matterData.MatterReferenceNo + ' [FEE EARNER RATES IN USE]';
        } else if (state.matterData.AppCode) {
            headerText = 'New Entry: ' + state.matterData.AppCode + ':'
                + state.matterData.MatterReferenceNo + ' [FEE EARNER RATES IN USE]';
        } else {
            headerText = 'New Entry: ' + state.matterData.MatterReferenceNo + ' [FEE EARNER RATES IN USE]';
        }
        return Object.freeze({ ...state, addNoteHeader: headerText });
    }
    return Object.freeze({ ...state, addNoteHeader: '' });
}

function getExtension(itemDataList: AddNoteItemData[]) {
    if (itemDataList && itemDataList.length > 0) {
        return itemDataList[0].extension;
    }
    return '';
}

function isShowHideTimeandCost(selectedDiaryId: DiaryRecType) {
    return selectedDiaryId !== DiaryRecType.FILE_NOTE;
}

function getkAddNoteAccessData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, isTimeRecordingEnabled: null });
}
function getkAddNoteAccessSuccessData(state: AddNoteState, payload): Partial<AddNoteState> {
    return Object.freeze({ ...state, isTimeRecordingEnabled: payload.isAccess });
}
function getkAddNoteAccessFailData(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, isTimeRecordingEnabled: false });
}

function getDataLogicForNote(itemList: AddNoteItemData[], currentNote: string) {

    if (itemList && itemList.length > 0) {
        return currentNote || itemList[0].note;
    }

    return currentNote;
}

// eBilling Comment
function getWorkTypeList(state: AddNoteState): Partial<AddNoteState> {
    return { ...state, loading: true };
}
function getWorkTypeListSuccess(state: AddNoteState, workTypeList: WorkType[]): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false, workTypeList: workTypeList });
}
function getWorkTypeListFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false });
}
function changeWorkTypeList(state: AddNoteState, payload): Partial<AddNoteState> {
    return { ...state, workTypeList: changeWorkTypeSelection(state.workTypeList, payload), isDirty: true };
}
function getPhaseList(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: true });
}
function getPhaseListSuccess(state: AddNoteState, phaseList: PrecedentHSModel[]): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false, phaseList: phaseList });
}
function getPhaseListFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false });
}
function changePhaseList(state: AddNoteState, payload: PrecedentHSModel): Partial<AddNoteState> {
    return {
        ...state,
        phaseList: changePrecedentHSSelection(state.phaseList, payload),
        phaseWiseTaskList: state.phaseWiseTaskList.map(item => ({ ...item, selected: false })),
        isDirty: true
    };
}
function getActivitiList(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: true });
}
function getActivitiListSuccess(state: AddNoteState, activitiList: PrecedentHSModel[]): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false, activitiList: activitiList });
}
function getActivitiListFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false });
}
function changeActivitiList(state: AddNoteState, payload: PrecedentHSModel): Partial<AddNoteState> {
    return { ...state, activitiList: changePrecedentHSSelection(state.activitiList, payload), isDirty: true };
}
function getTaskList(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: true });
}
function getTaskListSuccess(state: AddNoteState, taskList: PrecedentHSModel[]): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false, phaseWiseTaskList: taskList });
}
function getTaskListFail(state: AddNoteState): Partial<AddNoteState> {
    return Object.freeze({ ...state, loading: false });
}
function changeTaskList(state: AddNoteState, selectedtask: PrecedentHSModel): Partial<AddNoteState> {
    return {
        ...state,
        phaseWiseTaskList: changePrecedentHSSelection(state.phaseWiseTaskList, selectedtask),
        phaseList: state.phaseList.map(item => ({ ...item, selected: item.phaseID === selectedtask.parentId })),
        isDirty: true
    };
}
function changePrecedentHSSelection(PrecedentHSList: PrecedentHSModel[], selectedDetails: PrecedentHSModel) {
    return PrecedentHSList.map((item) => {
        if (item.phaseID === selectedDetails.phaseID) {
            return Object.freeze({ ...item, selected: true });
        } else if (item.selected) {
            return Object.freeze({ ...item, selected: false });
        }
        return item;
    });
}
function changeWorkTypeSelection(PrecedentHSList: WorkType[], selectedDetails: WorkType) {
    return PrecedentHSList.map((item) => {
        if (item.key === selectedDetails.key) {
            return Object.freeze({ ...item, selected: true });
        } else if (item.selected) {
            return Object.freeze({ ...item, selected: false });
        }
        return item;
    });
}

export const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (state) => state.views[token]);
export const getDiaryTypesByAppId = (appId: number) => createSelector(getState, (state) => state.diaryTypesByAppId[appId]);
export const getFolderListByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.folderList : null);
export const getAddNoteDefaultFolder = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.defultfolder : null);
export const getUserGradeByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.userGradeList : null);


export const getDiaryTypeListByToken = (token) =>
    createSelector(getViewByToken(token), (state) => {
        if (state && state.diaryTypeList) {
            const diaryTypeList = (state.matterData.isLegalAid && state.matterData.AppCode === MatterAppCode.CR) ? state.diaryTypeList
                .filter((item) => !(item.value === DiaryRecType.TIME1 || item.value === DiaryRecType.TIME2 ||
                    item.value === DiaryRecType.TIME3 || item.value === DiaryRecType.TIME4 || item.value === DiaryRecType.TIME5)) :
                state.diaryTypeList;
            if (state.matterData.isProspectMatter) {
                return diaryTypeList.filter((item) => item.value === DiaryRecType.FILE_NOTE);
            } else if (state.fileExtension &&
                !(state.fileExtension.toLowerCase() === 'msg' || state.fileExtension.toLowerCase() === 'eml')) {
                return diaryTypeList
                    .filter((item) => item.value !== DiaryRecType.EMAIL_IN && item.value !== DiaryRecType.EMAIL_OUT);
            } else if (state.addNoteItemsType === AddNoteItemsType.MailItems) {
                return diaryTypeList
                    .filter((item) => item.value === DiaryRecType.EMAIL_IN || item.value === DiaryRecType.EMAIL_OUT);
            }
            return diaryTypeList;
        }

        return state ? state.diaryTypeList : null;

    });

export const getActionTypeListByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.actionTypeList : null);
export const getFeeEarnerListByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.feeEarnerList : null);
export const getSendForSignatureToList = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.sendForSignatureToList : null);
export const getAppIdByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state && state.matterData ? state.matterData.AppID : null);
export const getMatterFeeEarnerByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state && state.matterData
        ? state.matterData.FeeEarner : null);
export const getAddNoteHeaderByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.addNoteHeader : null);
export const getIsFolderLoadedByToken = (token) =>
    createSelector(getFolderListByToken(token), (folders) => folders && folders.length > 0);
export const getNoteTextByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.note : null);
export const getAddNoteItemDataListByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.itemDataList : null);
export const getAddNotePasswordByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.password : null);
export const getAddNoteDateDoneByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.dateDone : null);
export const getAddNoteUnchargedStateByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.uncharged : null);
export const getAddNoteRateByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.rate : null);
export const getFileNoteValueByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.fileNoteValue : null);
export const getFileNoteUnitByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.unit : null);
export const getAddNoteSelectedFeeEarnerByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state && state.feeEarnerList
        ? state.feeEarnerList.find((feeEarner) =>
            feeEarner.selected) : null);
export const getAddnoteRateCategoryIdByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.matRatCategory : null);
export const getAddNoteExtraRateByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.extraRate : null);
export const getAddNoteExtraUnitByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.extraUnit : null);
export const getAddNoteExtraValueByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.extraValue : null);
export const getAddNoteExtraTimeTypeByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.extraTimeType : null);
export const getAddNoteSelecteExtraTimeType = (token) =>
    createSelector(getViewByToken(token), (state) => state && state.extraTimeType
        ? state.extraTimeType.find((extraTimeType) =>
            extraTimeType.selected) : null);
export const getAddNoteMatterDataByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.matterData : null);
export const getAddNoteIsTimeRecordEnableByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.isTimeRecordingEnabled : null);
export const getAddNoteMatterRefByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state && state.matterData ? state.matterData ?
        state.matterData.MatterReferenceNo : null : null);
export const getAddNoteValidationByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.validation : null);
export const getIsInitLoadingByToken = (token) => createSelector(getViewByToken(token), (state) => {

    return !!(!state ||
        state.actionTypeLoading || state.defultfolderLoading ||
        state.diaryTypeLoading || state.extraTimeTypeLoading ||
        state.feeEarnerLoading || state.folderLoading ||
        state.loading || state.matterDataLoading
    );
});

export const getItemDataListLoadingByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.itemDataListLoading : null);

export const getLodingStatusByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.loading : null);
export const getAddNoteFileExtensionByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.fileExtension : null);
export const getIsDisableFileUpload = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.disableFileUpload : null);
export const getIsTimeAndCostShow = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.showTimeAndCost : null);
export const getAddNoteSaveSuccess = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.AddNoteSuccessInfo : null);
export const getAddNoteIsDiaryTypeDisable = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.isDisableDiaryType : null);
export const getAddNoteIsEditMode = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.isEdit : null);
export const getAddNoteSendForSignature = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.sendForSignature : null);
export const getAddNoteUIdByToken = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.uid : null);
export const getAddNoteIsDirty = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.isDirty : null);
export const getDiaryIds = (token) =>
    createSelector(getViewByToken(token), (state) => state ? state.diaryIds : []);
export const getEBillingTypeByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.eBillingType : null);
export const getLoadWorkTypeListByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.workTypeList : null);
export const getPhaseListByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.phaseList : null);
export const getActivitiListByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.activitiList : null);
export const getTaskListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (!state) {
            return null;
        }
        const phase = state.phaseList ? state.phaseList.find(item => item.selected) : null;
        if (phase && state.phaseWiseTaskList) {
            return state.phaseWiseTaskList.filter(item => item.parentId === phase.phaseID);
        }
        return state.phaseWiseTaskList;
    });

///////////
export const getTimeRecordType = (token) =>
    createSelector(getViewByToken(token), (state) =>
        state && state.matterData ? checkTimeRecordType(state.matterData.AppCode,
            state.matterData.eBilling, state.matterData.isLegalAid) : []);
export const getClassType = (token) => createSelector(getViewByToken(token), (state) =>
    state && state.classType ? state.classType : []);
export const getAttTypesList = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.attTypes : []);
export const getCrimeClassIdentityViewModel = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state && state.matterData) {
            return {
                fileId: state.matterData.FileID,
                branchId: state.matterData.BranchID,
                classId: state.classType && state.classType.find(c => c.selected) ? state.classType.find(c => c.selected).rectype :
                    state.editViewData ? state.editViewData.classId : 0,
            };
        }
        return null;
    });
export const getIsSection51 = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.section51 : false);
export const getIsBulkEntry = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.bulkEntry : false);
export const getNoOfEntry = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.noOfEntry : 1);
export const getTelephoneAdvice = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.telephoneAdvice : false);
export const getIsBilled = (token) => createSelector(getViewByToken(token), state => state ? state.isBilled : false);
export const getRetrySignature = (token) => createSelector(getViewByToken(token), state =>
    state ? state.retrySignature : false);
export const getViewingInlineAttachement = (token) => createSelector(getViewByToken(token), state =>
    state ? state.viewingInlineAttachement : null);
export const getCivilClassList = (token) => createSelector(getViewByToken(token), state =>
    state ? state.civilClassList : []);
export const getCivilLevelList = (token) => createSelector(getViewByToken(token), state =>
    state ? state.civilLevelList : []);
export const getCivilCourtList = (token) => createSelector(getViewByToken(token), state =>
    state ? state.civilCourtList : []);



