
import { catchError ,  take ,  map ,  switchMap ,  tap } from 'rxjs/operators';
import { of, from, combineLatest } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import { Store } from '@ngrx/store';
import * as Core from '../actions/core';
import { WorkflowRuleService } from '../services/workflow-rule.service';
import {
    getWorkflowRuleAppIdByToken, getWorkflowRuleRuleListByToken,
    getSelectedWorkflowRuleRuleListByToken, getWorkflowRuleFileIdByToken, getWorkflowRuleBranchIdByToken
} from '..';
import {
    InforDialogData, InforDialogComponent, InforDialogResult,
    ConfirmDialogResultKind, ConfirmDialogComponent
} from '../../shared';
import { MatDialog } from '@angular/material';










@Injectable()
export class WorkflowRuleEffects {

    constructor(private actions$: Actions,
        private dialog: MatDialog, private store: Store<any>, private workflowRuleService: WorkflowRuleService) {
    }



    @Effect()
    InitWorkFlowRuleData$ = this.actions$.pipe(ofType<Core.InitWorkFlowRule>(Core.INIT_WORKFLOW_RULE),
        tap(action => console.log('InitWorkFlowRuleData')),
        switchMap((action: Core.InitWorkFlowRule) =>
            this.store.select(getWorkflowRuleAppIdByToken(action.token)).pipe(
                map((appId) => ({ appId, token: action.token })),
                take(1))
        ),
        switchMap((info) =>
            this.workflowRuleService.getWorkflowRuleList(info.appId).pipe(map((response) =>
                new Core.InitWorkFlowRuleSuccess(info.token, { workflowRuleList: response })),
                catchError(error => of(new Core.InitWorkFlowRuleFail(info.token, error))))
        ));


    @Effect()
    SaveWorkFlowRuleData$ = this.actions$.pipe(ofType<Core.SaveWorkflowRule>(Core.SAVE_WORKFLOW_RULE),
        tap(action => console.log('SaveWorkFlowRuleData')),
        switchMap((action: Core.SaveWorkflowRule) =>
            combineLatest(
                this.store.select(getWorkflowRuleAppIdByToken(action.token)),
                this.store.select(getWorkflowRuleFileIdByToken(action.token)),
                this.store.select(getWorkflowRuleBranchIdByToken(action.token)),
                this.store.select(getWorkflowRuleRuleListByToken(action.token)),
                ((appId, fileId, branchId, ruleList) => ({ appId, fileId, branchId, ruleList, token: action.token }))
            ).pipe(
                take(1))
        ),
        switchMap((info) =>
            this.workflowRuleService.workFlowRuleDataSubmit(info.appId, info.branchId, info.fileId, info.ruleList).pipe(map((response) =>
                new Core.SaveWorkflowRuleSuccess(info.token, { workflowRuleList: response })),
                catchError(error => of(new Core.SaveWorkflowRuleFail(info.token, error))))

        ));

    @Effect()
    ExportWorkFlowRuleData$ = this.actions$.pipe(ofType<Core.ExportWorkflowRule>(Core.WORKFLOW_RULE_EXPORT),
        tap(action => console.log('ExportWorkFlowRuleData')),
        switchMap((action: Core.ExportWorkflowRule) =>
            combineLatest(
                this.store.select(getWorkflowRuleAppIdByToken(action.token)),
                this.store.select(getWorkflowRuleRuleListByToken(action.token)),
                ((appId, ruleList) => ({ appId, ruleList, token: action.token }))
            ).pipe(
                take(1))
        ),
        switchMap((info) =>
            this.workflowRuleService.exportWorkflowRule(info.appId, info.ruleList).pipe(map((response) =>
                new Core.ExportWorkflowRuleSuccess(info.token, { exportedData: response })),
                catchError(error => of(new Core.ExportWorkflowRuleFail(info.token, error))))

        ));

    @Effect()
    ImportWorkFlowRuleData$ = this.actions$.pipe(ofType<Core.ImportWorkflowRule>(Core.WORKFLOW_RULE_IMPORT),
        tap(action => console.log('ImportWorkFlowRuleData')),
        switchMap((action: Core.ImportWorkflowRule) =>
            combineLatest(
                this.store.select(getWorkflowRuleAppIdByToken(action.token)),
                ((appId) => ({ appId, file: action.payload.fullFileData, token: action.token }))
            ).pipe(
                take(1))
        ),
        switchMap((info) => {
            if (info.file) {
                const data = new FormData();
                data.append('file', info.file.fileData[0]);
                data.append('appId', JSON.stringify(info.appId));
                return this.workflowRuleService.importWorkflowRules(data).pipe(map((response) =>
                    new Core.ImportWorkflowRuleSuccess(info.token, { importedData: response, isReplace: info.file.isReplace })),
                    catchError(error => of(new Core.ImportWorkflowRuleFail(info.token, error))));
            }
        }));


    @Effect()
    addNewWFRule$ = this.actions$.pipe(ofType<Core.AddNewWorkFlowRule>(Core.ADD_NEW_WORKFLOW_RULE),
        // .do(action => console.log('addNewWFRule***'))
        switchMap((action: Core.AddNewWorkFlowRule) =>
            this.store.select(getWorkflowRuleRuleListByToken(action.token)).pipe(
                map((list) => ({ list, token: action.token })),
                take(1))
        ), switchMap<any, any>((info) => {
            if (info.list && info.list.find((row) => !row.wfR_Test)) {
                // return of(new Core.AddNewWorkFlowRuleReject(info.token));
                return of();
            } else {
                return of(new Core.AddNewWorkFlowRuleSuccess(info.token));
            }

            // info.list.forEach(element => {
            //     if (!element.wfR_Test) {
            //         return of(new Core.AddNewWorkFlowRuleReject(info.token));
            //     }
            // });

            // return of(new Core.AddNewWorkFlowRuleSuccess(info.token));
        }
        ));

    @Effect()
    addNewWFRuleReject$ = this.actions$.pipe(ofType<Core.AddNewWorkFlowRuleReject>(Core.ADD_NEW_WORKFLOW_RULE_REJECT),
        // .do(action => console.log('addNewWFRuleReject'))
        switchMap((action: Core.AddNewWorkFlowRuleReject) => {
            const dialogData: InforDialogData = {
                content: {
                    title: ' Invalid Entry',
                    message: `'Test Var. No' is not a valid variable number.`
                },
                contentParams: { displayName: '' },
                data: { messageType: 'warning' }
            };

            const deleteDialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '350px',
                panelClass: 'dps-notification'
                // disableClose: true
            });
            // return dialogRef.afterClosed().map<InforDialogResult, boolean>(dialogResult => {
            //     return false;
            // });
            // .map((result) => ({ result, menuItem, newMenuItem }));
            return of();
        }));

    @Effect()
    onRuleUp$ = this.actions$.pipe(ofType<Core.ChangeWorkflowRuleUp>(Core.CHANGE_WORKFLOW_RULE_UP),
        tap(action => console.log('onRuleUp')),
        switchMap((action: Core.ChangeWorkflowRuleUp) =>
            this.store.select(getSelectedWorkflowRuleRuleListByToken(action.token)).pipe(
                map((selectedList) => ({ selectedList, token: action.token })),
                take(1))
        ), switchMap((info) => {
            if (info.selectedList.length === 1 && info.selectedList[0].rowOrder > 1) {
                return of(new Core.ChangeWorkflowRuleUpDown(info.token, { selectedItemList: info.selectedList[0], isUp: true }));
            } else {
                return of();
            }
        }));

    @Effect()
    onRuleDown$ = this.actions$.pipe(ofType<Core.ChangeWorkflowRuleDown>(Core.CHANGE_WORKFLOW_RULE_DOWN),
        tap(action => console.log('onRuleDown')),
        switchMap((action: Core.ChangeWorkflowRuleDown) =>
            combineLatest(
                this.store.select(getSelectedWorkflowRuleRuleListByToken(action.token)),
                this.store.select(getWorkflowRuleRuleListByToken(action.token)),
                ((selectedList, ruleList) => ({ selectedList, ruleList, token: action.token }))
            ).pipe(
                take(1))
        ), switchMap((info) => {
            if (info.selectedList.length === 1 && info.selectedList[0].rowOrder < info.ruleList.length) {
                return of(new Core.ChangeWorkflowRuleUpDown(info.token, { selectedItemList: info.selectedList[0], isUp: false }));
            } else {
                return of();
            }
        }));

    // @Effect()
    // onDelete$ = this.actions$.ofType<Core.DeleteWorkflowRuleSubmit>(Core.DELETE_WORKFLOW_RULE_SUBMIT)
    //     .do(action => console.log('onDelete'))
    //     .switchMap((action: Core.DeleteWorkflowRuleSubmit) =>
    //         this.store.select(getSelectedWorkflowRuleRuleListByToken(action.token))
    //             .map((selectedList) => ({ selectedList, token: action.token }))
    //             .take(1)
    //     ).switchMap((info) => {
    //         if (info.selectedList.length > 0) {
    //             const dialogData: InforDialogData = {
    //                 content: {
    //                     title: ' Delete Row',
    //                     message: `You have selected ` + info.selectedList.length + ` row(s) for deletion.\n
    //                 Choose Ok to delete the row or Cancel to Exit.`
    //                 },
    //                 contentParams: { displayName: '' },
    //                 data: null,
    //             };

    //             const deleteDialogRef = this.dialog.open(ConfirmDialogComponent, {
    //                 data: dialogData,
    //                 width: '350px',
    //                 // disableClose: true
    //             });
    //             deleteDialogRef.afterClosed().subscribe(dialogResult => {
    //                 if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
    //                     return of(new Core.DeleteWorkflowRule(info.token));
    //                 } else {
    //                     return of();
    //                 }
    //             });
    //         } else {
    //             return of();
    //         }
    //     });


    // @Effect()
    // onsubmit$ = this.actions$.ofType<Core.InitialSettingsSubmit>(Core.INITIAL_SETTINGS_SUBMIT)
    //     .do(action => console.log('onsubmit'))
    //     .switchMap((action: Core.InitialSettingsSubmit) =>
    //         this.store.select(getInitialSettingStateByToken(action.token))
    //             .map((currentState) => ({ currentState, token: action.token }))
    //             .take(1)
    //     ).switchMap((info) => {
    //         if (info.currentState.userTimeZone) {
    //             return of(new Core.UpdateInitialSettings(info.token, { currentState: info.currentState }));
    //         } else {
    //             return of(new Core.InitialSettingsSubmitFail(info.token));
    //         }

    //     });


    //     @Effect()
    // onUpdateInitialSettings$ = this.actions$.ofType<Core.UpdateInitialSettings>(Core.UPDATE_INITIAL_SETTINGS)
    //     .switchMap((action: Core.UpdateInitialSettings) =>
    //         this.initialSettingsService.updateInitialSettings(action.payload.currentState).map((response) =>
    //             new Core.UpdateInitialSettingsSuccess(action.token))
    //             .catch(error => of(new Core.UpdateInitialSettingsFail(action.token, error)))
    //     );


}


