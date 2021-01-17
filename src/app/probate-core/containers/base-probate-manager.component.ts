import {
    ClearAccountData,
    DeleteProbateAccountItem,
    DeleteProbateItem,
    EditDistributionClick,
    EditTransactionClick,
    InitProbate, ProbateIhtGenerateAccounts, ProbateIhtGenerateForm, ProbateOpenIhtForm, RnrbDataUpdate, SaveProbateAccountItem, SelectedRowClick
} from './../actions/core';

import { getDeceasedInfoByToken, getDistributionEditRowByToken, getDistributionViewItemsByToken, getDropdownCategoryByToken, getEstateOverViewsByToken, getIhtFormsDataByToken, getMatterDataByToken, getProbateLoadingByToken, getResidenceNilRateBandDataByToken, getSelectedIhtRowByToken, getSelectedtRowByToken, getSpouseorCivilPatnerDataByToken, getTransactionEditRowByToken, getTransactionsByToken } from './../reducers/index';
import { Store } from '@ngrx/store';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import {
} from '../actions/core';
import { ResidenceNilRateBandData } from '../models/interfaces';


export class BaseProbateManager {

    inputData: any;
    isLoading$: any;
    deceasedInfo$: any;
    distributionViewItems$: any;
    estateOverViews$: any;
    residenceNilRateBandData$: any;
    spouseorCivilPatnerData$: any;
    transactions$: any;
    dropDownCategory$: any;
    transactionsEditRow$: any;
    matterData$: any;
    distributionEditRow$: any;
    selectedRow$: any;
    ihtFormsData$: any;
    selectedIhtRow$: any;

    constructor(protected store: Store<any>) {
    }


    columnDef: ColumnDef[] = [];

    paginatorDef = { currentPage: 0, itemPerPage: 50 };







    protected initSelectors(token: string, inputData) {
        this.init(token, inputData);
        this.isLoading$ = this.store.select(getProbateLoadingByToken(token));
        this.deceasedInfo$ = this.store.select(getDeceasedInfoByToken(token));
        this.distributionViewItems$ = this.store.select(getDistributionViewItemsByToken(token));
        this.estateOverViews$ = this.store.select(getEstateOverViewsByToken(token));
        this.residenceNilRateBandData$ = this.store.select(getResidenceNilRateBandDataByToken(token));
        this.spouseorCivilPatnerData$ = this.store.select(getSpouseorCivilPatnerDataByToken(token));
        this.transactions$ = this.store.select(getTransactionsByToken(token));
        this.transactionsEditRow$ = this.store.select(getTransactionEditRowByToken(token));
        this.distributionEditRow$ = this.store.select(getDistributionEditRowByToken(token));
        this.ihtFormsData$ = this.store.select(getIhtFormsDataByToken(token));

        this.matterData$ = this.store.select(getMatterDataByToken(token));
        this.dropDownCategory$ = this.store.select(getDropdownCategoryByToken(token));
        this.selectedRow$ = this.store.select(getSelectedtRowByToken(token));
        this.selectedIhtRow$ = this.store.select(getSelectedIhtRowByToken(token));


    }

    protected initAddAsset(token: string, inputData) {
        this.inputData = inputData;
        this.isLoading$ = this.store.select(getProbateLoadingByToken(token));
        this.dropDownCategory$ = this.store.select(getDropdownCategoryByToken(token));
    }

    init(token, payload) {
        this.store.dispatch(new InitProbate(token, { data: payload }));
    }

    rnrbDataUpdate(token, event: ResidenceNilRateBandData) {
        this.store.dispatch(new RnrbDataUpdate(token, event, null));

    }

    submitSaveData(token, event: any) {

        this.store.dispatch(new SaveProbateAccountItem(token, event));
    }

    edittransactionClick(token, event: any) {
        this.store.dispatch(new EditTransactionClick(token, event));
    }


    editDistributionClick(token, event: any) {
        this.store.dispatch(new EditDistributionClick(token, event));
    }

    spouseCivilUpdate(token, event: any) {
        this.store.dispatch(new RnrbDataUpdate(token, null, event));
    }


    deleteRow(token, id) {
        this.store.dispatch(new DeleteProbateAccountItem(token, id));
    }

    selectedRowClick(token, event) {
        this.store.dispatch(new SelectedRowClick(token, event));

    }

    deleteProbateRow(token, id) {
        this.store.dispatch(new DeleteProbateItem(token, id));
    }
    clear(token) {
        this.store.dispatch(new ClearAccountData(token));
    }

    generateForm(token, event) {
        this.store.dispatch(new ProbateIhtGenerateForm(token, event));
    }

    generateAccounts(token, event) {
        this.store.dispatch(new ProbateIhtGenerateAccounts(token, event));
    }

    openIntForm(token, event) {
        this.store.dispatch(new ProbateOpenIhtForm(token, event));
    }


}
