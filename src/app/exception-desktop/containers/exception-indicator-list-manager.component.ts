import { DeleteException, HideException } from '../actions/exceptions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getExceptionListAll } from '../reducers';

@Component({
  selector: 'dps-exception-indicator-list-manager',
  template: `
    <dps-exception-indicator-item  [data]='event'
      (removeException)="onDeleteException($event)"
      *ngFor="let event of exceptionList$ | async "
      [closeIcon]='"close"' >
    </dps-exception-indicator-item>
  `,
  styles: [],
})
// class="dps-notification"
// <dps-exception-boostrap> </dps-exception-boostrap>
export class ExceptionIndicatorListManagerComponent implements OnInit {

  exceptionList$;
  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.exceptionList$ = this.store.select(getExceptionListAll);
  }
  onDeleteException(event: number) {
    this.store.dispatch(new DeleteException(event));
  }
}

