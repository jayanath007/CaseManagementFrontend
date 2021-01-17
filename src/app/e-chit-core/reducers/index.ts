import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as EChit from './e-chit';

export interface State {
    EChit: EChit.State;
}
export const reducers = {
    EChit: EChit.reducer,
};

export const getEChitRootState = createFeatureSelector<State>('dpsEChitCore');
export const getEChitState = createSelector(getEChitRootState, (state => state.EChit));
export const getEChitStateByToken = (token) => createSelector(getEChitState, EChit.getViewByToken(token));
export const getFormDataModelByToken = (token) => createSelector(getEChitState, EChit.getFormDataModelByToken(token));


export const getLoadingToken = (token) => createSelector(getEChitState, EChit.getLoadingToken(token));
export const getModelByToken = (token) => createSelector(getEChitState, EChit.getModelByToken(token));


export const getSupplierDocEnablesByToken = (token) => createSelector(getEChitState, EChit.getSupplierDocEnablesByToken(token));

export const getClientDefaultsByToken = (token) => createSelector(getEChitState, EChit.getClientDefaultsByToken(token));

export const getClearanceTypeListByToken = (token) => createSelector(getEChitState, EChit.getClearanceTypeListByToken(token));
export const getReferencesListByToken = (token) => createSelector(getEChitState, EChit.getReferencesListByToken(token));
export const getVatCodeListByToken = (token) => createSelector(getEChitState, EChit.getVatCodeListByToken(token));
export const getBranchListByToken = (token) => createSelector(getEChitState, EChit.getBranchListByToken(token));
export const getReasonListByToken = (token) => createSelector(getEChitState, EChit.getReasonListByToken(token));
export const getPayeeListListByToken = (token) => createSelector(getEChitState, EChit.getPayeeListByToken(token));
export const getPayerListByToken = (token) => createSelector(getEChitState, EChit.getPayerListByToken(token));
export const getFeeEarnerListByToken = (token) => createSelector(getEChitState, EChit.getFeeEarnerListByToken(token));
export const getNominalListByToken = (token) => createSelector(getEChitState, EChit.getNominalListByToken(token));
export const getEChitTypeListByToken = (token) => createSelector(getEChitState, EChit.getEChitTypeListByToken(token));
export const getSapullerVatCodeByToken = (token) => createSelector(getEChitState, EChit.getSapullerVatCodeByToken(token));
export const getInputDataByToken = (token) => createSelector(getEChitState, EChit.getInputDataByToken(token));
export const getEChitTypeByToken = (token) => createSelector(getEChitState, EChit.getEChitTypeByToken(token));

export const getMatterDetailsNameByToken = (token) => createSelector(getEChitState,
    EChit.getMatterDetailsNameByToken(token));


export const getCloseToken = (token) => createSelector(getEChitState,
    EChit.getCloseToken(token));

export const getMatterRefDataByToken = (token) => createSelector(getEChitState,
    EChit.getMatterRefDataByToken(token));

export const getToMatterRefDataByToken = (token) => createSelector(getEChitState,
    EChit.getToMatterRefDataByToken(token));

export const getOpenEChitOpenTypeByToken = (token) => createSelector(getEChitState,
    EChit.getOpenEChitOpenTypeByToken(token));


export const getOpenEChitIsSavingDataByToken = (token) => createSelector(getEChitState,
    EChit.getOpenEChitIsSavingDataByToken(token));
export const getDisbursementTypeByToken = (token) => createSelector(getEChitState,
    EChit.getDisbursementTypeByToken(token));

export const getMatterInfoByToken = (token) => createSelector(getEChitState,
    EChit.getMatterInfoByToken(token));

export const getDisbuTotalByToken = (token) => createSelector(getEChitState,
    EChit.getDisbuTotalByToken(token));
export const getFeeTotalByToken = (token) => createSelector(getEChitState,
    EChit.getFeeTotalByToken(token));
export const getDisburcementValuByToken = (token) => createSelector(getEChitState,
    EChit.getDisburcementValuByToken(token));
export const getSelectedDisbuTypesByToken = (token) => createSelector(getEChitState,
    EChit.getSelectedDisbuTypesByToken(token));
export const getSelectedWorkTypesByToken = (token) => createSelector(getEChitState,
    EChit.getSelectedWorkTypesByToken(token));

export const getSelectedIncDisbuBreakDownByToken = (token) => createSelector(getEChitState,
    EChit.getSelectedIncDisbuBreakDownByToken(token));

export const getClassTypeByToken = (token) => createSelector(getEChitState, EChit.getClassTypeByToken(token));
export const getAttTypeListByToken = (token) => createSelector(getEChitState, EChit.getAttTypeListByToken(token));

