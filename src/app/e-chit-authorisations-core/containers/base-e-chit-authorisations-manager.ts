import {
    getAuthorisationsPaginatorDefByToken,
    getAuthorisationsColumnDefByToken,
    getAuthorisationsViewByToken,
    getGroupListByToken,
    getFeeEarnerListByToken,
    getAuthorisationsRowCountByToken
} from './../reducers/index';
import {
    InitPage, DropDownValueChange, GridDataByUserAndGroupChange, EChitAuthoriseSave,
    SelectedRowChange, CheckBoxChange, ChangePaginator, ShowDocument, ApplyColumSort, GetEmailItem, EChitAuthoriseReject
} from '../actions/core';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { PaginatorDef, ColumnDef } from '../../core/lib/grid-model';
import { ComponentBase } from '../../core/lib/component-base';
import { FileDataViewModel } from '../models/interfaces';
import { Output, EventEmitter } from '@angular/core';
import { PropertyNameList } from '../models/enums';
import { Store } from '@ngrx/store';
import { MainMenuItem } from '../../layout-desktop';
import { LocalStorageKey } from '../../core';
import { getUser } from '../../auth';

export class BaseEChitAuthorisationsManager extends ComponentBase {

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
        const menuItem: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
        const matterDisplyName = menuItem.find(i => i.id === 'matter_search').label;
        const clientDisplyName = menuItem.find(i => i.id === 'client_search').label;
        // this.store.select(getMenuItemDisplayName('matter_search')).subscribe(name => {
        this.columnDef = [
            createDefultColumnDef('CQ_Date_Reqst', { label: 'Date', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('CQ_Type', { label: 'Type', fxFlex: '80px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('CQ_Date_Reqrd', { label: 'Date Required', fxFlex: '104px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('CQ_Ref', { label: 'Ref', fxFlex: '70px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('CQ_Mat_Ref',
                { label: `${matterDisplyName} Ref`, fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('MatterDetails',
                { label: `${matterDisplyName}  Details`, fxFlex: '', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('ClientName', { label: clientDisplyName, fxFlex: '90px', filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('CQ_Reason', { label: 'Reason', fxFlex: '105px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('CQ_Notes', { label: 'Notes', fxFlex: '150px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('CQ_Net', { label: 'Net', fxFlex: '90px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('CQ_VAT', { label: 'Vat', fxFlex: '90px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('CQ_Payee', { label: 'Payee', fxFlex: '62px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('CQ_Fee_Earner', { label: 'FE ', fxFlex: '48px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('CQ_RequestedBy ', { label: 'Req By', fxFlex: '70px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('AuthorisationLevel', { label: 'Level', fxFlex: '58px', filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('selected',
                { label: 'Selected', fxFlex: '60px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
        ];
        this.store.dispatch(new InitPage(authorisationsToken, {
            inputData: inputData,
            columnDef: this.columnDef,
            paginatorDef: this.paginatorDef,
        }));
        this.viewData$ = this.store.select(getAuthorisationsViewByToken(authorisationsToken));
        this.columnDef$ = this.store.select(getAuthorisationsColumnDefByToken(authorisationsToken));
        this.paginatorDef$ = this.store.select(getAuthorisationsPaginatorDefByToken(authorisationsToken));
        this.groupList$ = this.store.select(getGroupListByToken);
        this.feeEarnerList$ = this.store.select(getFeeEarnerListByToken);
        this.user$ = this.store.select(getUser);
        this.selectedRowCount$ = this.store.select(getAuthorisationsRowCountByToken(authorisationsToken));
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
        if (event && event.propertyName === PropertyNameList.UserGroup) {
            this.store.dispatch(new DropDownValueChange(token, { propertyName: event.propertyName, selectedValue: event.selectedValue }));
        } else if (event && event.propertyName === PropertyNameList.FeeEarner) {
            this.store.dispatch(new DropDownValueChange(token, { propertyName: event.propertyName, selectedValue: event.selectedValue }));
        } else if (event && event.propertyName === PropertyNameList.GridCheckBox) {
            this.store.dispatch(new CheckBoxChange(token,
                { rowId: event.selectedObjectValue.rowId, CheckBoxValue: event.selectedObjectValue.checkedValue }));
        } else if (event && event.propertyName === PropertyNameList.Refresh) {
            this.store.dispatch(new GridDataByUserAndGroupChange(token));
        } else if (event && event.propertyName === PropertyNameList.Authorise) {
            this.store.dispatch(new EChitAuthoriseSave(token));
        } else if (event && event.propertyName === PropertyNameList.Reject) {
            this.store.dispatch(new EChitAuthoriseReject(token));
        }
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
