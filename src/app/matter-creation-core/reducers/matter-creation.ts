import { ChangeToCc } from './../../email-list-core/actions/core';
import { createSelector } from '@ngrx/store';
import * as MatterCreationAction from '../actions/core';
import {
    MatterModel, MatterInfomation, CloserProcessing, InputData,
    DiaryRecordViewModel, ClientContackLinkDetailViewModel
} from '../models/interfaces';
import { DropdownListData, LookupList, Mode } from '../../core';
import { PageEvent } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as MatterLinked from '../../matter-linked-core/actions/core';
import { dpsNewDate } from '../../utils/javascriptDate';

const datePipe = new DatePipe('en-US');

export interface State {
    readonly views: { [token: string]: MatterCreationState };
    readonly branchList: DropdownListData[];
    // readonly feeEarnerList: DropdownListData[];
    readonly supervisorList: DropdownListData[];
    readonly appCodeList: DropdownListData[];
    // readonly matterDepartmentList: DropdownListData[];
    readonly matterCategoryList: { [id: number]: DropdownListData[] };
    readonly rateCategoryList: DropdownListData[];
    readonly matterInterestSchemeList: DropdownListData[];
    readonly introductionList: LookupList[];
    readonly trusAccNoList: DropdownListData[];
    readonly creditControlStageList: DropdownListData[];
    readonly sundryProfitList: DropdownListData[];
    readonly ddaBankList: DropdownListData[];
    readonly clientDefaults: any;
    readonly lscDate: any;
    readonly useFileSecurity: boolean;
    readonly eBillingSchemeList: any[];
    readonly defaultAnticipatedWIPCredit?: any;
    readonly isPlotUser: boolean;
    readonly userBranchId: number;
}

export interface MatterCreationState {
    originalModel: MatterModel;
    model: MatterModel;
    mode: Mode;
    laMatterTypesList: DropdownListData[];
    caseStageLevelList: DropdownListData[];
    criteriaList: DropdownListData[];
    matterType1List: DropdownListData[];
    matterType2List: DropdownListData[];
    outcomeList: DropdownListData[];
    stageReachedList: DropdownListData[];
    showConflictSearch: boolean;
    isLoading: boolean;
    closeMatterCreation: boolean;
    matterSeatchList: MatterInfomation[];
    matterIndex: number;
    relatedDocumentsPageEvent: PageEvent;
    closerProcessing: CloserProcessing;
    feeEarnerIsUser: boolean;
    opportunityId: number;
    confirmBeforeOpenCase: boolean;
}
export const intialState: State = {
    views: {},
    branchList: null,
    // feeEarnerList: null,
    supervisorList: null,
    appCodeList: null,
    // matterDepartmentList: null,
    matterCategoryList: {},
    rateCategoryList: null,
    matterInterestSchemeList: null,
    introductionList: null,
    trusAccNoList: null,
    creditControlStageList: null,
    sundryProfitList: null,
    ddaBankList: null,
    clientDefaults: null,
    lscDate: null,
    useFileSecurity: null,
    eBillingSchemeList: null,
    isPlotUser: false,
    userBranchId: null,
};
export function reducer(state: State = intialState, action: MatterCreationAction.Any | MatterLinked.Any): State {
    let temp = {};
    switch (action.type) {
        case MatterCreationAction.INIT_MATTER_CREATION:
            temp[action.token] = {
                originalModel: action.payload.mode === Mode.SearchMode ? initializeModel(action.payload.anticipatedWIPCredit, null) : null,
                model: action.payload.mode === Mode.SearchMode ? initializeModel(action.payload.anticipatedWIPCredit,
                    (action.payload.inputData && action.payload.inputData.matterIntroduction) ?
                        action.payload.inputData.matterIntroduction : null) :
                    action.payload.mode === Mode.AddMode ?
                        setInitializeMatterModel(action.payload.inputData, action.payload.mode, action.payload.dateTimeOffset,
                            action.payload.anticipatedWIPCredit) : null,
                // model: action.payload.mode === Mode.SearchMode ? initializeModel() : null,
                opportunityId: action.payload.inputData ? action.payload.inputData.opportunityId : null,
                mode: action.payload.mode,
                showConflictSearch: false,
                isLoading: false,
                matterSeatchList: null,
                matterIndex: null,
                laMatterTypesList: null,
                caseStageLevelList: null,
                criteriaList: null,
                matterType1List: null,
                matterType2List: null,
                outcomeList: null,
                stageReachedList: null,
                closeMatterCreation: false,
                relatedDocumentsPageEvent: { pageSize: 10, pageIndex: 0, length: 0 },
                closerProcessing: { isCompletionNegWOEnabled: false, cannotCloseMessage: '', balancesOrAllocationsOrProformasExist: null },
                feeEarnerIsUser: true,
                confirmBeforeOpenCase: action.payload.inputData ? action.payload.inputData.confirmBeforeOpenCase : false,
            };
            return {
                ...state,
                isPlotUser: action.payload.isPlotUser,
                userBranchId: action.payload.userBranchId,
                views: { ...state.views, ...temp },
                defaultAnticipatedWIPCredit: action.payload.anticipatedWIPCredit
            };
        case MatterCreationAction.CLEAR_MATTER_DATA:
            temp[action.token] = {
                originalModel: initializeModel(state.defaultAnticipatedWIPCredit, null),
                model: initializeModel(state.defaultAnticipatedWIPCredit, null),
                mode: Mode.SearchMode,
                laMatterTypesList: null,
                caseStageLevelList: null,
                criteriaList: null,
                matterType1List: null,
                matterType2List: null,
                outcomeList: null,
                stageReachedList: null,
                showConflictSearch: false,
                isLoading: false,
                closeMatterCreation: false,
                matterSeatchList: null,
                matterIndex: null,
                relatedDocumentsPageEvent: { pageSize: 10, pageIndex: 0, length: 0 },
                closerProcessing: { isCompletionNegWOEnabled: false, cannotCloseMessage: '', balancesOrAllocationsOrProformasExist: null },
                feeEarnerIsUser: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.GET_FULL_MATTER_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.GET_FULL_MATTER_DATA_SUCCESS:
            temp[action.token] = {
                originalModel: action.payload.matterModel,
                model: action.payload.matterModel,
                mode: Mode.EditMode,
                laMatterTypesList: null,
                caseStageLevelList: null,
                criteriaList: null,
                matterType1List: null,
                matterType2List: null,
                outcomeList: null,
                stageReachedList: null,
                showConflictSearch: false,
                isLoading: false,
                closeMatterCreation: false,
                matterSeatchList: action.payload.matterSeatchList || state.views[action.token].matterSeatchList,
                matterIndex: (action.payload.matterIndex >= 0) ? action.payload.matterIndex : state.views[action.token].matterIndex,
                relatedDocumentsPageEvent: {
                    pageSize: 10, pageIndex: 0,
                    length: action.payload.matterModel.matterDocumentRegistries.length,
                },
                closerProcessing: { isCompletionNegWOEnabled: false, cannotCloseMessage: '', balancesOrAllocationsOrProformasExist: null },
                feeEarnerIsUser: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.GET_FULL_MATTER_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
                matterSeatchList: action.payload.matterSeatchList || state.views[action.token].matterSeatchList,
                matterIndex: (action.payload.matterIndex >= 0) ? action.payload.matterIndex : state.views[action.token].matterIndex,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.CLOSURE_PROCESSING_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                closerProcessing: action.payload
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.CHECK_FEE_EARNER_IS_USER_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                feeEarnerIsUser: action.payload
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.CHANGE_IS_COMPLETION_NEG_WOE_ENABLED:
            temp[action.token] = {
                ...state.views[action.token],
                closerProcessing: { ...state.views[action.token].closerProcessing, isCompletionNegWOEnabled: action.payload }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.GET_LA_MATTER_TYPES_AVAILABLE_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                laMatterTypesList: action.payload,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.GET_LEAGAL_AID_COMBOS_LIST_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                caseStageLevelList: action.payload.caseStageLevel,
                criteriaList: action.payload.criteria,
                matterType1List: action.payload.matterType1,
                matterType2List: action.payload.matterType2,
                outcomeList: action.payload.outcome,
                stageReachedList: action.payload.stageReached,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.ADD_MATTER:
            temp[action.token] = {
                ...state.views[action.token],
                mode: Mode.AddMode
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.UPDATE_MATTER:
            temp[action.token] = updateMatter(state.views[action.token], action.payload.value, action.payload.property);
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.UPDATE_CLIENT1:
            temp[action.token] = updateClient1(state.views[action.token], action.payload.value, action.payload.property);
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.UPDATE_CLIENT2:
            temp[action.token] = updateClient2(state.views[action.token], action.payload.value, action.payload.property);
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.ADD_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                model: addClient(state.views[action.token].model, action.client)
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.REMOVE_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                model: removeClient(state.views[action.token].model, action.clientRef)
            };
            return { ...state, views: { ...state.views, ...temp } };

        case MatterCreationAction.PROMOTE_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                model: promoteClient(state.views[action.token].model, action.clientRef)
            };
            return { ...state, views: { ...state.views, ...temp } };

        case MatterCreationAction.CLOSE_MATTER_CREATION:
            temp = Object.assign({}, state, {
                views: Object.keys(state.views).reduce((result, key) => {
                    if (key !== action.token) {
                        result[key] = state.views[key];
                    }
                    return result;
                }, {})
            });
            return { ...state, ...temp };
        case MatterCreationAction.ADD_UPDATE_MATTER:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.ADD_UPDATE_MATTER_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                model: action.payload,
                originalModel: action.payload,
                showConflictSearch: (state.views[action.token].model.matter.matterId === -1 &&
                    state.clientDefaults.cD_ForceMatterConflictSearch),
                mode: Mode.EditMode,
                isLoading: false,
                closeMatterCreation: action.closeAfterSave
            };
            return {
                ...state, views: {
                    ...state.views, ...temp
                }
            };
        case MatterCreationAction.ADD_UPDATE_MATTER_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
                closeMatterCreation: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.DELETE_MATTER:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.DELETE_MATTER_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
                closeMatterCreation: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.DELETE_MATTER_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case MatterCreationAction.RELATED_DOCUMENTS_GRID_PAGE_EVENT_CHANGE:
            temp[action.token] = {
                ...state.views[action.token],
                relatedDocumentsPageEvent: action.payload.pageEvent,
            };
            return { ...state, views: { ...state.views, ...temp } };

        case MatterCreationAction.USE_FILE_SECURITY_SUCCESS:
            return { ...state, useFileSecurity: action.payload };

        case MatterCreationAction.GET_CLIENT_DEFAULTS_SUCCESS:
            return { ...state, clientDefaults: action.payload };

        case MatterCreationAction.GET_LSC_DATE_SUCCESS:
            return { ...state, lscDate: action.payload };

        case MatterCreationAction.GET_BRANCH_LIST_SUCCESS:
            return { ...state, branchList: action.payload };
        // case MatterCreationAction.GET_FEE_EARNER_LIST_SUCCESS:
        //     return { ...state, feeEarnerList: action.payload };

        case MatterCreationAction.GET_SUPERVISOR_LIST_SUCCESS:
            return { ...state, supervisorList: action.payload };

        case MatterCreationAction.GET_APP_CODE_LIST_SUCCESS:
            return { ...state, appCodeList: action.payload };

        // case MatterCreationAction.GET_MATTER_DEPARTMENT_LIST_SUCCESS:
        //     return { ...state, matterDepartmentList: action.payload };

        case MatterCreationAction.GET_RATE_CATEGORY_LIST_SUCCESS:
            return { ...state, rateCategoryList: action.payload };

        case MatterCreationAction.GET_MATTER_INTEREST_SCHEME_LIST_SUCCESS:
            return { ...state, matterInterestSchemeList: action.payload };

        case MatterCreationAction.GET_INTRODUCTION_LIST_SUCCESS:
            return { ...state, introductionList: action.payload };

        case MatterCreationAction.GET_TRUS_ACC_NO_LIST_SUCCESS:
            return { ...state, trusAccNoList: action.payload };

        case MatterCreationAction.GET_CREDIT_CONTROL_STAGE_LIST_SUCCESS:
            return { ...state, creditControlStageList: action.payload };

        case MatterCreationAction.GET_SUNDRY_PROFIT_LIST_SUCCESS:
            return { ...state, sundryProfitList: action.payload };

        case MatterCreationAction.GET_DDA_BANK_LIST_SUCCESS:
            return { ...state, ddaBankList: action.payload };
        case MatterCreationAction.PLOT_SUCCESS_UPDATE:

            if (state.views[action.token].model && state.views[action.token].model.matter) {
                const oldMaster = state.views[action.token].model.matter.masterMatterId;
                const newMaster = oldMaster == null ? 0 : oldMaster;
                temp[action.token] = {
                    ...state.views[action.token],
                    model: {
                        ...state.views[action.token].model,
                        matter: {
                            ...state.views[action.token].model.matter,
                            isPlotMatter: newMaster >= 0,
                            masterMatterId: newMaster
                        }
                    },
                };
                return { ...state, views: { ...state.views, ...temp } };
            } else {
                return { ...state };
            }

        // case MatterCreationAction.GET_MATTER_CATEGORY_LIST_SUCCESS:
        //     temp[action.payload.departmentId] = action.payload.dropdownList;
        //     return { ...state, matterCategoryList: { ...state.matterCategoryList, ...temp } };
        case MatterCreationAction.ADD_DIARY_RECORD_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                opportunityId: null,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.WRITE_OFF_NEGATIVE_WIP:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.WRITE_OFF_NEGATIVE_WIP_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.WRITE_OFF_NEGATIVE_WIP_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.SET_INITAL_PLOT_SALE_MODEL:
            temp[action.token] = {
                ...state.views[action.token],
                model: initialPlotSaleData(state.views[action.token], state.appCodeList, state.isPlotUser),
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.SET_USER_BRANCH_TO_NEW_MATTER:
            temp[action.token] = {
                ...state.views[action.token],
                model: setUserBranchToNewMatter(state.branchList, state.views[action.token], state.userBranchId),
            };
            return { ...state, views: { ...state.views, ...temp } };
        case MatterCreationAction.SHOW_MSG:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        default:
            return state;
    }
}

function initializeModel(anticipatedWIPCredit, matterIntroduction): MatterModel {
    const matterModel: MatterModel = {
        matter: {
            clientRef: '', clientName: '', branchID: null, matterRef: '', private: true, matterDetails: '', fileID: null,
            // matter
            matterId: null, matterCloseMatter: false, matterStartDate: null, matterClosedate: null,
            isMatterCompleted: false, matterCompletedDate: null, matterFeeEarner: null,
            matterSupervisor: null, appCode: null, appId: null, matterDepartment: null, matterCategory: null,
            matterRateCategory: null, matterInterestScheme: null,
            matterIntroduction: matterIntroduction ? matterIntroduction : null, eBilling: null, matterFileSecurity: false,
            matterUnderDefined1: null, matterUnderDefined2: null, matterUnderDefined3: null, matterUnderDefined4: null,
            creditLimitCost: null, creditLimitDibs: null, creditLimitExpenses: null,
            anticipatedWIPCredit: anticipatedWIPCredit, anticipatedDisbCredit: null, anticipatedBillCredit: null,
            // legalAid
            legalPublicFunded: null, legalLAACivilBilling: false, legalMatterType: null,
            legalMatterType1: null, legalMatterType2: null, legalCaseStageLevel: null,
            legalCaseStageReached: null, legalCaseOutcome: null, legalCaseStarted: null,
            // completion
            completionDocLocation: null, completionArchiveRef: null, completionDistroyDate: null, completionDistroyed: false,
            // sundry
            sundryTrustAccount: '', sundryOldReference: null, sundryOtherMatter: null, sundryDPSFileNumber: null,
            sundryCrediteConrtolStage: 0, sundryStageSet: '', sundrySuspendCrediteControl: false, sundryReasonToSuspend: null,
            sundryBullingAddress1: null, sundryBullingAddress2: null, sundryTown: null, sundryCountry: null, sundryPostCode: null,
            sundryLablePriented: false, sundryProfitCost: null, sundryDefaultDDABank: null,
            // crime
            crimeUFN: null, crimeLeadUFN: null, crimeBailCondition1: null, crimeBailCondition2: null,
            crimeBailCondition3: null, crimeBailCondition4: null, crimeBailCondition5: null,
            // clientsOtherSide
            clientRef2: null, outSideSurname1: null, outsidePostCode1: null, outsideDOB1: null,
            outSideSurname2: null, outsidePostCode2: null, outsideDOB2: null,
            // eBilling Comment
            matterPrecedentHScheme: null,
            isProspectMatter: false,
            isLegalAid: false
        },
        clientContactLink: [],
        // client1: {
        //     clientId: null, clientRef: null,
        //     clientTitle: null, firstName: null, lastName: null, letterTitle: null, contactName: null, email1: null,
        //     email2: null, phone: null, workPhone: null, mobilePhone: null, fax: null
        // },
        // client2: {
        //     clientId: null, clientRef: null,
        //     clientTitle: null, firstName: null, lastName: null, letterTitle: null, contactName: null, email1: null,
        //     email2: null, phone: null, workPhone: null, mobilePhone: null, fax: null
        // },
        matterDocumentRegistries: [],
        client1: null,
        client2: null,
    };
    return matterModel;
}
function setInitializeMatterModel(inputData: InputData, mode: Mode, dateTimeOffset, anticipatedWIPCredit: any):
    MatterModel {
    if (inputData && inputData.matterModel) {
        return {
            matter: inputData.matterModel,
            matterDocumentRegistries: [],
            client1: inputData.client1,
            client2: inputData.client2,
            clientContactLink: inputData.clientList
        };
        // const matterModel: MatterModel = {
        //     matter: {
        //         clientRef: inputData.matterModel ? inputData.matterModel.clientRef : '',
        //         clientName: inputData.matterModel ? inputData.matterModel.clientName : '',
        //         matterRef: inputData.matterModel ? inputData.matterModel.matterRef : '',
        //         private: inputData.matterModel ? inputData.matterModel.private : false,
        //         matterDetails: inputData.matterModel ? inputData.matterModel.matterDetails : '',
        //         branchID: inputData.matterModel ? inputData.matterModel.branchID : null,
        //         fileID: inputData.matterModel ? inputData.matterModel.fileID : null,
        //         // matter
        //         matterId: inputData.matterModel ? inputData.matterModel.matterId : null,
        //         matterCloseMatter: inputData.matterModel ? inputData.matterModel.matterCloseMatter : false,
        //         matterStartDate: inputData.matterModel ? inputData.matterModel.matterStartDate
        //             : datePipe.transform(dpsNewDate(dateTimeOffset).toString(), 'yyyy-MM-dd'),
        //         matterClosedate: inputData.matterModel ? inputData.matterModel.matterStartDate : null,
        //         isMatterCompleted: false, matterCompletedDate: null,
        //         matterFeeEarner: inputData.matterModel ? inputData.matterModel.matterFeeEarner : null,
        //         matterSupervisor: null,
        //         appCode: inputData.matterModel ? inputData.matterModel.appCode : null,
        //         appId: inputData.matterModel ? inputData.matterModel.appId : null,
        //         matterDepartment: inputData.matterModel ? inputData.matterModel.matterDepartment : null,
        //         matterCategory: inputData.matterModel ? inputData.matterModel.matterCategory : null,
        //         matterRateCategory: inputData.matterModel ? inputData.matterModel.matterRateCategory : null,
        //         matterInterestScheme: inputData.matterModel ? inputData.matterModel.matterRateCategory : null,
        //         matterIntroduction: inputData.matterModel ? inputData.matterModel.matterInterestScheme : null,
        //         eBilling: null,
        //         matterFileSecurity: false,
        //         matterUnderDefined1: null, matterUnderDefined2: null, matterUnderDefined3: null, matterUnderDefined4: null,
        //         creditLimitCost: null, creditLimitDibs: null, creditLimitExpenses: null,
        //         anticipatedWIPCredit: null, anticipatedDisbCredit: null, anticipatedBillCredit: null,
        //         // legalAid
        //         legalPublicFunded: null, legalLAACivilBilling: false, legalMatterType: null,
        //         legalMatterType1: null, legalMatterType2: null, legalCaseStageLevel: null,
        //         legalCaseStageReached: null, legalCaseOutcome: null, legalCaseStarted: null,
        //         // completion
        //         completionDocLocation: null, completionArchiveRef: null, completionDistroyDate: null, completionDistroyed: false,
        //         // sundry
        //         sundryTrustAccount: '', sundryOldReference: null, sundryOtherMatter: null, sundryDPSFileNumber: null,
        //         sundryCrediteConrtolStage: 0, sundryStageSet: '', sundrySuspendCrediteControl: false, sundryReasonToSuspend: null,
        //         sundryBullingAddress1: null, sundryBullingAddress2: null, sundryTown: null, sundryCountry: null, sundryPostCode: null,
        //         sundryLablePriented: false, sundryProfitCost: null, sundryDefaultDDABank: null,
        //         // crime
        //         crimeUFN: null, crimeLeadUFN: null, crimeBailCondition1: null, crimeBailCondition2: null,
        //         crimeBailCondition3: null, crimeBailCondition4: null, crimeBailCondition5: null,
        //         // clientsOtherSide
        //         clientRef2: null, outSideSurname1: null, outsidePostCode1: null, outsideDOB1: null,
        //         outSideSurname2: null, outsidePostCode2: null, outsideDOB2: null,
        //         // eBilling Comment
        //         matterPrecedentHScheme: null,
        //         isProspectMatter: inputData.matterModel.isProspectMatter,
        //         isLegalAid: inputData.matterModel.isLegalAid
        //     },
        //     clientContactLink: !!inputData.clientList ? inputData.clientList : [],
        //     // client1: {
        //     //     clientId: null, clientRef: null,
        //     //     clientTitle: null, firstName: null, lastName: null, letterTitle: null, contactName: null, email1: null,
        //     //     email2: null, phone: null, workPhone: null, mobilePhone: null, fax: null
        //     // },
        //     // client2: {
        //     //     clientId: null, clientRef: null,
        //     //     clientTitle: null, firstName: null, lastName: null, letterTitle: null, contactName: null, email1: null,
        //     //     email2: null, phone: null, workPhone: null, mobilePhone: null, fax: null
        //     // },
        //     matterDocumentRegistries: [],
        //     client1: null,
        //     client2: null,
        // };
        // return matterModel;
    } else {
        return initializeModel(anticipatedWIPCredit, inputData.matterIntroduction ? inputData.matterIntroduction : null);
    }
}

function updateMatter(view: MatterCreationState, value, property: string) {
    if (view && view.model) {
        const temp = {};
        temp[property] = value;
        return { ...view, model: { ...view.model, matter: { ...view.model.matter, ...temp } } };
    }
    return view;
}

function updateClient1(view: MatterCreationState, value, property: string) {
    if (view && view.model) {
        const temp = {};
        temp[property] = value;
        return { ...view, model: { ...view.model, client1: { ...view.model.client1, ...temp } } };
    }
    return view;
}

function updateClient2(view: MatterCreationState, value, property: string) {
    if (view && view.model) {
        const temp = {};
        temp[property] = value;
        return { ...view, model: { ...view.model, client2: { ...view.model.client2, ...temp } } };
    }
    return view;
}

function addClient(model: MatterModel, newClient: ClientContackLinkDetailViewModel):
    MatterModel {
    let list: ClientContackLinkDetailViewModel[] = model.clientContactLink;
    if (newClient.leadClient) {
        list = list.filter(r => !r.leadClient);
        list = [newClient].concat(list);
    } else if (model.matter.clientRef !== newClient.accountRef) {
        list = list.filter(r => r.accountRef !== newClient.accountRef);
        list.push(newClient);
    }
    return { ...model, clientContactLink: list };
}

function removeClient(model: MatterModel, clientRef: string): MatterModel {
    if (model.matter.clientRef === clientRef) {
        return model;
    } else {
        return { ...model, clientContactLink: model.clientContactLink.filter(r => r.accountRef !== clientRef) };
    }
}

function promoteClient(model: MatterModel, clientRef: string): MatterModel {
    if (model.matter.clientRef === clientRef) {
        return model;
    } else {
        // change lead client
        const tem: ClientContackLinkDetailViewModel[] = model.clientContactLink.map(r => {
            if (r.leadClient) {
                return { ...r, leadClient: false };
            } else if (r.accountRef === clientRef) {
                return { ...r, leadClient: true };
            }
            return r;
        });

        // Current lead
        const currentLeadLient = tem.filter(r => r.leadClient)[0];
        const otherClients = tem.filter(r => !r.leadClient);
        return {
            ...model,
            clientContactLink: [currentLeadLient].concat(otherClients),
            matter: {
                ...model.matter,
                clientRef: currentLeadLient.accountRef,
                clientName: currentLeadLient.accountName,
                clientRef2: !!otherClients ? otherClients[0].accountRef : ''
            }
        };

    }
}

function initialPlotSaleData(view: MatterCreationState, appCodeList: DropdownListData[], isPlotUser: boolean): MatterModel {
    if (isPlotUser && !!view.model && !view.model.matter.matterRef && appCodeList && appCodeList.length > 0) {
        const app = appCodeList.find(i => i.value.toLowerCase() === 'ps');
        if (view && view.model) {
            return {
                ...view.model, matter:
                {
                    ...view.model.matter,
                    private: true,
                    appCode: app ? app.value : null,
                    appId: app ? Number(app.key) : null
                }
            };
        }
    }
    return view.model;
}
function setUserBranchToNewMatter(branchList: DropdownListData[], view: MatterCreationState, userBranchId: number): MatterModel {
    if (!!view.model && !view.model.matter.matterRef && branchList && branchList.length > 0) {
        const userBarnch = branchList.find(b => b.key === userBranchId);
        return {
            ...view.model, matter:
            {
                ...view.model.matter,
                branchID: !!userBarnch ? userBranchId : null
            }
        };
    }
    return view.model;
}

const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (state) => state.views[token]);
export const getIsModelDirtyByToken = (token) => createSelector(getViewByToken(token), (view) =>
    view ? JSON.stringify(view.originalModel) !== JSON.stringify(view.model) : false);
export const getOriginalModelByToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.originalModel : null);
export const getModelByToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.model : null);
export const getModeByToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.mode : '');
export const getCloserProcessingByToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.closerProcessing : null);
export const getFeeEarnerIsUserByToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.feeEarnerIsUser : true);
export const getShowConflictSearch = (token) => createSelector(getViewByToken(token), (view) => view ? view.showConflictSearch : false);
export const getIsLoading = (token) => createSelector(getViewByToken(token), (view) => view ? view.isLoading : true);
export const getCloseMatterCreation = (token) => createSelector(getViewByToken(token), (view) => view ? view.closeMatterCreation : false);
export const getMatterDepartmentByToken = (token) => createSelector(getModelByToken(token),
    (model) => (model && model.matter) ? model.matter.matterDepartment : null);
export const getMatterCategoryListByDepartmentId = (id) => createSelector(getState, (state) => state.matterCategoryList[id] || null);

export const getLAMatterTypesList = (token) => createSelector(getViewByToken(token), (view) => view ? view.laMatterTypesList : null);
export const getCaseStageLevelList = (token) => createSelector(getViewByToken(token), (view) => view ? view.caseStageLevelList : null);
export const getCriteriaList = (token) => createSelector(getViewByToken(token), (view) => view ? view.criteriaList : null);
export const getMatterType1List = (token) => createSelector(getViewByToken(token), (view) => view ? view.matterType1List : null);
export const getMatterType2List = (token) => createSelector(getViewByToken(token), (view) => view ? view.matterType2List : null);
export const getOutcomeList = (token) => createSelector(getViewByToken(token), (view) => view ? view.outcomeList : null);
export const getStageReachedList = (token) => createSelector(getViewByToken(token), (view) => view ? view.stageReachedList : null);

export const getMatterSeatchList = (token) => createSelector(getViewByToken(token), (view) => view ? view.matterSeatchList : null);
export const getMatterIndex = (token) => createSelector(getViewByToken(token), (view) => view ? view.matterIndex : null);

export const getRelatedDocumentsPageEventByToken = (token) => createSelector(getViewByToken(token),
    (view) => {
        return view ? view.relatedDocumentsPageEvent : null;
    });

export const getIsInit = createSelector(getState, (state) => !(
    state.branchList &&
    // state.feeEarnerList &&
    state.supervisorList &&
    state.appCodeList &&
    // state.matterDepartmentList &&
    state.rateCategoryList &&
    state.matterInterestSchemeList &&
    state.introductionList &&
    state.trusAccNoList &&
    state.creditControlStageList &&
    state.sundryProfitList &&
    state.ddaBankList &&
    state.clientDefaults &&
    state.lscDate &&
    state.useFileSecurity !== null)
);

export const getOpportunityViewModelByToken = (token) => createSelector(getViewByToken(token),
    (view) => {
        const opportunityModel: DiaryRecordViewModel = {
            matterRef: view.model.matter ? view.model.matter.matterRef : null,
            opportunityId: view ? view.opportunityId : null
        };
        return opportunityModel;
        // view ? view.relatedDocumentsPageEvent : null;
    });



export const getClientDefaults = createSelector(getState, (state) => state.clientDefaults);
export const getLSCDate = createSelector(getState, (state) => state.lscDate);

export const getBranchList = createSelector(getState, (state) => state.branchList);
// export const getFeeEarnerList = createSelector(getState, (state) => state.feeEarnerList);
export const getSupervisorList = createSelector(getState, (state) => state.supervisorList);
export const getAppCodeList = createSelector(getState, (state) => state.appCodeList);
// export const getMatterDepartmentList = createSelector(getState, (state) => state.matterDepartmentList);
export const getRateCategoryList = createSelector(getState, (state) => state.rateCategoryList);
export const getMatterInterestSchemeList = createSelector(getState, (state) => state.matterInterestSchemeList);
export const getIntroductionList = createSelector(getState, (state) => state.introductionList);
export const getTrusAccNoList = createSelector(getState, (state) => state.trusAccNoList);
export const getCreditControlStageList = createSelector(getState, (state) => state.creditControlStageList);
export const getSundryProfitList = createSelector(getState, (state) => state.sundryProfitList);
export const getEBillingSchemeList = createSelector(getState, (state) => state.eBillingSchemeList);
export const getDDABankList = createSelector(getState, (state) => state.ddaBankList);
export const getUseFileSecurity = createSelector(getState, (state) => state.useFileSecurity);

export const getMatterCategoryListByToken = (token) => createSelector(getState, getMatterDepartmentByToken(token),
    (state, matterDepartment) => matterDepartment ? (state.matterCategoryList[matterDepartment] || null) : null);


export const getClientDocumentRegistriesGridDataByToken = (token) => createSelector(getViewByToken(token),
    (conflictSearchState) => {
        if (conflictSearchState && conflictSearchState.model) {
            const data = conflictSearchState.model.matterDocumentRegistries
                .filter((item, index) => {
                    const firstDisplayItemIndex = (conflictSearchState.relatedDocumentsPageEvent.pageIndex
                        * conflictSearchState.relatedDocumentsPageEvent.pageSize);
                    const lastDisplayItemIndex = firstDisplayItemIndex + conflictSearchState.relatedDocumentsPageEvent.pageSize;
                    return (firstDisplayItemIndex <= index && index < lastDisplayItemIndex);
                });
            return data;
        } else {
            return null;
        }
    });

export const getConfirmBeforeOpenCase = (token) => createSelector(getViewByToken(token), (view) =>
    view ? view.confirmBeforeOpenCase : false);

