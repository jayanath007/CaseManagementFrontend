import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as people from './people';

export interface State {
    people: people.State;
}
export const reducers = {
    people: people.reducer,
};
export const selectContactsPeopleState = createFeatureSelector<State>('dpsContactsAndPeople');
export const getPeopleState = createSelector(selectContactsPeopleState, (state) => state.people);
export const getPeople = createSelector(getPeopleState, people.getPeople);
export const getSearchedPeople = createSelector(getPeopleState, people.getSearchedPeople);
export const getUserPhotoByEmailAddress = (emailAddress: string) =>
    createSelector(getPeopleState, people.getUserPhotoByEmailAddress(emailAddress));

