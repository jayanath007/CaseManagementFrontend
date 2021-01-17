import {
  DashBoardWidgetListDeactivateItem,
  DashBoardWidgetListActiveItem,
} from './../../../layout-desktop/actions/right-sidenav';
import { interval as observableInterval, Observable } from 'rxjs';
import { getExceptionListAll } from '../../../exception-desktop/reducers';
import { Store } from '@ngrx/store';
import { getItemActiveStateById, getTheme } from './../../../layout-desktop/reducers/index';
import { trigger, animate, transition, state, style } from '@angular/animations';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { HideNewReminder } from '../../../notification-desktop';
import { ShowErrorList } from '../../../layout-desktop';
import { AppConfig } from '../../../core';
import { AuthInfoStateService } from '../../../auth';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Theme } from './enum';


@Component({
  selector: 'dps-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  // providers: [],
  // template: '',
  animations: [
    trigger('move', [
      state('topRight', style({ right: '60em', top: '45px' })),
      state('topLeft', style({ left: '60em', top: '45px' })),
      transition('topRight <=> topLeft', animate('5000ms linear')),
    ])
  ],
})



export class DashboardLayoutComponent implements OnInit {
  constructor(private popupService: SystemJsPopupLoaderService,
    private appConfig: AppConfig,
    private store: Store<any>, public media$: MediaObserver) {



  }

  layout = 1;
  theme;
  exceptionList$: any;
  Theme = Theme;
  pressTimer: any;
  max = 100;
  min = 0;
  step = 1;
  value = 65;
  // vertical = true;
  // private _tickInterval = 1;
  // showTicks = false;
  // autoTicks = false;
  // sliderColor = '#b36f0e';

  // state = 'topRight';
  // state$: any;
  // test = 1;
  // timeOutRef;
  // viewLoaded = false;
  // viewLoadedtwo = false;

  // showOpacityCtrl = false;

  // widgetList$: any;


  ngOnInit() {
    this.exceptionList$ = this.store.select(getExceptionListAll);
    this.theme = this.appConfig.dashboardTheme ? this.appConfig.dashboardTheme : Theme.Classic;
  }

  // get tickInterval(): number | 'auto' {
  //   return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  // }
  // set tickInterval(v) {
  //   this._tickInterval = Number(v);
  // }

  // ngAfterViewInit() {
  //   this.state$ = observableInterval(10000)
  //     .subscribe(val => {
  //       return this.test = + 1;
  //     });
  // }
  // isWidgetActive(id) {
  //   return this.store.select(getItemActiveStateById(id));
  // }

  onDrop(meinMenuItem) {
    this.store.dispatch(new DashBoardWidgetListActiveItem({ id: meinMenuItem.id }));
  }

  onRemoveWidget(id) {
    this.store.dispatch(new DashBoardWidgetListDeactivateItem({ id: id }));
  }



  onShowErrorListSidenav() {
    this.store.dispatch(new ShowErrorList(null));
    this.store.dispatch(new HideNewReminder());
  }



}





