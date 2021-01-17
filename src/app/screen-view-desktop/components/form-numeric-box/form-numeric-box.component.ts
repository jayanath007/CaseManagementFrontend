import { ControllerFields } from '../../../screen-view-core/models/field';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { Component, ViewContainerRef, ElementRef, ViewChild, EventEmitter, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { FormGroup } from '@angular/forms';
import { Field } from '../../../screen-view-core/models/field';
import { EditorControl } from '../../../screen-view-core/models/control';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-form-numeric-box',
  styleUrls: ['./form-numeric-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <dps-contaner  class="label-componenent-wrap" [ngStyle]="containerStyle(screenContanerComponent)"
  matTooltip ="{{screenContanerComponent.control.helpText}}"
  matTooltipShowDelay='tooltipShowDelay'
   [screenContanerComponent]="screenContanerComponent" [formGroup]="group" >
   <span class="var">{{screenContanerComponent.varNo}}</span>
       <input
       [tabindex]="screenContanerComponent.control.tabindex"
       [readonly]="(screenContanerComponent.control.readonly || !screenContanerComponent.control.enabale)"
       [attr.control-name]="screenContanerComponent.control.name"
        #dynamicController type="number"
        (change)="onChange($event)"
        (dblclick)="onDoubleClick($event)"
        (keypress)="onKeyPress($event)"
        (keydown)="onKeyDown($event)"
        (blur)="onBlur($event)"
       [formControlName]="screenContanerComponent.control.name"
       [ngStyle]="controlStyle(screenContanerComponent)">
  </dps-contaner>
`
})
export class FormNumericBoxComponent extends EditorControl implements Field, AfterViewInit {
  @ViewChild('dynamicController') dynamicController: ElementRef;
  screenContanerComponent: ScreenContanerComponent;
  group: FormGroup;
  screenDefinition: ScreenDefinition;
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
