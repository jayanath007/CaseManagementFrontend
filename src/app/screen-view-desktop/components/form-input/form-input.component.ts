import { ControllerFields } from '../../../screen-view-core/models/field';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { Component, ElementRef, ViewChild, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { Field } from '../../../screen-view-core/models/field';
import { EditorControl } from '../../../screen-view-core/models/control';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-form-input',
  styleUrls: ['form-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <dps-contaner class="label-componenent-wrap"
      matTooltip="{{screenContanerComponent.control.helpText}}"
      matTooltipShowDelay='tooltipShowDelay' matTooltipShowDelay="1000"
      [ngStyle]="containerStyle(screenContanerComponent)"
          [screenContanerComponent]="screenContanerComponent" [formGroup]="group" >
          <span class="var">{{screenContanerComponent.varNo}}</span>
           <input *ngIf='!screenContanerComponent.control.multiLine'
            [attr.maxLength]="inputLength"
            [attr.control-name]="screenContanerComponent.control.name"
            [tabindex]="screenContanerComponent.control.tabindex"
            [readonly]="(screenContanerComponent.control.readonly || !screenContanerComponent.control.enabale)"
            #dynamicController type="text"
            (change)="onChange($event)"
            (dblclick)="onDoubleClick($event)"
            (keypress)="onKeyPress($event)"
            (keydown)="onKeyDown($event)"
            (blur)="onBlur($event)"
            [formControlName]="screenContanerComponent.control.name"
            [ngStyle]="controlStyle(screenContanerComponent)"
            >
            <textarea  *ngIf='screenContanerComponent.control.multiLine'
            [attr.control-name]="screenContanerComponent.control.name"
            [attr.maxLength]="textareaLength"
            [tabindex]="screenContanerComponent.control.tabindex"
            [readonly]="(screenContanerComponent.control.readonly || !screenContanerComponent.control.enabale)"
             #dynamicController type="text"
             (change)="onChange($event)"
             (dblclick)="onDoubleClick($event)"
             (keypress)="onKeyPress($event)"
             (keydown)="onKeyDown($event)"
             (blur)="onBlur($event)"
             [formControlName]="screenContanerComponent.control.name"
             [ngStyle]="controlStyle(screenContanerComponent)"
             >
             </textarea>
      </dps-contaner>
  `
})

export class FormInputComponent extends EditorControl implements Field, OnInit {
  @ViewChild('dynamicController') dynamicController: ElementRef;
  screenContanerComponent: ScreenContanerComponent;
  screenDefinition: ScreenDefinition;
  group: FormGroup;
  eventOutput: EventEmitter<{ value: any, type: any }>;
  textareaLength;
  inputLength;



  controlStyle(container: ScreenContanerComponent) {
    const styles = {
      'width': container.control.width ? container.control.width + 1 + 'px' : '',
      'height': container.control.height ? container.control.height + 'px' : '',
      'margin-left': container.control.marginLeft ? container.control.marginLeft - 5 + 'px' : '',
      'font-weight': container.control.fontWeight ? container.control.fontWeight : '',
      'font-size': container.control.fontSize ? container.control.fontSize : '',
      'font-family': container.control.fontFamily ? container.control.fontFamily : '',
      'background-color': container.control.backgroundColor ? container.control.backgroundColor : '',
      'color': container.control.color ? container.control.color : '',
    };
    return styles;
  }

  ngOnInit() {
    this.textareaLength = (this.screenContanerComponent.control.maxLength) ?
      this.screenContanerComponent.control.maxLength * 4 : undefined;
    this.inputLength = this.screenContanerComponent.control.maxLength;
  }


  ngAfterViewInit(): void {
    if (this.screenContanerComponent.control.autofocus) {
      this.dynamicController.nativeElement.focus();
    }
  }


  constructor(dialog: MatDialog) {
    super(dialog);
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



}
