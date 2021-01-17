import {
  Component, OnInit, Input, Output, ViewChild,
  ElementRef, AfterViewInit, Self, NgZone, forwardRef,
  OnDestroy
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { InstanceRef } from './instance-ref';

import * as _ from 'lodash';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  // tslint:disable-next-line: no-use-before-declare
  useExisting: forwardRef(() => DpsCkEditorComponent),
  multi: true
};

@Component({
  selector: 'dps-ck-editor',
  template: ` <textarea #host></textarea> `,
  styles: [],
  providers: [InstanceRef, CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DpsCkEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnDestroy {


  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  @Output() change = this.ref.change;
  @Output() ready = this.ref.ready();
  @Output() blur = this.ref.blur;
  @Output() focus = this.ref.focus;
  @ViewChild('host') host: ElementRef;
  @Input() debounceTime: string;
  @Input() config;

  editor: any;

  constructor(@Self() private ref: InstanceRef, private zone: NgZone) { }

  _value = '';
  _readOnly = false;

  get value(): any { return this._value; }

  @Input() set value(v) {
    if (v !== this._value) {
      this._value = v;
      if (!this.ref.isSetData) {
        this.onChangeCallback(v);
      }
      this.ref.isSetData = false;
    }
  }

  get readOnly() { return this._readOnly; }

  @Input() set readOnly(v) {
    this._readOnly = v;
    this.ref.readOnly(v);
  }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    this.ref.destroy();
  }

  updateValue(value: any) {
    this.zone.run(() => {
      this.value = value;
      this.change.emit(value);
      // this.onChangeCallback(value);
      this.onTouchedCallback();
    });
  }

  ngAfterViewInit(): void {
    try {

      const subscription = this.ref.createInstance(this.host.nativeElement, this.config || {})
        .subscribe((instance) => {
          this.initCkInstance(instance);
          subscription.unsubscribe();
        });
    } catch (e) { console.error(e); }
  }

  initCkInstance(instance) {
    instance.on('blur', (evt: any) => {
      const value = instance.getData();
      this.updateValue(value);
      this.onTouchedCallback();
      this.blur.emit(evt);
    });
    instance.on('key', (evt: any) => {
      if (evt.data.keyCode === 33 || evt.data.keyCode === 34) {
        evt.cancel();
        evt.stop();
        const docEl = instance.document.$.documentElement;
        const scrTop = docEl.scrollTop;
        const scrHgt = docEl.scrollHeight;
        const winHgt = instance.document.getWindow().getViewPaneSize().height;
        if (evt.data.keyCode === 33) {
          docEl.scrollTop = Math.max(scrTop - winHgt, 0);
        } else {
          docEl.scrollTop = Math.min(scrTop + winHgt, scrHgt - winHgt);
        }
      }
    });
    // CKEditor focus event
    instance.on('focus', (evt: any) => {
      this.focus.emit(evt);
    });

    const getChangeCallback = () => {
      if (this.debounceTime) {
        return _.debounce(() => {
          const value = instance.getData();
          this.updateValue(value);
        }, parseInt(this.debounceTime, 10));
      } else {
        return () => {
          const value = instance.getData();
          this.updateValue(value);
        };
      }
    };

    instance.on('change', getChangeCallback());
    this.ref.readOnly(this.readOnly);
  }

  writeValue(value: any) {
    if ((this._value || value) && this._value !== value) {
      this._value = value;
      this.ref.setData(value);
    }

  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  public editorFocus() {
    this.ref.editorFocus();
  }

}
