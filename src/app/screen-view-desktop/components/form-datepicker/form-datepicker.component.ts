import { ControllerFields } from '../../../screen-view-core/models/field';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { MatDialog } from '@angular/material';
import { Component, OnInit, ElementRef, ViewChild, EventEmitter, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { FormGroup } from '@angular/forms';
import { Field } from '../../../screen-view-core/models/field';
import { EditorControl } from '../../../screen-view-core/models/control';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'dps-form-datepicker',
  styleUrls: ['./form-datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <dps-contaner class="label-componenent-wrap"
      [ngStyle]="containerStyle(screenContanerComponent)"
      [screenContanerComponent]="screenContanerComponent"
      matTooltip ="{{screenContanerComponent.control.helpText}}"
      matTooltipShowDelay='tooltipShowDelay' matTooltipShowDelay="1000"
      [formGroup]="group">
      <span class="var">{{screenContanerComponent.varNo}}</span>
      <input
      [readonly]="(screenContanerComponent.control.readonly || !screenContanerComponent.control.enabale)"
       [tabindex]="screenContanerComponent.control.tabindex"
       [attr.control-name]="screenContanerComponent.control.name"
       #dynamicController matInput [matDatepicker]="picker"
       [ngStyle]="controlStyle(screenContanerComponent)"
       [formControlName]="screenContanerComponent.control.name"
       [ngModel]="screenContanerComponent.control.value "
       (blur)="onBlur($event)" (keydown)="onKeyDown($event)" (dateChange)="onChangeDateDone($event)">
      <mat-datepicker-toggle matSuffix [for]="picker"
      [attr.control-name]="screenContanerComponent.control.name"
      [disabled]="(screenContanerComponent.control.readonly || !screenContanerComponent.control.enabale)"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      <div class="dps-clear-both"></div>
      </dps-contaner>
  `,
})


export class ForDatepickerComponent extends EditorControl implements Field, AfterViewInit {
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
      'width': container.control.width ? container.control.width - 42 + 'px' : '',
      'height': container.control.height ? container.control.height + 'px' : '',
      'margin-left': container.control.marginLeft ? container.control.marginLeft - 3 + 'px' : '',
      'font-weight': container.control.fontWeight ? container.control.fontWeight : '',
      'font-size': container.control.fontSize ? container.control.fontSize : '',
      'font-family': container.control.fontFamily ? container.control.fontFamily : '',
      'background-color': container.control.backgroundColor ? container.control.backgroundColor : '',
      'color': container.control.color ? container.control.color : '',
    };
    return styles;
  }

  onChangeDateDone(e) {
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

    if (!(e.target && e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.getAttribute('control-name')
      && (e.relatedTarget.parentElement.getAttribute('control-name') === e.target.getAttribute('control-name')))) {
      this.ctlLeave(e, ctlrFields);
    }
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

  ngAfterViewInit(): void {
    if (this.screenContanerComponent.control.autofocus) {
      this.dynamicController.nativeElement.focus();
    }
  }

}


