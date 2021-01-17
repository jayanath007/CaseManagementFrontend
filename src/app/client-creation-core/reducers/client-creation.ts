import { state } from '@angular/animations';
import { createSelector } from '@ngrx/store';
import * as ClientCreationAction from '../actions/core';
import { CaseFileIdentity, ClientModel } from '../models/interfaces';
import { Mode, UploadDocumentType } from '../models/enums';
import { dpsNewDate } from '../../utils/javascriptDate';
import { DatePipe } from '@angular/common';
import { DropdownListData, LookupViewModel } from '../../core';
import { InitClientCreationData, Client, ClientNoteModel, ClientRiskAssessmentQuestion } from '../models/interfaces';
import { PaginatorDef } from './../../core/lib/grid-model';

const datePipe = new DatePipe('en-US');
export interface State {
    readonly views: { [token: string]: ClientCreationState };
    readonly initDataModel: InitClientCreationData;
}
export interface ClientCreationState {
    originalModel: ClientModel;
    model: ClientModel;
    mode: Mode;
    showConflictSearch: boolean;
    popupClosed: boolean;
    clientSeatchList: Client[];
    clientIndex: number;
    isLoading: boolean;
    clientMattersTotal: number;
    clientMattersPaginationDef: PaginatorDef;
    aMLErrorResponse: null;
    deleteNoteIds: number[];
    selectedMatterId: string;

    proofOfIdLable: string;
    proofOfAddressLable: string;
    isClientCompanyNameReadOnly: boolean;
    clientCompanyNameCaption: string;
    isCompanyTabVisibility: boolean;
    isPersonalTabVisibility: boolean;
    isProofPrivateIndvVisibility: boolean;
    documentUploading: boolean;
    isCrimeTabVisibility: boolean;
    idCheckPrivateInduLable: string;
    idCheckIndividual: string;
    isIDCheckCompanyVisibility: boolean;
    isBeneficalOwnerVisibility: boolean;

    isProofOfIDUpload: boolean;
    isProofOfAddressUpload: boolean;
    isCompanyProof1Upload: boolean;
    isCompanyProof2Upload: boolean;

}
export const intialState: State = {
    views: {},
    initDataModel: {
        branchList: [],
        clientTypeList: [],
        creditAccountTypeList: [],
        vatCodeAndDescriptionList: [],
        feeEarnerCodeAndNameList: [],
        ethnicOriginCodeAndNameList: [],
        creditControlStageList: [],
        amlRiskLevelResponceList: [],
        genderCodeAndNameList: [],
        currencyCodeAndNameList: [],
        disabilityCodeAndNameList: [],
        clientInterestSchemeList: [],
        companyProofsList: null,
        lookupTitleType: null,
        lookupIntroductionType: null,
        lookupTermsType: null,
        lookupProofIDType: null,
        lookupProofAddressType: null,
        isAMLShow: false,
        clientDefaults: null,
        matRefSetting: null,
        loadInitData: false,
        userDefaultBranch: null,
        defuiltRiskAssesmentData: null,
        caseFileIdentity: null
    },
};

export function reducer(state: State = intialState, action: ClientCreationAction.Any): State {
    let temp = {};
    switch (action.type) {

        case ClientCreationAction.ADD_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                mode: Mode.AddMode,
                showConflictSearch: false,
                model: {
                    ...state.views[action.token].model,
                    client: {
                        ...state.views[action.token].model.client,
                        clientId: -1,
                        startDate: dpsNewDate(action.payload.timeOffset),
                        // clientType: 4,
                        privetIndividual: true,
                        accountType: 1,
                        vatCode: 1,
                        creditControlStage: 0,
                        // branchID: state.initDataModel.userDefaultBranch,
                        currencyCode: 1,
                        companyProof1: 1,
                        companyProof2: 1
                    },
                }
            };
            temp[action.token] = clientTypeChanges(temp[action.token], 4);
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.DELETE_DOCUMENT_NOTE:
            const clientEvents =
                state.views[action.token].model.clientEvents
                    .filter((item) => item.eventId !== action.payload.row.eventId);

            temp[action.token] = {
                ...state.views[action.token],
                model: { ...state.views[action.token].model, clientEvents: clientEvents, }
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.UPDATE_SELECTED_MATER:
            temp[action.token] = {
                ...state.views[action.token],
                selectedMatterId: action.payload.selectedMatterId,
            };
            // temp[action.token] = clientTypeChanges(temp[action.token], 4);
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.CLOSE_CLIENT_CREATION:
            temp = Object.assign({}, state, {
                views: Object.keys(state.views).reduce((result, key) => {
                    if (key !== action.token) {
                        result[key] = state.views[key];
                    }
                    return result;
                }, {})
            });
            return { ...state, ...temp };

        case ClientCreationAction.INIT_CLIENT_CREATION:
            temp[action.token] = {
                originalModel: action.payload.mode === Mode.SearchMode ? initializeModel() : null,
                model: action.payload.mode === Mode.SearchMode ? initializeModel() : null,
                mode: action.payload.mode,
                isLoading: false,
                showConflictSearch: false,
                clientSeatchList: null,
                clientIndex: null,
                aMLErrorResponse: null,
                deleteNoteIds: [],
                proofOfIdLable: '',
                proofOfAddressLable: '',
                isClientCompanyNameReadOnly: true,
                clientCompanyNameCaption: null,
                isCompanyTabVisibility: true,
                isPersonalTabVisibility: true,
                isProofPrivateIndvVisibility: true,
                documentUploading: false,
                idCheckPrivateInduLable: 'COMPANY IDENTIFICATION REQUIREMENTS',
                idCheckIndividual: null,
                isIDCheckCompanyVisibility: true,
                isBeneficalOwnerVisibility: true,
                popupClosed: false,
                isCrimeTabVisibility: false,
                isProofOfIDUpload: false,
                isProofOfAddressUpload: false,
                isCompanyProof1Upload: false,
                isCompanyProof2Upload: false,
                clientMattersTotal: 0,
                clientMattersPaginationDef: { currentPage: 0, itemPerPage: 25 },
            };
            return {
                ...state,
                views: { ...state.views, ...temp },
                initDataModel: {
                    ...state.initDataModel,
                    userDefaultBranch: action.payload.userBranchId,
                    caseFileIdentity: action.payload.caseFileIdentity
                }
            };
        case ClientCreationAction.CLEAR_CLIENT_DATA:
            temp[action.token] = {
                originalModel: initializeModel(),
                model: initializeModel(),
                mode: Mode.SearchMode,
                isLoading: false,
                showConflictSearch: false,
                clientSeatchList: null,
                clientIndex: null,
                aMLErrorResponse: null,
                deleteNoteIds: [],
                proofOfIdLable: '',
                proofOfAddressLable: '',
                isClientCompanyNameReadOnly: true,
                clientCompanyNameCaption: null,
                isCompanyTabVisibility: true,
                isPersonalTabVisibility: true,
                isProofPrivateIndvVisibility: true,
                documentUploading: false,
                popupClosed: false,
                isCrimeTabVisibility: false,
                isProofOfIDUpload: false,
                isProofOfAddressUpload: false,
                isCompanyProof1Upload: false,
                isCompanyProof2Upload: false,
                idCheckPrivateInduLable: 'COMPANY IDENTIFICATION REQUIREMENTS',
                clientMattersTotal: 0,
                clientMattersPaginationDef: { currentPage: 0, itemPerPage: 25 },
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.GET_FULL_CLIENT_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.GET_FULL_CLIENT_DATA_SUCCESS:
            temp[action.token] = {
                originalModel: action.payload.clientModel,
                model: action.payload.clientModel,
                mode: Mode.EditMode,
                clientSeatchList: action.payload.clientSeatchList || state.views[action.token].clientSeatchList,
                clientIndex: action.payload.clientIndex || state.views[action.token].clientIndex,
                isCrimeTabVisibility: action.payload.hasCrimematters,
                isProofOfIDUpload: false,
                isProofOfAddressUpload: false,
                isCompanyProof1Upload: false,
                isCompanyProof2Upload: false,
                clientMattersTotal: 0,
                clientMattersPaginationDef: { currentPage: 0, itemPerPage: 25 }

            };
            if (temp[action.token].originalModel.client.privetIndividual) {
                temp[action.token] = privateIndividual(temp[action.token], temp[action.token].originalModel.client.privetIndividual, null);
                temp[action.token] = {
                    ...temp[action.token],
                    isProofPrivateIndvVisibility: true,
                };
            } else {
                temp[action.token] = clientTypeChanges(temp[action.token], action.payload.clientModel.client.clientType);
            }
            temp[action.token] = {
                ...temp[action.token],
                originalModel: temp[action.token].model,
                model: temp[action.token].model,
                deleteNoteIds: [],
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.ADD_UPDATE_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.ADD_UPDATE_CLIENT_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                model: action.payload,
                originalModel: action.payload,
                showConflictSearch: (state.views[action.token].model.client.clientId === -1
                    && state.initDataModel.clientDefaults.cD_ForceClientConflictSearch),
                mode: Mode.EditMode,
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.GET_CLIENT_CREATION_INT_DATA_SUCESS:
            return {
                ...state,
                initDataModel: { ...action.payload.response, loadInitData: true },
            };

        case ClientCreationAction.GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS_SUCCESS:

            temp = updateClientFullGridData(state.views[action.token], state.initDataModel, action);

            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.GET_FULL_CLIENT_DATA_WITH_GRID_PARAMS_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.GET_FULL_CLIENT_DATA_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.UPDATE_CLIENT:
            temp[action.token] = updateClient(state.views[action.token], action.payload.value, action.payload.property);
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.GET_SCREEN_LOOKUP_DATA_SUCESS:
            const newstate = looupUpdate(state, action.payload.lookupList, action.payload.lookupTypeTag);
            return newstate;

        case ClientCreationAction.CLIENTL_LOAD_DOCUMENT_URL_LOAD:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.CLIENTL_LOAD_DOCUMENT_URL_LOAD_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.CLIENTL_LOAD_DOCUMENT_URL_LOAD_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.ADD_UPDATE_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.ADD_UPDATE_CLIENT_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.AML_CHECK_FOR_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.AML_CHECK_FOR_CLIENT_SUCCESS:

            if (action.payload.result.data.errorResponse) {

                temp[action.token] = {
                    ...state.views[action.token],
                    isLoading: false,
                    aMLErrorResponse: action.payload.result.data.errorResponse,
                };
            } else {

                temp[action.token] = {
                    ...state.views[action.token],
                    isLoading: false,
                    model: {
                        ...state.views[action.token].model,
                        client: {
                            ...state.views[action.token].model.client,
                            amlSearchResult: action.payload.result.data.AMLResult
                        }
                    },
                };

            }

            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.AML_CHECK_FOR_CLIENT_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };


        case ClientCreationAction.DELETE_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };


        case ClientCreationAction.CLIENT_EVENT_GRID_REFRESH:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };


        case ClientCreationAction.CLIENT_EVENT_GRID_REFRESH_SUCCESS:

            temp[action.token] = {
                ...state.views[action.token],
                model: {
                    ...state.views[action.token].model,
                    clientEvents: action.payload.clientEvents
                },
                isLoading: false
            };

            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.CLIENT_MATTERS_GRID_REFRESH_SUCCESS:

            temp[action.token] = {
                ...state.views[action.token],
                model: {
                    ...state.views[action.token].model,
                    clientMatters: action.payload.clientMatters
                },
                isLoading: false
            };

            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.CLIENT_EVENT_GRID_REFRESH_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.DELETE_CLIENT_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
                popupClosed: true
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.CLIENT_CREATION_POPUP_CLOSE:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
                popupClosed: true
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.DELETE_CLIENT_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.PRE_FILL_LATTER_AND_CONTRACT_NAME:
            let clientTital = '';
            const clientItem = state.initDataModel.lookupTitleType.lookupViewModels
                .filter((item) => item.luP_ID === state.views[action.token].model.client.clientTitle)[0];
            if (clientItem) {
                clientTital = clientItem.luP_Code;
            }

            temp[action.token] = updateContractName(state.views[action.token], clientTital);
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.COPY_FORM_CORRESPONDENCE:
            temp[action.token] = updateCorrespondence(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.PRIVATE_INDIVIDUAL:
            temp[action.token] = privateIndividual(state.views[action.token], action.payload.value, action.payload.property);
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.FIRST_NAME_AS_DIRECTOR:
            temp[action.token] = updateAmlResult(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };

        case ClientCreationAction.ADD_NEW_NOTE:
            temp[action.token] = addNewClientNote(state.views[action.token], action.payload.noteBy, action.payload.timeOffset);
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.CHANGE_NOTE:
            temp[action.token] = chnageNote(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.DELETE_NOTE:
            temp[action.token] = deleteNote(state.views[action.token], action.payload.row);
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.CANCEL_NOTE_CHANGES:
            temp[action.token] = cancelNoteChanges(state.views[action.token]);
            return { ...state, views: { ...state.views, ...temp } };

        // Document
        case ClientCreationAction.FILE_UPLOAD:
            temp[action.token] = changeFileUploadState(state.views[action.token], true, action.payload.uploadDocumentType);
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.FILE_UPLOAD_SUCCESS:
            temp[action.token] = changeFileUploadState(state.views[action.token], false, action.payload.uploadDocumentType);
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.FILE_UPLOAD_FAIL:
            temp[action.token] = changeFileUploadState(state.views[action.token], false, action.payload.uploadDocumentType);
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.CLIENT_TYPE_CMB_CHANGES:
            temp[action.token] = clientTypeChanges(state.views[action.token], action.payload);
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.SET_USER_BRANCH_TO_NEW_CLIENT:
            temp[action.token] = {
                ...state.views[action.token],
                model: setUserBranchToNewClent(state.initDataModel.branchList, state.views[action.token],
                    state.initDataModel.userDefaultBranch),
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.CHANGE_RISK_ASSESSMENT_QUATION:
            temp[action.token] = {
                ...state.views[action.token],
                model: {
                    ...state.views[action.token].model,
                    riskAssessment: {
                        ...state.views[action.token].model.riskAssessment,
                        clientRiskAssessmentQuestions:
                            updateRiskAssesmentData(state.views[action.token].model.riskAssessment.clientRiskAssessmentQuestions,
                                action.item)
                    }
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.ADD_UPDATE_RISK_ASSESSMENT_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.ADD_UPDATE_RISK_ASSESSMENT_DATA_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
                model: {
                    ...state.views[action.token].model,
                    riskAssessment: action.riskAsseData
                }
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.ADD_UPDATE_RISK_ASSESSMENT_DATA:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.GET_MATTERS:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: true,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.GET_MATTERS_SUCCESS:
            temp[action.token] = {
                ...state.views[action.token],
                model: {
                    ...state.views[action.token].model,
                    clientMatters: action.mattersData.data
                },
                isLoading: false,
                clientMattersTotal: action.mattersData.total
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.GET_MATTERS_FAIL:
            temp[action.token] = {
                ...state.views[action.token],
                isLoading: false,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.CHANGE_MATTERS_PAGE:
            temp[action.token] = {
                ...state.views[action.token],
                clientMattersPaginationDef: action.matterPaginatorDef,
            };
            return { ...state, views: { ...state.views, ...temp } };
        case ClientCreationAction.GET_DEFUILT_RISK_ASSESMENT_DATA:
            return {
                ...state,
                initDataModel: {
                    ...state.initDataModel,
                    loadInitData: false
                },
            };
        case ClientCreationAction.GET_DEFUILT_RISK_ASSESMENT_DATA_SUCCESS:
            return {
                ...state,
                initDataModel: {
                    ...state.initDataModel,
                    loadInitData: true,
                    defuiltRiskAssesmentData: action.riskAsseData
                },
            };
        case ClientCreationAction.GET_DEFUILT_RISK_ASSESMENT_DATA_FAIL:
            return {
                ...state,
                initDataModel: {
                    ...state.initDataModel,
                    loadInitData: true
                },
            };
        default:
            return state;
    }
}

function updateClientFullGridData(state: ClientCreationState, initDataModel: InitClientCreationData, action) {
    const temp = {};
    temp[action.token] = {
        ...state,
        mode: Mode.EditMode,
        popupClosed: action.payload.withClose,
        isLoading: false,
        // showConflictSearch: (state.model.client.clientId === -1
        //     && initDataModel.clientDefaults.cD_ForceMatterConflictSearch),
    };

    const clientModel = { ...action.payload.clientModel };

    if (clientModel && clientModel.client) {
        temp[action.token] = {
            ...temp[action.token],
            model: {
                ...temp[action.token].model,
                client: clientModel.client
            },
        };
    }
    if (clientModel && clientModel.clientMatters) {
        temp[action.token] = {
            ...temp[action.token],
            model: {
                ...temp[action.token].model,
                clientMatters: clientModel.clientMatters
            },
        };
    }
    if (clientModel && clientModel.clientEvents) {

        temp[action.token] = {
            ...temp[action.token],
            model: {
                ...temp[action.token].model,
                clientEvents: clientModel.clientEvents
            },
        };
    }
    if (clientModel && clientModel.clientNotes) {

        temp[action.token] = {
            ...temp[action.token],
            model: {
                ...temp[action.token].model,
                clientNotes: clientModel.clientNotes
            },
        };

    }
    if (clientModel && clientModel.clientDocumentRegistries) {

        temp[action.token] = {
            ...temp[action.token],
            model: {
                ...temp[action.token].model,
                clientDocumentRegistries: clientModel.clientDocumentRegistries
            },
        };
    }
    if (clientModel && clientModel.matterBailConditions && clientModel.matterBailConditions.length > 0) {

        temp[action.token] = {
            ...temp[action.token],
            model: {
                ...temp[action.token].model,
                matterBailConditions: clientModel.matterBailConditions
            },
        };
    }

    if (clientModel && clientModel.riskAssessment) {

        temp[action.token] = {
            ...temp[action.token],
            model: {
                ...temp[action.token].model,
                riskAssessment: clientModel.riskAssessment
            },
        };
    }

    temp[action.token] = {
        ...temp[action.token],
        originalModel: { ...temp[action.token].model }
    };

    return temp;
}



function initializeModel(): ClientModel {
    const clientModel: ClientModel = {
        client: {
            clientId: null,
            branchID: null,
            firstName: null,
            lastName: null,
            clientReference: null,
            clientName: null,
            clientAddress1: null,
            clientAddress2: null,
            clientTown: null,
            clientCountry: null,
            clientPostCode: null,
            clientContactName: null,
            clientTelephoneNo: null,
            clientFaxNo: null,
            clientEmail: null,
            statementAddress1: null,
            statementAddress2: null,
            statementTown: null,
            statementCounty: null,
            statementPostCode: null,
            statementContentContactName: null,
            statementContentTelephone: null,
            statementContentFacsimile: null,
            statementContentEmail: null,
            currencyCode: null,
            vatCode: null,
            creditLimit: null,
            terms: null,
            onHold: null,
            balance: null,
            accountType: null,
            accountName: null,
            paymentSortCode: null,
            companyReg: null,
            vatRegNo: null,
            companyAddress1: null,
            companyAddress2: null,
            companyTown: null,
            companyCountry: null,
            companyPostCode: null,
            nameAtBirth: null,
            placeOfBirth: null,
            dateOfBirth: null,
            niNumber: null,
            startDate: null,
            feeEarner: null,
            accountNo: null,
            clientTitle: null,
            gender: null,
            ethnicOrigin: null,
            disabilityMonitoring: null,
            clientLetterTitle: null,
            clientIntroduction: null,
            clientMobileTelephoneNo: null,
            clientWorkTelephoneNo: null,
            clientSecondEmail: null,
            companySICCode: null,
            dateOfDeath: null,
            clientCompanyName: null,
            clientType: null,
            bacsPayment: false,
            bacsCode: null,
            privetIndividual: false,
            companyName: null,
            companyProof1: null,
            companyProof2: null,
            directorForename: null,
            directorSurname: null,
            directorDOB: null,
            directorProofIDinfo: null,
            directorAddressinfo: null,
            firstNameasdirector: false,
            forename1: null,
            surname1: null,
            doB1: null,
            percentageHeld1: null,
            companyDetail: null,
            directorProofofID: null,
            directorAddressProof: null,
            clientNotoMarketing: null,
            forename2: null,
            surname2: null,
            doB2: null,
            percentageHeld2: null,
            forename3: null,
            surname3: null,
            doB3: null,
            percentageHeld3: null,
            forename4: null,
            surname4: null,
            doB4: null,
            percentageHeld4: null,
            creditControlStage: null,
            dateStageSet: null,
            suspendCreditControl: null,
            reasonToSuspend: null,
            amlSearchResult: null,
            amlLastSearch: null,
            amlRiskLevel: null,
            additionalName1: null,
            additionalName2: null,
            additionalName3: null,
            riskAssessmentFailed: null,
            cliBal: null,
            clientAccountNo: null,
            privateMatter: null,
            bUP: null,
            dpu: null,
            branch: null,
            mailMerge: null,
            uCN: null,
            closeDate: null,
            offBal: null,
            dDABal: null,
            introduction: null,
            termsDays: null,
            deliveryAddress: null,
            nominalCode: null,
            initials: null,
            timBal: null,
            proofIdInfoDateAdded: null,
            proofAddrsInfoDateAdded: null,
            proofIdExpiryDate: null,
        },
        clientEvents: [],
        matterBailConditions: [],
        clientDocumentRegistries: [],
        clientMatters: [],
        clientNotes: [],

    };
    return clientModel;
}

function privateIndividual(view: ClientCreationState, value: boolean, property: string) {
    if (value) {
        return Object.freeze({
            ...view
            , idCheckPrivateInduLable: 'INDIVIDUAL IDENTIFICATION REQUIREMENTS',
            idCheckIndividual: 'Individual',
            isIDCheckCompanyVisibility: false,
            isBeneficalOwnerVisibility: false,
            // isProofPrivateIndvVisibility: true
            proofOfIdLable: 'Proof of ID',
            proofOfAddressLable: 'Proof of Address'
        });
    } else {
        return Object.freeze({
            ...view,
            idCheckPrivateInduLable: 'COMPANY IDENTIFICATION REQUIREMENTS',
            idCheckIndividual: 'Director ID',
            isIDCheckCompanyVisibility: true,
            isBeneficalOwnerVisibility: true,
        });
    }
}

function looupUpdate(state: State, lookupLists: LookupViewModel, lookupTypeTag): State {
    switch (lookupTypeTag) {
        case 'SALTITLE':
            {
                return {
                    ...state, initDataModel: {
                        ...state.initDataModel,
                        lookupTitleType:
                            { ...state.initDataModel.lookupTitleType, lookupViewModels: lookupLists.lookupViewModels },
                    }
                };
            }
        case 'SALINTRO':
            {
                return {
                    ...state, initDataModel: {
                        ...state.initDataModel,
                        lookupIntroductionType:
                            { ...state.initDataModel.lookupIntroductionType, lookupViewModels: lookupLists.lookupViewModels },
                    }
                };
            }
        case 'SALTERMS':
            {
                return {
                    ...state, initDataModel: {
                        ...state.initDataModel,
                        lookupTermsType:
                            { ...state.initDataModel.lookupTermsType, lookupViewModels: lookupLists.lookupViewModels },
                    }
                };
            }
        case 'MATPROOFOFID':
            {
                return {
                    ...state, initDataModel: {
                        ...state.initDataModel,
                        lookupProofIDType:
                            { ...state.initDataModel.lookupProofIDType, lookupViewModels: lookupLists.lookupViewModels },
                    }
                };
            }

        case 'MATPROOFOFADDR':
            {
                return {
                    ...state, initDataModel: {
                        ...state.initDataModel,
                        lookupProofAddressType:
                            { ...state.initDataModel.lookupProofAddressType, lookupViewModels: lookupLists.lookupViewModels },
                    }
                };
            }
    }
}

function updateContractName(orgianview: ClientCreationState, clientTital) {
    const view = { ...orgianview };
    const temp = view.model;
    if (view && view.model && view.model.client) {
        // const temp = {};
        if (!view.model.client.clientLetterTitle
            && (view.model.client.firstName || view.model.client.lastName || view.model.client.clientTitle)) {
            view.model.client.clientLetterTitle = '';
            let firstLetter = '';
            if (view.model.client.firstName) {
                firstLetter = view.model.client.firstName.substring(0, 1);
            }
            if (clientTital && clientTital) {
                view.model.client.clientLetterTitle = clientTital + ' ';
            }
            if (firstLetter) {
                view.model.client.clientLetterTitle = temp.client.clientLetterTitle + firstLetter + ' ';
            }
            if (view.model.client.lastName) {
                view.model.client.clientLetterTitle = temp.client.clientLetterTitle + view.model.client.lastName;
            }
            view.model.client.clientLetterTitle = (temp.client.clientLetterTitle) ? temp.client.clientLetterTitle.trim() : '';
        }

        if (!view.model.client.clientContactName
            && (view.model.client.firstName || view.model.client.lastName)) {
            view.model.client.clientContactName = '';
            if (view.model.client.firstName) {
                view.model.client.clientContactName = view.model.client.firstName + ' ';
            }
            if (view.model.client.lastName) {
                view.model.client.clientContactName = view.model.client.clientContactName + view.model.client.lastName;
            }
            view.model.client.clientContactName = view.model.client.clientContactName.trim();
        }
        if (!view.model.client.statementContentContactName && (view.model.client.firstName || view.model.client.lastName)) {
            view.model.client.statementContentContactName = '';
            if (view.model.client.firstName) {
                view.model.client.statementContentContactName = view.model.client.firstName + ' ';
            }
            if (view.model.client.lastName) {
                view.model.client.statementContentContactName = view.model.client.statementContentContactName + view.model.client.lastName;
            }
            view.model.client.statementContentContactName = view.model.client.statementContentContactName.trim();
        }
        if (!view.model.client.clientName && (view.model.client.firstName || view.model.client.lastName ||
            view.model.client.clientCompanyName)) {
            view.model.client.clientName = '';
            if (view.model.client.lastName) {
                view.model.client.clientName = view.model.client.lastName + ' ';
            }
            if (view.model.client.firstName) {
                view.model.client.clientName = view.model.client.clientName + view.model.client.firstName + ' ';
            }
            if (view.model.client.clientCompanyName) {
                view.model.client.clientName = view.model.client.clientName + view.model.client.clientCompanyName;
            }
            view.model.client.clientName = view.model.client.clientName.trim();
        }

        if (view.model.client.firstName) {
            view.model.client.directorForename = view.model.client.firstName;
        }
        if (view.model.client.lastName) {
            view.model.client.directorSurname = view.model.client.lastName;
        }

        return { ...view, model: { ...view.model, client: { ...view.model.client, ...temp } } };

    }
    return view;
}


function updateAmlResult(view: ClientCreationState) {
    return {
        ...view,
        forename1: view.model.client.directorForename,
        dOB1: view.model.client.directorDOB,
        surname1: view.model.client.directorDOB,
    };
}



// function updateLookup(view: ClientCreationState) {
//     if (view && view.model) {
//         view.model.client.forename1 = view.model.client.directorForename;
//         view.model.client.dOB1 = view.model.client.directorDOB;
//         view.model.client.surname1 = view.model.client.directorSurname;
//     }
//     return view;
// }

function updateCorrespondence(view: ClientCreationState) {
    if (view && view.model) {
        view.model.client.statementAddress1 = view.model.client.clientAddress1;
        view.model.client.statementAddress2 = view.model.client.clientAddress2;
        view.model.client.statementTown = view.model.client.clientTown;
        view.model.client.statementCounty = view.model.client.clientCountry;
        view.model.client.statementPostCode = view.model.client.clientPostCode;
        view.model.client.statementContentContactName = view.model.client.clientContactName;
        view.model.client.statementContentEmail = view.model.client.clientEmail;
        view.model.client.statementContentTelephone = view.model.client.clientTelephoneNo;
        view.model.client.statementContentFacsimile = view.model.client.clientFaxNo;
        return view;
    }
}
// Note
function addNewClientNote(state: ClientCreationState, noteBy: string, timeOffset) {
    if (!state.model) {
        return state;
    }
    const newNote: ClientNoteModel = {
        clientRef: state.model ? state.model.client.clientReference : '',
        noteDate: dpsNewDate(timeOffset), note: '',
        noteBy: noteBy,
        noteNo: -1,
        isEdit: true
    };
    return {
        ...state,
        model: {
            ...state.model,
            clientNotes: [newNote].concat(state.model.clientNotes)
        }
    };
}

function chnageNote(state: ClientCreationState, payload: { kind: string, row: number; value: any }) {
    return {
        ...state,
        model: {
            ...state.model,
            clientNotes: state.model.clientNotes.map((note, index) => {
                if (payload.row === index) {
                    switch (payload.kind) {
                        case 'DATE': {
                            return Object.freeze({ ...note, noteDate: payload.value, isEdit: true });
                        }
                        case 'BY': {
                            return Object.freeze({ ...note, noteBy: payload.value, isEdit: true });
                        }
                        case 'NOTE': {
                            return Object.freeze({ ...note, note: payload.value, isEdit: true });
                        }
                        default: {
                            return note;
                        }
                    }
                } else {
                    return note;
                }

            })
        }
    };
}

function deleteNote(state: ClientCreationState, row: number) {
    const deleteItem = state.model.clientNotes.find((val, i) => i === row && val.noteNo !== -1);
    return {
        ...state,
        model: {
            ...state.model,
            clientNotes: state.model.clientNotes.filter((val, i) => i !== row)
        },
        deleteNoteIds: deleteItem && deleteItem.noteNo !== -1 ? state.deleteNoteIds.concat([deleteItem.noteNo]) : state.deleteNoteIds
    };
}

function cancelNoteChanges(state: ClientCreationState) {
    return {
        ...state,
        model: {
            ...state.model,
            clientNotes: state.originalModel.clientNotes
        }
    };
}

function updateClient(view: ClientCreationState, value, property: string) {
    if (view && view.model) {
        const temp = {};
        temp[property] = value;
        return { ...view, model: { ...view.model, client: { ...view.model.client, ...temp } } };
    }
    return view;
}

// Documen Upload
function changeFileUploadState(

    view: ClientCreationState,
    isUploading: boolean,
    uploadDocumentType: UploadDocumentType) {

    if (!isUploading && uploadDocumentType === UploadDocumentType.CompanyProof1) {
        return {
            ...view,
            documentUploading: isUploading,
            isCompanyProof1Upload: true,
        };
    }

    if (!isUploading && uploadDocumentType === UploadDocumentType.CompanyProof2) {
        return {
            ...view,
            documentUploading: isUploading,
            isCompanyProof2Upload: true,
        };
    }

    if (!isUploading && uploadDocumentType === UploadDocumentType.ProofofID) {
        return {
            ...view,
            documentUploading: isUploading,
            isProofOfIDUpload: true,
        };
    }

    if (!isUploading && uploadDocumentType === UploadDocumentType.ProofofAddress) {

        return {
            ...view,
            documentUploading: isUploading,
            isProofOfAddressUpload: true,
        };
    }



    return {
        ...view,
        documentUploading: isUploading,
    };
}

function clientTypeChanges(state: ClientCreationState, typeCode: number): Partial<ClientCreationState> {
    let proof1 = '';
    let proof2 = '';
    if (state.mode === Mode.AddMode || Mode.EditMode) {
        proof1 = state.model.client.companyProof1;
        proof2 = state.model.client.companyProof2;
    }
    if (typeCode === 1) {
        return Object.freeze({
            ...state
            , proofOfIdLable: 'Dir Proof of ID'
            , proofOfAddressLable: 'Dir Proof of Address'
            , isClientCompanyNameReadOnly: false
            , clientCompanyNameCaption: 'Company Name'
            , isCompanyTabVisibility: true
            , isPersonalTabVisibility: false
            , isProofPrivateIndvVisibility: true

            , idCheckPrivateInduLable: 'COMPANY IDENTIFICATION REQUIREMENTS'
            , idCheckIndividual: 'Director ID'
            , isIDCheckCompanyVisibility: true
            , isBeneficalOwnerVisibility: true

            , model: {
                ...state.model,
                client: {
                    ...state.model.client,
                    privetIndividual: false,
                    companyProof1: proof1,
                    companyProof2: proof2
                }
            }
        });
    } else if (typeCode === 2) {
        return Object.freeze({
            ...state
            , proofOfIdLable: 'Dir Proof of ID'
            , proofOfAddressLable: 'Dir Proof of Address'
            , isClientCompanyNameReadOnly: false
            , clientCompanyNameCaption: 'Charity Name'
            , isCompanyTabVisibility: true
            , isPersonalTabVisibility: false
            , isProofPrivateIndvVisibility: true

            , idCheckPrivateInduLable: 'COMPANY IDENTIFICATION REQUIREMENTS'
            , idCheckIndividual: 'Director ID'
            , isIDCheckCompanyVisibility: true
            , isBeneficalOwnerVisibility: true

            , model: {
                ...state.model,
                client: {
                    ...state.model.client,
                    privetIndividual: false,
                    companyProof1: proof1,
                    companyProof2: proof2
                }
            }
        });
    } else if (typeCode === 3) {
        return Object.freeze({
            ...state
            , proofOfIdLable: 'Dir Proof of ID'
            , proofOfAddressLable: 'Dir Proof of Address'
            , isClientCompanyNameReadOnly: false
            , clientCompanyNameCaption: 'Trading As'
            , isCompanyTabVisibility: true
            , isPersonalTabVisibility: false
            , isProofPrivateIndvVisibility: true

            , idCheckPrivateInduLable: 'COMPANY IDENTIFICATION REQUIREMENTS'
            , idCheckIndividual: 'Director ID'
            , isIDCheckCompanyVisibility: true
            , isBeneficalOwnerVisibility: true

            , model: {
                ...state.model,
                client: {
                    ...state.model.client,
                    privetIndividual: false,
                    companyProof1: proof1,
                    companyProof2: proof2
                }
            }
        });
    } else if (typeCode === 4) {
        return Object.freeze({
            ...state
            , proofOfIdLable: 'Proof of ID'
            , proofOfAddressLable: 'Proof of Address'
            , isClientCompanyNameReadOnly: true
            , clientCompanyNameCaption: 'Not Applicable'
            , isCompanyTabVisibility: false
            , isPersonalTabVisibility: true
            , isProofPrivateIndvVisibility: false

            , idCheckPrivateInduLable: 'INDIVIDUAL IDENTIFICATION REQUIREMENTS'
            , idCheckIndividual: 'Individual'
            , isIDCheckCompanyVisibility: false
            , isBeneficalOwnerVisibility: false

            , model: {
                ...state.model,
                client: {
                    ...state.model.client,
                    privetIndividual: false // true 26/03/2019
                }
            }
        });
    } else if (typeCode === 5) {
        return Object.freeze({
            ...state
            , proofOfIdLable: 'Proof of ID'
            , proofOfAddressLable: 'Proof of Address'
            , isClientCompanyNameReadOnly: true
            , clientCompanyNameCaption: 'Not Applicable'
            , isCompanyTabVisibility: false
            , isPersonalTabVisibility: true
            , isProofPrivateIndvVisibility: false

            , idCheckPrivateInduLable: 'INDIVIDUAL IDENTIFICATION REQUIREMENTS'
            , idCheckIndividual: 'Individual'
            , isIDCheckCompanyVisibility: false
            , isBeneficalOwnerVisibility: false

            , model: {
                ...state.model
                , client: {
                    ...state.model.client,
                    privetIndividual: false  // true 26/03/2019
                }
            }
        });
    } else {
        return state;
    }
}

function setCompanyMode(view) {
    if (view.mode === 'Edit Mode') {
        view.model.client.companyProof1 = 1;
        view.model.client.companyProof2 = 1;
    } else {
        view.model.client.companyProof1 = '';
        view.model.client.companyProof2 = '';
    }
}

function setUserBranchToNewClent(branchList: DropdownListData[], view: ClientCreationState, userBranchId: number): ClientModel {
    if (!!view.model && !view.model.client.clientId && branchList && branchList.length > 0) {
        const userBarnch = branchList.find(b => b.key === userBranchId);
        return {
            ...view.model, client:
            {
                ...view.model.client,
                branch: !!userBarnch ? userBarnch.value : null,
                branchID: !!userBarnch ? userBranchId : null
            }
        };
    }
    return view.model;
}

function updateRiskAssesmentData(currentItem: ClientRiskAssessmentQuestion[], updatedItem: ClientRiskAssessmentQuestion) {
    if (currentItem) {
        return currentItem.map(i => {
            if (i.uniqueQuestionId === updatedItem.uniqueQuestionId) {
                return updatedItem;
            }
            return i;
        });
    }
    return currentItem;
}

const getState = (state: State) => state;
export const getViewByToken = (token) => createSelector(getState, (state) => state.views[token]);
export const getInitDataModel = createSelector(getState, (state) => state.initDataModel);
export const getIsLoading = (token) => createSelector(getViewByToken(token), (view) => view ? view.isLoading : true);
export const getIsDocumentUploading = (token) => createSelector(getViewByToken(token), (view) => view ? view.documentUploading : false);
export const getClientModel = (token) => createSelector(getViewByToken(token), (view) => view ? view.model : null);
export const getClientSeatchList = (token) => createSelector(getViewByToken(token), (view) => view ? view.clientSeatchList : null);
export const getClientIndex = (token) => createSelector(getViewByToken(token), (view) => view ? view.clientIndex : null);

export const getShowConflictSearch = (token) => createSelector(getViewByToken(token), (view) => view ? view.showConflictSearch : null);

export const getIsModelDirtyByToken = (token) => createSelector(getViewByToken(token), (view) => {
    let gridEdit = false;
    if (view && view.model && view.model.clientNotes && view.model.clientNotes.filter(p => p.isEdit).length > 0) {
        gridEdit = true;
    }
    if (view && view.deleteNoteIds && view.deleteNoteIds.length > 0) {
        gridEdit = true;
    }
    const value = view ? (JSON.stringify(view.originalModel) !== JSON.stringify(view.model) || gridEdit) : false;
    return value;
});

export const getPopupClosedToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.popupClosed : null);

// export const getIsModelDirtyByToken = (token) => createSelector(getViewByToken(token), (view) =>
//     view ? JSON.stringify(view.originalModel) !== JSON.stringify(view.model) : false);


export const getModeByToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.mode : null);

export const getDeleteNoteIdsToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.deleteNoteIds : []);

export const getClientNotesToken = (token) => createSelector(getViewByToken(token), (view) => view ?
    view.model.clientNotes.filter(p => p.isEdit).map(p => ({
        ...p,
        noteDate: datePipe.transform(p.noteDate, 'yyyy-MM-dd') + 'T00:00:00'
    })) : []);


export const getSelectedMatterIdByToken = (token) => createSelector(getViewByToken(token), (view) => view ? view.selectedMatterId : null);

export const getIsCrimeTabVisibilityToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.isCrimeTabVisibility : null);




export const getIsProofOfIDUploadToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.isProofOfIDUpload : null);

export const getIsProofOfAddressUploadToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.isProofOfAddressUpload : null);

export const getIsCompanyProof1UploadToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.isCompanyProof1Upload : null);

export const getIsCompanyProof2UploadToken = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.isCompanyProof2Upload : null);

export const getTypeChangeControllerListByToken = (token) => createSelector(getViewByToken(token), (state) => {
    if (state) {
        return {
            proofOfIdLable: state.proofOfIdLable,
            proofOfAddressLable: state.proofOfAddressLable,
            isClientCompanyNameReadOnly: state.isClientCompanyNameReadOnly,
            clientCompanyNameCaption: state.clientCompanyNameCaption,
            isCompanyTabVisibility: state.isCompanyTabVisibility,
            isPersonalTabVisibility: state.isPersonalTabVisibility,
            isProofPrivateIndvVisibility: state.isProofPrivateIndvVisibility,
            idCheckPrivateInduLable: state.idCheckPrivateInduLable,
            idCheckIndividual: state.idCheckIndividual,
            isIDCheckCompanyVisibility: state.isIDCheckCompanyVisibility,
            isBeneficalOwnerVisibility: state.isBeneficalOwnerVisibility,
        };
    } else {
        return null;
    }
});

export const getRiskAssessmentDataByToken = (token) => createSelector(getViewByToken(token),
    state => state.model && state.model ? state.model.riskAssessment : null);
export const getMatterPaginationDef = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.clientMattersPaginationDef : null);
export const getClientMattersTotal = (token) => createSelector(getViewByToken(token),
    (view) => view ? view.clientMattersTotal : 0);
export const getCaseFileIdentity = createSelector(getState, (state) => state.initDataModel.caseFileIdentity ?
    state.initDataModel.caseFileIdentity : null);
