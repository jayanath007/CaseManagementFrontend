
import { catchError, map, switchMap, filter, take } from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import * as Core from '../actions/core';
import { Effect, Actions, ofType } from '@ngrx/effects';;
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { of, combineLatest } from 'rxjs';
import { GeneralPopupService } from '../servicers/general-popup.service';
import { toODataFilter, getPaginatorSkip, toODataSort } from '../../core/lib/grid-helpers';
import {
  getGeneralColumnDefByToken, getclientPaginatorDefByToken, getGeneralSearchTextByToken,
  getGeneralSitePathByToken, getIsFrontEndFilterByToken, getInputRequest
} from '../reducers';
import { GeneralSearchRequest } from './../models/requests';

@Injectable()
export class GeneralPopupEffects {

  constructor(
    private actions$: Actions,
    private store: Store<any>, private generalPopupService: GeneralPopupService,
    private dialog: MatDialog
  ) { }


  @Effect()
  loadPopupStateData$ = this.actions$.pipe(ofType<Core.InitGeneralPopup>(Core.INIT_GENERAL_POPUP),
    map(action => new Core.LoadGeneralPopupData(action.token)));


  @Effect()
  changePage$ = this.actions$.pipe(ofType<Core.ChangePage>(Core.CHANGE_PAGE),
    map(action => new Core.LoadGeneralPopupData(action.token)));

  // @Effect()
  // applyFrontEntFilter = this.actions$.pipe(ofType<Core.LoadGeneralPopupDataSuccess>(Core.LOAD_GENERAL_POPUP_DATA_SUCCESS),
  //   switchMap(action => this.store.select(getGeneralSearchTextByToken(action.token)).pipe(
  //     map(searchText => ({ searchText, token: action.token }))
  //   )),
  //   map(action => new Core.GeneralSearchTextChange(action.token, { searchText: action.searchText })));

  @Effect()
  searchTextUpdate$ = this.actions$.pipe(ofType<Core.GeneralSearchTextChange>(Core.GENERAL_SEARCH_TEXT_CHANGE),
    switchMap((action) => {
      return this.store.select(getIsFrontEndFilterByToken(action.token)).pipe(map((data) => {
        return {
          isFrontEndFilter: data,
          action: action
        };
      }), take(1));
    }),
    filter((infor) => { return !infor.isFrontEndFilter; }),
    map((infor) => {
      return new Core.LoadGeneralPopupData(infor.action.token);
    }));

  @Effect()
  loadData$ = this.actions$.pipe(ofType<Core.LoadGeneralPopupData>(Core.LOAD_GENERAL_POPUP_DATA),
    switchMap((action) =>
      combineLatest(
        this.store.select(getclientPaginatorDefByToken(action.token)),
        this.store.select(getGeneralColumnDefByToken(action.token)),
        this.store.select(getGeneralSearchTextByToken(action.token)),
        this.store.select(getGeneralSitePathByToken(action.token)),
        this.store.select(getIsFrontEndFilterByToken(action.token)),
        this.store.select(getInputRequest(action.token)),
        (paginatorDef, columnDef, searchText, sitePath, isFrontEndFilter, request) =>
          ({ paginatorDef, columnDef, searchText, sitePath, isFrontEndFilter, request })).pipe(
            take(1),
            map((info) => {
              if (info.request) {
                return info.request;
              } else {
                return new GeneralSearchRequest(
                  info.searchText,
                  info.sitePath,
                  info.isFrontEndFilter,
                  {
                    Take: info.paginatorDef.itemPerPage,
                    //  Filter: toODataFilter(info.columnDef),
                    Skip: getPaginatorSkip(info.paginatorDef),
                    // Sort: toODataSort(info.columnDef)
                  });
              }

            }
            ),
            switchMap((data) =>
              this.generalPopupService.getGeneralPopupData(data).pipe(map((response) =>
                new Core.LoadGeneralPopupDataSuccess(action.token, { generalPopupList: response })),
                catchError(error => of(new Core.LoadGeneralPopupDataFail(action.token))))
            ))));

}
