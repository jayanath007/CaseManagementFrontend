import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as chaser from './chaser';

export interface State {
    chaser: chaser.State;
}
export const reducers = {
    chaser: chaser.reducer,
};

export const getChaserRootState = createFeatureSelector<State>('dpsChaserCore');

export const getChaserState = createSelector(getChaserRootState, (state) => state.chaser);
export const getChaserFileNoByToken = (token) => createSelector(getChaserState, chaser.getFileNoByToken(token));
export const getChaserFeeEarnerListNoByToken = (token) => createSelector(getChaserState, chaser.getFeeEarnerListByToken(token));
export const getChaserFolderListByToken = (token) => createSelector(getChaserState, chaser.getFolderListByToken(token));
export const getChaserTimeTypeListByToken = (token) => createSelector(getChaserState, chaser.getTimeTypeListByToken(token));

export const getChaserSelectedFeeEarnerByToken = (token) => createSelector(getChaserState, chaser.getSelectedFeeEarnerByToken(token));
export const getChaserSelectedFolderByToken = (token) => createSelector(getChaserState, chaser.getSelectedFolderByToken(token));
export const getChaserSelectedTimeTypeByToken = (token) => createSelector(getChaserState, chaser.getSelectedTimeTypeByToken(token));

export const getChaserAppIdByToken = (token) => createSelector(getChaserState, chaser.getAppIdByToken(token));
export const getChaserMatterInfoByToken = (token) => createSelector(getChaserState, chaser.getMatterInfoByToken(token));

export const getChaserDefaultFeeEarnerByToken = (token) => createSelector(getChaserState, chaser.getDefaultFeeEarnerByToken(token));
export const getChaserDefaultFolderByToken = (token) => createSelector(getChaserState, chaser.getDefaultFolderByToken(token));
export const getChaserDefaultUnitByToken = (token) => createSelector(getChaserState, chaser.getDefaultUnitByToken(token));
export const getChaserOpenFileByToken = (token) => createSelector(getChaserState, chaser.getOpenFileByToken(token));
export const getChaserFileNoteByToken = (token) => createSelector(getChaserState, chaser.getFileNoteByToken(token));
export const getChaserErrorByToken = (token) => createSelector(getChaserState, chaser.getChaserErrorByToken(token));
export const getChaserOutDataByToken = (token) => createSelector(getChaserState, chaser.getChaserOutDataByToken(token));
export const getChaserSuccessByToken = (token) => createSelector(getChaserState, chaser.getChaserSendSuccessByToken(token));
export const getChaserCommonLoading = (token) => createSelector(getChaserState, chaser.getCommonLoading(token));
export const getChaserTypeDisableValueByToken = (token) => createSelector(getChaserState, chaser.getTypeDisableValueByToken(token));
export const getSentItemIdsByToken = (token) => createSelector(getChaserState, chaser.getSentItemIdsByToken(token));

// Lakmal = LS
export const getChaserRecepintListByToken = (token) => createSelector(getChaserState, chaser.getChaserRecepintList(token));
export const getUnLinkedEmailByToken = (token) => createSelector(getChaserState, chaser.getUnLinkedEmail(token));
export const getTimeRecordingEnabledByToken = (token) => createSelector(getChaserState, chaser.getTimeRecordingEnabledByToken(token));

// ebilling comment
export const getEBillingTypeByToken = (token) => createSelector(getChaserState, chaser.getEBillingTypeByToken(token));
export const getLoadWorkTypeListByToken = (token) => createSelector(getChaserState, chaser.getLoadWorkTypeListByToken(token));
export const getPhaseListByToken = (token) => createSelector(getChaserState, chaser.getPhaseListByToken(token));
export const getActivitiListByToken = (token) => createSelector(getChaserState, chaser.getActivitiListByToken(token));
export const getTaskListByToken = (token) => createSelector(getChaserState, chaser.getTaskListByToken(token));


// export const getTimeRecordType = (token) => createSelector(getChaserState, chaser.getTimeRecordType(token));
export const getClassTypeByToken = (token) => createSelector(getChaserState, chaser.getClassType(token));
export const getCrimeClassIdentityViewModel = (token) => createSelector(getChaserState, chaser.getCrimeClassIdentityViewModel(token));
export const getAttTypeListByToken = (token) => createSelector(getChaserState, chaser.getAttTypesList(token));
export const getIsSection51ByToken = (token) => createSelector(getChaserState, chaser.getIsSection51(token));
export const getIsBulkEntryByToken = (token) => createSelector(getChaserState, chaser.getIsBulkEntry(token));
export const getNoOfEntryByToken = (token) => createSelector(getChaserState, chaser.getNoOfEntry(token));
export const getUnchargedStateByToken = (token) => createSelector(getChaserState, chaser.getUnchargedStateByToken(token));
export const getPrecedentUnit = (token) => createSelector(getChaserState, chaser.getPrecedentUnit(token));
export const getPrecedentRate = (token) => createSelector(getChaserState, chaser.getPrecedentRate(token));
export const getPrecedentValueTotal = (token) => createSelector(getChaserState, chaser.getPrecedentValueTotal(token));
// export const getChaserEmailLoadingByToken = (token) => createSelector(getChaserState, chaser.getChaserEmailLoadingByToken(token));
export const getSubjectPrefixByToken = (token) => createSelector(getChaserState, chaser.getSubjectPrefixByToken(token));
export const getMailSubjectToken = (token) => createSelector(getChaserState, chaser.getMailSubjectToken(token));
export const getSubjectPrefixLoadingByToken = (token) => createSelector(getChaserState, chaser.getSubjectPrefixLoadingByToken(token));

// civil 
export const getCivilClassList = (token) => createSelector(getChaserState, chaser.getCivilClassList(token));
export const getCivilLevelList = (token) => createSelector(getChaserState, chaser.getCivilLevelList(token));


export const getChaserEmailLoadingByToken = (token) => createSelector(getChaserState, chaser.getChaserEmailLoadingByToken(token));
export const getLoadingMatterListByToken = (token) => createSelector(getChaserState, chaser.getLoadingMatterListByToken(token));


