import {
  ItemSelectionViewModel, ContactSearchType,
  ContactScreenItemWrapper, ContactFieldDef
} from '../../../screen-contact-core/models/interface';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatterInfo } from '../../../core/lib/matter';
import { IScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { User } from './../../../auth/models/auth';

@Component({
  selector: 'dps-screen-contact-layout',
  templateUrl: './screen-contact-layout.component.html',
  styleUrls: ['./screen-contact-layout.component.scss']
})
export class ScreenContactLayoutComponent implements OnInit {


  @Input() fontSizeClass: string;
  @Input()
  matterInfo: MatterInfo;
  @Input()
  token: string;
  @Input()
  contactScreenData: any;
  @Input()
  public pageInfo: any;
  @Input()
  public visibleColumnDef: any;
  @Input()
  public defaultSearchFields: ContactFieldDef[];
  @Input()
  public mappedSearchFields: ContactFieldDef[];
  @Input()
  searchType: ContactSearchType;
  @Input() newContactPermission: boolean;
  pageSizeOptions = [10, 25, 50, 100];
  @Input() searchText: string;
  @Input() screenDefinition: IScreenDefinition;
  @Input() isLoading: boolean;
  @Input() isContactsLoading: boolean;
  @Input() authUser: User;

  @Output() rowChange = new EventEmitter();
  @Output() viewChange = new EventEmitter();
  @Output() onDeleteContacts = new EventEmitter<ContactSearchType>();
  @Output() onNewContact = new EventEmitter();
  @Output() onContactHighlighted: EventEmitter<ItemSelectionViewModel> = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onContactSelected = new EventEmitter<number>();
  @Output() onRemoveFromFile: EventEmitter<ContactScreenItemWrapper> = new EventEmitter();
  @Output()
  public onSearchFieldChanged: EventEmitter<ContactFieldDef> = new EventEmitter();
  @Output() onSaveSearchFields = new EventEmitter();

  isContactSearch: boolean;


  constructor() {

  }


  closePopup() {
    this.onClose.emit();
  }


  onExpand(event) {
    this.rowChange.emit(event);
  }
  onViewChange(event) {
    this.viewChange.emit(event);
  }

  // onPageChange(pageEvent: PageEvent) {
  //   this.viewChange.emit({ kind: ViewChangeKind.PageEvent, value: pageEvent });
  // }

  ngOnInit() {
    switch (this.searchType) {
      case ContactSearchType.All:
      case ContactSearchType.FILE:
      case ContactSearchType.FIELD:
        this.isContactSearch = true;
        break;
      case ContactSearchType.CONFIGURE:
        this.isContactSearch = false;
        break;
    }
  }

  deleteContacts(event) {
    this.onDeleteContacts.emit(event);
  }

  newContact(event) {
    this.onNewContact.emit();
  }

  contactHighlighted(event) {
    this.onContactHighlighted.emit(event);
  }

  contactSelected(contactId: number) {
    this.onContactSelected.emit(contactId);
  }

  removeFromFile($event) {
    this.onRemoveFromFile.emit($event);
  }

  searchFieldChanged(fieldDef: ContactFieldDef) {
    this.onSearchFieldChanged.emit(fieldDef);
  }

  saveSearchFields(event) {
    this.onSaveSearchFields.emit();
  }

  get isMuiliClient(): boolean {
    if (this.authUser && this.authUser.general && this.authUser.general.settingValues) {
      return this.authUser.general.settingValues.MultipleClientsOnMatter;
    }
    return false;
  }


}
