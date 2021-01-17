import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as auth from './auth';
import { Module, SettingKey, UserPermissionKey } from '../../core/lib/app-settings';

export interface AuthState {
  status: auth.State;
}

export interface State {
  auth: AuthState;
}

export const reducers = {
  status: auth.reducer
};

export const selectAuthState = createFeatureSelector<AuthState>('auth');
export const selectAuthStatusState = createSelector(selectAuthState, (state: AuthState) => state.status);
export const showingTokenDialog = createSelector(selectAuthStatusState, auth.showingTokenDialog);
export const getAuthInfo = createSelector(selectAuthStatusState, auth.getAuthInfo);
export const getUser = createSelector(selectAuthStatusState, auth.getUser);
export const getLoggedIn = createSelector(getAuthInfo, auth.getLoggedIn);
export const getAccessToken = createSelector(getAuthInfo, auth.getAccessToken);
export const getIsTenentValidated = createSelector(selectAuthStatusState, auth.getIsTenentValidated);
export const getModuleCanAccessByModuleId = (moduleId: Module) =>
  createSelector(selectAuthStatusState, auth.getModuleCanAccessByModuleId(moduleId));
export const getDPSSettingValueByKey = (settingKey: SettingKey) =>
  createSelector(selectAuthStatusState, auth.getDPSSettingValueByKey(settingKey));
export const getPoltVarValues = createSelector(selectAuthStatusState, auth.getPoltVarValues);
export const getGlobalSignatureForTemplete = (templete: string) =>
  createSelector(selectAuthStatusState, auth.getGlobalSignatureForTemplete(templete));
export const getGlobalSignatureTemp = () => createSelector(selectAuthStatusState, auth.getGlobalSignatureTemp());
export const getGlobalSignature = () => createSelector(selectAuthStatusState, auth.getGlobalSignature());
export const checkTimeRecordType = (appCode: string, eBilling: string, isLegalAid: boolean) =>
  createSelector(selectAuthStatusState, auth.checkTimeRecordType(appCode, eBilling, isLegalAid));
export const getGlobalSignatureTempIsLoading = () => createSelector(selectAuthStatusState, auth.getGlobalSignatureTempIsLoading());
export const getUserPermitionByKey = (key: UserPermissionKey) =>
  createSelector(selectAuthStatusState, auth.getUserPermitionByKey(key));

