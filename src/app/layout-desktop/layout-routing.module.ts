import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DummyRouterOutletComponent } from '../shared';
import { RouterOutlets } from './models/enums';
import { ShellComponent } from './containers/shell/shell.component';
import { LayoutCanLoadService } from './services/layout-can-load.service';
import { InitialSettingsService } from '../initial-settings-core/services/initial-settings.service';
import { DashboardLayoutComponent } from '../dashboard-desktop/components/dashboard-layout/dashboard-layout.component';

const appRoutes: Routes = [
  {
    path: 'desktop',
    component: ShellComponent,
    outlet: 'desktop',
    canActivate: [LayoutCanLoadService],
    children: [
      {
        path: 'tmp',
        outlet: RouterOutlets.Dashboard,
        component: DashboardLayoutComponent,
      },
      {
        path: 'mail',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Mail,
        data: { preload: true },
        children: [{
          path: 'home',
          data: { preload: true },
          loadChildren: 'app/mail-desktop/mail-desktop.module#MailDesktopModule',
        }
        ]
      },
      {
        path: 'calendar',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/calendar-desktop/calendar-desktop.module#CalendarDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'cr',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/crime-management-desktop/crime-management-desktop.module#CrimeManagementDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'matter-search',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/matter-search-desktop/matter-search-desktop.module#MatterSearchDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'opportunity',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/opportunity-desktop/opportunity-desktop.module#OpportunityDesktopModule',
          data: { preload: false },
        }
        ]
      },
      {
        path: 'my-tasks',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/my-tasks-desktop/my-tasks-desktop.module#MyTasksDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'dictations',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/dictations-desktop/dictations-desktop.module#DictationsDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'safe-box-explorer',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/safe-box-explorer-desktop/safe-box-explorer-desktop.module#SafeBoxExplorerDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'ledger-card',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/ledger-card-desktop/ledger-card-desktop.module#LedgerCardDesktopModule',
          data: { preload: true },
        }
        ]
      },
      // {
      //   path: 'time-recorded',
      //   component: DummyRouterOutletComponent,
      //   outlet: RouterOutlets.Main,
      //   data: { preload: true },
      //   children: [{
      //     path: 'home', loadChildren: 'app/time-recorded-desktop/time-recorded-desktop.module#TimeRecordedDesktopModule',
      //     data: { preload: true },
      //   }
      //   ]
      // },
      {
        path: 'contacts',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/contacts-create-desktop/contacts-create-desktop.module#ContactsCreateDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'precedentH',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/precedentH-desktop/precedentH-desktop.module#PrecedentHDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'open-case',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/open-case-desktop/open-case-desktop.module#OpenCaseDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'client-search',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/client-search-desktop/client-search-desktop.module#ClientSearchDesktopModule',
          data: { preload: true },
        }
        ]
      },
      {
        path: 'work-done',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/work-done-desktop/work-done-desktop.module#WorkDoneDesktopModule',
          data: { preload: true },
        },
        ]
      },
      {
        path: 'global-document-search',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren:
            'app/global-document-search-desktop/global-document-search-desktop.module#GlobalDocumentSearchDesktopModule',
          data: { preload: true },
        },
        ]
      },
      {
        path: 'post-office',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren:
            'app/post-office-desktop/post-office-desktop.module#PostOfficeDesktopModule',
          data: { preload: true },
        },
        ]
      },
      {
        path: 'team',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren:
            'app/user-movement-desktop/user-movement-desktop.module#UserMovementDesktopModule',
          // 'app/team-desktop/team-desktop.module#TeamDesktopModule',
          data: { preload: true },
        },
        ]
      },
      {
        path: 'team-efficiency',
        component: DummyRouterOutletComponent,
        outlet: RouterOutlets.Main,
        data: { preload: true },
        children: [{
          path: 'home', loadChildren: 'app/team-efficiency-desktop/team-efficiency-desktop.module#TeamEfficiencyDesktopModule',
          data: { preload: true },
        }
        ]
      }
    ]
  },
  { path: '_000_', loadChildren: 'app/notification-desktop/notification-desktop.module#NotificationDesktopModule' },
  { path: '_001_', loadChildren: 'app/azure-storage/azure-storage.module#AzureStorageModule' },
  { path: '_002_', loadChildren: 'app/chaser-desktop/chaser-desktop.module#ChaserDesktopModule' },
  { path: '_003_', loadChildren: 'app/time-recording-desktop/time-recording-desktop.module#TimeRecordingDesktopModule' },
  { path: '_004_', loadChildren: 'app/matter-search-desktop/matter-search-desktop.module#MatterSearchDesktopGeneric' },
  { path: '_005_', loadChildren: 'app/add-note-desktop/add-note-desktop.module#AddNoteDesktopModule' },
  { path: '_006_', loadChildren: 'app/msg-popup-layout/msg-popup-layout.module#MsgPopupLayoutModule' },
  { path: '_007_', loadChildren: 'app/client-creation-desktop/client-creation-desktop.module#ClientCreationDesktopModule' },
  { path: '_008_', loadChildren: 'app/lookup-screen-desktop/lookup-screen-desktop.module#LookupScreenDesktopModule' },
  { path: '_009_', loadChildren: 'app/screen-edit-desktop/screen-edit-desktop.module#ScreenEditDesktopModule' },
  { path: '_010_', loadChildren: 'app/screen-view-desktop/screen-view-desktop.module#ScreenViewDesktop' },
  { path: '_011_', loadChildren: 'app/matter-view-by-client-desktop/matter-view-by-client-desktop.module#MatterViewByClientDesktopModule' },
  { path: '_012_', loadChildren: 'app/workflow-rule-desktop/workflow-rule-desktop.module#WorkflowRuleDesktopModule' },
  { path: '_013_', loadChildren: 'app/workflow-menu-popup-desktop/workflow-menu-popup-desktop.module#WorkflowMenuPopupDesktopModule' },
  { path: '_014_', loadChildren: 'app/calendar-desktop/calendar-desktop.module#CalendarDesktopEditEventModule' },
  { path: '_015_', loadChildren: 'app/calendar-desktop/calendar-desktop.module#CalendarDesktopViewEventModule' },
  { path: '_016_', loadChildren: 'app/screen-desingner-desktop/screen-desingner-desktop.module#ScreenDesingnerDesktop' },
  { path: '_017_', loadChildren: 'app/task-add-edit-desktop/task-add-edit-desktop.module#TaskAddEditDesktopModule' },
  { path: '_018_', loadChildren: 'app/screen-contact-desktop/screen-contact-desktop.module#ScreenContactDesktopModule' },
  { path: '_019_', loadChildren: 'app/app-settings-desktop/app-settings-desktop.module#AppSettingsDesktopModule' },
  { path: '_020_', loadChildren: 'app/conflict-search-desktop/conflict-search-desktop.module#ConflictSearchDesktopModule' },
  { path: '_021_', loadChildren: 'app/matter-creation-desktop/matter-creation-desktop.module#MatterCreationDesktopModule' },
  { path: '_022_', loadChildren: 'app/client-screen-lookup-desktop/client-screen-lookup-desktop.module#ClientScreenLookupDesktopModule' },
  { path: '_023_', loadChildren: 'app/initial-settings-desktop/initial-settings-desktop.module#InitialSettingsDesktopModule' },
  { path: '_024_', loadChildren: 'app/workflow-desktop/workflow-desktop.module#WorkflowDesktopModule' },
  { path: '_025_', loadChildren: 'app/document-view/document-view.module#DocumentViewPopupModule' },
  { path: '_026_', loadChildren: 'app/file-security-rights-desktop/file-security-rights-desktop.module#FileSecurityRightsDesktopModule' },
  { path: '_027_', loadChildren: 'app/email-list-desktop/email-list-desktop.module#EmailListDesktopModule' },
  { path: '_028_', loadChildren: 'app/e-chit-desktop/e-chit-desktop.module#EChitDesktopModule' },
  { path: '_029_', loadChildren: 'app/billing-guide-desktop/billing-guide-desktop.module#BillingGuideDesktopModule' },
  { path: '_030_', loadChildren: 'app/general-supplier-desktop/general-supplier-desktop.module#GeneralSupplierDesktopModule' },
  { path: '_031_', loadChildren: 'app/client-search-desktop/client-search-desktop.module#ClientSearchDesktopGeneric' },
  { path: '_032_', loadChildren: 'app/contacts-create-desktop/contacts-create-desktop.module#ContactsCreateDesktopGeneric' },
  { path: '_033_', loadChildren: 'app/time-information-desktop/time-information-desktop.module#TimeInformationDesktopModule' },
  {
    path: '_034_',
    loadChildren: 'app/police-station-search-desktop/police-station-search-desktop.module#PoliceStationSearchDesktopModule'
  },
  { path: '_035_', loadChildren: 'app/crime-management-desktop/crime-management-desktop.module#CrimeManagementDesktopModule' },
  { path: '_036_', loadChildren: 'app/precedentH-desktop/precedentH-desktop.module#PrecedentHDesktopModule' },
  { path: '_037_', loadChildren: 'app/drive-desktop/drive-desktop.module#DriveDesktopPopupModule' },
  { path: '_038_', loadChildren: 'app/bundling-desktop/bundling-desktop.module#BundlingOptionDesktopModule' },
  { path: '_039_', loadChildren: 'app/bundling-desktop/bundling-desktop.module#BundlingExistingDesktopModule' },
  { path: '_039_', loadChildren: 'app/bundling-desktop/bundling-desktop.module#CoreBundleDesktopModule' },
  { path: '_040_', loadChildren: 'app/matter-linked-desktop/matter-linked-desktop.module#MatterLinkedDesktopModule' },
  { path: '_041_', loadChildren: 'app/post-office-action-desktop/post-office-action-desktop.module#PostOfficeActionDesktopModule' },
  { path: '_042_', loadChildren: 'app/advanced-search-desktop/advanced-search-desktop.module#AdvancedSearchDesktopModule' },
  { path: '_043_', loadChildren: 'app/mls-desktop/mls-desktop.module#MLSDesktopPopupModule' },
  { path: '_044_', loadChildren: 'app/diary-folder-desktop/diary-folder-desktop.module#DiaryFolderDesktopModule' },
  { path: '_045_', loadChildren: 'app/price-cap-limits-desktop/price-cap-limits-desktop.module#PriceCapLimitsDesktopModule' },
  { path: '_046_', loadChildren: 'app/billing-request-desktop/billing-request-desktop.module#BillingRequestDesktopModule' },
  { path: '_047_', loadChildren: 'app/billing-narrative-desktop/billing-narrative-desktop.module#BillingNarrativeDesktopModule' },
  { path: '_048_', loadChildren: 'app/select-posting-period/select-posting-period.module#SelectPostingPeriodModule' },
  { path: '_049_', loadChildren: 'app/crime-class-information-investigation-desktop/crime-class-information-investigation-desktop.module#CrimeClassInformationInvestigationModule' },
  { path: '_050_', loadChildren: 'app/e-chit-authorisations-desktop/e-chit-authorisations-desktop.module#EChitAuthorisationsDesktopModule' },
  { path: '_051_', loadChildren: 'app/page-setup/page-setup.module#PageSetupModule' },
  { path: '_052_', loadChildren: 'app/crime-class-information-proceedings-desktop/crime-class-information-proceedings-desktop.module#CrimeClassInformationProceedingsDesktopModule' },
  { path: '_053_', loadChildren: 'app/msg-viewer/msg-viewer.module#MsgViewerModule' },
  { path: '_054_', loadChildren: 'app/crime-court-duty-desktop/crime-court-duty-desktop.module#CrimeCourtDutyDesktopModule' },
  { path: '_055_', loadChildren: 'app/cds7-report-info-desktop/cds7-report-info-desktop.module#Cds7ReportInfoDesktopModule' },
  { path: '_056_', loadChildren: 'app/ledger-previous-trans-desktop/ledger-previous-trans-desktop.module#LedgerPreviousTransDesktopModule' },
  { path: '_057_', loadChildren: 'app/forms-library/forms-library.module#FormsLibraryModule' },
  { path: '_058_', loadChildren: 'app/probate-desktop/probate-desktop.module#ProbateDesktopModule' },
  { path: '_059_', loadChildren: 'app/probate-estate-overview/probate-estate-overview.module#ProbateEstateOverviewModule' },
  { path: '_060_', loadChildren: 'app/probate-account-desktop/probate-account-desktop.module#ProbateAccountDesktopModule' },
  { path: '_061_', loadChildren: 'app/civil-time-recording-desktop/civil-time-recording-desktop.module#CivilTimeRecordingDesktopModule' },

  { path: '_062_', loadChildren: 'app/civil-class-management/civil-class-management.module#CivilClassManagementModule' },

  // { path: '_057_', loadChildren: 'app/probate-desktop/probate-desktop.module#AddAssetDesktopPopupModule' },
  // { path: '_061_', loadChildren: 'app/contact-destop/contact-destop.module#ContactDestopModule' },
  { path: '_063_', loadChildren: 'app/bank-search-desktop/bank-search-desktop.module#BankSearchDesktopModule' },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes)
  ],
  exports: [RouterModule],
  declarations: [],
  providers: [LayoutCanLoadService, InitialSettingsService]

})
export class LayoutRoutingModule { }
