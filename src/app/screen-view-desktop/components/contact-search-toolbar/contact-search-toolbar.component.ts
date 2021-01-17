import { ContactToolBarAction } from '../../../screen-contact-core/models/interface';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MainMenuItemResolverService } from '../../../layout-desktop';

@Component({
  selector: 'dps-contact-search-toolbar',
  templateUrl: './contact-search-toolbar.component.html',
  styleUrls: ['./contact-search-toolbar.component.scss']
})
export class ContactSearchToolbarComponent implements OnInit {

  constructor(private menu: MainMenuItemResolverService) { }

  @Input() enableSaving;
  @Input() currentContactId;
  @Input() contactsOnFile = 0;
  @Input() oneOnlyPerMatter: boolean;
  @Input() contactType: number; // 4 === client
  @Input() disableSearchButtons: boolean;
  @Output() onSearchAction = new EventEmitter<ContactToolBarAction>();

  ngOnInit() {
  }

  onSearchAll(event) {
    this.onSearchAction.emit(ContactToolBarAction.SearchAll);
  }

  onSearchOnFile(event) {
    this.onSearchAction.emit(ContactToolBarAction.SearchOnFile);
  }

  onConfigSearch(event) {
    this.onSearchAction.emit(ContactToolBarAction.ConfigSearch);
  }

  onRemoveFromFile(event) {
    this.onSearchAction.emit(ContactToolBarAction.RemoveFromFile);
  }

  onSaveContact(event) {
    this.onSearchAction.emit(ContactToolBarAction.SaveNewContact);
  }

  onClear(event) {
    this.onSearchAction.emit(ContactToolBarAction.Clear);
  }

  resoleModuleName(menuId) {
    return this.menu.getModuleDisplayName(menuId);
  }
}
