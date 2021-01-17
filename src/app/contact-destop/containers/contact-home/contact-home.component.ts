import { PageEvent } from '@angular/material';
import { Store } from '@ngrx/store';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ComponentBase } from '../../../core';
import * as contactCore from '../../../contact-core';
import { ViewChangeKind, RowItemChangeKind } from '../../../contact-core/actions/core';
import { ContactItemWrapper } from '../../../contact-core/models/interface';
import { MatterInfo } from '../../../core/lib/matter';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'dps-contact-home',
  templateUrl: './contact-home.component.html',
  styleUrls: ['./contact-home.component.scss']
})
export class ContactHomeComponent extends ComponentBase implements OnInit, OnChanges {


  @Input()
  matterInfo: MatterInfo;

  token: string;
  public contactData$: any;
  public serchText$: any;
  public pageInfo$: any;

  username: string;

  constructor(private store: Store<any>) {
    super();
  }


  IsExpand(item: ContactItemWrapper) {
    console.log('IsExpand', item);
    // tslint:disable-next-line:max-line-length
    this.store.dispatch(new contactCore.ContactGridRowChange(this.token, { kind: RowItemChangeKind.IsExpand, row: item, value: '' }));
  }
  PageChangeEvent(pageEvent: PageEvent) {
    // tslint:disable-next-line:max-line-length
    console.log('PageChangeEvent', pageEvent);
    this.store.dispatch(new contactCore.ContactViewChange(this.token, { kind: ViewChangeKind.PageEvent, value: pageEvent }));
  }

  OnSearchTextChanged(searchText) {
    // tslint:disable-next-line:max-line-length
    this.store.dispatch(new contactCore.ContactViewChange(this.token, { kind: ViewChangeKind.SearchText, value: searchText }));
  }


  handleViewChanges(state) {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.matterInfo) {
      this.token = 'InitContact' + changes.matterInfo.currentValue.MatterReferenceNo;
      this.store.dispatch(new contactCore.InitContact(this.token, this.matterInfo));
      this.contactData$ = this.store.select(contactCore.getContactGridDataByToken(this.token));
      this.serchText$ = this.store.select(contactCore.getContactSearchTextByToken(this.token));
      this.pageInfo$ = this.store.select(contactCore.getContactPageEventByToken(this.token));
    }
  }

  ngOnInit() {
    const viewUpdate = this.contactData$.pipe(
      takeUntil(this.destroy$))
      .subscribe((state) => {
        this.handleViewChanges(state);
        console.log('data', state);
      });
  }

}
