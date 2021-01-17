
import { Store } from '@ngrx/store';
import { Output, EventEmitter } from '@angular/core';
import {
    InitLedgerCard, UpdateMatterRef, AllGridFilterChange,
    AllGridViewChange, BillGridViewChange, DisbsGridViewChange, GbpGridViewChange,
    Client1GridViewChange, DdaGridViewChange, Client2GridViewChange, Client3GridViewChange, ChangeTab
    , GridRefresh, ClearData, PrintLedgerCard
} from '../actions/core';
import {
    getLedgerCardIsLoadingByToken, getLedgerCardMatterDataByToken,
    getLedgerCardMatterBalancesByToken, getLedgerCardAllGridFilterDataByToken,
    getLedgerCardAllGridDataByToken, getLedgerCardBillGridDataByToken, getLedgerCardDisbsGridDataByToken,
    getLedgerCardGbpGridDataByToken, getLedgerCardDdaGridDataByToken, getLedgeCardCurrencyViewByToken,
    getLedgeClient1GridDataByToken, getLedgeClient2GridDataByToken, getLedgeClient3GridDataByToken,
    getLedgeCardSelectedTabIndexByToken, getLedgeCardCurrencyLabelByToken, getLedgeCardAllMatterCountByToken,
    getEchitGridDataByToken
} from '../reducers/index';
import { AllGridFilterUpdate, SampleAllGridTemplet, MatterData, AllGridFilterModel } from '../models/interfce';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { ViewChangeKind, allGridFilterKind, AllGridColumnWidth } from '../models/enumeration';
import { ColumnDef } from '../../core/lib/grid-model';
import { LedgerCardInput } from '../../core/lib/ledger-card';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { MainMenuItem, MainMenuService } from '../../layout-desktop';
import { MenuGroups, RouterOutlets } from '../../layout-desktop/models/enums';
import { FieldType } from '../../odata/enums';
import { MatterSearchGridData, GridRowItemWrapper } from '../../core/lib/matter';
import { LocalStorageKey } from '../../core';

export class BaseLedgerCardManager {

    @Output() closePopup = new EventEmitter();

    isLoading$: any;
    matterData$: any;
    selectedTab$: any;
    matterBalances$: any;
    currencyLabel$: any;
    currencyView$: any;
    allGridFilterData$: any;
    allGridData$: any;
    billGridData$: any;
    disbsGridData$: any;
    gbpGridData$: any;
    ddaGridData$: any;
    client1GridData$: any;
    client2GridData$: any;
    client3GridData$: any;
    eChitGridData$: any;
    allMatterCount$: any;

    // clientLabel = 'Client';
    menuItems: MainMenuItem<any>[] = JSON.parse(sessionStorage.getItem(LocalStorageKey.MenuItems));
    clientLabel = !this.menuItems ? '' : this.menuItems.find(i => i.id === 'client_search').label;

    constructor(protected store: Store<any>) {
    }

    allGridTemplete: SampleAllGridTemplet = {
        allView:
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: AllGridColumnWidth.Details, filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' },
                    FieldType.Number),
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
                createDefultColumnDef('DDDCr',
                    { label: 'DDA Cr', fxFlex: AllGridColumnWidth.DDDCr, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('DDDbal',
                    { label: 'DDA Bal', fxFlex: AllGridColumnWidth.DDDbal, filterAnchor: 'end', filterHidden: true, disableShort: true }),

            ],
        allViewWithURN: // Base Grid
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('URN', { label: 'URN', fxFlex: AllGridColumnWidth.URN, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: AllGridColumnWidth.Details, filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' },
                    FieldType.Number),
                createDefultColumnDef('OfficeDr', {
                    label: 'Office Dr', fxFlex: AllGridColumnWidth.OfficeDr,
                    filterAnchor: 'start', filterHidden: true
                }),
                createDefultColumnDef('OfficeCr', {
                    label: 'Office Cr', fxFlex: AllGridColumnWidth.OfficeCr,
                    filterAnchor: 'start', filterHidden: true
                }),
                createDefultColumnDef('OfficeBal', {
                    label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal,
                    filterAnchor: 'end', filterHidden: true, disableShort: true
                }),
                createDefultColumnDef('ClientDr', {
                    label: `${this.clientLabel} Dr`, fxFlex: AllGridColumnWidth.ClientDr,
                    filterAnchor: 'end', filterHidden: true
                }),
                createDefultColumnDef('ClientCr', {
                    label: `${this.clientLabel} Cr`, fxFlex: AllGridColumnWidth.ClientCr,
                    filterAnchor: 'end', filterHidden: true
                }),
                createDefultColumnDef('ClientBal', {
                    label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal,
                    filterAnchor: 'end', filterHidden: true, disableShort: true
                }),
                createDefultColumnDef('DDADr', {
                    label: 'DDA Dr', fxFlex: AllGridColumnWidth.DDADr,
                    filterAnchor: 'end', filterHidden: true
                }),
                createDefultColumnDef('DDDCr', {
                    label: 'DDA Cr', fxFlex: AllGridColumnWidth.DDDCr,
                    filterAnchor: 'end', filterHidden: true
                }),
                createDefultColumnDef('DDDbal', {
                    label: 'DDA Bal', fxFlex: AllGridColumnWidth.DDDbal,
                    filterAnchor: 'end', filterHidden: true, disableShort: true
                }),

            ],
        withOutDDA:
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: AllGridColumnWidth.Details, filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' },
                    FieldType.Number),
                createDefultColumnDef('OfficeDr', {
                    label: 'Office Dr', fxFlex: AllGridColumnWidth.OfficeDr,
                    filterAnchor: 'start', filterHidden: true
                }),
                createDefultColumnDef('OfficeCr', {
                    label: 'Office Cr', fxFlex: AllGridColumnWidth.OfficeCr,
                    filterAnchor: 'end', filterHidden: true
                }),
                createDefultColumnDef('OfficeBal', {
                    label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal,
                    filterAnchor: 'end', filterHidden: true, disableShort: true
                }),
                createDefultColumnDef('ClientDr', {
                    label: `${this.clientLabel} Dr`, fxFlex: AllGridColumnWidth.ClientDr,
                    filterAnchor: 'end', filterHidden: true
                }),
                createDefultColumnDef('ClientCr', {
                    label: `${this.clientLabel} Cr`, fxFlex: AllGridColumnWidth.ClientCr,
                    filterAnchor: 'end', filterHidden: true
                }),
                createDefultColumnDef('ClientBal', {
                    label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal,
                    filterAnchor: 'end', filterHidden: true, disableShort: true
                }),
            ],
        withOutDDAAndURN:
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: AllGridColumnWidth.Details, filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('OfficeDr', { label: 'Office Dr', fxFlex: AllGridColumnWidth.OfficeDr, filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('OfficeCr', { label: 'Office Cr', fxFlex: AllGridColumnWidth.OfficeCr, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('OfficeBal', { label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
                createDefultColumnDef('ClientDr', { label: `${this.clientLabel} Dr`, fxFlex: AllGridColumnWidth.ClientDr, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('ClientCr', { label: `${this.clientLabel} Cr`, fxFlex: AllGridColumnWidth.ClientCr, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('ClientBal', { label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
            ],
        withOutDDAAndwithURN:
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('URN', { label: 'URN', fxFlex: AllGridColumnWidth.URN, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('OfficeDr', { label: 'Office Dr', fxFlex: AllGridColumnWidth.OfficeDr, filterAnchor: 'start', filterHidden: true }),
                createDefultColumnDef('OfficeCr', { label: 'Office Cr', fxFlex: AllGridColumnWidth.OfficeCr, filterAnchor: 'end', filterHidden: true }),
                // tslint:disable-next-line:max-line-length
                createDefultColumnDef('OfficeBal', { label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
                createDefultColumnDef('ClientDr', { label: `${this.clientLabel} Dr`, fxFlex: AllGridColumnWidth.ClientDr, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('ClientCr', { label: `${this.clientLabel} Cr`, fxFlex: AllGridColumnWidth.ClientCr, filterAnchor: 'end', filterHidden: true }),
                // tslint:disable-next-line:max-line-length
                createDefultColumnDef('ClientBal', { label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
            ],
        balanceOnly:
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' }),
                createDefultColumnDef('OfficeBal', { label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
                // tslint:disable-next-line:max-line-length
                createDefultColumnDef('ClientBal', { label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
            ],
        balanceOnlyWithURN:
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('URN', { label: 'URN', fxFlex: AllGridColumnWidth.URN, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('OfficeBal', {
                    label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal, filterAnchor: 'end', filterHidden: true,
                    disableShort: true
                }),
                // tslint:disable-next-line:max-line-length
                createDefultColumnDef('ClientBal', { label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
            ],
        balanceWithDDA:
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('OfficeBal', {
                    label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal, filterAnchor: 'end', filterHidden: true,
                    disableShort: true
                }),
                // tslint:disable-next-line:max-line-length
                createDefultColumnDef('ClientBal', { label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
                // tslint:disable-next-line:max-line-length
                createDefultColumnDef('DDAbal', { label: 'DDA Bal', fxFlex: AllGridColumnWidth.DDDbal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
            ],
        balanceWithDDAandURN:
            [
                createDefultColumnDef('Date', { label: 'Date', fxFlex: AllGridColumnWidth.Date, filterAnchor: 'start' }, FieldType.Date),
                createDefultColumnDef('Type', { label: 'Type', fxFlex: AllGridColumnWidth.Type, filterAnchor: 'start' }),
                createDefultColumnDef('URN', { label: 'URN', fxFlex: AllGridColumnWidth.URN, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('Ref', { label: 'Ref', fxFlex: AllGridColumnWidth.Ref, filterAnchor: 'start' }),
                createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
                createDefultColumnDef('VAT', { label: 'VAT', fxFlex: AllGridColumnWidth.VAT, filterAnchor: 'end', filterHidden: true }),
                createDefultColumnDef('Period', { label: 'Period', fxFlex: AllGridColumnWidth.Period, filterAnchor: 'start' }, FieldType.Number),
                createDefultColumnDef('OfficeBal', { label: 'Office Bal', fxFlex: AllGridColumnWidth.OfficeBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
                // tslint:disable-next-line:max-line-length
                createDefultColumnDef('ClientBal', { label: `${this.clientLabel} Bal`, fxFlex: AllGridColumnWidth.ClientBal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
                // tslint:disable-next-line:max-line-length
                createDefultColumnDef('DDAbal', { label: 'DDA Bal', fxFlex: AllGridColumnWidth.DDDbal, filterAnchor: 'end', filterHidden: true, disableShort: true }),
            ],
    };

    billGridColumn: ColumnDef[] = [
        createDefultColumnDef('Date', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
        createDefultColumnDef('Type', { label: 'Type', fxFlex: '70px', filterAnchor: 'start' }),
        createDefultColumnDef('Ref', { label: 'Ref', fxFlex: '90px', filterAnchor: 'start' }),
        createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
        createDefultColumnDef('VAT', { label: 'VAT', fxFlex: '80px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('PC', { label: 'P/C', fxFlex: '75px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('Expenses', { label: 'Expenses', fxFlex: '85px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Disbs', { label: 'Disbs', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Gross', { label: 'Gross', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('PaidAmount', { label: 'Paid Amount', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('OutstandigAmount', { label: 'Outstandig Amount', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
    ];

    disbsGridColumn: ColumnDef[] = [
        createDefultColumnDef('Date', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
        createDefultColumnDef('Type', { label: 'Type', fxFlex: '70px', filterAnchor: 'start' }),
        createDefultColumnDef('Ref', { label: 'Ref', fxFlex: '90px', filterAnchor: 'start' }),
        createDefultColumnDef('Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
        createDefultColumnDef('VAT', { label: 'VAT', fxFlex: '80px', filterAnchor: 'start', filterHidden: true }),
        createDefultColumnDef('Net', { label: 'Net', fxFlex: '90px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Gross', { label: 'Gross', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('BillNo', { label: 'Bill No', fxFlex: '85px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Balance', { label: 'Balance', fxFlex: '95px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    ];

    gbpGridColumn: ColumnDef[] = [
        createDefultColumnDef('NOM_Date', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
        createDefultColumnDef('NOM_Type', { label: 'Type', fxFlex: '70px', filterAnchor: 'start' }),
        createDefultColumnDef('NOM_Ref', { label: 'Ref', fxFlex: '90px', filterAnchor: 'start' }),
        createDefultColumnDef('NOM_Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
        createDefultColumnDef('Debit', { label: 'Debit', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Credit', { label: 'Credit', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Balance', { label: 'Balance', fxFlex: '95px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    ];

    ddaGridColumn: ColumnDef[] = [
        createDefultColumnDef('NOM_Date', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
        createDefultColumnDef('NOM_Type', { label: 'Type', fxFlex: '70px', filterAnchor: 'start' }),
        createDefultColumnDef('NOM_Ref', { label: 'Ref', fxFlex: '90px', filterAnchor: 'start' }),
        createDefultColumnDef('NOM_Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
        createDefultColumnDef('Debit', { label: 'Debit', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Credit', { label: 'Credit', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Balance', { label: 'Balance', fxFlex: '95px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    ];

    clientsGridColumn: ColumnDef[] = [
        createDefultColumnDef('NOM_Date', { label: 'Date', fxFlex: '80px', filterAnchor: 'start' }, FieldType.Date),
        createDefultColumnDef('NOM_Type', { label: 'Type', fxFlex: '70px', filterAnchor: 'start' }),
        createDefultColumnDef('NOM_Ref', { label: 'Ref', fxFlex: '90px', filterAnchor: 'start' }),
        createDefultColumnDef('NOM_Details', { label: 'Details', fxFlex: '', filterAnchor: 'start' }),
        createDefultColumnDef('Debit', { label: 'Debit', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Credit', { label: 'Credit', fxFlex: '95px', filterAnchor: 'end', filterHidden: true }),
        createDefultColumnDef('Balance', { label: 'Balance', fxFlex: '95px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    ];

    echitsGridColumn: ColumnDef[] = [
        createDefultColumnDef('Type', { label: 'Type', fxFlex: '70px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Date', { label: 'Date', fxFlex: '80px', filterAnchor: 'start', filterHidden: true, disableShort: true }, FieldType.Date),
        createDefultColumnDef('Ref', { label: 'Ref', fxFlex: '90px', filterAnchor: 'start', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Reason', { label: 'Reason', fxFlex: '', filterAnchor: 'start', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Net', { label: 'Net', fxFlex: '100px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Vat', { label: 'Vat', fxFlex: '100px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Gross', { label: 'Gross', fxFlex: '100px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('FE', { label: 'FE', fxFlex: '90px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Payee', { label: 'Payee', fxFlex: '120px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
        createDefultColumnDef('Authorised', { label: 'Authorised', fxFlex: '95px', filterAnchor: 'end', filterHidden: true, disableShort: true }),
    ];

    protected initSelectors(token: string, isPopup: boolean, input: LedgerCardInput) {
        this.init(token, {
            isPopup: isPopup,
            allGridTemplete: this.allGridTemplete,
            billGridColumn: this.billGridColumn,
            GridPaginatorDef: { currentPage: 0, itemPerPage: 50 },
            disbsGridColumn: this.disbsGridColumn,
            gbpGridColumn: this.gbpGridColumn,
            ddaGridColumn: this.ddaGridColumn,
            clientsGridColumn: this.clientsGridColumn,
            echitsGridColumn: this.echitsGridColumn,
            input: input
        });


        this.isLoading$ = this.store.select(getLedgerCardIsLoadingByToken(token));
        this.matterData$ = this.store.select(getLedgerCardMatterDataByToken(token));
        this.matterBalances$ = this.store.select(getLedgerCardMatterBalancesByToken(token));
        this.currencyLabel$ = this.store.select(getLedgeCardCurrencyLabelByToken(token));
        this.allGridFilterData$ = this.store.select(getLedgerCardAllGridFilterDataByToken(token));
        this.allGridData$ = this.store.select(getLedgerCardAllGridDataByToken(token));
        this.billGridData$ = this.store.select(getLedgerCardBillGridDataByToken(token));
        this.disbsGridData$ = this.store.select(getLedgerCardDisbsGridDataByToken(token));
        this.gbpGridData$ = this.store.select(getLedgerCardGbpGridDataByToken(token));
        this.ddaGridData$ = this.store.select(getLedgerCardDdaGridDataByToken(token));
        this.currencyView$ = this.store.select(getLedgeCardCurrencyViewByToken(token));
        this.client1GridData$ = this.store.select(getLedgeClient1GridDataByToken(token));
        this.client2GridData$ = this.store.select(getLedgeClient2GridDataByToken(token));
        this.client3GridData$ = this.store.select(getLedgeClient3GridDataByToken(token));
        this.eChitGridData$ = this.store.select(getEchitGridDataByToken(token));
        this.selectedTab$ = this.store.select(getLedgeCardSelectedTabIndexByToken(token));
        this.allMatterCount$ = this.store.select(getLedgeCardAllMatterCountByToken(token));
    }

    init(token, payload) {
        this.store.dispatch(new InitLedgerCard(token, payload));
    }

    updateMatterRef(token: string, matterRef: string, allGridColumns, billGridColumn, disbsGridColumn, gbpGridColumn,
        ddaGridColumn, clientsGridColumn) {
        this.store.dispatch(new UpdateMatterRef(token, {
            matterRef: matterRef,
            allGridTemplete: allGridColumns,
            billGridColumn: billGridColumn,
            GridPaginatorDef: { currentPage: 0, itemPerPage: 50 },
            disbsGridColumn: disbsGridColumn,
            gbpGridColumn: gbpGridColumn,
            ddaGridColumn: ddaGridColumn,
            clientsGridColumn: clientsGridColumn
        }));
    }

    updateAllGridFilter(token: string, data: AllGridFilterUpdate) {
        this.store.dispatch(new AllGridFilterChange(token, { data }));
    }

    allGridViewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new AllGridViewChange(token, { kind, value }));
    }

    billGridViewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new BillGridViewChange(token, { kind, value }));
    }

    disbsGridViewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new DisbsGridViewChange(token, { kind, value }));
    }

    gbpGridViewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new GbpGridViewChange(token, { kind, value }));
    }

    ddaGridViewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new DdaGridViewChange(token, { kind, value }));
    }

    client1GridViewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new Client1GridViewChange(token, { kind, value }));
    }

    client2GridViewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new Client2GridViewChange(token, { kind, value }));
    }

    client3GridViewChange(token: string, { kind, value }: { kind: ViewChangeKind, value: any }) {
        this.store.dispatch(new Client3GridViewChange(token, { kind, value }));
    }

    changeTap(token: string, tabIndex: number) {
        this.store.dispatch(new ChangeTab(token, { tabIndex: tabIndex }));
    }

    closeLedgerCard(token: string) {
        this.closePopup.emit();
    }

    GridRefresh(token: string) {
        this.store.dispatch(new GridRefresh(token));
    }

    clearData(token: string) {
        this.store.dispatch(new ClearData(token));
    }

    onPrintLedgerCard(ItemData) {

        this.store.dispatch(new PrintLedgerCard(ItemData.token,
            { matterData: ItemData.matterData, allGridFilterData: ItemData.allGridFilterData }));

    }

}
