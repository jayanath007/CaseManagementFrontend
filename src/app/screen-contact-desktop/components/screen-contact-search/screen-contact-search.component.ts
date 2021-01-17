import { ContactFieldDef } from './../../../screen-contact-core/models/interface';

import { debounceTime, buffer } from 'rxjs/operators';
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { emit } from 'cluster';

import { element } from 'protractor';
import { DataSource } from '@angular/cdk/collections';
import {
  ContactScreenItem, ItemSelectionViewModel, ContactSearchType,
  ContactScreenItemWrapper
} from '../../../screen-contact-core/models/interface';
import {
  Component, OnInit,
  ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, OnDestroy, AfterViewInit
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
// import { ViewChangeKind } from '../../../screen-contact-core/actions/core';
import { ColumnDef, PaginatorDef } from '../../../core/lib/grid-model';
import { Filter, Condition } from '../../../odata';

import { ViewChangeKind } from '../../../screen-contact-core/actions/core';
import { IScreenDefinition } from '../../../screen-view-core/models/screen-definition';



@Component({
  selector: 'dps-screen-contact-search',
  templateUrl: './screen-contact-search.component.html',
  styleUrls: ['./screen-contact-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScreenContactSearchComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('screenContactGridContent') screenContactGridContent;

  @Input() fontSizeClass: string;
  @Input() visibleColumnDef: ContactFieldDef[];
  @Input() contactScreenData;
  @Input() pageInfo: PageEvent;
  @Input() searchType: ContactSearchType;
  @Input() isLoading: boolean;
  @Input() isContactsLoading: boolean;
  @Input() searchText: string;
  @Input() screenDefinition: IScreenDefinition;
  @Input() newContactPermission: boolean;
  @Input() isMuiliClient: boolean;

  @Output() onExpandSelection = new EventEmitter<ContactScreenItem>();
  @Output() viewChange = new EventEmitter<{ kind: ViewChangeKind, value: any }>();
  @Output() onDeleteContacts = new EventEmitter<ContactSearchType>();
  @Output() onNewContact = new EventEmitter();
  @Output() onContactHighlighted: EventEmitter<ItemSelectionViewModel> = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onContactSelected = new EventEmitter<number>();
  @Output() onRemoveFromFile = new EventEmitter();
  @Input() columnDef: ColumnDef[];

  headerLabel: string;
  isAllSearch: boolean;
  isFileSearch: boolean;
  isSearchByField: boolean;
  buttonColumnDef: ColumnDef;
  private clicks = new Subject();
  private clickSubscription: Subscription;
  pageSizeOptions = [10, 25, 50, 100];
  onExpand(item: ContactScreenItem, row: number) {
  }

  onPageChange(pageEvent: PageEvent) {
    this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  }

  onFilterApply(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: true };
    console.log('apply column filter', data);
    this.viewChange.emit({ kind: ViewChangeKind.ApplyColumnFilter, value: filterDef });
  }

  onFilterClear(data: { filter: Filter<Condition>, def: ColumnDef }) {
    const filterDef: ColumnDef = { fieldName: data.def.fieldName, filter: data.filter, filterActive: false };
    this.viewChange.emit({ kind: ViewChangeKind.ClearColumnFilter, value: filterDef });
  }

  opened(e) {
  }
  constructor() {
  }

  ngOnInit(): void {
    this.isAllSearch = this.searchType === ContactSearchType.All;
    this.isFileSearch = this.searchType === ContactSearchType.FILE;
    this.isSearchByField = this.searchType === ContactSearchType.FIELD;
    switch (this.searchType) {
      case ContactSearchType.All:
      case ContactSearchType.FIELD:
        this.headerLabel = `All Contacts: ${this.screenDefinition.screenDefinitionDto.contactTypeBaseDescription}`;
        break;
      case ContactSearchType.FILE:
        this.headerLabel = `File Contacts: ${this.screenDefinition.screenDefinitionDto.contactTypeDescription}`;
        this.buttonColumnDef = {
          filterActive: false,
          filter: null,
          fieldName: '',
          extras: {
            fxFlex: '1',
            filterHidden: true,
          }
        };
        break;
    }

    this.clickSubscription = this.clicks.pipe(
      buffer<any>(this.clicks.pipe(debounceTime(250))))
      .subscribe(arr => {
        const contact = arr[0].contact;
        const event = arr[0].event;
        if (arr.length === 1) {
          this.onSingleClick(event, contact);
        } else if (arr.length === 2) {
          this.ondbClick(event, contact);
        }
      });
  }



  ngOnDestroy() {
    this.clickSubscription.unsubscribe();
  }

  ngOnChanges(changes: any) {

  }

  newContact(event) {
    this.onNewContact.emit();
  }

  deleteContacts(event) {
    // emite selected contacts
    this.onDeleteContacts.emit(ContactSearchType.All);
  }

  closePopup() {
    this.onClose.emit();
  }

  rowClicked(event, selectedContact) {
    event.preventDefault();
    event.stopPropagation();
    // need to handle both click and double click through observable
    this.clicks.next({ event: event, contact: selectedContact });
  }

  onSingleClick(event, contact) {
    let multiSelection: boolean;
    if (!event.ctrlKey && !event.metaKey) {
      // single selection
      multiSelection = false;
    } else {
      // multi selection
      multiSelection = true;
    }
    this.onContactHighlighted.emit({
      id: contact.contactId,
      isMultiSelection: multiSelection
    });
  }

  ondbClick(event, contact) {
    this.onContactSelected.emit(contact.contactId);
  }
  removeFromFile($event) {
    this.onRemoveFromFile.emit();
  }

  onSearchTextChanged($event) {
    this.viewChange.emit({ kind: ViewChangeKind.SearchText, value: $event });
  }

  calculateLayoutWidth() {
    if (this.visibleColumnDef) {
      let colCount = this.visibleColumnDef.length;
      const val = 125 * colCount;
      return `${val}px`;
    }

  }

  get getColums(): ContactFieldDef[] {
    if (this.isMuiltiClientScreen) {
      const muiltiClientCol: ContactFieldDef[] = [
        {

          filterActive: false,
          filter: null,
          fieldName: 'Account Ref',
          visible: true,
          extras: { label: 'Account Ref', fxFlex: '100px', filterAnchor: 'start', filterHidden: true, disableShort: true },

          sC_ID: 0,
          contactField: 'salAccountRef',
          showSearch: false,
          modified: false,
          checked: false,
          mappedField: false,
        },
        {

          filterActive: false,
          filter: null,
          fieldName: 'Account Name',
          visible: true,
          extras: { label: 'Account Name', fxFlex: '150px', filterAnchor: 'start', filterHidden: true, disableShort: true },

          sC_ID: 0,
          contactField: 'name',
          showSearch: false,
          modified: false,
          checked: false,
          mappedField: false,
        },
        {

          filterActive: false,
          filter: null,
          fieldName: 'Address',
          visible: true,
          extras: { label: 'Address', fxFlex: '', filterAnchor: 'start', filterHidden: true, disableShort: true },

          sC_ID: 0,
          contactField: 'address',
          showSearch: false,
          modified: false,
          checked: false,
          mappedField: false,
        },
        {

          filterActive: false,
          filter: null,
          fieldName: 'Post Code',
          visible: true,
          extras: { label: 'Post Code', fxFlex: '80px', filterAnchor: 'start', filterHidden: true, disableShort: true },

          sC_ID: 0,
          contactField: 'postCode',
          showSearch: false,
          modified: false,
          checked: false,
          mappedField: false,
        },
        {

          filterActive: false,
          filter: null,
          fieldName: 'Client',
          visible: true,
          extras: { label: 'Client', fxFlex: '80px', filterAnchor: 'start', filterHidden: true, disableShort: true },

          sC_ID: 0,
          contactField: 'isLeadClient',
          showSearch: false,
          modified: false,
          checked: false,
          mappedField: false,
        }
      ];

      return muiltiClientCol;
    }
    return this.visibleColumnDef;
  }

  get isMuiltiClientScreen(): boolean {
    return (this.isMuiliClient && (this.screenDefinition.contactType === 4));
  }

}
