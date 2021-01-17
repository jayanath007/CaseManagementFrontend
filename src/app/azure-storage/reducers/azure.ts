import * as Actions from '../actions/azure';
import { ItemUpload, DiaryWebViewToken } from '../models/interfaces';
import { createSelector } from '@ngrx/store';
import { KeyValuesPipe } from '../../shared';
import { Dictionary } from '../../core';

export interface State {
    uploadItems: Dictionary<ItemUpload>;
    diaryWebViewTokens: Dictionary<DiaryWebViewToken>;
}

const initialState: State = {
    uploadItems: {},
    diaryWebViewTokens: {}
};

export function reducer(state = initialState, action: Actions.Any): State {
    let temp: any = {};
    let item: ItemUpload;
    switch (action.type) {
        case Actions.UPDATE_ITEM_UPLOAD_PROGRESS:
            item = state.uploadItems[action.item.id + '-' + action.item.fileName];
            temp[action.item.id + '-' + action.item.fileName] =
                (item && item.progress < 100) ? action.item : { ...action.item, dateTime: new Date() };
            return { ...state, uploadItems: { ...state.uploadItems, ...temp } };

        case Actions.ITEM_UPLOAD_FAIL:
            item = state.uploadItems[action.options.id + '-' + action.options.fileName];
            temp[action.options.id + '-' + action.options.fileName] = { ...item, progress: -1, error: action.error };
            return { ...state, uploadItems: { ...state.uploadItems, ...temp } };

        case Actions.REMOVE_UPLOADED_ITEM:
            temp = Object.assign({}, state, {
                uploadItems: Object.keys(state.uploadItems).reduce((result, key) => {
                    if (key !== (action.item.id + '-' + action.item.fileName)) {
                        result[key] = state.uploadItems[key];
                    }
                    return result;
                }, {})
            });
            return { ...state, ...temp };

        case Actions.CHANGE_DIARY_WEB_VIEW_TOKEN:
            temp[`${action.appCode}/${action.branchId}/${action.fileId}`] = action.webViewToken;
            return { ...state, diaryWebViewTokens: { ...state.diaryWebViewTokens, ...temp } };

        case Actions.CHANGE_DIARY_WEB_VIEW_TOKEN_BY_DIARY_ID:
            temp[action.diaryId] = action.webViewToken;
            return { ...state, diaryWebViewTokens: { ...state.diaryWebViewTokens, ...temp } };

        default: {
            return state;
        }
    }
}

export const getState = (state: State) => state;
export const getUploadItems = createSelector(getState, (state) => state.uploadItems);
export const getSortedUploadItems = createSelector(getUploadItems, (items) => {
    return new KeyValuesPipe<ItemUpload>().transform(items)
        .sort((a, b) => a.id > b.id ? -1 : (a.id < b.id ? 1 : 0))
        .sort((a, b) => (a.progress < 100 && b.progress === 100) ? -1 : ((a.progress === 100 && b.progress < 100) ? 1 : 0));
});

export const getDiaryWebViewTokens = createSelector(getState, (state) => state.diaryWebViewTokens);
export const getDiaryWebViewTokensByIds = (appCode: string, branchId: number, fileId: number) =>
    createSelector(getDiaryWebViewTokens, (tokens) => tokens[`${appCode}/${branchId}/${fileId}`]);
export const getDiaryWebViewTokensByDiaryId = (diaryId: number) => createSelector(getDiaryWebViewTokens, (tokens) => tokens[diaryId]);
export const getUploadingItems = createSelector(getSortedUploadItems,
    (items) => items.filter(val => val.progress < 100 && val.progress >= 0)
);
