import { mergeMap, catchError, map, switchMap, take, filter, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, combineLatest, from, empty } from 'rxjs';
import { PostOfficeService } from '../services/post-office-services';
import * as Core from '../actions/core';
import * as PostOfficeAction from '../../post-office-action-core/actions/core';
import * as AddNote from '../../add-note-core/actions/core';



import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';
import { DatePipe } from '@angular/common';
import {
    getPostOfficeSelectedInfoByToken,
    getPostOfficeColumnDefByToken,
    getPostOfficePeginatorDefByToken,
    getPostOfficeGridDataByToken,
    getGroupModeByToken
} from '../reducers';
import { GridRequest } from '../models/request';
import { FileUrlResolverService } from '../../document-view';
import { GroupMode, GridFilterKind, GridButtonType } from '../models/enumeration';
import { InitTeamMember, ChangeDepartmentOrFeeEranerState } from './../../team-member-core/actions/team-member';
import { TeamMemberOpenFrom } from '../../team-member-core/models/enums';


@Injectable()
export class PostOfficeEffects {
    constructor(private actions$: Actions, private store: Store<any>,
        private service: PostOfficeService, private datePipe: DatePipe,
        private urlResolver: FileUrlResolverService) { }


    @Effect()
    initNewView$ = this.actions$.pipe(ofType<Core.InitPostOffice>(Core.INIT_POST_CODE),
        switchMap((action) => {
            return from([
                // new Core.GridDataRequest(action.token),
                new InitTeamMember('TEAM_MEMBER_DATA_POST_CODE', TeamMemberOpenFrom.PostOffice),
                new Core.LoadDepartments(action.token)]);
        }));


    @Effect()
    $loadTeamMember = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        mergeMap((action) =>
            this.store.select(getPostOfficeSelectedInfoByToken(action.token)).pipe(
                map(selectedInfo => ({ selectedInfo, action: action })),
                take(1),
                filter(info => info.action.payload.newData.kind === GridFilterKind.department),
                map(info => {
                    const inPutData = {
                        departmentId: info.selectedInfo ? info.selectedInfo.departmentId : null,
                        isInactiveFeeEarners: false,
                        membereSearchText: null
                    };
                    return new ChangeDepartmentOrFeeEranerState('TEAM_MEMBER_DATA_POST_CODE', { inPutData: inPutData });
                }))));

    @Effect()
    loadDepartment$ = this.actions$.pipe(ofType<Core.LoadDepartments>(Core.LOAD_DEPARTMENTS),
        switchMap((action) =>
            this.service.getDepartments().pipe(
                map((result) => new Core.LoadDepartmentsSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadDepartmentsFail(action.token, error))))
        ));

    // @Effect()
    // loadloookFor$ = this.actions$.pipe(ofType<Core.LoadLoookFor>(Core.LOAD_LOOOK_FOR),
    //     switchMap((action) =>
    //         this.service.getLoookFor().pipe(
    //             map((result) => new Core.LoadLoookForSuccess(action.token, { items: result })),
    //             catchError((error) => of(new Core.LoadLoookForFail(action.token, error))))
    //     ));

    // @Effect()
    // loadGroup$ = this.actions$.pipe(ofType<Core.LoadGroups>(Core.LOAD_DEPARTMENTS),
    //     switchMap((action) => {

    //         return this.service.getGroups().pipe(
    //             map((result) => new Core.LoadGroupsSuccess(action.token, { items: result })),
    //             catchError((error) => of(new Core.LoadGroupsFail(action.token, error))));

    //     }  ));


    @Effect()
    loadUsers$ = this.actions$.pipe(ofType<Core.LoadUsers>(Core.LOAD_PERIODS),
        switchMap((action) =>
            this.service.getUsers().pipe(
                map((result) => new Core.LoadUsersSuccess(action.token, { items: result })),
                catchError((error) => of(new Core.LoadUsersFail(action.token, error))))
        ));



    @Effect()
    requestGridDataWithCurrentState$ = this.actions$.pipe(ofType<Core.GridDataRequest>(Core.REQUEST_GRID_DATA),
        switchMap(action =>
            combineLatest(
                this.store.select(getPostOfficeColumnDefByToken(action.token)),
                this.store.select(getPostOfficePeginatorDefByToken(action.token)),
                this.store.select(getPostOfficeSelectedInfoByToken(action.token)),
                this.store.select(getGroupModeByToken(action.token)),
                ((gridColumn, gridPage, selectedInfo, groupMode) => ({
                    gridColumn, gridPage, selectedInfo,
                    token: action.token, groupMode
                }))
            ).pipe(take(1),
                filter(info => !!info.gridColumn),
                map((info) => {

                    let groupFilter = [{ field: info.groupMode, dir: null }];
                    if (info.groupMode === GroupMode.ByGroup) {
                        groupFilter = [{ field: GroupMode.ByGroup, dir: 'desc' }];
                    } else if (info.groupMode === GroupMode.Date) {
                        groupFilter = [{ field: GroupMode.Date, dir: 'desc' }];
                    } else if (info.groupMode === GroupMode.ByGroupDate) {
                        groupFilter = [{ field: GroupMode.ByGroup, dir: null }, { field: GroupMode.Date, dir: 'desc' }];
                    } else if (info.groupMode === GroupMode.DateByGroup) {
                        groupFilter = [{ field: GroupMode.Date, dir: 'desc' }, { field: GroupMode.ByGroup, dir: null }];
                    }

                    const req = new GridRequest(
                        {
                            take: action.gridGroupData ? 50 : info.groupMode === GroupMode.Default ? info.gridPage.itemPerPage : 0,
                            filter: toODataFilter(info.gridColumn),
                            group: info.groupMode === GroupMode.Default || action.gridGroupData ? null : groupFilter,
                            skip: action.gridGroupData ? action.gridGroupData.currentItems :
                                info.groupMode === GroupMode.Default ? getPaginatorSkip(info.gridPage) : 0,
                            sort: info.groupMode === GroupMode.Default || action.gridGroupData ? toODataSort(info.gridColumn) : null
                        },
                        {
                            groupId: info.selectedInfo.departmentId,
                            userID: info.selectedInfo.userId.toString(),
                            searchText : info.selectedInfo.searchText,
                        }
                    );

                    return req;
                }
                ), map((request) => new Core.LoadGrid(action.token, request, action.gridGroupData)))
        ));


    @Effect()
    loadAllGridData$ = this.actions$.pipe(ofType<Core.LoadGrid>(Core.LOAD_GRID_DATA),
        switchMap(action => {
            return this.service.getGridData(action.request).pipe(
                map((response) => {
                    console.log(response);
                    return new Core.LoadGridSuccess(action.token, { pageData: response, gridGroupData: action.gridGroupData });
                }),
                catchError(error => of(new Core.LoadGridFail(action.token, error))));

        }));


    @Effect()
    changeGridFilter$ = this.actions$.pipe(ofType<Core.GridFilterChange>(Core.GRID_FILTER_UPDATE),
        mergeMap<any, any>((action) => {
            if (action.payload.newData.kind === GridFilterKind.department && action.payload.newData.value === -1) {
                return from([
                    new Core.GroupData(action.token, { type: GroupMode.ByGroup }),
                ]);
            } else {
                return from([new Core.GridDataRequest(action.token)]);
            }
        }));


    @Effect()
    groupData$ = this.actions$.pipe(ofType<Core.GroupData>(Core.GROUP_DATA),
        map(action => {
            if (action.payload.type !== GroupMode.Default) {
                return new Core.GridDataRequest(action.token, true, action.payload.type);
            } else {
                return new Core.GridDataRequest(action.token);
            }
        }));

    @Effect()
    RefreshGrid$ = this.actions$.pipe(ofType<Core.GridRefresh>(Core.GRID_REFRESH),
        switchMap((action) => {
            return from([new Core.GridDataRequest(action.token)]);
        }));

    @Effect()
    GridViewChange$ = this.actions$.pipe(ofType<Core.GridViewChange>(Core.GRID_VIEW_CHANGE),
        map((action) => {
            if (action.payload.value !== GroupMode.Default) {
                return new Core.GridDataRequest(action.token, true, action.payload.value);
            } else {
                return new Core.GridDataRequest(action.token);
            }
        }));


    @Effect()
    GetDocURL$ = this.actions$.pipe(ofType<Core.GetDocURL>(Core.GET_DOCUMENT_URL),
        map((action) => {
            // if (!action.payload.gridRow.docUrl || !action.payload.gridRow.emailItem) {
            //     if (action.payload.gridRow.hasPassword && !action.payload.gridRow.password) {
            //         return new Core.GetDocPassword(action.token, { row: action.payload.gridRow });
            //     } else {

            //         // const extentions = action.payload.gridRow.letter_name.split('.');
            //         // const extention = extentions[extentions.length - 1].toLocaleLowerCase();

            //         const extention = this.getFileType(action.payload.gridRow.letter_name);
            //         if (extention === 'msg' || extention === 'eml') {
            //             return new Core.GetEmailItem(action.token, action.payload.gridRow);
            //         } else if (wopiExtentions.filter(p => p === extention).length > 0) {
            //             return new Core.LoadWopiURL(action.token, action.payload.gridRow);
            //         } else if (browserCompatibleExtentions.filter(p => p === extention).length > 0) {
            return new Core.LoadPDFiURL(action.token, action.payload.gridRow);
            //         } else if (extention) {
            //             return new Core.LoadConversionURL(action.token, action.payload.gridRow);
            //         } else {
            //             return new Core.AllDataUpdate(action.token);
            //         }
            //     }
            // } else {
            //     return new Core.ViewDoc(action.token, action.payload.gridRow);
            // }
        }));











    @Effect()
    loadPDFiURL$ = this.actions$.pipe(ofType<Core.LoadPDFiURL>
        (Core.LOAD_DOCUMENT_PDF_URL), tap((data) => {
            console.log(data);
        }),
        mergeMap((action) => {

            return this.urlResolver.getPostOfficeDocumentUrl(action.request.inboxId).pipe(
                map((url: any) => {

                    return new Core.GetDocURLSuccess(action.token, { gridRow: action.request, url: url });
                }),
                catchError((data) => {
                    return of(new Core.GetDocURLFail(action.token, { request: action.request }));
                }));

        }));


    // const extention = action.request.letter_icon;
    // const extention = this.getFileType(action.request.letter_name);
    // if (imageExtentions.filter(p => p === extention).length > 0) {
    //     url = this.urlResolver.getImageHostUrl(url);
    // }



    // @Effect()
    // loadPDFiURL$ = this.actions$.pipe(ofType<Core.LoadPDFiURL>
    //     (Core.LOAD_DOCUMENT_PDF_URL), tap((data) => {
    //         console.log(data);
    //     }),
    //     mergeMap((action) =>
    //         this.urlResolver.getWorkDonePDFDocumentUrl(action.request).pipe(
    //             map((url: any) => {
    //                 // const extention = action.request.letter_icon;
    //                 const extention = this.getFileType(action.request.letter_name);
    //                 if (imageExtentions.filter(p => p === extention).length > 0) {
    //                     url = this.urlResolver.getImageHostUrl(url);
    //                 }
    //                 return new Core.GetDocURLSuccess(action.token, { gridRow: action.request, url: url });
    //             }),
    //             catchError((data) => {
    //                 return of(new Core.GetDocURLFail(action.token, { request: action.request }));
    //             }))
    //     ));





    // @Effect()
    // LoadWopiURL$ = this.actions$.pipe(ofType<Core.LoadWopiURL>(Core.LOAD_DOCUMENT_WOPI_URL), tap((data) => {
    //     console.log(data);
    // }),
    //     mergeMap((action) => {

    //         const item = action.request;
    //         const infor: DiaryEntryFileInfo = {
    //             diaryId: item.inboxId,
    //             fileName: item.letter_name,
    //             password: item.password,
    //         };
    //         return this.urlResolver.getDpsFileUrlByDiaryEntryFile(infor).pipe(
    //             map((link) => ({ error: false, docLink: link, action: action })),
    //             catchError((data) => {
    //                 return of({ error: true, docLink: data, action: action });
    //             }));
    //     }), mergeMap<any, Core.Any>(({ error, docLink, action }: { error: boolean, docLink: any, action: any }) => {
    //         if (error) {
    //             return of(new Core.GetDocURLFail(action.token, { request: action.request }));
    //         } else {
    //             return this.urlResolver.getWopiHostUrl(docLink.url, docLink.accessToken, docLink.accessTokenTTL).pipe(
    //                 map((url) => {
    //                     return new Core.GetDocURLSuccess(action.token, { gridRow: action.request, url: url });
    //                 }));
    //         }
    //     }));



    // @Effect()
    // emailItemData$ = this.actions$.pipe(ofType<Core.GetEmailItem>(Core.LOAD_EMAIL_ITEM),
    //     switchMap((action) => {
    //         return this.service.getMailItemByDiary(action.request).pipe(
    //             map((result) => new Core.GetEmailItemSuccess(action.token, {
    //                 emailItem: result,
    //                 row: action.request
    //             })),
    //             catchError((data) => {
    //                 return of(new Core.GetDocURLFail(action.token, ''));
    //             }));
    //     }));



    // @Effect()
    // loadConversionURL$ = this.actions$.pipe(ofType<Core.LoadConversionURL>
    //     (Core.LOAD_CONCERTION_URL), switchMap((action) =>
    //         this.urlResolver.getWordDoneDocumentConversionUrl(action.request).pipe(
    //             map((data) => {
    //                 return new Core.GetDocURLSuccess(action.token, { gridRow: action.request, url: data.data });
    //             }),
    //             catchError((error) => empty()))
    //     ));

    @Effect()
    validateUserPassword$ = this.actions$.pipe(ofType<Core.ValidatePassword>(Core.VALIDATE_PASSWORD),
        switchMap((action) => {
            return this.service.checkPassword(action.payload.row.inboxId, action.payload.insertPassword).pipe(
                map((result) => {
                    if (result.data) {
                        return new Core.SetPassword(action.token, {
                            row: action.payload.row,
                            insertPassword: action.payload.insertPassword
                        });
                    } else {
                        return new Core.PaswordInvalid(action.token);
                    }
                }),
                catchError((data) => {
                    return of(new Core.GetDocURLFail(action.token, ''));
                }));
        }));

    @Effect()
    GetUrlWithPassword$ = this.actions$.pipe(ofType<Core.SetPassword>(Core.SET_DOC_PASSWORD),
        switchMap(action =>
            this.store.select(getPostOfficeGridDataByToken(action.token)).pipe(
                map(gridData => ({ gridData, action: action })),
                take(1),
                switchMap(info => {
                    const selectRow = info.gridData.find(row => row.inboxId === info.action.payload.row.inboxId);
                    return of(new Core.GetDocURL(info.action.token, { gridRow: selectRow }));
                }))));



    @Effect()
    RequstGroupData$ = this.actions$.pipe(ofType<Core.GroupDataRequest>(Core.GROUP_DATA_REQUEST),
        map(action => {
            if (action.payload.gridGroupData.currentItems < action.payload.gridGroupData.count &&
                !action.payload.gridGroupData.hasSubgroups) {
                return new Core.GridDataRequest(action.token, false, '', action.payload.gridGroupData);
            } else {
                return new Core.AllDataUpdate(action.token);
            }
        }));



    @Effect()
    saveTimeRecordsSuccess$ = this.actions$.pipe(ofType<PostOfficeAction.SaveTimeRecordsSuccess>(PostOfficeAction.SAVE_SUCCESS),
        mergeMap((action) => {
            return from([new Core.GridRefresh('postOfficePage')]);
        }));


    @Effect()
    addNoteSaveSuccess$ = this.actions$.pipe(ofType<AddNote.AddNoteSaveSuccess>(AddNote.ADD_NOTE_SAVE_SCCEESS),
        mergeMap((action) => {
            return from([new Core.GridRefresh('postOfficePage')]);
        }));

    // Core.AddNoteSaveSuccess


    @Effect()
    fileHistoryGridRowChangeDeleteRow$ = this.actions$.pipe(ofType
        <Core.PostOfficeGridRowChange>(Core.POST_OFFICE_GRID_ROW_CHANGE),
        filter((action) => action.payload.kind === GridButtonType.deleteItem),
        switchMap((action) => {

            return this.store.select(getPostOfficeGridDataByToken(action.token)).pipe(
                take(1),
                switchMap(gridData => {

                    const inboxIds = gridData.filter(item => item.isChecked).map((item) => {
                        return item.inboxId;
                    });

                    return this.service.deleteInboxEntries(inboxIds).pipe(
                        map((result) => new Core.GridRefresh(action.token)),
                        catchError((error) => of(new Core.DeleteFileRecordFail(action.token, {}))));
                }));
        }));


    // getFileType(fileName: string): string {
    //     if (fileName && fileName.split('.')[1].toLocaleLowerCase()) {
    //         return fileName.split('.')[1].toLocaleLowerCase();
    //     }
    //     return '';
    // }


}










