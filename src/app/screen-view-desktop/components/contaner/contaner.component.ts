import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';

import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';



@Component({
  selector: 'dps-contaner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="field-property-container">
  <label
  [ngClass]="{'search-field-property':screenContanerComponent.searchField}"
   [style.width.px]="screenContanerComponent.contanerLable.width"
   [style.margin-top.px]="screenContanerComponent.contanerLable.marginTop"
   [style.margin-left.px]="screenContanerComponent.contanerLable.marginLeft"
   [style.font-weight]="screenContanerComponent.contanerLable.marginTop"
   [style.font-size]="screenContanerComponent.contanerLable.marginLeft"
   [style.font-family]="screenContanerComponent.contanerLable.width"
   [style.background-color]="backgroundColor"
   [style.color]="screenContanerComponent.contanerLable.color"
   >
  {{ screenContanerComponent.contanerLable.value }}</label>
      <ng-content> </ng-content>
  </div>
  `,
  styleUrls: ['./contaner.component.scss']
})
export class ContanerComponent implements OnInit {

  @Input()
  screenContanerComponent: ScreenContanerComponent;

  backgroundColor;

  constructor() {

  }

  ngOnInit() {
    if (this.screenContanerComponent.mainState.disabilityColors) {
        this.backgroundColor = 'background-color:darkblue;';
    }
  }

}
