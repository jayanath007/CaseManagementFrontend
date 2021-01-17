import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-lookup-screen-popup',
  template: `
 <dps-lookup-screen-content-manager #manager>
  <dps-lookup-screen-layout [columnDef] = "manager.columnDef" [lookupDataModel]="manager.lookupDataModel"></dps-lookup-screen-layout>
  </dps-lookup-screen-content-manager>
  `,
  styleUrls: []
})
export class LookupScreenPopupComponent implements OnInit {

  constructor() { }
  ngOnInit() {
  }
}
