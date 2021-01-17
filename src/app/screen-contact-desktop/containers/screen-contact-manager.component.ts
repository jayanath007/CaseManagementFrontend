import { ICallbackData } from '../../screen-view-core/models/contact-search-params';
import { Matter } from '../../core/lib/matter';

import { ContactScreenItemWrapper, ContactSearchAction, ContactFieldDef} from '../../screen-contact-core/models/interface';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogData } from '../../shared/models/dialog';
import { IScreenDefinition } from '../../screen-view-core/models/screen-definition';
import { BaseScreenContactManager } from '../../screen-contact-core/containers/base-screen-contact-manager';
import { getContactScreenPageEventByToken } from '../../screen-contact-core/reducers/screen-contact';
import { PageEvent, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentBase } from '../../core';
import * as ContactScreenCore from '../../screen-contact-core';
import { GridChangeKind, RowItemChangeKind, ViewChangeKind } from '../../screen-contact-core/actions/core';
import { ContactScreenItem, ContactSearchResult, ContactSearchType } from '../../screen-contact-core/models/interface';
import { MatterInfo } from '../../core/lib/matter';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';
import { FieldType } from '../../odata/enums';
import { ScreenContactPopupManagerComponent } from './screen-contact-popup-manager.component';
import { ContactItemWrapper } from '../../contact-core/models/interface';
import { element } from 'protractor';
import { MatDialog } from '@angular/material';
import { ConfirmDialogResultKind } from '../../shared';
import { take } from 'rxjs/internal/operators/take';

@Component({
  selector: 'dps-screen-contact-manager',

  // template: `  {{screenContactData$ | async | json }}`,
  template: `
  <dps-screen-contact-layout
  [fontSizeClass]="fontSizeClass"
  [searchType]="searchType"
  [newContactPermission]="newContactPermission"
  [token]="token"
  [contactScreenData]="contactScreenData$ | async"
  [pageInfo]="pageInfo$ | async"
  [visibleColumnDef]="visibleColumnDef$ | async"
  [defaultSearchFields]="defaultSearchFields$ | async"
  [mappedSearchFields]="mappedSearchFields$ | async"
  [searchText]="searchText$ | async"
  [screenDefinition]="screenDefinition"
  [isLoading]="isLoading$ | async"
  [isContactsLoading]="isContactsLoading$ | async"
  [authUser]="authUser$ | async"
  (viewChange)="onViewChange($event)"
  (rowChange)="onRowChange($event)"
  (onDeleteContacts)="onDeleteContacts($event)"
  (onNewContact)="newContact($event)"
  (onContactHighlighted)="contactHighlighted($event)"
  (onContactSelected)="contactSelected($event)"
  (onClose)="closePopup($event)"
  (onRemoveFromFile)="removeFromFile()"
  (onSearchFieldChanged)="searchFieldChanged($event)"
  (onViewChange)="onViewChange($event)"
  (onSaveSearchFields)="saveSearchFields($event)"
  >
  </dps-screen-contact-layout>
 `,
  styleUrls: []
})
export class ScreenContactManagerComponent extends BaseScreenContactManager implements OnInit, OnChanges {

  @Input() matterDetails: Matter;
  @Input() refreshCount: number;
  @Input() token: string;
  @Input() fontSizeClass: string;
  @Input() screenDefinition: IScreenDefinition;
  @Input() newContactPermission: boolean;
  // @Input() contactSearchAction: ContactSearchAction;
  @Input() searchType: ContactSearchType;

  public contactScreenData$: any;
  public searchText$: any;
  public pageInfo$: any;
  public visibleColumnDef$: any;
  public selectedContacts$: any;
  public linkedMatterCount$: any;
  public defaultSearchFields$: any;
  public mappedSearchFields$: any;
  public isLoading$: any;
  public isContactsLoading$: any;
  public authUser$: any;

  selectedContactsSubscription: any;
  linkedMatterCountSubscription: any;

  constructor(store: Store<any>, public dialogRef: MatDialogRef<ScreenContactPopupManagerComponent>, private matDialog: MatDialog) {
    super(store);
  }

  onRowChange(item) {
    // this.store.dispatch(new fileHistoryCore.ContactScreenGridRowChange
    //   (this.token, { kind: RowItemChangeKind.IsExpand, row: item, value: '' }));
  }
  // onViewChange(item) {
  //   // this.store.dispatch(new fileHistoryCore.ContactScreenViewChange(this.token, item));
  // }
  onSearchTextChanged(searchText) {
    // this.store.dispatch(new fileHistoryCore.ContactScreenViewChange
    //   (this.token, { kind: ViewChangeKind.SearchText, value: searchText }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterDetails) {
      // this.token = 'InitScreenContact' + changes.matterDetails.currentValue.MatterReferenceNo;
      this.onChange(this.token, {
        matterDetails: this.matterDetails,
        searchType: this.searchType,
        screenDefinition: this.screenDefinition,
        searchField: this.searchParams.mappedField,
        searchFieldValue: this.searchParams.fieldValue
       });
      this.contactScreenData$ = this.getCurrentContactList(this.token);
      this.visibleColumnDef$ = this.getVisibleColumnDef(this.token);
      this.pageInfo$ = this.getPageEventByToken(this.token);
      this.linkedMatterCount$ = this.getLinkedMatterCountForSelectedContact(this.token);
      this.defaultSearchFields$ = this.getDefaultSearchFields(this.token);
      this.mappedSearchFields$ = this.getMappedSearchFields(this.token);
      this.searchText$ = this.getSearchText(this.token);
      this.isLoading$ = this.getIsLoading(this.token);
      this.isContactsLoading$ = this.getIsContactsLoading(this.token);
      this.authUser$ = this.getAuthUser();
    }
    this.selectedContacts$ = this.getSelectedContacts(this.token);

    if (changes.refreshCount &&
      !changes.refreshCount.firstChange) {
      if (changes.matterDetails) {
        if (changes.matterDetails.previousValue === changes.matterDetails.currentValue) {
          // this.refresh(this.token);
        }
      } else {
        // this.refresh(this.token);
      }
    }

  }

  ngOnInit() {
  }

  closePopup(event) {
    this.dialogRef.close(<ContactSearchResult>{
      action: ContactSearchAction.UserClosed,
      searchType: this.searchType
    });
    if (this.searchType === ContactSearchType.CONFIGURE) {
      this.discardSearchFieldChanges(this.token);
    }
  }

  onDeleteContacts(event) {
  this.selectedContactsSubscription = this.selectedContacts$.pipe(
  take(1))
  .subscribe((selectedContacts) => {
    if (selectedContacts.length > 1) {
      console.log('deleted multiple');
      const message = `YOU ARE ABOUT TO DELETE ${selectedContacts.length} CONTACTS PERMANENTLY FROM THE DPS DATABASE!. Are you sure?`;
      this.showDeleteConfirmation(message, selectedContacts);
   } else if (selectedContacts.length === 1) {
     console.log('delete single');
        if (this.searchType === ContactSearchType.FILE) {
          // get linked matter count
          this.linkedMatterCountSubscription = this.linkedMatterCount$
          .filter(count => count !== null)
          .subscribe((mattercount) => {
            console.log(`linked matter count: ${mattercount}`);
            const message = ` THIS CONTACT WILL BE PERMANENTLY DELETED FROM THE DPS DATABASE
            (This contact is linked to ${mattercount} matters). Are you sure you want to delete this contact?`;
            this.showDeleteConfirmation(message, selectedContacts);
          });
          this.fetchLinkedMatters(this.token, selectedContacts[0]);
        } else {
          const message = `THIS CONTACT WILL BE PERMANENTLY DELETED FROM THE DPS DATABASE.
          Are you sure you want to delete this contact?`;
          this.showDeleteConfirmation(message, selectedContacts);
        }
   }
  });
  }

  private showDeleteConfirmation(message: string, selectedContacts: [ContactScreenItemWrapper]) {
    const confirmDialogRef = this.showConfirmDialog('Delete Contact',
    message);
    confirmDialogRef.afterClosed().subscribe(result => {
      if (result.kind === ConfirmDialogResultKind.Confirmed) {
        console.log('delete contact');
        this.deleteContacts(this.token, selectedContacts);
      }

      this.selectedContactsSubscription.unsubscribe();
      if (this.linkedMatterCountSubscription) {  this.linkedMatterCountSubscription.unsubscribe(); }
    });
  }

  showConfirmDialog(title: string, message: string) {
    const dialogData: ConfirmDialogData = {
      content: {
          title: title,
          message: message,
          acceptLabel: 'YES',
          rejectLabel: 'NO'
      },
      data: null,
  };
  return this.matDialog.open(ConfirmDialogComponent, {
      data: dialogData,
      width: '350px',
      panelClass: 'dps-notification'
  });
  }

  deleteSingleContact() {

  }

  newContact(event) {
    this.dialogRef.close(<ContactSearchResult>{
      action: ContactSearchAction.NewContact,
      searchType: this.searchType
    });
  }

  contactHighlighted(event) {
    console.log('On Contact Highlighted');
    this.store.dispatch(new ContactScreenCore.ContactScreenGridChange
         (this.token, { kind: GridChangeKind.ItemSelected, value: event }));
  }

  contactSelected(event) {
    this.dialogRef.close(<ContactSearchResult>{
      action: ContactSearchAction.ContactSelected,
      searchType: this.searchType,
      selectedContactId: event
    });
  }

  removeFromFile() {
  this.selectedContactsSubscription = this.selectedContacts$.pipe(
  take(1))
  .subscribe((selectedContacts) => {
    if (selectedContacts.length > 0) {
      const message = (selectedContacts.length === 1) ? 'Remove this contact from file?' : 'Remove contacts from file?';
      const confirmDialogRef = this.showConfirmDialog('DPS Contacts',
        message);
        confirmDialogRef.afterClosed().subscribe(result => {
          if (result.kind === ConfirmDialogResultKind.Confirmed) {
            console.log(`deleting contacts ${selectedContacts}`);
           this.removeContactFromFile(this.token, this.matterDetails, this.screenDefinition, selectedContacts);
          }
          this.selectedContactsSubscription.unsubscribe();
        });
      }
  });
  }

  searchFieldChanged(fieldDef: ContactFieldDef) {
    this.applySearchFieldChanges(this.token, fieldDef);
  }

  saveSearchFields($event) {
    super.saveSearchFields(this.token);
    this.dialogRef.close(<ContactSearchResult>{
      action: ContactSearchAction.OnSaveSearchFields,
      searchType: this.searchType
    });
  }

  onViewChange(event) {
    super.onViewChange(this.token, event);
  }
}
