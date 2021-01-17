import * as Actions from '../actions/people';
import { Person, User } from '../../core/lib/microsoft-graph';

export interface State {
    readonly people: Person[];
    readonly searchedPeople: { text: string, people: User[] };
    readonly userPhoto: { emailAddress: string, photo: string };
}

const initialState: State = { people: [], userPhoto: null, searchedPeople: { text: '', people: [] } };

export function reducer(state = initialState, action: Actions.Any): State {
    try {
        switch (action.type) {
            case Actions.PEOPLE_LOAD_SUCESSS:
                return { ...state, people: action.payload.people };
            case Actions.PEOPLE_LOAD_FAIL:
                return { ...state };
            case Actions.SEARCH_USERS_SUCESSS:
                return { ...state, searchedPeople: { text: action.payload.text, people: action.payload.people } };
            case Actions.SEARCH_USERS_FAIL:
                return { ...state, searchedPeople: { text: action.payload.text, people: [] } };
            case Actions.ADD_PERSON:
                return { ...state, people: state.people ? addPerson(state.people, action.payload.person) : [action.payload.person] };
            default: {
                return state;
            }
        }
    } catch (e) {
        console.log('contact reducer ', e);
    }
}

function addPerson(people: Person[], person: Person): Person[] {
    if (people.filter(val => val.emailAddresses[0].address.toLowerCase() === person.emailAddresses[0].address.toLowerCase()).length > 0) {
        return people;
    } else {
        return people.concat(person);
    }
}

export const getPeople = (state: State) => state.people;
export const getSearchedPeople = (state: State) => state.searchedPeople;
export const getUserPhotoByEmailAddress = (emailAddress: string) => (state: State) => state.userPhoto ?
    (state.userPhoto.emailAddress === emailAddress ? state.userPhoto : null) : null;
