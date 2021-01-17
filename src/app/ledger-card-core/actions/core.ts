import { TokenizeAction } from '../../core';
import { Action } from '@ngrx/store';

import {
    MatterData, AllGridFilterUpdate, MatterBalances,
    AllGridPageInfo, SampleAllGridTemplet, BillGridPageInfo, DisbsGridPageInfo, GBPGridPageInfo,
    DDAGridPageInfo, CurrenciesView, BillGridRespone, ClientGridPageInfo, EChitGridData, AllGridFilterModel
} from '../models/interfce';
import { AllGridRequest, BillGridRequest, DisbsGridRequest, GbpGridRequest, DdaGridRequest, ClientGridRequest } from '../models/request';
import { ViewChangeKind } from '../models/enumeration';
import { ColumnDef, PaginatorDef } from '../../core/lib/grid-model';
import { LedgerCardInput } from '../../core/lib/ledger-card';

export const INIT_LEDGER_CARD = 'LC_INIT_LEDGER_CARD';
export const CHANGE_TAB = 'LC_CHANGE_TAB';
export const UPDATE_MATTER_REF = 'LC_UPDATE_MATTER_REF';
export const LOAD_MATTER_DATA = 'LC_LOAD_MATTER_DATA';
export const LOAD_MATTER_DATA_SUCCESS = 'LC_LOAD_MATTER_DATA_SUCCESS';
export const LOAD_MATTER_DATA_FAIL = 'LC_LOAD_MATTER_DATA_FAIL';
export const LOAD_MATTER_BALANCES = 'LC_LOAD_MATTER_BALANCES';
export const LOAD_MATTER_BALANCES_SUCCESS = 'LC_LOAD_MATTER_BALANCES_SUCCESS';
export const LOAD_MATTER_BALANCES_FAIL = 'LC_LOAD_LOAD_MATTER_BALANCES_FAIL';

export const All_GRID_FILTER_UPDATE = 'LC_All_GRID_FILTER_UPDATE';

export const REQUEST_ALL_GRID_DATA = 'LC_REQUEST_ALL_GRID_DATA';
export const LOAD_ALL_GRID_DATA = 'LC_LOAD_ALL_GRID_DATA';
export const LOAD_ALL_GRID_DATA_SUCCESS = 'LC_ALL_GRID_DATA_SUCCESS';
export const LOAD_ALL_GRID_DATA_FAIL = 'LC_LOAD_ALL_GRID_DATA_FAIL';
export const All_GRID_VIEW_CHANGE = 'LC_All_GRID_VIEW_CHANGE';

export const REQUEST_BILL_GRID_DATA = 'LC_REQUEST_BILL_GRID_DATA';
export const LOAD_BILL_GRID_DATA = 'LC_LOAD_BILL_GRID_DATA';
export const LOAD_BILL_GRID_DATA_SUCCESS = 'LC_BILL_GRID_DATA_SUCCESS';
export const LOAD_BILL_GRID_DATA_FAIL = 'LC_LOAD_BILL_GRID_DATA_FAIL';
export const BILL_GRID_VIEW_CHANGE = 'LC_BILL_GRID_VIEW_CHANGE';

export const REQUEST_DISBS_GRID_DATA = 'LC_REQUEST_DISBS_GRID_DATA';
export const LOAD_DISBS_GRID_DATA = 'LC_LOAD_DISBS_GRID_DATA';
export const LOAD_DISBS_GRID_DATA_SUCCESS = 'LC_DISBS_GRID_DATA_SUCCESS';
export const LOAD_DISBS_GRID_DATA_FAIL = 'LC_LOAD_DISBS_GRID_DATA_FAIL';
export const DISBS_GRID_VIEW_CHANGE = 'LC_DISBS_GRID_VIEW_CHANGE';

export const REQUEST_GBP_GRID_DATA = 'LC_REQUEST_GBP_GRID_DATA';
export const LOAD_GBP_GRID_DATA = 'LC_LOAD_GBP_GRID_DATA';
export const LOAD_GBP_GRID_DATA_SUCCESS = 'LC_GBP_GRID_DATA_SUCCESS';
export const LOAD_GBP_GRID_DATA_FAIL = 'LC_LOAD_GBP_GRID_DATA_FAIL';
export const GBP_GRID_VIEW_CHANGE = 'LC_GBP_GRID_VIEW_CHANGE';

export const REQUEST_DDA_GRID_DATA = 'LC_REQUEST_DDA_GRID_DATA';
export const LOAD_DDA_GRID_DATA = 'LC_LOAD_DDA_GRID_DATA';
export const LOAD_DDA_GRID_DATA_SUCCESS = 'LC_DDA_GRID_DATA_SUCCESS';
export const LOAD_DDA_GRID_DATA_FAIL = 'LC_LOAD_DDA_GRID_DATA_FAIL';
export const DDA_GRID_VIEW_CHANGE = 'LC_DDA_GRID_VIEW_CHANGE';

export const LOAD_CURRENCY_DATA = 'LC_LOAD_CURRENCY_DATA';
export const LOAD_CURRENCY_DATA_SUCCESS = 'LC_CURRENCY_DATA_SUCCESS';
export const LOAD_CURRENCY_DATA_FAIL = 'LC_LOAD_CURRENCY_DATA_FAIL';

export const LOAD_ALL_MATTER_COUNT = 'LC_ALL_MATTER_COUNT';
export const LOAD_ALL_MATTER_COUNT_SUCCESS = 'LC_ALL_MATTER_COUNT_SUCCESS';
export const LOAD_ALL_MATTER_COUNT_FAIL = 'LC_ALL_MATTER_COUNT_FAIL';

export const REQUEST_CLIENT1_GRID_DATA = 'LC_REQUEST_CLIENT1_GRID_DATA';
export const LOAD_CLIENT1_GRID_DATA = 'LC_LOAD_CLIENT1_GRID_DATA';
export const LOAD_CLIENT1_GRID_DATA_SUCCESS = 'LC_CLIENT1_GRID_DATA_SUCCESS';
export const LOAD_CLIENT1_GRID_DATA_FAIL = 'LC_LOAD_CLIENT1_GRID_DATA_FAIL';
export const CLIENT1_GRID_VIEW_CHANGE = 'LC_CLIENT1_GRID_VIEW_CHANGE';

export const REQUEST_CLIENT2_GRID_DATA = 'LC_REQUEST_CLIENT2_GRID_DATA';
export const LOAD_CLIENT2_GRID_DATA = 'LC_LOAD_CLIENT2_GRID_DATA';
export const LOAD_CLIENT2_GRID_DATA_SUCCESS = 'LC_CLIENT2_GRID_DATA_SUCCESS';
export const LOAD_CLIENT2_GRID_DATA_FAIL = 'LC_LOAD_CLIENT2_GRID_DATA_FAIL';
export const CLIENT2_GRID_VIEW_CHANGE = 'LC_CLIENT2_GRID_VIEW_CHANGE';

export const REQUEST_CLIENT3_GRID_DATA = 'LC_REQUEST_CLIENT3_GRID_DATA';
export const LOAD_CLIENT3_GRID_DATA = 'LC_LOAD_CLIENT3_GRID_DATA';
export const LOAD_CLIENT3_GRID_DATA_SUCCESS = 'LC_CLIENT3_GRID_DATA_SUCCESS';
export const LOAD_CLIENT3_GRID_DATA_FAIL = 'LC_LOAD_CLIENT3_GRID_DATA_FAIL';
export const CLIENT3_GRID_VIEW_CHANGE = 'LC_CLIENT3_GRID_VIEW_CHANGE';

export const All_DATA_UPDATE = 'LC_All_DATA_UPDATE';
export const GRID_REFRESH = 'LC_GRID_REFRESH';
export const CLEAR_DATA = 'LC_CLEAR_DATA';
export const CLOSE_LEDGER_CARD = 'LC_CLOSE_LEDGER_CARD';

export const PRINT_LEDGER_CARD = 'PRINT_LEDGER_CARD';
export const PRINT_LEDGER_CARD_SUCCESS = 'PRINT_LEDGER_CARD_SUCCESS';
export const PRINT_LEDGER_CARD_FAIL = 'PRINT_LEDGER_CARD_FAIL';

export const LOAD_ECHIT_GRID_DATA = 'LC_LOAD_ECHIT_GRID_DATA';
export const LOAD_ECHIT_GRID_DATA_SUCCESS = 'LC_LOAD_ECHIT_GRID_DATA_SUCCESS';
export const LOAD_ECHIT_GRID_DATA_FAIL = 'LC_LOAD_ECHIT_GRID_DATA_FAIL';


export class InitLedgerCard extends TokenizeAction implements Action {
    readonly type = INIT_LEDGER_CARD;
    constructor(public token: string, public payload: {
        isPopup: boolean,
        allGridTemplete: SampleAllGridTemplet,
        billGridColumn: ColumnDef[],
        GridPaginatorDef: PaginatorDef,
        disbsGridColumn: ColumnDef[],
        gbpGridColumn: ColumnDef[],
        ddaGridColumn: ColumnDef[],
        clientsGridColumn: ColumnDef[],
        echitsGridColumn: ColumnDef[],
        input: LedgerCardInput;

    }) { super(token); }
}

export class UpdateMatterRef extends TokenizeAction implements Action {
    readonly type = UPDATE_MATTER_REF;
    constructor(public token: string, public payload: {
        matterRef: string,
        allGridTemplete: SampleAllGridTemplet,
        billGridColumn: ColumnDef[],
        GridPaginatorDef: PaginatorDef,
        disbsGridColumn: ColumnDef[],
        gbpGridColumn: ColumnDef[],
        ddaGridColumn: ColumnDef[],
        clientsGridColumn: ColumnDef[],
    }) { super(token); }
}

export class LoadMatterData extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_DATA;
    constructor(public token: string, public payload: { matterRef: string }) { super(token); }
}

export class ChangeTab extends TokenizeAction implements Action {
    readonly type = CHANGE_TAB;
    constructor(public token: string, public payload: { tabIndex: number }) { super(token); }
}

export class LoadMatterDataSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_DATA_SUCCESS;
    constructor(public token: string, public payload: { matterData: MatterData }) { super(token); }
}

export class LoadMatterDataFail extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class LoadMatterBalances extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_BALANCES;
    constructor(public token: string, public payload: { matterRef: string }) { super(token); }
}

export class LoadMatterBalancesSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_BALANCES_SUCCESS;
    constructor(public token: string, public payload: { matterBalances: MatterBalances }) { super(token); }
}

export class LoadMatterBalancesFail extends TokenizeAction implements Action {
    readonly type = LOAD_MATTER_BALANCES_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class RequestAllGrid extends TokenizeAction implements Action {
    readonly type = REQUEST_ALL_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadAllGrid extends TokenizeAction implements Action {
    readonly type = LOAD_ALL_GRID_DATA;
    constructor(public token: string, public request: AllGridRequest) { super(token); }
}

export class LoadAllGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ALL_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { allGridPageData: AllGridPageInfo }) { super(token); }
}

export class LoadAllGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_ALL_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class AllGridFilterChange extends TokenizeAction implements Action {
    readonly type = All_GRID_FILTER_UPDATE;
    constructor(public token: string, public payload: { data: AllGridFilterUpdate }) { super(token); }
}

export class AllGridViewChange extends TokenizeAction implements Action {
    readonly type = All_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class RequestBillGrid extends TokenizeAction implements Action {
    readonly type = REQUEST_BILL_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadBillGrid extends TokenizeAction implements Action {
    readonly type = LOAD_BILL_GRID_DATA;
    constructor(public token: string, public request: BillGridRequest) { super(token); }
}

export class LoadBillGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_BILL_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { billData: BillGridPageInfo }) { super(token); }
}

export class LoadBillGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_BILL_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class BillGridViewChange extends TokenizeAction implements Action {
    readonly type = BILL_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class RequestDisbsGrid extends TokenizeAction implements Action {
    readonly type = REQUEST_DISBS_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadDisbsGrid extends TokenizeAction implements Action {
    readonly type = LOAD_DISBS_GRID_DATA;
    constructor(public token: string, public request: DisbsGridRequest) { super(token); }
}

export class LoadDisbsGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DISBS_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { disbsGridPageData: DisbsGridPageInfo }) { super(token); }
}

export class LoadDisbsGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_DISBS_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class DisbsGridViewChange extends TokenizeAction implements Action {
    readonly type = DISBS_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class RequestGbpGrid extends TokenizeAction implements Action {
    readonly type = REQUEST_GBP_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadGbpGrid extends TokenizeAction implements Action {
    readonly type = LOAD_GBP_GRID_DATA;
    constructor(public token: string, public request: GbpGridRequest) { super(token); }
}

export class LoadGbpGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_GBP_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { gbpGridPageData: GBPGridPageInfo }) { super(token); }
}

export class LoadGbpGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_GBP_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class GbpGridViewChange extends TokenizeAction implements Action {
    readonly type = GBP_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class RequestDdaGrid extends TokenizeAction implements Action {
    readonly type = REQUEST_DDA_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadDdaGrid extends TokenizeAction implements Action {
    readonly type = LOAD_DDA_GRID_DATA;
    constructor(public token: string, public request: DdaGridRequest) { super(token); }
}

export class LoadDdaGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_DDA_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { ddaGridPageData: DDAGridPageInfo }) { super(token); }
}

export class LoadDdaGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_DDA_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class DdaGridViewChange extends TokenizeAction implements Action {
    readonly type = DDA_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class AllDataUpdate extends TokenizeAction implements Action {
    readonly type = All_DATA_UPDATE;
    constructor(public token: string) { super(token); }
}

export class LoadCurrency extends TokenizeAction implements Action {
    readonly type = LOAD_CURRENCY_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadCurrencySuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CURRENCY_DATA_SUCCESS;
    constructor(public token: string, public payload: { currencyView: CurrenciesView[] }) { super(token); }
}

export class LoadCurrencyFail extends TokenizeAction implements Action {
    readonly type = LOAD_CURRENCY_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class LoadAllMatterCount extends TokenizeAction implements Action {
    readonly type = LOAD_ALL_MATTER_COUNT;
    constructor(public token: string) { super(token); }
}

export class LoadAllMatterCountSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ALL_MATTER_COUNT_SUCCESS;
    constructor(public token: string, public payload: { allMatterCount: number }) { super(token); }
}

export class LoadAllMatterCountFail extends TokenizeAction implements Action {
    readonly type = LOAD_ALL_MATTER_COUNT_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}


export class RequestClient1Grid extends TokenizeAction implements Action {
    readonly type = REQUEST_CLIENT1_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadClient1Grid extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT1_GRID_DATA;
    constructor(public token: string, public request: ClientGridRequest) { super(token); }
}

export class LoadClient1GridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT1_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { client1GridPageData: ClientGridPageInfo }) { super(token); }
}

export class LoadClient1GridFail extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT1_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class Client1GridViewChange extends TokenizeAction implements Action {
    readonly type = CLIENT1_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}


export class RequestClient2Grid extends TokenizeAction implements Action {
    readonly type = REQUEST_CLIENT2_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadClient2Grid extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT2_GRID_DATA;
    constructor(public token: string, public request: ClientGridRequest) { super(token); }
}

export class LoadClient2GridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT2_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { client2GridPageData: ClientGridPageInfo }) { super(token); }
}

export class LoadClient2GridFail extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT2_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class Client2GridViewChange extends TokenizeAction implements Action {
    readonly type = CLIENT2_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}


export class RequestClient3Grid extends TokenizeAction implements Action {
    readonly type = REQUEST_CLIENT3_GRID_DATA;
    constructor(public token: string) { super(token); }
}

export class LoadClient3Grid extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT3_GRID_DATA;
    constructor(public token: string, public request: ClientGridRequest) { super(token); }
}

export class LoadClient3GridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT3_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { client3GridPageData: ClientGridPageInfo }) { super(token); }
}

export class LoadClient3GridFail extends TokenizeAction implements Action {
    readonly type = LOAD_CLIENT3_GRID_DATA_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class Client3GridViewChange extends TokenizeAction implements Action {
    readonly type = CLIENT3_GRID_VIEW_CHANGE;
    constructor(public token: string, public payload: { kind: ViewChangeKind, value: any }) {
        super(token);
    }
}

export class CloseLedgerCard extends TokenizeAction implements Action {
    readonly type = CLOSE_LEDGER_CARD;
    constructor(public token: string) {
        super(token);
    }
}

export class GridRefresh extends TokenizeAction implements Action {
    readonly type = GRID_REFRESH;
    constructor(public token: string) {
        super(token);
    }
}

export class ClearData extends TokenizeAction implements Action {
    readonly type = CLEAR_DATA;
    constructor(public token: string) {
        super(token);
    }
}

export class PrintLedgerCard extends TokenizeAction implements Action {
    readonly type = PRINT_LEDGER_CARD;
    constructor(public token: string, public payload: { matterData: MatterData, allGridFilterData: AllGridFilterModel }) {
        super(token);
    }
}

export class PrintLedgerCardSuccess extends TokenizeAction implements Action {
    readonly type = PRINT_LEDGER_CARD_SUCCESS;
    constructor(public token: string, public payload: { url: any }) { super(token); }
}

export class PrintLedgerCardFail extends TokenizeAction implements Action {
    readonly type = PRINT_LEDGER_CARD_FAIL;
    constructor(public token: string, public payload: { error: string }) { super(token); }
}

export class LoadEchitGrid extends TokenizeAction implements Action {
    readonly type = LOAD_ECHIT_GRID_DATA;
    constructor(public token: string, public payload: { matterRef: string }) { super(token); }
}

export class LoadEchitGridSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_ECHIT_GRID_DATA_SUCCESS;
    constructor(public token: string, public payload: { eChitGrid: EChitGridData }) { super(token); }
}

export class LoadEchitGridFail extends TokenizeAction implements Action {
    readonly type = LOAD_ECHIT_GRID_DATA_FAIL;
    constructor(public token: string) { super(token); }
}


export type Any = InitLedgerCard | UpdateMatterRef | LoadMatterData | LoadMatterDataSuccess | LoadMatterDataFail
    | LoadMatterBalances | LoadMatterBalancesSuccess | LoadMatterBalancesFail | LoadAllGrid | LoadAllGridSuccess | LoadAllGridFail
    | AllGridFilterChange | RequestAllGrid | AllGridViewChange | AllDataUpdate
    | RequestBillGrid | LoadBillGrid | LoadBillGridSuccess | LoadBillGridFail | BillGridViewChange
    | RequestDisbsGrid | LoadDisbsGrid | LoadDisbsGridSuccess | LoadDisbsGridFail | DisbsGridViewChange
    | RequestGbpGrid | LoadGbpGrid | LoadGbpGridSuccess | LoadGbpGridFail | GbpGridViewChange
    | RequestDdaGrid | LoadDdaGrid | LoadDdaGridSuccess | LoadDdaGridFail | DdaGridViewChange
    | LoadCurrency | LoadCurrencySuccess | LoadCurrencyFail
    | LoadClient1Grid | LoadClient1GridSuccess | LoadClient1GridFail | Client1GridViewChange
    | LoadClient2Grid | LoadClient2GridSuccess | LoadClient2GridFail | Client2GridViewChange
    | LoadClient3Grid | LoadClient3GridSuccess | LoadClient3GridFail | Client3GridViewChange
    | ChangeTab | CloseLedgerCard | GridRefresh | ClearData
    | LoadAllMatterCount | LoadAllMatterCountSuccess | LoadAllMatterCountFail | PrintLedgerCard
    | PrintLedgerCardSuccess | PrintLedgerCardFail
    | LoadEchitGrid | LoadEchitGridSuccess | LoadEchitGridFail;
