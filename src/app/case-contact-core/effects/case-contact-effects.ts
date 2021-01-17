
import { take, tap, map, filter, switchMap, catchError, mergeMap } from 'rxjs/operators';
import {
    getCaseContactByToken, getCaseContactHashByToken,
    getScreensContactTypeListByToken,
    getIsDataLoadedByToken
} from '../reducers';
import { CaseContactRequest, MainContactRequest, ScreensContactTypeRequest } from '../models/case-contact-request';
import { combineLatest, of } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import * as CaseContactCore from '../actions/core';
import { CaseContactService } from '../services/case-contact.service';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import { WorkflowMenuMetaItem } from '../../workflow-menu-core';
import { WorkflowMenuMetaDataWrapper } from '../../workflow-menu-core/models/interfaces';
import { RunWorkflowCommand } from '../../workflow-menu-core/actions/core';
import { RowItemChangeKind } from '../../case-contact-core/actions/core';
import { MatDialog } from '../../../../node_modules/@angular/material';


@Injectable()
export class CaseContactEffects {
    constructor(private actions$: Actions, private store: Store<any>, private service: CaseContactService
        , private dialog: MatDialog,
        private injector: Injector) { }

    @Effect()
    initNewView$ = this.actions$.pipe(ofType<CaseContactCore.InitCaseContact>(CaseContactCore.INIT_CASE_CONTACT),
        // .do((data) => console.log('$initNewView', data))
        map((action) => new CaseContactCore.LoadCaseContactDataWithCurrentState(action.token)));


    @Effect()
    fileHistoryViewChange$ = this.actions$.pipe(ofType<CaseContactCore.CaseContactViewChange>(CaseContactCore.CASE_CONTACT_CHANGE),
        map((action) => new CaseContactCore.LoadCaseContactDataWithCurrentState(action.token)));




    @Effect()
    loadCurrentStateData$ = this.actions$
        .pipe(ofType<CaseContactCore.LoadCaseContactDataWithCurrentState>(CaseContactCore.LOAD_CASE_CONTACT_DATA_WITH_CURRENT_STATE),
            switchMap<CaseContactCore.LoadCaseContactDataWithCurrentState, { hasHash: boolean, token: string }>((action) =>
                this.store.select(getIsDataLoadedByToken(action.token)).pipe(
                    map(hasHash => ({ token: action.token, hasHash: hasHash })), take(1),
                    tap((data) => {
                        console.log('hasHash', data);
                    }))
            ),
            filter((info) => !info.hasHash),
            tap((data) => {
                console.log('Effect excute', CaseContactCore.LOAD_CASE_CONTACT_GRID_DATA, ' ', data);
            }),
            switchMap((action) => {

                return combineLatest(this.store.select(getCaseContactByToken(action.token)).pipe(take(1)),
                    this.store.select(getCaseContactHashByToken(action.token)).pipe(take(1)),
                    (state, hash) => ({ state, hash })).pipe(
                        map((info) => {
                            if (info.state.fromContact) {
                                return new MainContactRequest(
                                    info.state.searchText,
                                    0,
                                    0,
                                    {
                                        take: info.state.pageEvent.pageSize,
                                        filter: toODataFilter(info.state.columnDef),
                                        skip: getPaginatorSkip({
                                            total: info.state.pageEvent.length,
                                            currentPage: info.state.pageEvent.pageIndex,
                                            itemPerPage: info.state.pageEvent.pageSize
                                        }),
                                        sort: toODataSort(info.state.columnDef)
                                    },
                                    info.hash,
                                    info.state.matterInfo
                                );
                            } else {


                                const _filter = toODataFilter(info.state.columnDef);

                                const request = new CaseContactRequest({
                                    SearchText: info.state ? info.state.searchText : '',
                                    BranchId: info.state && info.state.matterInfo ? info.state.matterInfo.BranchId : null,
                                    AppId: info.state && info.state.matterInfo ? info.state.matterInfo.AppId : null,
                                    FileId: info.state && info.state.matterInfo ? info.state.matterInfo.FileId : null,
                                }, {
                                    take: info.state.pageEvent.pageSize,
                                    filter: _filter,
                                    skip: getPaginatorSkip({
                                        total: info.state.pageEvent.length,
                                        currentPage: info.state.pageEvent.pageIndex,
                                        itemPerPage: info.state.pageEvent.pageSize
                                    }),
                                    sort: toODataSort(info.state.columnDef)
                                },
                                    info.hash,
                                    info.state.matterInfo);


                                return request;
                            }
                        }), map((request) => new CaseContactCore.LoadCaseContactGridData(action.token, request)));

            }));

    @Effect()
    loadGridData$ = this.actions$.pipe(ofType<CaseContactCore.LoadCaseContactGridData>(CaseContactCore.LOAD_CASE_CONTACT_GRID_DATA),
        mergeMap((action) => {

            const screensContactTypeRequest = new ScreensContactTypeRequest(
                +action.request.matterInfo.AppId, {
                take: 0,
                filter: null,
                skip: 0,
                sort: null
            });

            const screensContactTypelist$ = this.store.select(getScreensContactTypeListByToken(action.token)).pipe(take(1),
                switchMap((screensContactTypelist) => {
                    if (screensContactTypelist) {
                        return of(screensContactTypelist);
                    } else {
                        return this.service.getContactTypeScreensLoad(screensContactTypeRequest);
                    }
                }), take(1));


            const contactGridData$ = this.service.getCaseContactData(action.request);

            return combineLatest(
                screensContactTypelist$,
                contactGridData$,
                ((screensContactTypelist, contactGridData) => ({
                    screensContactTypelist: screensContactTypelist,
                    contactGridData: contactGridData,
                }))
            ).pipe(take(1), map((result) => {

                return new CaseContactCore
                    .LoadCaseContactGridDataSuccess(action.token, {
                        response: result.contactGridData, contactTypeResponse: result.screensContactTypelist
                        , request: action.request
                    });

            }), catchError((error) => of(new CaseContactCore.LoadCaseContactGridDataFail(action.token, null))));

        }));







    @Effect()
    caseContactRefresh$ = this.actions$.pipe(ofType<CaseContactCore.CaseContactRefresh>(CaseContactCore.CASE_CONTACT_REFRESH),
        switchMap((action) =>
            combineLatest(this.store.select(getCaseContactByToken(action.token)),
                this.store.select(getCaseContactHashByToken(action.token)),
                (state, hash) => ({ state, hash })).pipe(
                    map((info) => {
                        if (info.state.fromContact) {
                            return new MainContactRequest(
                                info.state.searchText,
                                0,
                                0,
                                {
                                    take: info.state.pageEvent.pageSize,
                                    filter: toODataFilter(info.state.columnDef),
                                    skip: getPaginatorSkip({
                                        total: info.state.pageEvent.length,
                                        currentPage: info.state.pageEvent.pageIndex,
                                        itemPerPage: info.state.pageEvent.pageSize
                                    }),
                                    sort: toODataSort(info.state.columnDef)
                                },
                                info.hash);

                        } else {
                            const req = new CaseContactRequest({
                                SearchText: info.state ? info.state.searchText : '',
                                BranchId: info.state ? info.state.matterInfo.BranchId : null,
                                AppId: info.state ? info.state.matterInfo.AppId : null,
                                FileId: info.state ? info.state.matterInfo.FileId : null,
                            }, {
                                take: info.state.pageEvent.pageSize,
                                filter: toODataFilter(info.state.columnDef),
                                skip: getPaginatorSkip({
                                    total: info.state.pageEvent.length,
                                    currentPage: info.state.pageEvent.pageIndex,
                                    itemPerPage: info.state.pageEvent.pageSize
                                }),
                                sort: toODataSort(info.state.columnDef)
                            }, info.hash,
                                info.state.matterInfo);

                            return req;
                        }
                    }), take(1),
                    map((request) => {

                        return new CaseContactCore.LoadCaseContactGridData(action.token, request);
                    }))));







    @Effect()
    fileHistoryGridRowChange$ = this.actions$.pipe(
        ofType<CaseContactCore.CaseContactGridRowChange>(CaseContactCore.CASE_CONTACT_GRID_ROW_CHANGE),
        filter((action) => action.payload.kind === RowItemChangeKind.DoubleClick),
        switchMap((action) => {
            return this.store.select(getCaseContactByToken(action.token)).pipe(take(1), map((state) => {
                return { state: state, action: action };
            }));
        }),
        filter((data) => {
            return data.action.payload.row['screenId'] > 0;
        }),
        map((data) => {
            const value = getCreateItemNewMenuItem(data.action.payload.row, data.state);
            return new RunWorkflowCommand(data.action.payload.value, this.injector, value);
        }));

}


function getCreateItemNewMenuItem(item, state) {
    let newShortcutKuyNode: WorkflowMenuMetaDataWrapper = null;
    if (item) {
        const template = '[US' + item.screenId + ']';
        const newMenuNode: WorkflowMenuMetaItem = {
            atN_AppID: + state.matterInfo.AppId,
            atN_Command: template,
            atN_Desc: item.note,
            atN_Help: '',
            atN_ID: null,
            atN_Level: 0,
            atN_Order: 1,
            atN_ParentID: null,
            atN_ParentMenu: null,
            atN_Type: 2, // Menu
            createUser: '',
            dateDone: '',
            nodeStatus: 1,
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
        newShortcutKuyNode = newNode;
    }
    return newShortcutKuyNode;
}



