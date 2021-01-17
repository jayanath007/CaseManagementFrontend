import { RNRB_DATA_UPDATE_FAIL } from './../actions/core';
import { CategoryResponce, DeceasedInfo, DistributionViewItems, DropdownCategory, EstateOverViews, IhtFormsData, ProbateResponse, ResidenceNilRateBandData, SpouseorCivilPatnerData, Transactions } from './../models/interfaces';


import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';




export interface State {
    readonly [token: string]: ProbateState;
}

export interface ProbateState {
    readonly inputData: any;
    readonly init: boolean;
    readonly dataLoading: boolean;
    readonly deceasedInfo: DeceasedInfo;
    readonly distributionViewItems: DistributionViewItems[];
    readonly estateOverViews: EstateOverViews;
    readonly residenceNilRateBandData: ResidenceNilRateBandData;
    readonly spouseorCivilPatnerData: SpouseorCivilPatnerData[];
    readonly transactions: Transactions;
    readonly ihtFormsData: IhtFormsData[];

    readonly dropdownCategory: CategoryResponce;
    readonly transactionEditRow: any;
    readonly distributionEditRow: any;

    readonly selectedEstateRow: any;
    readonly selectedTransaction: any;
    readonly selectedDistribution: any;
    readonly selectedIhtForm: IhtFormsData;

}
const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_PROBATE:
            temp[action.token] = setInitData(state[action.token], action.payload.data);
            return { ...state, ...temp };
        case Actions.GET_PROBATE_DATA:
            temp[action.token] = getProbateData(state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_PROBATE_DATA_SUCCESS:
            temp[action.token] = getProbateDataSuccess(state[action.token], action.payload.data);
            return { ...state, ...temp };
        case Actions.GET_PROBATE_DATA_FAIL:
            temp[action.token] = getProbateDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.REFRESH_PROBATE_DATA:
            temp[action.token] = getProbateData(state[action.token]);
            return { ...state, ...temp };
        case Actions.REFRESH_PROBATE_DATA_SUCCESS:
            temp[action.token] = getProbateDataSuccess(state[action.token], action.payload.data);
            return { ...state, ...temp };
        case Actions.REFRESH_PROBATE_DATA_FAIL:
            temp[action.token] = getProbateDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_DROPDOWN_CATEGORIES:
            temp[action.token] = getCategory(state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_DROPDOWN_CATEGORIES_SUCCESS:
            temp[action.token] = getCategorySuccess(state[action.token], action.payload.data);
            return { ...state, ...temp };
        case Actions.GET_DROPDOWN_CATEGORIES_FAIL:
            temp[action.token] = getCategoryFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.EDIT_TRANSACTION_CLICK:
            temp[action.token] = setEditRow(state[action.token], action.rowData);
            return { ...state, ...temp };
        case Actions.EDIT_DISTRIBUTION_CLICK:
            temp[action.token] = setEditDistriRow(state[action.token], action.rowData);
            return { ...state, ...temp };
        case Actions.RNRB_DATA_UPDATE:
            temp[action.token] = updateRNRB(state[action.token]);
            return { ...state, ...temp };
        case Actions.RNRB_DATA_UPDATE_SUCCESS:
            temp[action.token] = updateRNRBSuccess(state[action.token], action.payload.data,
                action.rnrbUpdateData, action.spouserCivilData);
            return { ...state, ...temp };
        case Actions.RNRB_DATA_UPDATE_FAIL:
            temp[action.token] = updateRNRBFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.SELECTED_ROW_CLICK:
            temp[action.token] = selectRowSet(state[action.token], action.row);
            return { ...state, ...temp };
        case Actions.CLEAR_ACCOUNT_DATA:
            temp[action.token] = clear(state[action.token]);
            return { ...state, ...temp };
        case Actions.PROBATE_OPEN_IHT_FORM:
            temp[action.token] = openIht(state[action.token], action.row);
            return { ...state, ...temp };
        case Actions.PROBATE_OPEN_IHT_FORM_SUCCESS:
            temp[action.token] = openIhtSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.PROBATE_OPEN_IHT_FORM_FAIL:
            temp[action.token] = openIhtFail(state[action.token]);
            return { ...state, ...temp };

        case Actions.PROBATE_IHT_GENERATE_ACCOUNTS:
            temp[action.token] = generateAccount(state[action.token]);
            return { ...state, ...temp };
        case Actions.PROBATE_IHT_GENERATE_ACCOUNTS_SUCCESS:
            temp[action.token] = generateAccountSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.PROBATE_IHT_GENERATE_ACCOUNTS_FAIL:
            temp[action.token] = generateAccountFail(state[action.token]);
            return { ...state, ...temp };


        case Actions.PROBATE_IHT_GENERATE_FORM:
            temp[action.token] = generateForm(state[action.token]);
            return { ...state, ...temp };
        case Actions.PROBATE_IHT_GENERATE_FORM_SUCCESS:
            temp[action.token] = generateFormSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.PROBATE_IHT_GENERATE_FORM_FAIL:
            temp[action.token] = generateFormFail(state[action.token]);
            return { ...state, ...temp };


        default:
            { return state; }
    }
}
function setInitData(state: ProbateState, inputData: any): Partial<ProbateState> {

    return {
        ...state,
        init: true,
        dataLoading: false,
        inputData: inputData,
        deceasedInfo: null,
        distributionViewItems: null,
        estateOverViews: null,
        residenceNilRateBandData: null,
        spouseorCivilPatnerData: null,
        transactions: null,
        ihtFormsData: null,
        transactionEditRow: null,
        distributionEditRow: null

    };
}
function getProbateData(state: ProbateState) {
    return {
        ...state,
        dataLoading: true
    };
}
function getProbateDataSuccess(state: ProbateState, probateData: ProbateResponse) {
    return {
        ...state,
        dataLoading: false,
        deceasedInfo: probateData.deceasedInfo,
        distributionViewItems: probateData.distributionViewItems,
        estateOverViews: probateData.estateOverViews,
        residenceNilRateBandData: probateData.residenceNilRateBandData,
        spouseorCivilPatnerData: probateData.spouseorCivilPatnerData,
        transactions: probateData.transactions,
        ihtFormsData: probateData.ihtFormsData,
    };
}
function getProbateDataFail(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}

function setEditRow(state: ProbateState, editRow) {
    return {
        ...state,
        transactionEditRow: editRow,
        selectedTransaction: editRow
    };
}
function setEditDistriRow(state: ProbateState, editRow) {
    return {
        ...state,
        distributionEditRow: editRow,
        selectedDistribution: editRow
    };
}

function selectRowSet(state: ProbateState, selectRow: { type: string, row: any }) {


    return {
        ...state,
        selectedEstateRow: selectRow.type === 'estate' ? selectRow.row : null,
        selectedTransaction: selectRow.type === 'transaction' ? selectRow.row : null,
        selectedDistribution: selectRow.type === 'distribution' ? selectRow.row : null,
    };
}

function clear(state: ProbateState) {
    return {
        ...state,
        distributionEditRow: null,
        transactionEditRow: null,
    };
}


function openIht(state: ProbateState, row: IhtFormsData) {
    return {
        ...state,
        dataLoading: true,
        selectedIhtForm: row
    };
}
function openIhtSuccess(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}
function openIhtFail(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}
function generateAccount(state: ProbateState) {
    return {
        ...state,
        dataLoading: true,
    };
}
function generateAccountSuccess(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}
function generateAccountFail(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}
function generateForm(state: ProbateState) {
    return {
        ...state,
        dataLoading: true,
    };
}
function generateFormSuccess(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}
function generateFormFail(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}
function getCategory(state: ProbateState) {
    return {
        ...state,
        dataLoading: true
    };
}
function getCategoryFail(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}
function getCategorySuccess(state: ProbateState, categories: CategoryResponce) {
    return {
        ...state,
        // dataLoading: false,
        dropdownCategory: {
            ...state.dropdownCategory,
            assetCategories: categories.assetCategories,
            exemptionCategories: categories.exemptionCategories,
            giftCategories: categories.giftCategories,
            liabilityCategories: categories.liabilityCategories,


        }
    };
}
function updateRNRB(state: ProbateState) {
    return {
        ...state,
        dataLoading: true
    };
}

function updateRNRBSuccess(state: ProbateState, data, rnrbUpdateData, spouserCivilData) {
    return {
        ...state,
        dataLoading: false,
        residenceNilRateBandData: rnrbUpdateData !== null ? data.residenceNilRateBandData : state.residenceNilRateBandData,
        spouseorCivilPatnerData: spouserCivilData !== null ? data.spouseorCivilPatnerData : state.spouseorCivilPatnerData
    };
}

function updateRNRBFail(state: ProbateState) {
    return {
        ...state,
        dataLoading: false
    };
}




export const getState = (state: State) => state;
export const getStateByToken = (token) => createSelector(getState, (states) => states[token]);

export const getProbateLoadingByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.dataLoading : null);
export const getDeceasedInfoByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.deceasedInfo : null);
export const getDistributionViewItemsByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.distributionViewItems : null);
export const getEstateOverViewsByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.estateOverViews : null);
export const getResidenceNilRateBandDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.residenceNilRateBandData : null);
export const getSpouseorCivilPatnerDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.spouseorCivilPatnerData : null);
export const getTransactionsByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.transactions : null);
export const getIhtFormsDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.ihtFormsData : null);
export const getDropdownCategoryByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.dropdownCategory : null);
export const getMatterDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.inputData : null);
export const getTransactionEditRowByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.transactionEditRow : null);
export const getDistributionEditRowByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.distributionEditRow : null);

export const getSelectedtRowByToken = (token) => createSelector(getStateByToken(token),
    (state) => {
        let selectProRow = {
            selectedEstateRow: null,
            selectedTransaction: null,
            selectedDistribution: null
        };
        if (state) {
            selectProRow = {
                selectedEstateRow: state.selectedEstateRow,
                selectedTransaction: state.selectedTransaction,
                selectedDistribution: state.selectedDistribution

            };

            return selectProRow;
        } else {
            return selectProRow;
        }


    });
export const getSelectedIhtRowByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.selectedIhtForm : null);




