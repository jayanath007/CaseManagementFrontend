import { Component, OnInit } from '@angular/core';
import { createDefultColumnDef } from '../../core/lib/grid-helpers';

@Component({
  selector: 'dps-lookup-screen-content-manager',
  template: '<ng-content></ng-content>',
})


export class LookupScreenContentManagerComponent implements OnInit {
  columnDef: any;
  lookupDataModel: any;
  constructor() { }

  ngOnInit() {
    this.columnDef = [
      createDefultColumnDef('DisplayName ', {
        label: 'Display Name', fxFlex: '20', filterAnchor: 'start',
        filterHidden: true, hidden: false
      }),
      // tslint:disable-next-line:max-line-length
      createDefultColumnDef('Description ', { label: 'Description', fxFlex: '', filterAnchor: 'start', filterHidden: true, hidden: false }),
      createDefultColumnDef('Hide ', { label: 'Hide', fxFlex: '10', filterAnchor: 'start', filterHidden: true, hidden: false }),
      createDefultColumnDef('Action ', { label: 'Action', fxFlex: '10', filterAnchor: 'start', filterHidden: true, hidden: false }),
    ];


  }
}

