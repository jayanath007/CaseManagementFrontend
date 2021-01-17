import { AttachedToMatterAndOpenMailPopup } from './../../layout-desktop/actions/main-menu';
import { BaseCaseContactManager } from './../../case-contact-core/containers/base-case-contact-manager';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as caseContactCore from '../../case-contact-core';
import { CaseContact, ContactItemWrapper } from './../../case-contact-core/models/interface';
import { EventEmitter, Output } from '@angular/core';
import * as fileHistoryCore from '../../case-contact-core';
import { ViewChangeKind, RowItemChangeKind } from '../../case-contact-core/actions/core';
import { MatterInfo } from '../../core/lib/matter';


@Component({
  selector: 'dps-case-contact-manager',
  template: `
  <dps-case-contact-layout
  [fontSizeClass]="fontSizeClass"
  [matterInfo]="matterInfo"
  [token]="token"
  [caseContactData]="caseContactData$ | async"
  [pageInfo]="pageInfo$ | async"
  [columnDef]="columnDef$ | async"
  [contactMode]="contactMode$ | async"

  (viewChange)="onViewChange($event)"
  (rowChange)="onRowChange($event)"
  (openMailPopup)="onOpenMailPopup($event)"
  (selectRow)="onSelectRow($event)"
  (selectRowForSearch)="onSelectRowForSearch($event)"
    >
  </dps-case-contact-layout>
 `,
  styleUrls: []
})
export class CaseContactManagerComponent extends BaseCaseContactManager implements OnInit, OnChanges {

  @Input() matterInfo: MatterInfo;
  @Input() refreshCount: number;
  @Input() token: string;
  @Input() fontSizeClass: string;
  @Input() openCaseToken: string;
  @Input() fromContact = false;
  @Input() searchText = '';

  @Output() selectRow = new EventEmitter<{ contactId: number, closeSearch: boolean }>();
  @Output() selectRowForSearch = new EventEmitter<CaseContact>();

  public caseContactData$: any;
  public searchText$: any;
  public pageInfo$: any;
  public columnDef$: any;
  public contactMode$: any;

  constructor(store: Store<any>) {
    super(store);
  }

  ngOnInit() {
  }

  onRowChange(item) {
    this.store.dispatch(new caseContactCore.CaseContactGridRowChange
      (this.token, { kind: RowItemChangeKind.DoubleClick, row: item, value: this.openCaseToken }));
  }
  onViewChange(item) {
    this.store.dispatch(new caseContactCore.CaseContactViewChange(this.token, item));
  }
  onOpenMailPopup(request) {
    this.store.dispatch(new AttachedToMatterAndOpenMailPopup(this.token, { draftIdRequest: request }));
  }
  onSearchTextChanged(searchText) {
    this.store.dispatch(new caseContactCore.CaseContactViewChange
      (this.token, { kind: ViewChangeKind.SearchText, value: searchText }));
  }

  onSelectRow(data: { row: ContactItemWrapper, isDblClick: boolean }) {

    this.store.dispatch(new caseContactCore.CaseContactGridRowChange(this.token,
      { kind: RowItemChangeKind.DoubleClick, row: data.row, value: this.openCaseToken }));

  }

  onSelectRowForSearch(info: ContactItemWrapper) {
    this.selectRowForSearch.emit(info.data);
  }


  ngOnChanges(changes: SimpleChanges) {

    if (changes.matterInfo) {
      if (!this.token) {
        this.token = changes.matterInfo.currentValue ?
          'InitCaseContact' + changes.matterInfo.currentValue.MatterReferenceNo : 'InitCaseContact';
      }


      this.onChangeData();

      this.caseContactData$ = this.getCurrentGridData(this.token);
      this.searchText$ = this.getSearchText(this.token);
      this.columnDef$ = this.getColumnDef(this.token);
      this.contactMode$ = this.getContactMode(this.token);
      this.pageInfo$ = this.store.select(fileHistoryCore.getCaseContactPageEventByToken(this.token));
    }

    if (changes.searchText) {
      this.onSearchTextChange(this.token, this.searchText);
    }

    if (changes.refreshCount && !changes.refreshCount.firstChange && this.fromContact) {
      if (changes.matterInfo) {
        if (changes.matterInfo.previousValue === changes.matterInfo.currentValue) {
          this.refresh(this.token);
        }
      } else {
        this.refresh(this.token);
      }
    }



    // this.pageInfo$ = this.store.select(fileHistoryCore.getCaseContactPageEventByToken(this.token));
    // if (changes.refreshCount &&
    //   !changes.refreshCount.firstChange) {
    //   if (changes.matterInfo) {
    //     if (changes.matterInfo.previousValue === changes.matterInfo.currentValue) {
    //       this.refresh(this.token);
    //     }
    //   } else {
    //     this.refresh(this.token);
    //   }
    // }


  }

  onChangeData() {
    // const columnDef = [
    //   createDefultColumnDef('TypeDescription', { label: 'Role on Case', fxFlex: '12', filterAnchor: 'end' }),
    //   createDefultColumnDef('CT_Forename ', { label: 'Name', fxFlex: '12', filterAnchor: 'start' }),
    //   createDefultColumnDef('CTC_CompanyName', { label: 'Company', fxFlex: '12', filterAnchor: 'start' }),
    //   createDefultColumnDef('CTC_Telephone', { label: 'Telephone', fxFlex: '100px', filterAnchor: 'start' }),
    //   createDefultColumnDef('CT_Email', { label: 'Email', fxFlex: '180px', filterAnchor: 'end' }),
    //   createDefultColumnDef('CTC_PostCode', { label: 'Postcode', fxFlex: '90px', filterAnchor: 'end' }),
    //   createDefultColumnDef('CTC_Address1', { label: 'Address', fxFlex: '', filterAnchor: 'end' }),
    // ];

    this.onChange(this.token, {
      columnDef: [], matterInfo: this.matterInfo,
      fromContact: this.fromContact, searchText: this.searchText
    });
  }





}
