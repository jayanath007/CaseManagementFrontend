import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ProbateDealtBy, ReceiptType, ResiduaryType } from '../../../probate-account-core/models/enum';
import { ContactCreateInputData } from '../../../contacts-create-core/models/interfaces';
import { ProbateMatterInput } from '../../../probate-account-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { MatDialog } from '@angular/material';
import { ConfirmDialogData, ConfirmDialogResultKind, InforDialogData } from '../../../shared/models/dialog';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { InforDialogComponent } from '../../../shared';
import { DistributionViewItems } from '../../../probate-core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'dps-probate-account-content',
  templateUrl: './probate-account-content.component.html',
  styleUrls: ['./probate-account-content.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProbateAccountContentComponent implements OnInit, OnChanges {
  receiptTypeList = ReceiptType;
  probateDealtBy = ProbateDealtBy;
  residuaryType = ResiduaryType;
  @Input() openType: string;
  @Input() isLoading: boolean;
  @Input() transactionsEditRow: any;
  @Input() isPopup: boolean;
  @Input() matterData: ProbateMatterInput;
  @Input() savedData: any;
  @Input() title: string;

  @Input() distributionViewItems: DistributionViewItems[];


  @Input() openFrom: ProbateDealtBy;
  @Input() editDataPayment: any;
  @Input() editDataReciept: any;
  @Input() editDataPecuniary: any;
  @Input() editDataResiduary: any;

  @Input() probateTransactionId: number;
  @Input() legacyPercentage: number;

  @Output() submitSaveData = new EventEmitter<any>();
  @Output() colsePopup = new EventEmitter<any>();
  @Output() clear = new EventEmitter<any>();


  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private datePipe: DatePipe) { }

  id: number;
  probateTransId: number;
  dealtBy: number;
  percent: number;
  description: string;
  contactId: number;
  soldDate: string;
  amount: number;
  receiptType: number;
  noOfShares: number;

  recType = ResiduaryType.IntrimDistribution;


  letterTitle: '';
  company: '';
  address: string;
  postCode: string;

  nameofDate: string;
  nameofAmount: string;

  ngOnInit() {
    if (this.title) {
      switch (this.title) {
        case 'Redeem':
          this.nameofDate = 'Date Redeemed';
          this.nameofAmount = 'Value Redeemed';
          break;
        case 'Withdraw':
          this.nameofDate = 'Date Withdrawn';
          this.nameofAmount = 'Value Received';
          break;
        case 'Sell':
          this.nameofDate = 'Date Sold';
          this.nameofAmount = 'Sale Amount';
          break;
        case 'Paid Off':
          this.nameofDate = 'Date Paid';
          this.nameofAmount = 'Amount Paid';
          break;
        case 'Sale of Share':
          this.nameofDate = 'Date Sold';
          this.nameofAmount = 'Sale Amount';
          break;
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // if (changes.transactionsEditRow && !changes.transactionsEditRow.isFirstChange()
    // && changes.transactionsEditRow.currentValue) {
    if (this.openFrom === this.probateDealtBy.Payment || this.openFrom === this.probateDealtBy.Sold) {
      this.id = this.editDataPayment && this.editDataPayment.id ? this.editDataPayment.id : 0;
      this.probateTransId = this.editDataPayment && this.editDataPayment.probateTransId ?
        this.editDataPayment.probateTransId : this.probateTransactionId;
      this.dealtBy = this.editDataPayment && this.editDataPayment.dealtBy ? this.editDataPayment.dealtBy : null;
      this.percent = this.editDataPayment && this.editDataPayment.percent ? this.editDataPayment.percent : 0;
      this.description = this.editDataPayment && this.editDataPayment.details ? this.editDataPayment.details : null;
      this.soldDate = this.editDataPayment && this.editDataPayment.soldDate ? this.editDataPayment.soldDate : null;
      this.amount = this.editDataPayment && this.editDataPayment.amount ? Math.abs(this.editDataPayment.amount) : 0;
      this.receiptType = this.editDataPayment && this.editDataPayment.receiptType ? this.editDataPayment.receiptType : 0;
      this.noOfShares = this.editDataPayment && this.editDataPayment.noOfShares ? this.editDataPayment.noOfShares : 0;

    } else if (this.openFrom === this.probateDealtBy.Receipt) {
      this.id = this.editDataReciept && this.editDataReciept.id ? this.editDataReciept.id : 0;
      this.probateTransId = this.editDataReciept && this.editDataReciept.probateTransId ?
        this.editDataReciept.probateTransId : this.probateTransactionId;
      this.dealtBy = this.editDataReciept && this.editDataReciept.dealtBy ? this.editDataReciept.dealtBy : null;
      this.percent = this.editDataReciept && this.editDataReciept.percent ? this.editDataReciept.percent : null;
      this.description = this.editDataReciept && this.editDataReciept.details ? this.editDataReciept.details : null;
      this.soldDate = this.editDataReciept && this.editDataReciept.soldDate ? this.editDataReciept.soldDate : null;
      this.amount = this.editDataReciept && this.editDataReciept.amount ? this.editDataReciept.amount : 0;
      this.receiptType = this.editDataReciept && this.editDataReciept.receiptType ? this.editDataReciept.receiptType : 0;

    } else if (this.openFrom === this.probateDealtBy.DistributionPecuniary) {

      this.id = this.editDataPecuniary && this.editDataPecuniary.id ? this.editDataPecuniary.id : 0;
      this.probateTransId = this.editDataPecuniary && this.editDataPecuniary.probateTransId ?
        this.editDataPecuniary.probateTransId : this.probateTransactionId;
      this.dealtBy = this.editDataPecuniary && this.editDataPecuniary.dealtBy ? this.editDataPecuniary.dealtBy : null;
      this.percent = this.editDataPecuniary && this.editDataPecuniary.percent ? this.editDataPecuniary.percent : 0;
      this.description = this.editDataPecuniary && this.editDataPecuniary.details ? this.editDataPecuniary.details : null;
      this.soldDate = this.editDataPecuniary && this.editDataPecuniary.date ? this.editDataPecuniary.date : null;
      this.amount = this.editDataPecuniary && this.editDataPecuniary.amount ? this.editDataPecuniary.amount : 0;
      this.contactId = this.editDataPecuniary && this.editDataPecuniary.contactId ? this.editDataPecuniary.contactId : 0;

      this.letterTitle = this.editDataPecuniary && this.editDataPecuniary.beneficiary ? this.editDataPecuniary.beneficiary : null;
      this.company = this.editDataPecuniary && this.editDataPecuniary.contactCompany ? this.editDataPecuniary.contactCompany : null;
      this.address = this.editDataPecuniary && this.editDataPecuniary.contactAddress1 ? this.editDataPecuniary.contactAddress1 : null;
      this.postCode = this.editDataPecuniary && this.editDataPecuniary.contactPostCode ? this.editDataPecuniary.contactPostCode : null;

    } else {

      this.id = this.editDataResiduary && this.editDataResiduary.id ? this.editDataResiduary.id : 0;
      this.probateTransId = this.editDataResiduary && this.editDataResiduary.id ?
        this.editDataResiduary.probateTransId : this.probateTransactionId;
      this.dealtBy = this.editDataResiduary && this.editDataResiduary.dealtBy ? this.editDataResiduary.dealtBy : null;
      this.percent = this.editDataResiduary && this.editDataResiduary.percent ? this.editDataResiduary.percent : 0;
      this.description = this.editDataResiduary && this.editDataResiduary.details ? this.editDataResiduary.details : null;
      this.soldDate = this.editDataResiduary && this.editDataResiduary.date ? this.editDataResiduary.date : null;
      this.amount = this.editDataResiduary && this.editDataResiduary.amount ? this.editDataResiduary.amount : 0;
      this.contactId = this.editDataResiduary && this.editDataResiduary.contactId ? this.editDataResiduary.contactId : 0;
      this.recType = this.editDataResiduary && this.editDataResiduary.details ? this.editDataResiduary.details : null;

      this.letterTitle = this.editDataResiduary && this.editDataResiduary.beneficiary ? this.editDataResiduary.beneficiary : null;
      this.company = this.editDataResiduary && this.editDataResiduary.contactCompany ? this.editDataResiduary.contactCompany : null;
      this.address = this.editDataResiduary && this.editDataResiduary.contactAddress1 ? this.editDataResiduary.contactAddress1 : null;
      this.postCode = this.editDataResiduary && this.editDataResiduary.contactPostCode ? this.editDataResiduary.contactPostCode : null;

    }
  }
  onLagacyDetails(value) {
    this.description = value;
  }
  onPaymentDetails(value) {
    this.description = value;
  }
  onPaymentDate(value) {
    this.soldDate = value;
  }

  onPaymentAmount(value) {
    this.amount = parseFloat(value);
  }
  // Rec
  onChangeRecieptType(value) {
    this.receiptType = value;
  }
  onRecieptDetails(value) {
    this.description = value;
  }
  onRecieptDate(value) {
    this.soldDate = value;
  }
  onRecieptAmount(value) {
    this.amount = parseFloat(value);
  }
  onSubmitData() {
    if (this.openFrom === this.probateDealtBy.DistributionPecuniary) {
      this.description = 'Cash Payment';

    } else if (this.openFrom === this.probateDealtBy.DistributionResiduary) {
      if (this.recType === this.residuaryType.IntrimDistribution) {
        this.description = 'Interim Distribution';
        this.percent = 0;
      } else if (this.recType === this.residuaryType.FinalDistribution) {
        this.amount = 0;
        this.description = 'Final Distribution';
        this.soldDate = null;
      }

    } else {
      this.description = this.description;
    }
    const submitData: any = {
      id: this.id ? this.id : 0,
      probateTransId: this.probateTransId ? this.probateTransId : 0,
      dealtBy: this.dealtBy ? this.dealtBy : this.openFrom,
      percent: this.percent ? this.percent : null,
      description: this.description ? this.description : null,
      contactId: this.contactId ? this.contactId : null,
      soldDate: this.soldDate ? this.soldDate : this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      amount: this.amount ? this.amount : 0,
      receiptType: this.receiptType ? this.receiptType : 0,
      noOfShares: this.noOfShares ? this.noOfShares : 0,

    };
    if (this.openFrom === this.probateDealtBy.DistributionResiduary && this.recType === this.residuaryType.FinalDistribution) {
      if (this.percent <= 100 ||
        (this.editDataResiduary && this.editDataResiduary.outstandingPercentage >= this.percent)) {
        this.submitSaveData.emit(submitData);
      } else {

        const message = 'You cannot allocate a total of more than 100%';
        this.openMSGPopup(message);

      }
    } else {
      this.submitSaveData.emit(submitData);
    }

  }

  onNoOfShares(value) {
    this.noOfShares = parseFloat(value);
  }

  onCancel() {
    if (this.isPopup) {

      this.colsePopup.emit();

    } else {
      this.editDataPayment = null;
      this.editDataReciept = null;
      this.editDataPecuniary = null;
      this.editDataResiduary = null;
      this.clearContact();
      this.clear.emit();
    }
  }
  onPecuniaryDetails(value) {
    this.description = value;
  }
  onPecuniaryDate(value) {
    this.soldDate = value;
  }
  onPecuniaryAmount(value) {
    this.amount = parseFloat(value);
  }
  onResiduaryDate(value) {
    this.soldDate = value;
  }
  onResiduaryAmount(value) {
    this.amount = parseFloat(value);
  }
  onResiduaryPercent(value) {
    this.percent = parseFloat(value);
  }
  openMSGPopup(msg) {
    const dialogData: InforDialogData = {
      content: {
        title: 'Alert',
        message: msg
      },
      contentParams: {},
      data: { messageType: 'alert' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
    });
  }
  onChangeResiduaryType(value) {
    if (value === this.residuaryType.IntrimDistribution) {
      this.percent = 0;
    }
    this.description = value;
    this.recType = value;
  }
  onSelectBeneficiary() {
    const input: ContactCreateInputData = {
      matterInfo: {
        MatterReferenceNo: this.matterData.matterReferenceNo,
        BranchId: this.matterData.branchID,
        AppId: this.matterData.appId,
        FileId: this.matterData.fileID,
        isLegalAid: false
      }
    };
    this.popupService.openContactsCreatePopup(`contactSearch:${input.matterInfo.MatterReferenceNo}`, input).
      subscribe(
        (result: any) => {
          if (result && result.contactId) {
            // const contactDetails: ContactDetails = {
            //   contactId: result.contactId,
            //   letterTitle: '',
            //   name: result.name,
            //   address: result.address,
            //   postCode: result.postCode
            // };
            //  this.updateContactData.emit(contactDetails);
            this.contactId = result.contactId;
            this.letterTitle = result.name;
            this.company = result.company;
            this.address = result.address;
            this.postCode = result.postCode;
            return '';
          }
        });
    // contactInfo => console.log('contactInfo', contactInfo));
  }

  onRemoveBeneficiary() {

    this.showValidationMsg();

  }

  showValidationMsg() {

    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Remove Contact',
        message: 'Are you sure you want to remove the contact from this item?',
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

        this.clearContact();

      }
    });

  }

  public clearContact() {
    this.contactId = 0;
    this.letterTitle = '';
    this.company = '';
    this.address = '';
    this.postCode = '';

  }

  positiveAmount(amount) {
    return Math.abs(amount);
  }

  currentDate(date) {
    if (date !== null) {
      return date;
    } else {
      return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    }


  }

  outstandingPrecent(value) {

    if (value === null) {
      if (this.distributionViewItems && this.distributionViewItems.length > 0) {
        return this.distributionViewItems[0].outstandingPercentage !== null ? this.distributionViewItems[0].outstandingPercentage : 100;
      } else {
        return 100;
      }

    } else {
      return value;
    }

  }

}
