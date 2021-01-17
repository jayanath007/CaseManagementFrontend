import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-matter-summary',
  templateUrl: './matter-summary.component.html',
  styleUrls: ['./matter-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterSummaryComponent implements OnInit {

  // @Input() menuPropertyButtonClick: any;
  @Input() menuMatterSummery: any;
  @Input() menuShortCutKeys: any;

  constructor(private menu: MainMenuItemResolverService) { }

  ngOnInit() {
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }


}
