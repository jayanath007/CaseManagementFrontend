
import { Store } from '@ngrx/store';
import { EventEmitter, Output } from '@angular/core';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata/enums';
import { MainMenuItem } from '../../layout-desktop';
import { LocalStorageKey } from '../../core';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { PreviousTransInput } from '../models/interface';
import {
    ChangeGridFilterType, ChangePaginator, InitPreviousTransaction, ShowBalancesCheckChange,
    PrintPreviousTrans, ApplyColumSort, ApplyColumFilter
} from '../actions/core';
import { AllGridColumnWidth, GridFilterType } from '../models/enums';
import {
    getPreviousTransGridDataByToken, getPreviousTransLoadingByToken, getGridFilterDataByToken,
    getPreviousTransMatterDataByToken
} from './../reducers';

export class BasePreviousTransManager {

    @Output() closePopup = new EventEmitter();

    public isPreviousTransLoading$: any;
    public gridColoum$: any;
    public paginatorDef$: any;
    public previousTransGridData$: any;
    public gridCloumnVisibleStatus$: any;
    public matterData$: any;
    public gridFilterData$: any;

    columnDef = [];
    previesTranColumnDef = [];
    paginatorDef = { currentPage: 0, itemPerPage: 50 };

    // clientLabel = 'Client';
    menuItems: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
    clientLabel = !this.menuItems ? '' : this.menuItems.find(i => i.id === 'client_search').label;

    constructor(protected store: Store<any>) {
    }

    protected initSelectors(token: string, input: PreviousTransInput) {
        this.columnDef = [
            createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
            createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
            createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
            createDefultColumnDef('Details', { label: 'Details', fxFlex: AllGridColumnWidth.Details, filterAnchor: 'start' }),
            // createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'start', filterHidden: true }),
            // createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' },
            //    FieldType.Number),
            createDefultColumnDef('OfficeDr',
                { label: 'Office Dr', fxFlex: AllGridColumnWidth.OfficeDr, filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('OfficeCr',
                { label: 'Office Cr', fxFlex: AllGridColumnWidth.OfficeCr, filterAnchor: 'start', filterHidden: true }),
            createDefultColumnDef('OfficeBal', {
                label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal,
                filterAnchor: 'end', filterHidden: true, disableShort: true
            }),
            createDefultColumnDef('ClientDr',
                { label: `${this.clientLabel} Dr`, fxFlex: AllGridColumnWidth.ClientDr, filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('ClientCr',
                { label: `${this.clientLabel} Cr`, fxFlex: AllGridColumnWidth.ClientCr, filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('ClientBal',
                {
                    label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal,
                    filterAnchor: 'end', filterHidden: true, disableShort: true
                }),
            createDefultColumnDef('DDADr',
                { label: 'DDA Dr', fxFlex: AllGridColumnWidth.DDADr, filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('DDACr',
                { label: 'DDA Cr', fxFlex: AllGridColumnWidth.DDDCr, filterAnchor: 'end', filterHidden: true }),
            createDefultColumnDef('DDAbal',
                { label: 'DDA Bal', fxFlex: AllGridColumnWidth.DDDbal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
        ],
            this.previesTranColumnDef = [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: AllGridColumnWidth.Details, filterAnchor: 'start' }),
                // createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT,
                // filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('OfficeBal', {
                    label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal,
                    filterAnchor: 'end', filterHidden: true, disableShort: true
                }),
                createDefultColumnDef('ClientBal',
                    {
                        label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal,
                        filterAnchor: 'end', filterHidden: true, disableShort: true
                    }),
                createDefultColumnDef('DDAbal',
                    { label: 'DDA Bal', fxFlex: AllGridColumnWidth.DDDbal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
            ];
        this.init(token, {
            columnDef: this.columnDef,
            paginatorDef: { currentPage: 0, itemPerPage: 50 },
            input: input
        });

        // this.loginUser$ = this.store.select(getUser);
        this.previousTransGridData$ = this.store.select(getPreviousTransGridDataByToken(token));
        this.isPreviousTransLoading$ = this.store.select(getPreviousTransLoadingByToken(token));
        this.gridFilterData$ = this.store.select(getGridFilterDataByToken(token));
        this.matterData$ = this.store.select(getPreviousTransMatterDataByToken(token));
    }

    init(token, payload) {
        this.store.dispatch(new InitPreviousTransaction(token, payload));
    }
    changePage(token, pageDef: PaginatorDef) {
        this.store.dispatch(new ChangePaginator(token, pageDef));
    }
    gridFilterChangeType(token, changeType) {
        this.store.dispatch(new ChangeGridFilterType(token, { gridFilterType: changeType }));
    }
    showBalancesCheckChange(token, value: boolean) {
        this.store.dispatch(new ShowBalancesCheckChange(token, {
            checkedValue: value,
            columnDef: value ? this.previesTranColumnDef : this.columnDef
        }));
    }
    printReport(token: string) {
        this.store.dispatch(new PrintPreviousTrans(token));
    }
    applyColumSort(token: string, columnDef: ColumnDef) {
        this.store.dispatch(new ApplyColumSort(token, columnDef));
    }
    applyColumFilter(token: string, event: { columnDef: ColumnDef, isClear: boolean }) {
        this.store.dispatch(new ApplyColumFilter(token, event.columnDef, event.isClear));
    }
}

