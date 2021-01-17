import { OpportunityConflictSearchSaveRequest } from './../models/interfaces';
import { getOpportunityConflictSearchStateByToken } from './../reducers/index';
import { catchError, switchMap, map, take } from 'rxjs/operators';
import {
    ConflictSearchClientRequest, ConflictSearchSaveRequest, OpportunityConflictSearchRequest
} from '../models/interfaces';
import { getConflictSearchModelToken } from '../reducers';
import { InitConflictSearch, ConflictSearchClose } from '../actions/core';
import { combineLatest, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as Core from '../actions/core';
import { ConflictSearchService } from '../services/conflict-search-service';
import { getConflictSearchStateByToken } from '../reducers';
import { FailDialogData, FailDialogComponent, InforDialogData, InforDialogComponent } from '../../shared';
import { MatDialog } from '@angular/material';
import { ConflictCheckType, ConflictSaveType } from '../models/enum';
import { getUser } from '../../auth';
import { dpsNewDate } from '../../utils/javascriptDate';
@Injectable()
export class ConflictSearchEffects {
    constructor(private dialog: MatDialog,
        private actions$: Actions, private store: Store<any>, private service: ConflictSearchService) { }

    // @Effect()
    // openCaseInit$ = this.actions$.ofType<Core.InitConflictSearch>(Core.INIT_CONFLICT_SEARCH)
    //     .switchMap((action) =>
    //         this.store.select(getConflictSearchModelToken(action.token)).take(1)
    //             .map((result) => {
    //                 const request: ConflictSearchClientRequest = new ConflictSearchClientRequest(result);
    //                 return new Core.ConflictSearchClient(action.token, { request: request });
    //             })
    //     );

    @Effect()
    conflictSearchClient$ = this.actions$.pipe(ofType<Core.ConflictSearchSearchClient>(Core.CONFLICT_SEARCH_SEARCH_CLIENT),
        switchMap((action) => {
            return this.store.select(getConflictSearchModelToken(action.token)).pipe(take(1),
                switchMap((searchModel) => {
                    const searchModelRequest: ConflictSearchClientRequest = new ConflictSearchClientRequest(searchModel);
                    return this.service.getClientList(searchModelRequest).pipe(
                        map((result) => {
                            if (result['errorResponse'] && result['errorResponse'].length > 0) {
                                const detailStatus = result['errorResponse'].map(item => {
                                    return { title: item.title, message: item.message };
                                });
                                const dialogData: FailDialogData = {
                                    messageBody: 'Please correct the validation errors',
                                    messageHeader: 'Validation error',
                                    detailStatus: detailStatus,
                                };
                                const dialogRef = this.dialog.open(FailDialogComponent, {
                                    data: dialogData,
                                    width: '450px',
                                    panelClass: 'dps-notification'
                                });
                                return new Core.ConflictSearchSearchClientFail(action.token, null);
                            } else {
                                return new Core.ConflictSearchSearchClientSucess(action.token,
                                    { response: result, request: searchModelRequest });
                            }
                        }),
                        catchError((error) => of(new Core.ConflictSearchSearchClientFail(action.token, error))));
                }));
        }));

    @Effect()
    conflictSearchClientDetail$ = this.actions$.pipe(ofType<Core.ConflictSearchClientDetails>(Core.CONFLICT_SEARCH_SEARCH_CLIENT_DETAILS),
        switchMap((action) => {
            return combineLatest(
                this.service.getClientDetailList(action.payload.request.clientRef),
                this.service.getClient(action.payload.request.clientRef),
                ((clientDetailListResponce, clientResponce) => ({
                    clientDetailListResponce: clientDetailListResponce,
                    clientResponce: clientResponce,
                }))
            ).pipe(take(1), map((data) => {
                return new Core.ConflictSearchClientDetailsSucess(action.token,
                    {
                        clientDetailListResponce: data.clientDetailListResponce,
                        clientResponse: data.clientResponce,
                        request: action.payload.request,
                    }
                );
            }), catchError(error => of(new Core.ConflictSearchClientDetailsFail(action.token, {
                value: 'fail'
            }))));
        }));

    @Effect()
    conflictSearchSave$ = this.actions$.pipe(ofType<Core.ConflictSearchSave>(Core.CONFLICT_SEARCH_SAVE),
        switchMap((action) => this.store.select(getUser).pipe(take(1), map(user => ({ user, action })))),
        switchMap(({ user, action }) => {
            return this.store.select(getConflictSearchStateByToken(action.token)).pipe(take(1),
                switchMap((state) => {
                    let fileRequestViewModel = null;
                    if (state.conflictCheckType === ConflictCheckType.Matter) {
                        fileRequestViewModel = {
                            appId: state.clientDto.appId ? state.clientDto.appId : state.clientDto.appID,
                            branchId: state.clientDto.branchID,
                            fileId: state.clientDto.fileID,
                        };
                    }
                    const clientReference = (state.clientDto.clientRef) ?
                        state.clientDto.clientRef : state.clientDto.clientReference;

                    const saveRequest: ConflictSearchSaveRequest = new ConflictSearchSaveRequest(
                        state.conflictSearchListResponse.data.data,
                        state.searchModel,
                        clientReference,
                        dpsNewDate(user.general.dateTimeOffset),
                        state.conflictCheckType,
                        fileRequestViewModel,
                    );
                    return this.service.conflictSearchSave(saveRequest).pipe(
                        map((result) => {
                            if (result.status.toLowerCase() === 'success') {
                                let conflictSavedMsg = 'The conflict search has been saved to the client documents.';
                                if (state.conflictCheckType === ConflictCheckType.Matter) {
                                    conflictSavedMsg = 'The conflict check has been saved to the events diary.';
                                }
                                const dialogData: InforDialogData = {
                                    content: {
                                        title: 'Conflict search saved',
                                        message: conflictSavedMsg,
                                    },
                                    contentParams: {},
                                    data: { messageType: 'alert' }
                                };
                                const dialogRef = this.dialog.open(InforDialogComponent, {
                                    data: dialogData,
                                    width: '350px',
                                    panelClass: 'dps-notification'
                                });
                                dialogRef.afterClosed().subscribe(dialogResult => {
                                    if (action.payload.type === ConflictSaveType.SaveAndGotoNewItem) {
                                        this.store.dispatch(new InitConflictSearch(action.token,
                                            {
                                                inputData: {
                                                    conflictCheckType: state.conflictCheckType,
                                                    clientDto: state.clientDto, openFrom: state.openFrom,
                                                    commonPara: { data: '', status: '' }
                                                }
                                            }));
                                    } else if (action.payload.type === ConflictSaveType.SaveAndClose) {
                                        // saveType
                                        this.store.dispatch(new ConflictSearchClose(action.token,
                                            { saveType: ConflictSaveType.SaveAndClose }));
                                    }
                                });
                            } else {
                                const dialogData: InforDialogData = {
                                    content: {
                                        title: 'Error occurred while saving',
                                        message: 'Conflict search saved'
                                    },
                                    contentParams: {},
                                    data: { messageType: 'alert' }
                                };
                                const dialogRef = this.dialog.open(InforDialogComponent, {
                                    data: dialogData,
                                    width: '350px',
                                    panelClass: 'dps-notification'
                                });
                            }
                            return new Core.ConflictSearchSaveSuccess(action.token, {});
                        }),
                        catchError((error) => of(new Core.ConflictSearchSaveFail(action.token, error))));
                }));
        }));
    @Effect()
    opportunityConflictSearch$ = this.actions$.pipe(ofType<Core.OpportunityConflictSearch>(Core.OPPORTUNITY_CONFLICT_SEARCH),
        switchMap((action) => {
            return this.store.select(getOpportunityConflictSearchStateByToken(action.token)).pipe(take(1),
                switchMap((searchModel) => {
                    const searchModelRequest: OpportunityConflictSearchRequest =
                        new OpportunityConflictSearchRequest(searchModel);
                    return this.service.getOpportunityClientList(searchModelRequest).pipe(
                        map((result) => {
                            if (result['errorResponse'] && result['errorResponse'].length > 0) {
                                const detailStatus = result['errorResponse'].map(item => {
                                    return { title: item.title, message: item.message };
                                });
                                const dialogData: FailDialogData = {
                                    messageBody: 'Please correct the validation errors',
                                    messageHeader: 'Validation error',
                                    detailStatus: detailStatus,
                                };
                                const dialogRef = this.dialog.open(FailDialogComponent, {
                                    data: dialogData,
                                    width: '450px',
                                    panelClass: 'dps-notification'
                                });
                                return new Core.OpportunityConflictSearchFail(action.token, null);
                            } else {
                                return new Core.OpportunityConflictSearchSucess(action.token,
                                    { response: result, request: searchModelRequest });
                            }
                        }),
                        catchError((error) => of(new Core.OpportunityConflictSearchFail(action.token, error))));
                }));
        }));

    @Effect()
    opportunityConflictSearchSave$ = this.actions$.pipe(ofType<Core.OpportunityConflictSearchSave>(Core.OPPORTUNITY_CONFLICT_SEARCH_SAVE),
        switchMap((action) => {
            return this.store.select(getConflictSearchStateByToken(action.token)).pipe(take(1),
                switchMap((state) => {
                    let gridSearchList;
                    if (state && state.conflictSearchListResponse && state.conflictSearchListResponse.data &&
                        state.conflictSearchListResponse.data.data) {
                        gridSearchList = state.conflictSearchListResponse.data.data;
                    } else {
                        gridSearchList = [];
                    }
                    const clientReference = (state.clientDto.clientRef) ?
                        state.clientDto.clientRef : state.clientDto.clientReference;

                    const saveRequest: OpportunityConflictSearchSaveRequest = new OpportunityConflictSearchSaveRequest(
                        gridSearchList,
                        {
                            lastName: state.searchModel ? state.searchModel.surname : '',
                            firstName: state.searchModel ? state.searchModel.forname : '',
                            postCode: state.searchModel ? state.searchModel.postCode : '',
                            companyName: state.searchModel ? state.searchModel.company : '',
                            companyNameList: state.companyList ? state.companyList : [],
                            enquiryId: state.commonPara ? state.commonPara.data ?
                                +state.commonPara.data.enquiryId : -1 : -1,
                            matterDetails: state.searchModel ? state.searchModel.matterDetails : '',
                            includeClientWithNoMatter: state.searchModel ? state.searchModel.includeClientWithNoMatter : false,
                            isClientTypeCompany: state.searchModel ? state.searchModel.isClientTypeCompany : false,
                            birthDate: state.searchModel ? state.searchModel.dOB : null,
                        },
                    );
                    return this.service.opportunityConflictSave(saveRequest).pipe(
                        map((result) => {
                            if (result.status.toLowerCase() === 'success') {
                                const conflictSavedMsg = 'Conflict search saved.';
                                const dialogData: InforDialogData = {
                                    content: {
                                        title: 'Conflict search',
                                        message: conflictSavedMsg,
                                    },
                                    contentParams: {},
                                    data: { messageType: 'alert' }
                                };
                                const dialogRef = this.dialog.open(InforDialogComponent, {
                                    data: dialogData,
                                    width: '350px',
                                    panelClass: 'dps-notification'
                                });
                                dialogRef.afterClosed().subscribe(dialogResult => {
                                    if (action.payload.type === ConflictSaveType.SaveAndGotoNewItem) {
                                        this.store.dispatch(new ConflictSearchClose(action.token,
                                            { saveType: ConflictSaveType.SaveAndGotoNewItem }));
                                    } else if (action.payload.type === ConflictSaveType.SaveAndClose) {
                                        this.store.dispatch(new ConflictSearchClose(action.token,
                                            { saveType: ConflictSaveType.SaveAndGotoNewItem }));
                                    } else if (action.payload.type === ConflictSaveType.Save) {
                                        this.store.dispatch(new ConflictSearchClose(action.token,
                                            { saveType: ConflictSaveType.SaveAndGotoNewItem }));
                                    }
                                });
                            } else {
                                const dialogData: InforDialogData = {
                                    content: {
                                        title: 'Error occurred while saving',
                                        message: 'Conflict search saved'
                                    },
                                    contentParams: {},
                                    data: { messageType: 'alert' }
                                };
                                const dialogRef = this.dialog.open(InforDialogComponent, {
                                    data: dialogData,
                                    width: '350px',
                                    panelClass: 'dps-notification'
                                });
                            }
                            return new Core.OpportunityConflictSearchSaveSuccess(action.token, {});
                        }),
                        catchError((error) => of(new Core.OpportunityConflictSearchSaveFail(action.token, error))));
                }));
        }));
}
