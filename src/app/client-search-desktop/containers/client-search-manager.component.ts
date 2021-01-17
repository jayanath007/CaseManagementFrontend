import { PaginatorDef } from './../../core/lib/grid-model';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, } from '@angular/core';
import { ViewChangeKind } from '../../matter-search-core';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { MainMenuService } from '../../layout-desktop';
import { AuthInfoStateService } from '../../auth';
import { MatDialog } from '@angular/material';
import { ClientMenu } from './../../client-search-core/models/enums';
import { ClientSearchPopupData, ClientGridRowRapper } from '../../client-search-core/models/interfaces';
import { LedgerCardInput } from './../../core/lib/ledger-card';
import { MatterGridRowRapper } from './../../client-search-core/models/interfaces';
import { BaseClientSearchManager } from '../../client-search-core/containers/base-client-search-manager';

@Component({
  selector: 'dps-client-search-manager',
  template: '<ng-content></ng-content>',
  styles: []
})
export class ClientSearchManagerComponent extends BaseClientSearchManager implements OnInit {

  @Input() inputData: ClientSearchPopupData;
  @Input() clientSearchToken;
  @Input() isPopup: boolean;

  constructor(store: Store<any>, private router: ActivatedRoute, pageService: MainMenuService,
    popupService: SystemJsPopupLoaderService,
    public authService: AuthInfoStateService, dialog: MatDialog) { super(store, pageService, popupService, authService); }

  ngOnInit() {
    super.initSelectors(this.clientSearchToken, this.isPopup, this.inputData);
  }

  onRefresh() {
    this.onGridRefresh(this.clientSearchToken);
  }

  closeClientPopup() {
    this.closeAndDiscastClientPopup(this.clientSearchToken);
  }

  onViewChange({ kind, value }: { kind: ViewChangeKind, value: any }) {
    this.onClientSearchTextClick({ kind, value });
  }

  selectedRowData(event: { item: ClientGridRowRapper, gridData: ClientGridRowRapper[] }) {
    if (this.clientSearchToken === 'clientCreation') {
      let index = 0;
      const _gridData = event.gridData.map((value, i) => {
        if (value === event.item) {
          index = i;
        }
        return event.item;
      });
      if (!event || !event.gridData) {
        return;
      }
      this.closePopup.emit({ index: index, gridData: event.gridData });
      this.onPopupRowSelect(this.clientSearchToken);
    } else if (event && event.item) {
      this.closePopup.emit(event.item);
      this.onPopupRowSelect(this.clientSearchToken);
    } else {
      this.closePopup.emit();
      this.onPopupRowSelect(this.clientSearchToken);
    }
  }


  onClickClientMenu(type: ClientMenu) {
    this.clickMenuClientMenuItem(type);
  }

  clickLedgerCard(selectedMatter: MatterGridRowRapper) {

    const ledgerCardToken = `clientSearchLedgerCardPopup-${selectedMatter.data.matterReferenceNo}`;
    const input: LedgerCardInput = {
      matterRef: selectedMatter.data.matterReferenceNo
    };

    this.popupService.openLedgerCardPopup(ledgerCardToken, input).subscribe((data) => {

    });
  }

  onMatterGridPageChange(data: { clientRef: string, pageDef: PaginatorDef }) {
    this.matterGridPageChange(this.myToken, data);
  }

}


