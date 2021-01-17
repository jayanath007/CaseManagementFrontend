import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { MatterData, CurrencyLabel } from '../../../ledger-card-core/models/interfce';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-ledger-card-matter-details',
  templateUrl: './ledger-card-matter-details.component.html',
  styleUrls: ['./ledger-card-matter-details.component.scss']
})
export class LedgerCardMatterDetailsComponent implements OnInit {

  constructor(private menu: MainMenuItemResolverService) { }

  @Input() matterData: MatterData;
  @Input() currencyLabel: CurrencyLabel;

  @Output() onResoleModuleName = new EventEmitter<any>();



  ngOnInit() {
    console.log('matterDataqqqq', this.matterData);
  }


  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }

}
