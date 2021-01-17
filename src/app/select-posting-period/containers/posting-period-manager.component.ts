import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { InitPosingPeriod, SetSelectedPosingPeriod } from '../actions/core';
import { getPostingPeriodListByToken, getPostingPeriodLoadingByToken, getSelectedPostingPeriodByToken } from '../reducers/index';

@Component({
  selector: 'dps-posting-period-manager',
  template: '<ng-content></ng-content>'
})
export class PostingPeriodManagerComponent implements OnInit {

  @Input() postingPeriodToken: string;

  @Output() closePopup = new EventEmitter<any>();

  public PostingPeriodLoading$: any;
  public postingPeriodList$: any;
  public selectedPostingPeriod$: any;

  constructor(protected store: Store<any>) { }

  ngOnInit() {

    this.store.dispatch(new InitPosingPeriod(this.postingPeriodToken));

    this.PostingPeriodLoading$ = this.store.select(getPostingPeriodLoadingByToken(this.postingPeriodToken));
    this.postingPeriodList$ = this.store.select(getPostingPeriodListByToken(this.postingPeriodToken));
    this.selectedPostingPeriod$ = this.store.select(getSelectedPostingPeriodByToken(this.postingPeriodToken));

  }
  onSetSelectedPostingPeriod(item) {
    this.store.dispatch(new SetSelectedPosingPeriod(this.postingPeriodToken, { selectedPeriod: item }));
  }
  onClosePostingPeriod(info: any) {
    this.closePopup.emit(info);
  }
}
