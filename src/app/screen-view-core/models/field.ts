import { FormGroup } from '@angular/forms';
// import { FieldConfig } from './field-config.interface';
import { ScreenContanerComponent } from './screen-contaner-component';
import { MatDialog } from '@angular/material';
import { EventEmitter, ElementRef } from '@angular/core';
import { ScreenDefinition } from './screen-definition';

export interface Field {
  screenContanerComponent: ScreenContanerComponent;
  group: FormGroup;
  screenDefinition?: ScreenDefinition;
  eventOutput?: EventEmitter<{ value: any, type: any }>;

}


export interface ControllerFields extends Field {
  dynamicController: ElementRef;
}
