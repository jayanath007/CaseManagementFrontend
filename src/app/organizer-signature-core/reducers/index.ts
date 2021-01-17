
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as organizerSignature from './organizer-signature';

export interface State {
    organizerSignature: organizerSignature.State;
}
export const reducers = {
    organizerSignature: organizerSignature.reducer,
};

export const getOrganizerSignatureRootState = createFeatureSelector<State>('dpsOrganizerSignatureCore');
export const getOrganizerSignatureState = createSelector(getOrganizerSignatureRootState, (state => state.organizerSignature));
export const getOrganizerSignatureStateByToken = (token) =>
    createSelector(getOrganizerSignatureState, organizerSignature.getViewByToken(token));
export const getOrganizerSignatureLogoByToken = (token) =>
    createSelector(getOrganizerSignatureState, organizerSignature.getLogoByToken(token));

