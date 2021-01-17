import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as clientCreation from './client-creation';

export interface State {
    clientCreation: clientCreation.State;
}
export const reducers = {
    clientCreation: clientCreation.reducer,
};

export const getClientCreationRootState = createFeatureSelector<State>('dpsClientCreationCore');

export const getClientCreationState = createSelector(getClientCreationRootState, (state) => state.clientCreation);

export const getInitDataModel = createSelector(getClientCreationState, clientCreation.getInitDataModel);

export const getIsLoading = (token) => createSelector(getClientCreationState, clientCreation.getIsLoading(token));

export const getIsDocumentUploading = (token) => createSelector(getClientCreationState, clientCreation.getIsDocumentUploading(token));

export const getClientModel = (token) => createSelector(getClientCreationState, clientCreation.getClientModel(token));

export const getClientSeatchList = (token) => createSelector(getClientCreationState, clientCreation.getClientSeatchList(token));

export const getClientIndex = (token) => createSelector(getClientCreationState, clientCreation.getClientIndex(token));

export const getIsModelDirtyByToken = (token) => createSelector(getClientCreationState, clientCreation.getIsModelDirtyByToken(token));

export const getShowConflictSearch = (token) => createSelector(getClientCreationState, clientCreation.getShowConflictSearch(token));

export const getModeByToken = (token) => createSelector(getClientCreationState, clientCreation.getModeByToken(token));

export const getTypeChangeControllers = (token) => createSelector(getClientCreationState,
    clientCreation.getTypeChangeControllerListByToken(token));

export const getClientNotesToken = (token) => createSelector(getClientCreationState, clientCreation.getClientNotesToken(token));

export const getDeleteNoteIdsToken = (token) => createSelector(getClientCreationState, clientCreation.getDeleteNoteIdsToken(token));

export const getPopupClosedToken = (token) => createSelector(getClientCreationState, clientCreation.getPopupClosedToken(token));

export const getSelectedMatterIdByToken
    = (token) => createSelector(getClientCreationState, clientCreation.getSelectedMatterIdByToken(token));
export const getIsCrimeTabVisibilityToken = (token) =>
    createSelector(getClientCreationState, clientCreation.getIsCrimeTabVisibilityToken(token));
export const getIsProofOfIDUploadToken = (token) => createSelector(getClientCreationState,
    clientCreation.getIsProofOfIDUploadToken(token));
export const getIsProofOfAddressUploadToken = (token) => createSelector(getClientCreationState,
    clientCreation.getIsProofOfAddressUploadToken(token));
export const getIsCompanyProof1UploadToken = (token) => createSelector(getClientCreationState,
    clientCreation.getIsCompanyProof1UploadToken(token));
export const getIsCompanyProof2UploadToken = (token) => createSelector(getClientCreationState,
    clientCreation.getIsCompanyProof2UploadToken(token));
export const getRiskAssessmentDataByToken = (token) => createSelector(getClientCreationState,
    clientCreation.getRiskAssessmentDataByToken(token));
export const getMatterPaginationDef = (token) => createSelector(getClientCreationState,
    clientCreation.getMatterPaginationDef(token));
export const getClientMattersTotal = (token) => createSelector(getClientCreationState,
    clientCreation.getClientMattersTotal(token));
export const getCaseFileIdentity = createSelector(getClientCreationState, clientCreation.getCaseFileIdentity);

