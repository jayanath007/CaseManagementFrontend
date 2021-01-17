
import { SystemJsPopupLoaderService } from '../../shell-desktop/services/system-js-popup-loader.service';
import { MatDialog } from '@angular/material';
import { FileUrlResolverService } from '../../document-view/services/file-url-resolver.service';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { uuid } from '../../utils/uuid';
import * as Core from '../actions/core';
import { BillingNarrativeService } from '../services/billing-narrative.service';
import { mergeMap, switchMap, map, catchError, take } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { getNarrativeInfoByToken } from '../reducers';

@Injectable()
export class BillingNarrativeEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: BillingNarrativeService,
        private urlResolver: FileUrlResolverService, private dialog: MatDialog, private popupService: SystemJsPopupLoaderService) {
    }

    @Effect()
    initewView$ = this.actions$.pipe(ofType<Core.InitPage>(Core.INIT_BILLING_NARRATIVE),
        mergeMap(action => from([
            new Core.GetNarrativeGroups(action.token),
            // new AdvancedSearch.GetClientListAdvancedSearch(action.token),
            // new AdvancedSearch.GetAppCodeData(action.token),

        ])
        ));



    @Effect()
    getNarrativeGroupInfo$ = this.actions$.pipe(ofType<Core.GetNarrativeGroups>(Core.GET_NARRATIVE_GROUPS),
        switchMap((action) =>
            this.service.getNarrativeGroupInfo().pipe(
                map((result) => new Core.GetNarrativeGroupsSuccess(action.token, { narrativeData: result })),
                catchError((error) => of(new Core.GetNarrativeGroupsFail(action.token, { error: error }))))

        ));

    // @Effect()
    // getNarrativeItemInfo$ = this.actions$.pipe(ofType<Core.SelectNarrativeGroup>(Core.SELECT_NARRATIVE_GROUP),
    //     switchMap((action) =>
    //         this.service.getNarrativeItemInfoById(action.narrativeGroup.naG_ID).pipe(
    //             map((result) => new Core.GetNarrativeItemsSuccess(action.token, result)),
    //             catchError((error) => of(new Core.GetNarrativeItemsFail(action.token, { error: error }))))

    //     ));

    @Effect()
    saveNarrativeInfo$ = this.actions$.pipe(ofType<Core.BillingNattativeGroupAndItemSave>(Core.BILLING_NARRATIVE_GROUP_AND_ITEM_SAVE),
        switchMap((action) =>
            this.store.select(getNarrativeInfoByToken(action.token)).pipe(
                take(1),
                switchMap((info) =>
                    this.service.saveUpdateNarrativeData(info).pipe(map((response) =>
                        new Core.BillingNarrativeGroupAndItemSaveSuccess(action.token, response)),
                        catchError(error => of(new Core.BillingNarrativeGroupAndItemSaveFail(action.token, error))))
                ))));


    @Effect()
    deleteNarrativeItem$ = this.actions$.pipe(ofType<Core.DeleteSelectedNarrativeItem>(Core.DELETE_SELECTED_NARRATIVE_ITEM),
        switchMap((action) =>
            this.store.select(getNarrativeInfoByToken(action.token)).pipe(
                take(1),
                switchMap((info) =>
                    this.service.deleteSelectedNarrativeItem(info.narrativeItemId).pipe(map((response) =>
                        new Core.DeleteSelectedNarrativeItemsSuccess(action.token, response)),
                        catchError(error => of(new Core.DeleteSelectedNarrativeItemsFail(action.token, error))))
                ))));


    @Effect()
    deleteNarrativeGroup$ = this.actions$.pipe(ofType<Core.DeleteSelectedGroup>(Core.DELETE_SELECTED_GROUP),
        switchMap((action) =>
            this.store.select(getNarrativeInfoByToken(action.token)).pipe(
                take(1),
                switchMap((info) =>
                    this.service.deleteSelectedGroup(info.narrativeGroupId).pipe(map((response) =>
                        new Core.DeleteSelectedGroupSuccess(action.token, response)),
                        catchError(error => of(new Core.DeleteSelectedGroupFail(action.token, error))))
                ))));
    
    // @Effect()




    // @Effect()
    // getFullMatterDataSuccess$ = this.actions$.pipe(ofType<Core.GetNarrativeGroupsSuccess>
    //     (Core.GET_NARRATIVE_GROUPS_SUCCESS),
    //     switchMap(action =>
    //         from([
    //             new Core.SelectNarrativeGroup(action.token, {
    //                 naG_ID: action.payload.narrativeData[0].naG_ID,
    //                 naG_Name: action.payload.narrativeData[0].naG_Name,

    //             }),

    //         ])));



}
