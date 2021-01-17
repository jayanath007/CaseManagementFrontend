import { AttType } from './../../core/lib/timeRecord';
import {
    EChitPopupInput, DropdownListData, VatCode, Branch, EchitModel, MatterBalance,
    ShortcutType, PrecedentHDis, DisburcementValus, DropdownDisb, WorkTypeList, IncDisbuBreakDown, MatterRefData
} from '../models/interfaces';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { ChequeRequestType, EChitPopupInputType } from '../models/enum';
import { dpsNewDate } from '../../utils/javascriptDate';
export interface State {
    readonly [token: string]: EChitState;
}
import { ClassObj } from './../../crime-management-core/models/interfaces';

export interface FormDataModel {
    readonly eChitTypeList: DropdownListData[];
    readonly feeEarnerList: DropdownListData[];
    readonly clearanceTypesList: DropdownListData[];
    readonly referencesList: string[];
    readonly vatCodeList: VatCode[];
    readonly branchList: Branch[];
    readonly payeeList: ShortcutType[];
    readonly payerList: ShortcutType[];
    readonly reasonList: ShortcutType[];
    readonly nominalList: DropdownListData[];
    readonly matterBalances: MatterBalance[];
    readonly toMatterBalances: MatterBalance[];
    readonly invoiceRefVisible: boolean;
    readonly receiptTypeVisible: boolean;
    readonly branchVisible: boolean;
    readonly matterRefVisible: boolean;
    readonly supplierVisible: boolean;
    readonly netVisible: boolean;
    readonly vatAmountVisible: boolean;
    readonly vatCodeVisible: boolean;
    readonly payeeVisible: boolean;
    readonly payerVisible: boolean;
    readonly feeEarnerVisible: boolean;
    readonly dateRequiredVisible: boolean;
    readonly reasonVisible: boolean;
    readonly referenceVisible: boolean;
    readonly supplierSearchVisible: boolean;
    readonly notesVisible: boolean;
    readonly invoiceDocNameVisible: boolean;
    readonly nominalVisible: boolean;
    readonly textRefVisible: boolean;
    readonly toMatterRefVisible: boolean;
    readonly isCouncelFeesVisible: boolean;
    readonly isIncludeSupplierVisible: boolean;
    readonly isVatVisible: boolean;
    readonly banckDetailVisible: boolean;
    readonly file: File;
    readonly referenceText: string;
    readonly payeeText: string;
    readonly matterText: string;
    readonly dateRequiredText: string;
    readonly invoiceRefText: string;
    readonly precedentHDisbursment: PrecedentHDis;
    readonly classId: number;
    readonly subClassId: number;
    readonly telephoneAdvice: boolean;
}

export interface EChitState {
    readonly eChitOpenType: EChitPopupInputType;
    readonly eChitType: ChequeRequestType;
    readonly formDataModel: FormDataModel;
    readonly loading: boolean;
    readonly isDirty: boolean;
    readonly model: EchitModel;
    readonly clientDefaults: any;
    readonly supplierDocEnables: any;
    readonly isSaveSuccse: boolean;
    readonly isSavingData: boolean;
    readonly inputData: EChitPopupInput;
    readonly selectedMatterRefCode: string;
    readonly sapullerVatCode: string;
    readonly matterDetailsName: string;
    readonly close: boolean;
    readonly matterRefData: MatterRefData;
    readonly toMatterRefData: string;
    readonly matterInfo: any;
    readonly disburcementValu: DisburcementValus;
    readonly selectedDisbuTypes: number;
    readonly selectedWorkType: number;
    readonly incDisbuBreakDown: IncDisbuBreakDown[];




    readonly classType: ClassObj[];
    readonly attTypes: AttType[];
}

const initialState: State = {};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {

        case Actions.INIT_E_CHIT:
            temp[action.token] = setInitialData(state[action.token], action.payload.inputData, action.payload.timeOffset);
            return { ...state, ...temp };

        case Actions.E_CHIT_CLEAR:

            const model = { ...clearModel(action.payload.timeOffset), matterRef: state[action.token].selectedMatterRefCode };

            temp[action.token] = {
                ...state[action.token],
                model: model,
                isSavingData: false,
                loading: false,
                formDataModel: {
                    ...state[action.token].formDataModel,
                    toMatterBalances: null,
                    // same as one office
                    // matterBalances: null,
                }
            };
            return { ...state, ...temp };



        case Actions.E_CHIT_MATTER_SEARCH_POUP_OPEN:

            temp[action.token] = {
                ...state[action.token],
                loading: true,
            };
            return { ...state, ...temp };

        case Actions.E_CHIT_MATTER_SEARCH_POUP_OPEN_SUCSEES:
            temp[action.token] = {
                ...state[action.token],
                matterRefData: action.payload.matterRefData,
                loading: false
            };
            return { ...state, ...temp };

        case Actions.E_CHIT_MATTER_SEARCH_POUP_OPEN_FAIL:

            temp[action.token] = {
                ...state[action.token],
                matterRefData: action.payload.matterRefData,
                loading: false,
                formDataModel: { ...state[action.token].formDataModel, matterBalances: null },
                selectedMatterRefCode: '',
                matterDetailsName: '',
            };
            return { ...state, ...temp };


        case Actions.E_CHIT_TO_MATTER_SEARCH_POUP_OPEN:

            temp[action.token] = {
                ...state[action.token],
                loading: true,
            };
            return { ...state, ...temp };

        case Actions.E_CHIT_TO_MATTER_SEARCH_POUP_OPEN_SUCSEES:

            temp[action.token] = {
                ...state[action.token],
                toMatterRefData: action.payload.toMatterRefData,
                loading: false,
            };
            return { ...state, ...temp };

        case Actions.E_CHIT_TO_MATTER_SEARCH_POUP_OPEN_FAIL:

            temp[action.token] = {
                ...state[action.token],
                toMatterRefData: action.payload.toMatterRefData,
                formDataModel: { ...state[action.token].formDataModel, toMatterBalances: null },
                loading: false,
            };
            return { ...state, ...temp };


        case Actions.E_CHIT_CLOSE:
            temp[action.token] = {
                ...state[action.token],
                close: true,
            };
            return { ...state, ...temp };

        case Actions.INIT_E_CHIT_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
                supplierDocEnables: action.payload.supplierDocEnables,
                clientDefaults: action.payload.clientDefaults,
                formDataModel: {
                    ...state[action.token].formDataModel,
                    eChitTypeList: action.payload.eChitTypes,

                },
            };
            return { ...state, ...temp };

        case Actions.E_CHIT_TYPE_CHANGE:
            temp[action.token] = viewChange(state[action.token], action);
            return { ...state, ...temp };

        case Actions.E_CHIT_TYPE_CHANGE_SUCCESS:
            temp[action.token] = viewDataUpdate(state[action.token], action);
            return { ...state, ...temp };

        case Actions.GET_MATTER_BALANCES:
            temp[action.token] = clearMatterBalances(state[action.token], action.payload);
            return { ...state, ...temp, };

        case Actions.GET_MATTER_BALANCES_SUCCESS:
            temp[action.token] = setMatterBalances(state[action.token], action.payload.controlName, action.payload.data);
            return { ...state, ...temp, };

        case Actions.ADD_ATTACHMENT:
            temp[action.token] = addAttachment(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.GET_SUPPLIER_VAT_CODE:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
            };
            return { ...state, ...temp };
        case Actions.GET_SUPPLIER_VAT_CODE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                sapullerVatCode: action.payload.data,
                loading: false,
            };
            return { ...state, ...temp };

        case Actions.INIT_E_CHIT_SAVE:
            temp[action.token] = {
                ...state[action.token],
                loading: true,
                isSavingData: true,
            };
            return { ...state, ...temp };

        case Actions.INIT_E_CHIT_SAVE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                isSaveSuccse: true,
                loading: false,
                isSavingData: false,
            };
            return { ...state, ...temp };

        case Actions.INIT_E_CHIT_SAVE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
                isSavingData: false,
            };
            return { ...state, ...temp };
        case Actions.GET_CLASS_TYPE:
            temp[action.token] = {
                ...state[action.token],
                loading: true
            };
            return {
                ...state, ...temp
            };
        case Actions.GET_CLASS_TYPE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
                classType: !!action.payload.list && action.payload.list.length > 0 ? action.payload.list.filter(i => !i.dateclsd) : []
            };
            return {
                ...state, ...temp
            };
        case Actions.GET_CLASS_TYPE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false
            };
            return {
                ...state, ...temp
            };
        case Actions.E_CHIT_CLEAR:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
            };
            return { ...state, ...temp };
        case Actions.CHANGE_DISBU_VALUE:
            temp[action.token] = changeDisb(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.CHANGE_DISBU_TYPES:
            temp[action.token] = changeDisbType(state[action.token], action.payload);
            return { ...state, ...temp };
        case Actions.ADD_PRECEDENT_H_DISBURSEMENT:
            temp[action.token] = {
                ...state[action.token],
                loading: true,
            };
            return { ...state, ...temp };

        case Actions.ADD_PRECEDENT_H_DISBURSEMENT_SUCCESS:
            temp[action.token] = clearDisbType(state[action.token], action.payload);
            return { ...state, ...temp };

        case Actions.ADD_PRECEDENT_H_DISBURSEMENT_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
            };
            return { ...state, ...temp };
        case Actions.GET_PRECEDENTH_INC_DISB_BREAK_DOWN:
            temp[action.token] = {
                ...state[action.token],
                loading: true,
            };
            return { ...state, ...temp };

        case Actions.GET_PRECEDENTH_INC_DISB_BREAK_DOWN_SUCCESS:
            temp[action.token] = IncDisbBreakDown(state[action.token], action.payload);
            return { ...state, ...temp };

        case Actions.GET_PRECEDENTH_INC_DISB_BREAK_DOWN_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
            };
            return { ...state, ...temp };

        case Actions.SAVE_DISBURCEMENT:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
            };
            return { ...state, ...temp };

        case Actions.LOAD_ATT_TYPE_LIST:
            temp[action.token] = {
                ...state[action.token],
                attTypes: []
            };
            return { ...state, ...temp };
        case Actions.LOAD_ATT_TYPE_LIST_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                attTypes: action.payload.attTypes
            };
            return { ...state, ...temp };

        case Actions.CHANGE_EXTRA_INPUT:
            temp[action.token] = {
                ...state[action.token],
                inputData: { ...state[action.token].inputData, ...action.input }
            };
            return { ...state, ...temp };
        case Actions.GET_DISBURSEMENT_TYPE:
            temp[action.token] = {
                ...state[action.token],
                loading: true,
            };
            return { ...state, ...temp };


        case Actions.GET_DISBURSEMENT_TYPE_SUCCESS:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
                formDataModel: {
                    ...state[action.token].formDataModel,
                    precedentHDisbursment: {
                        disbursmentTypeList: action.payload.disburcementTypes ? action.payload.disburcementTypes.precedentHDisbType : null,
                        workTypeList: action.payload.disburcementTypes ? action.payload.disburcementTypes.precedentHDisbWorkType : null,

                    }

                },
            };
            return { ...state, ...temp };

        case Actions.GET_DISBURSEMENT_TYPE_FAIL:
            temp[action.token] = {
                ...state[action.token],
                loading: false,
            };
            return { ...state, ...temp };

        default:
            {
                return state;
            }
    }
}


function viewChange(state: EChitState, action: Actions.EChitTypeChange): Partial<EChitState> {

    let newModel = { ...clearModel(action.payload.timeOffset), matterRef: state.selectedMatterRefCode };

    if (action.payload.workflowEchitData) {

        const typeValue = action.payload.workflowEchitData.postingTypeID;
        newModel = {
            ...clearModel(action.payload.timeOffset),
            typeValue: typeValue,
            matterRef: action.payload.workflowEchitData.matterRef
        };

        if (action.payload.workflowEchitData.postChequeData) {
            const data = action.payload.workflowEchitData.postChequeData;
            newModel = {
                typeValue: typeValue,
                matterRef: action.payload.workflowEchitData.matterRef,
                supplier: data.supplier,
                isSupplierVisible: data.isSupplierVisible, //
                isSupplier: false, //
                path: '', //
                vatCode: data.vatCode,
                net: data.net,
                vatAmount: data.vatAmount,
                gross: '0.00',
                rate: '0',
                isAlternativeCommand: data.isAlternativeCommand, //
                receiptType: data.receiptType, //
                payee: data.payee,
                payer: data.payer,
                feeEarner: data.feeEarner,
                dateRequired: dpsNewDate(action.payload.timeOffset),
                reason: data.reason,
                reference: data.reference,
                cqType: null, //
                cqAnticipated: false, //
                cqClient: false, //
                councelFees: '', // check box
                supplierRef: data.supplierRef,
                // notes: data.notes.replace('\r\n' , ' </br>'),
                notes: data.notes,
                isDoNotAddDiaryRecord: data.isDoNotAddDiaryRecord,
                isAddDiaryEvent: data.isAddDiaryEvent,
                isSinglePosting: data.isSinglePosting,
                invoiceRef: data.invoiceRef,
                supplierSearch: '',
                bankAccountName: data.bankAccountName,
                bankAcc: data.bankAcc,
                bankSortCode: data.bankSortCode,
                toMatterRef: '',
                textRef: '',
                isCouncelFees: data.isCouncelFees,
                isIncludeSupplier: data.isIncludeSupplier,
                nominal: data.nominal,
                branch: '',
                feeEarnerName: data.feeEarnerName,
                classId: 0,
                subClassId: 0,
                telephoneAdvice: false
            };
        }
    }

    const formDataModel = {
        ...state.formDataModel,
        // allwas true
        notesVisible: true,
        feeEarnerVisible: true,
        reasonVisible: true,


        invoiceRefVisible: false,
        receiptTypeVisible: false,
        branchVisible: false,
        matterRefVisible: false,
        supplierVisible: false,
        netVisible: false,
        vatAmountVisible: false,
        vatCodeVisible: false,
        payeeVisible: false,
        payerVisible: false,
        dateRequiredVisible: false,
        referenceVisible: false,
        supplierSearchVisible: false,
        invoiceDocNameVisible: false,
        toMatterRefVisible: false,
        textRefVisible: false,
        isCouncelFeesVisible: false,
        isIncludeSupplierVisible: false,
        referenceText: 'Reference',
        isVatVisible: false,
        banckDetailVisible: false,
        nominalVisible: false,
        dateRequiredText: 'Date Cheque needed',
        toMatterBalances: null,
        invoiceRefText: 'Invoice Ref',
        classId: 0,
        subClassId: 0,
        telephoneAdvice: false

        // same as one office
        // matterBalances: null,
    };



    const newState = { ...state, loading: true, model: newModel };

    switch (action.payload.eChitType) {

        case ChequeRequestType.DPU:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    invoiceRefVisible: true,
                    matterRefVisible: true,
                    // toMatterRefVisible: true,
                    payeeVisible: true,
                    dateRequiredVisible: true,
                    referenceVisible: true,
                    isCouncelFeesVisible: true,
                    feeEarnerVisible: true,
                    isVatVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    classId: 0,
                    subClassId: 0,
                    telephoneAdvice: false,
                    banckDetailVisible: true,  // added by precidentH changes
                },
            };

        case ChequeRequestType.DUU:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    isIncludeSupplierVisible: true,
                    invoiceRefVisible: true,
                    supplierVisible: true,
                    isCouncelFeesVisible: true,
                    matterRefVisible: true,
                    referenceText: 'Invoice No',
                    isVatVisible: true,
                    dateRequiredVisible: true,
                    dateRequiredText: 'Date needed',
                    netVisible: true,
                    invoiceRefText: 'Invoice No',
                    classId: 0,
                    subClassId: 0,
                    telephoneAdvice: false,
                    banckDetailVisible: true,  // added by precidentH changes
                },
            };

        case ChequeRequestType.CDR:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    referenceVisible: true,
                    banckDetailVisible: true,
                    matterRefVisible: true,
                    payeeVisible: true,
                    dateRequiredVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date Cheque needed',
                },
            };
        case ChequeRequestType.CCR:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    textRefVisible: true,
                    receiptTypeVisible: true,
                    matterRefVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    // payeeVisible: true,
                    // payeeText: 'Payer',
                    payerVisible: true,
                },
            };
        case ChequeRequestType.OCR:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    textRefVisible: true,
                    matterRefVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    payerVisible: true,
                    // payeeVisible: true,
                    // payeeText: 'Payer',
                },

            };
        case ChequeRequestType.DCR:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    matterRefVisible: true,
                    dateRequiredVisible: true,
                    isCouncelFeesVisible: true,
                    textRefVisible: true,
                    receiptTypeVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date Cheque needed',

                    payerVisible: true,
                    // payeeText: 'Payer',
                    // payeeVisible: true,
                },
            };
        case ChequeRequestType.CTO:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    // payeeText: 'Payer',
                    // payeeVisible: true,
                    textRefVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    matterRefVisible: true,
                    toMatterRefVisible: true,
                },
            };
        case ChequeRequestType.OTC:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    textRefVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    matterRefVisible: true,
                    toMatterRefVisible: true,
                },
            };
        case ChequeRequestType.OTO:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    textRefVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    matterRefVisible: true,
                    toMatterRefVisible: true,
                },
            };
        case ChequeRequestType.CTC:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    textRefVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    matterRefVisible: true,
                    toMatterRefVisible: true,
                },
            };
        case ChequeRequestType.DTC:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    textRefVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    matterRefVisible: true,
                    toMatterRefVisible: true,
                },
            };
        case ChequeRequestType.CTD:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    textRefVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    matterRefVisible: true,
                    toMatterRefVisible: true,
                },
            };
        case ChequeRequestType.OTN:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    textRefVisible: true,
                    dateRequiredVisible: true,
                    matterText: 'From Matter',
                    nominalVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date Cheque needed',
                    matterRefVisible: true,
                },
            };
        case ChequeRequestType.PIN:

            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    isVatVisible: true,
                    supplierSearchVisible: true,
                    isIncludeSupplierVisible: true,
                    referenceText: 'Invoice No',
                    textRefVisible: true,
                    // isCouncelFeesVisible: true,
                    nominalVisible: true,
                    // branchVisible: true,
                    netVisible: true,
                    dateRequiredText: 'Date needed',
                    dateRequiredVisible: true,
                    supplierVisible: true,
                    invoiceRefText: 'Invoice No',
                },
            };

        case ChequeRequestType.WidthMatterId:
            return {
                ...newState,
                formDataModel: {
                    ...formDataModel,
                    matterRefVisible: true,
                    // dateRequiredText: 'Date needed',
                    // dateRequiredVisible: true,
                    notesVisible: false,
                    feeEarnerVisible: false,
                    reasonVisible: false,
                },
            };

        default: {
            return {
                ...newState,
                formDataModel: { ...formDataModel },
            };
        }
    }
}


function changeDisbType(state: EChitState, changeValue) {

    let disbType: number = state.selectedDisbuTypes;
    let workType: number = state.selectedWorkType;
    switch (changeValue.kind) {

        case 'DISB_TYPE':
            disbType = changeValue.value;
            break;

        case 'WORK_TYPE':
            workType = changeValue.value;
            break;
    }
    return {
        ...state,
        selectedDisbuTypes: disbType,
        selectedWorkType: workType,
        disburcementValu: {
            disbuValue: 0.00,
            disbuVat: 0.00,
            feeValue: 0.00,
            feeVat: 0.00
        }
    };
}

function changeDisb(state: EChitState, changeValue) {
    let disbuValue: number = state.disburcementValu.disbuValue;
    let disbVat: number = state.disburcementValu.disbuVat;
    let feeValue: number = state.disburcementValu.feeValue;
    let feeVat: number = state.disburcementValu.feeVat;
    switch (changeValue.kind) {
        case 'DISB_VAL':
            disbuValue = changeValue.value;
            break;
        case 'DISB_VAT':
            disbVat = changeValue.value;
            break;
        case 'DISB_FEE_VAL':
            feeValue = changeValue.value;
            break;
        case 'DISB_FEE_VAT':
            feeVat = changeValue.value;
            break;

    }

    return {
        ...state,
        disburcementValu: {
            ...state.disburcementValu,
            disbuValue: Number(disbuValue),
            disbuVat: Number(disbVat),
            feeValue: Number(feeValue),
            feeVat: Number(feeVat),
        }


    };
}



function viewDataUpdate(state: EChitState, action: Actions.EChitTypeChangeSuccess): Partial<EChitState> {


    return {
        ...state,
        eChitType: action.payload.payload.eChitType,
        loading: false,
        model: updateModel(state.model, action),
        formDataModel:
        {
            ...state.formDataModel,

            clearanceTypesList: (action.payload.clearanceTypeList.length > 0) ?
                action.payload.clearanceTypeList : state.formDataModel.clearanceTypesList,

            referencesList: (action.payload.referencesList.length > 0) ?
                action.payload.referencesList : state.formDataModel.referencesList,

            vatCodeList: (action.payload.vatCodeList.length > 0) ?
                action.payload.vatCodeList : state.formDataModel.vatCodeList,

            branchList: (action.payload.branchList.length > 0) ?
                action.payload.branchList : state.formDataModel.branchList,

            payeeList: (action.payload.payeeList.length > 0) ?
                action.payload.payeeList : state.formDataModel.payeeList,

            payerList: (action.payload.payerList.length > 0) ?
                action.payload.payerList : state.formDataModel.payerList,

            reasonList: (action.payload.reasonList.length > 0) ?
                action.payload.reasonList : state.formDataModel.reasonList,

            feeEarnerList: (action.payload.feeEarneList.length > 0) ?
                action.payload.feeEarneList : state.formDataModel.feeEarnerList,

            nominalList: (action.payload.nominalList.length > 0) ?
                action.payload.nominalList : state.formDataModel.nominalList,

        },
    };
}


function updateModel(model: EchitModel, action: Actions.EChitTypeChangeSuccess): EchitModel {

    let branch = null;
    if (action.payload.branchList.length === 1) {
        branch = action.payload.branchList[0].branchId;
        return { ...model, branch: branch };
    }

    return model;
}





function clearMatterBalances(state: EChitState, payload: any): Partial<EChitState> {
    if (payload.controlName === 'matterRef') {
        return {
            ...state, formDataModel: { ...state.formDataModel, matterBalances: null }
            , loading: true, selectedMatterRefCode: payload.matterRef, matterDetailsName: payload.matterDetailsName
        };
    } else if (payload.controlName === 'toMatterRef') {
        return { ...state, formDataModel: { ...state.formDataModel, toMatterBalances: null }, loading: true, };
    }
    return { ...state };
}

function setMatterBalances(state: EChitState, controlName: string, data: any): Partial<EChitState> {
    if (controlName === 'matterRef') {
        return { ...state, formDataModel: { ...state.formDataModel, matterBalances: data }, loading: false };
    } else if (controlName === 'toMatterRef') {
        return { ...state, formDataModel: { ...state.formDataModel, toMatterBalances: data }, loading: false };
    }
    return { ...state };
}

function addAttachment(state: EChitState, file: File): Partial<EChitState> {
    return { ...state, formDataModel: { ...state.formDataModel, file: file } };
}

function IncDisbBreakDown(state: EChitState, IncDisb: IncDisbuBreakDown[]) {
    return {
        ...state,

        incDisbuBreakDown: IncDisb,
        loading: false,
    };
}

function clearDisbType(state: EChitState, IncDisb) {
    return {
        ...state,
        loading: false,
        disburcementValu: {
            disbuValue: 0.00,
            disbuVat: 0.00,
            feeValue: 0.00,
            feeVat: 0.00
        },
        selectedDisbuTypes: 0,
        selectedWorkType: 0,
        incDisbuBreakDown: null
    };
}

// function disbTypes(state: EChitState, disburcementTypes) {
//     return {
//         ...state,
//         loading: false,
//         formDataModel: {
//             ...state[action.token].formDataModel,
//             eChitTypeList: action.payload.eChitTypes,

//         },
//         precedentHDisbursment: {
//             disbursmentTypeList: disburcementTypes ? disburcementTypes.precedentHDisbType : null,
//             workTypeList: disburcementTypes ? disburcementTypes.precedentHDisbWorkType : null,

//         }

//     };
// }



function clearModel(timeOffset) {
    return {
        typeValue: '',
        matterRef: '',
        supplier: '',
        isSupplierVisible: false, //
        isSupplier: false, //
        path: '', //
        vatCode: '0',
        net: null,
        vatAmount: null,
        gross: '0.00',
        rate: '0',

        isAlternativeCommand: false, //
        receiptType: null, //
        payee: '',
        payer: '',
        feeEarner: null,
        dateRequired: dpsNewDate(timeOffset),
        reason: '',
        reference: null,
        cqType: null, //
        cqAnticipated: false, //
        cqClient: false, //
        councelFees: '', // check box
        supplierRef: '',
        notes: '',
        isDoNotAddDiaryRecord: false,
        isAddDiaryEvent: false,
        isSinglePosting: false,
        invoiceRef: '',
        supplierSearch: '',

        bankAccountName: '',
        bankAcc: '',
        bankSortCode: '',


        toMatterRef: '',
        textRef: '',
        isCouncelFees: false,
        isIncludeSupplier: true,
        nominal: '',
        branch: '',
        feeEarnerName: '',
        classId: 0,
        subClassId: 0,
        telephoneAdvice: false

    };
}



function setInitialData(state: EChitState, inputData: EChitPopupInput, timeOffset): Partial<EChitState> {

    let matterRef = '';
    if (inputData && inputData.matterId) {
        matterRef = inputData.matterId;
    }
    if (inputData && inputData.data && inputData.data.matterRef) {
        matterRef = inputData.data.matterRef;
    }

    const model = { ...clearModel(timeOffset), matterRef: matterRef };

    return {
        eChitType: null,
        loading: true,
        isDirty: false,
        isSaveSuccse: false,
        inputData: inputData,
        selectedMatterRefCode: matterRef,
        eChitOpenType: inputData.type,
        matterDetailsName: inputData.matterDetailsName,
        close: false,
        isSavingData: false,

        matterInfo: inputData.matterInfo,
        disburcementValu: {
            disbuValue: 0.00,
            disbuVat: 0.00,
            feeValue: 0.00,
            feeVat: 0.00
        },

        formDataModel:
        {
            eChitTypeList: null,
            clearanceTypesList: null,
            referencesList: null,
            vatCodeList: null,
            branchList: null,
            payeeList: null,
            payerList: null,
            reasonList: null,
            feeEarnerList: null,
            nominalList: null,
            matterBalances: null,
            toMatterBalances: null,


            invoiceRefVisible: false,
            receiptTypeVisible: false,
            branchVisible: false,
            matterRefVisible: false,
            toMatterRefVisible: false,
            supplierVisible: false,
            netVisible: false,
            vatAmountVisible: false,
            vatCodeVisible: false,
            payeeVisible: false,
            payerVisible: false,
            feeEarnerVisible: true,
            dateRequiredVisible: false,
            reasonVisible: false,
            referenceVisible: false,
            supplierSearchVisible: false,
            notesVisible: false,
            invoiceDocNameVisible: false,
            textRefVisible: false,

            isCouncelFeesVisible: false,
            isIncludeSupplierVisible: false,
            referenceText: 'Reference',
            payeeText: 'Payee',
            matterText: 'Matter Ref',
            dateRequiredText: 'Date Cheque needed',
            invoiceRefText: 'Invoice Ref',
            isVatVisible: false,
            banckDetailVisible: false,
            nominalVisible: false,
            file: null,
            classId: 0,
            subClassId: 0,
            precedentHDisbursment: null,
            telephoneAdvice: false
        },
        model: model,
    };
}

export const getView = (state: State) => state;
export const getViewByToken = (token) => createSelector(getView, (views) => views[token]);
export const getClearanceTypeListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formDataModel && !state.formDataModel.receiptTypeVisible) {
            return [];
        }
        return (state && state.formDataModel) ? state.formDataModel.clearanceTypesList : null;
    }
);
export const getReferencesListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formDataModel && !state.formDataModel.referenceVisible) {
            return [];
        }
        return (state && state.formDataModel) ? state.formDataModel.referencesList : null;
    }
);


export const getFeeEarnerListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formDataModel && !state.formDataModel.feeEarnerVisible) {
            return [];
        }
        return (state && state.formDataModel) ? state.formDataModel.feeEarnerList : null;
    }
);
export const getNominalListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formDataModel && !state.formDataModel.nominalVisible) {
            return [];
        }
        return (state && state.formDataModel) ? state.formDataModel.nominalList : null;
    }
);
export const getVatCodeListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formDataModel && !state.formDataModel.isVatVisible) {
            return [];
        }
        return (state && state.formDataModel) ? state.formDataModel.vatCodeList : null;
    }
);
export const getBranchListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formDataModel && !state.formDataModel.branchVisible) {
            return [];
        }
        return (state && state.formDataModel) ? state.formDataModel.branchList : null;
    }
);
export const getReasonListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        // if (state.formDataModel && !state.formDataModel.reasonVisible) {
        //     return [];
        // }
        return (state && state.formDataModel) ? state.formDataModel.reasonList : null;
    }
);
export const getPayeeListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formDataModel && !state.formDataModel.payeeVisible) {
            return [];
        }
        return (state && state.formDataModel) ? state.formDataModel.payeeList : null;
    }
);

export const getPayerListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formDataModel && !state.formDataModel.payerVisible) {
            return [];
        }
        return (state && state.formDataModel) ? state.formDataModel.payerList : null;
    }
);

export const getEChitTypeListByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return (state && state.formDataModel) ? state.formDataModel.eChitTypeList : null;
    }
);

export const getDisbursementTypeByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return (state && state.formDataModel) ? state.formDataModel.precedentHDisbursment : null;
    }
);


export const getFormDataModelByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.formDataModel : null);
export const getLoadingToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.loading : null);

export const getCloseToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.close : null);


export const getModelByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.model : null);
export const getSapullerVatCodeByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.sapullerVatCode : null);


export const getSupplierDocEnablesByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.supplierDocEnables : null);
export const getClientDefaultsByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.clientDefaults : null);
export const getInputDataByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.inputData : null);
export const getEChitTypeByToken = (token) => createSelector(getViewByToken(token), (state) => state ? state.eChitType : null);


export const getMatterDetailsNameByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.matterDetailsName : null);

export const getMatterRefDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.matterRefData : null);

export const getToMatterRefDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.toMatterRefData : null);


export const getOpenEChitOpenTypeByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.eChitOpenType : null);

export const getOpenEChitIsSavingDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.isSavingData : null);


export const getMatterInfoByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.matterInfo : null);

export const getDisbuTotalByToken = (token) => createSelector(getViewByToken(token), (state) => {
    let disbTotal = state.disburcementValu.disbuValue;

    if (state && state.disburcementValu.disbuVat) {

        disbTotal += Number(state.disburcementValu.disbuVat);
        return disbTotal;

    } else {
        return disbTotal;
    }
});


export const getFeeTotalByToken = (token) => createSelector(getViewByToken(token), (state) => {
    let feeTotal = state.disburcementValu.feeValue;

    if (state && state.disburcementValu.feeVat) {

        feeTotal += Number(state.disburcementValu.feeVat);
        return feeTotal;

    } else {
        return feeTotal;
    }
});

export const getDisburcementValuByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.disburcementValu : null);
export const getSelectedDisbuTypesByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.selectedDisbuTypes : null);
export const getSelectedWorkTypesByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.selectedWorkType : null);

export const getSelectedIncDisbuBreakDownByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.incDisbuBreakDown : null);


export const getClassTypeByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.classType : []);
export const getAttTypeListByToken = (token) => createSelector(getViewByToken(token),
    (state) => state ? state.attTypes : []);

