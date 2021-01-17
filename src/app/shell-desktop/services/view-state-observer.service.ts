
import { map } from 'rxjs/operators';
import { Injectable, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { } from '../models/enums';

@Injectable()
export class ViewStateObserverService {

  constructor(private store: Store<any>) { }

  private openCaseHost: ViewContainerRef;

  getMailVisibility() {
    // TEMP solution till restructure the layout module
    return this.store.select('dpsLayout').pipe(map((layoutState) =>
      layoutState && layoutState.mainMenu &&
   layoutState.mainMenu.viewStack ? layoutState.mainMenu.viewStack : null),
      map((value) => (window.opener && window.opener !== window) || (!!value && value[0] === 'mail')));
  }

  getMainVisibility() {
    // TEMP solution till restructure the layout module
    return this.store.select('dpsLayout').pipe(map((layoutState) =>
      layoutState && layoutState.mainMenu &&
        layoutState.mainMenu.viewStack ? layoutState.mainMenu.viewStack : null),
      map((value) => !!value && value[0] === 'main'));
  }

  setOpenCaseHostRef(ref: ViewContainerRef) {
    this.openCaseHost = ref;
  }

  getOpenCaseHostRef() {
    return this.openCaseHost;
  }

}
