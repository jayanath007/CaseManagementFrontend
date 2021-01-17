import { filter, map, switchMap, catchError, take, mergeMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, from, combineLatest } from 'rxjs';

import { MatterSearchService } from '../services/matter-search.service';
import { MatterRequest, MatterRequestForMatterCreate } from '../models/requests';
import * as Matter from '../actions/matters';
import { ViewChangeKind } from '../models/enums';
import {
  getMatterViewByToken,
  getMatterSelectedDepartmentByToken,
  getMatterCurrentHashByToken,
  getMatterPaginatorDefByToken,
  getMatterColumnDefByToken,
  getViewChangeKindByToken,
  getMatterCreateInputDataByToken
} from '../reducers';

import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import { TeamMemberOpenFrom } from '../../team-member-core/models/enums';
import { ChangeDepartmentOrFeeEranerState } from '../../team-member-core/actions/team-member';
import { InitTeamMember } from '../../team-member-core/actions/team-member';
import { AddUpdateMatterSuccess, ADD_UPDATE_MATTER_SUCCESS } from '../../matter-creation-core';
import { AddUpdateClientSuccess, ADD_UPDATE_CLIENT_SUCCESS } from '../../client-creation-core';
import { MainMenuService } from '../../layout-desktop';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MatterInfo } from '../../chaser-core/models/interfaces';

@Injectable()
export class MatterEffects {

  constructor(
    private actions$: Actions,
    private store: Store<any>, private service: MatterSearchService,
    private mainMenuService: MainMenuService
  ) { }

  @Effect()
  initNewView$ = this.actions$.pipe(ofType<Matter.InitMatterView>(Matter.INIT_MATTER_VIEW),
    mergeMap((action) =>
      combineLatest(this.store.select(getMatterViewByToken(action.token)),
        (state) => ({ state })).pipe(
          take(1),
          mergeMap((info) => {
            if (info.state.departments.length === 0) {
              if (action.payload.isPopup) {
                return from([new Matter.LoadMatterDataWithCurrentState(action.token)]);
              } else {
                return from([new Matter.LoadDepartments(action.token),
                new InitTeamMember('TEAM_MEMBER_DATA_MATTER_SEARCH', TeamMemberOpenFrom.MatterSearch)]
                  // new Matter.LoadMatterDataWithCurrentState(action.token)],
                );
              }
            }
            return from([]);
          }))));

  // ======= Matter creation ============
  @Effect()
  initMatterCreateNewView$ = this.actions$.pipe(ofType<Matter.InitMatterForMatterCreatePopup>(Matter.INIT_MATTER_CREATE_SEARCH_POPUP),
    mergeMap((action) =>
      combineLatest(this.store.select(getMatterViewByToken(action.token)),
        (state) => ({ state })).pipe(
          take(1),
          mergeMap((info) => {
            if (info.state.departments.length === 0) {
              if (action.payload.isPopup) {
                return from([new Matter.LoadMatterCreateDataWithCurrentState(action.token)]);
              } else {
                return from([new Matter.LoadDepartments(action.token),
                new InitTeamMember('TEAM_MEMBER_DATA_MATTER_SEARCH', TeamMemberOpenFrom.MatterSearch)]
                  // new Matter.LoadMatterDataWithCurrentState(action.token)],
                );
              }
            }
            return from([]);
          }))));

  @Effect()
  loadMatterCreateStateData$ =
    this.actions$.pipe(ofType<Matter.LoadMatterCreateDataWithCurrentState>(Matter.LOAD_MATTER_CREATE_DATA_WITH_CURRENT_STATE),
      switchMap((action) =>
        combineLatest(this.store.select(getMatterViewByToken(action.token)),
          this.store.select(getMatterSelectedDepartmentByToken(action.token)),
          this.store.select(getMatterCurrentHashByToken(action.token)),
          this.store.select(getMatterPaginatorDefByToken(action.token)),
          this.store.select(getMatterColumnDefByToken(action.token)),
          this.store.select(getViewChangeKindByToken(action.token)),
          this.store.select(getMatterCreateInputDataByToken(action.token)),
          (state, department, hash, paginatorDef, columnDef, viewChangeKind, inputData) =>
            ({ state, department, hash, paginatorDef, columnDef, viewChangeKind, inputData })).pipe(
              take(1),
              map((info) => {
                if (info.inputData) {
                  return new MatterRequestForMatterCreate(
                    info.inputData
                    , {
                      take: info.paginatorDef.itemPerPage,
                      filter: toODataFilter(info.columnDef),
                      skip: getPaginatorSkip(info.paginatorDef),
                      sort: toODataSort(info.columnDef)
                    }, info.hash);
                } else {
                  return new MatterRequestForMatterCreate(
                    {
                      BranchId: null,
                      ClientName: null,
                      ClientReference: null,
                      MatterDetails: null,
                      MatterReference: null,
                      searchText: info.state.sarchText
                    }
                    , {
                      take: info.paginatorDef.itemPerPage,
                      filter: toODataFilter(info.columnDef),
                      skip: getPaginatorSkip(info.paginatorDef),
                      sort: toODataSort(info.columnDef)
                    }, info.hash);
                }
              }
              ),
              map((request) => new Matter.LoadMatterGridDataBySearchField(action.token, request))),
      ));

  @Effect()
  loadMatterCreateGridData$ = this.actions$.pipe(ofType<Matter.LoadMatterGridDataBySearchField>
    (Matter.LOAD_MATTER_GRID_DATA_BY_SEARCH_FIELD),
    // .do((re) => console.log('loading matter grid data', re))
    switchMap((action) =>
      this.service.loadMatterCreationSearchData(action.request).pipe(
        map((result) => new Matter.MatterDataLoadSucess(action.token, { response: result, request: action.request })),
        catchError((error) => of(new Matter.MatterDataLoadFail(action.token, error))))
    ));
  // ======= Matter creation ============


  @Effect()
  refreshMatterData$ = this.actions$.pipe(ofType<Matter.RefreshMatter>(Matter.REFRESH_MATTER),
    map(action => {
      return new Matter.LoadMatterDataWithCurrentState(action.token);
    }));

  @Effect()
  loadDepartment$ = this.actions$.pipe(ofType<Matter.LoadDepartments>(Matter.LOAD_DEPARTMENTS),
    switchMap((action) =>
      this.service.getDepartments().pipe(
        map((result) => new Matter.LoadDepartmentSuccess(action.token, { items: result })),
        // .do(value => console.log('Department result:', value))
        catchError((error) => of(new Matter.LoadDepartmentFail(action.token, error))))
    ));

  @Effect()
  loadGridData$ = this.actions$.pipe(ofType<Matter.LoadMatterGridData>(Matter.LOAD_MATTER_GRID_DATA),
    // .do((re) => console.log('loading matter grid data', re))
    switchMap((action) =>
      this.service.loadMatterData(action.request).pipe(
        map((result) => new Matter.MatterDataLoadSucess(action.token, { response: result, request: action.request })),
        catchError((error) => of(new Matter.MatterDataLoadFail(action.token, error))))
    ));

  @Effect()
  loadCurrentStateData$ = this.actions$.pipe(ofType<Matter.LoadMatterDataWithCurrentState>(Matter.LOAD_MATTER_DATA_WITH_CURRENT_STATE),
    switchMap((action) =>
      combineLatest(this.store.select(getMatterViewByToken(action.token)),
        this.store.select(getMatterSelectedDepartmentByToken(action.token)),
        this.store.select(getMatterCurrentHashByToken(action.token)),
        this.store.select(getMatterPaginatorDefByToken(action.token)),
        this.store.select(getMatterColumnDefByToken(action.token)),
        this.store.select(getViewChangeKindByToken(action.token)),
        (state, department, hash, paginatorDef, columnDef, viewChangeKind) =>
          ({ state, department, hash, paginatorDef, columnDef, viewChangeKind })).pipe(
            take(1),
            map((info) =>
              new MatterRequest({
                departmentId: info.department ? info.department.groupId : null,
                isInactiveFeeearners: info.state.inactiveFeeEraners,
                includeClosedMatters: info.state.closeMatters,
                includeCompleteMatters: info.state.completedMatters,
                matterFilterType: info.state.isMLSEnableMatters ? 'MyMLSMatters' : info.state.activeView,
                isGeneralSearch: true,
                searchText: info.state.sarchText,
                user: info.state.selectedMember ? info.state.selectedMember.User : null,
                emailAddress: (info.state.inputData && info.state.inputData.emailList) ? info.state.inputData.emailList : null
              }, {
                take: info.paginatorDef.itemPerPage,
                filter: toODataFilter(info.columnDef),
                skip: getPaginatorSkip(info.paginatorDef),
                sort: toODataSort(info.columnDef)
              }, info.hash)
            ),
            map((request) => new Matter.LoadMatterGridData(action.token, request))),

    ));

  @Effect()
  $loadMatters = this.actions$.pipe(ofType<Matter.MatterViewChange>(Matter.MATTER_VIEW_CHANGE),
    map(action => {
      if (action.payload.isMatterCreate) {
        return new Matter.LoadMatterCreateDataWithCurrentState(action.token);
      }
      return new Matter.LoadMatterDataWithCurrentState(action.token);
    }));

  @Effect()
  $loadTeamMember = this.actions$.pipe(ofType<Matter.MatterViewChange>(Matter.MATTER_VIEW_CHANGE),
    mergeMap((action) =>
      combineLatest(this.store.select(getMatterViewByToken(action.token)),
        this.store.select(getMatterSelectedDepartmentByToken(action.token)),
        (state, department) => ({ state, department })).pipe(
          take(1),
          filter(info => info.state.viewChangeKind === ViewChangeKind.Department ||
            info.state.viewChangeKind === ViewChangeKind.InactiveFeeEarners ||
            info.state.viewChangeKind === ViewChangeKind.SearchText),
          map(info => {
            const inPutData = {
              departmentId: info.department ? info.department.groupId : null,
              isInactiveFeeEarners: info.state.inactiveFeeEraners,
              membereSearchText: null
            };
            if (!info.state.isPopup) {
              return new ChangeDepartmentOrFeeEranerState('TEAM_MEMBER_DATA_MATTER_SEARCH', { inPutData: inPutData });
            } else {
              if (action.payload.isMatterCreate) {
                return new Matter.LoadMatterCreateDataWithCurrentState(action.token);
              }
              return new Matter.LoadMatterDataWithCurrentState(action.token);
              // return of();
            }
          }
          ))));

  @Effect()
  loadMatterFinanceData$ = this.actions$.pipe(ofType<Matter.LoadMatterFinance>(Matter.LOAD_MATTER_FINANCE),
    switchMap((action) =>
      this.service.loadMatterFinanceData(action.selectedRowItem).pipe(
        map((result) => new Matter.LoadMatterFinanceSuccess(action.token, { selectedRowItem: action.selectedRowItem, billsData: result })),
        catchError((error) => of(new Matter.LoadMatterFinanceFail(action.token, error))))
    ));

  @Effect({ dispatch: false })
  goToOpenCase$ = this.actions$.pipe(ofType<Matter.GoToOpenCase>(Matter.GO_TO_OPEN_CASE),
    switchMap((action) =>
      this.service.getMatterInfoByCaseIdentity(action.matter).pipe(tap(infor => {
        this.mainMenuService.gotoOpenCase({
          ...action.matter, data: {
            ...action.matter.data, isPlotMatter: infor.isPlotMatter,
            isPlotMasterMatter: infor.isPlotMasterMatter
          }
        } as GridRowItemWrapper);
      }))
    ));

  @Effect()
  getMatterInfoAndExitMatterSearchPopup$ = this.actions$.pipe(
    ofType<Matter.GetMatterInfoAndExitMatterSearchPopup>(Matter.GET_MATTER_INFO_AND_EXIT_MATTER_SEARCH_POPUP),
    switchMap((action) =>
      this.service.getMatterInfoByCaseIdentity(action.matter).pipe(
        map(infor => {
          const selectedmatter: MatterInfo = {
            ClientName: action.matter.data.clientName,
            FeeEarner: action.matter.data.feeEarner,
            AppCode: action.matter.data.app_Code,
            MatterReferenceNo: action.matter.data.matterReferenceNo,
            BranchID: action.matter.data.branchID,
            AppID: action.matter.data.appID,
            FileID: action.matter.data.fileID,
            var1: action.matter.data.var1,
            var2: action.matter.data.var2,
            var3: action.matter.data.var3,
            selected: false,
            eBilling: action.matter.data.eBilling,
            matterDetails: action.matter.data.matterDetails,
            RateCategory: action.matter.data.rateCategory,
            isProspectMatter: action.matter.data.isProspectMatter,
            isLegalAid: action.matter.data.isLegalAid,
            isPlotMasterMatter: infor.isPlotMasterMatter
          };
          action.closePopup.emit(selectedmatter);
          return new Matter.ExitMatterSearchPopup(action.token);
        }),
        catchError(error => of(new Matter.MatterDataLoadFail(action.token, error)))
      )
    ));

  @Effect()
  rowExpanData$ = this.actions$.pipe(ofType<Matter.LoadRowExpanData>(Matter.LOAD_ROW_EXPAN_DATA),
    filter((action) => !action.payload.selectedRowItem.expanded),
    map((action) => new Matter.LoadMatterFinance(action.token, action.payload.selectedRowItem)));


  @Effect()
  matterSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateMatterSuccess>(ADD_UPDATE_MATTER_SUCCESS),
    switchMap(() =>
      this.store.select(getMatterViewByToken('MatterSearchPage')).pipe(
        map(state => ({ state })),
        take(1),
        filter(info => !!info.state),
        map(() => new Matter.RefreshMatter('MatterSearchPage')))));

  @Effect()
  clientSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateClientSuccess>(ADD_UPDATE_CLIENT_SUCCESS),
    switchMap(() =>
      this.store.select(getMatterViewByToken('MatterSearchPage')).pipe(
        map(state => ({ state })),
        take(1),
        filter(info => !!info.state),
        map(() => new Matter.RefreshMatter('MatterSearchPage')))));


  @Effect()
  addReferralNote$ = this.actions$.pipe(ofType<Matter.AddUpdateReviewData>(Matter.ADD_UPDATE_REVIEW_DATA),
    switchMap((action) =>
      this.service.addReferralNoteData(action.reviewData).pipe(
        map((result) => new Matter.AddUpdateReviewDataSuccess(action.token, { response: result })),
        catchError((error) => of(new Matter.AddUpdateReviewDataFail(action.token, error))))
    ));

  @Effect()
  addReferralNoteSuccess$ = this.actions$.pipe(ofType<Matter.AddUpdateReviewDataSuccess>(Matter.ADD_UPDATE_REVIEW_DATA_SUCCESS),
    map(action => {
      return new Matter.RefreshMatter(action.token);
    }));

  @Effect()
  getReferralNote$ = this.actions$.pipe(ofType<Matter.GetReviewNotes>(Matter.GET_REVIEW_DATA),
    switchMap((action) =>
      this.service.getReviewNotes(action.request).pipe(
        map((result) => new Matter.GetReviewNotesSuccess(action.token, { response: result })),
        catchError((error) => of(new Matter.GetReviewNotesFail(action.token))))
    ));

}
