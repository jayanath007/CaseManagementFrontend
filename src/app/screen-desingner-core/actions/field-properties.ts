import { Action } from '@ngrx/store';
import { TokenizeAction } from '../../core';

import { LookupFilesRequest, LookupFilesResponse } from '../models/field-properties-request';
import { UpdateLookupFileRequest, UpdateLookupFileResponse } from '../models/field-properties-request';
import { LookupFileContentRequest, LookupFileContentResponse } from '../models/field-properties-request';
import { DeleteFieldPropertyRequest, DeleteFieldPropertyResponse } from '../models/field-properties-request';


export const GET_LOOKUP_FILES_DATA = 'GET_LOOKUP_FILES_DATA';
export const LOAD_LOOKUP_FILES = 'LOAD_LOOKUP_FILES';
export const LOAD_LOOKUP_FILES_SUCCESS = 'LOAD_LOOKUP_FILES_SUCCESS';
export const LOAD_LOOKUP_FILES_FAIL = 'LOAD_LOOKUP_FILES_FAIL';

export const UPDATE_LOOKUP_FILE = 'UPDATE_LOOKUP_FILE';
export const UPDATE_LOOKUP_FILE_SUCCESS = 'UPDATE_LOOKUP_FILE_SUCCESS';
export const UPDATE_LOOKUP_FILE_FAIL = 'UPDATE_LOOKUP_FILE_FAIL';

export const LOOKUP_FILE_CONTENT = 'LOOKUP_FILE_CONTENT';
export const LOOKUP_FILE_CONTENT_SUCCESS = 'LOOKUP_FILE_CONTENT_SUCCESS';
export const LOOKUP_FILE_CONTENT_FAIL = 'LOOKUP_FILE_CONTENT_FAIL';

export const DELETE_FIELD_PROPERTY = 'DELETE_FIELD_PROPERTY';
export const DELETE_FIELD_PROPERTY_SUCCESS = 'DELETE_FIELD_PROPERTY_SUCCESS';
export const DELETE_FIELD_PROPERTY_FAIL = 'DELETE_FIELD_PROPERTY_FAIL';

export const LOAD_LOOKUP_FILES_UPDATE = 'LOAD_LOOKUP_FILES_UPDATE';



/////////////////////// load LookupFiles start
export class GetLookupFilesData extends TokenizeAction implements Action {
    readonly type = GET_LOOKUP_FILES_DATA;
    constructor(public token: string,  public payload: { request: LookupFilesRequest } ) { super(token); }
}


export class LookupFilesUpdate extends TokenizeAction implements Action {
    readonly type = LOAD_LOOKUP_FILES_UPDATE;
    constructor(public token: string,  public payload: { value: string } ) { super(token); }
}

/////////////////////// load LookupFiles start
export class LoadLookupFiles extends TokenizeAction implements Action {
    readonly type = LOAD_LOOKUP_FILES;
    constructor(public token: string,  public payload: { request: LookupFilesRequest } ) { super(token); }
}

export class LoadLookupFilesSuccess extends TokenizeAction implements Action {
    readonly type = LOAD_LOOKUP_FILES_SUCCESS;
    constructor(public token: string,  public payload: { response: LookupFilesResponse, request: LookupFilesRequest } ) { super(token); }
}

export class LoadLookupFilesFail extends TokenizeAction implements Action {
    readonly type = LOAD_LOOKUP_FILES_FAIL;
    constructor(public token: string,  public payload: {  value: any } ) { super(token); }
}
/////////////////////// load LookupFiles end



/////////////////////// load UpdateLookupFile start
export class UpdateLookupFile extends TokenizeAction implements Action {
    readonly type = UPDATE_LOOKUP_FILE;
    constructor(public token: string,  public payload: { request: UpdateLookupFileRequest } ) { super(token); }
}

export class UpdateLookupFileSuccess extends TokenizeAction implements Action {
    readonly type = UPDATE_LOOKUP_FILE_SUCCESS;
    constructor(public token: string,  public payload: { response: UpdateLookupFileResponse,
        request: UpdateLookupFileRequest } ) { super(token); }
}

export class UpdateLookupFileFail extends TokenizeAction implements Action {
    readonly type = UPDATE_LOOKUP_FILE_FAIL;
    constructor(public token: string,  public payload: {  value: any } ) { super(token); }
}
/////////////////////// load UpdateLookupFile end



/////////////////////// load LookupFileContent start
export class LoadLookupFileContent extends TokenizeAction implements Action {
    readonly type = LOOKUP_FILE_CONTENT;
    constructor(public token: string,  public payload: { request: LookupFileContentRequest } ) { super(token); }
}

export class LoadLookupFileContentSuccess extends TokenizeAction implements Action {
    readonly type = LOOKUP_FILE_CONTENT_SUCCESS;
    constructor(public token: string,  public payload: { response: LookupFileContentResponse,
         request: LookupFileContentRequest } ) { super(token); }
}

export class LoadLookupFileContentFail extends TokenizeAction implements Action {
    readonly type = LOOKUP_FILE_CONTENT_FAIL;
    constructor(public token: string,  public payload: {  value: any } ) { super(token); }
}
/////////////////////// load LookupFileContent end



/////////////////////// load DeleteFieldProperty start
export class DeleteFieldProperty extends TokenizeAction implements Action {
    readonly type = DELETE_FIELD_PROPERTY;
    constructor(public token: string,  public payload: { request: DeleteFieldPropertyRequest } ) { super(token); }
}

export class DeleteFieldPropertySuccess extends TokenizeAction implements Action {
    readonly type = DELETE_FIELD_PROPERTY_SUCCESS;
    constructor(public token: string,  public payload: { response: DeleteFieldPropertyResponse,
        request: DeleteFieldPropertyRequest } ) { super(token); }
}

export class DeleteFieldPropertyFail extends TokenizeAction implements Action {
    readonly type = DELETE_FIELD_PROPERTY_FAIL;
    constructor(public token: string,  public payload: {  value: any } ) { super(token); }
}
/////////////////////// load DeleteFieldProperty end




export type Any =  LoadLookupFiles | LoadLookupFilesSuccess | LoadLookupFilesFail
                 | UpdateLookupFile | UpdateLookupFileSuccess | UpdateLookupFileFail
                 | LoadLookupFileContent | LoadLookupFileContentSuccess | LoadLookupFileContentFail
                  |  DeleteFieldProperty | DeleteFieldPropertySuccess | DeleteFieldPropertyFail | LookupFilesUpdate;

