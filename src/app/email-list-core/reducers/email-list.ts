import { Contact, Share } from '../models/interface';
import * as Actions from '../actions/core';
import { createSelector } from '@ngrx/store';
import { ValidateEmailPipe } from '../../shared';
import { uuid } from '../../utils/uuid';
import { WorkType, PrecedentHSModel } from '../../core/lib/precedentHS';

export interface State {
    readonly loading: boolean;
    readonly closePopup: boolean;
    readonly emailList: Contact[];
    readonly share: Share;
    readonly reviewDate: string;
    readonly message: string;
    readonly reviewNote: string;
    readonly eBillingType: string;
    readonly workTypeList: WorkType[];
    readonly activitiList: PrecedentHSModel[];
    readonly phaseList: PrecedentHSModel[];
    readonly phaseWiseTaskList: PrecedentHSModel[];
    readonly isSilent: boolean;
}
const initialState: State = {
    loading: true, emailList: null, share: null,
    reviewDate: null, reviewNote: '', message: '',
    closePopup: false, eBillingType: '',
    workTypeList: null, activitiList: null,
    phaseList: null, phaseWiseTaskList: null,
    isSilent: false // unticked by default. request by osman 05/19/2020
};





export function reducer(state: State = initialState, action: Actions.Any): State {

    switch (action.type) {
        case Actions.GET_EMAIL_LIST:
            return { ...state, ...initialState };
        case Actions.GET_EMAIL_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                emailList: action.payload.contactList.map(value => ({ ...value, id: uuid() })),
                reviewNote: action.payload.reviewNote,
                message: action.payload.message,
                reviewDate: action.payload.reviewDate,
            };
        case Actions.SHARE_ATTACHMENT:
            return { ...state, loading: true };
        case Actions.SHARE_ATTACHMENT_SUCCESS:
            return { ...state, loading: false, closePopup: true };
        case Actions.SHARE_ATTACHMENT_FAIL:
            return { ...state, loading: false };
        case Actions.GET_EMAIL_LIST:
            return { ...state, loading: false, emailList: null };
        case Actions.CHANGE_SHARE:
            return { ...state, share: action.payload };
        case Actions.CHANGE_REVIEW_DATE:
            return { ...state, reviewDate: action.payload };
        case Actions.CHANGE_REVIEW_NOTE:
            return { ...state, reviewNote: action.payload };
        case Actions.CHANGE_MESSAGE:
            return { ...state, message: action.payload };
        case Actions.ADD_RECIPIENT:
            return { ...state, emailList: state.emailList.concat(action.payload) };
        case Actions.CHANGE_TO_CC:
            return {
                ...state, emailList: state.emailList.map((value) => {
                    if (value.id === action.payload.id) {
                        return { ...value, toCc: action.payload.toCc };
                    }
                    return value;
                })
            };
        case Actions.CHANGE_SILENT:
            return {
                ...state, isSilent: action.payload
            };
        default:
            { return state; }
    }
}

function changePrecedentHSSelection(PrecedentHSList: PrecedentHSModel[], selectedDetails: PrecedentHSModel) {
    return PrecedentHSList.map((item) => {
        if (item.phaseID === selectedDetails.phaseID) {
            return Object.freeze({ ...item, selected: true });
        } else if (item.selected) {
            return Object.freeze({ ...item, selected: false });
        }
        return item;
    });
}


export const getState = (state: State) => state;

export const getEmailList = createSelector(getState, (state) => state.emailList ? state.emailList.filter(val => {
    return new ValidateEmailPipe().transform(val.email);
}) : []);
export const getLoading = createSelector(getState, (state) => state.loading);
export const getClosePopup = createSelector(getState, (state) => state.closePopup);
export const getShare = createSelector(getState, (state) => state.share);
export const getReviewDate = createSelector(getState, (state) => state.reviewDate);
export const getReviewNote = createSelector(getState, (state) => state.reviewNote);
export const getMessage = createSelector(getState, (state) => state.message);
export const getIsSilent = createSelector(getState, (state) => state.isSilent);

