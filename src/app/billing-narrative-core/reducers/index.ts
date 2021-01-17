import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as BillingNarrative from './billing-narrative';

export interface State {
    BillingNarrative: BillingNarrative.State;
}
export const reducers = {
    BillingNarrative: BillingNarrative.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsBillingNarrativeToken');
export const getPageState = createSelector(getRootState, (state) => state.BillingNarrative);
export const getStateIsLoadingByToken = (token: string) =>
    createSelector(getPageState, BillingNarrative.getStateIsLoadingByToken(token));
export const getNarrativeDataModelByToken = (token: string) =>
    createSelector(getPageState, BillingNarrative.getNarrativeDataModelByToken(token));
export const getNarrativeGroupsItemsByToken = (token: string) =>
    createSelector(getPageState, BillingNarrative.getNarrativeGroupsItemsByToken(token));
    export const getNarrativeInfoByToken = (token: string) =>
    createSelector(getPageState, BillingNarrative.getNarrativeInfoByToken(token));




// export const getActiveToken = createSelector(getPrecedentSState, PrecedentS.getViewByToken);

// export const getMenuMatterInfoByToken = (token) => createSelector(getPageState, PrecedentS.getMatterInfoByToken(token));
// export const getMenuTreeViewByToken = (token) => createSelector(getPageState, PrecedentS.getTreeViewByToken(token));
// export const getMenuSelectedChildListByToken = (token) => createSelector(getPageState, PrecedentS.getSelectedChildListByToken(token));
