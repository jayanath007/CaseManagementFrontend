import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitSettingCore } from '../../../setting-core';
import { LoadOrganizerSettings, GetJwtTokenForPDFViewer } from '../../../auth';

@Component({
  selector: 'dps-mail-popup-layout',
  templateUrl: './mail-popup-layout.component.html',
  styleUrls: ['./mail-popup-layout.component.scss']
})
export class MailPopupLayoutComponent implements OnInit {

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.store.dispatch(new InitSettingCore());
    this.store.dispatch(new LoadOrganizerSettings());
    this.store.dispatch(new GetJwtTokenForPDFViewer());
  }

}
