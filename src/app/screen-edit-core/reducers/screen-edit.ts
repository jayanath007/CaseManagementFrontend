import * as Actions from '../actions/screen-edit';
import { createSelector } from '@ngrx/store';
import { DropdownListData, ScreenEditComponentTreeData } from '../../core';

export interface State {
    readonly views: { [token: string]: ScreenEditState };
    readonly screenEditRuleTypesData: DropdownListData[];
    readonly uiComponetStructure: { [token: string]: string[] };
}

export interface ScreenEditState {
    readonly loading: boolean;
    readonly isinit: boolean;
    readonly screenEditComponentTreeData: ScreenEditComponentTreeData[];
    readonly submited: boolean;
}

const initialState: State = {
    views: {}, screenEditRuleTypesData: [],
    uiComponetStructure: {
        'INPlblMatterDetails':
            ['INPdteMatterStartDate',
                'INPchkMatterCloseMatter',
                'INPdteMatterCloseDate',
                'INPcboMatterFeeEarner',
                'INPcboSundrySupervisor',
                'INPcboMatterAppCode',
                'INPcboMatterDepartment',
                'INPcboMatterMatCategory',
                'INPcboMatterRateCategory',
                'INPcboMatterInterestScheme',
                'INPcboMatterIntroduction',
                'INPchkMatterPrecedentH',
                'INPchkMatterFileSecurity',
                'INPtxtMatterUser1',
                'INPtxtMatterUser2',
                'INPtxtMatterUser3',
                'INPtxtMatterUser4',
            ],
        'INPlblCreditLimitDetails':
            ['INPtxtAntCosts',
                'INPtxtAntDisbs',
                'INPtxtAntExpense'],
        'INPlblAnticipatedLimits': [
            'INPtxtSundryWIPCreditLimit',
            'INPtxtSundryDISBCreditLimit',
            'INPtxtSundryBILLCreditLimit'
        ],
        'INPlblLegalAidDetails':
            ['INPoptLegalHelp',
                'INPoptLegalPrivate',
                'INPoptLegalPubliclyFunded',
                'INPoptLegalCLR',
                'INPoptLegalFundsControl'
            ],
        'INPlblCreditControlDetails':
            ['INPcboCreditControlStage',
                'INPlblDateStageSet',
                'INPchkSuspendCreditControl',
                'INPtxtSuspendReason'
            ],
        'INPlblAntFeesDetails': ['INPtxtAddressBillingAddr1',
            'INPtxtAddressBillingAddr2',
            'INPtxtAddressBillingTown',
            'INPtxtAddressBillingCounty',
            'INPchkSundryLabelPrinted',
            'INPchkSundryLabelPrinted',
            'INPtxtAddressBillingPostcode',
            'INPcboSundryProfitCost',
            'INPtxtDefaultDDABank'],
        'INPtpgAddrHome': ['INPlblHomeAddrBAR',
            'INPtxtClientCompanyName',
            'INPcboClientType',
            'INPtxtAddressHomeAddr1',
            'INPtxtAddressHomeAddr2',
            'INPtxtAddressHomeTown',
            'INPtxtAddressHomeCountry',
            'INPtxtAddressHomePostcode'
        ],
        'INPlblHomeContactBAR': ['INPcboClientTitle',
            'INPcboClientIntro',
            'INPdteClientStartDate',
            'INPchkNoToMarketing',
            'INPtxtClientFirstName',
            'INPtxtClientLastName',
            'INPtxtAddressHomeLetterTitle',
            'INPtxtAddressHomeContactName',
            'INPtxtAddressHomeTel',
            'INPtxtAddressWorkTel',
            'INPtxtAddressMobileTel',
            'INPtxtAddressHomeContactEmail',
            'INPtxtAddressHomeContactEmail2',
            'INPtxtAddressFaxTel'
        ],
        'INPtpgAddrOtherNames': ['INPtpgAddrOtherNames',
            'INPtpgAddrOtherNames',
            'INPtxtAdditionalName1',
            'INPtxtAdditionalName2',
            'INPtxtAdditionalName3',
        ],
        'INPlblCredDbtLimitBAR': ['INPtxtCreditDebitLimit',
            'INPlblCreditDebitBalEDT',
            'INPcboCreditDebitTerms',
            'INPchkCreditDebitOnHold',
            'INPcboCreditControlStage',
            'INPlblDateStageSet',
            'INPchkSuspendCreditControl',
            'INPtxtSuspendReason'
        ],
        'INPlblCredDbtDefCodesBAR': ['INPcboCreditDebitVATCode',
            'INPcboCreditDebitCCYCode',
            'INPcboCreditDebitFeeEarner',
        ],
        'INPlblClientDetailsBAR': [
            'INPdteClientDOB',
            'INPdteClientDOD',
            'INPtxtClientNINumber',
            'INPtxtClientNameAtBirth',
            'INPtxtClientPlaceOfBirth',
            'INPcboClientGender',
            'INPcboClientEthnicOrigin',
            'INPcboClientDisabilityMonitor'
        ],
        'INPlblCompanyCompBAR': [
            'INPtxtCompanyVATNo',
            'INPtxtCompanySICCode',
            'INPtxtCompanyRegNo'
        ],
        'INPlblCompanyRegAddrBAR': [
            'INPtxtCompanyRegAddr1',
            'INPtxtCompanyRegAddr2',
            'INPtxtCompanyRegTown',
            'INPtxtCompanyRegCountry',
            'INPtxtCompanyRegPostcode',
        ]
    }
};

export function reducer(state = initialState, action: Actions.Any): State {
    const temp: any = {};
    switch (action.type) {
        case Actions.INIT_SCREEN_EDIT:
            temp[action.token] = setInitialData(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.LOAD_SCREEN_EDIT_COMPONENT_LIST:
            temp[action.token] = setScreenEditComponentList(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.LOAD_SCREEN_EDIT_COMPONENT_LIST_SUCCESS:
            temp[action.token] = setScreenEditComponentListSuccess(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.LOAD_SCREEN_EDIT_COMPONENT_LIST_FAIL:
            temp[action.token] = setScreenEditComponentListFail(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.LOAD_SCREEN_EDIT_RULE_LIST_SUCCESS:
            return { ...state, screenEditRuleTypesData: action.payload.response };

        case Actions.SCREEN_EDIT_SUBMIT:
            temp[action.token] = screenEditSubmit(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.SCREEN_EDIT_SUBMIT_SUCCESS:
            temp[action.token] = screenEditSubmitSuccess(state.views[action.token], action.payload.treeData);
            return { ...state, views: { ...state.views, ...temp } };

        case Actions.SCREEN_EDIT_SUBMIT_FAIL:
            temp[action.token] = { ...state.views[action.token], loading: false };
            return { ...state, views: { ...state.views, ...temp } };
        case Actions.SCREEN_EDIT_CLOSE:
            temp[action.token] = { ...state.views[action.token], submited: false };
            return { ...state, views: { ...state.views, ...temp } };

        default:
            {
                return state;
            }
    }
}

function setInitialData(state: ScreenEditState, payload): Partial<ScreenEditState> {
    if (state) {
        return state;
    }
    return {
        ...state,
        screenEditComponentTreeData: null,
        loading: true,
        isinit: true,
        submited: false
    };
}

function setScreenEditComponentList(state: ScreenEditState): Partial<ScreenEditState> {
    return { ...state, loading: true };
}

function setScreenEditComponentListSuccess(state: ScreenEditState, payload): Partial<ScreenEditState> {
    return {
        ...state,
        loading: false,
        isinit: false,
        screenEditComponentTreeData: arrangeDataList(payload.response),
    };
}

function setScreenEditComponentListFail(state: ScreenEditState): Partial<ScreenEditState> {
    return { ...state, loading: false, isinit: true };
}


function arrangeDataList(list: ScreenEditComponentTreeData) {
    const tempList: ScreenEditComponentTreeData[] = [];
    if (list.children.length > 0) {
        list.expanded = true;
        if (list.children[0].children.length > 0) {
            list.children[0].expanded = true;

            if (list.children[0].children.length > 0) {
                list.children[0].children[0].expanded = true;
            }
            list.children = list.children.map(i => {
                if (i.scL_Name === 'Client') {
                    return {...i, scL_Caption: list.children[0].children.find(x => x.scL_Name === 'INPtpgClient').scL_Caption};
                } else if (i.scL_Name === 'Matter') {
                    return {...i, scL_Caption: list.children[0].children.find(x => x.scL_Name === 'INPtpgMatter').scL_Caption};
                }
                return i;
            }
            );
            list.children[0].children = list.children[0].children.filter(draw => draw.scL_Caption !== '');
        }
    }
    return tempList.concat(list);
}

function screenEditSubmitSuccess(state: ScreenEditState, treeData: ScreenEditComponentTreeData[]): Partial<ScreenEditState> {
    return { ...state, loading: false, submited: true, screenEditComponentTreeData: treeData };
}

function screenEditSubmit(state: ScreenEditState): Partial<ScreenEditState> {
    return {
        ...state,
        loading: true
    };
}




export const getState = (state: State) => {
    return state;
};
export const getStateByToken = (token) => createSelector(getState, (state) => {
    return state.views[token];
});
export const getIsInitByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.isinit : true);
export const getIsSubmitedByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.submited : false);
export const getIsLoadingByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.loading : true);
export const getScreenEditComponentTreeDataByToken = (token) => createSelector(getStateByToken(token),
    (state) => state ? state.screenEditComponentTreeData : null);
export const getScreenEditRuleListDataByToken = createSelector(getState, (state) => state ? state.screenEditRuleTypesData : null);
export const getScreenEditComponentStructure = createSelector(getState, (state) => state ? state.uiComponetStructure : null);
