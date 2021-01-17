import { ControllerFields } from '../../../screen-view-core/models/field';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { Component, ViewContainerRef, ElementRef, ViewChild, EventEmitter, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { Field } from '../../../screen-view-core/models/field';
import { EditorControl } from '../../../screen-view-core/models/control';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'dps-form-time',
  styleUrls: ['./form-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <dps-contaner class="label-componenent-wrap"
  matTooltip ="{{screenContanerComponent.control.helpText}}"
  matTooltipShowDelay ='tooltipShowDelay'
  matTooltipShowDelay="1000"
 [screenContanerComponent]="screenContanerComponent" [formGroup]="group" >
 <span class="var" [style.left.px]="screenContanerComponent.contanerLable.width + 26">{{screenContanerComponent.varNo}}</span>
       <input
       [tabindex]="screenContanerComponent.control.tabindex"
       [readonly]="(screenContanerComponent.control.readonly || !screenContanerComponent.control.enabale)"
        #dynamicController type="text"
        [attr.control-name]="screenContanerComponent.control.name"
        (change)="onChange($event)"
        (dblclick)="onDoubleClick($event)"
        (keypress)="onKeyPress($event)"
        (keydown)="onKeyDown($event)"
        (blur)="onBlur($event)"
       [formControlName]="screenContanerComponent.control.name"
       [ngStyle]="controlStyle(screenContanerComponent)">
       <div class="dps-clear-both"></div>
  </dps-contaner>
`
})
export class FormTimeComponent extends EditorControl implements Field, AfterViewInit {
  @ViewChild('dynamicController') dynamicController: ElementRef;
  screenContanerComponent: ScreenContanerComponent;
  screenDefinition: ScreenDefinition;
  eventOutput: EventEmitter<{ value: any, type: any }>;
  group: FormGroup;

  constructor(dialog: MatDialog) {
    super(dialog);
  }

  controlStyle(container: ScreenContanerComponent) {
    const styles = {
      'width': container.control.width ? container.control.width - 8 + 'px' : '',
      'height': container.control.height ? container.control.height + 'px' : '',
      // tslint:disable-next-line:comment-format
      //'margin-top': this.screenContanerComponent.control.marginTop ? this.screenContanerComponent.control.marginTop  + 'px'  : '',
      'margin-left': container.control.marginLeft ? container.control.marginLeft + 'px' : '',
      'font-weight': container.control.fontWeight ? container.control.fontWeight : '',
      'font-size': container.control.fontSize ? container.control.fontSize : '',
      'font-family': container.control.fontFamily ? container.control.fontFamily : '',
      'background-color': container.control.backgroundColor ? container.control.backgroundColor : '',
      'color': container.control.color ? container.control.color : '',
    };
    return styles;
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
