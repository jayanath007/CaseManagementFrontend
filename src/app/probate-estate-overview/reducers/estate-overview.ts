import { createSelector } from '@ngrx/store';
import * as Actions from '../actions/core';
import { Dictionary } from '../../core';
import * as FormControllersArray from '../form-controllers/form-controllers';
import { CommonControllerTypes, FormType, ItemChangeProperty, Mode, RedeemedCategoryCode, SaleofShareCategoryCode } from '../models/enums';
import {
    CategoryItem, ContactDetails, EstateOverviewModel,
    ProbateCategoryList,
    PaymentGridDataModel,
    ProbCategoryWishControllersData,
    FormControllerData,
    EditPaymentGridData,
    AssetItemForDropDown
} from '../models/interfce';

export interface State {
    readonly views: Dictionary<EstateOverviewState>;
}
export interface EstateOverviewState {
    readonly pELoading: boolean;
    readonly isDirty: boolean;
    readonly matterData: {
        branchId: number,
        appId: number,
        fileId: number
    };
    readonly formControllersArray: ProbCategoryWishControllersData[];
    readonly selectedformControllersByCategory: ProbCategoryWishControllersData;
    readonly estateOverviewCategory: ProbateCategoryList;
    readonly estateOverviewModel: EstateOverviewModel;
    readonly paymentGridModel: PaymentGridDataModel<EditPaymentGridData>[];
    // readonly paymentGridModel: TransactionItems[];
    readonly formType: FormType;
    readonly mode: Mode;
    readonly selectedCategory: CategoryItem;
    readonly contactDetails: ContactDetails;
    readonly liabilityAssetForDropDown: AssetItemForDropDown[];
    readonly exemptionAssetForDropDown: AssetItemForDropDown[];
    readonly isDiscriptionChange: boolean;
    readonly saleTypeText: string;
}
const initialState: State = {
    views: {}
};
export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_PROBATE_ESTATE_OVERVIEW:
            temp[action.token] = setInitData(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ESTATE_OVERVIEW_CATEGORY_LIST:
            temp[action.token] = getEOCategory(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ESTATE_OVERVIEW_CATEGORY_LIST_SUCCESS:
            temp[action.token] = getEOCategorySuccess(state.views[action.token], action.payload.categoryList);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ESTATE_OVERVIEW_CATEGORY_LIST_FAIL:
            temp[action.token] = getEOCategoryFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: true,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
                liabilityAssetForDropDown: (state.views[action.token].formType === FormType.Liability) ?
                    action.payload.assetItemForDropDown : [],
                exemptionAssetForDropDown: (state.views[action.token].formType === FormType.Exemption) ?
                    action.payload.assetItemForDropDown : []
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ESTATE_OVERVIEW_OWNED_ASSET_LIST_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_UPDATE_MASTER_VALUE:
            temp[action.token] = updateMasterModelData(state.views[action.token], action.payload.property, action.payload.value);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_UPDATE_MODEL:
            temp[action.token] = updateModel(state.views[action.token], action.payload.type, action.payload.property, action.payload.value);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_PAYMENT_GRID_UPDATE:
            temp[action.token] = setGridData(state.views[action.token], action.payload.rowData);
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.ESTATE_OVERVIEW_SET_SELECTED_CATEGORY:
            temp[action.token] = {
                ...state.views[action.token],
                selectedCategory: action.selectedItem,
                estateOverviewModel: { ...state.views[action.token].estateOverviewModel, category: action.selectedItem.id },
                saleTypeText: setSaleType(action.selectedItem, state.views[action.token].formType)
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        case Actions.ESTATE_OVERVIEW_UPDATE_CONTACT:
            temp[action.token] = {
                ...state.views[action.token],
                contactDetails: action.payload.contactDetails,
                estateOverviewModel: {
                    ...state.views[action.token].estateOverviewModel,
                    contactId: action.payload.contactDetails.contactId
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_REMOVE_CONTACT:
            temp[action.token] = {
                ...state.views[action.token],
                contactDetails: {
                    contactId: 0,
                    letterTitle: '',
                    name: '',
                    address: '',
                    postCode: ''
                },
                estateOverviewModel: {
                    ...state.views[action.token].estateOverviewModel,
                    contactId: 0
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ESTATE_OVERVIEW_CATEGORY_LIST_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_ESTATE_OVERVIEW_CATEGORY_LIST_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_SAVE:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: true,
                isDirty: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_SAVE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
                estateOverviewModel: {
                    ...state.views[action.token].estateOverviewModel,
                    probateTransId: action.payload.probateTransId
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_SAVE_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EO_EDIT_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: true,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EO_EDIT_DATA_SUCCESS:
            temp[action.token] = setEditData(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.GET_EO_EDIT_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_INPUT_VALUE_CHANGE:
            temp[action.token] = inputValueChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: true,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
                paymentGridModel: state.views[action.token].paymentGridModel.filter(item => item.rowId !== action.rowId)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_DELETE_ACCOUNT_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                pELoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.ESTATE_OVERVIEW_GRID_SELECT_ROW:
            temp[action.token] = {
                ...state.views[action.token],
                paymentGridModel: state.views[action.token].paymentGridModel
                    .map(val => {
                        return Object.freeze({
                            ...val,
                            selected: (val.rowId === action.row.rowId) ? true : false
                        });
                    })
            };
            return {
                ...state,
                views: { ...state.views, ...temp }
            };
        default:
            { return state; }
    }
}
function setInitData(state: EstateOverviewState, action: Actions.InitEstateOverview): Partial<EstateOverviewState> {
    // if (!state) {
    return {
        ...state,
        pELoading: false,
        isDirty: false,
        formControllersArray: FormControllersArray.categoryWishControllersData,
        selectedformControllersByCategory: null,
        matterData: action.payload.inputData.matterData,
        formType: action.payload.inputData.formType,
        mode: action.payload.inputData.mode,
        selectedCategory: null,
        paymentGridModel: [],
        estateOverviewModel: action.payload.inputData ?
            initializeModel(action.payload.inputData.formType, action.payload.inputData.matterData) : null,
        // estateOverviewModel: action.payload.inputData.mode === Mode.AddMode ?
        //     initializeModel(action.payload.inputData.formType, action.payload.inputData.matterData) : null,
        contactDetails: {
            contactId: 0,
            letterTitle: '',
            name: '',
            address: '',
            postCode: ''

        },
        liabilityAssetForDropDown: [],
        exemptionAssetForDropDown: [],
        isDiscriptionChange: true,
        saleTypeText: 'Sell'
    };
    // }
    // return state;
}
function setGridData(state: EstateOverviewState, gridData: PaymentGridDataModel<EditPaymentGridData>): Partial<EstateOverviewState> {
    let newList: PaymentGridDataModel<EditPaymentGridData>[] = [];
    newList = state.paymentGridModel ? state.paymentGridModel : [];
    const existItem = state.paymentGridModel ? state.paymentGridModel.find(item => item.rowId === gridData.rowId) : null;
    if (existItem) {
        newList = newList.map(rowItem => {
            if (rowItem.rowId === gridData.rowId) {
                return gridData;
            } else {
                return rowItem;
            }
        });
    } else {
        newList.push(gridData);
    }
    return ({
        ...state,
        pELoading: false,
        paymentGridModel: newList // newList.concat(gridData)
    });
}
function getEOCategory(state: EstateOverviewState): Partial<EstateOverviewState> {
    return Object.freeze({
        ...state,
        pELoading: true,
    });
}
function getEOCategorySuccess(state: EstateOverviewState, categoryList: ProbateCategoryList): Partial<EstateOverviewState> {
    return Object.freeze({
        ...state,
        pELoading: false,
        estateOverviewCategory: categoryList
    });
}
function getEOCategoryFail(state: EstateOverviewState): Partial<EstateOverviewState> {
    return Object.freeze({
        ...state
        , pELoading: false
    });
}
function setEditData(state: EstateOverviewState, action: Actions.GetEditDataSuccess): Partial<EstateOverviewState> {
    const editFormType = action.payload.editData.probateEntryType === 0 ? FormType.Asset :
        action.payload.editData.probateEntryType === 1 ? FormType.Liability :
            action.payload.editData.probateEntryType === 2 ? FormType.Exemption :
                action.payload.editData.probateEntryType === 3 ? FormType.Gift : null;

    let newList: PaymentGridDataModel<EditPaymentGridData>[] = [];
    newList = state.paymentGridModel ? state.paymentGridModel : [];
    // if (action.payload.editData.transactionItems.length > 0) {
    //     const newLists = action.payload.editData.transactionItems.map(item => ({
    //         data: item,
    //         rowId: item.id,
    //         selected: false
    //     }));
    // }
    return Object.freeze({
        ...state,
        pELoading: false,
        selectedformControllersByCategory: state.formControllersArray ? (state.formControllersArray.filter(
            item => (item.categoryId === action.payload.editData.category && item.formType === editFormType)
        ))[0] : null,
        formType: action.payload.editData.probateEntryType === 0 ? FormType.Asset :
            action.payload.editData.probateEntryType === 1 ? FormType.Liability :
                action.payload.editData.probateEntryType === 2 ? FormType.Exemption :
                    action.payload.editData.probateEntryType === 3 ? FormType.Gift : null,
        selectedCategory: { id: action.payload.editData.category, description: '' },
        estateOverviewModel: setEditModel(state.matterData, action.payload.editData),
        contactDetails: setContactData(action.payload.editData),
        isDiscriptionChange: false,
        saleTypeText: setSaleType({ id: action.payload.editData.category, description: '' }, editFormType),
        paymentGridModel: newList.concat(action.payload.editData.transactionItems.
            map(item => ({
                data: item,
                rowId: item.id,
                selected: false
            })))
    });
}
function updateModel(state: EstateOverviewState, type: CommonControllerTypes, property: string, value) {
    if (state && state.estateOverviewModel) {
        const temp = {};
        temp[property] = value;
        return {
            ...state,
            isDirty: true,
            estateOverviewModel: {
                ...state.estateOverviewModel,
                itemData: {
                    ...state.estateOverviewModel.itemData, ...temp
                }
            }
        };
    }
    return state;
}
function updateMasterModelData(state: EstateOverviewState, property: string, value) {
    if (state && state.estateOverviewModel) {
        const temp = {};
        temp[property] = value;
        return {
            ...state,
            isDiscriptionChange: (property === 'description' && !!value) ? false : true,
            estateOverviewModel: {
                ...state.estateOverviewModel, ...temp
            }
        };
    }
    return state;
}

function inputValueChange(state: EstateOverviewState, action: Actions.InputValueChange): Partial<EstateOverviewState> {
    const temp: any = {};
    switch (action.payload.property) {
        case ItemChangeProperty.Category:
            return {
                ...state,
                selectedformControllersByCategory: state.formControllersArray ? (state.formControllersArray.filter(
                    item => (item.categoryId === action.payload.value && item.formType === state.formType)
                ))[0] : null
            };

        case ItemChangeProperty.BankOrBuildingSociety:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    description: state.isDiscriptionChange ? ((action.payload.value ? action.payload.value + ' ' : '') +
                        (state.estateOverviewModel.itemData['bankAccountNo'] ?
                            state.estateOverviewModel.itemData['bankAccountNo'] : ''))
                        : state.estateOverviewModel.description,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        bankOrBuildingSociety: action.payload.value
                    }
                }
            };
        case ItemChangeProperty.BankAccountNo:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    description: state.isDiscriptionChange ? (state.estateOverviewModel.itemData['bankOrBuildingSociety'] ?
                        (state.estateOverviewModel.itemData['bankOrBuildingSociety'] +
                            (action.payload.value ? ' ' + action.payload.value : '')) : action.payload.value)
                        : state.estateOverviewModel.description,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        bankAccountNo: action.payload.value
                    }
                }
            };
        case ItemChangeProperty.BankAmountHeld:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        bankAmountHeld: action.payload.value,
                        totalBank: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['bankInterest'] ?
                                +state.estateOverviewModel.itemData['bankInterest'] : 0)
                    }
                }
            };
        case ItemChangeProperty.BankInterest:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        bankInterest: action.payload.value,
                        totalBank: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['bankAmountHeld'] ?
                                +state.estateOverviewModel.itemData['bankAmountHeld'] : 0)
                    }
                }
            };
        // 32
        case ItemChangeProperty.Capital:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        capital: action.payload.value,
                        totalCapitalInterest: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['interest'] ?
                                +state.estateOverviewModel.itemData['interest'] : 0)
                    }
                }
            };
        case ItemChangeProperty.Interest:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        interest: action.payload.value,
                        totalCapitalInterest: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['capital'] ?
                                +state.estateOverviewModel.itemData['capital'] : 0)
                    }
                }
            };
        // cal 8
        case ItemChangeProperty.NationalSavingsAmountHeld:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        nationalSavingsAmountHeld: action.payload.value,
                        nationalSavingsTotal: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['nationalSavingsInterest'] ?
                                +state.estateOverviewModel.itemData['nationalSavingsInterest'] : 0)
                    }
                }
            };
        case ItemChangeProperty.NationalSavingsInterest:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        nationalSavingsInterest: action.payload.value,
                        nationalSavingsTotal: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['nationalSavingsAmountHeld'] ?
                                +state.estateOverviewModel.itemData['nationalSavingsAmountHeld'] : 0)
                    }
                }
            };
        // cal 9
        case ItemChangeProperty.BondValue:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        bondValue: action.payload.value,
                        totalBondValue: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['valueUnclaimedPrizes'] ?
                                +state.estateOverviewModel.itemData['valueUnclaimedPrizes'] : 0)
                    }
                }
            };
        case ItemChangeProperty.ValueUnclaimedPrizes:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        valueUnclaimedPrizes: action.payload.value,
                        totalBondValue: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['bondValue'] ?
                                +state.estateOverviewModel.itemData['bondValue'] : 0)
                    }
                }
            };
        // cal 20,21,22,23,24
        case ItemChangeProperty.NoOfShares:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        noOfShares: action.payload.value,
                        totalValueOfShares: +((action.payload.value ? +action.payload.value : 0) *
                            (state.estateOverviewModel.itemData['marketPriceOfShare'] ?
                                +state.estateOverviewModel.itemData['marketPriceOfShare'] : 0)).toFixed(2)
                    }
                }
            };
        case ItemChangeProperty.MarketPriceOfShare:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        marketPriceOfShare: action.payload.value,
                        totalValueOfShares: +((action.payload.value ? +action.payload.value : 0) *
                            (state.estateOverviewModel.itemData['noOfShares'] ?
                                +state.estateOverviewModel.itemData['noOfShares'] : 0)).toFixed(2)
                    }
                }
            };
        case ItemChangeProperty.IsRateOfBR100:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        isRateOfBR100: action.payload.value,
                        isRateOfBR50: !action.payload.value,
                        isRateOfBR0: !action.payload.value
                    }
                }
            };
        case ItemChangeProperty.IsRateOfBR50:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        isRateOfBR100: !action.payload.value,
                        isRateOfBR50: action.payload.value,
                        isRateOfBR0: !action.payload.value
                    }
                }
            };
        case ItemChangeProperty.IsRateOfBR0:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        isRateOfBR100: !action.payload.value,
                        isRateOfBR50: !action.payload.value,
                        isRateOfBR0: action.payload.value
                    }
                }
            };
        // 18/19
        case ItemChangeProperty.AmountOfStockHeld:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        amountOfStockHeld: action.payload.value,
                        totalValueOfStock: +((action.payload.value ? +action.payload.value : 0) *
                            (state.estateOverviewModel.itemData['marketPricePerUnit'] ?
                                +state.estateOverviewModel.itemData['marketPricePerUnit'] : 0)).toFixed(2)
                    }
                }
            };
        case ItemChangeProperty.MarketPricePerUnit:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        marketPricePerUnit: action.payload.value,
                        totalValueOfStock: +((action.payload.value ? +action.payload.value : 0) *
                            (state.estateOverviewModel.itemData['amountOfStockHeld'] ?
                                +state.estateOverviewModel.itemData['amountOfStockHeld'] : 0)).toFixed(2)
                    }
                }
            };
        // 27/28
        case ItemChangeProperty.ValueForeignCurrency:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        valueForeignCurrency: action.payload.value,
                        valueSterling: +((action.payload.value ? +action.payload.value : 0) *
                            (state.estateOverviewModel.itemData['exchangeRate'] ?
                                +state.estateOverviewModel.itemData['exchangeRate'] : 0)).toFixed(2)
                    }
                }
            };
        case ItemChangeProperty.ExchangeRate:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        exchangeRate: action.payload.value ? action.payload.value : 0,
                        valueSterling: +((action.payload.value ? +action.payload.value : 0) *
                            (state.estateOverviewModel.itemData['valueForeignCurrency'] ?
                                +state.estateOverviewModel.itemData['valueForeignCurrency'] : 0)).toFixed(2)
                    }
                }
            };
        // Funeral
        case ItemChangeProperty.FuneralCosts:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        funeralCosts: action.payload.value,
                        totalFuneral: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['headstone'] ?
                                +state.estateOverviewModel.itemData['headstone'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue1'] ?
                                +state.estateOverviewModel.itemData['funeralValue1'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue2'] ?
                                +state.estateOverviewModel.itemData['funeralValue2'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue3'] ?
                                +state.estateOverviewModel.itemData['funeralValue3'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue4'] ?
                                +state.estateOverviewModel.itemData['funeralValue4'] : 0)
                    }
                }
            };
        case ItemChangeProperty.Headstone:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        headstone: action.payload.value,
                        totalFuneral: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['funeralCosts'] ?
                                +state.estateOverviewModel.itemData['funeralCosts'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue1'] ?
                                +state.estateOverviewModel.itemData['funeralValue1'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue2'] ?
                                +state.estateOverviewModel.itemData['funeralValue2'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue3'] ?
                                +state.estateOverviewModel.itemData['funeralValue3'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue4'] ?
                                +state.estateOverviewModel.itemData['funeralValue4'] : 0)
                    }
                }
            };
        case ItemChangeProperty.FuneralValue1:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        funeralValue1: action.payload.value,
                        totalFuneral: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['funeralCosts'] ?
                                +state.estateOverviewModel.itemData['funeralCosts'] : 0) +
                            (state.estateOverviewModel.itemData['headstone'] ?
                                +state.estateOverviewModel.itemData['headstone'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue2'] ?
                                +state.estateOverviewModel.itemData['funeralValue2'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue3'] ?
                                +state.estateOverviewModel.itemData['funeralValue3'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue4'] ?
                                +state.estateOverviewModel.itemData['funeralValue4'] : 0)
                    }
                }
            };
        case ItemChangeProperty.FuneralValue2:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        funeralValue2: action.payload.value,
                        totalFuneral: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['funeralCosts'] ?
                                +state.estateOverviewModel.itemData['funeralCosts'] : 0) +
                            (state.estateOverviewModel.itemData['headstone'] ?
                                +state.estateOverviewModel.itemData['headstone'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue1'] ?
                                +state.estateOverviewModel.itemData['funeralValue1'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue3'] ?
                                +state.estateOverviewModel.itemData['funeralValue3'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue4'] ?
                                +state.estateOverviewModel.itemData['funeralValue4'] : 0)
                    }
                }
            };
        case ItemChangeProperty.FuneralValue3:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        funeralValue3: action.payload.value,
                        totalFuneral: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['funeralCosts'] ?
                                +state.estateOverviewModel.itemData['funeralCosts'] : 0) +
                            (state.estateOverviewModel.itemData['headstone'] ?
                                +state.estateOverviewModel.itemData['headstone'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue1'] ?
                                +state.estateOverviewModel.itemData['funeralValue1'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue2'] ?
                                +state.estateOverviewModel.itemData['funeralValue2'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue4'] ?
                                +state.estateOverviewModel.itemData['funeralValue4'] : 0)
                    }
                }
            };
        case ItemChangeProperty.FuneralValue4:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        funeralValue4: action.payload.value,
                        totalFuneral: (action.payload.value ? +action.payload.value : 0) +
                            (state.estateOverviewModel.itemData['funeralCosts'] ?
                                +state.estateOverviewModel.itemData['funeralCosts'] : 0) +
                            (state.estateOverviewModel.itemData['headstone'] ?
                                +state.estateOverviewModel.itemData['headstone'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue1'] ?
                                +state.estateOverviewModel.itemData['funeralValue1'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue2'] ?
                                +state.estateOverviewModel.itemData['funeralValue2'] : 0) +
                            (state.estateOverviewModel.itemData['funeralValue3'] ?
                                +state.estateOverviewModel.itemData['funeralValue3'] : 0)
                    }
                }
            };
        case ItemChangeProperty.IsAgriRelief:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        isAgriRelief: action.payload.value,
                        isBusinessRelief: !action.payload.value,
                    }
                }
            };
        case ItemChangeProperty.IsBusinessRelief:
            return {
                ...state,
                estateOverviewModel: {
                    ...state.estateOverviewModel,
                    itemData: {
                        ...state.estateOverviewModel.itemData,
                        isBusinessRelief: action.payload.value,
                        isAgriRelief: !action.payload.value,
                    }
                }
            };
        default:
            {
                return state;
            }
    }
}
function initializeModel(formType: FormType, matterData: { branchId: number, appId: number, fileId: number }): EstateOverviewModel {
    const estateOverviewMode: EstateOverviewModel = {
        branchId: matterData.branchId,
        appId: matterData.appId,
        fileId: matterData.fileId,
        probateTransId: 0,
        probateEntryType: (formType === FormType.Asset) ? 0 :
            (formType === FormType.Liability) ? 1 : (formType === FormType.Exemption) ? 2 : (formType === FormType.Gift) ? 3 : -1,
        category: 0,
        dealtBy: 0,
        contactId: 0,
        roleId: 0,
        description: '',
        spouceCivilPartnerExemption: false,
        charityExemption: false,
        transactionItems: [],
        contactInfo: null,
        itemData: formType === FormType.Asset ?
            {
                jewelleryMarketValue: 0,
                vehicleManufacturer: null,
                vehicleModel: null,
                yearOfManufacture: null,
                regNumber: null,
                condition: null,
                openMarketValue: null,
                total: null,
                pensionTotal: null,
                isPensionChanges2Years: false,
                itemGivenTo: null,
                whatDeceasedDidWithProceeds: null,
                bankOrBuildingSociety: null,
                bankAccountNo: null,
                totalBank: null,
                bankAmountHeld: null,
                bankInterest: null,
                typeOfAccount: null,
                nationalSavingsAccountNo: null,
                nationalSavingsTotal: null,
                nationalSavingsAmountHeld: null,
                nationalSavingsInterest: null,
                bondNo: null,
                bondValue: null,
                valueUnclaimedPrizes: null,
                totalBondValue: null,
                otherTypeOfAccount: null,
                certificateNo: null,
                otherNationalAmount: null,
                propertyItemNo: null,
                residencePostCode: null,
                tenure: null,
                detailsOfLettings: null,
                valueOfAgriBusiness: 0,
                openMarketValueProperty: null,
                buildingLandType: null,
                isAgriRelief: false,
                isBusinessRelief: false,
                isRnrbOwnedByDeceased: false,
                isRnrbInheritedByDescendents: false,
                jointAssetType: null,
                jointAssetIDNo: null,
                jointOwner: null,
                isJointNotApplicable: false,
                jointOwnershipStartDate: null,
                jointContribution: null,
                jointShare: null,
                jointValueDateOfDeath: null,
                jointDeceasedShare: null,
                nameOfCharity: null,
                valueOfCharityItems: null,
                amountOfStockHeld: null,
                marketPricePerUnit: null,
                totalValueOfStock: null,
                interestOrDividendDue: null,
                noOfShares: null,
                marketPriceOfShare: null,
                totalValueOfShares: null,
                dividendDue: null,
                isOwnedForTwoYearsYes: false,
                amountOfBrDue: null,
                isRateOfBR100: false,
                isRateOfBR50: false,
                isRateOfBR0: false,
                valueForeignCurrency: null,
                exchangeRate: null,
                valueSterling: null,
                totalCapitalInterest: null,
                capital: null,
                interest: null,
                payableInsuranceCompany: null,
                payablePolicyNo: null,
                amountPayable: null,
                lifeAssuranceCompany: null,
                lifeAssurancePolicyNo: null,
                personAssured: null,
                valueLifeAssurance: null,
                companyThatProvidedPolicy: null,
                frequencyOfPayments: null,
                detailsOfIncrease: null,
                finalPaymentDate: null, // new Date(),
                valueOfPayment: null,
                lumpSumCompany: null,
                explaination: null,
                valueLumpSum: null,
                partnershipValue: null,
                partnershipRelief: null
            } : formType === FormType.Liability ?
                {
                    total: 0,
                    jointLiabilities: null,
                    jointLiabilityCreditor: null,
                    jointLiabilityAmount: null,
                    jointLiabilityShare: null,
                    isAMortgage: false,
                    mortgageCreditor: null,
                    mortgageAmount: null,
                    funeralCosts: null,
                    headstone: null,
                    otherFuneral1: null,
                    otherFuneral2: null,
                    otherFuneral3: null,
                    otherFuneral4: null,
                    funeralValue1: null,
                    funeralValue2: null,
                    funeralValue3: null,
                    funeralValue4: null,
                    totalFuneral: null,
                    personSpentMoney: null,
                    spentRelationship: null,
                    whatMoneySpentOn: null,
                    whyDeceasedMoneyNotUsed: null,
                    whyMoneyWasntRepaid: null,
                    amountSpent: null,
                    nameOfGuaranteed: null,
                    guaranteedRelationship: null,
                    isCalledUptoToRepay: false,
                    whyLoanDeducted: null,
                    amountDebtGuaranteed: null,
                    loanDate: null,
                    amountLoan: null,
                    amountOfPayments: null,
                    whereIsMoney: null,
                    valueForeignCurrency: null,
                    exchangeRate: null,
                    valueSterling: null,
                    loanLender: null,
                    loanRelationship: null,
                    loanStartDate: null,
                    loanPurpose: null,
                    isLoanSecured: false,
                    loanOriginalAmount: null,
                    loanOutstandingDOD: null
                } : formType === FormType.Exemption ?
                    {
                        total: null,
                        totalJointExemption: null,
                        jointExemption: null
                    } : formType === FormType.Gift ?
                        {
                            dateOfGift: null,
                            valueDateOfGift: null,
                            giftBeneficiary: null,
                            giftExemption: null,
                            reliefPercentage: null,
                            exemptionAllowance: null,
                            preOwnedAssetDateOfGift: null,
                            preOwnedAssetValueGift: null,
                            preOwnedAssetBeneficary: null,
                            preOwnedAssetExemption: null,
                            preOwnedAssetRefNo: null,
                            preOwnedAssetRelief: null
                        } : null
    };
    return estateOverviewMode;
}

function setEditModel(matterData: { branchId: number, appId: number, fileId: number }, editData: EstateOverviewModel): EstateOverviewModel {
    const estateOverviewMode: EstateOverviewModel = {
        branchId: (editData && editData.branchId === 0) ? matterData.branchId : editData.branchId,
        appId: (editData && editData.appId === 0) ? matterData.appId : editData.appId,
        fileId: (editData && editData.fileId === 0) ? matterData.fileId : editData.fileId,
        probateTransId: editData ? editData.probateTransId : null,
        probateEntryType: editData ? editData.probateEntryType : null,
        category: editData ? editData.category : null,
        dealtBy: editData ? editData.dealtBy : null,
        contactId: editData ? editData.contactId : null,
        roleId: editData ? editData.roleId : null,
        description: editData ? editData.description : null,
        spouceCivilPartnerExemption: editData ? editData.spouceCivilPartnerExemption : null,
        charityExemption: editData ? editData.charityExemption : null,
        transactionItems: editData ? editData.transactionItems : [],
        itemData: (editData && editData.itemData) ? editData.itemData : null,
        contactInfo: (editData && editData.contactInfo) ? editData.contactInfo : null
    };
    return estateOverviewMode;
}
function setContactData(editData: EstateOverviewModel): ContactDetails {
    const contactDetails: ContactDetails = {
        contactId: editData ? editData.contactId : 0,
        letterTitle: (editData && editData.contactInfo) ? editData.contactInfo.contactName : '',
        name: (editData && editData.contactInfo) ? editData.contactInfo.contactCompany : '',
        postCode: (editData && editData.contactInfo) ? editData.contactInfo.contactPostCode : '',
        address: (editData && editData.contactInfo) ?
            (editData.contactInfo.contactAddress1 ? editData.contactInfo.contactAddress1 : '' +
                editData.contactInfo.contactAddress2 ? editData.contactInfo.contactAddress2 : '' +
                    editData.contactInfo.contactAddress3 ? editData.contactInfo.contactAddress3 : '') : '',
    };
    return contactDetails;
}
function setSaleType(selectedCategory: CategoryItem, formType: FormType): string {
    if (formType === FormType.Liability) {
        return 'Paid Off';
    } else if (Object.values(RedeemedCategoryCode).includes(selectedCategory.id)) {
        return 'Redeem';
    } else if (selectedCategory.id === 7) {
        return 'Withdraw';
    } else if (Object.values(SaleofShareCategoryCode).includes(selectedCategory.id)) {
        return 'Sale of Share';
    } else {
        return 'Sell';
    }
}

export const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (states) => states.views[token]);

export const getPELoadingByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.pELoading : false);
export const getPEIsDirtyByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.isDirty : false);
export const getMatterByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.matterData : null);
export const getFormTypeByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.formType : null);
export const getformControllersArray = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.formControllersArray : null);
export const getformControllersArrayByCategory = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.selectedformControllersByCategory : null);
export const getModeByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.mode : null);
export const getPECategoryListByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.estateOverviewCategory : null);
export const getPESelectedCategoryByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.selectedCategory : null);
export const getEstateOverviewModelByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.estateOverviewModel : null);
export const getEstateOverviewGridDataModelByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.paymentGridModel : []);
export const getEstateOverviewContactDetailsByToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.contactDetails : null);
export const getSelectedGridRowByToken = (token) => createSelector(getViewByToken(token),
    (view) => {
        if (view) {
            return view.paymentGridModel ? view.paymentGridModel.find(val => val.selected) : null;
        } else {
            return null;
        }
    });
export const getLiabilityAssetForDropDown = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.liabilityAssetForDropDown : []);
export const getExemptionAssetForDropDown = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.exemptionAssetForDropDown : []);
export const getDealtBySellText = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.saleTypeText : 'Sell');
export const getLegacyPercentage = (token) => createSelector(getViewByToken(token),
    (view) => {
        let percentage = 0;
        if (view.paymentGridModel.length > 0) {
            view.paymentGridModel.forEach(item => {
                if (item.data.dealtBy === 1) {
                    percentage = percentage + (item.data.percent ? item.data.percent : 0);
                }
            });
        }
        return percentage;
    });
