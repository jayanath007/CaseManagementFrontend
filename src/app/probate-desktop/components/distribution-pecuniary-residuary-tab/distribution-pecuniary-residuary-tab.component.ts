import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ProbateDealtBy } from '../../../probate-account-core/models/enum';
import { DistributionViewItems } from '../../../probate-core/models/interfaces';

@Component({
  selector: 'dps-distribution-pecuniary-residuary-tab',
  templateUrl: './distribution-pecuniary-residuary-tab.component.html',
  styleUrls: ['./distribution-pecuniary-residuary-tab.component.scss']
})
export class DistributionPecuniaryResiduaryTabComponent implements OnInit, OnChanges {
  probateDealtBy = ProbateDealtBy;
  @Input() token: string;
  @Input() matterData: any;
  @Input() transactionsEditRow: any;
  @Input() distributionEditRow: any;

  @Input() distributionViewItems: DistributionViewItems[];

  pecuniaryData;
  residuaryData;
  tabIndex: number;
  constructor() { }


  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {

    if (this.distributionEditRow) {
      if (this.distributionEditRow.dealtBy === this.probateDealtBy.DistributionPecuniary) {
        this.pecuniaryData = this.distributionEditRow;
        this.residuaryData = null;
        this.tabIndex = 0;
      } else if (this.distributionEditRow.dealtBy === this.probateDealtBy.DistributionResiduary) {
        this.residuaryData = this.distributionEditRow;
        this.pecuniaryData = null;
        this.tabIndex = 1;

      }
    }

  }


  tabChange(event) {
    if (event.index === 0) {
      this.residuaryData = null;
    } else {
      this.pecuniaryData = null;
    }
  }

}
