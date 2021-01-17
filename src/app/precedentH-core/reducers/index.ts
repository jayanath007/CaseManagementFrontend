import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as PrecedentH from './precedentH';

export interface State {
    PrecedentH: PrecedentH.State;
}
export const reducers = {
    PrecedentH: PrecedentH.reducer,
};

export const getRootState = createFeatureSelector<State>('dpsPrecedentH');
export const getPageState = createSelector(getRootState, (state) => state.PrecedentH);
// export const getActiveToken = createSelector(getPrecedentSState, PrecedentS.getViewByToken);

export const getPrecedentHSListByToken = (token) => createSelector(getPageState, PrecedentH.getPrecedentHSListByToken(token));
export const getloadingstateByToken = (token) => createSelector(getPageState, PrecedentH.getloadingstateByToken(token));
export const getEstimatedDataByToken = (token) => createSelector(getPageState, PrecedentH.getEstimatedDataByToken(token));
export const getEBillingTypeByToken = (token) => createSelector(getPageState, PrecedentH.getEBillingTypeByToken(token));
export const getMatterInfoByToken = (token) => createSelector(getPageState, PrecedentH.getMatterDataByToken(token));
export const getActualAndEstimatedTotalByToken = (token) =>
    createSelector(getPageState, PrecedentH.getActualAndEstimatedTotalByToken(token));
export const getIsDirtyByToken = (token) => createSelector(getPageState, PrecedentH.getIsDirtyByToken(token));
export const getSaveStatusByToken = (token) => createSelector(getPageState, PrecedentH.getSaveStatusByToken(token));
export const getSelectedRowByToken = (token) => createSelector(getPageState, PrecedentH.getSelectedRowByToken(token));
export const getXMLExportSuccessByToken = (token) => createSelector(getPageState, PrecedentH.getXMLExportSuccessByToken(token));
export const getWorkTypeListByToken = (token) => createSelector(getPageState, PrecedentH.getWorkTypeListByToken(token));
export const getEstimatedCostGridDataByToken = (token) => createSelector(getPageState, PrecedentH.getEstimatedCostGridDataByToken(token));
export const getGrandTotalsByToken = (token) => createSelector(getPageState, PrecedentH.getGrandTotalsByToken(token));
export const getSelectedWorkTypeDataByToken = (token) => createSelector(getPageState, PrecedentH.getSelectedWorkTypeDataByToken(token));
export const getPresidentHSummaryDataByToken = (token) => createSelector(getPageState, PrecedentH.getPresidentHSummaryDataByToken(token));
export const getSelectedEstmateValueByToken = (token) => createSelector(getPageState, PrecedentH.getSelectedEstmateValueByToken(token));
export const getSelectedActualValueByToken = (token) => createSelector(getPageState, PrecedentH.getSelectedActualValueByToken(token));
export const getFeeEarnerTimeRatesSaveByToken = (token) => createSelector(getPageState, PrecedentH.getFeeEarnerTimeRatesSaveByToken(token));
export const getRateTableNameByToken = (token) => createSelector(getPageState, PrecedentH.getRateTableNameByToken(token));
export const getEstimateValueChangesByToken = (token) => createSelector(getPageState, PrecedentH.getEstimateValueChangesByToken(token));
export const getSelectedWorkTypeIdByToken = (token) => createSelector(getPageState, PrecedentH.getSelectedWorkTypeIdByToken(token));
export const getTotalProfitCostByToken = (token) => createSelector(getPageState, PrecedentH.getTotalProfitCostByToken(token));
