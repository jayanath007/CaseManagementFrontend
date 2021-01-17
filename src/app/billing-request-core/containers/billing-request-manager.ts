import { getPostingPeriod } from './../../setting-core/reducers/index';
import {
    InitPage, MatterDataChange, SelectTimePopupOpen,
    DisbursmentPopupOpen, TimeGridSelectRowUpdate,
    DisbursmentGridSelectRowUpdate, TimeGridSelectRowValueUpdate, DisbursmentGridSelectRowValueUpdate, TimeAndProfitProcess,
    TimeAndCostGridSelectRow, AllSelectUnselectWriteOffGridRow, AllocateSelectChangeValue, HeaderGridDoubleClick,
    AddProfitCostAndExpensePopupOpen, TimeAndProfitProcessSuccess, SetNarrativeItemText,
    DisbursmentAddHeaderRow,
    DisbursmentHeaderGridSelectRow,
    ProformaCheckChange,
    PrintSettingClick,
    GetQuickBillProcess,
    RemoveAllGridDataByType,
    SetControllerValue,
    BillingRequestSaveData,
    SavePrintMakeDefaultAllBill,
    SaveBillingAddress,
    ChangeBillingAddressType,
    SetPrintControllerValue,
    BillingRequestGridRowDelete,
    BillingRequestProfitCostGridRowEdit,
    BillingRequestExpenseGridRowEdit,
    BillingRequestDisbursmentRowEdit,
    DropDownSelectChangeValue,
    EditTimeEntryPopupOpen,
    EditTimeEntrySave,
    BillCheckChange,
    CheckIsValidDeleteRequest
} from '../actions/core';
import { ComponentBase } from '../../core/lib/component-base';
import { Store } from '@ngrx/store';
import {
    getMatterInfoByToken, getFeeEarnerList, getAllocateList, getMainLoaderState, getUserNominalCodeByToken,
    getVatCodeList, getDescriptionsList, getBillingRequestViewByToken, getTotalValuesByToken,
    getPrintAllDropDownData, getTimeHeaderGridOrderDataByToken, getclosePopupCount
} from '../reducers/index';
import { RequestFormTypes, ImportGridIsSelectVal } from '../models/enums';
import { getUser, User } from '../../auth';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export class BaseBillingRequestManager extends ComponentBase {
    public feeEarnerList$: any;
    public allocateList$: any;
    public vatCodeList$: any;
    public nominalCodeList$: any;
    public descriptionsList$: any;
    public matterInfo$: any;
    public requestViewData$: any;
    public totalValues$: any;
    public mainLoader$: any;
    public printAllDropDownData$: any;
    public postingPeriod$: any;
    public userNominalCode$: any;
    public timeHeaderGridOrderData$: any;
    public user$: Observable<User>;
    public closePopup$: any;

    constructor(protected store: Store<any>) {
        super();
    }
    // Billing request popup
    protected initSelectors(billingRequestToken: string, inputData: any) {

        this.user$ = this.store.select(getUser);
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new InitPage(billingRequestToken, {
                inputData: inputData,
                timeOffset: user.general.dateTimeOffset
            }));
        }).unsubscribe();
        // this.feeEarnerList$ = this.store.select(getFeeEarnerListByToken(billingRequestToken));
        // this.allocateList$ = this.store.select(getAllocateList);
        // this.vatCodeList$ = this.store.select(getVatCodeList);
        this.postingPeriod$ = this.store.select(getPostingPeriod());
        this.descriptionsList$ = this.store.select(getDescriptionsList);
        this.matterInfo$ = this.store.select(getMatterInfoByToken(billingRequestToken));
        this.requestViewData$ = this.store.select(getBillingRequestViewByToken(billingRequestToken));
        this.totalValues$ = this.store.select(getTotalValuesByToken(billingRequestToken));
        this.mainLoader$ = this.store.select(getMainLoaderState);
        this.timeHeaderGridOrderData$ = this.store.select(getTimeHeaderGridOrderDataByToken(billingRequestToken));
        this.closePopup$ = this.store.select(getclosePopupCount);
    }

    // ========  Import popup ===============================
    protected initImportPopup(billingRequestToken: string) {
        this.feeEarnerList$ = this.store.select(getFeeEarnerList);
        this.allocateList$ = this.store.select(getAllocateList);
        this.vatCodeList$ = this.store.select(getVatCodeList);
        // this.descriptionsList$ = this.store.select(getDescriptionsList);
        this.matterInfo$ = this.store.select(getMatterInfoByToken(billingRequestToken));
        this.requestViewData$ = this.store.select(getBillingRequestViewByToken(billingRequestToken));
        this.closePopup$ = this.store.select(getclosePopupCount);
    }
    // ========  Add data popup ===============================
    protected iniAddDataPopup(billingRequestToken: string) {
        this.user$ = this.store.select(getUser);
        this.feeEarnerList$ = this.store.select(getFeeEarnerList);
        this.vatCodeList$ = this.store.select(getVatCodeList);
        this.descriptionsList$ = this.store.select(getDescriptionsList);
        this.closePopup$ = this.store.select(getclosePopupCount);
        this.matterInfo$ = this.store.select(getMatterInfoByToken(billingRequestToken));
        this.requestViewData$ = this.store.select(getBillingRequestViewByToken(billingRequestToken));
        this.userNominalCode$ = this.store.select(getUserNominalCodeByToken(billingRequestToken));
    }
    // ========  Print Setting popup ===============================
    protected initPrintSettingPopup(billingRequestToken: string) {
        // this.matterInfo$ = this.store.select(getMatterInfoByToken(billingRequestToken));
        this.requestViewData$ = this.store.select(getBillingRequestViewByToken(billingRequestToken));
        this.closePopup$ = this.store.select(getclosePopupCount);
        this.printAllDropDownData$ = this.store.select(getPrintAllDropDownData);
    }
    // ========  Edit Time popup ===============================
    protected initEditTimePopup(billingRequestToken: string) {
        this.closePopup$ = this.store.select(getclosePopupCount);
        this.requestViewData$ = this.store.select(getBillingRequestViewByToken(billingRequestToken));
    }
    onRowSelect(billingRequestToken, value) {
        if (value.requestFormTypes === RequestFormTypes.selectTime) {
            this.store.dispatch(new TimeGridSelectRowUpdate(billingRequestToken, value.row, value.isMultiSelect));
        } else if (value.requestFormTypes === RequestFormTypes.selectDisbursement) {
            this.store.dispatch(new DisbursmentGridSelectRowUpdate(billingRequestToken, value.row, value.isMultiSelect));
        }
    }
    onRowValUpdate(billingRequestToken, value) {
        if (value.requestFormTypes === RequestFormTypes.selectTime) {
            this.store.dispatch(new TimeGridSelectRowValueUpdate(billingRequestToken, value.rowUpdateStatus));
        } else if (value.requestFormTypes === RequestFormTypes.selectDisbursement) {
            this.store.dispatch(new DisbursmentGridSelectRowValueUpdate(billingRequestToken, value.rowUpdateStatus));
        }
    }
    // =========================

    onCloseRequestPopup(billingRequestToken, info) {
        // this.store.dispatch(new xxxxxxx(myToken));
    }
    setMatterData(billingRequestToken: string, matterData: any) {
        this.user$.pipe(take(1)).subscribe(user => {
            this.store.dispatch(new MatterDataChange(billingRequestToken,
                { matterData: matterData, timeOffset: user.general.dateTimeOffset }));
        }).unsubscribe();
    }
    importPopupOpen(billingRequestToken: string, formType) {
        if (formType === RequestFormTypes.selectTime) {
            this.store.dispatch(new SelectTimePopupOpen(billingRequestToken, formType));
        } else if (formType === RequestFormTypes.selectDisbursement) {
            this.store.dispatch(new DisbursmentPopupOpen(billingRequestToken, formType));
        }
    }
    onTimeOkButtonClick(token, model) {
        if (model.recordType === RequestFormTypes.selectTime) {
            this.store.dispatch(new TimeAndProfitProcess(token, model));
        } else {
            this.store.dispatch(new DisbursmentAddHeaderRow(token, { disbsAndExpenseHeaderGridDataModel: model }));
        }
    }
    onProfitCostOkButtonClick(token, model) {
        if (model.popupType === RequestFormTypes.profitCost) {
            this.store.dispatch(new TimeAndProfitProcessSuccess(token, { timeProfitHeaderDataViewModel: model.dataModel }));
        } else if (model.popupType === RequestFormTypes.expense) {
            this.store.dispatch(new DisbursmentAddHeaderRow(token, { disbsAndExpenseHeaderGridDataModel: model.dataModel }));
        }
    }
    onTimeAndCostGridSelectRowUpdate(token, row) {
        if (row && row.isTimeHeaderGrid) {
            this.store.dispatch(new TimeAndCostGridSelectRow(token, row));
        } else if (row && row.isDisbursmenGrid) {
            this.store.dispatch(new DisbursmentHeaderGridSelectRow(token, row));
        }
    }
    onSelectUnselectWriteOff(token, selectType: ImportGridIsSelectVal) {
        this.store.dispatch(new AllSelectUnselectWriteOffGridRow(token, selectType));
    }
    onAllocateSelectChangeValue(token, selectValue) {
        this.store.dispatch(new AllocateSelectChangeValue(token, selectValue));
    }
    onHeaderGridRowDoubleClick(token, selectDataModel) {
        this.store.dispatch(new HeaderGridDoubleClick(token, selectDataModel));
    }
    onNarrativeItemTextChange(token: string, inputText) {
        this.store.dispatch(new SetNarrativeItemText(token, inputText));
    }
    onAddDataPopupOpen(token: string, input) {
        if (input.formType === RequestFormTypes.profitCost) {
            this.store.dispatch(new AddProfitCostAndExpensePopupOpen(token, input.formType));
        } else if (input.formType === RequestFormTypes.expense) {
            this.store.dispatch(new AddProfitCostAndExpensePopupOpen(token, input.formType));
            // this.store.dispatch(new AddExpenseRowDataPopupOpen(token, input.formType));
        }
    }
    onProformaCheckChange(token, value) {
        this.store.dispatch(new ProformaCheckChange(token, value));
    }
    onBillCheckChange(token, value) {
        this.store.dispatch(new BillCheckChange(token, value));
    }
    onOpenPrintSettingPopup(token) {
        this.store.dispatch(new PrintSettingClick(token));
    }
    onPrintOptionSaveAddressData(token, values) {
        this.store.dispatch(new SaveBillingAddress(token, values));
    }
    onUpdatePrintControllersValue(token, keyValue) {
        this.store.dispatch(new SetPrintControllerValue(token, { controllerDataModel: keyValue }));
    }
    onPrintMakeDefaultAllBillClick(token) {
        this.store.dispatch(new SavePrintMakeDefaultAllBill(token));
    }
    onAddToQuickBillProcess(token, model) {
        this.store.dispatch(new GetQuickBillProcess(token, model));
    }
    onRemoveAllGridData(token, gridType) {
        this.store.dispatch(new RemoveAllGridDataByType(token, gridType));
    }
    onUpdateControllerValues(token, model) {
        this.store.dispatch(new SetControllerValue(token, { controllerDataModel: model }));
    }
    onBillingRequestSaveData(token, totalsAndbuttonTypeModel) {
        this.store.dispatch(new BillingRequestSaveData(token,
            {
                totalsAndbuttonTypeModel:
                    { totalValues: totalsAndbuttonTypeModel.totalValues, buttonTypeText: totalsAndbuttonTypeModel.buttonTypeText }
            }));
    }
    onBillingAddressTypeChangeClick(token, selectedType) {
        this.store.dispatch(new ChangeBillingAddressType(token, selectedType));
    }
    onBillingRequestEditRowClick(token, model) {
        if (model.popupType === RequestFormTypes.profitCost && model.rowId) {
            this.store.dispatch(new BillingRequestProfitCostGridRowEdit(token,
                { rowId: model.rowId, timeProfitHeaderModel: model.dataModel }));
        } else if (model.popupType === RequestFormTypes.expense && model.rowId) {
            this.store.dispatch(new BillingRequestExpenseGridRowEdit(token,
                { rowId: model.rowId, disbsAndExpenseHeaderModel: model.dataModel }));
        } else if (model.popupType === RequestFormTypes.selectDisbursement && model.rowId) {
            this.store.dispatch(new BillingRequestDisbursmentRowEdit(token,
                { rowId: model.rowId, disbursmentEditData: model.dataModel }));
        }
    }
    onBillingRequestDeleteRowClick(token, formTypeAndRowID) {
        this.store.dispatch(new BillingRequestGridRowDelete(token, { formTypeAndRowID: formTypeAndRowID }));
    }
    onDropDownValueChange(token, valueModel) {
        this.store.dispatch(new DropDownSelectChangeValue(token,
            { propertyName: valueModel.propertyName, selectedValue: valueModel.selectedValue }));
    }
    onTimeEntryEditData(token, rowData) {
        this.store.dispatch(new EditTimeEntryPopupOpen(token,
            { rowData: rowData }));
    }
    onTimeEntryEditSaveData(token, timeEditModel) {
        this.store.dispatch(new EditTimeEntrySave(token,
            { timeEditModel: timeEditModel }));
    }
    deleteBillRequest(token: string) {
        this.store.dispatch(new CheckIsValidDeleteRequest(token));
    }
}

