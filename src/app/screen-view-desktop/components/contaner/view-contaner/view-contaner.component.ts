import { FormGroup } from '@angular/forms';
import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';
import { ScreenDefinition } from '../../../../screen-view-core/models/screen-definition';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-view-contaner',
  template: `
  <div >
      <ng-content> </ng-content>
  </div>
  `,
  styleUrls: ['./view-contaner.component.scss']
})
export class ViewContanerComponent implements OnInit {

  @Input()
  screenContanerComponent: ScreenContanerComponent;

  constructor() { }

  ngOnInit() {
  }

}
