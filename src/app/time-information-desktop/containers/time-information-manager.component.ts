import { LookupType } from './../../shared/models/dialog';
import { BaseTimeInformationManager } from './../../time-information-core/containers/base-time-information-manager';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { SystemJsPopupLoaderService } from '../../shell-desktop';
import { FeeEarner } from './../../core/lib/crime-managment';

@Component({
  selector: 'dps-time-information-manager',
  template: '<ng-content></ng-content>',
})
export class TimeInformationManagerComponent extends BaseTimeInformationManager implements OnInit {
  @Input() inputData;
  @Input() token;


  constructor(store: Store<any>, public popupService: SystemJsPopupLoaderService) {
    super(store);
  }

  ngOnInit() {
    super.initSelectors(this.token, this.inputData);
  }

  // onOpenPoliceStationSearch(searchText) {
  //   this.popupService.openPoliceStationPopup('TimeInformation', searchText)
  //     .subscribe((result: PoliceStationList) => {
  //       if (result) {
  //         this.onChangePoliceStation(`${result.code} - ${result.name}`);
  //         return '';
  //       }
  //     });
  // }

  onExceedLimit() {
    this.exideLimit(this.token);
  }

  openLookup(data: { lookupType: LookupType, property: string }) {
    this.onOpenLookup(this.token, data.lookupType, data.property);
  }

  onRemoveAttendee(data: { lookupType: LookupType, property: string }) {
    this.removeAttendee(this.token, data.lookupType, data.property);
  }

  onClassChange(classId: number) {
    this.classChange(this.token, classId);
  }

  onChangeFeeEarner(feeEarner: FeeEarner) {
    this.changeFeeEarner(this.token, feeEarner);
  }


}
