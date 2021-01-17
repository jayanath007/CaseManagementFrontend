
import {switchMap, tap, map, filter, catchError} from 'rxjs/operators';
import { LoadLoadOvItemSuccess, SaveOvItem } from '../actions/ov-items';
import { of ,  combineLatest } from 'rxjs';
import { OvItemService } from '../services/ov-items.service';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import * as OvItem from '../actions/ov-items';
import { getUpdatedCurentFormViewDataByToken } from '..';
import { RowOvItemChangeKind } from '../actions/core';
import { SaveOvItemRequest, DeleteOvItemRequest } from '../models/ov-item-request';

@Injectable()
export class OvItemEffects {

    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: OvItemService
    ) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<OvItem.InitOvItem>(OvItem.INIT_OV_ITEM),
        tap((data) => console.log('$initNewView', data)),
        map((action) => new OvItem.LoadOvItemList(action.token)),);



    @Effect()
    updateOvItem$ = this.actions$.pipe(ofType<OvItem.ScreenDesignerUpdateOvItem>(OvItem.SCREEN_DESIGNER_UPDATE_OV_ITEM),
        tap((data) => console.log('$updateOvItem', data)),
        filter((p) => p.payload.kind === RowOvItemChangeKind.UpdateValue ||  p.payload.kind === RowOvItemChangeKind.InsertItem),
        map((action) => new OvItem.SaveOvItem(action.token, new SaveOvItemRequest(action.payload.row))),);



    @Effect()
    saveOvItem$ = this.actions$.pipe(ofType<OvItem.SaveOvItem>
        (OvItem.SAVE_OV_ITEM),
        switchMap((action) => {
            return this.service.addUpdateOVItem(action.request.ovItem).pipe(
                map((result) => {
                    return new OvItem.SaveOvItemSuccess(action.token, { response: result.data, request: action.request });
                }),
                catchError((error) => of(new OvItem.SaveOvItemFail(action.token, error))),);
        }));

    @Effect()
    updateDeleteOvItem$ = this.actions$.pipe(ofType<OvItem.ScreenDesignerUpdateOvItem>(OvItem.SCREEN_DESIGNER_UPDATE_OV_ITEM),
        tap((data) => console.log('$deleteOvItem', data)),
        filter((p) => p.payload.kind === RowOvItemChangeKind.DeleteItem),
        map((action) => new OvItem.DeleteOvItem(action.token, new DeleteOvItemRequest(action.payload.value))),);


    @Effect()
    deleteOvItem$ = this.actions$.pipe(ofType<OvItem.DeleteOvItem>(OvItem.DELETE_OV_ITEM),
        switchMap((action) => {
            return this.service.deleteOVItem(action.request.ovItems).pipe(
            map((result) => {
                    return new OvItem.ScreenDesignerUpdateOvItem(action.token, { kind: RowOvItemChangeKind.DeleteItemSuccess,
                         row: null, value: action.request.ovItems } );
                }),
                catchError((error) => of(new OvItem.SaveOvItemFail(action.token, error))),);
        }));


}
