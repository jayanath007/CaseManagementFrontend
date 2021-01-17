
import { startWith } from 'rxjs/operators';
import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';
import { User } from '../../../core/lib/microsoft-graph';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SearchMailFromListManagerComponent } from '../../containers/search-mail-from-list-manager.component';




@Component({
  selector: 'dps-add-mail-box-popup',
  templateUrl: './add-mail-box-popup.component.html',
  styleUrls: ['./add-mail-box-popup.component.scss']
})
export class AddMailBoxPopupComponent implements OnInit, AfterViewInit {

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(SearchMailFromListManagerComponent) manager: SearchMailFromListManagerComponent;

  searchedPeople: { text: string, people: User[] } = { text: '', people: [] };
  selectedUser: User;
  inputCtrl = new FormControl();
  showLoader = false;
  showSearchList = false;
  filteredUsers: Observable<any[]>;
  showProfileImg = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { icon: string, title: string, message: string, sender: User }) { }

  ngOnInit() {
    this.selectedUser = this.data.sender;
  }
  ngAfterViewInit() {
    // this.filteredUsers = this.inputCtrl.valueChanges
    //   .startWith(null)
    //   .map(value => this.filterUsers(value));
    // this.inputCtrl.valueChanges
    //   .startWith(null)
    //   .map(value => { debugger; return; });
    this.inputCtrl.valueChanges.pipe(
      startWith(null))
      .subscribe(value => this.filterUsers(value));
    this.manager.searcheUsers$.subscribe((result: { text: string, people: [User] }) => {
      if (result.text === this.inputCtrl.value) {
        this.searchedPeople = result;
        this.showSearchList = true;
        this.showLoader = false;
      }
    });
  }

  filterUsers(name: string) {
    const filtedList = [];
    if (name) {
      this.showLoader = true;
      this.showSearchList = false;
      this.manager.searcheUsers(name);
    } else {
      this.showLoader = false;
      this.showSearchList = false;
    }
    return filtedList;
  }
  optionSelected(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value;
    this.showProfileImg = false;
    this.selectedUser = this.searchedPeople.people.find(val => val.id === value);

    this.inputCtrl.setValue('', { emitEvent: true });
  }
  removeFrom() {
    this.showProfileImg = false;
    this.selectedUser = null;
    this.inputCtrl.setValue('', { emitEvent: true });
  }
}
