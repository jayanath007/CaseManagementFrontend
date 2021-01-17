import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as ledgerCard from './ledger-card';

export interface State {
    ledgerCard: ledgerCard.State;
}

export const reducers = {
    ledgerCard: ledgerCard.reducer,
};

export const getLedgerCardRootState = createFeatureSelector<State>('dpsLedgerCardCore');
export const getLedgerCardState = createSelector(getLedgerCardRootState, (state => state.ledgerCard));
export const getLedgerCardStateByToken = (token) => createSelector(getLedgerCardState, ledgerCard.getStateByToken(token));
export const getLedgerCardIsLoadingByToken = (token) => createSelector(getLedgerCardState, ledgerCard.getIsloadingByToken(token));
export const getLedgerCardMatterDataByToken = (token) => createSelector(getLedgerCardState, ledgerCard.getMatterDataByToken(token));
export const getLedgerCardMatterBalancesByToken = (token) => createSelector(getLedgerCardState, ledgerCard.getMatterBalancesByToken(token));
export const getLedgerCardAllGridFilterDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getAllGridFilterDataByToken(token));
export const getLedgerCardAllGridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getAllGridDataByToken(token));
export const getLedgerCardBillGridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getBillGridDataByToken(token));
export const getLedgerCardDisbsGridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getDisbsGridDataByToken(token));
export const getLedgerCardGbpGridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getGbpGridDataByToken(token));
export const getLedgerCardDdaGridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getDdaGridDataByToken(token));
export const getLedgeCardCurrencyViewByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getCurrencyViewByToken(token));
export const getLedgeClient1GridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getClient1GridDataByToken(token));
export const getLedgeClient2GridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getClient2GridDataByToken(token));
export const getLedgeClient3GridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getClient3GridDataByToken(token));
export const getEchitGridDataByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getEchitGridDataByToken(token));
export const getLedgeCardSelectedTabIndexByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getSelectedTabIndexByToken(token));
export const getLedgeCardCurrencyLabelByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getCurrencyLabelByToken(token));
export const getLedgeCardAllMatterCountByToken = (token) =>
    createSelector(getLedgerCardState, ledgerCard.getAllMatterCountByToken(token));









