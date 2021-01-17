
import { map } from 'rxjs/operators';
import { Observable, EMPTY as empty } from 'rxjs';
import { AppConfig } from './core/configs/app-config';
import { AppInsightsService } from 'ng2-appinsights';
import { ErrorDataUploadService } from './shared/services/error-data-upload.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { DpsAppInit } from './core';
import { DEFAULT_HOME_URL } from './layout-desktop/models/tokens';
import { AuthGuardService, getLoggedIn } from './auth';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InforDialogComponent, InforDialogData, ConfirmDialogResult, ConfirmDialogResultKind } from './shared';
import {
  Router, // import as RouterEvent to avoid confusion with the DOM Event
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { SvgIconService } from './shared/services/svg-icon.service';


@Component({
  selector: 'dps-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  loading = false;
  // loading$: any = empty();
  loading$: any;

  constructor(private store: Store<any>,
    private router: Router,
    private appinsightsService: AppInsightsService,
    errorDataUploadService: ErrorDataUploadService,
    private appConfig: AppConfig,
    private dialog: MatDialog,
    private iconService: SvgIconService,
    @Inject(DEFAULT_HOME_URL) private defualtRoute: string
  ) {

    const fallback = { path: '', redirectTo: defualtRoute, pathMatch: 'full', canActivateChild: [AuthGuardService] };
    const newRoutes = router.config.concat([fallback]);
    router.resetConfig(newRoutes);

    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
    this.iconService.registerIcons();
    this.appinsightsService.Init({
      instrumentationKey: this.appConfig.insightsInstrumentationKey,
      enableDebug: false,
      disableAjaxTracking: false,
      disableExceptionTracking: false,
      // disableTelemetry: true,
      //  maxAjaxCallsPerView: 50,
    });
    errorDataUploadService.createErrorLogTable();
    errorDataUploadService.logData();
    this.loading$ = this.store.select(getLoggedIn).pipe(map(val => !val));
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
      if (event.url !== this.defualtRoute) {
        setTimeout(() => {
          this.router.navigateByUrl(this.defualtRoute, { replaceUrl: true });
        });
      }
    }
  }

  ngOnInit(): void {
    if (this.checkPopup()) {
      this.store.dispatch(new DpsAppInit());
    }
  }

  checkPopup() {
    let popup = null;
    try {
      popup = window.open('about:blank', 'mywindow', 'menubar=0,resizable=0,width=1,height=1,left=10000,top=10000');
    } catch (e) {
      console.error(e);
    }
    if (!popup) {
      const dialogData: InforDialogData = {
        content: {
          title: 'Popup disabled',
          message: 'Please allow popup window from your browser'
        },
        contentParams: {},
        data: { messageType: 'alert' }
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });

      dialogRef.afterClosed().subscribe(() => {
        document.location.href = '';
      });
      return false;
    } else {
      popup.close();
    }
    return true;
  }

  // test push
}
