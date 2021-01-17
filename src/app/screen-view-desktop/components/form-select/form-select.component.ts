import { ControllerFields } from '../../../screen-view-core/models/field';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';

import {
  Component, ElementRef, ViewChild, EventEmitter,
  ChangeDetectionStrategy, AfterViewInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { Field } from '../../../screen-view-core/models/field';
import { EditorControl } from '../../../screen-view-core/models/control';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'dps-form-select',
  styleUrls: ['form-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form-select.component.html',
})

export class FormSelectComponent extends EditorControl implements Field, AfterViewInit {
  @ViewChild('dynamicController') dynamicController: ElementRef;
  @ViewChild('btntoggle') btntoggle: ElementRef;

  screenContanerComponent: ScreenContanerComponent;
  screenDefinition: ScreenDefinition;
  group: FormGroup;
  matDialog: MatDialog;
  eventOutput: EventEmitter<{ value: any, type: any }>;
  showDropDownList = false;
  isDropDownlistMouseover = false;
  top = 0;
  left = 0;

  controlStyle(container: ScreenContanerComponent) {
    const styles = {
      'width': container.control.width ? container.control.width - 18 + 'px' : '',
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

  dropDownlistMouseover() {
    this.isDropDownlistMouseover = true;
  }

  dropDownlistMouseleave() {
    this.isDropDownlistMouseover = false;
  }



  toggleDropDownList(event: any) {

    console.log(event);
    this.top = (event.clientY - event.offsetY) + this.screenContanerComponent.control.height - 5;
    this.left = (event.clientX - event.offsetX)  - this.screenContanerComponent.control.width + 15;

    if (!(this.screenContanerComponent.control.readonly || !this.screenContanerComponent.control.enabale)) {
      this.showDropDownList = !this.showDropDownList;
      this.btntoggle.nativeElement.focus();
    }

  }

  onButtonForcus(enableProdMode) {
    if (!this.isDropDownlistMouseover) {
      this.showDropDownList = false;
    }
  }


  updateItemValue(item) {
    this.group.controls[this.screenContanerComponent.control.name].setValue(item);
    this.showDropDownList = false;
    this.dynamicController.nativeElement.focus();
    this.onChange('');
  }

  onBlur(e) {

    if (!this.isDropDownlistMouseover) {
      this.showDropDownList = false;
    }
    const ctlrFields: ControllerFields = {
      screenContanerComponent: this.screenContanerComponent,
      dynamicController: this.dynamicController,
      screenDefinition: this.screenDefinition,
      eventOutput: this.eventOutput,
      group: this.group
    };

    if (!(e.target && e.relatedTarget && e.relatedTarget.getAttribute('control-name') &&
      (e.relatedTarget.getAttribute('control-name') === e.target.getAttribute('control-name')))) {
      this.ctlLeave(e, ctlrFields);
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
    // this.eventOutput.emit({ value: 'abc', type: 'tabLogic' });
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
  ngAfterViewInit(): void {
    if (this.screenContanerComponent.control.autofocus) {
      this.dynamicController.nativeElement.focus();
    }
  }

}
