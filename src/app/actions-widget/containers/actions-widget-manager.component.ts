import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionWidgetItem } from '../models/enum';
import { UrlPopupService } from '../../shell-desktop/services/url-popup.service';
import { Store } from '@ngrx/store';
import { InitActionsWidget } from '../actions/core';
import { getIsBMDataLoadingByToken } from '../reducers';

@Component({
  selector: 'dps-actions-widget-manager',
  template: `<dps-action-layout
                [isBMDataLoading]="isBMDataLoading$|async"
                (remove)="onRemoveWidget()"
                (clickItem)="onClickItem($event)"
                >
              </dps-action-layout>`,
})
export class ActionsWidgetManagerComponent implements OnInit {

  @Output() removeWidget = new EventEmitter();

  isBMDataLoading$: any;

  constructor(protected store: Store<any>, private urlPopupService: UrlPopupService) { }

  ngOnInit() {
    this.store.dispatch(new InitActionsWidget());
    this.isBMDataLoading$ = this.store.select(getIsBMDataLoadingByToken());
  }

  onRemoveWidget() {
    this.removeWidget.emit();
  }

  onClickItem(item: ActionWidgetItem) {
    switch (item) {
      case ActionWidgetItem.BundelMonitor:
        this.urlPopupService.openWithUrlPoup('/pdfbundlemonitor', 'pdf-bundle-monitor', false, true, 'PDF Bundle Monitor', false);
    }
  }

}
