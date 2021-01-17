import * as courtDuty from './court-duty';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface State {
    cDuty: courtDuty.State;
}
export const reducers = {
    cDuty: courtDuty.reducer,
};

export const getcCcourtDutyRootState = createFeatureSelector<State>('crimeCourtDuty');
export const getCourtDutyState = createSelector(getcCcourtDutyRootState, (state => state.cDuty));
export const getIsLoadingByToken = token => createSelector(getCourtDutyState, courtDuty.getIsLoadingByToken(token));
export const getModel = token => createSelector(getCourtDutyState, courtDuty.getModel(token));
export const isDirty = token => createSelector(getCourtDutyState, courtDuty.isDirty(token));
export const getRecordHistory = token => createSelector(getCourtDutyState, courtDuty.getRecordHistory(token));
export const getIsLoadinghistoryByToken = token => createSelector(getCourtDutyState, courtDuty.getIsLoadinghistoryByToken(token));
export const gridDataPaginatorDef = token => createSelector(getCourtDutyState, courtDuty.gridDataPaginatorDef(token));
export const gridDataFilter = token => createSelector(getCourtDutyState, courtDuty.gridDataFilter(token));



