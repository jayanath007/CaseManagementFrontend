import { DeleteException, HideException } from '../actions/exceptions';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getExceptionList } from '../reducers';

@Component({
  selector: 'dps-exception-indicator-manager',
  template: `
    <dps-exception-indicator
     (removeException)="onRemoveException($event)"
     (closeException)="onRemoveException($event)"
     [exceptionList]="exceptionList$ | async"> </dps-exception-indicator> `,
  styles: [],
})
// <dps-exception-boostrap> </dps-exception-boostrap>
export class ExceptionIndicatorManagerComponent implements OnInit {


  exceptionList$;

  constructor(private store: Store<any>) { }

  ngOnInit() {
    this.exceptionList$ = this.store.select(getExceptionList);
  }

  onRemoveException(event: number) {
    this.store.dispatch(new HideException(event));
  }

}

