import { getGeneralAllMenueItems } from './../reducers/index';
import { MenuGroups } from './../models/enums';

import { share, take, filter, mergeMap, last, tap, catchError, switchMap, map } from 'rxjs/operators';
import { MainMenuService } from '../services/main-menu.service';
import { OpenCaseMenueData } from '../../core/lib/open-case';
import { getOpenCaseMenueItems, getRestOfOpenCaseMenuItemsById, getVisibleOutlet } from '../reducers';
import { combineLatest, from as fromPromise, of, empty, from, merge } from 'rxjs';
import { Injectable, Inject } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as Menus from '../actions/main-menu';
import * as SideMenus from '../actions/right-sidenav';
import * as Core from '../../core/lib/actions';
import * as PostOffice from '../../post-office-core/actions/core';
import { getMenuItemById, getDatabases } from '../reducers';

import { LocalStorageKey } from '../../core';
import { RouterOutlets } from '../models/enums';
import { DEFAULT_HOME_URL } from '../models/tokens';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { InforDialogData, InforDialogComponent } from '../../shared';
import { MatDialog } from '@angular/material';
import { CloseMenuOpenCaseTap } from '../../workflow-menu-core';
import { WorkflowSessionManagerService } from '../../workflow-desktop';
import { LayoutService } from '../services/layout.service';
import { getDefaultMessageFormat } from '../../utils/organizer';
import { AuthInfoStateService } from './../../auth';
import { Module } from '../../core/lib/app-settings';
import { GetUserGeneralDataSuccess, GET_USER_GENERAL_DATA_SUCCESS } from '../../auth/actions/auth';
import { Utilities } from '../../utils/utilities';
import { MenuTabClose } from '../../core/lib/actions';
import { GridRowItemWrapper } from '../../core/lib/matter';


@Injectable()
export class MainMenuEffects {
    constructor(private actions$: Actions, private store: Store<any>, private dialog: MatDialog,
        private router: Router, @Inject(DEFAULT_HOME_URL) private defualtRoute: string, private mainMenuService: MainMenuService,
        private layoutService: LayoutService
        , private urlPopupService: UrlPopupService, private sessionManager: WorkflowSessionManagerService,
        public authHelper: AuthInfoStateService) {

        console.log(defualtRoute + '   defualtRoute');
    }

    // @Effect()
    // navigateToHome$ = this.actions$.ofType<Menus.NavigateToHome>(Menus.NAVIGATE_TO_HOME)
    //      .do(() => this.router.navigateByUrl(this.defualtRoute, { replaceUrl: true }))
    //     .map(() => new Menus.AddToViewStack(RouterOutlets.Dashboard));





    @Effect()
    fetMenuOpenCaseData$ = this.actions$.pipe(ofType<Menus.GetMenuOpenCaseData>(Menus.GET_MENU_OPEN_CASE_DATA),
        switchMap(action => this.authHelper.getUser().pipe(map(user => ({ user, action })))),
        switchMap(({ user, action }) =>
            this.layoutService.getOpenCaseMaterDataFromMailSubjectOrDiaryId(action.payload, user.general.companyCode).pipe(
                map((data) => {
                    this.mainMenuService.gotoOpenCase(data);
                    return new Menus.GetMenuOpenCaseDataSuccsess({ inputData: data });
                }),
                catchError(error => of(new Menus.GetMenuOpenCaseDataFail({}))))
        ));


    @Effect()
    navigateToHome$ = this.actions$.pipe(ofType<Menus.NavigateToHome>(Menus.NAVIGATE_TO_HOME),
        tap(() => {
            this.router.navigate([{ outlets: { main: null } }]);
            // this.router.navigateByUrl(this.defualtRoute, { replaceUrl: true });
        }),
        map(() => new Menus.AddToViewStack(RouterOutlets.Dashboard)));

    @Effect()
    navigateToHomeAndClear$ = this.actions$.pipe(ofType<Menus.NavigateToHomeAndClearRoute>(Menus.NAVIGATE_TO_HOME_AND_CLEAR_ROUTE),
        tap(() => {
            // this.router.navigate([{ outlets: { main: null } }]);
            this.router.navigateByUrl(this.defualtRoute, { replaceUrl: true });
        }),
        map(() => new Menus.AddToViewStack(RouterOutlets.Dashboard)));

    @Effect()
    navigateToView = this.actions$.pipe(ofType<Menus.NavigateToView>(Menus.NAVIGATE_TO_VIEW),
        mergeMap((action) =>
            this.store.select(getMenuItemById(action.menuId)).pipe(take(1), map((item) => ({ item: item, route: action.parentRoute })))
        ), filter(({ item }) => !!item),
        map(({ item, route }) => new Menus.MenuItemClick(item, route)));


    @Effect({ dispatch: false })
    navigatedByRoute$ = this.actions$.pipe(ofType<Menus.NavigateByRoute>(Menus.NAVIGATE_BY_ROUTE),
        mergeMap(action => {
            console.log('01', action.parentRoute);
            return fromPromise(this.handleDesktopRoute(action.routeLink, RouterOutlets.Main, action.parentRoute)).pipe(
                filter(value => value !== false),
                map(() => new Menus.AddToViewStack(RouterOutlets.Main)));
        }));

    @Effect()
    handleMainRoute$ = this.actions$.pipe(ofType<Menus.MenuItemClick<any>>(Menus.MAIN_MENU_ITEM_CLICK),
        filter(action => action.item.outlet === RouterOutlets.Main),
        map((action) => ({ item: action.item, parentRoute: action.parentRoute })),
        filter(({ item }) => item.routerLink),
        switchMap(({ item, parentRoute }) => {


            return fromPromise(this.handleDesktopRoute(item.routerLink, item.outlet, parentRoute)).pipe(
                tap((result) => console.log('router navigation events------', result)),
                filter(value => value !== false),
                map(() => new Menus.AddToViewStack(RouterOutlets.Main)),
                catchError((error) => {
                    console.error(error);
                    return empty();
                }));
        }

        ));
    @Effect()
    handleStickyRoute$ = this.actions$.pipe(ofType<Menus.MenuItemClick<any>>(Menus.MAIN_MENU_ITEM_CLICK),
        filter(action => [RouterOutlets.Mail, RouterOutlets.Dashboard].indexOf(action.item.outlet) > -1),
        map((action) => ({ item: action.item, parentRoute: action.parentRoute })),
        switchMap(({ item, parentRoute }) => {
            if (!this.checkOutletIsLoaded(item.outlet)) {
                return fromPromise(this.handleDesktopRoute(item.routerLink, item.outlet, parentRoute)).pipe(
                    filter(value => value !== false),
                    map(() => new Menus.AddToViewStack(item.outlet)),
                    catchError((error) => {
                        console.error(error);
                        return empty();
                    }));
            }
            return of(new Menus.AddToViewStack(item.outlet));
        }));




    @Effect()
    menuTabClose$ = this.actions$.pipe(ofType<Core.MenuTabClose<OpenCaseMenueData>>(Core.MENU_TAB_CLOSE),
        switchMap((action: Core.MenuTabClose<OpenCaseMenueData>) => {

            return combineLatest(
                this.store.select(getRestOfOpenCaseMenuItemsById(action.payload.item.id)),
                this.store.select(getVisibleOutlet),
                this.store.select(getOpenCaseMenueItems),
                (val, outlet, openCaseMenueItems) => {

                    // combineLatest(this.store.select(getOpenCaseMenueItems)).take(1).subscribe((data) => {
                    sessionStorage.setItem(LocalStorageKey.OpenCaseMenuItems,
                        JSON.stringify(openCaseMenueItems.filter(p => p.hidden === false)));
                    // });
                    if (outlet !== RouterOutlets.Main) {

                        const url = this.router.url;
                        const start = url.indexOf('(main') + 6;
                        const end = url.indexOf('//');
                        const removes = url.substring(start, end);
                        const newUrl = url.replace(removes, 'matter-search/home/index');
                        this.router.navigateByUrl(newUrl, { replaceUrl: true });

                    } else {

                        if (val.length) {
                            if (action.payload.item.isSelected) {
                                this.mainMenuService.navigateById(val[action.payload.nextIndex].id);
                            }
                            return new Menus.GoToNextOpenCaseTabSuccess();
                        } else if (action.payload.item.isSelected) {
                            return new Menus.NavigateToHomeAndClearRoute();
                        }
                    }

                    return new Core.EmptyTabCloseAction({ item: null });

                }).pipe(take(1));
        }));


    @Effect({ dispatch: false })
    goToNextOpenCase$ = this.actions$.pipe(ofType<Menus.GoToNextOpenCaseTab>(Menus.GO_TO_NEXT_OPEN_CASE_TAB),
        tap(() => console.log('main menue effect goToNextOpenCaseTab')),
        switchMap((action: Menus.GoToNextOpenCaseTab) => {
            this.mainMenuService.gotoOpenCase(action.OpenCase.matterData);
            return of(new Menus.GoToNextOpenCaseTabSuccess());
        }));


    @Effect({ dispatch: false })
    updateMenuItem$ = this.actions$.pipe(ofType<Menus.UpdateMenuItem>(Menus.UPDATE_MENU_ITEM),
        tap((action) => {
            combineLatest(this.store.select(getOpenCaseMenueItems)).pipe(take(1)).subscribe((data) => {
                sessionStorage.setItem(LocalStorageKey.OpenCaseMenuItems, JSON.stringify(data[0].filter(p => p.hidden === false)));
            });
        }));

    @Effect()
    closeHeaderBarItem$ = this.actions$.pipe(ofType<Menus.RunExitLogicAndClose>(Menus.RUN_EXIT_LOGIC_AND_CLOSE),
        filter(action => action.item.group === MenuGroups.HeaderBarItem && action.item.isSelected),
        map((action) => new Menus.NavigateToHomeAndClearRoute()));

    @Effect()
    runExitLogic$ = this.actions$.pipe(ofType<Menus.RunExitLogicAndClose>(Menus.RUN_EXIT_LOGIC_AND_CLOSE),
        filter(action => action.item.group === MenuGroups.OpenCase),
        tap((action) => console.log(action)),
        mergeMap((action) => {
            const appId = action.item.data.matterData.data.appID;
            const fileId = action.item.data.matterData.data.fileID;
            const branchId = action.item.data.matterData.data.branchID;
            return this.sessionManager
                .getSession(appId, fileId, branchId).pipe(
                    filter((session) => !!session),
                    map((session =>
                        ({ session: session, action: action, appId, fileId, branchId }))),
                    take(1));
        }),
        mergeMap(info => {
            const run = info.session.runExitLogic().pipe(share());
            const next = from([new Core.MenuTabClose({ item: info.action.item, nextIndex: info.action.nextIndex }),
            new CloseMenuOpenCaseTap(info.action.item.token)]);

            const status = info.session.exitLogicStatus.pipe(
                map((st) => new Core.FileLogicStatsChange('EXIT', info.appId, info.fileId, info.branchId, st, info.action.item)));

            const cmpAction = new Menus.FileExitLogicComplete(info.appId, info.fileId, info.branchId, next);
            const complete = run.pipe(last(), map(() => cmpAction), catchError(() => of(cmpAction)));
            return merge(status, complete);
        }));

    @Effect()
    closeAfterExitLogic$ = this.actions$.pipe(ofType<Menus.FileExitLogicComplete>(Menus.FILE_EXIT_LOGIC_COMPLETE),
        tap(info => this.sessionManager.destroyFileSession(info.appId, info.fileId, info.branchId)),
        switchMap((action) => {
            return action.next;
        }));


    // @Effect()
    // menuTabClose$ = this.actions$.ofType<Core.MenuTabClose<OpenCaseMenueData>>(Core.MENU_TAB_CLOSE)
    //     .switchMap((action: Core.MenuTabClose<OpenCaseMenueData>) => {
    //         combineLatest(this.store.select(getOpenCaseMenueItems)).take(1).subscribe((data) => {
    //             localStorage.setItem(LocalStorageKey.OpenCaseMenuItems, JSON.stringify(data[0]));
    //         });
    //         return this.store.select(getRestOfOpenCaseMenuItemsById(action.item.id))
    //             .map((CaseMenuItems) => CaseMenuItems)
    //             .take(1);
    //     })
    //     .switchMap((tabInfo) => {
    //         if (tabInfo.length) {
    //             console.log('tabInfo1', tabInfo);
    //             return this.store.select(getPageInputDataByTargetToken(tabInfo[0].token))
    //                 .take(1)
    //                 .do((CaseMenuItem) => console.log('getPageInputDataByTargetToken', CaseMenuItem))
    //                 .map((CaseMenuItem) => {
    //                     return new Menus.GoToNextOpenCaseTab(CaseMenuItem);
    //                 });
    //         } else {
    //             return of(new Menus.NavigateToHome());
    //         }
    //     });

    @Effect({ dispatch: false })
    openCase$ = this.actions$.pipe(ofType<Menus.GoToOpenCasePage>(Menus.GO_TO_OPEN_CASE_PAGE),
        tap((action) => console.log('main menue effect')),
        tap((action) => {
            console.log('main menue effect-', action);
            const token = action.inputData.openCaseToken;
            const path = [{ outlets: { desktop: ['desktop', { outlets: { mail: ['open-case', 'home', token] } }] } }];
            this.router.navigate(path);
        }));

    @Effect()
    openMailPopup$ = this.actions$.pipe(ofType<Menus.OpenMailPopup>(Menus.OPEN_MAIL_POPUP),
        switchMap((action: Menus.OpenMailPopup) => {
            return combineLatest(
                this.mainMenuService.getMailDraftId(action.payload.draftIdRequest),
                this.mainMenuService.getEmailList(action.payload.draftIdRequest.branchID,
                    action.payload.draftIdRequest.appID, action.payload.draftIdRequest.fileID),
                (result, data) => {
                    if (result.data && result.data.id) {
                        if (data) {
                            localStorage.setItem(
                                LocalStorageKey.SECommandEmailList,
                                JSON.stringify(data.contactList.filter(val => !!val.email).map(val => {
                                    return {
                                        contactType: val.contactType,
                                        recipient: { emailAddress: { address: val.email, name: val.name || val.email } }
                                    };
                                }))
                            );
                        }
                        const encodeId = encodeURIComponent(result.data.id);
                        const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                        const opened = this.urlPopupService.openWithUrlPoup(urlPath, result.data.id, false, false);
                        if (!opened) {
                            this.warningMessage();
                        }
                        return new Menus.OpenMailPopupSuccess(action.token);
                    } else {

                        const errors = result.detailStatus.map(function (item) {
                            return item['message'] + '\r\n';
                        });

                        return new Menus.OpenMailPopupFail(action.token, { error: errors });
                    }
                }).pipe(
                    catchError(error => of(new Menus.OpenMailPopupFail(action.token, { error: error }))));
            // return this.mainMenuService.getMailDraftId(action.payload.draftIdRequest)
            //     .map((result) => {
            //         if (result.data && result.data.id) {
            //             const encodeId = encodeURIComponent(result.data.id);
            //             const urlPath = '/mail-item/' + encodeId;
            //             const opened = this.urlPopupService.openWithUrlPoup(urlPath, result.data.id);
            //             if (!opened) {
            //                 this.warningMessage();
            //             }
            //             return new Menus.OpenMailPopupSuccess(action.token);
            //         } else {

            //             const errors = result.detailStatus.map(function (item) {
            //                 return item['message'] + '\r\n';
            //             });

            //             return new Menus.OpenMailPopupFail(action.token, { error: errors });
            //         }
            //     })
            //     .catch(error => of(
            //         of(new Menus.OpenMailPopupFail(action.token, { error: error }))
            //     ));
        }));

    @Effect()
    openMailUrlPopup$ = this.actions$.pipe(ofType<Menus.AttachedToMatterAndOpenMailPopup>(Menus.ATTACHED_TO_MATTER_AND_OPEN_MAIL_POPUP),
        switchMap((action) => {
            return this.authHelper.getUser().pipe(
                take(1),
                map((user) => {
                    const messageFormat = getDefaultMessageFormat(user.messageFormat);
                    const htmlBody = (user && user.isSignaturAutoAdd) ?
                        `${messageFormat} <div class="signature">` + user.signature + '</div>' : messageFormat;
                    const draftIdRequest = { ...action.payload.draftIdRequest, htmlBody: htmlBody };

                    return { draftIdRequest: draftIdRequest, token: action.token };
                }));
        }), switchMap((data) => {
            return this.mainMenuService.getMailDraftId(data.draftIdRequest).pipe(
                map((result) => {
                    if (result.data && result.data.id) {
                        const encodeId = encodeURIComponent(result.data.id);
                        const urlPath = `/mail-item/${encodeURIComponent(btoa('me'))}/` + encodeId;
                        const opened = this.urlPopupService.openWithUrlPoup(urlPath, result.data.id, false, false);
                        if (!opened) {
                            this.warningMessage();
                        }
                        return new Menus.OpenMailPopupSuccess(data.token);
                    } else {

                        const errors = result.detailStatus.map(function (item) {
                            return item['message'] + '\r\n';
                        });

                        return new Menus.OpenMailPopupFail(data.token, { error: errors });
                    }
                }),
                catchError(error => of(
                    of(new Menus.OpenMailPopupFail(data.token, { error: error }))
                )));
        }));

    // @Effect()
    // openMailPopup$ = this.actions$.ofType<Menus.OpenMailPopup>(Menus.OPEN_MAIL_POPUP)
    //     .switchMap((action: Menus.OpenMailPopup) =>
    //         this.mainMenuService.getMailDraftId(action.payload.draftIdRequest)
    //             .map((result) => {
    //                 const encodeId = encodeURIComponent(result);
    //                 const urlPath = '/mail-item/' + encodeId;
    //                 this.urlPopupService.openWithUrlPoup(urlPath, result);
    //               return  new Menus.OpenMailPopupSuccess(action.token);
    //             })
    //             .catch(error => of(
    //                 new Menus.OpenMailPopupFail(action.token, { error: error })))
    //     );


    @Effect()
    failOpenPopup$ = this.actions$.pipe(ofType<Menus.OpenMailPopupFail>(Menus.OPEN_MAIL_POPUP_FAIL),
        switchMap((action: Menus.OpenMailPopupFail) => {

            const dialogData: InforDialogData = {
                content: {
                    title: 'Open New Mail',
                    message: action.payload.error
                },
                contentParams: {},
                data: { messageType: 'alert' }
            };
            const dialogRef = this.dialog.open(InforDialogComponent, {
                data: dialogData,
                width: '400px',
                disableClose: true,
                panelClass: 'dps-notification'
            });
            const self = this;
            // return dialogRef.afterClosed().map<InforDialogResult, boolean>(dialogResult => {
            //     return false;
            // });
            // .map((result) => ({ result, menuItem, newMenuItem }));
            return of();

        }));

    @Effect()
    getDatabases$ = this.actions$.pipe(ofType<SideMenus.GetDatabases>(SideMenus.GET_DATABASES),
        switchMap(() => {
            return this.store.select(getDatabases).pipe(take(1));
        }),
        filter((dbs) => dbs === null),
        switchMap(() => {
            return this.layoutService.getDatabases().pipe(
                map((data) => new SideMenus.DatabasesSuccess(data)),
                catchError(() => of(new SideMenus.DatabasesSuccess([]))));
        }));

    @Effect()
    GetMenuItem$ = this.actions$.pipe(ofType<Menus.GetMenuItem>(Menus.GET_MENU_ITEM),
        switchMap(() =>
            this.mainMenuService.GetMenuItems(['INPtpgClient', 'INPtpgMatter']).pipe(
                map(responce => new Menus.GetMenuItemSuccess(responce)),
                catchError(() => of(new Menus.GetMenuItemFail()))
            )
        ));

    @Effect()
    storeMenuItem$ = this.actions$.pipe(ofType<Menus.GetMenuItemSuccess>(Menus.GET_MENU_ITEM_SUCCESS),
        switchMap(() => this.store.select(getGeneralAllMenueItems).pipe(
            take(1))),
        map(menuItems => {
            sessionStorage.setItem(LocalStorageKey.MenuItems,
                JSON.stringify(menuItems));
            return new SideMenus.UpdateWidgetItemsName(menuItems);
        }));


    @Effect()
    postCodeCount$ = this.actions$.pipe(ofType<Menus.GetPostCodeCount>(Menus.GET_POSTCODE_COUNT),
        switchMap((action) =>
            this.mainMenuService.getInboxEntriesCountByUser().pipe(
                map(
                    (result) => {
                        return new Menus.GetPostCodeCountSuccess({ count: result });
                    }
                ),
                catchError((error) => of(new Menus.GetPostCodeCountFail())))
        ));



    @Effect()
    postCodeCountUpdate$ = this.actions$.pipe(ofType<PostOffice.GridRefresh>(PostOffice.GRID_REFRESH),
        mergeMap((action) => {
            return from([new Menus.GetPostCodeCount()]);
        }));


    @Effect()
    getMainMenuInfo$ = this.actions$.pipe(ofType<GetUserGeneralDataSuccess>(GET_USER_GENERAL_DATA_SUCCESS),
        map(responce => new Menus.ModuleInformationSuccess(responce.payload.hiddenModule))
    );

    @Effect()
    setupDashBoardWidget$ = this.actions$.pipe(ofType<Menus.ModuleInformationSuccess>(Menus.GET_MODULE_INFOMATION_SUCCESS),
        map(action => {
            const isGoogle = this.authHelper.isGoogle();
            const widgetList = [{ id: 'mail', active: true, name: 'Mail', enabale: !isGoogle, moduleId: Module.Common },
            { id: 'matter_search', active: true, name: 'Matter Search', enabale: true, moduleId: Module.Matter },
            { id: 'team_efficiency', active: true, name: 'Team Efficiency', enabale: true, moduleId: Module.Common },
            { id: 'calendar', active: true, name: 'Calendar', enabale: !isGoogle, moduleId: Module.Common },
            { id: 'my_tasks', active: true, name: 'Tasks', enabale: true, moduleId: Module.WorkToDo },
            { id: 'work_done', active: true, name: 'Work Done', enabale: true, moduleId: Module.WorkDone },
            { id: 'time_recorded', active: true, name: 'Time Recorded', enabale: true, moduleId: Module.TimeRecorded },
            { id: 'mls', active: true, name: 'MLS', enabale: true, moduleId: Module.Common },
            { id: 'actions', active: true, name: 'Actions', enabale: true, moduleId: Module.Common },
            { id: 'team', active: true, name: 'Team', enabale: true, moduleId: Module.ActivityMonitor },
            { id: 'help', active: true, name: 'Help Videos', enabale: true, moduleId: Module.Common },
            ];
            return new SideMenus.InitDashBoardWidgetList({ widgetList: widgetList, hiddenModule: action.hiddenModule });
        })
    );

    @Effect({ dispatch: false })
    matterDataUpdate$ = this.actions$.pipe(ofType<Menus.MenuItemOpenCaseMatterDatilsUpdate>(Menus.MENU_ITEM_OPEN_CASE_MATTER_DATILS_UPDATE),
        switchMap(action =>
            this.store.select(getGeneralAllMenueItems).pipe(
                map(menuItems => ({ menuItems, matter: action.payload.matter })),
                take(1))),
        tap(info => {
            const openCaseToken = Utilities.getOpenCaseTabKey(info.matter.appId, info.matter.fileID);
            const selectedOpenCase = info.menuItems.find(i => i.id === openCaseToken);
            if (selectedOpenCase && selectedOpenCase.data && selectedOpenCase.data.matterData && selectedOpenCase.data.matterData.data) {
                if ((selectedOpenCase.data.matterData.data.appID !== info.matter.appId) ||
                    (selectedOpenCase.data.matterData.data.branchID !== info.matter.branchID)) {
                    this.store.dispatch(new MenuTabClose({ item: selectedOpenCase, nextIndex: 0 }));
                    this.store.dispatch(new CloseMenuOpenCaseTap(openCaseToken));

                    // const materData: GridRowItemWrapper = {
                    //     ...selectedOpenCase.data,
                    //     appID: info.matter.appId,
                    //     fileID: +info.matter.fileID,
                    //     app_Code: info.matter.appCode,
                    //     branchID: info.matter.branchID,
                    //     feeEarner: info.matter.matterFeeEarner,
                    //     clientName: info.matter.clientName,
                    //     matterDetails: info.matter.matterDetails,
                    //     matterReferenceNo: info.matter.matterRef,
                    //     rateCategory: info.matter.matterRateCategory,
                    //     ufnValue: info.matter.crimeUFN,
                    //     eBilling: info.matter.eBilling,
                    //     isPlotMatter: info.matter.isPlotMatter,
                    //     isPlotMasterMatter: info.matter.isPlotMasterMatter,

                    // };
                    // setTimeout(() => this.mainMenuService.gotoOpenCase(materData), 1000);
                }
            }
        })
    );



    handleDesktopRoute(routerLink, outlet, parentRoute) {
        let myRoute = routerLink;
        if (!!outlet) {
            myRoute = [{ outlets: { [outlet]: myRoute } }];
        }
        // myRoute = [{ outlets: { desktop: ['desktop', myRoute] } }];
        const t = this.router.createUrlTree(myRoute, { relativeTo: parentRoute }).toString();
        return this.router.navigate(myRoute, { relativeTo: parentRoute });
    }

    checkOutletIsLoaded(outlet) {
        // use RegEx to avoid url parm collition
        return this.router.url.search(outlet + ':') > 0;
    }

    warningMessage() {
        const dialogData: InforDialogData = {
            content: {
                title: 'Popup has been blocked',
                message: `Please allow popup for this domain`
            },
            contentParams: { displayName: '' },
            data: { messageType: 'warning' }
        };

        const deleteDialogRef = this.dialog.open(InforDialogComponent, {
            data: dialogData,
            width: '350px',
            panelClass: 'dps-notification'
        });
    }



}
