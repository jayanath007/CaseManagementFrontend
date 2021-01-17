import { ContactScreenItemWrapper } from '../../screen-contact-core/models/interface';
import { ScreenComponent } from '../models/screen-component';

import { UNLINK_CONTACT_FAILED, REMOVE_CONTACT_FROM_FILE_SUCCESS } from '../../screen-contact-core/actions/core';
import { IVarValue } from '../../workflow-core';
import { IMainState } from '../../screen-desingner-core/models/screen-desingner-request';
import { Component } from '@angular/core';
import {
    ViewChangeKind,
    RowItemChangeKind
} from '../actions/core';
import * as Actions from '../actions/core';
import { UnlinkContactSuccess, UNLINK_CONTACT_SUCCESS, UNLINK_CONTACT } from '../../screen-contact-core/actions/core';
import { createSelector } from '@ngrx/store';
import { ScreenContanerComponent, ScreenComponentDto } from '../models/screen-contaner-component';
import { ScreenDefinition, ScreenDefinitionDto } from '../models/screen-definition';
import { Matter } from '../../core/lib/matter';
import * as CoreActions from '../../workflow-menu-core/actions/core';
import { Utilities } from '../models/utilities';


export interface FormView {
    screenContanerComponentList: ScreenContanerComponent[];
    screenDefinition?: ScreenDefinition;
    index: number;
}

export interface FormViewRespons {
    screenControlList: ScreenComponentDto[];
    screenDefinition: ScreenDefinitionDto;
    initialInfor?: { errorMasages: Array<string> };
    index: number;
}

export interface ContactSearch {
    currentContactId: number;
    contactDirty: boolean;
    contactsOnFile: number;
    enableSaving: boolean;
    screenControlValuesisDirty: boolean;
    disableSearchButtons: boolean;
}

export interface ScreenViewState {
    currentIndex: number;
    screenList?: Array<number>;
    appId: number;
    formView: FormView;
    formViewResponsList: FormViewRespons[];
    isLoading: boolean;
    isDisabaleTabLogic: boolean;
    mainState: IMainState;
    isFormDataLoading: boolean;
    initialInfor: { errorMasages: Array<string> };
    matter: Matter;
    contactSearch: ContactSearch;
}

export interface State {
    views: {
        [token: string]: ScreenViewState;
    };
}

const initialState: State = { views: {} };
export function reducer(state: State = initialState, action: Actions.Any | CoreActions.Any): State {
    const tmp = {};
    switch (action.type) {


        case CoreActions.RUN_WORKFLOW_COMMAND:
            return { ...state, views: {} };
        case Actions.INIT_SCREEN_VIEW_POPUP:
            tmp[action.token] = initView(state.views[action.token]);
            tmp[action.token] = {
                ...initContactSearchParams(tmp[action.token]),
            };
            console.log('reducer' + Actions.INIT_SCREEN_VIEW_POPUP, { ...state, views: { ...state.views, ...tmp } });
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.LOAD_FORM_VIEW_DATA:
            tmp[action.token] = {
                ...state.views[action.token], ...{
                    isFormDataLoading: true,
                    isDisabaleTabLogic: true,
                    currentIndex: action.request.filterOptions.currentIndex,
                    screenList: action.request.filterOptions.screenList
                }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_FORM_VIEW_DATA_LOAD_SUCCESS:
            const isDirty = shouldDirtyTheContact(action.payload.response.screenContanerComponentList);
            tmp[action.token] = {
                ...state.views[action.token], ...{
                    isFormDataLoading: false, isLoading: false,
                    formView: action.payload.response,
                    contactSearch: {
                        ...state.views[action.token].contactSearch, contactDirty: isDirty,
                        screenControlValuesisDirty: isDirty
                    }
                }
            };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.FORM_VIEW_CHANGE:
            tmp[action.token] = viewChange(state.views[action.token], action);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_FORM_VIEW_LIST_DATA:
            tmp[action.token] = { ...state.views[action.token], ...{ isLoading: true } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_FORM_VIEW_LIST_DATA_LOAD_SUCCESS:
            tmp[action.token] = {
                ...state.views[action.token],
                ...{ formViewResponsList: action.payload.response, isLoading: false }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_FORM_VIEW_LIST_DATA_LOAD_FAIL:
            tmp[action.token] = { ...state.views[action.token], ...{ formViewResponsList: [], isLoading: false } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.SCREEN_TAB_LOGIC_UPDATE:
            tmp[action.token] = { ...state.views[action.token], ...{ isDisabaleTabLogic: action.payload.value } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.IS_FORM_DATA_LOADING:
            tmp[action.token] = { ...state.views[action.token], ...{ isFormDataLoading: action.payload.value } };
            return { ...state, views: { ...state.views, ...tmp } };

        case Actions.SCREEN_VIEW_UPLOAD_ATACHMENT:
            tmp[action.token] = { ...state.views[action.token], ...{ isFormDataLoading: true } };
            return { ...state, views: { ...state.views, ...tmp } };


        case Actions.SCREEN_VIEW_UPLOAD_ATACHMENT_SUCCESS:

            tmp[action.token] = setControlerIsUpload(action.token, state, action.payload.controler);


            return { ...state, views: { ...state.views, ...tmp } };


        case Actions.SCREEN_VIEW_UPLOAD_ATACHMENT_FAILED:
            tmp[action.token] = { ...state.views[action.token], ...{ isFormDataLoading: false } };
            return { ...state, views: { ...state.views, ...tmp } };




        case Actions.INITIAL_DATA_INFOR_UPDATE_LOADING:
            tmp[action.token] = {
                ...state.views[action.token], ...{ initialInfor: action.payload.masages }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.LOAD_MAIN_STATE_SUCCESS:
            tmp[action.token] = { ...state.views[action.token], ...{ mainState: action.payload.response } };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.SET_CURRENT_CONTACT_ID:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, currentContactId: action.payload.contactId }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.REFRESH_CONTACT_ON_FLAG:
            tmp[action.token] = refreshContactOnFlag(action.token, state, state.views[action.token].contactSearch.currentContactId);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.SET_NEW_VAR_VALUES:
            tmp[action.token] = setNewVarValues(action.token, state, action.payload.varValues, action.payload.focusContainerName);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.CLEAR_FORM_DATA:
            tmp[action.token] = clearFormData(action.token, state);
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.SET_CONTACT_DIRTY_STATE:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, contactDirty: action.payload.isDirty }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.SET_SCREEN_CONTROL_VALUES_DIRTY_STATE:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, screenControlValuesisDirty: action.payload.isDirty }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_CONTACTS_ON_FILE:
            // tmp[action.token] = { ...state.views[action.token],
            // contactSearch: {...state.views[action.token].contactSearch, contactsOnFile: 0 } };
            // return { ...state, views: { ...state.views, ...tmp } };
            return state;
        case Actions.GET_CONTACTS_ON_FILE_SUCCESS:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, contactsOnFile: action.payload.contactsOnFile }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_CONTACTS_ON_FILE_FAILED:
            // tmp[action.token] = { ...state.views[action.token],
            // contactSearch: {...state.views[action.token].contactSearch, contactsOnFile: 0 } };
            // return { ...state, views: { ...state.views, ...tmp } };
            return state;
        case Actions.SET_CONTACTS_ON_FILE:
            // refactor in to seperate function
            let count = state.views[action.token].contactSearch.contactsOnFile;
            if (action.payload.increment) {
                count = ++count;
            } else if (count > 0) {
                count = --count;
            }
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: {
                    ...state.views[action.token].contactSearch,
                    contactsOnFile: count
                }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.SET_ENABLE_CONTACT_SAVING:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, enableSaving: action.payload.enableSaving }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_CURRENT_SCREEN_CONTACT_ID:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, currentContactId: null }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_CURRENT_SCREEN_CONTACT_ID_SUCCESS:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, currentContactId: action.payload.currentContactId }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.GET_CURRENT_SCREEN_CONTACT_ID_FAILED:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, currentContactId: null }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case UNLINK_CONTACT:
            tmp[action.token] = { ...state.views[action.token], isLoading: true };
            return { ...state, views: { ...state.views, ...tmp } };
        case UNLINK_CONTACT_SUCCESS:
            const contactCount = state.views[action.token].contactSearch.contactsOnFile - 1;
            tmp[action.token] = {
                ...refreshContactOnFlag(action.token, state, 0), isLoading: false,
                contactSearch: { ...state.views[action.token].contactSearch, currentContactId: 0, contactsOnFile: contactCount }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case UNLINK_CONTACT_FAILED:
            tmp[action.token] = {
                ...state.views[action.token], isLoading: false,
                contactSearch: { ...state.views[action.token].contactSearch }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case Actions.SET_DISABLE_SEARCH_BUTTONS:
            tmp[action.token] = {
                ...state.views[action.token],
                contactSearch: { ...state.views[action.token].contactSearch, disableSearchButtons: action.payload.disableSearchButtons }
            };
            return { ...state, views: { ...state.views, ...tmp } };
        case REMOVE_CONTACT_FROM_FILE_SUCCESS:
            /*
                If Removed Contact from file search is current contactId
                - Fire event to remove current contact
                - reduce contact count of file
                - clear fields
             */
            const newContactCount = state.views[action.token].contactSearch.contactsOnFile - action.payload.contacts.length;
            if (isCurrentContactRemoved(action.token, state, action.payload.contacts)) {
                tmp[action.token] = {
                    ...refreshContactOnFlag(action.token, state, 0),
                    ...clearFormData(action.token, state),
                    contactSearch: {
                        ...state.views[action.token].contactSearch, currentContactId: 0, contactDirty: false,
                        contactsOnFile: newContactCount
                    }
                };
                return { ...state, views: { ...state.views, ...tmp } };
            } else {
                tmp[action.token] = {
                    ...state.views[action.token],
                    contactSearch: { ...state.views[action.token].contactSearch, contactsOnFile: newContactCount }
                };
                return { ...state, views: { ...state.views, ...tmp } };
            }
        default:
            { return state; }
    }
}




function initView(state: ScreenViewState): Partial<ScreenViewState> {
    if (!state) {
        return {
            formView: undefined,
            formViewResponsList: [],
            isLoading: false,
            isFormDataLoading: false,
            isDisabaleTabLogic: true,
            currentIndex: 0,
        };
    }
    return state;
}

function initContactSearchParams(screenViewState: ScreenViewState): ScreenViewState {
    return {
        ...screenViewState, contactSearch: {
            currentContactId: null,
            contactDirty: false,
            contactsOnFile: 0,
            enableSaving: false,
            screenControlValuesisDirty: false,
            disableSearchButtons: false,
        }
    };
}
function viewChange(state: ScreenViewState, action: Actions.FormViewChange): Partial<ScreenViewState> {
    switch (action.payload.kind) {
        case ViewChangeKind.GoToNext:
            return {
                ...state,
                ...initContactSearchParams(state),
                currentIndex: action.payload.value.currentIndex
            };
        case ViewChangeKind.GoToPrevious:
            return {
                ...state,
                ...initContactSearchParams(state),
                currentIndex: action.payload.value.currentIndex,
            };
        case ViewChangeKind.InitialLoad:
            return {
                ...state,
                matter: {
                    AppId: action.payload.value.appId,
                    BranchId: action.payload.value.branchId,
                    FileId: action.payload.value.fileId,
                    MatterReferenceNo: null,
                    isLegalAid: action.payload.value.isLegalAid
                }
            };
        default: {
            return state;
        }
    }
}

function shouldDirtyTheContact(componentList: ScreenContanerComponent[]) {
    // If it's a mapped contact field - excluding contact refs,
    // which will be integer values - dirty the contact
    // const mappedComponents = componentList.filter(component => {
    //     return component.mappedContactField != null && component.mappedContactField !== '' &&
    //      (Utilities.atoi(component.mappedContactField) === 0);
    // });

    // return mappedComponents.length > 0;
    return false;
}

export const getViews = (state: State) => {
    return state.views;
};
export const getViewByToken = (token) => createSelector(getViews, (views) => {
    return views[token];
});
export const getScreenViewStatus = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.isLoading;
    }
);
export const getMainState = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.mainState;
    }
);
export const getinitialInfor = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.initialInfor;
    }
);

export const getFormViewData = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formView) {
            return state.formView;
        }
    }
);

export const getFormViewResponsListDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        console.log(state);
        return state.formViewResponsList;
    }
);
export const getCurentFormViewDataByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formView) {
            return state.formView;
        }
    }
);

export const getFormViewResponsDataByIndex = (token, index) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formViewResponsList) {
            return state.formViewResponsList.filter((data) => {
                return data.index === index;
            })[0];
        } else {
            return null;
        }
    }
);

export const getFormViewResponsDataByCurrentIndex = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.formViewResponsList) {
            return state.formViewResponsList.filter((data) => {
                return data.index === state.currentIndex;
            })[0];
        } else {
            return null;
        }
    }
);

export const getCurentFormScreenContanerComponentList = (token) => createSelector(getCurentFormViewDataByToken(token),
    (state) => {
        if (state) {
            return state.screenContanerComponentList;
        }
    }
);
export const getCurentFormScreenDefinition = (token) => createSelector(getCurentFormViewDataByToken(token),
    (state) => {
        return state.screenDefinition;
    }
);

export const getMatterDetailsByToken = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.matter;
    }
);

export const getContactDirty = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.contactSearch.contactDirty;
    }
);

// export const getRemoveCurrentContact = (token) => createSelector(getViewByToken(token),
//     (state) => {
//         return state.contactSearch.removeCurrentContact;
//     }
// );

export const getScreenControlValuesisDirty = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.contactSearch.screenControlValuesisDirty;
    }
);

export const getEnableSaving = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.contactSearch.enableSaving;
    }
);

export const getCurrentContactId = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.contactSearch.currentContactId;
    }
);

export const getContactsOnFile = (token) => createSelector(getViewByToken(token),
    (state) => {
        if (state.contactSearch.contactsOnFile) {
            return state.contactSearch.contactsOnFile;
        } else {
            return 0;
        }
    }
);

export const getDisableSearchButtonsStatus = (token) => createSelector(getViewByToken(token),
    (state) => {
        return state.contactSearch.disableSearchButtons;
    }
);

function refreshContactOnFlag(token: string, state: State, currentContactId: number) {
    const viewState = state.views[token];
    let componentList: ScreenContanerComponent[];
    if (viewState.formView.screenDefinition.dataSource === 3 && currentContactId > 0) {
        componentList = viewState.formView.screenContanerComponentList.map(component => {
            // todo update field_Value
            const backgroundColor = setContactColour(true, component.control.backgroundColor, component.screenComponentDto);
            component.control.backgroundColor = backgroundColor;
            const componentDto = Object.assign({}, component.screenComponentDto, { onContact: true });
            return Object.assign({}, component, { onContact: true }, { screenComponentDto: componentDto });
        });
    } else {
        componentList = viewState.formView.screenContanerComponentList.map(component => {
            // todo update field_Value
            const backgroundColor = setContactColour(false, component.control.backgroundColor, component.screenComponentDto);
            component.control.backgroundColor = backgroundColor;
            const componentDto = Object.assign({}, component.screenComponentDto, { onContact: false });
            return Object.assign({}, component, { onContact: false }, { screenComponentDto: componentDto });
        });
    }
    const newFormView = Object.assign({}, viewState.formView, { screenContanerComponentList: componentList });
    return { ...viewState, formView: newFormView };
}

function setContactColour(linkedContact: boolean, backColour: string, screenComponentDto: ScreenComponentDto): string {

    const contactColour: string = linkedContact ? '#f1f1a2' : 'White';
    const contactRefColour: string = linkedContact ? 'PowderBlue' : 'White';
    const mappedContactField = setMappedContactField(screenComponentDto);

    // Contact Ref mappings are integer values
    // todoNLJ
    if (Utilities.atoi(mappedContactField) > 0) {
        backColour = contactRefColour;
        // standard screen-view mappings start with CT
    } else if (mappedContactField && mappedContactField.indexOf('CT') === 0) {
        backColour = contactColour;
    }
    return backColour;
}

function setMappedContactField(screenComponentDto: ScreenComponentDto): string {
    let mappedContactField: string;
    if (screenComponentDto.dM_CField) {
        mappedContactField = screenComponentDto.dM_CField;
    } else {
        mappedContactField = '';
    }
    return mappedContactField;
}


function setNewVarValues(token: string, state: State, varValues: IVarValue[], focusContainerName: string) {
    const viewState = state.views[token];
    const componentList = viewState.formView.screenContanerComponentList.map(component => {
        const valueItem = varValues.filter(value => value.controlerID === component.screenComponentDto.sC_ID)[0];
        if (valueItem) {

            const autofocus = (focusContainerName && component.containerName === focusContainerName) ? true : false;
            const componentDTO = { ...component.screenComponentDto, field_Value: valueItem.value };
            const newComponent = new ScreenComponent(componentDTO, component.mainState);
            const control = { ...newComponent.control, autofocus: autofocus };
            return { ...newComponent, control };
        }
        return component;
    });
    const newFormView = Object.assign({}, viewState.formView, { screenContanerComponentList: componentList });
    return { ...viewState, formView: newFormView };
}


function setControlerIsUpload(token: string, state: State, controler: ScreenContanerComponent) {

    const viewState = state.views[token];
    const componentList = viewState.formView.screenContanerComponentList.map(component => {
        if (component.containerName === controler.containerName) {
            return { ...component, isUploaded: true };
        } else {
            return component;
        }
    });
    const newFormView = Object.assign({}, viewState.formView, { screenContanerComponentList: componentList });
    return { ...viewState, formView: newFormView, isFormDataLoading: false };
}

function clearFormData(token: string, state: State) {
    const viewState = state.views[token];
    const componentList = viewState.formView.screenContanerComponentList.map(component => {
        const control = { ...component.control, value: null };
        const componentDTO = { ...component.screenComponentDto, field_Value: null };
        return { ...component, control: control, screenComponentDto: componentDTO, controllerValue: null };
    });
    const newFormView = Object.assign({}, viewState.formView, { screenContanerComponentList: componentList });

    // const screenControlList = viewState.formViewResponsList[viewState.currentIndex].screenControlList.map(componentDto => {
    //     return {...componentDto, field_Value: null};
    // });
    // const formViewResponseList = {...viewState.formViewResponsList, [viewState.currentIndex]: screenControlList};
    return { ...viewState, formView: newFormView };
}

function isCurrentContactRemoved(token: string, state: State, contacts: ContactScreenItemWrapper[]) {
    const viewState = state.views[token];
    return contacts.filter(contact => contact.contactId === viewState.contactSearch.currentContactId).length > 0;
}
// function departmentChange(current: ReadonlyArray<FormView>, newValue: number) {
//     return Object.freeze(current.map((formView, index) => {
//         if (index === newValue) {
//             return Object.freeze({ ...formView, selected: true });
//         } else if (formView.selected) {
//             return Object.freeze({ ...formView, selected: false });
//         }
//         return formView;
//     }));
// }

// function rowChange(state: ScreenViewState, action: Actions.ScreenComponentListChange,
//     row: ContactItemWrapper, token: string): Partial<ScreenViewState> {

//     const formViewList = formViewListComponentUpdate(state, action.payload.value, row, token);

//     switch (action.payload.kind) {
//         case RowItemChangeKind.UpdateValue:
//             return {
//                 ...state,
//                 formViewList: formViewList
//             };
//         default: {
//             return state;
//         }
//     }
// }
// function formViewListComponentUpdate(state: ScreenViewState, newValue: number, row: ContactItemWrapper, token: string)
//     : FormView[] {
//     const tmp = {};
//     const newtaskData = Object.freeze(state.formViewList[state.currentIndex].screenContanerComponentList.map((component) => {
//         if (component.control.name === row.data) {
//             return Object.freeze({ ...file, isExpand: true });
//         } else {
//             return Object.freeze({ ...file, isExpand: false });
//         }
//     }));
//     tmp[hash] = { data: newtaskData, total: state.caseContactData[hash].total, loading: false };
//     return tmp;
// }

