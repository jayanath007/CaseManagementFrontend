import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonControllerTypes, FormType, Mode, SaleofShareCategoryCode } from '../../models/enums';
import {
  CategoryItem, ContactDetails, EstateOverviewModel,
  PaymentGridDataModel,
  ProbateCategoryList, ProbCategoryWishControllersData, EditPaymentGridData, ValidationInfo, AssetItemForDropDown
} from '../../models/interfce';
import * as FormControllersArray from '../../form-controllers/form-controllers';
import { TableColumn } from '../../../shared';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { ProbateDealtBy } from '../../../probate-account-core/models/enum';
import { InfoDialogType, showInforDialog } from '../../../core/utility/DpsUtility';
import { MatDialog } from '@angular/material';
import { ContactCreateInputData } from '../../../contacts-create-core/models/interfaces';
import { DatePipe } from '@angular/common';

export interface List {
  name: string;
  completed: boolean;
}
// export interface nameRadiobtn {
//   name: string;
//   completed: boolean;
// }

@Component({
  selector: 'dps-add-edit-estate-layout',
  templateUrl: './add-edit-estate-layout.component.html',
  styleUrls: ['./add-edit-estate-layout.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AddEditEstateLayoutComponent implements OnInit, OnChanges {


  @Input() loading: boolean;
  @Input() isDirty: boolean;
  @Input() matterData: { branchId: number, appId: number, fileId: number };
  @Input() formControllersArray: ProbCategoryWishControllersData[];
  @Input() formControllersByCategory: ProbCategoryWishControllersData;
  @Input() formType: FormType;
  @Input() mode: Mode;
  @Input() dropDownCategory: ProbateCategoryList;
  @Input() selectedCategoty: CategoryItem;
  @Input() dataModel: EstateOverviewModel;
  @Input() gridDataModel: PaymentGridDataModel<EditPaymentGridData>[];
  @Input() contactDetails: ContactDetails;
  @Input() getSelectedRow: PaymentGridDataModel<EditPaymentGridData>;
  @Input() liabilityAsset: AssetItemForDropDown[];
  @Input() exemptionAsset: AssetItemForDropDown[];
  @Input() dealtBySellText: string;
  @Input() legacyPercentage: number;

  @Output() estateOverviewClose = new EventEmitter<any>();
  @Output() setSelectedCategoty = new EventEmitter<any>();
  @Output() inputValueChange = new EventEmitter<any>();
  @Output() masterValueChange = new EventEmitter<any>();
  @Output() paymentGridUpdate = new EventEmitter<any>();
  @Output() saveData = new EventEmitter<any>();
  @Output() removeContact = new EventEmitter<any>();
  @Output() updateContactData = new EventEmitter<any>();
  @Output() removeContactData = new EventEmitter<any>();
  @Output() updateGridData = new EventEmitter<any>();
  @Output() gridItemSelect = new EventEmitter<any>();
  @Output() deleteGridItem = new EventEmitter<any>();

  @Input() list: string;
  @Input() name: string;

  CommonControllerTypes = CommonControllerTypes;
  Mode = Mode;
  ProbateDealtBy = ProbateDealtBy;
  FormType = FormType;
  selectedCategoryWishControllersData: ProbCategoryWishControllersData;
  paymentGridColumns;
  jointAssetType = 'Bank and building society accounts';

  saleOfShareGridcolumns: TableColumn[] = [
    { name: 'ID', propertyName: 'id', width: '10%' },
    { name: 'Description', propertyName: 'description', width: '40%' },
    { name: 'No Shares', propertyName: 'noOfShares', width: '15%', textAlign: 'right' },
    { name: 'Date', propertyName: 'soldDate', width: '20%', isDate: true, dateFormat: 'dd/MM/yyyy' },
    { name: 'Amount', propertyName: 'amount', width: '15%', textAlign: 'right' },
  ];
  // lagacyGridcolumns: TableColumn[] = [
  //   { name: 'ID', propertyName: 'id', width: '10%' },
  //   { name: 'Description', propertyName: 'description', width: '40%' },
  //   { name: 'Precentage', propertyName: 'percent', width: '10%' },
  //   { name: 'Amount', propertyName: 'amount', width: '20%', textAlign: 'right' },
  //   { name: 'Contact', propertyName: 'contactId', width: '20%', textAlign: 'right' },
  // ];
  commonGridcolumns: TableColumn[] = [
    { name: 'ID', propertyName: 'id', width: '10%' },
    { name: 'Description', propertyName: 'description', width: '35%' },
    { name: 'Date', propertyName: 'soldDate', width: '15%', isDate: true, dateFormat: 'dd/MM/yyyy' },
    { name: 'Precentage', propertyName: 'percent', width: '10%' },
    { name: 'Amount', propertyName: 'amount', width: '15%', textAlign: 'right' },
    { name: 'Contact', propertyName: 'contactId', width: '15%', textAlign: 'right' },
  ];

  constructor(private popupService: SystemJsPopupLoaderService, private dialog: MatDialog) { }

  get categoryList() {
    if (this.formType && this.formType === FormType.Asset) {
      return this.dropDownCategory && this.dropDownCategory.assetCategories ?
        this.dropDownCategory.assetCategories.categories : [];
    } else if (this.formType && this.formType === FormType.Liability) {
      return this.dropDownCategory && this.dropDownCategory.liabilityCategories ?
        this.dropDownCategory.liabilityCategories.categories : [];
    } else if (this.formType && this.formType === FormType.Gift) {
      return this.dropDownCategory && this.dropDownCategory.giftCategories ?
        this.dropDownCategory.giftCategories.categories : [];
    } else if (this.formType && this.formType === FormType.Exemption) {
      return this.dropDownCategory && this.dropDownCategory.exemptionCategories ?
        this.dropDownCategory.exemptionCategories.categories : [];
    }
    return [];
  }
  get setSelectedCategory() {
    if (this.dropDownCategory) {
      if (this.selectedCategoty && this.formType === FormType.Asset) {
        return this.dropDownCategory.assetCategories.categories.find((item) => item.id === this.selectedCategoty.id);
      } else if (this.selectedCategoty && this.formType === FormType.Liability) {
        return this.dropDownCategory.liabilityCategories.categories.find((item) => item.id === this.selectedCategoty.id);
      } else if (this.selectedCategoty && this.formType === FormType.Gift) {
        return this.dropDownCategory.giftCategories.categories.find((item) => item.id === this.selectedCategoty.id);
      } else if (this.selectedCategoty && this.formType === FormType.Exemption) {
        return this.dropDownCategory.exemptionCategories.categories.find((item) => item.id === this.selectedCategoty.id);
      }
      return null;
    }
  }
  get checkdealByType() {
    let isRdbEnable = false;
    if (this.gridDataModel && this.gridDataModel.length) {
      isRdbEnable = this.gridDataModel.filter(item => item.data.dealtBy === 0 || item.data.dealtBy === 1).length > 0;
    }
    return isRdbEnable;
  }
  ngOnInit() {
    this.paymentGridColumns = this.commonGridcolumns;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataModel && changes.dataModel.currentValue.dealtBy !== undefined && changes.dataModel.currentValue.dealtBy !== null &&
      changes.dataModel.previousValue && changes.dataModel.previousValue.dealtBy !== changes.dataModel.currentValue.dealtBy) {
      if (changes.dataModel.currentValue.dealtBy === 0 && this.dealtBySellText === 'Sale of Share') {
        this.paymentGridColumns = this.saleOfShareGridcolumns;
      } else {
        this.paymentGridColumns = this.commonGridcolumns;
      }
    }
    if (changes.dataModel && changes.dataModel.currentValue.category &&
      changes.dataModel.previousValue && changes.dataModel.previousValue.category !== changes.dataModel.currentValue.category) {
      if (Object.values(SaleofShareCategoryCode).includes(this.selectedCategoty.id)) {
        this.paymentGridColumns = this.saleOfShareGridcolumns;
      } else {
        this.paymentGridColumns = this.commonGridcolumns;
      }
    }
  }
  onChangeProbateCategory(event: CategoryItem) {
    this.setSelectedCategoty.emit(event);
    // for validation
    this.inputValueChange.emit({ controllerType: CommonControllerTypes.DropDown, value: event.id, property: 'category' });
    // for data set
    this.masterValueChange.emit({ controllerType: CommonControllerTypes.DropDown, value: event.id, property: 'category' });
    if (event.id === 17) {
      this.masterValueChange.emit({ controllerType: CommonControllerTypes.CheckBox, value: true, property: 'charityExemption' });
    }
  }
  onValueChanged(event) {
    this.inputValueChange.emit(event);
  }
  onMasterValueChanged(type: CommonControllerTypes, value, modelName) {
    this.masterValueChange.emit({ controllerType: type, value: value, property: modelName });
  }
  onAddPayment(value) {
    this.paymentGridUpdate.emit(value);
  }
  onRadioButtonChanged(event) {
    this.masterValueChange.emit({ controllerType: CommonControllerTypes.RadioBtn, value: event.value, property: 'dealtBy' });
    if (this.dataModel && this.dataModel.probateTransId > 0) {
      this.saveData.emit(event);
    }
  }
  onSaveData(event) {
    const validInformation: ValidationInfo = this.requiredFieldValidation('description');
    if (validInformation.status) {
      this.saveData.emit(event);
    } else {
      showInforDialog(this.formType, validInformation.msg, InfoDialogType.alert, this.dialog);
    }
  }
  requiredFieldValidation(requiredField: any) {
    let validInformation: ValidationInfo;
    validInformation = {
      msg: 'Information is valid',
      status: true
    };
    if (!this.dataModel['description']) {
      validInformation = {
        msg: 'The Description cannot be empty!',
        status: false
      };
    } else if (this.dataModel['dealtBy'] !== 0 && !this.dataModel['dealtBy']) {
      validInformation = {
        msg: 'Please select the Dealt By value!',
        status: false
      };
    }
    return validInformation;
  }
  onRemoveContact(event) {
    this.removeContactData.emit(event);
  }
  onClose(event) {
    this.estateOverviewClose.emit({ event: event, isDirty: this.isDirty });
  }
  onGridRowDelete() {
    this.deleteGridItem.emit();
  }
  openPaymentPopup(paymentType: ProbateDealtBy, title: string) {
    const datePipe = new DatePipe('en-US');
    const matterInfo = {
      fileID: this.matterData.fileId,
      branchID: this.matterData.branchId,
      appId: this.matterData.appId,
      matterReferenceNo: null
    };
    let titePopup = '';
    if (paymentType === ProbateDealtBy.Sold) {
      titePopup = this.dealtBySellText;
    } else if (paymentType === ProbateDealtBy.Payment) {
      titePopup = 'Payment';
    } else if (paymentType === ProbateDealtBy.Receipt) {
      titePopup = 'Receipt';
    } else {
      titePopup = 'Legacy';
    }

    // 'dealtBySellText' -> this is dealt by text
    const probateTransId = (this.dataModel && this.dataModel.probateTransId) ? this.dataModel.probateTransId : 0;
    const legacyPercentageTot = this.legacyPercentage ? this.legacyPercentage : 0;

    this.popupService.openProbateAccountPopup('AssetProbateAccount', paymentType, titePopup, true, matterInfo, null, probateTransId,
      legacyPercentageTot
    ).subscribe((result: any) => {
      if (result && result.data && result.data.id) {
        const paymentGridMainItem: PaymentGridDataModel<EditPaymentGridData> = {
          data: result.data,
          rowId: result.data.id,
          selected: false
        };
        this.updateGridData.emit(paymentGridMainItem);
      }
    });
  }
  onRowClick(event) {
    this.gridItemSelect.emit(event.row);
  }
  onRowDblClick(event) {
    this.gridItemSelect.emit(event.row);
    const matterInfo = {
      fileID: this.matterData.fileId,
      branchID: this.matterData.branchId,
      appId: this.matterData.appId,
      matterReferenceNo: null
    };
    const probateTransId = (this.dataModel && this.dataModel.probateTransId) ? this.dataModel.probateTransId : 0;
    const legacyPercentageTot = this.legacyPercentage ? this.legacyPercentage : 0;

    const editData = {
      amount: event.row.data.amount,
      contactId: event.row.data.contactId,
      credit: event.row.data.amount,
      dealtBy: event.row.data.dealtBy,
      details: event.row.data.description,
      id: event.row.data.id,
      itemDescription: event.row.data.description,
      quantitySold: null,
      receiptType: event.row.data.receiptType,
      soldDate: event.row.data.soldDate,
      probateTransId: probateTransId,
      percent: event.row.data.percent,
      noOfShares: event.row.data.noOfShares,

      beneficiary: event.row.data.contactName,
      contactCompany: event.row.data.contactCompany,
      contactAddress1: event.row.data.contactAddress1,
      contactPostCode: event.row.data.contactPostCode,

    };
    let tite = '';
    if (event.row.data.dealtBy === ProbateDealtBy.Sold) {
      tite = this.dealtBySellText;
    } else if (event.row.data.dealtBy === ProbateDealtBy.Payment) {
      tite = 'Payment';
    } else if (event.row.data.dealtBy === ProbateDealtBy.Receipt) {
      tite = 'Receipt';
    } else {
      tite = 'Legacy';
    }
    this.popupService.openProbateAccountPopup('AssetProbateAccount', event.row.data.dealtBy, tite, true, matterInfo, editData,
      probateTransId, legacyPercentageTot).subscribe((result: any) => {
        if (result && result.data && result.data.id) {
          const paymentGridMainItem: PaymentGridDataModel<EditPaymentGridData> = {
            data: result.data,
            rowId: result.data.id,
            selected: false
          };
          this.updateGridData.emit(paymentGridMainItem);
        }
      });
  }
  onOpenAddContact(event) {
    const input: ContactCreateInputData = {
      matterInfo: {
        MatterReferenceNo: null,
        BranchId: this.matterData.branchId,
        AppId: this.matterData.appId,
        FileId: this.matterData.fileId,
        isLegalAid: false
      }
    };
    this.popupService.openContactsCreatePopup(`contactSearch:${input.matterInfo.MatterReferenceNo}`, input).
      subscribe(
        (result: any) => {
          if (result && result.contactId) {
            const contactDetails: ContactDetails = {
              contactId: result.contactId,
              letterTitle: '',
              name: result.name,
              address: result.address,
              postCode: result.postCode
            };
            this.updateContactData.emit(contactDetails);
            return '';
          }
        });
  }
}
