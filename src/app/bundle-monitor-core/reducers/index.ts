import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as bundleMonitor from './bundle-monitor';

export interface State {
    bundleMonitor: bundleMonitor.State;
}

export const reducers = {
    bundleMonitor: bundleMonitor.reducers
};
export const bundleMonitorRootState = createFeatureSelector<State>('bundleMonitor');
export const getBundleState = createSelector(bundleMonitorRootState, state => state.bundleMonitor);
export const getStateIsLoadingByToken = (token: string) =>
    createSelector(getBundleState, bundleMonitor.getStateIsLoadingByToken(token));
export const getColoumnByToken = (token: string) =>
    createSelector(getBundleState, bundleMonitor.getColoumnByToken(token));
export const getItemsForList = (token: string) =>
    createSelector(getBundleState, bundleMonitor.getItemsForList(token));
export const getSelecteditem = (token: string) =>
    createSelector(getBundleState, bundleMonitor.getSelecteditem(token));
export const getGridItems = (token: string) =>
    createSelector(getBundleState, bundleMonitor.getGridItems(token));
export const getSearchBundleId = (token: string) =>
    createSelector(getBundleState, bundleMonitor.getSearchBundleId(token));
export const getRequestParam = (token: string) =>
    createSelector(getBundleState, bundleMonitor.getRequestParam(token));

