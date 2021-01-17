import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as userMovement from './user-movement';


export interface State {
    userMovement: userMovement.State;
}
export const reducers = {
    userMovement: userMovement.reducer,
};


export const getUserMovementRootState = createFeatureSelector<State>('dpsUserMovementCore');
export const getUserMovementState = createSelector(getUserMovementRootState, (state => state.userMovement));
export const getDepartmentListByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getDepartmentListByToken(token));

export const getUserListByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getUserListByToken(token));
export const getUserLgetCurrentUserMovementsByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getCurrentUserMovementsByToken(token));
export const getNextAvailableTypesByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getNextAvailableTypesByToken(token));
export const getSelectedUserByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getSelectedUserByToken(token));
export const getAddNewMovementpopupCloseToken = (token) =>
    createSelector(getUserMovementState, userMovement.getAddNewMovementpopupCloseToken(token));
export const getLoadingByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getLoadingByToken(token));
export const getAddPopupLoadingByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getAddPopupLoadingByToken(token));

export const getParaDataUserByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getParaDataUserByToken(token));
export const getTimeListByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getTimeListByToken(token));

export const getMovementLocationistByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getMovementLocationistByToken(token));


export const getCurrentDateRangeByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getCurrentDateRangeByToken(token));

export const getChangeLocationByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getChangeLocationByToken(token));

export const getChangeIsOffTodayByToken = (token) =>
    createSelector(getUserMovementState, userMovement.getChangeIsOffTodayByToken(token));








// export const getGridDataByToken = (token) =>
//     createSelector(getUserMovementState, userMovement.getGridDataByToken(token));

// export const getMatterRefByToken = (token) =>
//     createSelector(getMatterLinkedState, matterLinked.getMatterRefByToken(token));
// export const getSelectedMatterDataByToken = (token) =>
//     createSelector(getMatterLinkedState, matterLinked.getSelectedMatterDataByToken(token));
// export const getMatterDataByToken = (token) =>
//     createSelector(getMatterLinkedState, matterLinked.getMatterDataByToken(token));
// export const getScreenId = (token) =>
//     createSelector(getMatterLinkedState, matterLinked.getScreenId(token));
// export const getDiaryId = (token) =>
//     createSelector(getMatterLinkedState, matterLinked.getDiaryId(token));
// export const getOpenFromByToken = (token) =>
//     createSelector(getMatterLinkedState, matterLinked.getOpenFromByToken(token));
// export const getParentTokenByToken = (token) =>
//     createSelector(getMatterLinkedState, matterLinked.getParentTokenByToken(token));
// export const getMultiselectItemTokenByToken = (token) =>
//     createSelector(getMatterLinkedState, matterLinked.getMultiselectItemTokenByToken(token));






