import { ClientPopupType } from './../models/enums';
import { catchError, switchMap, take, map, filter } from 'rxjs/operators';
import { ClientPopupRequest } from '../models/requests';
import { ClientSearchKind } from '../models/enums';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of, from, combineLatest } from 'rxjs';
import { ClientSearchRequest } from '../models/requests';
import * as Core from '../actions/core';
import { getPaginatorSkip, toODataFilter, toODataSort } from '../../core/lib/grid-helpers';
import { ClientSearchService } from '../services/client-search.service';
import {
  getClientSearchTextByToken, getClientSearchClientColumnDefByToken,
  getClientSearchClientPaginatorDefByToken, getClientSearchViewByToken,
  getClientPopupInutDataByToken, getClientIsPopupInutByToken, getClientByClietRef
} from '..';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { AddUpdateClientSuccess, ADD_UPDATE_CLIENT_SUCCESS } from '../../client-creation-core';
import { AddUpdateMatterSuccess, ADD_UPDATE_MATTER_SUCCESS } from '../../matter-creation-core';

@Injectable()
export class ClientSearchEffects {
  constructor(
    private actions$: Actions,
    private store: Store<any>, private clientSearchService: ClientSearchService,
    private dialog: MatDialog
  ) { }

  @Effect()
  clientSearchSubmit$ = this.actions$.pipe(ofType<Core.ClientSearchSubmit>(Core.CLIENT_SEARCH_SUBMIT),
    switchMap((action: Core.ClientSearchSubmit) =>
      combineLatest(
        this.store.select(getClientSearchTextByToken(action.token)),
        this.store.select(getClientIsPopupInutByToken(action.token)),
        this.store.select(getClientPopupInutDataByToken(action.token)),
        (searchText, ispopup, popupInput) =>
          ({ searchText, ispopup, token: action.token, payload: action.payload, popupInput: popupInput })
      ).pipe(
        take(1))
    ), switchMap<any, any>((info) => {
      if (info.ispopup === true && info.popupInput && info.popupInput.popupType === ClientPopupType.OpportunityClientSearch) {
        return of(new Core.LoadOpportunityPopupClientData(info.token));
      } else if (info.ispopup === true) {
        return of(new Core.LoadPopupClientData(info.token));
      } else if (info.payload.kind === ClientSearchKind.SearchText && info.searchText.trim().length < 3) {
        return of(new Core.ClientSearchTextChangeReject(info.token));
      } else if (info.searchText && info.searchText.trim().length >= 3) {
        return of(new Core.ClientSearchSubmitSuccess(info.token));
      } else {
        return of(new Core.ClientSearchTextChangeEmpty(info.token));
      }
    }));

  @Effect()
  GridRefresh$ = this.actions$.pipe(ofType<Core.GridRefresh>(Core.GRID_REFRESH),
    switchMap(action => {
      return of(new Core.ClientSearchSubmitSuccess(action.token));
    }));

  @Effect()
  loadCurrentStateData$ = this.actions$.pipe(ofType<Core.ClientSearchSubmitSuccess>(Core.CLIENT_SEARCH_SUBMIT_SUCCESS),
    switchMap((action) =>
      combineLatest(
        // this.store.select(getClientSearchViewByToken(action.token)),
        this.store.select(getClientSearchClientPaginatorDefByToken(action.token)),
        this.store.select(getClientSearchClientColumnDefByToken(action.token)),
        this.store.select(getClientSearchTextByToken(action.token)),
        (paginatorDef, columnDef, sarchText) =>
          ({ paginatorDef, columnDef, sarchText })).pipe(
            take(1),
            filter(info => info.sarchText && info.sarchText.trim().length >= 3),
            map((info) =>
              new ClientSearchRequest(
                info.sarchText
                , {
                  Take: info.paginatorDef.itemPerPage,
                  Filter: toODataFilter(info.columnDef),
                  Skip: getPaginatorSkip(info.paginatorDef),
                  Sort: toODataSort(info.columnDef)
                })
            ),
            map((request) => new Core.LoadClientSearchGridData(action.token, { request: request })))
    ));

  @Effect()
  clientSearchReject$ = this.actions$.pipe(ofType<Core.ClientSearchTextChangeReject>(Core.CLIENT_SEARCH_TEXT_CHANGE_REJECT),
    switchMap((action: Core.ClientSearchTextChangeReject) => {
      const dialogData: InforDialogData = {
        content: {
          title: ' Message . . .',
          message: `Please enter at least 3 characters to search`
        },
        contentParams: { displayName: '' },
        data: { messageType: 'alert' }
      };

      const deleteDialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'

      });

      return of();
    }));

  @Effect()
  loadGridData$ = this.actions$.pipe(ofType<Core.LoadClientSearchGridData>(Core.LOAD_CLIENT_SEARCH_GRID_DATA),
    // .do((re) => console.log('loading matter grid data', re))
    switchMap((action: Core.LoadClientSearchGridData) =>
      this.clientSearchService.getSearchClients(action.payload.request).pipe(
        map((result) => new Core.LoadClientSearchGridDataSuccess(action.token, { responce: result })),
        catchError((error) => of(new Core.LoadClientSearchGridDataFail(action.token, error))))
    ));


  // @Effect()
  // GetSummeryData$ = this.actions$.ofType<Core.LoadSummery>(Core.LOAD_SUMMERY)
  //     .switchMap(action =>
  //       if (action && action.payload.inputData && action.payload.inputData.dpsSubject) {
  //         return from([new Chaser.LoadMaterDataFromMailSubject(action.token, { dpsSubject: action.payload.inputData.dpsSubject }),
  //         new Chaser.LoadFeeEarnerList(action.token),
  //         new Chaser.FeeEarnerRateValueDisable(action.token)]);
  //     } else {
  //         return from([new Chaser.LoadFeeEarnerList(action.token),
  //         new Chaser.FeeEarnerRateValueDisable(action.token)]);
  //     }

  @Effect()
  loadPopupStateData$ = this.actions$.pipe(ofType<Core.LoadPopupClientData>(Core.LOAD_POPUP_CLIENT_DATA),
    switchMap((action) =>
      combineLatest(
        this.store.select(getClientSearchClientPaginatorDefByToken(action.token)),
        this.store.select(getClientSearchClientColumnDefByToken(action.token)),
        this.store.select(getClientPopupInutDataByToken(action.token)),
        this.store.select(getClientSearchTextByToken(action.token)),
        (paginatorDef, columnDef, popupInput, searchText) =>
          ({ paginatorDef, columnDef, popupInput, searchText })).pipe(
            take(1),
            map((info) =>
              new ClientPopupRequest({
                ...info.popupInput,
                searchText: info.searchText,
                popupType: ClientPopupType.GeneralClientSearch,
                popupPara: {
                  firstName: '',
                  lastName: '',
                  companyName: '',
                  email1: '',
                }
              },
                {
                  Take: info.paginatorDef.itemPerPage,
                  Filter: toODataFilter(info.columnDef),
                  Skip: getPaginatorSkip(info.paginatorDef),
                  Sort: toODataSort(info.columnDef)
                })
            ),
            map((request) => new Core.LoadClientSearchPopupData(action.token, { request: request })))
    ));
  @Effect()
  loadOpportunityPopupStateData$ = this.actions$.pipe(ofType<Core.LoadOpportunityPopupClientData>(Core.LOAD_OPPORTUNITY_POPUP_CLIENT_DATA),
    switchMap((action) =>
      combineLatest(
        this.store.select(getClientSearchClientPaginatorDefByToken(action.token)),
        this.store.select(getClientSearchClientColumnDefByToken(action.token)),
        this.store.select(getClientPopupInutDataByToken(action.token)),
        this.store.select(getClientSearchTextByToken(action.token)),
        (paginatorDef, columnDef, popupInput, searchText) =>
          ({ paginatorDef, columnDef, popupInput, searchText })).pipe(
            filter(info => !!info.popupInput),
            take(1),
            map((info) =>
              new ClientPopupRequest({
                clientRef: info.popupInput.clientRef,
                searchText: info.searchText,
                branchId: info.popupInput.branchId,
                clientName: info.popupInput.clientName,
                isOpportunityEdit: info.popupInput.popupPara.isOpportunityEdit,
                popupType: ClientPopupType.OpportunityClientSearch,
                popupPara: {
                  firstName: info.popupInput.popupPara ? info.popupInput.popupPara.firstName : '',
                  lastName: info.popupInput.popupPara ? info.popupInput.popupPara.lastName : '',
                  companyName: info.popupInput.popupPara ? info.popupInput.popupPara.companyName : '',
                  // address: '',
                  email1: info.popupInput.popupPara ? info.popupInput.popupPara.email1 : '',
                }
              },
                {
                  Take: info.paginatorDef.itemPerPage,
                  Filter: toODataFilter(info.columnDef),
                  Skip: getPaginatorSkip(info.paginatorDef),
                  Sort: toODataSort(info.columnDef)
                })
            ),
            map((request) => new Core.LoadClientSearchPopupData(action.token, { request: request })))
    ));
  @Effect()
  initClientSerch$ = this.actions$.pipe(ofType<Core.InitClientSearch>(Core.INIT_CLIENT_SEARCH),
    switchMap(action => {
      if (action.payload && action.payload.clientSearchData && action.payload.clientSearchData.popupType &&
        action.payload.isPopup === true && action.payload.clientSearchData.popupType === ClientPopupType.OpportunityClientSearch) {
        return from([new Core.LoadOpportunityPopupClientData(action.token)]);
      } else if (action.payload.isPopup === true) {
        return from([new Core.LoadPopupClientData(action.token)]);
      } else {
        return from([]); // of();
      }
    }));

  @Effect()
  loadPopupData$ = this.actions$.pipe(ofType<Core.LoadClientSearchPopupData>(Core.LOAD_CLIENT_SEARCH_POPUP_DATA),
    switchMap((action: Core.LoadClientSearchPopupData) =>
      this.clientSearchService.getSearchClientsPopup(action.payload.request).pipe(
        map((result) => new Core.LoadClientSearchPopupDataSuccess(action.token, { responce: result })),
        catchError((error) => of(new Core.LoadClientSearchPopupDataFail(action.token, error))))
    ));
  @Effect()
  clientSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateClientSuccess>(ADD_UPDATE_CLIENT_SUCCESS),
    switchMap(() =>
      this.store.select(getClientSearchViewByToken('ClientSearchPage')).pipe(
        map(state => ({ state })),
        take(1),
        filter(info => !!info.state),
        map(() => new Core.GridRefresh('ClientSearchPage')))));

  @Effect()
  matterSaveSuccess$ = this.actions$.pipe(ofType<AddUpdateMatterSuccess>(ADD_UPDATE_MATTER_SUCCESS),
    switchMap(() =>
      this.store.select(getClientSearchViewByToken('ClientSearchPage')).pipe(
        map(state => ({ state })),
        take(1),
        filter(info => !!info.state),
        map(() => new Core.GridRefresh('ClientSearchPage')))));

  @Effect()
  expandClientRow$ = this.actions$.pipe(ofType<Core.ExpandClientRow>(Core.TOGGLE_CLIENT_ROW_EXPAND),
    filter(action => action.payload.client.data.matterCount > 0 && !action.payload.client.data.matterViewModel),
    map((action) => new Core.GetMatters(action.token, action.payload.client.data.clientRef)));

  @Effect()
  ChangeMatterPage$ = this.actions$.pipe(ofType<Core.ChangeMatterPage>(Core.CHANGE_MATTERS_PAGE),
    map((action) => new Core.GetMatters(action.token, action.clientRef)));

  @Effect()
  getMatters$ = this.actions$.pipe(ofType<Core.GetMatters>(Core.GET_MATTERS),
    switchMap(action =>
      // this.store.select(getClientSearchTextByToken(action.token))
      // .pipe(map(searchText => ({ token: action.token, clientRef: action.clientRef, searchText })))
      combineLatest(
        this.store.select(getClientByClietRef(action.token, action.clientRef)),
        this.store.select(getClientSearchTextByToken(action.token)),
        (client, searchText) =>
          ({ clientRef: client.data.clientRef, paginatorDef: client.matterPaginatorDef, searchText, token: action.token })
      ).pipe(
        take(1))
    ),
    switchMap((info) => {
      const request = new ClientSearchRequest(
        info.searchText
        , {
          Take: info.paginatorDef.itemPerPage,
          Filter: null,
          Skip: getPaginatorSkip(info.paginatorDef),
          Sort: null
        },
        info.clientRef);
      return this.clientSearchService.getMatters(request).pipe(
        map((result) => new Core.GetMattersSuccess(info.token, info.clientRef, result.data)),
        catchError((error) => of(new Core.GetMattersFail(info.token, info.clientRef))));
    }));

}
