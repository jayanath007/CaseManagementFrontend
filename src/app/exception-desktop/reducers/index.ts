import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as exception from './exception';

export interface State {
  exception: exception.State ;
}

export const reducers = {
  exception: exception.reducer,
};

export const getExceptionListState = createFeatureSelector<State>('dpsException');
export const getExceptionState = createSelector(getExceptionListState, (state) => state.exception);
export const getExceptionList = createSelector(getExceptionState, exception.getExceptionList);
export const getExceptionListAll = createSelector(getExceptionState, exception.getExceptionListAll);



