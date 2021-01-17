import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as PageSetup from './page-setup';

export interface State {
    PageSetup: PageSetup.State;
}
export const reducers = {
    PageSetup: PageSetup.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsPageSetup');
export const getPageSetupRootState = createSelector(getRootState, (state) => state.PageSetup);

export const getPageSetupLoadingByToken = (token) => createSelector(getPageSetupRootState,
    PageSetup.getPageSetupLoadingByToken(token));
export const getPageSetupDataByToken = (token) => createSelector(getPageSetupRootState,
    PageSetup.getPageSetupDataByToken(token));
export const getChangePageSetupValuesByToken = (token) => createSelector(getPageSetupRootState,
    PageSetup.getChangePageSetupValuesByToken(token));
export const getPopupCloseByToken = (token) => createSelector(getPageSetupRootState,
    PageSetup.getPopupCloseByToken(token));
export const getfirstPageByToken = (token) => createSelector(getPageSetupRootState,
    PageSetup.getfirstPageByToken(token));
export const getDifferentPageHeaderFooterByToken = (token) => createSelector(getPageSetupRootState,
    PageSetup.getDifferentPageHeaderFooterByToken(token));

