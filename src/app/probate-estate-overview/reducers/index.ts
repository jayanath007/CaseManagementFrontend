import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as EstateOverview from './estate-overview';

export interface State {
    EstateOverview: EstateOverview.State;
}
export const reducers = {
    EstateOverview: EstateOverview.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsProbateEstateOverview');
export const getEstateOverviewRootState = createSelector(getRootState, (state) => state.EstateOverview);
export const getPELoadingByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getPELoadingByToken(token));
export const getPEIsDirtyByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getPEIsDirtyByToken(token));
export const getMatterByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getMatterByToken(token));
export const getformControllersArray = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getformControllersArray(token));
export const getformControllersArrayByCategory = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getformControllersArrayByCategory(token));
export const getFormTypeByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getFormTypeByToken(token));
export const getModeByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getModeByToken(token));
export const getPECategoryListByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getPECategoryListByToken(token));
export const getPESelectedCategoryByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getPESelectedCategoryByToken(token));
export const getEstateOverviewModelByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getEstateOverviewModelByToken(token));
export const getEstateOverviewGridDataModelByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getEstateOverviewGridDataModelByToken(token));
export const getEstateOverviewContactDetailsByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getEstateOverviewContactDetailsByToken(token));
export const getSelectedGridRowByToken = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getSelectedGridRowByToken(token));
export const getLiabilityAssetForDropDown = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getLiabilityAssetForDropDown(token));
export const getExemptionAssetForDropDown = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getExemptionAssetForDropDown(token));
export const getDealtBySellText = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getDealtBySellText(token));
export const getLegacyPercentage = (token) => createSelector(getEstateOverviewRootState,
    EstateOverview.getLegacyPercentage(token));

