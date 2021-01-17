
import { Component, OnInit, Input } from '@angular/core';

import { MatterBalances, CurrencyLabel } from '../../../ledger-card-core/models/interfce';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-ledger-card-matter-balance',
  templateUrl: './ledger-card-matter-balance.component.html',
  styleUrls: ['./ledger-card-matter-balance.component.scss']
})
export class LedgerCardMatterBalanceComponent implements OnInit {

  @Input() matterBalances: MatterBalances;
  @Input() currencyLabel: CurrencyLabel;

  constructor(private menu: MainMenuItemResolverService) { }

  ngOnInit() {
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }

}
