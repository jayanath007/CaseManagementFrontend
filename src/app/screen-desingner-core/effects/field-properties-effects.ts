
import {filter, take, catchError, switchMap, map} from 'rxjs/operators';
import { LoadLookupFileContentFail, DeleteFieldPropertyFail } from '../actions/field-properties';
import { PayloadRequest } from '../../core/lib/microsoft-graph';
import { FieldPropertiesService } from '../services/field-properties.service';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import { Injectable } from '@angular/core';
import { from ,  of } from 'rxjs';




import * as FieldProperties from '../actions/field-properties';
import { getLookupFiles } from '..';



@Injectable()
export class FieldPropertiesEffects {
    constructor(private actions$: Actions, private store: Store<any>, private fieldProperties: FieldPropertiesService) { }


    @Effect()
    loadFormViewList$ = this.actions$.pipe(ofType<FieldProperties.GetLookupFilesData>(FieldProperties.GET_LOOKUP_FILES_DATA),
        switchMap((action) => {
            return this.store.select(getLookupFiles(action.token)).pipe(
                map((lookupFiles) => {
                    const haslookupFilesData = (lookupFiles) ? true : false;
                    return { action: action, haslookupFilesData: haslookupFilesData };
                })).pipe(take(1));
        })).pipe(
        filter((info) => !info.haslookupFilesData),
        map((result) => {
        return  new FieldProperties.LoadLookupFiles(result.action.token, result.action.payload);
    }),);


    @Effect()
    loadLookupFiles$ = this.actions$.pipe(ofType<FieldProperties.LoadLookupFiles>
        (FieldProperties.LOAD_LOOKUP_FILES),
        switchMap((action) => {
            return this.fieldProperties.getLookupFiles(action.payload.request.appId).pipe(
                map((result) => new FieldProperties.LoadLookupFilesSuccess(action.token,
                    { response: result, request: action.payload.request })),
                catchError((error) => of(new FieldProperties.LoadLookupFilesFail(action.token, error))),);
        }));

}






