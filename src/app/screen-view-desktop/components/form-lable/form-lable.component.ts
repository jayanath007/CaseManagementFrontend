import { Component, ViewContainerRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { Field } from '../../../screen-view-core/models/field';
import { EditorControl } from '../../../screen-view-core/models/control';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'dps-form-lable',
  styleUrls: ['./form-lable.component.scss'],
  //   template: `
  //   <div class="label-componenent-wrap"
  //   [ngStyle]="containerStyle(screenContanerComponent)"
  //    [formGroup]="group">
  //        <label  [ngStyle]="controlStyle(screenContanerComponent)">{{ screenContanerComponent.contanerLable.value }}</label>
  //   </div>
  // `

  template: `
<dps-contaner class="label-componenent-wrap" [screenContanerComponent]="screenContanerComponent" [formGroup]="group" >
<span class="var" [style.left.px]="screenContanerComponent.contanerLable.width + 10">{{screenContanerComponent.varNo}}</span>
     <div class="dps-clear-both"></div>
</dps-contaner>
`



})
export class FormLableComponent extends EditorControl implements Field {
  @ViewChild('dynamicController') dynamicController: ElementRef;

  screenContanerComponent: ScreenContanerComponent;
  group: FormGroup;

  constructor(dialog: MatDialog) {
    super(dialog);
  }

}
