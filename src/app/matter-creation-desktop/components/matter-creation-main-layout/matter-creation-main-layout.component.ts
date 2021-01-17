import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ScreenEditComponentTreeData, DropdownListData, Mode } from '../../../core';
import { createDefultColumnDef } from '../../../core/lib/grid-helpers';
import { ColumnDef } from '../../../core/lib/grid-model';
import { ControllerType } from '../../../editable-control-base/models/enums';
import { PageEvent, MatDialog, MatSelect } from '@angular/material';
import { Matter, ClientContackLinkDetailViewModel, FullMatterViewModel } from '../../../matter-creation-core/models/interfaces';
import { ConflictCheckType, ConflictSearchOpenFrom } from '../../../conflict-search-core/models/enum';
import { LedgerCardInput } from '../../../core/lib/ledger-card';
import {
  ConfirmDialogData, ConfirmDialogWithCancelResultKind, ConfirmDialogResultKind,
  InforDialogData
} from '../../../shared/models/dialog';
import { ConfirmDialogComponentWithCancel, ConfirmDialogComponent, InforDialogComponent } from '../../../shared';
import { DatePipe } from '@angular/common';
import { MatterInfo } from '../../../chaser-core/models/interfaces';
import { uuid } from '../../../utils/uuid';
import { ClientPopupType } from './../../../client-search-core/models/enums';
import { MainMenuItem } from './../../../layout-desktop/models/interfaces';
import { MatterLinkedType } from '../../../matter-linked-core';
import { dpsNewDate } from '../../../utils/javascriptDate';
import { Address, TableColumn, TableRow } from './../../../shared/models/interface';
import { User } from './../../../auth/models/auth';
import { combineStirng, showConfirmDialog } from '../../../core/utility/DpsUtility';
import { MasterDataViewModel, DepartmentWithMatterAndAppCode, FeeEarnerInfo } from '../../../shared-data/model/interface';
import { MatterInfomation, DocRegisterGridRowItemWrapper, MatterModel, CloserProcessing } from '../../../matter-creation-core';
import { MatterInputData } from '../../../core/lib/matter';
import { ClientSearchPopupData } from '../../../client-search-core/models/interfaces';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';

@Component({
  selector: 'dps-matter-creation-main-layout',
  templateUrl: './matter-creation-main-layout.component.html',
  styleUrls: ['./matter-creation-main-layout.component.scss']
})

export class MatterCreationMainLayoutComponent implements OnInit, OnChanges {

  @Input() matterCreationToken: any;
  @Input() metaData: any;
  @Input() matterModelData: MatterModel;
  @Input() comboModelData: any;
  @Input() docRegisterList: DocRegisterGridRowItemWrapper[];
  @Input() feeEarnerList: FeeEarnerInfo[];
  @Input() supervisorList: DropdownListData[];
  @Input() appCodeList: DropdownListData[];
  @Input() matterDepartmentList: MasterDataViewModel<DepartmentWithMatterAndAppCode[]>;
  // @Input() matterCategoryList: DropdownListData[];
  @Input() matterInterestSchemeList: DropdownListData[];
  @Input() matterRateCategoryList: DropdownListData[];
  @Input() matterIntroductionList: DropdownListData[];
  @Input() branchIDList: DropdownListData[];
  @Input() trusAccNoList: DropdownListData[];
  @Input() menuItem: MainMenuItem<any>[];
  @Input() authUser: User;
  @Input() confirmBeforeOpenCase: boolean;

  @Input() laMatterTypesList: DropdownListData[];
  @Input() matterType1List: DropdownListData[];
  @Input() matterType2List: DropdownListData[];
  @Input() caseStageLevelList: DropdownListData[];
  @Input() stageReachedList: DropdownListData[];
  @Input() outcomeList: DropdownListData[];
  @Input() criteriaList: DropdownListData[];
  @Input() creditControlStageList: DropdownListData[];
  @Input() sundryProfitCostList: DropdownListData[];
  @Input() defaultDDABankList: DropdownListData[];

  // eBilling Comment
  @Input() schemeList: DropdownListData[];

  @Input() relatedDocumentsPageEvent: PageEvent;
  @Input() documentRegistriesGridData: any;
  @Input() lscDate: any;
  @Input() useFileSecurity: boolean;


  @Input() matterIndex: number;
  @Input() matterSeatchList: MatterInfomation[];

  @Input() isLoading: boolean;
  @Input() isInit: boolean;
  @Input() closeMatterCreation: boolean;
  @Input() showConflictSearch: boolean;
  @Input() mode: Mode;
  @Input() isModelDirty: boolean;
  @Input() closerProcessing: CloserProcessing;
  @Input() feeEarnerIsUser: boolean;
  @Input() originalModel: MatterModel;
  @Input() timeOffset: number;


  // eBilling Comment [eBillingSchemeList]="(matterCreationManager.eBillingSchemeList$| async)"
  // @Input() eBillingSchemeList: any[];

  @Output() popupClosed = new EventEmitter();
  @Output() updateSelectedMatterData = new EventEmitter<any>();
  @Output() valueChangedData = new EventEmitter<any>();
  @Output() docRegisterRowClick = new EventEmitter<DocRegisterGridRowItemWrapper>();
  @Output() addMatter = new EventEmitter();
  @Output() clearMatter = new EventEmitter();
  @Output() deleteMatter = new EventEmitter();
  @Output() saveMatter = new EventEmitter<{ data: FullMatterViewModel, openCase: boolean, closePopup?: boolean }>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() getLeadUFN = new EventEmitter();
  @Output() onCloserProcessing = new EventEmitter();
  @Output() writeOffNegativeWip = new EventEmitter();
  @Output() chengeIsCompletionNegWOEnabled = new EventEmitter();
  @Output() updateCompletionFields = new EventEmitter();
  @Output() getLAMatterTypesAvailable = new EventEmitter();
  @Output() getLegalAidCombosList = new EventEmitter();
  @Output() getFileIsLocked = new EventEmitter();
  @Output() checkOutstandingUndertakings = new EventEmitter();
  // @Output() appIdByDepartment = new EventEmitter<any>();
  // @Output() matterFeeEarnerChange = new EventEmitter<any>();
  @Output() gotoOpenCase = new EventEmitter<any>();
  @Output() addClient = new EventEmitter<ClientContackLinkDetailViewModel>();
  @Output() updateClient1 = new EventEmitter<any>();
  @Output() updateClient2 = new EventEmitter<any>();
  @Output() removeClient = new EventEmitter<string>();
  @Output() promoteClient = new EventEmitter<string>();

  ControllerType = ControllerType;
  Mode = Mode;
  selectedTab: any;
  selectedMatterRef: string;
  noEntriesFoundLabel: string;
  placeholderLabel: string;
  // feeEarnerDataList: any;
  trustAccount: boolean;
  intruductionShowType: string;
  // eBillingSchemeVisible: boolean;
  eBillingSchemeList: any[];
  // eBillingModelValue: any;
  matterAppId: any;
  MatterLinkOpenFrom = MatterLinkedType.MatterCreation;
  // clientList: { client: Client, enableRemove: boolean; }[] = [];
  clientRows: TableRow<any>[];
  selectedClient: TableRow<any>;
  matterDepartmentDropDowndList: DropdownListData[] = [];
  matterCategoryList: DropdownListData[] = [];
  feeEarnerListDropDownList: DropdownListData[] = [];

  crimeBailConditionList = ['Sureties',
    'Condition of residence',
    'Cash security',
    'Surrender of travel documents',
    'Reporting to local police station',
    'Curfew',
    'Condition to stay away from area',
    'Not to enter licenced premises',
    'Not to approach witnesses'
  ];

  constructor(public popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private datePipe: DatePipe,
    private cd: ChangeDetectorRef) {
    this.noEntriesFoundLabel = 'No Data';
    this.placeholderLabel = 'Search';
    this.trustAccount = false;
    this.intruductionShowType = 'luP_Code';
    // this.filterfeeEarnerList.next(this.feeEarnerList.slice());
  }

  get headerTitle(): string {
    return this.menuItem.find(i => i.id === 'matter_creation').label;
  }

  get matterDisplyName(): string {
    return this.menuItem.find(i => i.id === 'matter_search').label;
  }

  get isStageLevelHide() {
    if (this.matterModelData && this.matterModelData.matter) {
      const lscDate = Date.parse(this.lscDate);
      const legalCaseStarted = Date.parse(this.matterModelData.matter.legalCaseStarted);
      if (lscDate && legalCaseStarted && legalCaseStarted >= lscDate) {
        if (this.matterModelData.matter.legalMatterType === 'Clinical Negligence' ||
          this.matterModelData.matter.legalMatterType === 'Miscellaneous' ||
          this.matterModelData.matter.legalMatterType === 'Family - Private' ||
          this.matterModelData.matter.legalMatterType === 'Family - Public') {
          return false;
        } else {
          return true;
        }
      } else if (this.matterModelData.matter.legalMatterType === 'Family - Private' ||
        this.matterModelData.matter.legalMatterType === 'Family - Public') {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  get isCriteriaHide() {
    if (this.matterModelData && this.matterModelData.matter) {
      const lscDate = Date.parse(this.lscDate);
      const legalCaseStarted = Date.parse(this.matterModelData.matter.legalCaseStarted);
      if (lscDate && legalCaseStarted && legalCaseStarted >= lscDate &&
        (this.matterModelData.matter.legalMatterType === 'Clinical Negligence' ||
          this.matterModelData.matter.legalMatterType === 'Miscellaneous' ||
          this.matterModelData.matter.legalMatterType === 'Family - Private' ||
          this.matterModelData.matter.legalMatterType === 'Family - Public')) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  }
  get isStageReachedHide() {
    if (this.matterModelData && this.matterModelData.matter) {
      if (!!this.matterModelData.matter.legalLAACivilBilling) {
        return true;
      }

      const lscDate = Date.parse(this.lscDate);
      const legalCaseStarted = Date.parse(this.matterModelData.matter.legalCaseStarted);
      if (lscDate && legalCaseStarted && legalCaseStarted >= lscDate &&
        (this.matterModelData.matter.legalMatterType === 'Employment' ||
          this.matterModelData.matter.legalMatterType === 'Consumer General Contract' ||
          this.matterModelData.matter.legalMatterType === 'Personal Injury' ||
          this.matterModelData.matter.legalMatterType === 'Public Law' ||
          this.matterModelData.matter.legalMatterType === 'Actions Against The Police' ||
          this.matterModelData.matter.legalMatterType === 'Consumer General Contract' ||
          this.matterModelData.matter.legalMatterType === 'Clinical Negligence' ||
          this.matterModelData.matter.legalMatterType === 'Miscellaneous' ||
          this.matterModelData.matter.legalMatterType === 'Family - Private' ||
          this.matterModelData.matter.legalMatterType === 'Family - Public')) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }


  allGridPageEvent: any;
  docRegisterGridColumn: ColumnDef[] = [
    createDefultColumnDef('documentRef', { label: 'Doc Ref', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('location', { label: 'Location', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('reviewDate', { label: 'Review Date', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('destroyDate', { label: 'Destroy Date', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
  ];

  docMatterLinkedGridColumn: ColumnDef[] = [
    createDefultColumnDef('documentRef', { label: 'Ref', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('location', { label: 'Details', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('reviewDate', { label: 'Open', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('destroyDate', { label: 'Last Used', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('destroyDate', { label: 'Start Date', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('destroyDate', { label: 'F/E', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
  ];

  // clientGridColumn: ColumnDef[] = [
  //   createDefultColumnDef('title', { label: 'Title', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('letterTitle', { label: 'Letter Title', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('firstName', { label: 'First Name', fxFlex: '200px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('Last Name', { label: 'Last Name', fxFlex: '200px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('contactName', { label: 'Contact Name', fxFlex: '200px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('email', { label: 'Email', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('secondEmial', { label: 'Second Email', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('telephoneNo', { label: 'Tele Phone', fxFlex: '150px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('faxNo', { label: 'Fax No', fxFlex: '200px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('workPhone', { label: 'Work Phone', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
  //   createDefultColumnDef('Remove', { label: '', fxFlex: '50px', filterAnchor: 'end', filterHidden: true })
  // ];

  clientGridColumns: TableColumn[] = [
    { name: 'Account Ref ', propertyName: 'accountRef', width: '10%' },
    { name: 'Account Name ', propertyName: 'accountName', width: '15%' },
    { name: 'Address ', propertyName: 'address', width: '40%' },
    { name: 'Postcode ', propertyName: 'postcode', width: '15%' },
    { name: 'Client ', propertyName: 'client', width: '15%' },
    { name: 'Remove', propertyName: 'removed', width: '5%', isButton: true }
  ];

  ngOnInit() {
    this.selectedTab = 'INPtpgMatter';
    this.matterAppId = 0;
    this.allGridPageEvent = { pageSize: 20, pageIndex: 0, length: 0 };
    this.schemeCmbLoadChange();
  }
  schemeCmbLoadChange() {
    this.eBillingSchemeList = [
      { key: 'PrecedentH', value: 'PrecedentH', description1: '', description2: '' },
      { key: 'PrecedentS', value: 'PrecedentS', description1: '', description2: '' }];
    // if (this.matterModelData && this.matterModelData.matter &&
    //   (this.matterModelData.matter.appId === 3 || this.matterModelData.matter.appId === 11)) {
    //   this.eBillingSchemeList = [];
    //   this.eBillingSchemeList = [
    //     { key: 'Private', value: 'Private', description1: '', description2: '' },
    //     { key: 'LegalAid', value: 'Legal Aid', description1: '', description2: '' }];
    // } else if (this.matterModelData && this.matterModelData.matter && this.matterModelData.matter.appId) {
    //   this.eBillingSchemeList = [];
    //   this.eBillingSchemeList = [
    //     { key: 'Private', value: 'Private', description1: '', description2: '' },
    //     { key: 'PrecedentH', value: 'PrecedentH', description1: '', description2: '' },
    //     { key: 'PrecedentS', value: 'PrecedentS', description1: '', description2: '' }];
    // }
  }

  onMattereAdd() {
    this.addMatter.emit();
    this.onValueChanged(ControllerType.input, 2, 'legalPublicFunded');
    this.onValueChanged(ControllerType.input, -1, 'matterId');
    const date = this.datePipe.transform(dpsNewDate(this.timeOffset), 'yyyy-MM-dd') + 'T00:00:00';
    this.onValueChanged(ControllerType.dtp, date, 'matterStartDate');
    this.onValueChanged(ControllerType.dtp, null, 'matterClosedate');
  }
  onMattereClear() {
    const date = this.datePipe.transform(dpsNewDate(this.timeOffset), 'yyyy-MM-dd') + 'T00:00:00';
    this.onValueChanged(ControllerType.dtp, date, 'matterStartDate');
    if (this.isModelDirty) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Unsaved Data',
          message: `<p>Do you want to save changes?</p>`,
          acceptLabel: 'Yes',
          rejectLabel: 'No',
          cancelLabel: 'Cancel'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponentWithCancel, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {
          this.onMattereAdd();
          setTimeout(() => {
            this.onMatterSave();
          }, 10);
        } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
          this.clearMatter.emit();
        } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
        }
      });
    } else {
      this.clearMatter.emit();
    }
  }
  onMattereDelete() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Delete Matter',
        message: `<p>Are you sure that you want to delete this matter?</p>`,
        acceptLabel: 'Yes',
        rejectLabel: 'No',
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '350px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
        this.deleteMatter.emit(this.matterModelData.matter);
      } else if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
      }
    });
  }
  onMatterSave() {
    this.saveMatter.emit({
      data: { ...this.matterModelData.matter, clientContactLink: this.matterModelData.clientContactLink },
      openCase: false // ignow automatically close poppup
    });
  }
  onPopupClosed(event) {
    this.popupClosed.emit(event);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterModelData && changes.matterModelData.currentValue) {
      this.setClientRow();
    }


    if (changes.showConflictSearch && changes.showConflictSearch.currentValue === true) {
      // do showConflictSearch
      this.popupService.openConflictSearchPopup('openConflictSearchPopup',
        {
          conflictCheckType: ConflictCheckType.Matter,
          openFrom: ConflictSearchOpenFrom.MatterCreation,
          clientDto: this.matterModelData.matter,
          commonPara: { data: '', status: '' }
        }
      );
    }
    if (changes.matterModelData && changes.matterModelData.currentValue && changes.matterModelData.previousValue
      && changes.matterModelData.currentValue.matter) {
      if (changes.matterModelData.currentValue.matter.matterDepartment) {
        this.mapMatterCattergary(this.matterModelData.matter.matterDepartment);
      }

      if (changes.matterModelData.currentValue.matter.appId !== this.matterAppId) {
        this.matterAppId = changes.matterModelData.currentValue.matter.appId;

        this.eBillingSchemeList = [
          { key: 'PrecedentH', value: 'PrecedentH', description1: '', description2: '' },
          { key: 'PrecedentS', value: 'PrecedentS', description1: '', description2: '' }];
        if (changes.matterModelData.currentValue.matter.eBilling && this.mode === Mode.EditMode) {
          setTimeout(() => {
            this.onSchemeChanged(ControllerType.cmb,
              changes.matterModelData.currentValue.matter.eBilling, 'eBilling');
          }, 10);
        } else {
          setTimeout(() => {
            this.onSchemeChanged(ControllerType.cmb, null, 'eBilling');
          }, 10);

        }
      }
    }
    if (changes.closeMatterCreation && changes.closeMatterCreation.currentValue === true) {
      this.onPopupClosed(null);
    }
    if (changes.metaData) {
      if (this.metaDataLinker(this.selectedTab) && this.metaDataLinker(this.selectedTab).scL_Visible === false) {
        this.matterTabClick(this.getFirstVisibleTab().scL_Name);
      }
    }
    if (changes.matterDepartmentList) {
      if (this.matterDepartmentList && !this.matterDepartmentList.isLoading && this.matterDepartmentList.data) {
        this.matterDepartmentList.data.forEach(i => {
          this.matterDepartmentDropDowndList = this.matterDepartmentDropDowndList.concat({ key: i.departmentId, value: i.departmentName });
        });
      }
    }
    if (changes.feeEarnerList) {
      if (this.feeEarnerList) {
        this.feeEarnerList.forEach(i => {
          this.feeEarnerListDropDownList = this.feeEarnerListDropDownList.concat({ key: i.userId, value: i.userName });
        });
      }
    }

  }

  setClientRow() {
    this.clientRows = [];
    if (this.matterModelData && this.matterModelData && this.matterModelData.clientContactLink &&
      this.matterModelData.clientContactLink.length > 0) {
      this.matterModelData.clientContactLink.forEach((r) => {
        // const isSelected = this.selectedHistoryItem === i;
        this.clientRows.push({
          data: {
            ...r,
            client: r.leadClient ? 'lead' : '',
            removed: !r.leadClient ? 'delete' : ''
            // accountRef: r.accountRef, accountName: r.accountName, address: r.address,
            // postcode: r.postcode, client: r.leadClient ? 'lead' : '', removed: !r.leadClient ? 'delete' : '' ,
          },
          selected: (this.selectedClient && this.selectedClient.data.accountRef === r.accountRef) ? true : false,
        });
      });
    }
  }

  onDocRegisterRowClick(item) {
    this.docRegisterRowClick.emit(item);
  }

  onGridPageChange(pageEvent) {
    this.pageChange.emit(pageEvent);
  }
  onPageChange(index) {
    this.updateSelectedMatterData.emit({
      matterId: this.matterSeatchList[index].matterCounter, matterIndex: index, matterSeatchList: null
    });
    if (this.selectedTab === 'INPtpgCrimeTab' && this.matterSeatchList[index].appID === 3) {
      this.matterTabClick(this.getFirstVisibleTab().scL_Name);
    }
    if (this.getFirstVisibleTab().scL_Name) {
      this.matterTabClick(this.getVisibleOtherTab('INPtpgCrimeTab').scL_Name);
    }
  }

  onValueChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    if (modelName === 'matterCategory') {
      // change App
      const departmentDetails = this.getSelectedDepartmentDetails(this.matterModelData.matter.matterDepartment);
      if (departmentDetails && departmentDetails.matCategoryWithAppInfo && !this.matterModelData.matter.matterRef) {
        const matterCattegary = departmentDetails.matCategoryWithAppInfo.find(i => i.matCategoryId === value);
        if (matterCattegary && matterCattegary.matCategoryAppId > 0) {
          this.valueChangedData.emit({ controllerType: 'cmb', value: matterCattegary.matCategoryAppCode, model: 'appCode' });
          this.valueChangedData.emit({ controllerType: 'cmb', value: matterCattegary.matCategoryAppId, model: 'appId' });
        } else {
          this.valueChangedData.emit({ controllerType: 'cmb', value: departmentDetails.deptAppCode, model: 'appCode' });
          this.valueChangedData.emit({ controllerType: 'cmb', value: departmentDetails.deptAppId, model: 'appId' });
        }
      }
    }
  }
  onSundryCrediteConrtolStageChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    if (value !== 0) {
      this.valueChangedData.emit({
        controllerType: ControllerType.input,
        value: this.datePipe.transform(dpsNewDate(this.timeOffset), 'yyyy-MM-dd') + 'T00:00:00', model: 'sundryStageSet'
      });
    } else {
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: '', model: 'sundryStageSet' });
    }
  }
  onFeeEarnerValueChanged(type: ControllerType, value, modelName, isChangeClient = false) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    if (value && ((this.mode === Mode.AddMode) || isChangeClient)) {
      const userInfo = this.getSelectedFeeErnerInfo(value);
      if (userInfo) {
        this.valueChangedData.emit({ controllerType: 'cmb', value: userInfo.userBranchId, model: 'branchID' });
        this.valueChangedData.emit({ controllerType: 'cmb', value: userInfo.userSupervisorRef, model: 'matterSupervisor' });
        this.onDepartmentChanged(ControllerType.cmb, userInfo.userDepartmentId, 'matterDepartment');
      }
    }
  }
  onAppCodeChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    const selectedAppCode: DropdownListData = this.appCodeList.find(val => val.key === value);
    if (selectedAppCode) {
      this.valueChangedData.emit({ controllerType: 'cmb', value: selectedAppCode.value, model: 'appCode' });
    }

  }
  onCloseMatterChanged(type: ControllerType, value, modelName) {
    if (value) {
      const date = this.datePipe.transform(dpsNewDate(this.timeOffset), 'yyyy-MM-dd') + 'T00:00:00';
      this.valueChangedData.emit({ controllerType: type, value: date, model: 'matterClosedate' });
      this.checkOutstandingUndertakings.emit({
        matterRef: this.matterModelData.matter.matterRef,
        matterId: this.matterModelData.matter.matterId,
        mode: this.mode
      });
      if (!this.matterModelData.matter.matterCompletedDate) {
        this.changeMatterComletedDate(type, date);
      }
      this.valueChangedData.emit({ controllerType: type, value: value, model: 'isMatterCompleted' });
    } else {
      this.valueChangedData.emit({ controllerType: type, value: null, model: 'matterClosedate' });
    }
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
  }

  onCompletedMatterChanged(type: ControllerType, value, modelName) {
    if (value) {
      const date = this.datePipe.transform(dpsNewDate(this.timeOffset), 'yyyy-MM-dd') + 'T00:00:00';
      this.changeMatterComletedDate(type, date);
    } else {
      this.changeMatterComletedDate(type, null);
    }
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    // this.valueChangedData.emit{ controllerType: type, value: this.authUser.userName, model: 'matterCompletedBy' });
  }

  onLegalMatterTypeChanged(type: ControllerType, value, modelName) {

    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    if (value && this.matterModelData.matter.legalCaseStarted) {
      this.getLegalAidCombosList.emit({ matterType: value, startDate: this.matterModelData.matter.legalCaseStarted });
    }

  }
  onLegalCaseStartedChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    if (value && this.matterModelData.matter.branchID) {
      this.getLAMatterTypesAvailable.emit({ branchId: this.matterModelData.matter.branchID, startDate: value });
    }
  }

  onBranchChanged(type: ControllerType, value, modelName) {

    if (value && this.matterModelData.matter.legalCaseStarted) {
      this.getLAMatterTypesAvailable.emit({ branchId: value, startDate: this.matterModelData.matter.legalCaseStarted });
    }
    if (this.matterModelData.matter.fileID > 0 && this.matterModelData.matter.branchID && this.matterModelData.matter.branchID !== value) {
      this.getFileIsLocked.emit(
        {
          appID: this.matterModelData.matter.appId,
          fileID: this.matterModelData.matter.fileID, branchID: this.matterModelData.matter.branchID
        });
    }
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
  }
  onLeadFileForBillingChanged(type: ControllerType, value, modelName) {
    if (value) {
      this.valueChangedData.emit({ controllerType: type, value: this.matterModelData.matter.crimeUFN, model: 'crimeLeadUFN' });
    }
  }
  onPrivateChanged(type: ControllerType, value, modelName) {
    if (value && this.selectedTab === 'INPtpgLegalAid') {
      this.matterTabClick(this.getVisibleOtherTab('INPtpgLegalAid').scL_Name);
    }
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
  }
  onDepartmentChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    this.valueChangedData.emit({ controllerType: type, value: null, model: 'matterCategory' });
    // this.mapMatterCattergary(value);

    // changeApp
    const selectedDepartmentDetail = this.getSelectedDepartmentDetails(value);
    if (selectedDepartmentDetail && !this.matterModelData.matter.matterRef) {
      this.valueChangedData.emit({ controllerType: type, value: selectedDepartmentDetail.deptAppCode, model: 'appCode' });
      this.valueChangedData.emit({ controllerType: type, value: selectedDepartmentDetail.deptAppId, model: 'appId' });
    }
  }
  onTrustAccountValueChanged(value) {
    if (!value) {
      this.onValueChanged(ControllerType.input, null, 'sundryTrustAccount');
    }
    this.trustAccount = value;
  }
  onClientSearchClick(value) {
    const clientSearchData: ClientSearchPopupData = {
      clientRef: value,
      searchText: null,
      branchId: this.matterModelData ? this.matterModelData.matter.branchID : null,
      clientName: null,
      popupType: ClientPopupType.GeneralClientSearch,
      popupPara: {
        firstName: '',
        lastName: '',
        companyName: '',
        // address: '',
        email1: '',
      }
    };
    this.popupService.openClientSearchPopup('clientSearchPopup', clientSearchData).subscribe((result: any) => {
      if (result) {
        this.onValueChanged(ControllerType.input, result.clientReference, 'clientRef');
        this.onValueChanged(ControllerType.input, result.clientName, 'clientName');
        this.onValueChanged(ControllerType.cmb, result.branchID, 'branchID');
        this.onFeeEarnerValueChanged(ControllerType.cmb, result.feeEarner, 'matterFeeEarner', true);
        this.onValueChanged(ControllerType.cmb, result.clientIntroduction, 'matterIntroduction');

        this.valueChangedData.emit({ controllerType: ControllerType.input, value: result.clientReference, model: 'clientRef' });

        const temp: ClientContackLinkDetailViewModel = {
          linkID: 0,
          accountRef: result.clientReference,
          accountName: combineStirng([result.firstName, result.lastName]),
          address: combineStirng([result.clientAddress1, result.clientAddress2, result.clientTown, result.clientCountry]),
          postcode: result.clientPostCode,
          contactID: !!result.contactID ? result.contactID : 0,
          screenNo: 0,
          leadClient: true,
          clientId: result.clientId
        };
        this.onAddClient(temp);

        this.updateClient1.emit({ controllerType: ControllerType.input, value: result.firstName, model: 'firstName' });
        this.updateClient1.emit({ controllerType: ControllerType.input, value: result.lastName, model: 'lastName' });
        this.updateClient1.emit({ controllerType: ControllerType.input, value: result.clientLetterTitle, model: 'letterTitle' });
        this.updateClient1.emit({ controllerType: ControllerType.input, value: result.clientContactName, model: 'contactName' });
        this.updateClient1.emit({ controllerType: ControllerType.input, value: result.clientEmail, model: 'email1' });
        return '';
      }
    });
  }
  matterTabClick(id) {
    this.selectedTab = id;
  }

  get matterDepartment() {
    if (this.matterModelData && this.matterModelData.matter
      && this.matterModelData.matter.matterDepartment) {
      return +this.matterModelData.matter.matterDepartment;
    } else {
      return null;
    }
  }

  // get clientList() {
  //   const clientList: { client: Client, enableRemove: boolean; }[] = [];
  //   if (this.matterModelData && this.matterModelData.matter && this.matterModelData.matter.clientRef) {
  //     clientList.push({ client: this.matterModelData.client1, enableRemove: false });
  //   }
  //   if (this.matterModelData && this.matterModelData.matter && this.matterModelData.matter.clientRef2) {
  //     clientList.push({ client: this.matterModelData.client2, enableRemove: true });
  //   }
  //   return clientList;
  // }

  metaDataLinkerForEbilling(id) {
    if (this.metaData) {
      return this.findController(this.metaData[0],
        function (item: ScreenEditComponentTreeData) {
          if (item.scL_Name === id) {
            item.scL_Caption = '';
            item.scL_DefaultCaption = '';
            return item;
          } else {
            return null;
          }
        });
    }
  }
  metaDataLinker(id) {
    if (this.metaData) {
      return this.findController(this.metaData[0],
        function (item: ScreenEditComponentTreeData) { return item.scL_Name === id; });
    }
  }

  getFirstVisibleTab() {
    if (this.metaData) {
      return this.findController(this.metaData[0],
        function (item: ScreenEditComponentTreeData) { return item.scL_IsTab && item.scL_Visible === true; });
    }
  }
  getVisibleOtherTab(removeTabName: string) {
    if (this.metaData) {
      return this.findController(this.metaData[0],
        function (item: ScreenEditComponentTreeData) {
          return item.scL_IsTab &&
            item.scL_Visible === true && item.scL_Name !== removeTabName;
        });
    }
  }
  public findController(item: ScreenEditComponentTreeData, predicate): ScreenEditComponentTreeData {
    if (predicate(item)) {
      return item;
    } else if (item.children != null && item.children.length > 0) {
      for (let i = 0; i < item.children.length; i++) {
        const found = this.findController(item.children[i], predicate);
        if (found !== null) {
          return found;
        }
      }
    }
    return null;
  }
  onMatterSearch(matterModel: Matter) {
    const matterInputData: any = {
      isMatterSearch: false, BranchId: matterModel.branchID, ClientName: matterModel.clientName,
      ClientReference: matterModel.clientRef, MatterDetails: matterModel.matterDetails,
      MatterReference: matterModel.matterRef, searchText: null, isMatterCreate: true
    };
    this.popupService.openMatterSearchPopup('matterCriation', matterInputData).subscribe(
      (result: { index: number, gridData: MatterInfomation[] }) => {
        if (result && result.gridData && result.gridData.length > 0 && result.index >= 0) {
          this.updateSelectedMatterData.emit({
            matterId: result.gridData[result.index].matterCounter,
            matterSeatchList: result.gridData,
            matterIndex: result.index
          });
          if (this.selectedTab === 'INPtpgCrimeTab' && result.gridData[result.index].appID === 3) {
            this.matterTabClick(this.getFirstVisibleTab().scL_Name);
          }
          if (this.getFirstVisibleTab().scL_Name) {
            this.matterTabClick(this.getFirstVisibleTab().scL_Name);
          }
        }
      });
  }
  onOtherMatterSearchClick(value) {
    const matterInputData: any = {
      searchText: value,
      isMatterCreate: true
    };
    this.popupService.openMatterSearchPopup('matterCriationOtherMatterSearch', matterInputData).subscribe(
      (result: MatterInfo) => {
        if (result) {
          this.onValueChanged(ControllerType.input, result.MatterReferenceNo, 'sundryOtherMatter');
        }
      });
  }

  onScreenEdit() {
    this.popupService.openScreenEditPopup('client_creation', { type: 'Client' }).subscribe((data) => {
    });
  }

  onLegalMatterTypeClick(matSelect: MatSelect) {
    if (this.matterModelData.matter.legalLAACivilBilling) {
      const lscDate = Date.parse(this.lscDate);
      const legalCaseStarted = Date.parse(this.matterModelData.matter.legalCaseStarted);
      let messageText = '';
      if (lscDate && legalCaseStarted && legalCaseStarted >= lscDate) {
        messageText = 'You have no 2013 contracts available for the selected case start date.';
      } else {
        messageText = 'You have no contracts available for the selected case start date.';
      }
      if (this.laMatterTypesList) {
        if (this.laMatterTypesList.length < 2) {
          this.showLegalMatterTypeMsg(messageText);
          matSelect.close();
        }
      } else {
        if (this.matterModelData.matter.legalCaseStarted) {
          this.showLegalMatterTypeMsg(messageText);
          matSelect.close();
        } else {
          this.showLegalMatterTypeMsg('You must select a start date for Legal Aid cases, so that available contracts can be checked.');
          matSelect.close();
        }
      }
    }
  }
  showLegalMatterTypeMsg(message: string) {
    const dialogData: InforDialogData = {
      content: {
        title: 'DPS Legal Aid Billing',
        message: message
      },
      data: { messageType: 'alert' },
    };

    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
    });
  }
  crimeLeadUFN() {
    const matterInputData: MatterInputData = { isMatterSearch: false };
    this.popupService.openMatterSearchPopup('matterCriation', matterInputData).subscribe(
      (result: { index: number, gridData: MatterInfomation[] }) => {
        if (result && result.gridData && result.gridData.length > 0 && result.index >= 0) {
          const selectedItem = result.gridData[result.index];
          if (selectedItem.appCode !== 'CR' || selectedItem.branchID < 1 || selectedItem.fileID < 0) {

          } else {
            this.getLeadUFN.emit({ fileID: selectedItem.fileID, branchID: selectedItem.branchID });
          }
        }
      });
  }
  completionNegWO(event) {
    let messageText = '';
    if (this.isModelDirty) {
      messageText = `<p>
        The Write Off WIP cannot be undone even if you cancel the matter changes!
        <br> Are you sure you want to continue?
        <br> Please Note:  The screen will save any changes made, before doing the write off.
      </p>`;
    } else {
      messageText = `<p>
        The Write Off WIP cannot be undone even if you cancel the matter changes!
        <br> Are you sure you want to continue?
      </p>`;
    }
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Write Off WIP',
        message: messageText,
        acceptLabel: 'Yes',
        rejectLabel: 'No',
      },
      contentParams: {},
      data: null
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '350px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
        if (this.isModelDirty) {
          this.onMatterSave();
          this.onCloserProcessing.emit(this.matterModelData.matter.matterRef);
          this.updateCompletionFields.emit({ mode: this.mode, matter: this.matterModelData.matter });
          this.chengeIsCompletionNegWOEnabled.emit(false);
        }
        this.writeOffNegativeWip.emit(this.matterModelData.matter.matterRef);
        this.valueChangedData.emit({ controllerType: ControllerType.input, value: 0, model: 'timBal' });
        this.onMatterSave();
      } else if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
      }
    });

  }
  onOk() {
    if (!!this.confirmBeforeOpenCase) {
      showConfirmDialog('Matter', 'Do you want open the case?', this.dialog, 'Yes', 'No').
        afterClosed().subscribe(response => {
          if (response.kind === ConfirmDialogResultKind.Confirmed) {
            this.saveMatter.emit({
              data: { ...this.matterModelData.matter, clientContactLink: this.matterModelData.clientContactLink },
              openCase: true,
            });
          } else {
            this.saveMatter.emit({
              data: { ...this.matterModelData.matter, clientContactLink: this.matterModelData.clientContactLink },
              openCase: false,
              closePopup: true
            });
          }

        });

    } else {
      this.saveMatter.emit({
        data: { ...this.matterModelData.matter, clientContactLink: this.matterModelData.clientContactLink },
        openCase: true
      });
    }
  }
  onOpenLedgerCard() {
    const ledgerCardToken = 'matterCreationLedgerCardPopup(' + this.matterModelData.matter.matterRef + ')';
    const input: LedgerCardInput = {
      matterRef: this.matterModelData.matter.matterRef
    };
    this.popupService.openLedgerCardPopup(ledgerCardToken, input).subscribe((data) => {
    });
  }
  onLoadFileSecurityModal() {
    if (this.matterModelData.matter.matterId > 0) {
      this.popupService.openFileSecurityRightsPoup('FileSecurityRights', this.matterModelData.matter.matterId).subscribe((data) => {
      });
    } else {
      const dialogData: InforDialogData = {
        content: {
          title: 'DPS File Security',
          message: 'Please save New Matter before adding security rights to users.'
        },
        data: { messageType: 'alert' },
      };

      const dialogRef = this.dialog.open(InforDialogComponent, {
        data: dialogData,
        width: '350px',
        panelClass: 'dps-notification'
      });
    }
  }

  isMuiliClient(): boolean {
    if (this.authUser && this.authUser.general && this.authUser.general.settingValues) {
      return this.authUser.general.settingValues.MultipleClientsOnMatter;
    }
    return false;
  }

  get disabledAddClientButton(): boolean {
    if (!this.isMuiliClient()) {
      if (this.matterModelData && this.matterModelData.matter.clientRef2) {
        return true;
      }
    }
    return false;
  }

  onAddOtherClient() {
    this.popupService.openClientCreationPopup(uuid(), null).subscribe(data => {
      if (data && data.clienModel && data && !!data.clienModel.clientReference &&
        (this.matterModelData.matter.clientRef !== data.clienModel.clientReference)) {
        if (this.isMuiliClient() || !this.matterModelData.matter.clientRef2) {
          const temp: ClientContackLinkDetailViewModel = {
            linkID: 0,
            accountRef: data.clienModel.clientReference,
            accountName: combineStirng([data.clienModel.firstName, data.clienModel.lastName]),
            address: combineStirng([data.clienModel.clientAddress1, data.clienModel.clientAddress2, data.clienModel.clientTown,
            data.clienModel.clientCountry]),
            postcode: data.clienModel.clientPostCode,
            contactID: !!data.clienModel.contactID ? data.clienModel.contactID : 0,
            screenNo: 0,
            leadClient: false,
            clientId: data.clienModel.clientId
          };
          this.onAddClient(temp);
          this.updateClient2Data(data);
        }
        // this.updateClient2.emit({
        //   controllerType: ControllerType.input,
        //   value: data.clientItem ? data.clientItem.luP_Description : '',
        //   model: 'clientTitle'
        // });
      }
    });
  }

  onAddClient(data: ClientContackLinkDetailViewModel) {
    this.addClient.emit(data);
  }

  onClearSecondClient() {
    // this.valueChangedData.emit({ controllerType: ControllerType.input, value: '', model: 'clientRef2' });
    // this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'clientTitle' });
    // this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'firstName' });
    // this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'lastName' });
    // this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'letterTitle' });
    // this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'contactName' });
    // this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'email1' });
  }
  // eBilling Comment
  onSchemeChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    const selectedScheme: DropdownListData = this.eBillingSchemeList.find(val => val.value === value);
    if (selectedScheme) {
      this.valueChangedData.emit({ controllerType: 'cmb', value: selectedScheme.value, model: 'eBilling' });
    }
  }

  autofillAddress(newAddress: Address) {
    setTimeout(() => {
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.address1, model: 'sundryBullingAddress1' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.address2, model: 'sundryBullingAddress2' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.town, model: 'INPtxtAddressBillingTown' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.country, model: 'sundryCountry' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.postCode, model: 'sundryPostCode' });
      this.cd.detectChanges();
    }, 100);
  }

  stopEventPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onRemoveClient(data: { event: MouseEvent, row: TableRow<any>, columns: TableColumn }) {

    if (this.matterModelData.matter.clientRef === data.row.data.accountRef) {
      return;
    } else {
      const conformDialog = showConfirmDialog('Remove Client', `Are you sure you want to remove client ${data.row.data.accountRef}:
      ${data.row.data.accountName} from this matter`, this.dialog);

      conformDialog.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          if (this.matterModelData.matter.clientRef2 === data.row.data.accountRef) {
            this.valueChangedData.emit({ controllerType: ControllerType.input, value: '', model: 'clientRef2' });
            this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'clientTitle' });
            this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'firstName' });
            this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'lastName' });
            this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'letterTitle' });
            this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'contactName' });
            this.updateClient2.emit({ controllerType: ControllerType.input, value: '', model: 'email1' });
          }
          this.removeClient.emit(data.row.data.accountRef);
        }

      });
    }
  }

  onRemoveSelectedClient() {
    this.onRemoveClient({ event: null, row: this.selectedClient, columns: null });
  }

  onSelectClient(data: { event: MouseEvent, row: TableRow<any> }) {
    this.selectedClient = data.row;
    this.setClientRow();
  }

  onPromoteClient() {
    this.promoteClient.emit(this.selectedClient.data.accountRef);
  }

  onViewClient() {
    this.popupService.openClientCreationPopup(uuid(), {
      clientId: this.selectedClient.data.clientId, clientSeatchList: [], clientIndex: 0
    }).subscribe(data => {
      if (!!data) {
        let idLeadClient: boolean;
        if (this.matterModelData.matter.clientRef === data.clienModel.clientReference) {
          idLeadClient = true;
          this.updateClient1.emit({ controllerType: ControllerType.input, value: data.clienModel.firstName, model: 'firstName' });
          this.updateClient1.emit({ controllerType: ControllerType.input, value: data.clienModel.lastName, model: 'lastName' });
          this.updateClient1.emit({ controllerType: ControllerType.input, value: data.clienModel.clientLetterTitle, model: 'letterTitle' });
          this.updateClient1.emit({ controllerType: ControllerType.input, value: data.clienModel.clientContactName, model: 'contactName' });
          this.updateClient1.emit({ controllerType: ControllerType.input, value: data.clienModel.clientEmail, model: 'email1' });
        } else {
          idLeadClient = false;
          this.updateClient2Data(data);
        }
        const temp: ClientContackLinkDetailViewModel = {
          linkID: 0,
          accountRef: data.clienModel.clientReference,
          accountName: combineStirng([data.clienModel.firstName, data.clienModel.lastName]),
          address: combineStirng([data.clienModel.clientAddress1, data.clienModel.clientAddress2, data.clienModel.clientTown,
          data.clienModel.clientCountry]),
          postcode: data.clienModel.clientPostCode,
          contactID: !!data.clienModel.contactID ? data.clienModel.contactID : 0,
          screenNo: 0,
          leadClient: idLeadClient,
          clientId: data.clienModel.clientId
        };
        this.onAddClient(temp);
      }
    });
  }

  updateClient2Data(data) {
    if (this.matterModelData && !!this.matterModelData.matter && !this.matterModelData.matter.clientRef2) {
      this.updateClient2.emit({ controllerType: ControllerType.input, value: data.clienModel.firstName, model: 'firstName' });
      this.updateClient2.emit({ controllerType: ControllerType.input, value: data.clienModel.lastName, model: 'lastName' });
      this.updateClient2.emit({ controllerType: ControllerType.input, value: data.clienModel.clientLetterTitle, model: 'letterTitle' });
      this.updateClient2.emit({ controllerType: ControllerType.input, value: data.clienModel.clientContactName, model: 'contactName' });
      this.updateClient2.emit({ controllerType: ControllerType.input, value: data.clienModel.clientEmail, model: 'email1' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: data.clienModel.clientReference, model: 'clientRef2' });
    }
  }

  get legalLAACivilBillingLabelName(): string {
    if (!!this.matterModelData && this.matterModelData.matter && this.matterModelData.matter.appCode) {
      switch (this.matterModelData.matter.appCode) {
        case 'CR':
          return 'Crime Legal Aid';
        case 'LO':
          return 'Legal Other';
        default:
          return 'Family/Children Legal Aid';
      }
    }

    return null;
  }

  get isHiddenCrimeTab(): boolean {
    if (!!this.matterModelData && !!this.matterModelData.matter && !!this.matterModelData.matter.appCode) {
      if (this.matterModelData.matter.appCode.toUpperCase() === 'CR') {
        return false;
      }
    }
    return true;
  }

  // get selectedDepartment(): DepartmentWithMatterAndAppCode {
  //   if (this.matterDepartmentList && this.matterDepartmentList && this.matterDepartmentList.data.length > 0) {
  //     return this.matterDepartmentList.data.find((department) => department.departmentId ===
  // this.matterModelData.matter.matterDepartment);
  //   }
  //   return null;
  // }

  mapMatterCattergary(departmentid: number) {
    const selectedDepartmentInfo = this.getSelectedDepartmentDetails(departmentid);
    this.matterCategoryList = [];
    if (selectedDepartmentInfo && selectedDepartmentInfo.matCategoryWithAppInfo) {
      selectedDepartmentInfo.matCategoryWithAppInfo.forEach(i => {
        this.matterCategoryList =
          this.matterCategoryList.concat({ key: i.matCategoryId, value: i.matCategoryDescription });
      });
    }
  }

  getSelectedDepartmentDetails(departmentid): DepartmentWithMatterAndAppCode {
    let selectedDepartment = null;
    if (this.matterDepartmentList && this.matterDepartmentList && this.matterDepartmentList.data.length > 0) {
      selectedDepartment = this.matterDepartmentList.data.find((department) => department.departmentId === departmentid);
    }
    return selectedDepartment;
  }

  getSelectedFeeErnerInfo(id): FeeEarnerInfo {
    let info = null;
    if (this.feeEarnerList && this.feeEarnerList.length > 0) {
      info = this.feeEarnerList.find(i => i.userId === id);
    }
    return info;
  }

  changeMatterComletedDate(controllerType: ControllerType, date: string): void {
    this.valueChangedData.emit({ controllerType: controllerType, value: date, model: 'matterCompletedDate' });
    if (date) {
      const completedDate = new Date(date);
      //auto populate the destroy date for 7 years after the Matter Completed Date. 
      this.valueChangedData.emit({
        controllerType: ControllerType.dtp,
        value: new Date(completedDate.setFullYear(completedDate.getFullYear() + 7)).toDpsString(true),
        model: 'completionDistroyDate'
      });
    } else {
      this.valueChangedData.emit({ controllerType: ControllerType.dtp, value: null, model: 'completionDistroyDate' });
    }
  }

}










