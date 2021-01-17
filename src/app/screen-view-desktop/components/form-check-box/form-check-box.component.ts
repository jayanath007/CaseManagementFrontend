import { ControllerFields } from '../../../screen-view-core/models/field';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';

import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { Field } from '../../../screen-view-core/models/field';
import { EditorControl } from '../../../screen-view-core/models/control';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-form-check-box',
  styleUrls: ['./form-check-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <dps-contaner class="label-componenent-wrap" [ngStyle]="containerStyle(screenContanerComponent)"
  matTooltip ="{{screenContanerComponent.control.helpText}}"
  matTooltipShowDelay='tooltipShowDelay' matTooltipShowDelay="1000"
  [screenContanerComponent]="screenContanerComponent"
  [formGroup]="group">

      <input type="checkbox"
      [attr.disabled]="(screenContanerComponent.control.readonly || !screenContanerComponent.control.enabale)?'disabled':null"
       #dynamicController
      (change)="onChange($event)" (blur)="onBlur($event)"
      [attr.control-name]="screenContanerComponent.control.name"
      [formControlName]="screenContanerComponent.control.name"
      [ngStyle]="controlStyle(screenContanerComponent)" >
      <span class="var" [style.left.px]="screenContanerComponent.contanerLable.width + 31">{{screenContanerComponent.varNo}}</span>
     <div class="dps-clear-both"></div>
   </dps-contaner>
  `
})
export class FormCheckBoxComponent extends EditorControl implements Field, AfterViewInit {
  screenContanerComponent: ScreenContanerComponent;
  screenDefinition: ScreenDefinition;
  @ViewChild('dynamicController') dynamicController: ElementRef;
  group: FormGroup;
  eventOutput: EventEmitter<{ value: any, type: any }>;

  constructor(dialog: MatDialog) {
    super(dialog);
  }


  controlStyle(container: ScreenContanerComponent) {
    const styles = {
      'width': container.control.width ? container.control.width - 4 + 'px' : '',
      'height': container.control.height ? container.control.height + 'px' : '',
      // tslint:disable-next-line:comment-format
      //'margin-top': this.screenContanerComponent.control.marginTop ? this.screenContanerComponent.control.marginTop  + 'px'  : '',
      'margin-left': container.control.marginLeft ? container.control.marginLeft - 7 + 'px' : '',
      'font-weight': container.control.fontWeight ? container.control.fontWeight : '',
      'font-size': container.control.fontSize ? container.control.fontSize : '',
      'font-family': container.control.fontFamily ? container.control.fontFamily : '',
      'background-color': container.control.backgroundColor ? container.control.backgroundColor : '',
      'color': container.control.color ? container.control.color : '',
    };
    return styles;
  }

  onKeyup(e) {
    // this.screenContanerComponent.control.backgroundColor = 'red';
    // this.screenContanerComponent.contanerLable.value = 'test';
    // console.log(e);
  }

  onChange(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.textChange(e, ctlrFields);
  }

  onBlur(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.ctlLeave(e, ctlrFields);
  }

  ngAfterViewInit(): void {
    if (this.screenContanerComponent.control.autofocus) {
      this.dynamicController.nativeElement.focus();
    }
  }
}
