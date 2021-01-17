import { AccessControlService } from './../../../auth/services/access-control.service';
import { EventEmitter, Component, OnInit, OnChanges, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormDataModel } from '../../../e-chit-core/reducers/e-chit';
import { EchitModel, EchitCloseInfo, DisburcementValus, DropdownDisb, IncDisbuBreakDown, EChitPopupInput } from '../../../e-chit-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../../shell-desktop';
import { InforDialogComponent, InforDialogData, ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../../shared';
import { ChequeRequestType, EChitPopupInputType, DisbType } from '../../../e-chit-core/models/enum';
import { LedgerCardInput } from '../../../core/lib/ledger-card';
import { DatePipe } from '../../../../../node_modules/@angular/common';
import { filterClassType, filterAttTypeList } from '../../../core/lib/crime-managment';
import { AttType, AddTimeType } from './../../../core/lib/timeRecord';
import { ExtraEChitPopupInput, MatterRefData } from './../../../e-chit-core/models/interfaces';
import { ClassObj } from './../../../crime-management-core/models/interfaces';

@Component({
  selector: 'dps-e-chit-layout',
  templateUrl: './e-chit-layout.component.html',
  styleUrls: ['./e-chit-layout.component.scss']

})
export class EChitLayoutComponent implements OnInit, OnChanges {

  @Input() loading: boolean;
  @Input() formDataModel: FormDataModel;
  @Input() isDirty: boolean;
  @Input() model: EchitModel;
  @Input() sapullerVatCode: string;
  @Input() eChitType: ChequeRequestType;
  @Input() supplierDocEnables: boolean;
  @Input() matterDetailsName: string;
  @Input() isClose: boolean;
  @Input() matterRefData: MatterRefData;
  @Input() toMatterRefData: any;
  @Input() eChitOpenType: any;
  @Input() isSavingData: boolean;
  @Input() matterDisplyName: string;
  @Input() disbTotal: string;
  @Input() feeTotal: string;
  @Input() disburcementValu: DisburcementValus;
  @Input() selectedDisbuType: number;
  @Input() selectedWorkType: number;
  @Input() incDisbuBreakDown: IncDisbuBreakDown[];
  @Input() classType: ClassObj[];
  @Input() attTypeList: AttType[];
  @Input() inputData: EChitPopupInput;
  @Output() close = new EventEmitter<any>();
  @Output() save = new EventEmitter<string>();
  @Output() changeEChitType = new EventEmitter<string>();
  @Output() getMatterBalances = new EventEmitter<{ matterRef: string, controlName: string, matterDetailsName: string }>();
  @Output() addAttachment = new EventEmitter<File>();
  @Output() getSupplierVatCode = new EventEmitter<{ supplierRef: string }>();
  @Output() onEChitMatterSearchPopupOpen = new EventEmitter<{ text: string }>();
  @Output() onEChitToMatterSearchPopupOpen = new EventEmitter<{ text: string }>();
  @Output() changeDisbTypes = new EventEmitter<any>();
  @Output() changeDisbValue = new EventEmitter<any>();
  @Output() changeClassType = new EventEmitter<number>();
  @Output() changeWorkType = new EventEmitter<number>();
  @Output() changeExtraEChitPopupInput = new EventEmitter<ExtraEChitPopupInput>();


  toMatterDetails = '';
  feeEarner = '';
  echitForm: FormGroup;
  forcefeeEarnerSelectDataItem: any;
  chequeRequestType = ChequeRequestType;
  nominal = '';
  supplerName = '';
  feeEarnerName = '';
  isMatterPopupOpen = false;
  isToMatterPopupOpen = false;
  EChitPopupInputType = EChitPopupInputType;
  payeeList: string[] = [];
  reasonList: string[] = [];
  payerList: string[] = [];
  referencesList: string[] = [];
  timeRecordTypes = AddTimeType;

  constructor(private dialog: MatDialog, private dialogRef: MatDialogRef<EChitLayoutComponent>, private fb: FormBuilder,
    public popupService: SystemJsPopupLoaderService, private datePipe: DatePipe, private access: AccessControlService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.model && !changes.model.isFirstChange() && changes.model.currentValue) {
      this.updateFormValues();
    }

    if (changes.sapullerVatCode && !changes.sapullerVatCode.isFirstChange() && changes.sapullerVatCode.currentValue) {

      this.echitForm.get('vatCode').patchValue(changes.sapullerVatCode.currentValue);
      this.populateGrossAndVat(changes.sapullerVatCode.currentValue);
    }

    if (changes.isClose && !changes.isClose.isFirstChange() && changes.isClose.currentValue) {
      const saveData = this.getEchitSaveData();
      saveData['returnVariable'] = this.getVarVariableArray();
      this.dialogRef.close({ action: EchitCloseInfo.ExitWithSaveSuccess, data: saveData });
    }

    if (changes.matterRefData && !changes.matterRefData.isFirstChange() && changes.matterRefData.currentValue) {
      this.setMaterRefValues(changes.matterRefData.currentValue);
    }

    if (changes.toMatterRefData && !changes.toMatterRefData.isFirstChange() && changes.toMatterRefData.currentValue) {
      this.setToMatterref(changes.toMatterRefData.currentValue);
    }

    if (changes.formDataModel && !changes.formDataModel.isFirstChange() && changes.formDataModel.currentValue
      && this.eChitOpenType === EChitPopupInputType.Workflow) {

      if (this.formDataModel.feeEarnerList) {
        this.forcefeeEarnerSelectDataItem = { key: this.model.feeEarner, value: this.model.feeEarnerName };
        setTimeout(() => {
          this.feeEarner = this.model.feeEarner;
        }, 100);
      }

      if (this.formDataModel.vatCodeList) {
        this.netAmountChange();
      }

    }

    if (changes.formDataModel && changes.formDataModel.currentValue && this.formDataModel.payeeList) {
      //  this.payeeList = this.formDataModel.payeeList.map(item => item.sC_Desc);
      this.payeeList = this.formDataModel.payeeList.map(item => item.sC_Desc);
    }

    if (changes.formDataModel && changes.formDataModel.currentValue && this.formDataModel.reasonList) {
      //  this.payeeList = this.formDataModel.payeeList.map(item => item.sC_Desc);
      this.reasonList = this.formDataModel.reasonList.map(item => item.sC_Desc);
    }
    if (changes.formDataModel && changes.formDataModel.currentValue && this.formDataModel.payerList) {
      //  this.payeeList = this.formDataModel.payeeList.map(item => item.sC_Desc);
      this.payerList = this.formDataModel.payerList.map(item => item.sC_Desc);
    }

    if (changes.formDataModel && changes.formDataModel.currentValue && this.formDataModel.referencesList) {
      //  this.payeeList = this.formDataModel.payeeList.map(item => item.sC_Desc);
      this.referencesList = this.formDataModel.referencesList;
    }

  }


  updateFormValues() {
    this.echitForm.get('supplier').patchValue(this.model.supplier);
    this.echitForm.get('net').patchValue(this.model.net);
    this.echitForm.get('isAlternativeCommand').patchValue(this.model.isAlternativeCommand);
    this.echitForm.get('vatAmount').patchValue(this.model.vatAmount);
    this.echitForm.get('vatCode').patchValue(this.model.vatCode);
    this.echitForm.get('payee').patchValue(this.model.payee);
    this.echitForm.get('payer').patchValue(this.model.payer);
    this.echitForm.get('feeEarner').patchValue(this.model.feeEarner);
    this.echitForm.get('dateRequired').patchValue(this.model.dateRequired);
    this.echitForm.get('reason').patchValue(this.model.reason);
    this.echitForm.get('reference').patchValue(this.model.reference);
    this.echitForm.get('supplierSearch').patchValue(this.model.supplierSearch);
    this.echitForm.get('notes').patchValue(this.model.notes);
    this.echitForm.get('receiptType').patchValue(this.model.receiptType);
    this.echitForm.get('matterRef').patchValue(this.model.matterRef);
    this.echitForm.get('toMatterRef').patchValue(this.model.toMatterRef);
    this.echitForm.get('textRef').patchValue(this.model.textRef);
    this.echitForm.get('isCouncelFees').patchValue(this.model.isCouncelFees);
    this.echitForm.get('isIncludeSupplier').patchValue(this.model.isIncludeSupplier);
    this.echitForm.get('bankAccountName').patchValue(this.model.bankAccountName);
    this.echitForm.get('bankAcc').patchValue(this.model.bankAcc);
    this.echitForm.get('bankSortCode').patchValue(this.model.bankSortCode);
    this.echitForm.get('gross').patchValue(this.model.gross);
    this.echitForm.get('rate').patchValue(this.model.rate);
    this.echitForm.get('nominal').patchValue(this.model.nominal);
    this.echitForm.get('branch').patchValue(this.model.branch);
    this.echitForm.get('path').patchValue(this.model.path);
    this.echitForm.get('invoiceRef').patchValue(this.model.invoiceRef);
    this.echitForm.get('classId').patchValue(this.model.classId);
    this.echitForm.get('subClassId').patchValue(this.model.subClassId);
    this.echitForm.get('telephoneAdvice').patchValue(this.model.telephoneAdvice);
    this.echitForm.get('fee').patchValue(this.model.fee);
    this.echitForm.get('disbType').patchValue(this.model.disbType);
    this.echitForm.get('workType').patchValue(this.model.workType);

    this.feeEarner = this.model.feeEarner;
    this.nominal = this.model.nominal;

    this.toMatterDetails = '';




  }


  ngOnInit() {
    this.echitForm = this.fb.group({

      typeValue: this.model.typeValue,
      supplier: this.model.supplier,
      net: this.model.net,
      isAlternativeCommand: this.model.isAlternativeCommand,
      vatAmount: this.model.vatAmount,
      vatCode: this.model.vatCode,
      payee: this.model.payee,
      payer: this.model.payer,
      feeEarner: this.model.feeEarner,
      dateRequired: this.model.dateRequired,
      reason: this.model.reason,
      reference: this.model.reference,

      supplierSearch: this.model.supplierSearch,
      notes: this.model.notes,
      invoiceRef: this.model.invoiceRef,
      receiptType: this.model.receiptType,
      matterRef: this.model.matterRef,
      toMatterRef: this.model.toMatterRef,
      textRef: this.model.textRef,

      isCouncelFees: this.model.isCouncelFees,
      isIncludeSupplier: this.model.isIncludeSupplier,
      bankAccountName: this.model.bankAccountName,
      bankAcc: this.model.bankAcc,
      bankSortCode: this.model.bankSortCode,

      gross: this.model.gross,
      rate: this.model.rate,

      nominal: this.model.nominal,
      branch: this.model.branch,
      path: this.model.path,

      classId: this.model.classId,
      subClassId: this.model.subClassId,
      telephoneAdvice: this.model.telephoneAdvice,
      fee: this.model.fee,
      disbType: this.model.disbType,
      workType: this.model.workType,


      // clearType: this.model.clearType,
      // bankNominal: this.model.bankNominal,
    });


    this.echitForm.get('rate').disable();
    this.echitForm.get('gross').disable();
    this.echitForm.get('path').disable();


    if (!this.model.matterRef) {
      // set firest item select
      this.echitForm.get('typeValue').patchValue(ChequeRequestType.DPU);
      this.onChangeEChitType({ value: ChequeRequestType.DPU });
    }

    if (this.eChitOpenType === EChitPopupInputType.Workflow) {
      this.echitForm.get('matterRef').disable();
      // if (this.model.typeValue) {
      //   this.echitForm.get('typeValue').disable();
      //   this.changeEChitType.emit(this.model.typeValue);
      // }
    }



  }



  onChangeEChitType($event) {
    if ($event['value'] === ChequeRequestType.PIN) {
      this.echitForm.get('isIncludeSupplier').disable();
    } else {
      this.echitForm.get('isIncludeSupplier').enable();
    }
    this.changeEChitType.emit($event.value);
  }



  onChangeVATCode($event) {
    this.populateGrossAndVat($event.value);
  }



  populateGrossAndVat(vatCode) {

    const item = this.formDataModel.vatCodeList.filter((vatitem) => vatitem.vatCode === vatCode)[0];

    let netAmount = 0;
    let vatAmount = 0;
    let grossAmount = 0;
    if (this.echitForm.value.net) {
      netAmount = +this.echitForm.value.net;
    }
    if ((this.inputData && this.inputData.matterEBilling === 'PrecedentH') &&
      (this.selectedDisbuType && this.selectedDisbuType === 100 && this.echitForm.value.fee)) {
      netAmount = this.echitForm.value.net + this.echitForm.value.fee;

    }

    if (item) {
      this.echitForm.get('rate').patchValue(item.vatRate);
      vatAmount = netAmount / 100 * parseInt(item.vatRate, 10);
      this.echitForm.get('vatAmount').patchValue(vatAmount.toFixed(2));
      grossAmount = netAmount + vatAmount;
      this.echitForm.get('gross').patchValue(grossAmount.toFixed(2));
    }

  }


  netAmountChange() {
    this.populateGrossAndVat(this.echitForm.value.vatCode);
    this.populateGross();
  }


  populateGross() {


    let netAmount = 0;
    let vatAmount = 0;
    let grossAmount = 0;

    if (this.echitForm.value.net) {
      netAmount = this.echitForm.value.net;
    }
    if ((this.inputData && this.inputData.matterEBilling === 'PrecedentH') &&
      this.selectedDisbuType && this.selectedDisbuType === 100 && this.echitForm.value.fee) {
      netAmount = this.echitForm.value.net + this.echitForm.value.fee;
    }

    if (this.echitForm.value.vatAmount) {
      vatAmount = parseInt(this.echitForm.value.vatAmount, 10);
    }

    grossAmount = netAmount + vatAmount;
    this.echitForm.get('gross').patchValue(grossAmount.toFixed(2));

  }


  onIncludeSupplier($event) {
    if ($event.checked) {
      this.echitForm.get('supplier').enable();
    } else {
      this.echitForm.get('supplier').disable();
      this.echitForm.get('supplier').patchValue('');
    }
  }

  onChangeReference($event) {

  }
  onChangeClearanceTypes($event) {

  }
  updateSearchState() {
  }

  onSaveAndNew(event) {
  }


  echitFormKeypress(event: any) {
    if (event.charCode === 13) {
      event.stopPropagation();
      return false;
    }
  }

  onMatterSearchKeypress(event) {
    if (event.charCode === 13) {
      this.onMatterSearch();
    }
  }

  onToMatterSearchKeypress(event) {
    if (event.charCode === 13) {
      this.onToMatterSearch();
    }
  }

  openSupplerKeypress(event) {
    if (event.charCode === 13) {
      this.openSuppler(this.echitForm.value.supplier);
    }
  }

  onFromMatterSearchBlur(event) {
    if (this.echitForm.get('matterRef').value && !this.isMatterPopupOpen &&
      !(event.relatedTarget && event.relatedTarget.type && event.relatedTarget.type === 'submit') &&
      !(event.relatedTarget && event.relatedTarget.firstElementChild
        && event.relatedTarget.firstElementChild.nodeName && event.relatedTarget.firstElementChild.nodeName === 'DPS-INFOR-DIALOG')
    ) {

      this.onEChitMatterSearchPopupOpen.emit({ text: this.echitForm.get('matterRef').value });
    }
  }
  onToMatterSearchBlur(event) {
    if (this.echitForm.get('toMatterRef').value && !this.isToMatterPopupOpen
      && event.relatedTarget.type !== 'submit') {
      this.onEChitToMatterSearchPopupOpen.emit({ text: this.echitForm.get('toMatterRef').value });
    }
  }

  onMatterSearch() {
    if (!this.isMatterPopupOpen) {
      this.popupService.openMatterByClientPopup('E-Chit-Matter-Search', { clientRef: this.echitForm.get('matterRef').value }
      ).subscribe((result) => {
        this.setMaterRefValues(result);
        this.isMatterPopupOpen = false;
      });
      this.isMatterPopupOpen = true;
    }
  }

  onToMatterSearch() {
    if (!this.isToMatterPopupOpen) {
      this.popupService.openMatterByClientPopup('E-Chit-Matter-Search', { clientRef: this.echitForm.get('toMatterRef').value }
      ).subscribe((result) => {
        this.setToMatterref(result);
        this.isToMatterPopupOpen = false;
      });
      this.isToMatterPopupOpen = true;
    }
  }

  setMaterRefValues(result) {

    if (result && result.matterRef) {
      const extraData: ExtraEChitPopupInput = {
        appCode: result.appCode,
        matterEBilling: result.matterEBilling,
        matterIsLegalAid: result.matterIsLegalAid,
        branchId: result.branchId,
        appId: result.appId,
        fileId: result.fileId
      };
      if (!!extraData.appCode) {
        this.changeExtraEChitPopupInput.emit(extraData);
      }
      this.echitForm.get('feeEarner').patchValue(result.feeEarner);
      this.echitForm.get('matterRef').patchValue(result.matterRef);

      this.forcefeeEarnerSelectDataItem = { key: result.feeEarner, value: result.accountName };
      setTimeout(() => {
        this.feeEarner = result.feeEarner;
      }, 10);
      const matterDetails = ((result.accountName || '') + (result.details || '')).replace('&', '&&');
      this.getMatterBalances.emit({ controlName: 'matterRef', matterRef: result.matterRef, matterDetailsName: matterDetails });
      const typeValue = this.echitForm.get('typeValue').value;
      if (typeValue === 'CTO' || typeValue === 'OTC' || typeValue === 'CTD' || typeValue === 'DTC') {
        this.echitForm.get('toMatterRef').patchValue(result.matterRef);
      }
    } else {
      if (result && this.echitForm.value.matterRef) {
        const mgsMatterRef = (this.formDataModel.toMatterRefVisible) ? 'From ' + this.matterDisplyName : this.matterDisplyName + ' Ref';
        const mgs = 'Invalid ' + mgsMatterRef;
        this.openMSGPopup(mgs, 'alert');
      }
    }

  }

  setToMatterref(result) {
    if (result && result.matterRef) {
      this.echitForm.get('toMatterRef').patchValue(result.matterRef);
      this.getMatterBalances.emit({
        controlName: 'toMatterRef', matterRef: result.matterRef,
        matterDetailsName: this.matterDetailsName
      });
      this.toMatterDetails = ((result.accountName || '') + (result.details || '')).replace('&', '&&');
    } else {
      if (result && this.echitForm.value.toMatterRef) {
        const mgs = 'Invalid To' + this.matterDisplyName + ' Ref';
        this.openMSGPopup(mgs, 'alert');
      }
    }
  }




  onClose(event: Event) {

    if (this.formIsDirty()) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Confirm . . .',
          message: 'Changes have been made! Do you want to go back and save them?',
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogPopupRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });

      dialogPopupRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
          this.close.emit();
          this.dialogRef.close({ action: EchitCloseInfo.ExitByUser, data: null });
        }
      });
    } else {
      this.close.emit();
      this.dialogRef.close({ action: EchitCloseInfo.ExitByUser, data: null });
    }
  }

  // onClose() {
  //   this.dialogRef.close();
  //   this.close.emit();
  // }
  onOpenLedgerCard() {
    const ledgerCardToken = 'matterCreationLedgerCardPopup(' + this.echitForm.value.matterRef + ')';
    const input: LedgerCardInput = {
      matterRef: this.echitForm.getRawValue().matterRef,
    };
    this.popupService.openLedgerCardPopup(ledgerCardToken, input);
  }
  openSuppler(text) {

    this.popupService.openGeneralPopup('Echit-General-Popup', text)
      .subscribe((result: any) => {
        if (result) {
          this.echitForm.get('supplier').patchValue(result.puR_Account_Ref);
          this.getSupplierVatCode.emit({ supplierRef: result.puR_Account_Ref });
          this.supplerName = result.puR_Account_Name;
          return '';
        }
      });
  }
  onFeeEarnerChange(event) {
    this.echitForm.get('feeEarner').patchValue(event.value);
    this.feeEarner = event.value;
    if (event.source && event.source.triggerValue &&
      event.source.triggerValue.split('|')[1]) {
      this.feeEarnerName = event.source.triggerValue.split('|')[1].trim();
    }
  }
  onNominalChange(event) {
    this.echitForm.get('nominal').patchValue(event);
    this.nominal = event;
  }
  onSubmit() {

    if (this.checkPosting()) {
      const saveData = this.getEchitSaveData();
      saveData['isCheckSameAmount'] = true;
      this.save.emit(saveData);
    }
  }
  getEchitSaveData() {
    if (this.formDataModel.supplierVisible && this.echitForm.value.supplier) {
      this.echitForm.value.supplierRef = this.echitForm.value.supplier;
    }
    if (this.formDataModel.toMatterRefVisible) {
      this.echitForm.value.supplierRef = this.echitForm.value.toMatterRef;
    }
    if (this.formDataModel.nominalVisible) {
      this.echitForm.value.supplierRef = this.echitForm.value.nominal;
    }

    if (this.echitForm.value.typeValue === ChequeRequestType.PIN) {
      this.echitForm.value['isIncludeSupplier'] = true;
    }
    if ((this.inputData && this.inputData.matterEBilling === 'PrecedentH') &&
      (this.echitForm.value.typeValue === ChequeRequestType.DUU || this.echitForm.value.typeValue === ChequeRequestType.DPU)
      && (this.selectedDisbuType && this.selectedDisbuType === 100)) {
      this.echitForm.value['net'] = this.echitForm.value.net + this.echitForm.value.fee;

    }
    // if ((this.inputData && this.inputData.matterEBilling === 'PrecedentH') &&
    //   (this.echitForm.value.typeValue === ChequeRequestType.DUU || this.echitForm.value.typeValue === ChequeRequestType.DPU)) {

    //   this.echitForm.value['cqType'] = this.echitForm.value.disbType;
    //   this.echitForm.value['subClassId'] = this.echitForm.value.workType;
    // }

    if (!this.echitForm.value['supplier']) {
      this.echitForm.value['supplierRef'] = '';
      this.echitForm.value['supplier'] = '';
    }

    this.echitForm.value['matterRef'] = this.getMaterRefValue();
    this.echitForm.value.notes = this.getNoteValue();

    this.echitForm.value['rate'] = this.echitForm.getRawValue().rate;
    console.log('e-chit Post Values ', this.echitForm.value);
    return this.echitForm.value;
  }

  getNoteValue(): string {

    if (this.formDataModel.banckDetailVisible) {

      let noteValue = this.echitForm.value.notes;

      if (this.echitForm.value.bankSortCode.trim() !== '') {
        noteValue = 'Sort Code: ' + this.echitForm.value.bankSortCode + '\r\n' + noteValue;
      }
      if (this.echitForm.value.bankAcc.trim() !== '') {
        noteValue = 'Account Number: ' + this.echitForm.value.bankAcc + '\r\n' + noteValue;
      }
      if (this.echitForm.value.bankAccountName.trim() !== '') {
        noteValue = 'Bank Name: ' + this.echitForm.value.bankAccountName + '\r\n' + noteValue;
      }


      return noteValue;

    } else {

      return this.echitForm.value.notes;

    }
  }

  getMaterRefValue() {
    if (this.echitForm.value.typeValue === ChequeRequestType.PIN) {
      // (None)
      return '(None)';
    } else {
      return this.echitForm.getRawValue().matterRef;
    }
  }


  // FillReturnArray
  getVarVariableArray() {

    const variables = [];
    // this.getEchitSaveData();

    variables[0] = '';
    if (this.echitForm.value['typeValue']) {
      const data = this.formDataModel.eChitTypeList.filter((item) => item.key === this.echitForm.value['typeValue']);
      variables[0] = data[0].value;
    }

    variables[1] = this.getMaterRefValue();
    variables[2] = this.echitForm.value['nominal'];
    variables[3] = this.echitForm.value['toMatterRef'];
    variables[4] = this.echitForm.value['invoiceRef'];

    if (this.formDataModel.textRefVisible) {
      variables[5] = this.echitForm.value['textRef'];
    } else if (this.formDataModel.referenceVisible) {
      variables[5] = this.echitForm.value['reference'];
    } else {
      variables[5] = '';
    }
    variables[6] = this.echitForm.value['receiptType'];
    variables[7] = this.echitForm.getRawValue().supplier;
    variables[8] = this.supplerName;
    variables[9] = this.echitForm.value['payee'];
    variables[10] = this.echitForm.value['feeEarner'];
    variables[11] = this.feeEarnerName;
    variables[12] = this.echitForm.value['reason'];
    variables[13] = this.datePipe.transform(this.echitForm.value['dateRequired'], 'dd/MM/yyyy');
    variables[14] = this.echitForm.value['net'];
    variables[15] = this.echitForm.value['vatCode'];
    variables[16] = this.echitForm.getRawValue().rate;
    variables[17] = this.echitForm.value['vatAmount'];
    variables[18] = this.echitForm.getRawValue().gross;
    variables[19] = this.getNoteValue();

    const variablesData = variables.map((item) => item ? item : '');
    console.log('e-chit var variables array ', variablesData);
    return variablesData;
  }
  checkPosting(): boolean {
    let message = '';
    if (!this.echitForm.value.typeValue) {
      message += 'Please select cheque request type';
    }
    if (this.formDataModel.matterRefVisible) {
      if (!this.echitForm.getRawValue().matterRef) {
        message += 'Please select ' + this.matterDisplyName + '<br>';
      }
    }
    if (this.formDataModel.toMatterRefVisible) {
      if (!this.echitForm.value.toMatterRef) {
        message += 'Please select TO' + this.matterDisplyName + ' Ref <br>';
      }
    }
    if (this.formDataModel.textRefVisible) {
      if (!this.echitForm.value.textRef) {
        message += 'Please enter ' + this.formDataModel.referenceText + ' ' + '<br>';
      }
    }
    if (this.formDataModel.referenceVisible) {
      if (!this.echitForm.value.reference) {
        message += 'Please enter reference ' + '<br>';
      }
    }
    if (this.formDataModel.payeeVisible) {
      if (!this.echitForm.value.payee) {
        message += 'Please enter payee' + '<br>';
      }
    }
    if (this.formDataModel.payerVisible) {
      if (!this.echitForm.value.payer) {
        message += 'Please enter payer' + '<br>';
      }
    }
    if (this.formDataModel.feeEarnerVisible) {
      if (!this.echitForm.value.feeEarner) {
        message += 'Please enter fee earner' + '<br>';
      }
    }
    if (!this.echitForm.value.reason) {
      message += 'Please enter details/reason' + '<br>';
    }
    if (this.formDataModel.netVisible) {
      if (!this.echitForm.value.net || (this.echitForm.value.net < 0)) {
        message += 'Please enter valid net amount' + '<br>';
      }
    }
    if (this.formDataModel.isVatVisible) {
      if (!this.echitForm.value.vatCode) {
        message += 'Please select vat code' + '<br>';
      }
    }
    if (this.formDataModel.receiptTypeVisible) {
      if (!this.echitForm.value.receiptType) {
        message += 'Please select receipt type' + '<br>';
      }
    }
    if (this.formDataModel.isVatVisible) {
      if (!this.echitForm.value.vatAmount) {
        message += 'Please enter valid vat amount' + '<br>';
      }
    }
    if ((this.inputData && this.inputData.matterEBilling === 'PrecedentH')
      && this.eChitType && (this.eChitType === 'DUU' || this.eChitType === 'DPU')) {
      if (!this.echitForm.value.disbType) {
        message += 'Please enter Disb. Type' + '<br>';
      }
    }
    if ((this.inputData && this.inputData.matterEBilling === 'PrecedentH')
      && this.eChitType && (this.eChitType === 'DUU' || this.eChitType === 'DPU')) {
      if (!this.echitForm.value.workType) {
        message += 'Please enter Work Type' + '<br>';
      }
    }
    if (this.formDataModel.nominalVisible) {
      if (!this.echitForm.value.nominal) {
        message += 'Please select nominal' + '<br>';
      }
    }
    if (this.formDataModel.invoiceRefVisible) {
      if (!this.echitForm.value.invoiceRef) {
        message += 'Please select ' + this.formDataModel.invoiceRefText + '<br>';
      }
    }
    if (this.formDataModel.isIncludeSupplierVisible) {
      if (this.echitForm.value.isIncludeSupplier === true && !this.echitForm.value.supplier) {
        message += 'Please select supplier';
      }
    }
    if (this.formDataModel.branchVisible) {
      if (!this.echitForm.value.branch) {
        message += 'Please select branch' + '<br>';
      }
    }
    if (this.echitForm.value.typeValue === ChequeRequestType.OTO
      || this.echitForm.value.typeValue === ChequeRequestType.CTC) {
      if (this.echitForm.value.toMatterRef === this.echitForm.getRawValue().matterRef) {
        message += 'From and To ' + this.matterDisplyName + ' cannot be same' + '<br>';
      }
    }
    const noteValue = this.getNoteValue();
    if (message) {
      this.openMSGPopup(message, 'alert');
      return false;
    } else if (noteValue.length > 300) {

      message = 'Generated Note value length exceeded' + '<br>' + 'Please reduce the Note value';
      //  + '<br>' +  '  "'  + noteValue +  '"  '
      this.openMSGPopup(message, 'alert');
      return false;
    }
    return true;
  }
  openMSGPopup(msg, type) {
    const dialogData: InforDialogData = {
      content: {
        title: 'E-chit',
        message: msg
      },
      data: { messageType: type }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      // if (isClose) {
      //   this.close.emit(TimeRecordingCloseInfo.ExitWithSaveSuccess);
      // }
    });
  }

  onAddAttachment(files: File[]) {
    this.addAttachment.emit(files[0]);
    this.echitForm.get('path').patchValue(files[0].name);
  }
  onChangeDisbType(event) {
    this.changeDisbTypes.emit({ value: event.value, kind: 'DISB_TYPE', feeEarner: this.feeEarner });
    this.echitForm.get('fee').patchValue(0.00);
    this.echitForm.get('gross').patchValue(0.00);
    this.echitForm.get('net').patchValue(0.00);
  }
  onChangeDisbWorkType(event) {
    this.changeDisbTypes.emit({ value: event.value, kind: 'WORK_TYPE', feeEarner: this.feeEarner });
  }

  formIsDirty() {

    if (this.echitForm.value.supplier === this.model.supplier &&
      this.echitForm.value.net === this.model.net &&
      this.echitForm.value.isAlternativeCommand === this.model.isAlternativeCommand &&
      this.echitForm.value.vatAmount === this.model.vatAmount &&
      this.echitForm.value.vatCode === this.model.vatCode &&
      this.echitForm.value.payee === this.model.payee &&
      this.echitForm.value.payer === this.model.payer &&
      this.echitForm.value.feeEarner === this.model.feeEarner &&
      this.echitForm.value.dateRequired === this.model.dateRequired &&
      this.echitForm.value.reason === this.model.reason &&
      this.echitForm.value.reference === this.model.reference &&
      this.echitForm.value.supplierSearch === this.model.supplierSearch &&
      this.echitForm.value.notes === this.model.notes &&
      this.echitForm.value.receiptType === this.model.receiptType &&
      this.echitForm.getRawValue().matterRef === this.model.matterRef &&
      this.echitForm.value.toMatterRef === this.model.toMatterRef &&
      this.echitForm.value.textRef === this.model.textRef &&
      this.echitForm.value.isCouncelFees === this.model.isCouncelFees &&
      this.echitForm.value.isIncludeSupplier === this.model.isIncludeSupplier &&
      this.echitForm.value.bankAccountName === this.model.bankAccountName &&
      this.echitForm.value.bankAcc === this.model.bankAcc &&
      this.echitForm.value.bankSortCode === this.model.bankSortCode &&
      this.echitForm.value.nominal === this.model.nominal &&
      this.echitForm.value.branch === this.model.branch &&
      this.echitForm.value.invoiceRef === this.model.invoiceRef &&
      this.echitForm.value.classId === this.model.classId &&
      this.echitForm.value.subClassId === this.model.subClassId &&
      this.echitForm.value.telephoneAdvice === this.model.telephoneAdvice) {

      return false;
    }
    return true;
  }


  onChangeDisbValue(event, kind) {
    this.changeDisbValue.emit({ value: event, kind: kind, feeEarner: this.feeEarner });

    this.populateGrossAndVat(this.echitForm.value.vatCode);
    this.populateGross();
  }
  // getFeeLable() {
  //   if (this.eChitType && (this.eChitType === 'DUU' || this.eChitType === 'DPU')) {
  //     // type : 102 incDisb : 150
  //     let lable = { message: null, type: 'C' };
  //     let workTypeCostLimit = 0;
  //     let preHDisbTotal = 0;
  //     let limitAmtAvail = 0;
  //     const preHFeeType = 98;

  //     let limitPctReached = 100;
  //     const workTypeList = this.formDataModel.precedentHDisbursment.workTypeList;
  //     // this.selectedDisbuType     //this.selectedDisbuType
  //     //  this.disburcementValu.disbuValue;    this.disburcementValu.disbuVat;
  //     //    this.disburcementValu.feeValue;   this.disburcementValu.feeVat;
  //     if (this.incDisbuBreakDown && workTypeList && this.selectedWorkType) {
  //       // this.disbTotal
  //       // this.feeTotal;
  //       if (this.incDisbuBreakDown.find(a => a.type === preHFeeType)) {
  //         preHDisbTotal = this.incDisbuBreakDown.find(a => a.type === preHFeeType).incDisb;
  //       }
  //       if (workTypeList.find(a => a.workTypeID === this.selectedWorkType)) {
  //         workTypeCostLimit = workTypeList.find(a => a.workTypeID === this.selectedWorkType).expFee;
  //       }

  //       if (workTypeCostLimit > 0) {
  //         limitPctReached = Number(preHDisbTotal) / Number(workTypeCostLimit) * 100;
  //         limitAmtAvail = Number(workTypeCostLimit) - Number(preHDisbTotal);



  //         if (limitPctReached <= 90) {
  //           // orange

  //           // lable = limitPctReached + '% of Limit ( ' + workTypeCostLimit + ') reached';
  //           lable = {
  //             message: Number(limitPctReached).toFixed(2) + '% of Limit ( ' + Number(workTypeCostLimit).toFixed(2) + ') reached',
  //             type: 'A'
  //           };

  //         }

  //         if (limitPctReached <= 60) {
  //           // green
  //           // lable = limitPctReached + '% of Limit ( ' + workTypeCostLimit + ') reached';
  //           lable = {
  //             message: Number(limitPctReached).toFixed(2) + '% of Limit ( ' + Number(workTypeCostLimit).toFixed(2) + ') reached',
  //             type: 'B'
  //           };


  //         }
  //       }
  //       return lable;
  //     }


  //   }

  // }


  // getDisbLable() {
  //   if (this.eChitType && (this.eChitType === 'DUU' || this.eChitType === 'DPU')) {
  //     // type : 102 incDisb : 150
  //     let lable = { message: null, type: 'C' };
  //     let workTypeCostLimit = 0;
  //     let preHDisbTotal = 0;
  //     let limitAmtAvail = 0;
  //     const preHDisbType = 99;
  //     let limitPctReached = 100;

  //     const workTypeList = this.formDataModel.precedentHDisbursment.workTypeList;
  //     // this.selectedDisbuType     //this.selectedDisbuType
  //     //  this.disburcementValu.disbuValue;    this.disburcementValu.disbuVat;
  //     //    this.disburcementValu.feeValue;   this.disburcementValu.feeVat;
  //     if (this.incDisbuBreakDown && workTypeList && this.selectedWorkType) {
  //       // this.disbTotal
  //       // this.feeTotal;
  //       if (this.incDisbuBreakDown.find(a => a.type === preHDisbType)) {
  //         preHDisbTotal = this.incDisbuBreakDown.find(a => a.type === preHDisbType).incDisb;
  //       }
  //       // switch ()(selectedDisbType)

  //       switch (this.selectedDisbuType) {
  //         case DisbType.PrcdntH_ExpertCost:   // expertCost

  //           workTypeCostLimit = workTypeList.find(a => a.workTypeID === this.selectedWorkType).expDisb;

  //           break;
  //         case DisbType.PrcdntH_CourtFees:     // court fee

  //           workTypeCostLimit = workTypeList.find(a => a.workTypeID === this.selectedWorkType).courtFee;

  //           break;
  //         case DisbType.PrcdntH_JuniorCounsel:     // juniorCLFee

  //           workTypeCostLimit = workTypeList.find(a => a.workTypeID === this.selectedWorkType).juniorCLFee;

  //           break;
  //         case DisbType.PrcdntH_LeadingCounsel:      // juniorCLFee

  //           workTypeCostLimit = workTypeList.find(a => a.workTypeID === this.selectedWorkType).leadClFee;

  //           break;
  //         case DisbType.PrcdntH_OtherDisb:      // juniorCLFee

  //           workTypeCostLimit = workTypeList.find(a => a.workTypeID === this.selectedWorkType).otherDisbs;

  //           break;
  //         default:
  //           break;
  //       }





  //       if (workTypeCostLimit > 0) {
  //         limitPctReached = Number(preHDisbTotal) / Number(workTypeCostLimit) * 100;
  //         limitAmtAvail = Number(workTypeCostLimit) - Number(preHDisbTotal);



  //         if (limitPctReached <= 90) {
  //           // orange

  //           // lable = limitPctReached + '% of Limit ( ' + workTypeCostLimit + ') reached';
  //           lable = {
  //             message: Number(limitPctReached).toFixed(2) + '% of Limit ( ' + Number(workTypeCostLimit).toFixed(2) + ') reached',
  //             type: 'A'
  //           };

  //         }

  //         if (limitPctReached <= 60) {
  //           // green
  //           lable = {
  //             message: Number(limitPctReached).toFixed(2) + '% of Limit ( ' + Number(workTypeCostLimit).toFixed(2) + ') reached',
  //             type: 'B'
  //           };

  //         }
  //       }
  //     }

  //     return lable;
  //   }

  // }

  get filterClassType() {
    return filterClassType(this.classType);
  }
  get filterAttTypeList() {
    if (this.echitForm && this.echitForm.value && this.echitForm.value.classId) {
      return filterAttTypeList(this.attTypeList, this.echitForm.value.classId);
    }
    return [];
  }
  onChangeClassType(classId: number) {
    this.changeClassType.emit(classId);
  }
  onChangeSubClass(subClassId: number) {
    this.changeWorkType.emit(subClassId);
  }
  get isVisibleTelephoneAdvice() {
    if (this.echitForm.value.classId === 3 && this.echitForm.value.subClassId === 2) {
      return true;
    }
    return false;
  }
  get timeRecordType() {
    if (this.inputData) {
      return this.access.checkTimeRecordType(this.inputData.appCode, this.inputData.matterEBilling, this.inputData.matterIsLegalAid);
    }
  }
  // onBanckSearch() {
  //   this.popupService.banckDetailsSearchPoup('E-Chit-Banck-Search', { clientRef: '' }
  //   ).subscribe((result) => {
  //     alert(result);
  //   });
  // }

}
