import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitSettingCore } from '../../../setting-core';
import { LoadOrganizerSettings, GetJwtTokenForPDFViewer } from '../../../auth';

@Component({
  selector: 'dps-calendar-popup-layout',
  templateUrl: './calendar-popup-layout.component.html',
  styleUrls: ['./calendar-popup-layout.component.scss']
})
export class CalendarPopupLayoutComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.dispatch(new InitSettingCore());
    this.store.dispatch(new LoadOrganizerSettings());
    this.store.dispatch(new GetJwtTokenForPDFViewer());
  }

}
