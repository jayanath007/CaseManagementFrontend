import { ScreenDefinition, ScreenDesignFormActions } from '../../../screen-view-core/models/screen-definition';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';
// import { ScreenDefinition } from '../../../screen-view-core/models/screen-definition';
// import { FieldConfig } from '../../models/field-config.interface';

@Component({
  exportAs: 'dynamicForm',
  selector: 'dps-dynamic-form',
  styleUrls: ['dynamic-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      class="dynamic-form screen-viewer-wrapper-outer dps-white-gray-scroll dps-blue-scroll"
      [formGroup]="form"
      (submit)="handleSubmit($event)" >
      <div id='dps-dynamic-form-wrapper' class="screen-viewer-main-wrapper dps-blue-scroll"
      [ngStyle]="formStyle">

      <dps-view-contaner *ngFor="let screenComponent of screenComponentList;"
       class="screen-view-component-wrap"
       [style.left.px] ="screenComponent.containerXAxis"
       [style.top.px] ="screenComponent.containerYAxis"
       [style.width.px] ="screenComponent.containerWidth">
          <ng-container
            dynamicField [screenContanerComponent]="screenComponent"
            [screenDefinition]="screenDefinition" [group]="form"
            (eventOutput) ="onEventOutput($event)">
         </ng-container>
      </dps-view-contaner>
     </div>
    </form>
  `
})
export class DynamicFormComponent implements OnChanges, OnInit {


  @Input()
  screenDefinition: ScreenDefinition[] = [];

  @Input()
  screenComponentList: ScreenContanerComponent[] = [];

  @Output() eventOutput = new EventEmitter<any>();

  @Output()
  submit: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup = this.fb.group({});
  formStyle  = { 'width': 536 + 'px', 'height': 193 + 'px' };

  get controls() { return this.screenComponentList; }
  get changes() { return this.form.valueChanges; }
  get valid() { return this.form.valid; }
  get value() { return this.form.value; }

  constructor(private fb: FormBuilder) { }


  onEventOutput($event) {
    this.eventOutput.emit($event);
  }
  ngOnInit() {
    // this.form = this.createGroup();
  }


  containerStyle(container: ScreenContanerComponent) {
    if (container) {
      const constyles = {
        'left': container.containerXAxis ? container.containerXAxis + 'px' : '',
        'top': container.containerYAxis ? container.containerYAxis + 'px' : '',
        'width': container.containerWidth ? container.containerWidth + 'px' : '',
      };
      return constyles;
    }
  }

  createGroup() {
    const group = this.fb.group({});
    this.controls.forEach(control => group.addControl(control.control.name, this.createControl(control)));
    return group;
  }

  createControl(config: ScreenContanerComponent) {
    return this.fb.control({ value: config.control.value, disabled: config.control.readonly });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.submit.emit(this.value);
  }

  setValue(name: string, value: any) {
    this.form.controls[name].setValue(value);
  }


  ngOnChanges(event) {
    // this.form = this.createGroup();
    if (this.form && this.screenComponentList) {
      const controls = Object.keys(this.form.controls);
      const configControlsNames = this.controls.map((item) => item.control.name);

      // update values if control exist
      configControlsNames
      .filter( control => controls.includes(control))
      .forEach(name => {
        const config = this.screenComponentList.find((item) => item.control.name === name);
        this.setValue(name, config.control.value);
      });

      // remove Controls
      controls
        .filter((control) => !configControlsNames.includes(control))
        .forEach((control) => this.form.removeControl(control));

      // add Controls
      configControlsNames
        .filter((control) => !controls.includes(control))
        .forEach((name) => {
          const config = this.screenComponentList.find((item) => item.control.name === name);
          this.form.addControl(name, this.createControl(config));
        });
    }

    // if (!event.screenComponentList.previousValue) {
      this.formWithHieghtCalculation();
    // }

  }

  formWithHieghtCalculation() {

    let width = 0;
    let height = 0;
    if (this.screenComponentList && this.screenComponentList.length > 0) {

      // MPP 16.7.13 max values added, move to global defs if appropriate
      // int maxWidth = 900;
      // int maxHeight = 750;
      // MPP 23.10.13 This seems to work - and is better - set the max size according to the user's monitor resolution

      const maxWidth = window.innerWidth;
      const maxHeight = window.innerHeight;

      this.screenComponentList.forEach((component) => {
        if (width < component.containerXAxis + component.containerWidth) {
          width = component.containerXAxis + component.containerWidth + 10;
        }
        if (height < component.containerYAxis + component.containerHeight) {
          height = component.containerYAxis + component.containerHeight + 10;
        }
      });

      width = width + 30; // add borders
      height = height + 20; // 80 not enough after adding infra toolbars and status  MPP 26.10.07

      // width = (width > maxWidth) ? maxWidth : width;
      // height = (height > maxHeight) ? maxHeight : height;
    } else {
      width = 536;
      height = 193;
    }

    this.formStyle = { 'width': width + 'px', 'height': height + 'px' };

  }





  // setDisabled(name: string, disable: boolean) {
  //   if (this.form.controls[name]) {
  //     const method = disable ? 'disable' : 'enable';
  //     this.form.controls[name][method]();
  //     return;
  //   }

  //   this.config = this.config.map((item) => {
  //     if (item.name === name) {
  //       item.disabled = disable;
  //     }
  //     return item;
  //   });
  // }
}
