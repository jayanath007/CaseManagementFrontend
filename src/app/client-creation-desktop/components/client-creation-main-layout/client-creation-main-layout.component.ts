import { PaginatorDef } from './../../../core/lib/grid-model';
import { ColumnDef } from '../../../core/lib/grid-model';
import { SystemJsPopupLoaderService } from '../../../shell-desktop/services/system-js-popup-loader.service';
import { ClientGridRowRapper, ClientSearchPopupData, ClientPopupType } from '../../../client-search-core';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { ScreenEditComponentTreeData, Mode } from '../../../core';
import { createDefultColumnDef } from '../../../core/lib/grid-helpers';
import { PageEvent, MatDialog } from '@angular/material';
import { MainMenuItem } from './../../../layout-desktop/models/interfaces';

import { ControllerType } from '../../../editable-control-base/models/enums';
import { LookupInputData } from '../../../client-screen-lookup-core/models/interfaces';
import { TextInsertDialogComponent } from '../../../shared/components/text-insert-dialog/text-insert-dialog.component';
import * as _ from 'lodash';
import { ConflictCheckType, ConflictSearchOpenFrom } from '../../../conflict-search-core/models/enum';
import { MsgModel } from '../../../case-task-core/models/interface';
import {
  ConfirmDialogData, ConfirmDialogWithCancelResultKind, InforDialogData, ConfirmDialogResultKind, TextInsertDialogInput
} from '../../../shared/models/dialog';
import { ConfirmDialogComponentWithCancel, InforDialogComponent, ConfirmDialogComponent } from '../../../shared';
import { uuid } from '../../../utils/uuid';
import { ClientMatterModel, InitClientCreationData, ClientModel } from '../../../client-creation-core';
import { Client, ClientRiskAssessmentQuestion } from '../../../client-creation-core/models/interfaces';
import { UploadDocumentType } from '../../../client-creation-core/models/enums';
import { DatePipe } from '@angular/common';
import { Address } from '../../../shared/models/interface';
import { User } from './../../../auth/models/auth';
import { dpsNewDate } from '../../../utils/javascriptDate';
import { combineStirng } from '../../../core/utility/DpsUtility';
import { AccessControlService } from '../../../auth/services/access-control.service';
import { Module, SettingKey } from '../../../core/lib/app-settings';

@Component({
  selector: 'dps-client-creation-main-layout',
  templateUrl: './client-creation-main-layout.component.html',
  // template: `{{clientModelData | json}}`,
  styleUrls: ['./client-creation-main-layout.component.scss'],
})

export class ClientCreationMainLayoutComponent implements OnInit, OnChanges {

  @Input() initDataModel: InitClientCreationData;
  @Input() isLoading: boolean;
  @Input() isDocumentUploading: boolean;
  @Input() metaData: ScreenEditComponentTreeData[];
  @Input() isModelDirty: boolean;
  @Input() mode: Mode;
  @Input() clientModelData: ClientModel;
  @Input() clientSeatchList: any[];
  @Input() clientIndex: number;
  @Input() msg: MsgModel;
  @Input() typeChangedControllersModel: any;
  @Input() showConflictSearch: boolean;
  @Input() onpopupClosed: any;
  @Input() homeCurrency: string;
  @Input() isCrimeTabVisibility: boolean;
  @Input() isProofOfIDUpload: boolean;
  @Input() isProofOfAddressUpload: boolean;
  @Input() isCompanyProof1Upload: boolean;
  @Input() isCompanyProof2Upload: boolean;
  @Input() menuItem: MainMenuItem<any>[];
  @Input() user: User;
  @Input() matterPaginatorDef: PaginatorDef;
  @Input() clientMattersTotal: number;

  @Output() popupClosed = new EventEmitter<any>();
  @Output() popupCancel = new EventEmitter<any>();
  @Output() valueChangedData = new EventEmitter<any>();
  @Output() gridPageChange = new EventEmitter<any>();
  @Output() gridRowClick = new EventEmitter<any>();
  @Output() gridRowDeleteClick = new EventEmitter<any>();
  @Output() clientClearClick = new EventEmitter<any>();
  @Output() deleteClient = new EventEmitter<number>();
  @Output() lookupUpdateData = new EventEmitter<any>();
  @Output() upLoadFileData = new EventEmitter<any>();
  @Output() clientAdd = new EventEmitter<any>();
  @Output() clientSave = new EventEmitter<{ data: any, close: boolean }>();
  @Output() clientOk = new EventEmitter<any>();
  @Output() lastNameChanged = new EventEmitter<any>();
  @Output() copyFromCorrespondence = new EventEmitter<any>();
  @Output() clientTypeChangeValue = new EventEmitter<any>();
  @Output() privateIndividualValueChanged = new EventEmitter<any>();
  @Output() clientOpenMatterClick = new EventEmitter<any>();
  @Output() aMLSaveData = new EventEmitter<any>();
  @Output() conflictSerachClosed = new EventEmitter<number>();
  @Output() materGridRowClick = new EventEmitter<any>();
  @Output() documentGridRowClick = new EventEmitter<any>();
  @Output() coppyAndOpenMatter = new EventEmitter<any>();
  @Output() matterGridPageChange = new EventEmitter<PaginatorDef>();

  @Output() updateSelectedClientData = new EventEmitter<{
    clientId: number, clientSeatchList: ClientGridRowRapper[], clientIndex: number
  }>();
  @Output() addNewNote = new EventEmitter();
  @Output() changeNote = new EventEmitter<{ kind: string, row: number; value: any }>();
  @Output() deleteNote = new EventEmitter<number>();
  @Output() cancelChanges = new EventEmitter();
  @Output() uploadDocument = new EventEmitter<{
    file: File,
    note: string,
    clientId: number,
    clientRef: string,
    uploadDocumentType: UploadDocumentType,
  }>();
  @Output() changeRiskAssessmentQuation = new EventEmitter<ClientRiskAssessmentQuestion>();
  @Output() sumbimtRiskAsse = new EventEmitter();

  public clientFilterBranchList: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  selectedMatterRef: string;
  formMode: string;
  formTitle: string;
  amlResultString: string;
  amlColorClass: string;
  proofOfIdLable: string;
  proofOfAddressLable: string;

  noEntriesFoundLabel: string;
  placeholderLabel: string;
  meta: any;
  Mode = Mode;
  tabClick: boolean;
  selectedTab: any;
  currentDate: Date;
  inputEditScreenData: any;
  ControllerType = ControllerType;
  isHideUploadBtn = false;
  clientAllGridPageEvent: any;
  selectedMatterId: number;
  showStatmentnAddress = false;
  matterDisplayName = '';
  matterGridColumn: ColumnDef[] = [];
  crimeGridColumn: ColumnDef[] = [];
  documentGridColumn: ColumnDef[] = [];
  docRegisterGridColumn: ColumnDef[] = [];
  module = Module;
  isPlotUser$ = new Observable<any>();

  constructor(public popupService: SystemJsPopupLoaderService, private dialog: MatDialog, private datePipe: DatePipe,
    private cd: ChangeDetectorRef, public access: AccessControlService) {
    this.formMode = '';
    this.formTitle = 'Clients';
    this.amlResultString = 'Integrated AML Check';
    this.proofOfIdLable = '';
    this.proofOfAddressLable = '';

    this.noEntriesFoundLabel = 'No Data';
    this.placeholderLabel = 'Search';
  }

  get headerTitle(): string {
    return this.menuItem.find(i => i.id === 'client_creation').label;
  }

  onClientAdd() {
    this.clientAdd.emit();
  }
  onClientSave() {
    this.clientSave.emit({ data: this.clientModelData, close: false });
  }

  onClientOk() {
    if (this.isModelDirty) {
      this.closeWithConfermDialog();
    } else {

      const clientItem = this.initDataModel.lookupTitleType.lookupViewModels
        .filter((item) => item.luP_ID === this.clientModelData.client.clientTitle)[0];

      this.popupCancel.emit({
        clienModel: this.clientModelData.client,
        clientItem: clientItem
      });
    }
  }

  onPopupCancel() {
    if (this.isModelDirty) {
      this.closeWithConfermDialog();
    } else {
      this.popupCancel.emit();
    }
  }


  closeWithConfermDialog() {
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
        this.clientSave.emit({ data: this.clientModelData, close: true });
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
        this.popupCancel.emit();
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
      }
    });

  }

  ngOnInit() {
    this.isPlotUser$ = this.access.getSettingValue(SettingKey.IsPlotUser);
    this.matterDisplayName = this.menuItem.find(i => i.id === 'matter_search').label;

    this.matterGridColumn = [
      createDefultColumnDef('MatterFileID', { label: 'DPS OR', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('MatterId',
        { label: this.matterDisplayName + ' Id', fxFlex: '120px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('MatterRef', { label: 'Ref', fxFlex: '120px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('MatterStartDate', { label: 'Start Date', fxFlex: '90px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('MatterFeeEarner', { label: 'F/E', fxFlex: '70px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('MatterAppCode', { label: 'App', fxFlex: '130px', filterAnchor: 'end', filterHidden: true }),
    ];
    this.crimeGridColumn = [
      createDefultColumnDef('matterRef',
        { label: this.matterDisplayName + ' Ref', fxFlex: '120px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('bailConds', { label: 'Description', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
    ];
    this.documentGridColumn = [
      createDefultColumnDef('user', { label: 'User', fxFlex: '70px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('DateAdded', { label: 'Date Added', fxFlex: '90px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('type', { label: 'Type', fxFlex: '130px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('note', { label: 'Note', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('delete', { label: '', fxFlex: '50px', filterAnchor: 'end', filterHidden: true }),
    ];
    this.docRegisterGridColumn = [
      createDefultColumnDef('documentRef', { label: 'Doc Ref', fxFlex: '100px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('type', { label: 'Type', fxFlex: '70px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('location', { label: 'Location', fxFlex: '15', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('address', { label: 'Address', fxFlex: '20', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('reviewDate', { label: 'Review Date', fxFlex: '90px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('destroyDate',
        { label: 'Destroy Date', fxFlex: '90px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('matterRef',
        { label: this.matterDisplayName + ' Ref', fxFlex: '120px', filterAnchor: 'end', filterHidden: true }),
      createDefultColumnDef('matterDetails',
        { label: this.matterDisplayName + ' Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
    ];

    // this.clientFilterBranchList.next(this.branches.slice());
    this.selectedTab = 'INPtpgClient';
    this.currentDate = dpsNewDate(this.user.general.dateTimeOffset);
    this.clientAllGridPageEvent = { pageSize: 20, pageIndex: 0, length: 0 };

    this.inputEditScreenData = '';
    this.amlResultString = 'Integrated AML Check';
    this.amlColorClass = 'aml-carried-out';
    if (this.clientModelData && this.clientModelData.client && this.clientModelData.client.amlSearchResult) {
      this.amlSearchResultChange(this.clientModelData.client.amlSearchResult);
    }
    if (this.selectedTab) {
      if (this.metaDataLinker(this.selectedTab) && this.metaDataLinker(this.selectedTab).scL_Visible === false) {
        const dddd = this.getFirstVisibleTab();
        this.clientTabClick(this.getFirstVisibleTab().scL_Name);
      }
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.showConflictSearch && changes.showConflictSearch.currentValue === true) {
      this.popupService.openConflictSearchPopup('openConflictSearchPopup',
        {
          conflictCheckType: ConflictCheckType.Client,
          clientDto: this.clientModelData.client,
          openFrom: ConflictSearchOpenFrom.ClientCreation,
          commonPara: { data: '', status: '' }
        }
      ).subscribe((item) => {
        this.conflictSerachClosed.emit(this.clientModelData.client.clientId);
      });
    }
    if (changes.typeChangedControllersModel || changes.isCrimeTabVisibility || changes.mode) {
      this.manageTabs();
    }
    if (changes.onpopupClosed && changes.onpopupClosed.currentValue === true) {
      this.onPopupClosed();
    }
    if (changes.metaData) {
      if (this.metaDataLinker(this.selectedTab) && this.metaDataLinker(this.selectedTab).scL_Visible === false) {
        const ddddd = this.getFirstVisibleTab();
        this.clientTabClick(this.getFirstVisibleTab().scL_Name);
      }
    }
  }

  openMsgDialog(msg: string): void {
    const dialogData: InforDialogData = {
      content: {
        title: 'Message . . .',
        message: msg
      },
      data: { messageType: 'alert' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });
  }




  amlSearchResultChange(val) {
    if (val === 0) {
      this.amlResultString = 'AML Check Passed';
      this.amlColorClass = 'aml-passed';
    } else if (val === 1) {
      this.amlResultString = 'AML Check Not Passed';
      this.amlColorClass = 'aml-not-passed';

    } else if (val === -1) {
      this.amlResultString = 'AML Check Not Carried Out';
      this.amlColorClass = 'aml-carried-out';
    }
  }
  getProofOfDocVisibility(value) {
    if (!this.clientModelData || !this.clientModelData.clientEvents) {
      return false;
    }
    const doc = _.find(this.clientModelData.clientEvents, function (item: any) {
      return item.note === value;
    });
    return !doc;
  }

  lookupModelDataPassInt(event) {
    return +event;
  }

  get terms() {
    if (this.clientModelData && this.clientModelData.client
      && this.clientModelData.client.terms) {
      return +this.clientModelData.client.terms;
    } else {
      return null;
    }
  }
  get vatCode() {
    if (this.clientModelData && this.clientModelData.client
      && this.clientModelData.client.vatCode) {
      return +this.clientModelData.client.vatCode;
    } else {
      return null;
    }
  }
  onLookupClick(event) {
    // this.lookupData.emit(event);
    if (!event && !event.lookupType) {
      return;
    }
    const lookupInputData: LookupInputData = { lookupTypeTag: event.lookupType };
    this.popupService.openLookupClientPopup('clientLookupPopup', lookupInputData).subscribe((result: any) => {
      if (!result) {
        this.lookupUpdateData.emit(lookupInputData);
        return '';
      }
    });
  }
  onPageChange(index) {
    this.updateSelectedClientData.emit({
      clientId: this.clientSeatchList[index].clientId, clientIndex: index, clientSeatchList: null
    });
    this.isHideUploadBtn = false;
  }
  manageTabs() {
    if (
      (this.selectedTab === 'INPtpgPersonal' && !this.typeChangedControllersModel.isPersonalTabVisibility) ||
      (this.selectedTab === 'INPtpgCompany' && !this.typeChangedControllersModel.isCompanyTabVisibility) ||
      (this.selectedTab === 'INPtpgCrime' && (this.mode === Mode.AddMode || !this.isCrimeTabVisibility))) {
      this.clientTabClick('INPtpgClient');
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
        function (item: ScreenEditComponentTreeData) {
          return item.scL_IsTab && item.scL_Visible === true
            && item.scL_Name !== 'INPtpgAddrHome' && item.scL_Name !== 'INPtpgAddrStatement' && item.scL_Name !== 'INPtpgAddrOtherNames'
            && item.scL_Name !== 'INPtpgIDCheckCompany' && item.scL_Name !== 'INPtpgIDCheckIndividual'
            && item.scL_Name !== 'INPtpgIDCheckBeneficalOwner'
            && item.scL_Name !== 'INPtpgAddress';
        });
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
  onLableLinkClickData(metaData: ScreenEditComponentTreeData) {

  }
  onGridPageChange(pageEvent: PageEvent) {
    this.gridPageChange.emit(pageEvent);
  }
  clientTabClick(id) {
    this.selectedTab = id;
  }

  onValueChanged(type: ControllerType, value, modelName) {
    if (modelName === 'directorProofofID' || modelName === 'directorProofIDinfo') {
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: new Date().toDpsString(), model: 'proofIdInfoDateAdded' });
    } else if (modelName === 'directorAddressProof' || modelName === 'directorAddressinfo') {
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: new Date().toDpsString(), model: 'proofAddrsInfoDateAdded' });
    } else if (modelName === 'proofIdExpiryDate') {
      if (value) {
        value = new Date(value).toDpsString();
      }
    }
    if (modelName === 'onHold') {
      if (value === true) {
        value = 1;
      } else {
        value = 0;
      }
    }
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
  }
  onClientTypeChange(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    this.clientTypeChangeValue.emit(value);
    if (value && (value === 4 || value === 5)) {
      this.privateIndividualValueChanged.emit({ controllerType: type, value: true, model: '' });
    } else {
      this.privateIndividualValueChanged.emit({ controllerType: type, value: false, model: '' });
    }
  }
  onCrediteConrtolStageChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    if (value && value !== 0) {
      this.valueChangedData.emit({
        controllerType: ControllerType.input,
        value: this.datePipe.transform(dpsNewDate(this.user.general.dateTimeOffset), 'yyyy-MM-dd') + 'T00:00:00', model: 'dateStageSet'
      });
    } else {
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: null, model: 'dateStageSet' });
    }
  }
  onPrivateIndividualValueChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
    this.privateIndividualValueChanged.emit({ controllerType: type, value: value, model: modelName });
  }
  onFirstNameasdirectorChange(type: ControllerType, value, modelName) {
    if (value) {
      this.valueChangedData.emit({
        controllerType: ControllerType.input, value: this.clientModelData.client.directorForename, model: 'forename1'
      });
      this.valueChangedData.emit({ controllerType: ControllerType.dtp, value: this.clientModelData.client.directorDOB, model: 'doB1' });
      this.valueChangedData.emit({
        controllerType: ControllerType.input, value: this.clientModelData.client.directorSurname, model: 'surname1'
      });
    }
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
  }
  onLastNameChanged(type: ControllerType, value, modelName) {
    this.lastNameChanged.emit();
  }
  onCopyFromCorrespondence(event) {
    this.stopEventPropagation(event);
    this.copyFromCorrespondence.emit();
  }
  onBranchChanged(type: ControllerType, value, modelName) {
    this.valueChangedData.emit({ controllerType: type, value: value, model: modelName });
  }

  onClientSearch(item: Client) {
    let clientSearchData: ClientSearchPopupData;
    if (item) {
      clientSearchData = {
        clientRef: item.clientReference,
        searchText: '',
        branchId: item.branchID,
        clientName: item.clientName,
        firstName: item.firstName,
        lastName: item.lastName,
        clientTelephoneNo: item.clientTelephoneNo,
        clientEmail: item.clientEmail,
        clientSecondEmail: item.clientSecondEmail,
        clientAddress1: item.clientAddress1,
        clientAddress2: item.clientAddress2,
        clientCountry: item.clientCountry,
        clientFaxNo: item.clientFaxNo,
        clientTown: item.clientTown,
        clientPostCode: item.clientPostCode,
        clientMobileTelephoneNo: item.clientMobileTelephoneNo,
        clientWorkTelephoneNo: item.clientWorkTelephoneNo,
        clientContactName: item.clientContactName,
        popupType: ClientPopupType.GeneralClientSearch,
        popupPara: {
          firstName: '',
          lastName: '',
          companyName: '',
          email1: '',
        }
      };
    } else {
      clientSearchData = {
        clientRef: null,
        searchText: null,
        branchId: null,
        clientName: null,

        popupType: ClientPopupType.GeneralClientSearch,
        popupPara: {
          firstName: '',
          lastName: '',
          companyName: '',
          email1: '',
        }
      };
    }

    this.popupService.openClientSearchPopup('clientCreation', clientSearchData).subscribe((result: any) => {
      if (result && result.index !== undefined && result.gridData) {

        this.updateSelectedClientData.emit(
          {
            clientId: result.gridData[result.index].clientId,
            clientSeatchList: result.gridData,
            clientIndex: result.index
          });
      }
    });
  }
  onScreenEdit() {
    this.popupService.openScreenEditPopup('client_creation', { type: 'Client' }).subscribe((data) => {
    });
  }


  onPopupClosed() {
    const clientItem = this.initDataModel.lookupTitleType.lookupViewModels
      .filter((item) => item.luP_ID === this.clientModelData.client.clientTitle)[0];
    this.popupClosed.emit({
      clienModel: this.clientModelData.client,
      clientItem: clientItem
    });
  }


  aMLSave() {
    // this.aMLSaveData.emit();

    this.aMLSaveData.emit({ data: this.clientModelData, isAMLShow: this.initDataModel.isAMLShow, close: false });
    // this.saveSuccessMsg('');
  }
  saveSuccessMsg(errorMsg) {
    if (errorMsg === 1) {
      errorMsg = 'ERROR';
    } else if (errorMsg === 2) {
      errorMsg = 'REFER';
    } else {
      errorMsg = 'ERROR';
    }
    const dialogData: InforDialogData = {
      content: {
        title: 'AML Search',
        message: 'AML Search Result: ' + errorMsg
      },
      data: { messageType: 'warning' }
    };
    const dialogRef = this.dialog.open(InforDialogComponent, {
      data: dialogData,
      width: '400px',
      disableClose: true,
      panelClass: 'dps-notification'
    });

  }

  onRowClick(object) {
    this.gridRowClick.emit(object);
  }


  onDocumentRowClick(object) {
    this.documentGridRowClick.emit(object);
  }

  onMaterGridRowClick(event: ClientMatterModel) {
    if (event) {
      this.selectedMatterId = event.matterId;
    } else {
      this.selectedMatterId = null;
    }
  }


  onRowDeleteClick(object) {
    this.gridRowDeleteClick.emit(object);
  }


  onClientClear() {

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
          this.onClientAdd();
          setTimeout(() => {
            this.clientSave.emit({ data: this.clientModelData, close: false });
          }, 10);
        } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {
          //     self.UnlockClientRef();

          this.clientClearClick.emit();
          this.selectedTab = 'INPtpgClient';
        } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {
        }
      });
    } else {
      this.selectedTab = 'INPtpgClient';
      this.clientClearClick.emit();
    }
  }
  onClientDelete() {
    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Delete Client',
        message: `<p>Are you sure that you want to delete this client?</p>`,
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        // cancelLabel: 'Cancel'
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
        this.deleteClient.emit(this.clientModelData.client.clientId);
        this.selectedTab = 'INPtpgClient';
      } else if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {
      }
    });
  }

  onMattereDelete() {

    const dialogData: ConfirmDialogData = {
      content: {
        title: 'Delete ' + this.matterDisplayName,
        message: '<p>Are you sure that you want to delete this ' + this.matterDisplayName + ' ?</p>',
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
      if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {

        // this.deleteMatter.emit(this.matterModelData.matter);
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {

      }
    });

  }



  // Note
  onAddNewNote() {
    this.addNewNote.emit(this.user.general.user);
  }
  onChangeNote(event: { kind: string, row: number; value: any }) {
    this.changeNote.emit(event);
  }
  onDeleteNote(row: number) {
    this.deleteNote.emit(row);
  }
  onCancelChanges() {
    this.cancelChanges.emit();
  }
  onClientOpenMatterClick() {

    this.isPlotUser$.subscribe(isPlotUser => {
      if (this.selectedTab === 'INPtpgMatters' && this.selectedMatterId) {
        this.openWithCoppyMatter(isPlotUser);
      } else {
        const dialogData: ConfirmDialogData = {
          content: {
            title: 'New ' + this.matterDisplayName,
            message: `<p>Create a new ${isPlotUser ? 'master' : ''} ${this.matterDisplayName}?</p>`,
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

            this.popupService.openMatterCreationPopup(uuid(), {
              matterId: null,
              clientReference: (this.clientModelData.client && this.clientModelData.client.clientReference) ?
                this.clientModelData.client.clientReference : null,
              clientName: (this.clientModelData.client && this.clientModelData.client.clientName) ? this.clientModelData.client.clientName :
                null,
              matterIntroduction: this.clientModelData.client && this.clientModelData.client.clientIntroduction ?
                this.clientModelData.client.clientIntroduction : null,
              branchID: (this.clientModelData.client && this.clientModelData.client.branchID) ? this.clientModelData.client.branchID : null,
              clientList: this.clientModelData.client ? [{
                linkID: 0,
                accountRef: this.clientModelData.client.clientReference,
                accountName: combineStirng([this.clientModelData.client.firstName, this.clientModelData.client.lastName]),
                address: combineStirng([this.clientModelData.client.clientAddress1, this.clientModelData.client.clientAddress2,
                this.clientModelData.client.clientTown, this.clientModelData.client.clientCountry]),
                postcode: this.clientModelData.client.clientPostCode,
                contactID: !!this.clientModelData.client.contactID ? this.clientModelData.client.contactID : 0,
                screenNo: 0,
                leadClient: true,
                clientId: this.clientModelData.client.clientId
              }] : []
            }).subscribe((result: any) => {
              if (result !== 'close') {
                this.onPopupClosed();
              }
            });
          } else if (dialogResult.kind === ConfirmDialogResultKind.Rejected) {

          }
        });
      }

    });
  }

  matterGridRowDoubleClick(matterData) {
    if (!matterData || !matterData.matterId) {
      return;
    }
    this.popupService.openMatterCreationPopup(uuid(),
      {
        matterId: matterData.matterId
      }
    ).subscribe((result) => {
      if (result && result !== 'close') {
        this.onPopupClosed();
      }

    });
  }


  openWithCoppyMatter(isPlotUser: boolean) {

    const dialogData: ConfirmDialogData = {
      content: {
        title: 'New ' + this.matterDisplayName,
        // tslint:disable-next-line: max-line-length
        message: `<p> Create a new  ${isPlotUser ? 'master' : ''} ${this.matterDisplayName}? Select New or Copy (of selected ${this.matterDisplayName}).</p>`,
        acceptLabel: 'New',
        rejectLabel: 'Copy',
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

      // New
      if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Yes) {

        this.popupService.openMatterCreationPopup('matter_creation',
          {
            clientReference: this.clientModelData.client.clientReference,
            branchID: this.clientModelData.client.branchID,
            clientName: this.clientModelData.client.clientName
          }
        ).subscribe((result) => {

          if (result && result !== 'close') {
            this.onPopupClosed();
          }

        });
        // Copy
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.No) {

        this.coppyAndOpenMatter.emit({
          clientId: this.clientModelData.client.clientId,
          matterId: this.selectedMatterId
        });

        //  Cancel
      } else if (dialogResult.kind === ConfirmDialogWithCancelResultKind.Cancel) {

      }

    });

  }

  // Document Tab
  onFileUploadChange(files: File[]) {
    if (files && files[0]) {
      const dialogData: TextInsertDialogInput = {
        content: {
          title: 'Item Description',
          details: '',
          message: 'Enter a description of the file',
          placeholder: ''
        },
        allowEmpty: true,
        text: '',
        showCancelBtn: false
      };
      const dialogRef = this.dialog.open(TextInsertDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification'
      });
      dialogRef.afterClosed().subscribe(dialogResult => {

        this.isHideUploadBtn = true;
        this.uploadDocument.emit(
          {
            file: files[0],
            note: dialogResult,
            clientId: this.clientModelData.client.clientId,
            clientRef: this.clientModelData.client.clientReference,
            uploadDocumentType: UploadDocumentType.Documents,

          });
      });
    }
  }




  uploadProofOfIdProof1(files: File[]) {
    this.uploadDocument.emit(
      {
        file: files[0],
        note: 'Company Proof 1',
        clientId: this.clientModelData.client.clientId,
        clientRef: this.clientModelData.client.clientReference,
        uploadDocumentType: UploadDocumentType.CompanyProof1,
      });
  }


  uploadProofOfIdProof2(files: File[]) {
    this.uploadDocument.emit(
      {
        file: files[0],
        note: 'Company Proof 2',
        clientId: this.clientModelData.client.clientId,
        clientRef: this.clientModelData.client.clientReference,
        uploadDocumentType: UploadDocumentType.CompanyProof2,
      });
  }


  uploadProofOfId(files: File[]) {
    this.uploadDocument.emit(
      {
        file: files[0],
        note: 'Proof of ID',
        clientId: this.clientModelData.client.clientId,
        clientRef: this.clientModelData.client.clientReference,
        uploadDocumentType: UploadDocumentType.ProofofID,
      });
  }


  uploadProofOfAddress(files: File[]) {
    this.uploadDocument.emit(
      {
        file: files[0],
        note: 'Proof of Address',
        clientId: this.clientModelData.client.clientId,
        clientRef: this.clientModelData.client.clientReference,
        uploadDocumentType: UploadDocumentType.ProofofAddress,
      });
  }

  autofillAddress(newAddress: Address) {
    setTimeout(() => {
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.address1, model: 'clientAddress1' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.address2, model: 'clientAddress2' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.town, model: 'clientTown' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.country, model: 'clientCountry' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.postCode, model: 'clientPostCode' });
      this.cd.detectChanges();
    }, 100);
  }

  autofillCompanyAddress(newAddress: Address) {
    setTimeout(() => {
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.address1, model: 'companyAddress1' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.address2, model: 'companyAddress2' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.town, model: 'companyTown' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.country, model: 'companyCountry' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.postCode, model: 'companyPostCode' });
      this.cd.detectChanges();
    }, 100);
  }

  autofillStatementAddress(newAddress: Address) {
    setTimeout(() => {
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.address1, model: 'statementAddress1' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.address2, model: 'statementAddress2' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.town, model: 'statementTown' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.country, model: 'statementCountry' });
      this.valueChangedData.emit({ controllerType: ControllerType.input, value: newAddress.postCode, model: 'statementPostCode' });
      this.cd.detectChanges();
    }, 100);
  }

  get isShowOtherNameTab(): boolean {
    if (!this.metaDataLinker('INPtpgAddrOtherNames').scL_Visible) {
      return false;
    } else if (!this.metaDataLinker('INPtxtAdditionalName1').scL_Visible
      && !this.metaDataLinker('INPtxtAdditionalName2').scL_Visible
      && !this.metaDataLinker('INPtxtAdditionalName3').scL_Visible) {
      return false;
    }
    return true;
  }
  get isShowStatementGroup(): boolean {
    if (!this.metaDataLinker('INPtxtAddressStatementAddr1').scL_Visible
      && !this.metaDataLinker('INPtxtAddressStatementAddr2').scL_Visible
      && !this.metaDataLinker('INPtxtAddressStatementTown').scL_Visible
      && !this.metaDataLinker('INPtxtAddressStatementCountry').scL_Visible
      && !this.metaDataLinker('INPtxtAddressStatementPostcode').scL_Visible) {
      return false;
    }
    return true;
  }

  get isShowContactGroup(): boolean {
    if (!this.metaDataLinker('INPtxtAddressStatementContactName').scL_Visible
      && !this.metaDataLinker('INPtxtAddressStatementContactEmail').scL_Visible
      && !this.metaDataLinker('INPtxtAddressStatementContactTel').scL_Visible
      && !this.metaDataLinker('INPtxtAddressStatementContactFax').scL_Visible) {
      return false;
    }
    return true;
  }

  get isShowPaymeantBankGroup(): boolean {
    if (!this.metaDataLinker('INPchkBACSPayment').scL_Visible
      && !this.metaDataLinker('INPtxtBACSCode').scL_Visible
      && !this.metaDataLinker('INPcboCreditDebitAccountType').scL_Visible
      && !this.metaDataLinker('INPtxtCompanyAccountName').scL_Visible
      && !this.metaDataLinker('INPtxtCompanyAccountNo').scL_Visible
      && !this.metaDataLinker('INPtxtCompanyAccountSortcode').scL_Visible) {
      return false;
    }
    return true;
  }

  stopEventPropagation(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  onChangeRiskAssestmentQuation(item: ClientRiskAssessmentQuestion) {
    this.changeRiskAssessmentQuation.emit(item);
  }

  onSumbimtSRiskAsse() {
    this.sumbimtRiskAsse.emit();
  }
  get matterPageEvent(): PageEvent {
    const pageEvent = new PageEvent();
    if (this.matterPaginatorDef) {
      pageEvent.length = this.clientMattersTotal;
      pageEvent.pageIndex = this.matterPaginatorDef.currentPage;
      pageEvent.pageSize = this.matterPaginatorDef.itemPerPage;
    } else {
      pageEvent.length = 0;
      pageEvent.pageIndex = 0;
      pageEvent.pageSize = 0;
    }

    return pageEvent;
  }

  public onNextPage(pageEvent: PageEvent): void {
    const pageDef: PaginatorDef = { currentPage: pageEvent.pageIndex, itemPerPage: pageEvent.pageSize };
    this.matterGridPageChange.emit(pageDef);
  }

}
