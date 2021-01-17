import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseCrimeClassProceedingManager } from '../../crime-class-information-proceedings-core/containers/base-crime-class-proceeding-manager';
import { CrimeProceedingClassInfoInput } from '../../core/lib/crime-managment';
import { ModelProperty } from '../../crime-class-information-proceedings-core/models/enum';

@Component({
  selector: 'dps-crime-class-proceeding-manager',
  template: '<ng-content></ng-content>'
})
export class CrimeClassProceedingManagerComponent extends BaseCrimeClassProceedingManager implements OnInit {

  constructor(store: Store<any>) {
    super(store);
  }

  @Input() token: string;
  @Input() input: CrimeProceedingClassInfoInput;

  ngOnInit() {
    super.init(this.token, this.input.crimeClassIdentityViewModel);
  }
  onChangeUserInput(event: { key: ModelProperty, value: any }) {
    this.changeUserInput(this.token, event);
  }
  onSave() {
    this.saveInfo(this.token);
  }
  onOpenLocationSearch(searchText: string) {
    this.openLocationSearch(this.token, searchText);
  }
  onCloseReopenClass(closedata: string) {
    this.closeReopenClass(this.token, closedata);
  }
}
