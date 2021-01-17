
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as addNote from './add-note';

export interface State {
    addNote: addNote.State;
}
export const reducers = {
    addNote: addNote.reducer,
};
export const getAddNoteRootState = createFeatureSelector<State>('dpsAddNoteCore');
export const getAddNoteState = createSelector(getAddNoteRootState, (state => state.addNote));
export const getAddNoteStateByToken = (token) => createSelector(getAddNoteState, addNote.getViewByToken(token));
export const getDiaryTypesByAppId = (appId: number) => createSelector(getAddNoteState, addNote.getDiaryTypesByAppId(appId));
export const getAddNoteFolderListByToke = (token) => createSelector(getAddNoteState, addNote.getFolderListByToken(token));
export const getAddNoteDefaultFolderByToke = (token) => createSelector(getAddNoteState, addNote.getAddNoteDefaultFolder(token));
// export const getAddNoteUserGroupListByToken = (token) => createSelector(getAddNoteState, addNote.getUserGroupListByToken(token));
export const getAddNoteDiaryTypeListByToken = (token) => createSelector(getAddNoteState, addNote.getDiaryTypeListByToken(token));
export const getAddNoteActionTypeListByToken = (token) => createSelector(getAddNoteState, addNote.getActionTypeListByToken(token));
export const getAddNoteFeeEarnerListByToken = (token) => createSelector(getAddNoteState, addNote.getFeeEarnerListByToken(token));
export const getSendForSignatureToList = (token) => createSelector(getAddNoteState, addNote.getSendForSignatureToList(token));
export const getAddNoteAppIdByToken = (token) => createSelector(getAddNoteState, addNote.getAppIdByToken(token));
export const getAddNoteMatterFeeEarnerByToken = (token) => createSelector(getAddNoteState, addNote.getMatterFeeEarnerByToken(token));
export const getAddNoteUserGradeByToken = (token) => createSelector(getAddNoteState, addNote.getUserGradeByToken(token));
export const getIsFolderLoadedByToken = (token) => createSelector(getAddNoteState, addNote.getIsFolderLoadedByToken(token));


export const getAddNoteHeaderByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteHeaderByToken(token));
export const getNoteTextByToken = (token) => createSelector(getAddNoteState, addNote.getNoteTextByToken(token));
export const getAddNoteItemDataListByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteItemDataListByToken(token));
export const getAddNotePasswordByToken = (token) => createSelector(getAddNoteState, addNote.getAddNotePasswordByToken(token));
export const getAddNoteDateDoneByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteDateDoneByToken(token));
export const getAddNoteUnchargedStateByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteUnchargedStateByToken(token));
export const getAddNoteRateByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteRateByToken(token));
export const getFileNoteValueByToken = (token) => createSelector(getAddNoteState, addNote.getFileNoteValueByToken(token));
export const getFileNoteUnitByToken = (token) => createSelector(getAddNoteState, addNote.getFileNoteUnitByToken(token));
export const getAddNoteSelectedFeeEarnerByToken = (token) =>
    createSelector(getAddNoteState, addNote.getAddNoteSelectedFeeEarnerByToken(token));
export const getAddnoteRateCategoryIdByToken = (token) => createSelector(getAddNoteState, addNote.getAddnoteRateCategoryIdByToken(token));
export const getAddNoteExtraRateByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteExtraRateByToken(token));
export const getAddNoteExtraUnitByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteExtraUnitByToken(token));
export const getAddNoteExtraValueByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteExtraValueByToken(token));
export const getAddNoteExtraTimeTypeByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteExtraTimeTypeByToken(token));
export const getAddNoteSelecteExtraTimeType = (token) => createSelector(getAddNoteState, addNote.getAddNoteSelecteExtraTimeType(token));
export const getAddNoteMatterDataByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteMatterDataByToken(token));
//  export const getAddNoteSubmitDataByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteSubmitDataByToken(token));
export const getAddNoteValidationByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteValidationByToken(token));

export const getAddNoteIsInitLoadingByToken = (token) => createSelector(getAddNoteState, addNote.getIsInitLoadingByToken(token));
export const getItemDataListLoadingByToken = (token) => createSelector(getAddNoteState, addNote.getItemDataListLoadingByToken(token));
export const getAddNoteLodingStatusByToken = (token) => createSelector(getAddNoteState, addNote.getLodingStatusByToken(token));
export const getAddNoteFileExtensionByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteFileExtensionByToken(token));
export const getIsDisableFileUploadByToken = (token) => createSelector(getAddNoteState, addNote.getIsDisableFileUpload(token));
export const getIsTimeAndCostShow = (token) => createSelector(getAddNoteState, addNote.getIsTimeAndCostShow(token));
export const getAddNoteSaveSuccess = (token) => createSelector(getAddNoteState, addNote.getAddNoteSaveSuccess(token));
export const getAddNoteIsDiaryTypeDisable = (token) => createSelector(getAddNoteState, addNote.getAddNoteIsDiaryTypeDisable(token));
export const getAddNoteMatterRefByToken = (token) => createSelector(getAddNoteState, addNote.getAddNoteMatterRefByToken(token));
export const getAddNoteIsTimeRecordEnableByToken = (token) =>
    createSelector(getAddNoteState, addNote.getAddNoteIsTimeRecordEnableByToken(token));
export const getAddNoteIsEditMode = (token) =>
    createSelector(getAddNoteState, addNote.getAddNoteIsEditMode(token));
export const getAddNoteSendForSignature = (token) =>
    createSelector(getAddNoteState, addNote.getAddNoteSendForSignature(token));
export const getAddNoteUIdByToken = (token) =>
    createSelector(getAddNoteState, addNote.getAddNoteUIdByToken(token));
export const getAddNoteIsDirty = (token) => createSelector(getAddNoteState, addNote.getAddNoteIsDirty(token));
export const getDiaryIds = (token) => createSelector(getAddNoteState, addNote.getDiaryIds(token));

// ebilling comment
export const getEBillingTypeByToken = (token) => createSelector(getAddNoteState, addNote.getEBillingTypeByToken(token));
export const getLoadWorkTypeListByToken = (token) => createSelector(getAddNoteState, addNote.getLoadWorkTypeListByToken(token));
export const getPhaseListByToken = (token) => createSelector(getAddNoteState, addNote.getPhaseListByToken(token));
export const getActivitiListByToken = (token) => createSelector(getAddNoteState, addNote.getActivitiListByToken(token));
export const getTaskListByToken = (token) => createSelector(getAddNoteState, addNote.getTaskListByToken(token));

export const getClassTypeByToken = (token) => createSelector(getAddNoteState, addNote.getClassType(token));

export const getCrimeClassIdentityViewModel = (token) => createSelector(getAddNoteState, addNote.getCrimeClassIdentityViewModel(token));
export const getAttTypeListByToken = (token) => createSelector(getAddNoteState, addNote.getAttTypesList(token));

export const getIsSection51ByToken = (token) => createSelector(getAddNoteState, addNote.getIsSection51(token));
export const getIsBulkEntryByToken = (token) => createSelector(getAddNoteState, addNote.getIsBulkEntry(token));
export const getNoOfEntryByToken = (token) => createSelector(getAddNoteState, addNote.getNoOfEntry(token));
export const getTelephoneAdviceByToken = (token) => createSelector(getAddNoteState, addNote.getTelephoneAdvice(token));
export const getDiaryIsBilled = (token) => createSelector(getAddNoteState, addNote.getIsBilled(token));
export const getRetrySignature = (token) => createSelector(getAddNoteState, addNote.getRetrySignature(token));
export const getViewingInlineAttachement = (token) => createSelector(getAddNoteState, addNote.getViewingInlineAttachement(token));
export const getCivilClassList = (token) => createSelector(getAddNoteState, addNote.getCivilClassList(token));
export const getCivilLevelList = (token) => createSelector(getAddNoteState, addNote.getCivilLevelList(token));
export const getCivilCourtList = (token) => createSelector(getAddNoteState, addNote.getCivilCourtList(token));
