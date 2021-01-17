import { filter, take, catchError, switchMap, map } from 'rxjs/operators';
import { of, combineLatest } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as Core from '../actions/core';
import { CrimeManagementService } from '../services/crime-management.service';
import { getInputDataByToken, getClassTypeByToken, getAddClassModelByToken, getClassListByToken } from '../reducers';
import { AddNewClassRequest } from '../models/request';
import { ClassObj } from '../models/interfaces';
import { LocalStorageKey } from '../../core';
import { CrimeClassRequest, ClassListRequest, CrimeManagementInput } from './../../core/lib/crime-managment';
import { WorkflowMenuMetaDataWrapper, WorkflowMenuMetaItem } from '../../workflow-menu-core';
import { GetOpenCaseToken } from '../../core/lib/open-case';
import { RunWorkflowCommand } from '../../workflow-menu-core/actions/core';

@Injectable()
export class CrimeManagementEffects {
    constructor(
        private actions$: Actions,
        private store: Store<any>, private service: CrimeManagementService, private injector: Injector
    ) { }

    @Effect()
    GetClassType$ = this.actions$.pipe(ofType<Core.InitCrimeManagement>(Core.INIT_CRIME_MANAGEMENT),
        map(action =>
            new Core.GetClassType(action.token)
        ));

    @Effect()
    GetClassList$ = this.actions$.pipe(ofType<Core.InitCrimeManagement>(Core.INIT_CRIME_MANAGEMENT),
        filter(action => !action.payload.inputData.classList),
        map(action =>
            new Core.GetClassList(action.token, {
                branchId: action.payload.inputData.branchId,
                appId: action.payload.inputData.appId,
                fileId: action.payload.inputData.fileId
            })
        ));

    @Effect()
    GetClassTotal$ = this.actions$.pipe(ofType<Core.GetClassTotal>(Core.GET_CLASS_TOTAL),
        switchMap(action => this.store.select(getInputDataByToken(action.token)).pipe(
            take(1),
            map(input => ({ input: input, action: action }))
        )),
        switchMap(info => this.service.getClassTotal(info.input.branchId, info.input.fileId, info.action.classInfo.rectype).pipe(
            map(responce => new Core.GetClassTotalSuccess(info.action.token, {
                classId: info.action.classInfo.rectype,
                total: responce.claimTotalSummary
            })),
            catchError(() => of(new Core.GetClassTotalFall(info.action.token))
            ))));


    @Effect({ dispatch: false })
    getCrimeRateFiles$ = this.actions$.pipe(ofType<Core.ClearCrimeRateFiles>(Core.GET_CRIME_RATE_FILES),
        map(() => localStorage.removeItem(LocalStorageKey.CrimeRateFiles))
    );

    @Effect()
    getClassList$ = this.actions$.pipe(ofType<Core.GetClassList>(Core.GET_CLASS_LIST),
        map(action =>
            ({
                requet: new ClassListRequest(
                    action.payload.branchId,
                    action.payload.appId,
                    action.payload.fileId,
                    null
                ),
                action: action
            })), switchMap(info =>
                this.service.getClassList(info.requet).pipe(map(responce =>
                    new Core.GetClassListSuccess(info.action.token, { list: responce, classObj: info.action.classObj })),
                    catchError(e => of(new Core.GetClassListFail(info.action.token)))
                )
            )
    );


    @Effect()
    refreshTotal$ = this.actions$.pipe(ofType<Core.GetClassListSuccess>(Core.GET_CLASS_LIST_SUCCESS),
        filter(action => !!action.payload.classObj && action.payload.classObj.rectype === 4),
        map(action => new Core.GetClassTotal(action.token, action.payload.classObj))
    );

    @Effect()
    getClassType$ = this.actions$.pipe(ofType<Core.GetClassType>(Core.GET_CLASS_TYPE),
        switchMap(action =>
            this.store.select(getClassTypeByToken(action.token)).pipe(
                map(types => ({ types: types, token: action.token })),
                filter(state => !state.types),
                take(1),
                switchMap(info =>
                    this.service.getClassType()),
                map(responce => new Core.GetClassTypeSuccess(action.token, { list: responce })),
                catchError(e => of(new Core.GetClassTypeFail(action.token))))
        ));

    @Effect()
    addNewClassRequst$ = this.actions$.pipe(ofType<Core.AddNewClass>(Core.ADD_NEW_CLASS),
        switchMap(action =>
            combineLatest(
                this.store.select(getInputDataByToken(action.token)),
                this.store.select(getAddClassModelByToken(action.token)),
                this.store.select(getClassListByToken(action.token)),
                ((input, model, classList) => ({ input, model, classList, token: action.token }))
            ).pipe(take(1),
                map(info =>
                    ({
                        requet: new AddNewClassRequest(
                            {
                                branchId: info.input.branchId,
                                appId: info.input.appId,
                                fileId: info.input.fileId,
                                displayDataString: null,
                            },
                            info.model.classId,
                            info.model.className,
                            info.model.openDate
                        ),
                        token: info.token,
                        classList: info.classList
                    })
                ), map(info => {
                    const validMsg = this.validationAddClassModel(info.requet, info.classList);
                    if (validMsg) {
                        return new Core.ShowMessage(action.token, { msg: validMsg });
                    } else {
                        return new Core.NewClassRequest(action.token, { request: info.requet });
                    }

                }
                ))
        ));

    @Effect()
    saveNewClass$ = this.actions$.pipe(ofType<Core.NewClassRequest>(Core.ADD_NEW_CLASS_REQUST),
        switchMap(action =>
            this.service.addClass(action.payload.request).pipe(
                map(responce => new Core.AddNewClassSuccess(action.token)),
                catchError(e => of(new Core.AddNewClassFail(action.token))))

        ));

    @Effect()
    saveNewClassSuccess$ = this.actions$.pipe(ofType<Core.AddNewClassSuccess>(Core.ADD_NEW_CLASS_SUCCESS),
        map(action => new Core.RefreshClassList(action.token)));

    @Effect()
    deleteClass$ = this.actions$.pipe(ofType<Core.DeleteClass>(Core.DELETE_CLASS),
        switchMap(action =>
            this.store.select(getInputDataByToken(action.token)).pipe(
                take(1),
                map(input => ({
                    data: new CrimeClassRequest(
                        input.branchId,
                        input.fileId,
                        action.classInfo.rectype
                    ),
                    token: action.token
                })))),
        switchMap(action => this.service.deleteClass(action.data).pipe(
            map(() => new Core.DeleteClassSuccess(action.token)),
            catchError(() => of(new Core.DeleteClassFall(action.token))))));

    @Effect()
    deleteClassSuccess$ = this.actions$.pipe(ofType<Core.DeleteClassSuccess>(Core.DELETE_CLASS_SUCCESS),
        map(action => new Core.RefreshClassList(action.token))
    );


    @Effect()
    refreshClassList$ = this.actions$.pipe(ofType<Core.RefreshClassList>(Core.REFRESH_CLASS_LIST),
        switchMap(action =>
            this.store.select(getInputDataByToken(action.token)).pipe(
                map(input => new Core.GetClassList(action.token, {
                    branchId: input.branchId,
                    appId: input.appId,
                    fileId: input.fileId
                }, action.classObj)))));


    @Effect()
    failScreenOption$ = this.actions$.pipe(ofType<Core.RunScreenOption>(Core.RUN_SCREEN_OPTION),
        filter(action => !action.classObj || !action.classObj.dateclsd),
        map(action => new Core.ShowMessage(action.token, { msg: 'Please close the class to run this form' }))
    );

    @Effect()
    screenOptionRun$ = this.actions$.pipe(ofType<Core.RunScreenOption>(Core.RUN_SCREEN_OPTION),
        filter(action => !!action.classObj && !!action.classObj.dateclsd),
        switchMap(action => this.store.select(getInputDataByToken(action.token)).pipe(
            take(1),
            map(info => {
                const openCaseToken = GetOpenCaseToken(info.matterReferenceNo);
                if (!openCaseToken) {
                    return new Core.ShowMessage(action.token, { msg: 'You can not run this screen without open the case' });
                } else {
                    return new RunWorkflowCommand(openCaseToken,
                        this.injector, this.getCreateItemNewMenuItem(info, action.screenOption));
                }

            })
        )));

    getCreateItemNewMenuItem(data: CrimeManagementInput, command) {
        let newItem: WorkflowMenuMetaDataWrapper = null;
        if (data) {
            const newMenuNode: WorkflowMenuMetaItem = {
                atN_AppID: + data.appId,
                atN_Command: command,
                atN_Desc: '',
                atN_Help: '',
                atN_ID: 0,
                atN_Level: 0,
                atN_Order: 0,
                atN_ParentID: null,
                atN_ParentMenu: null,
                atN_Type: 4, // Menu
                createUser: '',
                dateDone: '',
                nodeStatus: 0,
            };
            const newNode: WorkflowMenuMetaDataWrapper = {
                treeId: null,
                parentId: null,
                treeLevel: 0,
                isRowEdit: false,
                isRightClick: false,
                isRowSelected: false,
                indexId: 0,
                data: newMenuNode,
                items: [],
                enabled: true,
                isTreeNodeExpand: false,
            };
            newItem = newNode;
        }
        return newItem;
    }

    validationAddClassModel(model: AddNewClassRequest, classType: ClassObj[]): string {

        if (model.classId === 100 && classType) {
            const lgfsClassList = classType.filter(i => i.classtype === 'LGFS');
            if (lgfsClassList && lgfsClassList.length === 10) {
                return 'Exceeded the maximum number of LGFS classes';
            }
        } else if (model.classId === 110 && classType) {
            const lgfsClassList = classType.filter(i => i.classtype === 'AGFS');
            if (lgfsClassList && lgfsClassList.length === 10) {
                return 'Exceeded the maximum number of AGFS classes';
            }
        } else if (classType && model.classId < 100 && classType.find(clz => clz.rectype === model.classId)) {
            return 'This class already exits';
        } else if (model.classId < 1) {
            return 'Select class type';
        } else if (!model.openDate) {
            return 'Select open date';
        }
        return '';
    }


}


