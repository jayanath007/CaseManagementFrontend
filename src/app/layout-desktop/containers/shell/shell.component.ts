import { getDashBoardWidgetList } from './../../reducers/index';

import { takeUntil, map } from 'rxjs/operators';
import { UrlPopupService } from './../../../shell-desktop/services/url-popup.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component, OnInit, ViewChild, ChangeDetectionStrategy,
  ViewContainerRef, AfterContentInit, Inject
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import {
  getGeneralMenueItems, getVisibleOutlet, getOpenCaseMenueItems,
  getRightSidenavModule, getRightSidenavIsOpend
} from '../../reducers';
import { getMainMenuMode } from '../../reducers';
import * as MenuActions from '../../actions/main-menu';
import * as SettingCore from '../../../setting-core/actions/core';
import { DEFAULT_HOME_URL } from '../../models/tokens';

import { ComponentBase, LocalStorageKey } from '../../../core';
import { ActivatedRoute } from '@angular/router';
import { MenuGroups } from '../../models/enums';
import { AuthInfoStateService, UpdateProfileImage, User } from '../../../auth';
import { OverlayModuleLoaderService, SystemJsPopupLoaderService } from '../../../shell-desktop';
import { MainMenuService } from '../../services/main-menu.service';
import { LoadOrganizerSettings, GetJwtTokenForPDFViewer } from '../../../auth';
import { AppConfig } from '../../../core/configs/app-config';
import { HideRightSidenav, ShowRemindersSidenav, ShowSettingsSidenav, InitDashBoardWidgetList } from '../../actions/right-sidenav';
import { WorkflowSessionManagerService } from '../../../workflow-desktop';
import { MainMenuItem } from '../../models/interfaces';
import { uuid } from '../../../utils/uuid';
import { HideNewReminder } from '../../../notification-desktop';
import { SvgIcons } from '../../../shared/models/svg-icons.enum';


@Component({
  selector: 'dps-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent extends ComponentBase implements OnInit, AfterContentInit {
  menuState$;
  menuItems$;
  menuOpenCaseItems$;
  menuInteractions$ = new Subject<string>();
  minNavVisibility$;
  fullNavVisibility$;
  menuGenaralMenuItems$;
  user$: Observable<User>;
  activeOutlet$;
  openMode = 'side';
  abc;

  rightSidenavModule$;
  rightSidenavIsOpend$;
  dashBoardWidgetList$;
  svgIcons = SvgIcons;

  @ViewChild('notificationModule', { read: ViewContainerRef }) notificationModule: ViewContainerRef;
  @ViewChild('azureStorageModule', { read: ViewContainerRef }) azureStorageModule: ViewContainerRef;
  @ViewChild('workflowTest', { read: ViewContainerRef }) workflowTest: ViewContainerRef;
  @ViewChild('endSideNav') endSideNav: ViewContainerRef;

  constructor(private store: Store<any>, private desktopRoute: ActivatedRoute,
    public authHelper: AuthInfoStateService,
    private overlayLoader: OverlayModuleLoaderService,
    private popupLoader: SystemJsPopupLoaderService,
    public appConfig: AppConfig,
    private menuService: MainMenuService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private workflowSession: WorkflowSessionManagerService,
    private urlPopupService: UrlPopupService,
    @Inject(DEFAULT_HOME_URL) private defualtRoute: string
  ) {

    super();
    this.menuState$ = this.store.select(getMainMenuMode);
    this.menuItems$ = this.store.select(getGeneralMenueItems).pipe(
      map(items => items.filter(item => !(authHelper.isGoogle() && (item.id === 'mail' || item.id === 'calendar')))));
    this.menuOpenCaseItems$ = this.store.select(getOpenCaseMenueItems);
    this.user$ = this.authHelper.getUser();
    this.activeOutlet$ = this.store.select(getVisibleOutlet);
    this.rightSidenavModule$ = this.store.select(getRightSidenavModule);
    this.rightSidenavIsOpend$ = this.store.select(getRightSidenavIsOpend);
    this.dashBoardWidgetList$ = this.store.select(getDashBoardWidgetList);
  }



  ngOnInit() {

    // try {
    //   throw new Error('test error');
    //   // throw new Error('hehe');
    // } catch (e) {
    //   console.log(e);
    // }

    this.store.dispatch(new SettingCore.InitSettingCore());
    this.store.dispatch(new MenuActions.GetMenuItem());
    this.store.dispatch(new LoadOrganizerSettings());
    this.store.dispatch(new GetJwtTokenForPDFViewer());
    this.store.dispatch(new MenuActions.GetPostCodeCount());

    this.menuService.setDeskTopRoute(this.desktopRoute);
    if (!this.router.url.startsWith('/auth') && this.router.url !== this.defualtRoute) {
      location.replace(this.defualtRoute);
    }

    this.popupLoader.preloadChaser();

    this.handlebackButton();

    this.fullNavVisibility$ = this.menuState$.pipe(map((internalState: string) => internalState === 'side-min' ? false : true));
    this.minNavVisibility$ = this.menuState$.pipe(map((internalState: string) => internalState === 'side-min' ? true : false));
    this.menuInteractions$.pipe(map((kind) => new MenuActions.MainMenuToggle({ kind })),
      takeUntil(this.destroy$))
      .subscribe((action) => this.store.dispatch(action));
    sessionStorage.setItem(LocalStorageKey.OpenCaseMenuItems, JSON.stringify([])); // Clear Session Storage

    this.breakpointObserver.observe([
      Breakpoints.WebLandscape,
    ]).subscribe(result => {
      if (!result.matches) {
        this.openMode = 'over';
        this.fullNavVisibility$.subscribe(val => {
          if (val) {
            this.menuInteractions$.next('menu-pin-click');
          }
        }).unsubscribe();
      } else {
        this.openMode = 'side';
      }
    });

    this.workflowSession.commonTemplateData.subscribe((data) => {
      console.log('Common template data recived', data);
    });

    const isGoogle = this.authHelper.isGoogle();

    // this.abc.test.abc = 'error';

  }

  handlebackButton() {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.router.navigate([{ outlets: { main: null } }]).then(() => {
        this.store.dispatch(new MenuActions.NavigateToHome());
      });
    });
  }

  ngAfterContentInit(): void {
    if (!this.authHelper.isGoogle()) {
      this.loadNotificationModule();
      this.loadAzureStorageModule();
    }
    this.loadWorkflowModule();
    // this.shellState.setOpenCaseHostRef(this.openCase);
  }

  menuExpandClick() {
    this.menuInteractions$.next('menu-expand-click');
  }

  menuPinClick() {
    this.menuInteractions$.next('menu-pin-click');
  }

  onMainMenuItemClick(item: MainMenuItem<any>) {
    if (item.group === MenuGroups.UrlPopUp) {
      let urlPath = '';
      if (item.routerLink instanceof Array) {
        urlPath = `/${(<Array<string>>item.routerLink).join('/')}`;
      } else {
        urlPath = `/${item.routerLink}`;
      }
      this.urlPopupService.openWithUrlPoup(urlPath, item.id, false, true, item.label, false);
    } else if (item.group === MenuGroups.General || item.group === MenuGroups.OpenCase || item.group === MenuGroups.HeaderBarItem) {
      this.store.dispatch(new MenuActions.MenuItemClick(item, this.desktopRoute));
    } else if (item.group === MenuGroups.PopUp) {
      switch (item.id) {
        case 'client_creation':
          this.popupLoader.openClientCreationPopup(uuid(), null);
          break;
        case 'matter_creation':
          this.popupLoader.openMatterCreationPopup(uuid(), null).subscribe((data: any) => { });
          break;
        case 'advanced_search':
          this.popupLoader.openAdvancedSearchPopup('advancedSearchPopup');

          break;
        case 'e_chit':
          this.popupLoader.openEChitPopup('openEChitDesktopModule', {});
          break;
        default:
          break;
      }
    }

  }

  onMainMenuItemClose({ item, nextIndex }) {
    this.store.dispatch(new MenuActions.RunExitLogicAndClose(item, nextIndex));
    // this.store.dispatch(new Core.MenuTabClose({ item: item, nextIndex: nextIndex }));
    // this.store.dispatch(new CloseMenuOpenCaseTap(item.token));
  }

  onLogout() {
    this.authHelper.logOut();
  }

  loadNotificationModule() {
    this.overlayLoader.loadNotificationModule(this.notificationModule);
  }
  loadAzureStorageModule() {
    this.overlayLoader.loadAzureStorageModule(this.azureStorageModule);
  }
  loadWorkflowModule() {
    this.overlayLoader.preloadWorkflowCore();
  }

  loadMailSettings() {
    this.popupLoader.loadAppAppSettingsOverlay('Mail settings', null);
    this.onCloseRightSideNav();
  }
  loadPostingPeriod() {
    this.popupLoader.postingPeriodPopup('dpsPostingPeriodToken').subscribe((data) => { });
    this.onCloseRightSideNav();
  }


  loadPageSetup() {
    this.popupLoader.pageSetupPopup('dpsPageSetupToken', { id: null }).subscribe((data) => { });
    this.onCloseRightSideNav();
  }
  onCloseRightSideNav() {
    this.store.dispatch(new HideRightSidenav(null));
  }
  onShowRemindersSidenav() {
    this.store.dispatch(new ShowRemindersSidenav(null));
    this.store.dispatch(new HideNewReminder());
  }
  onShowSetingsSidenav() {
    this.store.dispatch(new ShowSettingsSidenav(null));
    this.store.dispatch(new HideNewReminder());
  }

  onUpdateImageFile(value) {
    this.store.dispatch(new UpdateProfileImage('Mail settings', { image: value }));
  }
  onOpportunitySettings() {
    this.popupLoader.loadOpportunitySettingsOverlay('Opetunity settings', { isOpportunity: true });
    this.onCloseRightSideNav();
  }
  onMLSInquiryForm() {
    this.popupLoader.loadOpportunitySettingsOverlay('Opetunity settings', null);
    this.onCloseRightSideNav();
  }

}
