import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { MatDialog } from '@angular/material';
import { Field, ControllerFields } from '../../../screen-view-core/models/field';
import { Component, OnInit, ViewChild, ElementRef, EventEmitter, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EditorControl } from '../../../screen-view-core/models/control';

@Component({
  selector: 'dps-form-currency',
  styleUrls: ['./form-currency.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <dps-contaner  class="label-componenent-wrap"
  matTooltip ="{{screenContanerComponent.control.helpText}}"
  matTooltipShowDelay='tooltipShowDelay' matTooltipShowDelay="1000"
  [ngStyle]="containerStyle(screenContanerComponent)"
   [screenContanerComponent]="screenContanerComponent"
       [formGroup]="group" >
       <span class="var">{{screenContanerComponent.varNo}}</span>
       <input type="text"
       [tabindex]="screenContanerComponent.control.tabindex"
       [attr.control-name]="screenContanerComponent.control.name"
       [readonly]="(screenContanerComponent.control.readonly || !screenContanerComponent.control.enabale)"
        #dynamicController (keyup)="onKeyup($event)"
       (change)="onChange($event)" (dblclick)="onDoubleClick($event)"
       (keypress)="onKeyPress($event)" (blur)="onBlur($event)"
       (keydown)="onKeyDown($event)"
       (focus)="onFocus($event)"
       [formControlName]="screenContanerComponent.control.name"
       [ngStyle]="controlStyle(screenContanerComponent)">



  </dps-contaner>
`
})
export class FormCurrencyComponent extends EditorControl implements Field, AfterViewInit {
  screenContanerComponent: ScreenContanerComponent;
  screenDefinition: ScreenDefinition;
  @ViewChild('dynamicController') dynamicController: ElementRef;
  group: FormGroup;
  matDialog: MatDialog;
  eventOutput: EventEmitter<{ value: any, type: any }>;

  constructor(dialog: MatDialog) {
    super(dialog);
  }

  controlStyle(container: ScreenContanerComponent) {
    const styles = {
      'width': container.control.width ? container.control.width + 'px' : '',
      'height': container.control.height ? container.control.height + 'px' : '',
      // tslint:disable-next-line:comment-format
      //'margin-top': this.screenContanerComponent.control.marginTop ? this.screenContanerComponent.control.marginTop  + 'px'  : '',
      'margin-left': container.control.marginLeft ? container.control.marginLeft - 4 + 'px' : '',
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

  onDoubleClick(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.doubleClick(e, ctlrFields);
  }

  onKeyPress(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.keyPress(e, ctlrFields);
  }

  onKeyDown(e) {
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };
    this.keyDown(e, ctlrFields);
  }

  onFocus(e) {
    const orginalVal = this.group.controls[this.screenContanerComponent.control.name].value;
    if (orginalVal) {
      const value = parseFloat(orginalVal.toString().replace(/,/g, ''));
      this.group.controls[this.screenContanerComponent.control.name].setValue(value);
    }
  }


  ngAfterViewInit(): void {
    console.log(this.dynamicController);
    console.log(this.screenContanerComponent)
    if (this.screenContanerComponent.control.autofocus) {
      setTimeout(() => {
        this.dynamicController.nativeElement.focus();
      });
    }
  }
}
