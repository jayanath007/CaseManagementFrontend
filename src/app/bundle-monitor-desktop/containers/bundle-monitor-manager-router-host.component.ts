import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseBundleMonitorManager } from '../../bundle-monitor-core/containers/base-bundle-monitor-manager';
import { BundleMonitorInput } from '../../bundle-monitor-core/models/interfaces';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'dps-bundle-monitor-manager-router-host',
  template: `<dps-bundle-monitor-layout
                  [isLoading]="isLoading$|async"
                  [columnDef]="columnDef$|async"
                  [itemsForList]="itemsForList$|async"
                  [selectedItem]="selectedItem$|async"
                  [gridItems]="gridItems$|async"
                  [searchBundleId]="searchBundleId$|async"
                  (changeSelectedItem)="onChangeSelectedItem($event,token)"
                  (selectRow)="onSelectRow($event,token)"
                  (deleteRows)="onDeleteRows(token)"
                  (refresh)="onRefresh(token)"
                  (updateSearchId)="onChangeSearchBundleId($event,token)"
                  (openLog)="onOpenLog($event, token)"
              >
              </dps-bundle-monitor-layout>`
})
export class BundleMonitorManagerRouterHostComponent extends BaseBundleMonitorManager implements OnInit {

  constructor(store: Store<any>, private route: ActivatedRoute) { super(store); }
  token = 'MainBundleMonitor';

  ngOnInit() {
    let bundleID = null;
    this.route.params.forEach(params => bundleID = params['bundleid']);
    const inputData: BundleMonitorInput = {
      colunDef: this.columnDef,
      bundleID: bundleID ? bundleID : null
    };
    super.initSelectors(this.token, inputData);
  }

}
