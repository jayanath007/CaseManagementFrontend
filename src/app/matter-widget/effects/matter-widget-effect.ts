import { map, catchError, switchMap, tap, filter, take } from 'rxjs/operators';
import { MatterWidgetService } from '../services/matter-widget-services';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as Core from '../actions/core';
import { of } from 'rxjs';
import { DataRequest } from '../models/request';
import { GridRowItemWrapper } from '../../core/lib/matter';
import { MainMenuService } from '../../layout-desktop';
import { Store } from '@ngrx/store';
import { getUser } from '../../auth';
import { MenuItemOpenCaseMatterDatilsUpdate } from '../../layout-desktop/actions/main-menu';
import { MENU_ITEM_OPEN_CASE_MATTER_DATILS_UPDATE } from './../../layout-desktop/actions/main-menu';
@Injectable()
export class MatterWidgetEffects {

    constructor(private actions$: Actions, private service: MatterWidgetService, private mainMenuService: MainMenuService,
        private store: Store<any>) { }

    @Effect()
    initView$ = this.actions$.pipe(ofType<Core.InitMatterWidget>(Core.INIT_MATTER_WIDGET),
        map(action =>
            new Core.RequestData()
        ));

    @Effect()
    requestData$ = this.actions$.pipe(ofType<Core.RequestData>(Core.REQUEST_DATA),
        switchMap(() =>
            this.store.select(getUser).pipe(
                filter(user => !!(user && user.general)),
                take(1),
                map((info) =>
                    new DataRequest({
                        departmentId: null,
                        isInactiveFeeearners: false,
                        isOnlyOpen: true,
                        matterFilterType: 'Recent50',
                        isGeneralSearch: true,
                        searchText: null,
                        user: info.general.user
                    }, {
                        take: 4,
                        filter: null,
                        skip: 0,
                        sort: null
                    })
                ), map(request => new Core.LoadData(request)))));

    @Effect()
    lnitial$ = this.actions$.pipe(ofType<Core.LoadData>(Core.LOAD_DATA),
        switchMap(action =>
            this.service.loadMatterData(action.request).pipe(
                map((result) => new Core.LoadDataSuccess({ dataObject: result })),
                catchError((error) => of(new Core.LoadDataFail())))
        ));

    @Effect()
    refresh$ = this.actions$.pipe(ofType<Core.RefreshData>(Core.REFRESH_DATA),
        map(action => new Core.RequestData()));

    @Effect({ dispatch: false })
    goToOpenCase$ = this.actions$.pipe(ofType<Core.GoToOpenCase>(Core.GO_TO_OPEN_CASE),
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
      updateMatterData$ = this.actions$.pipe(ofType<MenuItemOpenCaseMatterDatilsUpdate>(MENU_ITEM_OPEN_CASE_MATTER_DATILS_UPDATE),
      map(action => new Core.UpdateAMatter(action.payload.matter))
      );
}
