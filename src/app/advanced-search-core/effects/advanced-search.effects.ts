import { AdvancedSearchDesktopPopupComponent } from './../../advanced-search-desktop/containers/advanced-search-desktop-popup.component';

import { MainMenuService } from './../../layout-desktop/services/main-menu.service';
import { GridRowItemWrapper } from '../../core/lib/matter';


import { filter, map, switchMap, catchError, take, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
// import 'rxjs/add/operator/filter';
import { of, from, EMPTY as empty, merge, combineLatest } from 'rxjs';
import * as AdvancedSearch from '../actions/core';

import { AdvancedSearchService } from '../services/advanced-search.service';
import {

  getSearchAdvancedInfoByToken, getSelectedAppListItem, getColumnDefByToken, getpaginatorDefByToken, getAdvancedSearchViewModeByToken,
} from '../reducers/index';
import { MatterSearchMode } from '../models/enums';
import { AdvanceSearchRequest } from '../models/requests';
import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';
import { MatDialogRef } from '@angular/material';



@Injectable()
export class AdvancedSearchEffects {

  constructor(
    private actions$: Actions,
    private store: Store<any>, private service: AdvancedSearchService,
    protected pageService: MainMenuService,
    public dialogRef: MatDialogRef<AdvancedSearchDesktopPopupComponent>
  ) { }


  @Effect()
  initewView$ = this.actions$.pipe(ofType<AdvancedSearch.InitAdvancedSearchView>(AdvancedSearch.INIT_ADVANCED_SEARCH_VIEW),
    mergeMap(action => from([
      new AdvancedSearch.GetBranchListAdvancedSearch(action.token),
      new AdvancedSearch.GetClientListAdvancedSearch(action.token),
      new AdvancedSearch.GetAppCodeData(action.token),

    ])
    ));



  @Effect()
  getMatterSearchInfo$ = this.actions$.pipe(ofType<AdvancedSearch.GetMatterSearchAdvancedLoadingInfo>
    (AdvancedSearch.GET_MATTER_ADVANCED_LOADING_INFO),
    switchMap((action) =>
      this.service.getMatterSearchInfo().pipe(
        map((result) => new AdvancedSearch.GetMatterSearchAdvancedLoadingInfoSuccess(action.token, result)),
        catchError((error) => of(new AdvancedSearch.GetMatterSearchAdvancedLoadingInfoFail(action.token, { error: error }))))

    ));

  @Effect()
  getFullMatterDataSuccess$ = this.actions$.pipe(ofType<AdvancedSearch.GetMatterSearchAdvancedLoadingInfoSuccess>
    (AdvancedSearch.GET_MATTER_ADVANCED_LOADING_INFO_SUCCESS),
    switchMap(action =>
      from([
        new AdvancedSearch.GetAdvancedSearchHeaders(action.token,
          {
            branchId: action.payload.branchId,
            appId: action.payload.appId,
            searchColumnOption: action.payload.columnOptionMode,
            matterSearchMode: action.payload.matterSearchMode,
          }),


      ])));
  @Effect()
  getHeadersFromBackEnd$ = this.actions$.pipe(ofType<AdvancedSearch.GetAdvancedSearchHeaders>(AdvancedSearch.GET_ADVANCED_SEARCH_HEADERS),
    switchMap((action) =>
      this.store.select(getSelectedAppListItem(action.token)).pipe(
        map(selectInfo => ({ selectInfo: selectInfo, action: action })),
        take(1),
        filter(info => info.selectInfo && !info.selectInfo.headers),
        switchMap((info) =>
          this.service.getSearchHeadersData(action.payload).pipe(
            map((result) => new AdvancedSearch.GetAdvancedSearchHeadersSuccess(info.action.token, result)),
            catchError((error) => of(new AdvancedSearch.GetAdvancedSearchHeadersFail(info.action.token, { error: error }))))
        ))));

  @Effect()
  getHeadersFromLocal$ = this.actions$.pipe(ofType<AdvancedSearch.GetAdvancedSearchHeaders>(AdvancedSearch.GET_ADVANCED_SEARCH_HEADERS),
    switchMap((action) =>
      this.store.select(getSelectedAppListItem(action.token)).pipe(
        map(selectInfo => ({ selectInfo: selectInfo, action: action })),
        take(1),
        filter(info => info.selectInfo && !!info.selectInfo.headers),
        map((info) =>
          new AdvancedSearch.AdvancedSetColoumHeaders(info.action.token, { headers: info.selectInfo.headers })
        ))));

  @Effect()
  setColoumnHeaders$ = this.actions$.pipe(ofType<AdvancedSearch.GetAdvancedSearchHeadersSuccess>
    (AdvancedSearch.GET_ADVANCED_SEARCH_HEADERS_SUCCESS),
    switchMap((action) =>
      this.store.select(getSelectedAppListItem(action.token)).pipe(
        map(selectInfo => ({ selectInfo })),
        take(1),
        filter(info => info.selectInfo && !!info.selectInfo.headers),
        map((info) => new AdvancedSearch.AdvancedSetColoumHeaders(action.token, { headers: info.selectInfo.headers })))));


  @Effect()
  getBranchList$ = this.actions$.pipe(ofType<AdvancedSearch.GetBranchListAdvancedSearch>(AdvancedSearch.GET_BRANCH_LIST_ADVANCED_SEARCH),
    switchMap((action) =>
      this.service.getBranchList().pipe(
        map((result) => new AdvancedSearch.GetBranchListAdvancedSearchSuccess(action.token, result)),
        catchError((error) => of(new AdvancedSearch.GetBranchListAdvancedSearchFail(action.token, { error: error }))))

    ));

  @Effect()
  GridViewChange$ = this.actions$.pipe(ofType<AdvancedSearch.AdvancedSearchAppCodeChange>(AdvancedSearch.ADVANCED_SEARCH_APP_CODE_CHANGE),
    switchMap(action =>
      combineLatest(this.store.select(getAdvancedSearchViewModeByToken(action.token)),
        this.store.select(getAdvancedSearchViewModeByToken(action.token)),
        this.store.select(getSearchAdvancedInfoByToken(action.token)),
        (advancedSearchViewMode, searchAdvancedInfo) =>
          ({ advancedSearchViewMode, searchAdvancedInfo })
      ).pipe(
        take(1),
      ).pipe(take(1),
        map((data) => new AdvancedSearch.GetAdvancedSearchHeaders(action.token,
          {
            branchId: data.searchAdvancedInfo.branchId, appId: action.payload.value,
            searchColumnOption: data.advancedSearchViewMode.searchColumnOption,
            matterSearchMode: data.advancedSearchViewMode.matterSearchMode
          })))
    ));



  @Effect()
  getAppCodeList$ = this.actions$.pipe(ofType<AdvancedSearch.GetAppCodeData>(AdvancedSearch.LOAD_APP_CODE_DATA),
    switchMap((action) =>
      this.service.getAppCodeList().pipe(
        map((result) => new AdvancedSearch.GetAppCodeDataSuccess(action.token, result)),
        catchError((error) => of(new AdvancedSearch.GetAppCodeDataFail(action.token, { error: error }))))

    ));

  @Effect()
  getselectedInfo$ = this.actions$.pipe(ofType<AdvancedSearch.GetAppCodeDataSuccess>(AdvancedSearch.LOAD_APP_CODE_DATA_SUCCESS),
    switchMap(action =>
      from([
        new AdvancedSearch.GetMatterSearchAdvancedLoadingInfo(action.token),
      ])));

  @Effect()
  LoadAdvancedGridData$ = this.actions$.pipe(ofType<AdvancedSearch.RequestAdvancedGridData>(AdvancedSearch.REQUEST_ADVANCED_GRID_DATA),
    switchMap(action =>
      combineLatest(
        this.store.select(getSearchAdvancedInfoByToken(action.token)),
        this.store.select(getAdvancedSearchViewModeByToken(action.token)),
        this.store.select(getpaginatorDefByToken(action.token)),
        this.store.select(getColumnDefByToken(action.token)),
        ((advancedInfo, advancedSearchViewMode, paginatorDef, columnDef) => (
          { advancedInfo, advancedSearchViewMode, paginatorDef, columnDef }))
      ).pipe(take(1),
        map((info) =>
          new AdvanceSearchRequest({
            searchClients: info.advancedSearchViewMode.searchClients,
            searchMatters: info.advancedSearchViewMode.searchMatters,
            branchId: info.advancedInfo.branchId,
            appId: info.advancedInfo.appID,
            matterClosed: info.advancedSearchViewMode.matterClosed,
            searchColumnOption: info.advancedSearchViewMode.searchColumnOption,
            matterSearchMode: info.advancedSearchViewMode.matterSearchMode,
            searchFields: info.advancedSearchViewMode.searchFields,
            inString: info.advancedSearchViewMode.inString,
          },
            {
              take: info.paginatorDef.itemPerPage,             // .itemPerPage,
              filter: toODataFilter(info.columnDef),
              skip: getPaginatorSkip(info.paginatorDef),
              sort: toODataSort(info.columnDef)
            })
        ), map((request) => new AdvancedSearch.LoadAdvanceSearchData(action.token, request)))
    ));

  @Effect()
  getClientsDtails$ = this.actions$.pipe(ofType<AdvancedSearch.GetClientListAdvancedSearch>(AdvancedSearch.GET_CLIENT_LIST_ADVANCED_SEARCH),
    switchMap((action) =>
      this.service.getClientList().pipe(
        map((result) => new AdvancedSearch.GetClientListAdvancedSearchSuccess(action.token, result)),
        catchError((error) => of(new AdvancedSearch.GetClientListAdvancedSearchFail(action.token, { error: error }))))

    ));


  @Effect()
  LoadAllGridData$ = this.actions$.pipe(ofType<AdvancedSearch.LoadAdvanceSearchData>(AdvancedSearch.LOAD_ADVANCED_SEARCH_DATA),
    switchMap(action => {
      return this.service.getAdvancedGridData(action.request).pipe(
        map((response) =>
          new AdvancedSearch.LoadAdvanceSearchDataSuccess(action.token, { response: response, request: null })),
        catchError(error => of(new AdvancedSearch.LoadAdvanceSearchDataFail(action.token, error))));

    }));

  @Effect()
  openCase$ = this.actions$.pipe(ofType<AdvancedSearch.AdvancedSearchOpenCase>(AdvancedSearch.ADVANCED_SEARCH_OPEN_CASE),
    map(action => {
      const matter: GridRowItemWrapper = {
        data: {
          branchID: action.payload.MAT_BranchID,
          app_Code: action.payload.Mat_APCode,
          fileID: action.payload.MAT_FileID ? action.payload.MAT_FileID : null,
          matterReferenceNo: action.payload.MAT_Ref,
          appID: action.payload.MAT_AppID ? action.payload.MAT_AppID : null,
          closed: action.payload.MAT_Closed,
          lastUsed: null,
          feeEarner: action.payload.MAT_Fee_Earner,
          reviewDate: null,
          clientName: action.payload.SAL_Account_Name,
          reviewNote: null,
          company_Name: null,
          matterDetails: action.payload.MAT_Details,
          matterCounter: action.payload.Id,
          ufnValue: action.payload.UFNValue,
          eBilling: action.payload.EBilling,
          isPlotMatter: action.payload.isPlotMatter,
          isPlotMasterMatter: action.payload.isPlotMasterMatter,
          isProspectMatter: action.payload.isProspectMatter,
          isLegalAid: action.payload.isLegalAid
        },
        selected: true,
        expanded: true,
        financeDetails: null
      };
      this.pageService.gotoOpenCase(matter);
      return new AdvancedSearch.CloseAdvancedSearch(action.token);
    }));

  @Effect()
  SaveBranchId$ = this.actions$.pipe(ofType<AdvancedSearch.CloseAdvancedSearch>(AdvancedSearch.CLOSE_ADVANCED_SEARCH),
    switchMap((action) =>
      this.store.select(getAdvancedSearchViewModeByToken(action.token)).pipe(
        take(1),
        switchMap((info) =>
          this.service.saveSelectedBranchId(info.branchId).pipe(map((response) =>
            new AdvancedSearch.AdvancedSearchSaveBranchSuccess(action.token, response)),
            catchError(error => of(new AdvancedSearch.AdvancedSearchSaveBranchFail(action.token, error))))
        ))));

  @Effect()
  AdvancedGridViewChange$ = this.actions$.pipe(ofType<AdvancedSearch.AdvancedSearchGridViewChange>
    (AdvancedSearch.ADVANCED_SEARCH_GRID_VIEW_CHANGE),
    map((action) => {

      return new AdvancedSearch.RequestAdvancedGridData(action.token);

    }));

  //   @Effect()
  //   ToggleSorting$ = this.actions$.pipe(ofType<AdvancedSearch.AdvancedSearchGridViewChange>
  // (AdvancedSearch.ADVANCED_SEARCH_GRID_VIEW_CHANGE),
  //   map((action) => {

  //     return new AdvancedSearch.RequestAdvancedGridData(action.token);

  //   }));


}
