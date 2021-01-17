
import {
  getFlLoadingByToken, getFormsLibrarytreeByToken,
  getFlSearchTextByToken, getSelectedItemChildListByToken
} from './../reducers/index';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitFormsLibrary, TreeItemChange, RunLetterEnging, SearchFormsLibraryData, ResetTree } from '../actions/core';
import { ItemChangeKind } from '../models/enums';
import { Injector } from '@angular/core';

@Component({
  selector: 'dps-forms-library-manager',
  template: '<ng-content></ng-content>'
})
export class FormsLibraryManagerComponent implements OnInit {

  @Input() inputData: any;
  @Input() formsLibraryToken: string;

  @Output() closePopup = new EventEmitter<any>();

  public formsLibrarytree$: any;
  public flLoading$: any;
  public selectedMenuChildList$: any;
  public searchText$: any;

  constructor(protected store: Store<any>) {
  }
  ngOnInit() {

    this.store.dispatch(new InitFormsLibrary(this.formsLibraryToken, { matterData: this.inputData }));

    this.formsLibrarytree$ = this.store.select(getFormsLibrarytreeByToken(this.formsLibraryToken));
    this.flLoading$ = this.store.select(getFlLoadingByToken(this.formsLibraryToken));
    this.selectedMenuChildList$ = this.store.select(getSelectedItemChildListByToken(this.formsLibraryToken));
    this.searchText$ = this.store.select(getFlSearchTextByToken(this.formsLibraryToken));

  }
  onItemChange(event) {
    this.store.dispatch(new TreeItemChange(this.formsLibraryToken, { kind: event.kind, value: event.value }));
    if (event.kind === ItemChangeKind.RunWorkFlow) {
      this.store.dispatch(new RunLetterEnging(this.formsLibraryToken, event.value));
    }
  }
  onCloseformsLibrary(info: any) {
    this.closePopup.emit(info);
    this.store.dispatch(new ResetTree(this.formsLibraryToken));
  }
  onSearchText(searchText) {
    this.store.dispatch(new SearchFormsLibraryData(this.formsLibraryToken, { searchText: searchText }));
  }
}
