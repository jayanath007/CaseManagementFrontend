import {
    getGroupListByToken,
    getFeeEarnerListByToken,
    getBankSearchRowCountByToken,
    getBankSearchPaginatorDefByToken,
    getBankSearchColumnDefByToken,
} from './../reducers/index';
import {
    InitPage,
    SelectedRowChange, ChangePaginator, ShowDocument, ApplyColumSort, GetEmailItem, EChitAuthoriseReject
} from '../actions/core';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { PaginatorDef, ColumnDef } from '../../core/lib/grid-model';
import { ComponentBase } from '../../core/lib/component-base';
import { FileDataViewModel } from '../models/interfaces';
import { Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { MainMenuItem } from '../../layout-desktop';
import { LocalStorageKey } from '../../core';
import { getUser } from '../../auth';

export class BaseBankSearchManagerManager extends ComponentBase {

    @Output() closePopup = new EventEmitter<any>();

    public paginatorDef$: any;
    public columnDef$: any;
    public viewData$: any;
    public groupList$: any;
    public user$: any;
    public feeEarnerList$: any;
    public selectedRowCount$: any;
    columnDef = [];
    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    constructor(protected store: Store<any>) {
        super();
    }
    protected initSelectors(authorisationsToken: string, inputData: any) {
        this.columnDef = [
            createDefultColumnDef('BAN_AccountName', { label: 'Account Name', fxFlex: '80px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('BAN_SortCode', { label: 'Sort Code', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('BAN_AccountNumber',
                { label: 'Account Number', fxFlex: '104px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('BAN_BankName', { label: 'Bank Name', fxFlex: '70px', filterAnchor: 'start', filterHidden: true }),
        ];
        this.store.dispatch(new InitPage(authorisationsToken, {
            inputData: inputData,
            columnDef: this.columnDef,
            paginatorDef: this.paginatorDef,
        }));
        // this.viewData$ = this.store.select(getAuthorisationsViewByToken(authorisationsToken));
        this.columnDef$ = this.store.select(getBankSearchColumnDefByToken(authorisationsToken));
        this.paginatorDef$ = this.store.select(getBankSearchPaginatorDefByToken(authorisationsToken));
        this.groupList$ = this.store.select(getGroupListByToken);
        this.feeEarnerList$ = this.store.select(getFeeEarnerListByToken);
        this.user$ = this.store.select(getUser);
        this.selectedRowCount$ = this.store.select(getBankSearchRowCountByToken(authorisationsToken));
        // }

        // );



    }
    onCloseAuthorisationsPopup(token, info) {
        this.closePopup.emit(info);
    }
    onSelectedRow(token, row) {
        this.store.dispatch(new SelectedRowChange(token, { selectedRow: row }));
    }
    onControllerChanges(token, event) {
        // if (event && event.propertyName === PropertyNameList.UserGroup) {
        //     this.store.dispatch(new DropDownValueChange(token, { propertyName: event.propertyName, selectedValue: event.selectedValue }));
        // } else if (event && event.propertyName === PropertyNameList.FeeEarner) {
        //     this.store.dispatch(new DropDownValueChange(token, { propertyName: event.propertyName, selectedValue: event.selectedValue }));
        // } else if (event && event.propertyName === PropertyNameList.GridCheckBox) {
        //     this.store.dispatch(new CheckBoxChange(token,
        //         { rowId: event.selectedObjectValue.rowId, CheckBoxValue: event.selectedObjectValue.checkedValue }));
        // } else if (event && event.propertyName === PropertyNameList.Refresh) {
        //     this.store.dispatch(new GridDataByUserAndGroupChange(token));
        // } else if (event && event.propertyName === PropertyNameList.Authorise) {
        //     this.store.dispatch(new EChitAuthoriseSave(token));
        // } else if (event && event.propertyName === PropertyNameList.Reject) {
        //     this.store.dispatch(new EChitAuthoriseReject(token));
        // }
    }
    changePage(token, pageDef: PaginatorDef) {
        this.store.dispatch(new ChangePaginator(token, pageDef));
    }
    viewReport(token, dataModel: FileDataViewModel) {
        this.store.dispatch(new ShowDocument(token, { fileDataViewModel: dataModel }));
    }
    getEmailItem(token, dataModel: FileDataViewModel) {
        this.store.dispatch(new GetEmailItem(token, { fileDataViewModel: dataModel }));
    }
    ToggleSorting(token: string, columDef: ColumnDef) {
        this.store.dispatch(new ApplyColumSort(token, columDef));
    }
}
