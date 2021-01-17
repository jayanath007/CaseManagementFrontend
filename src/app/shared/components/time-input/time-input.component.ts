
import {
  switchMap,
  map, takeUntil, startWith, filter, tap, pairwise, take
} from 'rxjs/operators';

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatFormFieldControl, MatDialog } from '@angular/material';
import { Component, OnInit, AfterViewInit, OnDestroy, Input, ElementRef, ViewChild, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { InfoDialogType, showInforDialog } from '../../../core/utility/DpsUtility';

@Component({
  selector: 'dps-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: TimeInputComponent }],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class TimeInputComponent implements MatFormFieldControl<Time>, OnInit, OnChanges, AfterViewInit, OnDestroy {

  static nextId = 0;
  @Input() controllerName: string;
  @Input() parentFormGroup: FormGroup;
  @Input() isUnitDisable = false;
  @Input() mpu = 0;
  @Input() resetCount = 0;
  @Input() value = null;
  @Input() roundedToMPUminute = false;
  @ViewChild('hourInput') hourInput: ElementRef;
  @ViewChild('minuteInput') minuteInput: ElementRef;
  @Output() changeValue = new EventEmitter<string>();
  noOfunits = 0;

  timeForm: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  ngControl = null;
  errorState = false;
  // value = null;
  controlType = 'dps-time-input';

  id = `dps-time-input-${TimeInputComponent.nextId++}`;
  describedBy = '';
  get empty() {
    const { value: { hour, minute } } = this.timeForm;
    return !hour && !minute;
  }
  get shouldLabelFloat() { return this.focused || !this.empty; }

  private unsubscribe: Subject<void> = new Subject();
  private _placeholder: string;
  private _required = false;
  private _disabled = false;


  @Input()
  get placeholder(): string { return this._placeholder; }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }


  @Input()
  get required(): boolean { return this._required; }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }


  @Input()
  get disabled(): boolean { return this._disabled; }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  emptyValue = '--';

  constructor(private fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef, private dialog: MatDialog) {


    this.fm.monitor(this.elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled && !changes.disabled.isFirstChange() && !this.parentFormGroup) {
      if (this.disabled) {
        this.timeForm.get('hour').disable({ onlySelf: true, emitEvent: false });
        this.timeForm.get('minute').disable({ onlySelf: true, emitEvent: false });
      } else {
        this.timeForm.get('hour').enable({ onlySelf: true, emitEvent: false });
        this.timeForm.get('minute').enable({ onlySelf: true, emitEvent: false });
      }
    }
    if (changes.value && !changes.value.isFirstChange() && !this.parentFormGroup) {
      this.setValues();
    }
  }

  ngOnInit() {
    this.setValues();
  }

  setValues() {
    let initHour = this.emptyValue;
    let initMinute = this.emptyValue;
    let parentController;
    if (!!this.parentFormGroup) {
      parentController = this.parentFormGroup.get(this.controllerName);
      this.value = parentController.value;
    }



    if (this.value) {
      const values = this.value.split(':');
      if (values.length === 2) {
        initHour = values[0];
        initMinute = values[1];
      }
    }


    this.timeForm = this.fb.group({
      hour: new FormControl({ value: initHour, disabled: parentController ? parentController.disabled : this.disabled }),
      minute: new FormControl({ value: initMinute, disabled: parentController ? parentController.disabled : this.disabled }),
    });

    this.timeForm.valueChanges.subscribe((model: Time) => {
      console.log('timeForm.valueChanges');
      const hour = model.hour, minute = model.minute;

      const newValue = hour + ':' + minute;

      if (!!this.parentFormGroup) {
        const controller = this.parentFormGroup.get(this.controllerName);

        if (hour && hour !== this.emptyValue && minute && minute !== this.emptyValue && controller.value !== newValue) {
          controller.setValue(newValue);
          controller.markAsTouched();

        } else if (hour === this.emptyValue && minute === this.emptyValue) {

          controller.setValue('');
          controller.markAsTouched();

        }
      } else {
        this.changeValue.emit(newValue);
      }

      this.noOfunits = this.calculateNoOfunits(model);

    });

    if (!!this.parentFormGroup) {
      this.parentFormGroup.valueChanges.subscribe((value) => {
        console.log('parentFormGroup.valueChanges');
        const controller = this.parentFormGroup.get(this.controllerName);
        const currentCtrlValue = controller.value;
        let hour = this.emptyValue;
        let minute = this.emptyValue;
        if (currentCtrlValue) {
          const values = currentCtrlValue.split(':');
          if (values.length === 2) {
            hour = values[0];
            minute = values[1];
          }
        }
        if (!(this.timeForm.value['hour'] === hour && this.timeForm.value['minute'] === minute)) {
          this.timeForm.setValue({ hour: hour, minute: minute });
        }
        if (controller.disabled && !this.timeForm.get('hour').disabled) {
          this.timeForm.get('hour').disable({ onlySelf: true, emitEvent: false });
          this.timeForm.get('minute').disable({ onlySelf: true, emitEvent: false });
        }
      });
    }
  }


  calculateNoOfunits(model: Time) {
    let units;
    if (!isNaN(Number(model.hour)) && !isNaN(Number(model.minute))) {

      const totalminits = Number(model.hour) * 60 + Number(model.minute);
      if (this.mpu === 0 || !this.mpu) {
        units = totalminits / 6;
      } else {
        units = totalminits / this.mpu;
      }
      if (Number.isInteger(units)) {
        return units;
      }
      return 0;
    }
    return 0;

  }

  public ngAfterViewInit(): void {

    ////////////////////////// hourInput controller ////////////////////////////////////////////////////////////
    const hourInputClick$ = fromEvent(this.hourInput.nativeElement, 'click');
    hourInputClick$.pipe(takeUntil(this.unsubscribe))
      .subscribe((e: any) => {

        console.log('hourInputClick');
        setTimeout(() => {
          e.target.select();
        });
        // console.log('click');
        e.preventDefault();
        return false;
      });
    const hourInputFocus$ = fromEvent(this.hourInput.nativeElement, 'focus').pipe(tap((e: any) => {
      console.log('hourInputFocus');
      setTimeout(() => {
        e.target.select();
      });
    }));
    const hourInputKeydown$ = fromEvent(this.hourInput.nativeElement, 'keydown').pipe(
      // take(1),
      filter((e: KeyboardEvent) => this.deleteKeyClearValues(e, 'hour')),
      filter((e: KeyboardEvent) => this.arrowUpDown(e, 23, 'hour')),
      filter((e: KeyboardEvent) => this.validateNumaricInput(e)),
      startWith(null),
      map((e: KeyboardEvent) => {
        return e ? e.key : '';
      })).pipe(pairwise());


    hourInputFocus$.pipe(takeUntil(this.unsubscribe),
      // take(1),
      switchMap((e) => {
        return hourInputKeydown$;
      }))
      .subscribe((values: any) => {

        console.log('hourInputFocus');

        const previousKey = values[0];
        const currentKey = values[1];
        const tempValue = previousKey + currentKey;
        // console.log(tempValue);

        if (tempValue === '0' || tempValue === '1' || tempValue === '2') {
          setTimeout(() => {
            this.timeForm.get('hour').setValue('0' + currentKey);
            // this.hourInput.nativeElement.select();
          });
        } else {
          let previousKeyTemp = '0';
          if (previousKey === '0' || previousKey === '1' || previousKey === '2') {
            previousKeyTemp = previousKey;
          }
          let newValue = previousKeyTemp + currentKey;
          const hour = parseInt(newValue, 10);
          if (hour >= 24) {
            newValue = '23';
          }
          setTimeout(() => {
            this.timeForm.get('hour').setValue(newValue);
            // this.minuteInput.nativeElement.focus();
            this.minuteInput.nativeElement.select();
          });
        }
      });

    const hourInputblur$ = fromEvent(this.hourInput.nativeElement, 'blur');
    hourInputblur$.pipe(takeUntil(this.unsubscribe))
      .subscribe((e: any) => {

        console.log('hourInputblur');
        setTimeout(() => {
          if (!(e.relatedTarget && e.relatedTarget.name && e.relatedTarget.name === this.controllerName + 'minute')) {
            const minute = this.timeForm.get('minute').value;
            this.updateFormValue(e.target.value, minute);
          }
        });
      });

    ////////////////////////// hourInput controller ////////////////////////////////////////////////////////////


    ////////////////////////// minuteInput controller ////////////////////////////////////////////////////////////

    const minuteInputClick$ = fromEvent(this.minuteInput.nativeElement, 'click');
    minuteInputClick$.pipe(takeUntil(this.unsubscribe)).subscribe((e: any) => {

      console.log('minuteInputClick');

      setTimeout(() => {
        e.target.select();
      });
      // console.log('click');
      e.preventDefault();
      return false;
    });
    const minuteInputFocus$ = fromEvent(this.minuteInput.nativeElement, 'focus').pipe(tap((e: any) => {
      console.log('minuteInputFocus');
      setTimeout(() => {
        e.target.select();
      });
    }));
    const minuteInputKeydown$ = fromEvent(this.minuteInput.nativeElement, 'keydown').pipe(
      filter((e: KeyboardEvent) => this.deleteKeyClearValues(e, 'minute')),
      filter((e: KeyboardEvent) => this.arrowUpDown(e, 59, 'minute')),
      filter((e: KeyboardEvent) => this.validateNumaricInput(e)),
      startWith(null),
      map((e: KeyboardEvent) => {
        return e ? e.key : '';
      })).pipe(pairwise());

    minuteInputFocus$.pipe(takeUntil(this.unsubscribe),
      switchMap((e) => {
        return minuteInputKeydown$;
      })).subscribe((values) => {

        console.log('minuteInputFocus');

        const previousKey = values[0];
        const currentKey = values[1];
        const tempValue = previousKey + currentKey;
        // console.log(tempValue);
        const minute = (tempValue.length === 1) ? 0 + currentKey : tempValue;
        setTimeout(() => {
          this.timeForm.get('minute').setValue(minute);
          // this.minuteInput.nativeElement.select();
        });
      });

    const minuteInputblur$ = fromEvent(this.minuteInput.nativeElement, 'blur');
    minuteInputblur$.pipe(takeUntil(this.unsubscribe))
      .subscribe((e: any) => {

        console.log('minuteInputblur');
        setTimeout(() => {
          let minute = e.target.value;
          if (minute >= 60) {
            minute = 59;
          }
          const hour = this.timeForm.get('hour').value;
          this.updateFormValue(hour, minute);
        }, 1);
      });

    ////////////////////////// minuteInput controller ////////////////////////////////////////////////////////////


  }


  validateNumaricInput(e: KeyboardEvent): boolean {
    if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105))) {
      // tab enabale
      if (e.keyCode !== 9) {
        e.preventDefault();
      }
      return false;
    }
    return true;
  }

  arrowUpDown(e: any, maxvalue: number, input: string): boolean {
    const value = parseInt(e.target.value, 10);
    switch (e.keyCode) {
      case 38: // ArrowUp
        setTimeout(() => {
          if (isNaN(value)) {
            this.timeForm.get(input).setValue('01');
          } else if (value + 1 > maxvalue) {
            this.timeForm.get(input).setValue('00');
          } else {
            this.timeForm.get(input).setValue(('0' + (value + 1)).slice(-2));
          }
          e.target.select();
        });
        return false;
      case 40: // ArrowDown
        setTimeout(() => {
          if (isNaN(value) || value - 1 < 0) {
            this.timeForm.get(input).setValue(('0' + maxvalue).slice(-2));
          } else {
            this.timeForm.get(input).setValue(('0' + (value - 1)).slice(-2));
          }
          e.target.select();
        });
        return false;
      default:
        return true;
    }
  }

  deleteKeyClearValues(e: any, input: string): boolean {
    const charCode = e.keyCode;
    if (charCode === 8 || charCode === 46) {
      if (e.target['value'] === '--') {
        e.preventDefault();
      } else {
        setTimeout(() => {
          this.timeForm.get(input).setValue('--');
          e.target.select();
        });
      }
      return false;
    }
    return true;
  }

  updateFormValue(hour, minute) {
    if (!(hour === this.emptyValue && minute === this.emptyValue)) {

      if (!hour || hour === this.emptyValue) {
        hour = '00';
      }
      if (!minute || minute === this.emptyValue) {
        minute = '00';
      }
      this.timeForm.setValue({ hour: hour, minute: minute });

    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  keyUpUnits(event, units: number) {
    if (!!this.validateNumaricInput(event)) {
      this.changeUnits(units);
    }
  }

  changeUnits(units: number) {
    this.noOfunits = units;
    const totalMinutes = units * (!this.mpu ? 6 : this.mpu);
    this.changeTime(totalMinutes);
  }

  changeTime(totalMinutes: number) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = (totalMinutes % 60);
    this.updateFormValue(hours, minutes);
  }

  restUnitValue(event) {
    if (!!this.validateNumaricInput(event)) {
      this.noOfunits = 0;
    }
  }

  get maxNumberOfUnits() {
    return 1380 / (!this.mpu ? 6 : this.mpu);
  }

  validateUnits(event, noOfUnits: number) {
    if (noOfUnits >= this.maxNumberOfUnits) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  onRoundedToMPUminute() {
    if (this.roundedToMPUminute && this.mpu > 0) {
      let tempMin = this.timeForm.get('minute').value;
      const tempHours = this.timeForm.get('hour').value;
      tempMin = tempMin > 59 ? 59 : tempMin;
      if ((tempMin % this.mpu) > 0) {
        showInforDialog('Time Information', `Rounded to ${this.mpu} minute units`, InfoDialogType.success, this.dialog);
        let roundedMin = Math.ceil(tempMin / this.mpu) * this.mpu;
        if (roundedMin === 60) {
          const hoursAfterRoundmin = Number(tempHours) + 1;
          this.timeForm.get('hour').setValue(hoursAfterRoundmin < 10 ? `0${hoursAfterRoundmin}` : hoursAfterRoundmin);
          roundedMin = 0;
        }
        this.timeForm.get('minute').setValue(roundedMin < 10 ? `0${roundedMin}` : roundedMin);
      }
    }
  }

}

export class Time {
  constructor(public hour: string, public minute: string) { }
}

