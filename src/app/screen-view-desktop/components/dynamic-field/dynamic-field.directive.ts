import { FormMatAttachmentComponent } from '../form-mat-attachment/form-mat-attachment.component';
import { ForDatepickerComponent } from '../form-datepicker/form-datepicker.component';
import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges,
   OnInit, Type, ViewContainerRef, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectComponent } from '../form-select/form-select.component';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
import { Field } from '../../../screen-view-core/models/field';
import { FormCheckBoxComponent } from '../form-check-box/form-check-box.component';
import { FormTimeComponent } from '../form-time/form-time.component';
import { FormNumericBoxComponent } from '../form-numeric-box/form-numeric-box.component';
import { FormCurrencyComponent } from '../form-currency/form-currency.component';
import { FormLableComponent } from '../form-lable/form-lable.component';
import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
import { FormPostcodeComponent } from '../form-postcode/form-postcode.component';
import { FormCliAttachmentComponent } from '../form-cli-attachment/form-cli-attachmentcomponent';


// import { FieldConfig } from '../../models/field-config.interface';

const components: { [type: number]: Type<Field> } = {
  0: FormInputComponent,
  1: ForDatepickerComponent,
  2: FormCheckBoxComponent,
  3: FormLableComponent,
  4: FormSelectComponent,
  5: FormCurrencyComponent,
  6: FormNumericBoxComponent,
  8: FormTimeComponent,
  9: FormPostcodeComponent,
  10: FormCliAttachmentComponent,
  11: FormMatAttachmentComponent,
  12: FormPostcodeComponent,
};

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {

  @Input()
  screenDefinition: ScreenDefinition;

  @Input()
  screenContanerComponent: ScreenContanerComponent;

  @Output()
  eventOutput = new EventEmitter<{ value: any, type: any }>();


  @Input()
  group: FormGroup;
  component: ComponentRef<Field>;

  output() {

  }

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef,
  ) { }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.screenContanerComponent = this.screenContanerComponent;
      this.component.instance.group = this.group;
    }
  }

  ngOnInit() {
    if (!components[this.screenContanerComponent.uiComponentType]) {
      // const supportedTypes = Object.keys(components).join(', ');
      // throw new Error(
      //   `Trying to use an unsupported type (${this.screenContanerComponent.uiComponentType}).
      //   Supported types: ${supportedTypes}`
      // );
    } else {
      const component = this.resolver.resolveComponentFactory<Field>(components[this.screenContanerComponent.uiComponentType]);
      this.component = this.container.createComponent(component);
      this.component.instance.screenContanerComponent = this.screenContanerComponent;
      this.component.instance.group = this.group;
      this.component.instance.eventOutput = this.eventOutput;
      this.component.instance.screenDefinition = this.screenDefinition;
    }
  }
}
