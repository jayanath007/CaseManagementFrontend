import { Action } from '@ngrx/store';
import { Person } from '../../core/lib/microsoft-graph';

export const LOAD_PEOPLE = 'DPS_LOAD_PEOPLE';
export const PEOPLE_LOAD_FAIL = 'DPS_PEOPLE_LOAD_FAIL';
export const PEOPLE_LOAD_SUCESSS = 'DPS_PEOPLE_LOAD_SUCESSS';

export const SEARCH_USERS = 'DPS_SEARCH_USERS';
export const SEARCH_USERS_FAIL = 'DPS_SEARCH_USERS_FAIL';
export const SEARCH_USERS_SUCESSS = 'DPS_SEARCH_USERS_SUCESSS';

export const PEOPLE_ALREADY_EXISTS = 'DPS_PEOPLE_ALREADY_EXISTS';

export const ADD_PERSON = 'DPS_ADD_PERSON';


export class LoadPeople implements Action {
    readonly type = LOAD_PEOPLE;
    constructor() { }
}
export class PeopleLoadFail implements Action {
    readonly type = PEOPLE_LOAD_FAIL;
    constructor() { }
}
export class PeopleLoadSucess implements Action {
    readonly type = PEOPLE_LOAD_SUCESSS;
    constructor(public payload: { people: Person[] }) { }
}

export class SearchUsers implements Action {
    readonly type = SEARCH_USERS;
    constructor(public payload: { text: string }) { }
}
export class SearchUsersSucess implements Action {
    readonly type = SEARCH_USERS_SUCESSS;
    constructor(public payload: { text: string, people: Person[] }) { }
}
export class SearchUsersFail implements Action {
    readonly type = SEARCH_USERS_FAIL;
    constructor(public payload: { error: string, text: string }) { }
}

export class AddPerson implements Action {
    readonly type = ADD_PERSON;
    constructor(public payload: { person: Person }) { }
}
// export class PeopleAlreadyExists implements Action {
//     readonly type = PEOPLE_ALREADY_EXISTS;
//     constructor() { }
// }

export type Any = LoadPeople | PeopleLoadFail | PeopleLoadSucess | SearchUsers | SearchUsersFail | SearchUsersSucess | AddPerson;
