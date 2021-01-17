import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input } from '@angular/core';
import { BaseLedgerCardManager } from '../../ledger-card-core/containers/base-ledger-card-manager';
import { MainMenuService } from '../../layout-desktop';
import { AllGridFilterUpdate, MatterData, AllGridFilterModel } from '../../ledger-card-core/models/interfce';
import { MatterSearchGridData } from '../../core/lib/matter';
import { BillingGuidePopupData } from '../../billing-guide-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { BillingGuideAnalysisType } from '../../billing-guide-core/models/enum';
import { PreviousTransInput } from '../../ledger-previous-trans-core/models/interface';

@Component({
  selector: 'dps-ledger-card-manager',
  template: '<ng-content></ng-content>',
  styleUrls: []
})
export class LedgerCardManagerComponent extends BaseLedgerCardManager implements OnInit {
  @Input() ledgerCardToken: string;
  @Input() isPopup: boolean;
  @Input() input: any;
  @Input() onprintPreTransaction: any;

  constructor(store: Store<any>, private router: ActivatedRoute, private pageService: MainMenuService,
    private popupService: SystemJsPopupLoaderService) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.ledgerCardToken, this.isPopup, this.input);
  }

  onUpdateMatterRef(matterRef: string) {
    this.updateMatterRef(this.ledgerCardToken, matterRef, this.allGridTemplete,
      this.billGridColumn, this.disbsGridColumn, this.gbpGridColumn, this.ddaGridColumn, this.clientsGridColumn);
  }

  onUpdateAllGridFilter(data: AllGridFilterUpdate) {
    this.updateAllGridFilter(this.ledgerCardToken, data);
  }

  onAllGridViewChange(data) {
    this.allGridViewChange(this.ledgerCardToken, data);
  }

  onBillGridViewChange(data) {
    this.billGridViewChange(this.ledgerCardToken, data);
  }

  onDISBSGridViewChange(data) {
    this.disbsGridViewChange(this.ledgerCardToken, data);
  }

  onGBPGridViewChange(data) {
    this.gbpGridViewChange(this.ledgerCardToken, data);
  }

  onDDAGridViewChange(data) {
    this.ddaGridViewChange(this.ledgerCardToken, data);
  }

  onClient1GridViewChange(data) {
    this.client1GridViewChange(this.ledgerCardToken, data);
  }

  onClient2GridViewChange(data) {
    this.client2GridViewChange(this.ledgerCardToken, data);
  }

  onClient3GridViewChange(data) {
    this.client3GridViewChange(this.ledgerCardToken, data);
  }

  onChangeTap(tabIndex: number) {
    this.changeTap(this.ledgerCardToken, tabIndex);
  }

  onCloseLedgerCard() {
    this.closeLedgerCard(this.ledgerCardToken);
  }

  onGridRefresh() {
    this.GridRefresh(this.ledgerCardToken);
  }

  onOpenMatter(matterData: MatterData) {
    const data: MatterSearchGridData = {
      appID: matterData.appID,
      fileID: matterData.fileID,
      app_Code: matterData.app_Code,
      branchID: matterData.branchID,
      feeEarner: matterData.feeEarner,
      reviewDate: matterData.reviewDate,
      clientName: matterData.clientName,
      reviewNote: matterData.reviewNote,
      company_Name: matterData.company_Name,
      matterDetails: matterData.matterDetails,
      matterReferenceNo: matterData.matterReferenceNo,
      matterCounter: matterData.matterCounter,
      ufnValue: matterData.ufnValue,
      eBilling: matterData.eBilling,
      isPlotMatter: matterData.isPlotMatter,
      isPlotMasterMatter: matterData.isPlotMasterMatter,
      isProspectMatter: matterData.isProspectMatter,
      isLegalAid: matterData.isLegalAid
    };
    this.pageService.gotoOpenCase({ data: data });
  }

  onResetData() {
    this.clearData(this.ledgerCardToken);
  }


  printLedgerCard(matterData: MatterData, allGridFilterData: AllGridFilterModel) {
    this.onPrintLedgerCard({ matterData, allGridFilterData, token: this.ledgerCardToken });
  }

  printPreTransaction() {
    this.onprintPreTransaction({});
  }

  onOpenBillingGuide(matterData: MatterData) {

    const billingGuideData: BillingGuidePopupData = {
      matterRef: matterData.matterReferenceNo,
      clientName: matterData.clientName,
      branchId: +matterData.branchID,
      appId: +matterData.appID,
      fileId: +matterData.fileID,
      analysisType: BillingGuideAnalysisType.Time

    };
    this.popupService.openBillingGuidePopup('billingGuidePopup', billingGuideData).subscribe((result: any) => {
      if (!result) {
        return '';
      }
    });
  }
  onOpenPreTransaction(matterData: MatterData) {
    if (matterData && matterData.matterReferenceNo) {
      const oppupInputData: PreviousTransInput = {
        matterData: matterData
      };
      this.popupService.openPreviousTransactionsPopup('LedgerPreviceTranToken', oppupInputData).subscribe((result: any) => {
        if (!result) {
          return '';
        }
      });
    }
  }


}
