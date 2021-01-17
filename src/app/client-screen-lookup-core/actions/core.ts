import { UpdateCol } from '../models/interfaces';
import { State } from '../reducers';
import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';
// import { extend } from 'webdriver-js-extender';
import { } from '../models/interfaces';

export const INIT_SCREEN_LOOKUP = 'INIT_SCREEN_LOOKUP';
export const INIT_SCREEN_LOOKUP_SUCCESS = 'INIT_SCREEN_LOOKUP_SUCCESS';
export const INIT_SCREEN_LOOKUP_FAIL = 'INIT_SCREEN_LOOKUP_FAIL';



export const SAVE_LOOKUP = 'SAVE_LOOKUP';
export const SAVE_LOOKUP_SUCCESS = 'SAVE_LOOKUP_SUCCESS';
export const SAVE_LOOKUP_FAIL = 'SAVE_LOOKUP_FAIL';

export const CHANGE_LOOKUP_ITEM = 'CHANGE_LOOKUP_ITEM';
export const UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION';
export const CANCEL_CHANGES = 'CANCEL_CHANGES';


export const ADD_NEW_LOOKUP_SUCCESS = 'ADD_NEW_LOOKUP_SUCCESS';


 export const DELETE_SCREEN_LOOKUP = 'DELETE_SCREEN_LOOKUP';
 export const DELETE_SCREEN_LOOKUP_SUCCESS = 'DELETE_SCREEN_LOOKUP_SUCCESS';
 export const DELETE_SCREEN_LOOKUP_FAIL = 'DELETE_SCREEN_LOOKUP_FAIL';

 export const EXIT_CLIENT_LOOKUP_POPUP = 'EXIT_CLIENT_LOOKUP_POPUP';

 


export class InitScreenLookup extends TokenizeAction implements Action {
    readonly type = INIT_SCREEN_LOOKUP;
    constructor(public token: string, public payload: { lookupTypeTag: string }) {
        super(token);
    }
}

export class InitScreenLookupSuccess extends TokenizeAction implements Action {
    readonly type = INIT_SCREEN_LOOKUP_SUCCESS;
    constructor(public token: string, public payload: { screenLookupList: any }) {
        super(token);
    }
}

export class InitScreenLookupFail extends TokenizeAction implements Action {
    readonly type = INIT_SCREEN_LOOKUP_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}


export class SaveLookup extends TokenizeAction implements Action {
    readonly type = SAVE_LOOKUP;
    constructor(public token: string) {
        super(token);
    }
}

export class SaveLookupSuccess extends TokenizeAction implements Action {
    readonly type = SAVE_LOOKUP_SUCCESS;
    constructor(public token: string, public payload: { screenLookupList: any }) {
        super(token);
    }
}

export class SaveLookupFail extends TokenizeAction implements Action {
    readonly type = SAVE_LOOKUP_FAIL;
    constructor(public token: string, public payload: { error: any }) {
        super(token);
    }
}

export class ChangeLookupItem extends TokenizeAction implements Action {
    readonly type = CHANGE_LOOKUP_ITEM;
    constructor(public token: string, public payload: { rowId: number, changeValue: any, changeCol: UpdateCol }) {
        super(token);
    }
}

export class UpdateDescription extends TokenizeAction implements Action {
    readonly type = UPDATE_DESCRIPTION;
    constructor(public token: string, public payload: { lookupTypeDescription: string }) {
        super(token);
    }
}


export class CancelChanges extends TokenizeAction implements Action {
    readonly type = CANCEL_CHANGES;
    constructor(public token: string) {
        super(token);
    }
}


export class AddNewLookupSuccess extends TokenizeAction implements Action {
    readonly type = ADD_NEW_LOOKUP_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}


export class DeleteScreenLookup extends TokenizeAction implements Action {
    readonly type = DELETE_SCREEN_LOOKUP;
    constructor(public token: string, public payload: { lookupId: number}) {
        super(token);
    }
}

export class DeleteScreenLookupSuccess extends TokenizeAction implements Action {
    readonly type = DELETE_SCREEN_LOOKUP_SUCCESS;
    constructor(public token: string) {
        super(token);
    }
}

export class DeleteScreenLookupFail extends TokenizeAction implements Action {
    readonly type = DELETE_SCREEN_LOOKUP_FAIL;
    constructor(public token: string, public payload: {  lookupId: number }) {
        super(token);
    }
}


export class ExitClientLookupPopup extends TokenizeAction implements Action {
    readonly type = EXIT_CLIENT_LOOKUP_POPUP;
    constructor(public token) { super(token); }
  }






export type Any = InitScreenLookup | InitScreenLookupSuccess | InitScreenLookupFail
    |  AddNewLookupSuccess | SaveLookup | SaveLookupSuccess | SaveLookupFail |ChangeLookupItem | DeleteScreenLookup
    |DeleteScreenLookupSuccess | DeleteScreenLookupFail | UpdateDescription | CancelChanges |ExitClientLookupPopup ;



