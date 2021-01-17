
import {take, catchError, map, tap, switchMap} from 'rxjs/operators';
import { getScreenLookupTypeTagByToken, getScreenLookupListByToken, getDirtyListByToke } from '../reducers';
import { Injectable, Inject } from '@angular/core';
import * as Core from '../actions/core';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { ClientScreenLookupService } from '../services/client-screen-lookup.service';
import { of ,  combineLatest } from 'rxjs';
import { DeleteScreenLookupSuccess } from '../actions/core';



@Injectable()
export class ClientScreenLookupEffects {

    constructor(private actions$: Actions,
        private dialog: MatDialog, private store: Store<any>, private clientScreenLookupService: ClientScreenLookupService) {
    }



    @Effect()
    InitScreenLookupData$ = this.actions$.pipe(ofType<Core.InitScreenLookup>(Core.INIT_SCREEN_LOOKUP),
        tap(action => console.log('InitScreenLookupData')),
        // .switchMap((action: Core.InitScreenLookup) =>
        //     this.store.select(getScreenLookupTypeTagByToken(action.token))
        //         .map((lookupTypeTag) => ({ lookupTypeTag, token: action.token }))
        //         .take(1)
        // )
        switchMap((info) =>
            this.clientScreenLookupService.getScreenLookupList(info.payload.lookupTypeTag).pipe(map((response) =>
                new Core.InitScreenLookupSuccess(info.token, { screenLookupList: response })),
                catchError(error => of(new Core.InitScreenLookupFail(info.token, error))),)
        ),);


    @Effect()
    SaveLookupData$ = this.actions$.pipe(ofType<Core.SaveLookup>(Core.SAVE_LOOKUP),
        switchMap((action: Core.SaveLookup) =>
            this.store.select(getDirtyListByToke(action.token)).pipe(
                map((postRequest) => ({ postRequest, token: action.token })),
                take(1),)),
        switchMap((info) =>

            this.clientScreenLookupService.lookupDataSubmit(info.postRequest).pipe(map((response) =>
                new Core.SaveLookupSuccess(info.token, { screenLookupList: response })),
                catchError(error => of(new Core.SaveLookupFail(info.token, error))),)
        ),);



    @Effect()
    deleteLookup$ = this.actions$.pipe(ofType<Core.DeleteScreenLookup>(Core.DELETE_SCREEN_LOOKUP),
        switchMap((action) =>
            this.clientScreenLookupService.deleteScreenLookup(action.payload.lookupId).pipe(
                map((result) => new DeleteScreenLookupSuccess(action.token)),
                catchError(error => of(new Core.DeleteScreenLookupFail(action.token, { lookupId: action.payload.lookupId }))),)));


    // @Effect()
    // addNewWFRuleReject$ = this.actions$.ofType<Core.AddNewWorkFlowRuleReject>(Core.ADD_NEW_WORKFLOW_RULE_REJECT)
    //     // .do(action => console.log('addNewWFRuleReject'))
    //     .switchMap((action: Core.AddNewWorkFlowRuleReject) => {
    //         const dialogData: InforDialogData = {
    //             content: {
    //                 title: ' Invalid Entry',
    //                 message: `'Test Var. No' is not a valid variable number.`
    //             },
    //             contentParams: { displayName: '' },
    //             data: { messageType: 'warning'}
    //         };

    //         const deleteDialogRef = this.dialog.open(InforDialogComponent, {
    //             data: dialogData,
    //             width: '350px',
    //             panelClass: 'dps-notification'
    //             // disableClose: true
    //         });
    //         // return dialogRef.afterClosed().map<InforDialogResult, boolean>(dialogResult => {
    //         //     return false;
    //         // });
    //         // .map((result) => ({ result, menuItem, newMenuItem }));
    //         return of();
    //     });

    // @Effect()
    // onRuleUp$ = this.actions$.ofType<Core.ChangeWorkflowRuleUp>(Core.CHANGE_WORKFLOW_RULE_UP)
    //     .do(action => console.log('onRuleUp'))
    //     .switchMap((action: Core.ChangeWorkflowRuleUp) =>
    //         this.store.select(getSelectedWorkflowRuleRuleListByToken(action.token))
    //             .map((selectedList) => ({ selectedList, token: action.token }))
    //             .take(1)
    //     ).switchMap((info) => {
    //         if (info.selectedList.length === 1 && info.selectedList[0].rowOrder > 1) {
    //             return of(new Core.ChangeWorkflowRuleUpDown(info.token, { selectedItemList: info.selectedList[0], isUp: true }));
    //         } else {
    //             return of();
    //         }
    //     });

    // @Effect()
    // onRuleDown$ = this.actions$.ofType<Core.ChangeWorkflowRuleDown>(Core.CHANGE_WORKFLOW_RULE_DOWN)
    //     .do(action => console.log('onRuleDown'))
    //     .switchMap((action: Core.ChangeWorkflowRuleDown) =>
    //         combineLatest(
    //             this.store.select(getSelectedWorkflowRuleRuleListByToken(action.token)),
    //             this.store.select(getWorkflowRuleRuleListByToken(action.token)),
    //             ((selectedList, ruleList) => ({ selectedList, ruleList, token: action.token }))
    //         )
    //             .take(1)
    //     ).switchMap((info) => {
    //         if (info.selectedList.length === 1 && info.selectedList[0].rowOrder < info.ruleList.length) {
    //             return of(new Core.ChangeWorkflowRuleUpDown(info.token, { selectedItemList: info.selectedList[0], isUp: false }));
    //         } else {
    //             return of();
    //         }
    //     });

}
