import { createSelector, Action } from '@ngrx/store';
import * as Actions from '../actions/core';
import * as _ from 'lodash';
import {
    PrecedentHS, PrecedentHInput, ActualAndEstimatedTotal,
    DropdownListData, EstimateGridData, GrandTotals, DefaultFeeEarnerTimeCost,
    FeeEarnerTimeRatesSave, EstimateViewData, ActualViewData, EstimateValueChanges, TotalsValues,

} from '../models/interfaces';
import { TableRow, TableColumn } from '../../shared/models/interface';
import { ChangeValueKind } from '../models/enum';
import { convertToDecimal } from '../../core/utility/DpsUtility';

export interface State {
    readonly [token: string]: PrecedentHState;
}

export interface PrecedentHState {
    readonly init: boolean;
    readonly isDirty: boolean;
    readonly saveStatus: boolean;
    readonly dataLoading: boolean;
    readonly precedentHSList: PrecedentHS[];
    readonly appId: number;
    readonly fileId: number;
    readonly branchId: number;
    readonly estimatedData: number | string;
    readonly eBillingType: string;
    readonly actualTotal: number;
    readonly estimatedTotal: number;
    readonly selectedprecedentItemt: PrecedentHS;
    readonly exportSuccessStatus: string;
    readonly workTypeList: DropdownListData[];
    readonly estimatedCostGridData: TableRow<EstimateGridData>[];


    readonly grandTotal: GrandTotals;
    // readonly workTypeData: WorkTypeData[];
    // readonly selectedWorkTypeData: WorkTypeData;
    readonly presidentHSummaryData: any;

    readonly estimateValues: EstimateViewData[];
    readonly actualValues: ActualViewData[];
    readonly selectEstimateValues: EstimateViewData;
    readonly selectActualValues: ActualViewData;
    readonly beforChangeestimatedCostGridData: TableRow<EstimateGridData>[];
    readonly beforChangeselectEstimateValues: EstimateViewData;
    readonly feeEarnerTimeRates: EstimateGridData[];
    readonly defaultsfeeEarnerTimeRates: DefaultFeeEarnerTimeCost[];
    readonly workType: any;
    readonly rateTableName: string;
    readonly estimateValueChanges: EstimateValueChanges[];
    readonly defaultselectEstimateValues: EstimateViewData;
    readonly defaultselectActualValues: ActualViewData;
    readonly changedEstimatedCostGridData: FeeEarnerTimeRatesSave[];
    readonly selectedWorkTypeId: number;



}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_PRECEDENTH:
            temp[action.token] = getInitViewData(state[action.token], action.payload.inputData);
            return { ...state, ...temp }; // { ...updateActiveState(state), ...temp };
        case Actions.LOAD_PRECEDENTS_PHASE:
            temp[action.token] = loadPrecedentSPhaseListData(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_PRECEDENTS_PHASE_SUCCESS:
            temp[action.token] = loadPrecedentSPhaseSuccess(state[action.token], action.payload.precedentSList);
            return { ...state, ...temp };
        case Actions.LOAD_PRECEDENTS_PHASE_FAIL:
            temp[action.token] = loadPrecedentSPhaseFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_PRECEDENTH_WORK_TYPE:
            temp[action.token] = loadPrecedentHDataList(state[action.token]);
            return { ...state, ...temp };
        case Actions.LOAD_PRECEDENTH_WORK_TYPE_SUCCESS:
            temp[action.token] = loadPrecedentHDataListSuccess(state[action.token], action.payload.precedentHList);
            return { ...state, ...temp };
        case Actions.LOAD_PRECEDENTH_WORK_TYPE_FAIL:
            temp[action.token] = loadPrecedentHDataListFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PRESEDENT_HS:
            temp[action.token] = savePrecedentHSData(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PRESEDENT_HS_SUCCESS:
            temp[action.token] = savePrecedentHSDataSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.INPUT_DATA_CHANGE:
            temp[action.token] = inputValueChange(state[action.token], action);
            return { ...state, ...temp };
        case Actions.PRESEDENTSH_ROW_CLICK:
            temp[action.token] = rowItemClick(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.SAVE_PRESEDENT_HS_FAIL:
            temp[action.token] = savePrecedentHSDataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.PRESEDENTSH_POPUP_CLOSE:
            temp[action.token] = null;
            return { ...state, ...temp };
        case Actions.EXPORT_PRECEDENT_HS_XML:
            temp[action.token] = exportXMLData(state[action.token]);
            return { ...state, ...temp };
        case Actions.EXPORT_PRECEDENT_HS_XML_SUCCESS:
            temp[action.token] = exportXMLDataSuccess(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.EXPORT_PRECEDENT_HS_XML_FAIL:
            temp[action.token] = exportXMLDataFail(state[action.token]);
            return { ...state, ...temp };
        // case Actions.GET_WORK_TYPE_LIST:
        //     temp[action.token] = workTypeList(state[action.token]);
        //     return { ...state, ...temp };
        // case Actions.GET_WORK_TYPE_LIST_SUCCESS:
        //     temp[action.token] = workTypeListSuccess(state[action.token], action.payload.workTypeList);
        //     return { ...state, ...temp };
        // case Actions.GET_WORK_TYPE_LIST_FAIL:
        //     temp[action.token] = workTypeListFail(state[action.token]);
        //     return { ...state, ...temp };
        case Actions.CHANGE_PRESIDENTH_VALUE:
            temp[action.token] = setPresidentHValue(state[action.token], action.payload.changeValue);
            return { ...state, ...temp };
        case Actions.CHANGE_GRID_UNIT:
            temp[action.token] = calUnitValue(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.GET_PRESIDENTH_ESTIMATED_COST:
            temp[action.token] = presidentHdata(state[action.token]);
            return { ...state, ...temp };
        case Actions.GET_PRESIDENTH_ESTIMATED_COST_SUCCESS:
            temp[action.token] = presidentHdataSuccess(state[action.token], action.payload.presidentHData);
            return { ...state, ...temp };
        case Actions.GET_PRESIDENTH_ESTIMATED_COST_FAIL:
            temp[action.token] = presidentHdataFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHANGE_PRESIDENTH_WORK_TYPE:
            temp[action.token] = changePresidentHworkType(state[action.token], action.payload.changeValue);
            return { ...state, ...temp };
        case Actions.ROW_CHECK_BOX_CHANGE:
            temp[action.token] = changeRowChekBox(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.SET_DEFAULT_WORK_TYPE:
            temp[action.token] = setDefaultWorkType(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PRECIDENT_H_RATES:
            temp[action.token] = rateSave(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PRECIDENT_H_RATES_SUCCESS:
            temp[action.token] = rateSaveSuccess(state[action.token]);
            return { ...state, ...temp };
        case Actions.SAVE_PRECIDENT_H_RATES_FAIL:
            temp[action.token] = rateSaveFail(state[action.token]);
            return { ...state, ...temp };
        case Actions.CHECK_ALL_CLICK_PRECIDENT_H:
            temp[action.token] = checkAll(state[action.token], action.payload);
            return { ...state, ...temp };




        default:
            { return state; }
    }
}
function getInitViewData(state: PrecedentHState, inputData: PrecedentHInput): Partial<PrecedentHState> {
    // if (!state) {

    return {
        ...state,
        init: true,
        dataLoading: true,
        exportSuccessStatus: null,
        saveStatus: true,
        isDirty: false,
        appId: inputData.AppId,
        fileId: inputData.FileId,
        branchId: inputData.BranchId,
        eBillingType: inputData.eBilling,
        estimatedCostGridData: null,
        selectedWorkTypeId: 0,
        workType: [
            { text: 'Pre-action Costs', value: 500 },
            { text: 'Issue/statements of case', value: 501 },
            { text: 'CMC', value: 502 },
            { text: 'Disclosure', value: 503 },
            { text: 'Witness Statements', value: 504 },
            { text: 'Expert Reports', value: 505 },
            { text: 'PTR', value: 506 },
            { text: 'Trial Preparation ', value: 507 },
            { text: 'Trial', value: 508 },
            { text: 'ADR/Settlement Discussions ', value: 509 },
            { text: 'Contingent Cost A:[explanation]', value: 510 },
            { text: 'Contingent Cost B:[explanation]', value: 511 },
            { text: 'Contingent Cost C:[explanation]', value: 512 },

        ],
        defaultselectEstimateValues: {
            workTypeId: 0,
            phsId: 0,
            estimateValues: {
                workTypeId: 0,
                totalProfitCost: 0,
                expertFees: 0,
                expertDisbursements: 0,
                leadingCounsel: 0,
                juniorCounsel: 0,
                courtFees: 0,
                otherDisbursements: 0,
                totalDisbursements: 0,
                total: 0
            },
            assumptions: '',
            isRecord: false
        },
        defaultselectActualValues: {
            workTypeId: 0,
            actualValues: {
                workTypeId: 0,
                totalProfitCost: 0,
                expertFees: 0,
                expertDisbursements: 0,
                leadingCounsel: 0,
                juniorCounsel: 0,
                courtFees: 0,
                otherDisbursements: 0,
                totalDisbursements: 0,
                total: 0,

            }
        }
    };
    // }
    // return state;
}
function loadPrecedentSPhaseListData(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: true
    };
}
function loadPrecedentSPhaseSuccess(state: PrecedentHState, precedentSList: PrecedentHS[]) {
    return {
        ...state,
        dataLoading: false,
        precedentHSList: updatedNumberField(state, precedentSList)
    };
}
function loadPrecedentSPhaseFail(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: false
    };
}
function loadPrecedentHDataList(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: true
    };
}
function loadPrecedentHDataListSuccess(state: PrecedentHState, precedentHList: PrecedentHS[]) {
    return {
        ...state,
        dataLoading: true,
        precedentHSList: updatedNumberField(state, precedentHList)
    };
}
function updatedNumberField(state: PrecedentHState, precedentHList: PrecedentHS[]) {
    return precedentHList.map((rowItem) => {
        return Object.freeze({
            ...rowItem,
            actualValue: rowItem.actualValue ? parseFloat(rowItem.actualValue.toString()).toFixed(2) : '0.00',
            estimatedValue: rowItem.estimatedValue ? parseFloat(rowItem.estimatedValue.toString()).toFixed(2) : '0.00',
        });
    });
}
function loadPrecedentHDataListFail(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: false
    };
}
function rowItemClick(state: PrecedentHState, item: PrecedentHS) {
    return {
        ...state,
        selectedprecedentItemt: item
    };
}
// function rowSelectionChange(state: PrecedentHState, newItem: PrecedentHS) {
//     return state.precedentHSList.map((rowItem) => {
//         if (rowItem.phaseID === newItem.phaseID) {
//             return Object.freeze({ ...rowItem, isRowSelected: true });
//         } else {
//             return Object.freeze({ ...rowItem, isRowSelected: false });
//         }
//     });
// }
function inputValueChange(state: PrecedentHState, action: Actions.InputDataChange) {
    return {
        ...state,
        isDirty: true,
        saveStatus: false,
        exportSuccessStatus: null,
        precedentHSList: valueChange(state, action)
    };
}
function valueChange(state: PrecedentHState, action: Actions.InputDataChange) {
    return state.precedentHSList.map((rowItem) => {
        if (rowItem.phaseID === action.payload.phaseID) {
            return Object.freeze({
                ...rowItem,
                estimatedValue: action.payload.value ? parseFloat(action.payload.value.toString()).toFixed(2) : '0.00'
            });
        } else {
            return rowItem;
        }
    });
}
// PrecedentHS save
function savePrecedentHSData(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: true,
        saveStatus: true,
    };
}
function savePrecedentHSDataSuccess(state: PrecedentHState, payload: any) {
    return {
        ...state,
        dataLoading: false,
        saveStatus: true,
        isDirty: false,
        exportSuccessStatus: null,
        precedentHSList: saveValueChange(state, payload.data)
    };
}
function saveValueChange(state: PrecedentHState, precedentHSList: PrecedentHS[]) {
    return precedentHSList.map((rowItem) => {
        return Object.freeze({
            ...rowItem,
            actualValue: rowItem.actualValue ? parseFloat(rowItem.actualValue.toString()).toFixed(2) : '0.00',
            estimatedValue: rowItem.estimatedValue ? parseFloat(rowItem.estimatedValue.toString()).toFixed(2) : '0.00'
        });
    });
}
function savePrecedentHSDataFail(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: false,
        saveStatus: false,
    };
}
function exportXMLData(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: true,
    };
}
function exportXMLDataSuccess(state: PrecedentHState, payload: any) {
    return {
        ...state,
        dataLoading: false,
        exportSuccessStatus: payload.status
    };
}
function exportXMLDataFail(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: false,
    };
}
function rateSave(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: true
    };
}
function rateSaveSuccess(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: false,
        isDirty: false,

    };
}
function rateSaveFail(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: false
    };
}
// function workTypeList(state: PrecedentHState) {
//     return {
//         ...state,
//         //  dataLoading: true
//     };
// }
// function workTypeListSuccess(state: PrecedentHState, workTypes) {
//     return {
//         ...state,
//         dataLoading: false,
//         //  workTypeList: workTypes
//     };
// }
// function workTypeListFail(state: PrecedentHState) {
//     return {
//         ...state,
//         //   dataLoading: false
//     };
// }


function setPresidentHValue(state: PrecedentHState, changeValue: { kind: ChangeValueKind, value: number }) {
    let newAss;
    // let totDisbu: number = state.selectEstimateValues.estimateValues.totalDisbursements;
    let fee: number = state.selectEstimateValues.estimateValues.expertFees;
    let disb: number = state.selectEstimateValues.estimateValues.expertDisbursements;
    let leadCo: number = state.selectEstimateValues.estimateValues.leadingCounsel;
    let junCo: number = state.selectEstimateValues.estimateValues.juniorCounsel;
    let courtFees: number = state.selectEstimateValues.estimateValues.courtFees;
    let othDisb: number = state.selectEstimateValues.estimateValues.otherDisbursements;

    //  let total: number = state.selectEstimateValues.estimateValues.total;
    switch (changeValue.kind) {
        case ChangeValueKind.Fees:
            fee = Number(changeValue.value);
            // totDisbu = Number(changeValue.value) + Number(state.selectEstimateValues.estimateValues.totalDisbursements);
            //  total = Number(changeValue.value) + Number(total);
            break;
        case ChangeValueKind.Disbursment:
            disb = Number(changeValue.value);
            // totDisbu = Number(changeValue.value) + Number(state.selectEstimateValues.estimateValues.totalDisbursements);
            // total = Number(changeValue.value) + Number(total);
            break;
        case ChangeValueKind.LeadingCounsel:
            leadCo = Number(changeValue.value);
            //  totDisbu = Number(changeValue.value) + Number(state.selectEstimateValues.estimateValues.totalDisbursements);
            //  total = Number(changeValue.value) + Number(total);
            break;
        case ChangeValueKind.JouniorCounsel:
            junCo = Number(changeValue.value);
            // totDisbu = Number(changeValue.value) + Number(state.selectEstimateValues.estimateValues.totalDisbursements);
            // total = Number(changeValue.value) + Number(total);
            break;
        case ChangeValueKind.CourtFees:
            courtFees = Number(changeValue.value);
            // totDisbu = Number(changeValue.value) + Number(state.selectEstimateValues.estimateValues.totalDisbursements);
            // total = Number(changeValue.value) + Number(total);
            break;
        case ChangeValueKind.OtherDisbursment:
            othDisb = Number(changeValue.value);
            // totDisbu = Number(changeValue.value) + Number(state.selectEstimateValues.estimateValues.totalDisbursements);
            //  total = Number(changeValue.value) + Number(total);
            break;
        case ChangeValueKind.Assumption:

            newAss = changeValue.value;
            break;
    }




    return {
        ...state,
        isDirty: true,
        selectEstimateValues: {
            ...state.selectEstimateValues,
            assumptions: newAss ? newAss : state.selectEstimateValues.assumptions,
            estimateValues: {
                ...state.selectEstimateValues.estimateValues,
                // totalDisbursements: totDisbu,
                expertFees: convertToDecimal(fee),
                expertDisbursements: convertToDecimal(disb),
                leadingCounsel: convertToDecimal(leadCo),
                juniorCounsel: convertToDecimal(junCo),
                courtFees: convertToDecimal(courtFees),
                otherDisbursements: convertToDecimal(othDisb),

                // total: total

            }

        },
    };
}

function calUnitValue(state: PrecedentHState, changeValue: { value: number, row: TableRow<EstimateGridData>, columns: TableColumn }) {
    const changedestimatedCostvalues: FeeEarnerTimeRatesSave[] = state.changedEstimatedCostGridData ?
        state.changedEstimatedCostGridData.filter(i => i.feeEarnerStatus !== changeValue.row.data.feeEarnerStatus) : [];
    let estimatedCostGridData = [];
    let changeCost: number;
    if (state.estimatedCostGridData) {
        estimatedCostGridData = state.estimatedCostGridData.map(i => {
            if (i.data.feeEarnerStatus === changeValue.row.data.feeEarnerStatus) {
                changeCost = (changeValue.row.data.rate * changeValue.value) / 10;

                changedestimatedCostvalues.push({
                    pheId: changeValue.row.data.id ? changeValue.row.data.id : null,
                    units: Number(changeValue.value),
                    rate: changeValue.row.data.rate,
                    cost: changeCost,
                    feeEarnerStatus: changeValue.row.data.feeEarnerStatus,

                });
                return {
                    ...i,
                    data: {
                        ...i.data,
                        cost: changeCost,
                        units: Number(changeValue.value),

                    }

                };
            } else {
                return i;
            }
        });
    }

    // const total = ;
    return {
        ...state,
        estimatedCostGridData: estimatedCostGridData,
        isDirty: true,
        changedEstimatedCostGridData: changedestimatedCostvalues,
        selectEstimateValues: {
            ...state.selectEstimateValues,
            estimateValues: {
                ...state.selectEstimateValues.estimateValues,
                totalProfitCost: Number(changeCost) + Number(state.selectEstimateValues.estimateValues.totalProfitCost),
                total: Number(changeCost) + Number(state.selectEstimateValues.estimateValues.total)

            }
        }
    };

    // return {
    //     ...state,
    //     estimatedCostGridData: { ...state.estimatedCostGridData, ...estimatedCostGridData }



    // state.estimatedCostGridData.map(a => {
    //     if (a.data.id === changeValue.row.data.id) {
    //         const ChangeCost = (changeValue.row.data.rates * changeValue.row.data.units) / 100;
    //         return {
    //             ...a,
    //             cost: ChangeCost

    //         };
    //     } else {
    //         return a;
    //     }
    // }),



}

function presidentHdata(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: true
    };
}
function presidentHdataSuccess(state: PrecedentHState, precidentHdata: any) {
    return {
        ...state,
        dataLoading: false,
        grandTotal: precidentHdata.grandTotals,
        estimateValues: precidentHdata.estimateViewData,
        actualValues: precidentHdata.actualViewData,
        feeEarnerTimeRates: precidentHdata.feeEarnerTimeRates,
        defaultsfeeEarnerTimeRates: precidentHdata.defaultsfeeEarnerTimeRates,
        presidentHSummaryData: getSummaryData(state, precidentHdata.estimateViewData, precidentHdata.actualViewData),
        rateTableName: precidentHdata.rateTableName,
    };
}
function presidentHdataFail(state: PrecedentHState) {
    return {
        ...state,
        dataLoading: false
    };
}

function setDefaultWorkType(state: PrecedentHState) {
    const selectedWorkTypeId = state.selectedWorkTypeId === 0 ? state.workType[0].value : state.selectedWorkTypeId;
    const selectEstimate = getSelectEstimate(state, selectedWorkTypeId);
    const selectActuale = getSelectActuale(state, selectedWorkTypeId);
    const estimatedCostData = getEstimatedCostData(state, selectedWorkTypeId);
    return {
        ...state,
        selectEstimateValues: selectEstimate ? selectEstimate : state.defaultselectEstimateValues,
        beforChangeselectEstimateValues: selectEstimate ? selectEstimate : state.defaultselectEstimateValues,
        selectActualValues: selectActuale ? selectActuale : state.defaultselectActualValues,
        estimatedCostGridData: estimatedCostData,
        beforChangeestimatedCostGridData: estimatedCostData,
        selectedWorkTypeId: selectedWorkTypeId
    };
}


function changePresidentHworkType(state: PrecedentHState, changeWorkType: { text: string, value: number }) {

    const selectEstimate = getSelectEstimate(state, changeWorkType.value);
    const selectActuale = getSelectActuale(state, changeWorkType.value);
    const estimatedCostData = getEstimatedCostData(state, changeWorkType.value);
    return {
        ...state,
        isDirty: false,
        selectEstimateValues: selectEstimate ? selectEstimate : state.defaultselectEstimateValues,
        selectActualValues: selectActuale,
        estimatedCostGridData: estimatedCostData,
        selectedWorkTypeId: changeWorkType.value,
        changedEstimatedCostGridData: []

        //   dataLoading: false
    };

}

function getSelectEstimate(state: PrecedentHState, changeWorkType) {
    const selectEstimate = state.estimateValues ? state.estimateValues.find(i => i.workTypeId === changeWorkType) : null;
    return selectEstimate;
}

function getSelectActuale(state: PrecedentHState, changeWorkType) {
    const selectActuale = state.actualValues ? state.actualValues.find(i => i.workTypeId === changeWorkType) : null;
    return selectActuale;
}
function getEstimatedCostData(state: PrecedentHState, changeWorkType) {
    const estimatedCostData = [];
    const feeEarnerTime = state.feeEarnerTimeRates ? state.feeEarnerTimeRates.filter(i => i.workTypeId === changeWorkType) : [];

    if (state.defaultsfeeEarnerTimeRates) {
        state.defaultsfeeEarnerTimeRates.forEach(i => {
            const defVal = feeEarnerTime.find(a => a.feeEarnerStatus === i.feeEarnerStatus);
            estimatedCostData.push({
                data: {
                    workTypeId: defVal ? defVal.workTypeId : null,
                    id: defVal ? defVal.id : null,
                    feeEarnerStatus: i.feeEarnerStatus,
                    units: defVal ? defVal.units : 0,
                    rate: i.rate,
                    cost: defVal ? defVal.cost : 0,
                    actualCost: defVal ? defVal.actualCost : 0,

                }
            });

        });
    }
    return estimatedCostData;
}


function changeRowChekBox(state: PrecedentHState, changeValue: { value: boolean, row: TableRow<any>, columns: TableColumn }) {
    let estimateChanges: EstimateValueChanges[] = state.estimateValueChanges ? state.estimateValueChanges : [];
    if (changeValue.row.data.pheId !== null) {

        if (state.estimateValueChanges && state.estimateValueChanges.find(f => f.phsId === changeValue.row.data.id)) {
            estimateChanges = estimateChanges.filter(i => i.phsId !== changeValue.row.data.id);

        } else {
            estimateChanges.push({
                phsId: changeValue.row.data.pheId,
                isRecord: changeValue.value
            });

        }
    }

    return {
        ...state,
        estimateValueChanges: estimateChanges


    };

}


function getSummaryData(state: PrecedentHState, estimateViewData: EstimateViewData[], actualViewData: ActualViewData[]) {
    const workTypeLists = [];
    // if (workTypeData) {
    state.workType.forEach(i => {
        const ival = estimateViewData.find(a => a.workTypeId === i.value);
        const esval = actualViewData.find(f => f.workTypeId === i.value);

        const actualTot = esval ? esval.actualValues.total : 0;
        const estTot = ival ? ival.estimateValues.total : 0;
        workTypeLists.push({
            data: {
                workdone: i.text,
                workTypeId: i.value,
                pheId: ival ? ival.phsId : null,
                assumptions: ival ? ival.assumptions : '',
                incdisburs: esval ? esval.actualValues.totalDisbursements : 0,
                inctimec: esval ? esval.actualValues.totalProfitCost : 0,
                estdisburs: ival ? ival.estimateValues.totalDisbursements : 0,
                esttimec: ival ? ival.estimateValues.totalProfitCost : 0,
                total: actualTot + estTot,
                record: ival ? ival.isRecord : false

            }

        });

    });


    // }
    return workTypeLists;


}

function checkAll(state: PrecedentHState, value) {

    let summaryData = [];
    const estimateChanges = [];
    summaryData = state.presidentHSummaryData.map(val => {
        if (val.data.pheId !== null) {
            estimateChanges.push({
                phsId: val.data.pheId,
                isRecord: value
            });
        }
        return {
            ...val,
            data: {
                ...val.data,
                record: value

            }

        };
    });

    return {
        ...state,
        dataLoading: false,
        estimateValueChanges: estimateChanges,
        presidentHSummaryData: summaryData
    };
}




export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => {
    return views[token];
});

// export const getActiveToken = createSelector(getView, (views) =>
//     Object.keys(views)
//         .map((key) => ({ token: key, state: views[key] }))
//         .filter((info) => info.state ? !!info.state.isActive : false)
//         .map((info) => info.token)
//         .reduce((val, cur) => cur, null)
// );

export const getPrecedentHSListByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.precedentHSList : null;
});
export const getloadingstateByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.dataLoading : false;
});
export const getEstimatedDataByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.estimatedData : null;
});
export const getEBillingTypeByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.eBillingType : '';
});
export const getMatterDataByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    let matterInfo: PrecedentHInput = null;
    if (precedentHState) {
        matterInfo = {
            AppId: precedentHState.appId,
            FileId: precedentHState.fileId,
            BranchId: precedentHState.branchId,
            eBilling: precedentHState.eBillingType,
        };
        return matterInfo;
    } else {
        return matterInfo;
    }
});
export const getActualAndEstimatedTotalByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    let actualTotal = 0;
    let estimatedTotal = 0;
    let actualAndEstimatedTotal: ActualAndEstimatedTotal = {
        actualTotal: 0.00,
        estimatedTotal: 0.00
    };
    if (precedentHState && precedentHState.precedentHSList && precedentHState.precedentHSList.length > 0) {
        precedentHState.precedentHSList.forEach(item => {
            actualTotal = (actualTotal + +item.actualValue);
            estimatedTotal = (estimatedTotal + +item.estimatedValue);
        });
        return actualAndEstimatedTotal = {
            actualTotal: actualTotal ? parseFloat(actualTotal.toString()).toFixed(2) : '0.00',
            estimatedTotal: estimatedTotal ? parseFloat(estimatedTotal.toString()).toFixed(2) : '0.00',
        };
    } else {
        return actualAndEstimatedTotal;
    }
});
export const getIsDirtyByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.isDirty : false;
});
export const getSaveStatusByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.saveStatus : false;
});
export const getSelectedRowByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.selectedprecedentItemt : null;
});
export const getXMLExportSuccessByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.exportSuccessStatus : null;
});

export const getWorkTypeListByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.workTypeList : null;
});

export const getEstimatedCostGridDataByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.estimatedCostGridData : null;
});

export const getGrandTotalsByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.grandTotal : null;
});

export const getSelectedWorkTypeDataByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.workType : null;
});
export const getPresidentHSummaryDataByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.presidentHSummaryData : null;
});

export const getSelectedEstmateValueByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.selectEstimateValues : null;
});

export const getSelectedActualValueByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.selectActualValues : null;
});

export const getFeeEarnerTimeRatesSaveByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.changedEstimatedCostGridData : null;
});
export const getRateTableNameByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.rateTableName : null;
});
export const getEstimateValueChangesByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.estimateValueChanges : null;
});
export const getSelectedWorkTypeIdByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    return precedentHState ? precedentHState.selectedWorkTypeId : null;
});


export const getTotalProfitCostByToken = (token) => createSelector(getViewByToken(token), (precedentHState) => {
    let totalProfitCost = 0;
    let totalDisbursment = 0;
    let total = 0;
    let actualAndEstimatedTotal: TotalsValues = {
        totalProfitCost: 0.00,
        totalDisbursment: 0.00,
        total: 0.00,
    };
    if (precedentHState
    ) {
        if (precedentHState.estimatedCostGridData && precedentHState.estimatedCostGridData.length > 0) {
            precedentHState.estimatedCostGridData.forEach(item => {
                totalProfitCost = (totalProfitCost + item.data.cost);

            });
        }
        if (precedentHState.selectEstimateValues &&
            precedentHState.selectEstimateValues.estimateValues) {
            const estimateVal = precedentHState.selectEstimateValues.estimateValues;
            totalDisbursment = Number(estimateVal.expertFees) + Number(estimateVal.expertDisbursements)
                + Number(estimateVal.leadingCounsel) + Number(estimateVal.juniorCounsel)
                + Number(estimateVal.courtFees) + Number(estimateVal.otherDisbursements);
            total = totalProfitCost + totalDisbursment;
        }

        return actualAndEstimatedTotal = {
            totalProfitCost: totalProfitCost,
            totalDisbursment: totalDisbursment,
            total: total,
        };
    } else {
        return actualAndEstimatedTotal;
    }



});

