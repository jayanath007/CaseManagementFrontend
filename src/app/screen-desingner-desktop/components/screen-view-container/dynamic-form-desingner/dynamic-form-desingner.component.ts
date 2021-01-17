import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';
import { ScreenDefinition } from '../../../../screen-view-core/models/screen-definition';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';
import { MatMenuTrigger } from '@angular/material';
import { ScreenLogic } from '../../../../screen-desingner-core/models/screen-desingner-request';


@Component({
  exportAs: 'dynamicForm',
  selector: 'dps-dynamic-form-desingner',
  styleUrls: ['./dynamic-form-desingner.scss'],
  templateUrl: './dynamic-form-desingner.component.html',
})

export class DynamicFormDesingnerComponent implements OnChanges, OnInit {
  event: MouseEvent;
  clientX = 0;
  clientY = 0;
  bool = true;

  @Input()
  screenDefinition: ScreenDefinition;
  @Input()
  formContainerWidth;
  @Input()
  formContainerHeight;
  @Input()
  curentIndex;
  @Input()
  screenComponentList: ScreenContanerComponent[] = [];

  @Output() eventOutput = new EventEmitter<any>();
  @Output() ondisplayTabOnRightBar = new EventEmitter();
  @Output() editorContanerEventOutput = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();
  @Output() submit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onAxisChange = new EventEmitter<{ value: { xChange: number, yChange: number } }>();
  @Output() onLogicDodumentView = new EventEmitter<ScreenLogic>();
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  @ViewChild('menu') private menu: HTMLSpanElement;


  form: FormGroup = this.fb.group({});
  formStyle;


  get controls() { return this.screenComponentList; }
  get changes() { return this.form.valueChanges; }
  get valid() { return this.form.valid; } get value() { return this.form.value; }

  constructor(private fb: FormBuilder) { }


  onKeydown(event) {
    if (event.keyCode === 46) {
      this.editorContanerEventOutput.emit({ kind: ScreenListItemsChangeKind.DeleteItem, row: null, value: '' });
    }
  }

  formMousedown(event) {
    const tagetClass = event.target.getAttribute('class');
    if (tagetClass !== 'screen-edit-overlay') {
      this.editorContanerEventOutput.emit({ kind: ScreenListItemsChangeKind.ClearSelection, row: null, value: null });
    }
  }


  onEventOutput($event) {
    this.eventOutput.emit($event);
  }
  onEventOutputEditor($event) {
    this.editorContanerEventOutput.emit($event);
  }
  ngOnInit() {
    // this.form = this.createGroup();
  }
  updateFormContaner(event: { value: { xChange: number, yChange: number } }) {
    this.onAxisChange.emit(event);
    // this.formContainerWidth = this.formContainerWidth + e.value.xChange;
    // this.formContainerHeight = this.formContainerHeight + e.value.yChange;
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
    // event.preventDefault();
    // event.stopPropagation();
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

      // if (!(event.screenComponentList.previousValue) || event.curentIndex) {
      //   this.formWithHieghtCalculation();
      // }

    }
  }

  displayTabOnRightBar() {

    this.ondisplayTabOnRightBar.emit();

  }

  contextmenuopen(event) {
    this.bool = true;
    if (this.bool) {
      event.preventDefault();
      event.stopPropagation();
      this.clientX = event.clientX;
      this.clientY = event.clientY;
      this.contextMenu.openMenu();
      this.bool = false;
    }

  }

  onEntryLogic() {
    // console.log('testtest', this.screenDefinition);
    this.onLogicDodumentView.emit(ScreenLogic.EntryLogic);


  }
  onTabLogic() {
    this.onLogicDodumentView.emit(ScreenLogic.TabLogic);

  }

  onExitLogic() {
    this.onLogicDodumentView.emit(ScreenLogic.ExitLogic);
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
