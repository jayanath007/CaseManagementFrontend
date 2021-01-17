import {
    InitPage, SavePrecedentHS, InputDataChange, RowItemClick,
    PresedentHSPopupClose, ExportPrecedentHSXML, ChangePresidentHValue, ChangePresidentHWorkType,
    ChangeGridUnit, SavePrecidentHRates, RowCheckBoxChange, CheckAllClick
} from '../actions/core';
import {
    getPrecedentHSListByToken, getEBillingTypeByToken, getloadingstateByToken,
    getEstimatedDataByToken,
    getActualAndEstimatedTotalByToken,
    getIsDirtyByToken,
    getSaveStatusByToken,
    getSelectedRowByToken,
    getXMLExportSuccessByToken,
    getWorkTypeListByToken,
    getEstimatedCostGridDataByToken,
    getGrandTotalsByToken,
    //  getSelectedWorkTypeDataByToken,
    getPresidentHSummaryDataByToken,
    getSelectedEstmateValueByToken,
    getSelectedActualValueByToken,
    getRateTableNameByToken,
    getSelectedWorkTypeDataByToken,
    getTotalProfitCostByToken
} from './../reducers/index';
import { ComponentBase } from '../../core/lib/component-base';
import { Store } from '@ngrx/store';
import { TableRow, TableColumn } from '../../shared/models/interface';
import { ChangeValueKind } from '../models/enum';

export class BasePrecedentHManager extends ComponentBase {
    public getPrecedentHSListByToken$: any;
    public isLoading$: any;
    public matterSummeryList$: any;
    public eBillingType$: any;
    public estimatedData$: any;
    public actualAndEstimatedTotal$: any;
    public isDirty$: any;
    public saveStatus$: any;
    public selectedRow$: any;
    public exportXMLSuccessStatus$: any;
    public workTypeList$: any;
    public estimatedCostGridData$: any;
    public grandTotals$: any;
    public selectedWorkTypeData$: any;
    public presidentHSummaryData$: any;

    public selectedEstimateValue$: any;
    public selectedActualValue$: any;
    public rateTableName$: any;
    public totalProfitCost$: any;



    constructor(protected store: Store<any>) {
        super();
    }

    protected initSelectors(precedentHToken: string, inputData: any) {
        this.store.dispatch(new InitPage(precedentHToken, {
            inputData: inputData
        }));
        this.isLoading$ = this.store.select(getloadingstateByToken(precedentHToken));
        this.getPrecedentHSListByToken$ = this.store.select(getPrecedentHSListByToken(precedentHToken));
        // this.workTypeList$ = this.store.select(getWorkTypeListByToken(precedentHToken));
        this.estimatedData$ = this.store.select(getEstimatedDataByToken(precedentHToken));
        this.eBillingType$ = this.store.select(getEBillingTypeByToken(precedentHToken));
        this.actualAndEstimatedTotal$ = this.store.select(getActualAndEstimatedTotalByToken(precedentHToken));
        this.isDirty$ = this.store.select(getIsDirtyByToken(precedentHToken));
        this.saveStatus$ = this.store.select(getSaveStatusByToken(precedentHToken));
        this.selectedRow$ = this.store.select(getSelectedRowByToken(precedentHToken));
        this.exportXMLSuccessStatus$ = this.store.select(getXMLExportSuccessByToken(precedentHToken));
        this.workTypeList$ = this.store.select(getWorkTypeListByToken(precedentHToken));
        this.estimatedCostGridData$ = this.store.select(getEstimatedCostGridDataByToken(precedentHToken));
        this.grandTotals$ = this.store.select(getGrandTotalsByToken(precedentHToken));
        this.selectedWorkTypeData$ = this.store.select(getSelectedWorkTypeDataByToken(precedentHToken));
        this.presidentHSummaryData$ = this.store.select(getPresidentHSummaryDataByToken(precedentHToken));
        this.selectedEstimateValue$ = this.store.select(getSelectedEstmateValueByToken(precedentHToken));
        this.selectedActualValue$ = this.store.select(getSelectedActualValueByToken(precedentHToken));
        this.rateTableName$ = this.store.select(getRateTableNameByToken(precedentHToken));
        this.totalProfitCost$ = this.store.select(getTotalProfitCostByToken(precedentHToken));


    }
    onRowItemClick(precedentHToken: string, rowItem) {
        this.store.dispatch(new RowItemClick(precedentHToken, rowItem));
    }
    onExportXMLOutData(precedentHToken: string) {
        this.store.dispatch(new ExportPrecedentHSXML(precedentHToken));
    }
    inputDataChange(precedentHToken: string, phaseID: number, value: number) {
        this.store.dispatch(new InputDataChange(precedentHToken, { phaseID, value }));
    }
    onSavePrecedentH(precedentHToken) {
        this.store.dispatch(new SavePrecedentHS(precedentHToken));
    }
    onClose(precedentHToken: string, info: any) {
        this.store.dispatch(new PresedentHSPopupClose(precedentHToken));
    }

    changeValue(precedentHToken: string, changeData: { kind: ChangeValueKind, value: number }) {
        this.store.dispatch(new ChangePresidentHValue(precedentHToken, { changeValue: changeData }));
    }

    changeWorkType(precedentHToken: string, changeData: any) {
        this.store.dispatch(new ChangePresidentHWorkType(precedentHToken, { changeValue: changeData }));
    }

    rowInputChange(precedentHToken: string, event: { value: number, row: TableRow<any>, columns: TableColumn }) {
        this.store.dispatch(new ChangeGridUnit(precedentHToken, event));
    }
    savePrecedentHRates(precedentHToken: string) {
        this.store.dispatch(new SavePrecidentHRates(precedentHToken));
    }

    rowCheckBoxChange(precedentHToken: string, event: { value: boolean, row: TableRow<any>, columns: TableColumn }) {
        this.store.dispatch(new RowCheckBoxChange(precedentHToken, event));
    }

    checkAllClick(precedentHToken: string, value) {
        this.store.dispatch(new CheckAllClick(precedentHToken, value));
    }

}

