import { ConflictCheckType } from './../../../conflict-search-core/models/enum';
import { InforDialogComponent } from '../../../shared/components/infor-dialog/infor-dialog.component';
import { InforDialogData } from '../../../shared/models/dialog';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar, MatDialog, PageEvent } from '@angular/material';
import {
  CommonPara, Client, ConflictSearchGridRowItemWrapper, ClientMatterRowItemWrapper, SearchModel, SearchState
} from '../../../conflict-search-core/models/interfaces';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../../shared';
import { ConflictSaveType, ConflictSearchOpenFrom } from '../../../conflict-search-core/models/enum';
import { createDefultColumnDef } from '../../../core/lib/grid-helpers';
import { ColumnDef } from '../../../core/lib/grid-model';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-conflict-search-layout',
  templateUrl: './conflict-search-layout.component.html',
  styleUrls: ['./conflict-search-layout.component.scss']

})
export class ConflictSearchLayoutComponent implements OnInit, OnChanges {
  @Input() isLoading: boolean;
  @Input() isDirty: boolean;
  @Input() searchModel: SearchModel;
  @Input() conflictSearchList: ConflictSearchGridRowItemWrapper[];
  @Input() clientMatterList: ClientMatterRowItemWrapper[];
  @Input() client: Client;
  @Input() searchState: SearchState;
  @Input() conflictSearchPageEvent: PageEvent;
  @Input() clientMatterPageEvent: PageEvent;
  @Input() saveType: ConflictSaveType;
  @Input() loadingData: boolean;
  @Input() clientMatterLoading: boolean;
  @Input() isExit: boolean;
  @Input() openFrom: ConflictSearchOpenFrom;
  @Input() conflictCheckType: ConflictCheckType;
  @Input() popupCommonPara: CommonPara;
  @Input() companyList: string[];
  // @Input() clientDtoData: any;

  @Output() search = new EventEmitter<SearchModel>();
  @Output() searchNew = new EventEmitter<SearchModel>();
  @Output() close = new EventEmitter<any>();
  @Output() save = new EventEmitter<string>();
  @Output() conflictSearchPageChange = new EventEmitter<PageEvent>();
  @Output() clientMatterhPageChange = new EventEmitter<PageEvent>();
  @Output() rowClick = new EventEmitter<ConflictSearchGridRowItemWrapper>();
  @Output() opportunityConflictSearch = new EventEmitter<any>();
  @Output() opportunityConflictSearchSave = new EventEmitter<any>();
  @Output() companyListOut = new EventEmitter<any>();

  conflictSearchForm: FormGroup;
  showMatterDetail: boolean;
  conflictSearchOpenFrom = ConflictSearchOpenFrom;

  get getIsSearchEnabale(): boolean {
    if (this.searchState === SearchState.AfterSearchApplySucsess
      || this.searchState === SearchState.SaveSearchSucsess) {
      return false;
    }
    return true;
  }

  get getClientAddress(): string {
    if (this.client) {
      const addressFileds = ['clientAddress1', 'clientAddress2', 'clientTown', 'clientCountry', 'clientPostCode'];
      const addressParts = [];
      addressFileds.forEach((val) => {

        if (this.client[val]) {
          addressParts.push(this.client[val]);
        }
      });
      return addressParts.join(' ');
    }
    return '';
  }

  constructor(public snackBar: MatSnackBar, private dialog: MatDialog, private fb: FormBuilder, private menu: MainMenuItemResolverService) {

  }
  clientMatterhGridColumn: ColumnDef[] = [
    createDefultColumnDef('MatterReferenceNo', { label: 'Ref', fxFlex: '125px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('MatterDetails', { label: 'Details', fxFlex: '', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('feeEarner', { label: 'Fee Earner ', fxFlex: '125px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('Status', { label: 'Status ', fxFlex: '125px', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('StartDate', { label: 'Start Date', fxFlex: '125px', filterAnchor: 'end', filterHidden: true }),
  ];
  conflictSearchGridColumn: ColumnDef[] = [
    createDefultColumnDef('ref', { label: 'Ref', fxFlex: '10', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('name', { label: 'Name', fxFlex: '35', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('details', { label: 'Details', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('postCode', { label: 'Postcode', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('dOB', { label: 'DOB', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
    createDefultColumnDef('match', { label: 'Match', fxFlex: '25', filterAnchor: 'end', filterHidden: true }),
  ];
  ngOnInit() {
    this.conflictSearchForm = this.fb.group({
      surname: this.searchModel.surname,
      forname: this.searchModel.forname,
      dOB: this.searchModel.dOB,
      postCode: this.searchModel.postCode,
      company: this.searchModel.company,
      matterDetails: this.searchModel.matterDetails,
      includeClientWithNoMatter: this.searchModel.includeClientWithNoMatter,
      isClientTypeCompany: this.searchModel.isClientTypeCompany,
    });
  }
  updateSearchState() {
    const surname = this.conflictSearchForm.get('surname');
    const forname = this.conflictSearchForm.get('forname');
    const dOB = this.conflictSearchForm.get('dOB');
    const company = this.conflictSearchForm.get('company');
    const matterDetails = this.conflictSearchForm.get('matterDetails');

    if (this.getIsSearchEnabale) {
      surname.enable();
      forname.enable();
      dOB.enable();
      company.enable();
      matterDetails.enable();
    } else {
      surname.disable();
      forname.disable();
      dOB.disable();
      company.disable();
      matterDetails.disable();
    }
  }
  updateConflictSearchFormValues() {
    const surname = this.conflictSearchForm.get('surname');
    const forname = this.conflictSearchForm.get('forname');
    const dOB = this.conflictSearchForm.get('dOB');
    const postCode = this.conflictSearchForm.get('postCode');
    const company = this.conflictSearchForm.get('company');
    const matterDetails = this.conflictSearchForm.get('matterDetails');
    const includeClientWithNoMatter = this.conflictSearchForm.get('includeClientWithNoMatter');
    const isClientTypeCompany = this.conflictSearchForm.get('isClientTypeCompany');

    surname.patchValue(this.searchModel.surname);
    forname.patchValue(this.searchModel.forname);
    dOB.patchValue(this.searchModel.dOB);
    postCode.patchValue(this.searchModel.postCode);
    company.patchValue(this.searchModel.company);
    includeClientWithNoMatter.patchValue(this.searchModel.includeClientWithNoMatter);
    isClientTypeCompany.patchValue(this.searchModel.isClientTypeCompany);
    matterDetails.patchValue(this.searchModel.matterDetails);
    this.showMatterDetail = this.searchModel.isClientTypeCompany;
  }
  onRowClick(item) {
    this.rowClick.emit(item);
  }
  onConflictSearchPageChange(pageEvent: PageEvent) {
    this.conflictSearchPageChange.emit(pageEvent);
  }
  onClientMatterhPageChange(pageEvent: PageEvent) {
    this.clientMatterhPageChange.emit(pageEvent);
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchState && !changes.searchState.isFirstChange() && changes.searchState.currentValue) {
      this.updateSearchState();
    }
    if (changes.searchModel && !changes.searchModel.isFirstChange() && changes.searchModel.currentValue) {
      this.updateConflictSearchFormValues();
    }
    if (changes.isExit && !changes.isExit.isFirstChange()
      && changes.isExit.currentValue === true) {
      this.close.emit();
    }
  }
  openInfoSnackBar(msg) {
    if (msg) {
      this.snackBar.open(msg, '', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
  onSearchClient() {
    this.search.emit(this.conflictSearchForm.value);
  }
  onClear() {
    this.searchNew.emit();
  }
  onSaveAndNew(event) {
    this.save.emit(ConflictSaveType.SaveAndGotoNewItem);
  }
  onSave(event) {
    this.save.emit(ConflictSaveType.Save);
  }
  onClose() {
    if (this.openFrom === ConflictSearchOpenFrom.OpenCase && this.searchState !== SearchState.AfterSearchApplySucsess) {
      this.close.emit();
    } else if (this.openFrom === ConflictSearchOpenFrom.OpportunitySave && this.searchState !== SearchState.OpportunitySearchSucsess) {
      this.close.emit();
    } else if (this.openFrom === ConflictSearchOpenFrom.OpportunityQuote && this.searchState !== SearchState.OpportunitySearchSucsess) {
      this.close.emit();
    } else if (this.searchState === SearchState.OpportunitySaveSucsess) {
      this.close.emit();
    } else if (this.searchState === SearchState.OpportunitySearchSucsess) {
      const message = '<p>You have not saved the conflict search result. Do you want to save results and exit?</p>';
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Conflict search',
          message: message,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.opportunityConflictSearchSave.emit(ConflictSaveType.SaveAndGotoNewItem);
        } else {
          this.close.emit();
        }
      });
    } else if (this.searchState === SearchState.SaveSearchSucsess) {
      this.close.emit();
    } else if (this.searchState === SearchState.AfterSearchApplySucsess) {
      let message = '<p>Do you want to save the conflict search to the client</p>';
      if (this.conflictCheckType === ConflictCheckType.Matter) {
        message = '<p>Do you want to save the conflict search to the events diary</p>';
      }
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Conflict search saved',
          message: message,
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '400px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          this.save.emit(ConflictSaveType.SaveAndClose);
        } else {
          this.close.emit();
        }
      });
    } else {
      const dialogData: InforDialogData = {
        content: {
          title: 'Conflict search saved',
          message: 'You are required to do conflict search'
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
  }
  chnageIsClientTypeCompany() {
    this.showMatterDetail = !this.showMatterDetail;
  }
  onRunOpportunityConflictSearch() {
    this.opportunityConflictSearch.emit(this.conflictSearchForm.value);
  }
  onSaveOpportunityConflictSearch() {
    this.opportunityConflictSearchSave.emit(ConflictSaveType.SaveAndGotoNewItem);
  }
  onAddCompany() {
    const company = this.conflictSearchForm.get('company');
    if (company && company.value) {
      this.companyListOut.emit(company.value);
    }
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }
}
