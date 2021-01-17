
import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as ScreenDesingner from './screen-desingner';
import * as OvItem from './ov-items';


export interface State {
    ScreenDesingner: ScreenDesingner.State;
    OvItem: OvItem.State;
}
export const reducers = {
    ScreenDesingner: ScreenDesingner.reducer,
    OvItem: OvItem.reducer,
};

export const getScreenDesingnerRootState = createFeatureSelector<State>('dpsScreenDesingner');

export const getScreenDesingnerState = createSelector(getScreenDesingnerRootState, (state) => {
    return state.ScreenDesingner;
});

export const getOvItemState = createSelector(getScreenDesingnerRootState, (state) => {
    return state.OvItem;
});



export const getOvItemStateByToken = (token) => createSelector(getOvItemState, OvItem.getViewByToken(token));
export const getOvItemByToken = (token) =>
    createSelector(getOvItemState, OvItem.getOvItemByToken((token)));
export const getSortedOvItemByToken = (token) => createSelector(getOvItemState, OvItem.getSortedOvItemByToken(token));
export const getSelectedOvItemByToken = (token) => createSelector(getOvItemState, OvItem.getSelectedOvItemByToken(token));

export const getSearchtextToken = (token) => createSelector(getOvItemState, OvItem.getSearchtextToken(token));

export const getScreenDesingnerStateByToken = (token) => createSelector(getScreenDesingnerState, ScreenDesingner.getViewByToken(token));
export const getFormViewResponsListDataByToken = (token) => {
    return createSelector(getScreenDesingnerState, ScreenDesingner.getFormViewResponsListDataByToken(token));
};
export const getFormViewResponsDataByIndex = (token, index) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getFormViewResponsDataByIndex(token, index));
export const getScreenDesingnerStatus = (token) => createSelector(getScreenDesingnerState, ScreenDesingner.getScreenDesingnerStatus(token));
export const getMainState = (token) => createSelector(getScreenDesingnerState, ScreenDesingner.getMainState(token));
export const getInitialInfor = (token) => createSelector(getScreenDesingnerState, ScreenDesingner.getinitialInfor(token));
export const getCurentFormViewDataByToken = (token) =>
    createSelector(getScreenDesingnerState, ScreenDesingner.getCurentFormViewDataByToken(token));
export const getLoadForm = (token) => createSelector(getScreenDesingnerState, ScreenDesingner.getFormViewData(token));
export const getCurentFormScreenContanerComponentList = (token) =>
    createSelector(getScreenDesingnerState, ScreenDesingner.getCurentFormScreenContanerComponentList(token));
export const getCurentFormScreenDefinition = (token) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getCurentFormScreenDefinition(token));

export const getSelectedContanerComponentByToken = (token) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getSelectedContanerComponentByToken(token));

export const getUpdatedCurentFormViewDataByToken = (token) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getUpdatedCurentFormViewDataByToken(token));
// export const getScreenDesignActiveTabByToken = (token) => createSelector(getScreenDesingnerState,
//     ScreenDesingner.getActiveTabByToken(token));

export const getScreenDesignComponentsLeftAlignController = (token) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getComponentsLeftAlignController(token));


export const getLookupFiles = (token) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getLookupFiles(token));

export const getScreenLogicDocuments = (token) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getScreenLogicDocuments(token));

export const getCheckedOutScreenLogicDocuments = (token) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getCheckedOutScreenLogicDocuments(token));

export const getScreenClosePopup = (token) => createSelector(getScreenDesingnerState,
    ScreenDesingner.getScreenClosePopup(token));




// export const getdataLookupFiles = (token) => createSelector(getScreenDesingnerState,
//     ScreenDesingner.getLookupFiles(token));


// Ov Item related stuff




// export const getParaDataByToken = (token) =>
//     createSelector(getOvItemState, OvItem.getParaDataByToken((token)));
// export const getSelectedOvItemByToken = (token) =>
//     createSelector(getOvItemState, OvItem.getSelectedOvItemByToken((token)));
// export const getOvItemLoadingStatusByToken = (token) =>
//     createSelector(getOvItemState, OvItem.getisOvItemLoadingByToken((token)));
// export const getSearchKeyByToken = (token) =>
//     createSelector(getOvItemState, OvItem.getSearchKeyByToken((token)));
// export const getTeamMemberCountByToken = ((token) =>
//     createSelector(getOvItemState, OvItem.getOvItemCountByToken((token))));
