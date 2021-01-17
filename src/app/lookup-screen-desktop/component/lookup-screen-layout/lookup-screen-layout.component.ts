import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dps-lookup-screen-layout',
  templateUrl: './lookup-screen-layout.component.html',
  styleUrls: ['./lookup-screen-layout.component.scss']
})
export class LookupScreenLayoutComponent implements OnInit {
  @Input() columnDef;
  // @Input()
  // public columnDef: any;
  @Input() lookupDataModel;
  constructor() { }

  ngOnInit() {
  }

}
