import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dps-overlay-container',
  template: '<ng-content></ng-content>',
  styleUrls: ['./overlay-container.component.scss']
})
export class OverlayContainerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
