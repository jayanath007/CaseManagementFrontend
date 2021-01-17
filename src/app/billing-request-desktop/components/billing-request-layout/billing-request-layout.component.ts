import { ConfirmDialogComponent } from './../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData, ConfirmDialogResultKind } from './../../../shared/models/dialog';
import { PosingPeriod } from './../../../setting-core/models/interface';
import { TableColumn } from './../../../shared/models/interface';
import { BillingRequestState } from './../../../billing-request-core/reducers/billing-request';
import {
  MatterData, TotalValues,
  TimeProfitHeaderResponseModel,
  BillingRequestTimeProfitHeaderResponseModel
} from './../../../billing-request-core/models/interfaces';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import { MatDialog } from '@angular/material';
import { LedgerCardInput } from '../../../core/lib/ledger-card';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-billing-request-layout',
  templateUrl: './billing-request-layout.component.html',
  styleUrls: ['./billing-request-layout.component.scss']
})
export class BillingRequestLayoutComponent implements OnInit, OnChanges {

  @Input() matterInfo: MatterData;
  @Input() requestViewData: BillingRequestState;
  @Input() totalValues: TotalValues;
  @Input() mainLoader: boolean;
  @Input() selectedPostingPeriod: PosingPeriod;
  @Input() timeHeaderGridOrderData: TimeProfitHeaderResponseModel<BillingRequestTimeProfitHeaderResponseModel>[];
  @Input() timeOffset: number;
  @Input() closePopup: number;

  // @Output() dropItem = new EventEmitter();
  @Output() closeRequestPopup = new EventEmitter<any>();
  @Output() updateSelectedMatterData = new EventEmitter<any>();
  @Output() matterSearchData = new EventEmitter<any>();
  @Output() importPopupOpen = new EventEmitter<any>();
  @Output() addDataPopupOpen = new EventEmitter<any>();
  @Output() printSettingPopupOpen = new EventEmitter<any>();
  @Output() timeAndCostGridSelectRowUpdate = new EventEmitter<any>();
  @Output() headerGridRowDoubleClick = new EventEmitter<any>();
  @Output() narrativeItemText = new EventEmitter<any>();
  @Output() proformaCheckUpdate = new EventEmitter<any>();
  @Output() billCheckUpdate = new EventEmitter<any>();
  @Output() addToBillDataUpdate = new EventEmitter<any>();
  @Output() removeAllGridDataByGridType = new EventEmitter<any>();
  @Output() updateControllerValue = new EventEmitter<any>();
  @Output() billingRequestSave = new EventEmitter<any>();
  @Output() deleteBillRequest = new EventEmitter();

  matterBalanceGridcolumns: TableColumn[] = [
    { name: '', propertyName: 'row', width: '10%', textAlign: 'left' },
    { name: 'Bill Bal', propertyName: 'billBal', width: '18%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Disb Bal', propertyName: 'disbBal', width: '18%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'Cli Bal', propertyName: 'cliBal', width: '18%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'DDA Bal', propertyName: 'ddaBal', width: '18%', textAlign: 'right', numberFormat: '1.2-2' },
    { name: 'TIM Bal', propertyName: 'timBal', width: '18%', textAlign: 'right', numberFormat: '1.2-2' }
  ];

  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private menu: MainMenuItemResolverService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.closePopup && changes.closePopup.currentValue) {
      if (this.closePopup > 0) {
        this.closeRequestPopup.emit('');
      }
    }
  }

  showValidationMsg(msg) {
    if (msg) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Abandon Bill',
          message: msg,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
        } else if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.closeRequestPopup.emit('');
        }
      });
    }
  }
  onClose(value) {
    if ((this.requestViewData && this.requestViewData.timeAndProfitHeaderGridData
      && this.requestViewData.timeAndProfitHeaderGridData.length > 0) ||
      this.requestViewData.disbsAndExpenseHeaderGridData.length > 0) {
      this.showValidationMsg(`You will lose the current bill you are working on.
      \n Are you sure you want to continue`);
    } else {
      this.closeRequestPopup.emit(value);
    }

  }
  onMatterSearch(matterRef: string) {
    if ((this.requestViewData && this.requestViewData.timeAndProfitHeaderGridData
      && this.requestViewData.timeAndProfitHeaderGridData.length > 0) ||
      this.requestViewData.disbsAndExpenseHeaderGridData.length > 0) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Abandon Bill',
          message: `You will lose the current bill you are working on.
             \n Are you sure you want to continue`,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
        } else if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.openMatterSearch();
        }
      });
    } else {
      this.openMatterSearch();
    }
  }
  openMatterSearch() {
    const matterInputData: any = {
      searchText: ''
    };
    this.popupService.openMatterSearchPopup('BillingRequestMatterSearch', matterInputData).subscribe(
      (result: any) => {
        if (result) {
          const matterData: MatterData = {
            matterRef: result.MatterReferenceNo,
            branchId: result.BranchID,
            appId: result.AppID,
            fileId: result.FileID,
            appCode: result.AppCode,
            feeEarner: result.FeeEarner,
            clientRef: '',
            clientName: result.ClientName ? result.ClientName : '',
            eBilling: result.eBilling,
            branchName: '',
            isClosed: false,
            matterDetails: result.matterDetails,
            matterCode: '',
            isProspectMatter: result.isProspectMatter
          };
          this.matterSearchData.emit(matterData);
        }
      });
  }
  onRowClick(event) {
    const ledgerCardToken = 'matterCreationLedgerCardPopup(' + this.matterInfo.matterRef + ')';
    const input: LedgerCardInput = {
      matterRef: this.matterInfo.matterRef,
    };
    this.popupService.openLedgerCardPopup(ledgerCardToken, input);
  }
  onRowDblClick(event) {
    // open ladger card popup
  }
  onOpenBillingNarrativePopup(event) {
    this.popupService.billingNarrativePopup('billingNarrativePopup', { id: null }).subscribe((data) => {
      if (data && data.narrativeItemText) {
        this.narrativeItemText.emit(data.narrativeItemText);
      }
    });
  }
  onChangeNarrativeItemText(text) {
    this.narrativeItemText.emit(text);
  }
  onChangeunProforma(event) {
    this.proformaCheckUpdate.emit(event.checked);
  }
  onChangeBill(event) {
    this.billCheckUpdate.emit(event.checked);
  }
  onOpenDataImportPopup(formType) {
    this.importPopupOpen.emit(formType);
  }
  openExpenseOrProfitCostPopup(input) {
    this.addDataPopupOpen.emit(input);
  }
  openPrintOptionsPopup() {
    this.printSettingPopupOpen.emit(this.requestViewData);
  }
  disbursementPopupOpenClick() {
    // this.selectTimePopupOpen.emit();
  }
  onTimeAndCostGridSelectRowUpdate(event) {
    this.timeAndCostGridSelectRowUpdate.emit(event);
  }
  onHeaderGridRowDoubleClick(model) {
    this.headerGridRowDoubleClick.emit(model);
  }
  onAddToBillClick(model) {
    this.addToBillDataUpdate.emit(model);
  }
  onRemoveAllGridDataByGridType(gridType) {
    this.removeAllGridDataByGridType.emit(gridType);
  }
  onUpdateControllerValue(event) {
    this.updateControllerValue.emit(event);
  }
  onBillingRequestSave(event) {
    const totalsAndbuttonTypeModel = { totalValues: this.totalValues, buttonTypeText: event };
    this.billingRequestSave.emit(totalsAndbuttonTypeModel);
  }
  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }
  onDeleteBillRequest() {
    this.deleteBillRequest.emit();
  }
}
