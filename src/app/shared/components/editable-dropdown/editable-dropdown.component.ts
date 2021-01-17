import { emit } from 'cluster';
import { Component, OnInit, ViewChild, OnDestroy, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, takeUntil, tap } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { Introducer } from '../../../opportunity-core/models/interfaces';



@Component({
  selector: 'dps-editable-dropdown',
  templateUrl: './editable-dropdown.component.html',
  styleUrls: ['./editable-dropdown.component.scss'],
})
export class EditableDropdownComponent implements OnInit, OnDestroy, OnChanges {


  dropdownForm: FormGroup;
  @Input() controllerName?: string;
  @Input() parentFormGroup?: FormGroup;
  @Input() placeholder: string;
  @Input() options: string[];
  @Input() value: string;
  // @Input() isLookupList = false;
  // @Input() lookupList: Introducer[];
  @Input() numberOnly = false;
  @Input() required = false;
  @Output() changeValue = new EventEmitter<any>();
  @Output() KeyupEnter = new EventEmitter<MouseEvent>();


  textInputControl = new FormControl();
  dropdownValues: string[] | Introducer[];
  filteredOptions: Observable<string[]>;
  private unsubscribe: Subject<void> = new Subject();
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger }) autoCompleteInput: MatAutocompleteTrigger;


  showAllSugetions = true;


  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && this.value) {
      if (this.value === '#Clear#') {
        this.textInputControl.setValue('');
        this.value = '';
      } else {
        this.textInputControl.setValue(this.value !== null || this.value !== '' ? this.value.toString() : '');
      }
    }
  }


  ngOnInit() {

    if (this.parentFormGroup) {
      const parentController = this.parentFormGroup.get(this.controllerName);
      if (parentController && parentController.value) {
        this.textInputControl.setValue(parentController.value);
      }
    }

    this.textInputControl.valueChanges
      .pipe(
        takeUntil(this.unsubscribe),
        tap(value => {
          if (this.parentFormGroup) {
            const controller = this.parentFormGroup.get(this.controllerName);
            if (controller && controller.value !== value) {
              this.parentFormGroup.get(this.controllerName).setValue(value);
            }
          }
          // else if (this.isLookupList) {
          //   if (value && value.luP_Code) {
          //     this.changeValue.emit(value);
          //   } else {
          //     const item = this.lookupList.find(i => i.luP_Code === value);
          //     if (item) {
          //       this.changeValue.emit(item);
          //     } else {
          //       this.changeValue.emit({ luP_ID: -1, luP_Description: value, luP_Code: value });
          //     }
          //   }

          // }
          //  else {
          this.changeValue.emit(value);
          // }

        }),
        map(value => value ? this._filter(value) : []),
      ).subscribe((values) => {
        this.showAllSugetions = false;
        this.dropdownValues = values;
      });

    if (this.parentFormGroup) {
      this.parentFormGroup.valueChanges.pipe(
        takeUntil(this.unsubscribe))
        .subscribe((value) => {
          const controller = this.parentFormGroup.get(this.controllerName);
          if (controller && controller.value !== this.textInputControl.value) {
            this.textInputControl.setValue(controller.value);
          }
        });
    }

  }

  displayFn(value?: string): string | undefined {
    return value ? value : undefined;
  }

  private _filter(name: any): string[] | Introducer[] {
    let filterValue = '';
    // if (this.isLookupList) {
    //   filterValue = name.luP_Code ? name.luP_Code.toLowerCase() : name ? name.toLowerCase() : '';
    //   return this.lookupList.filter(i => !!i.luP_Code ? i.luP_Code.toLowerCase().indexOf(filterValue) === 0 : false);
    // } else {
    filterValue = name !== null && name !== '' ? name.toString().toLowerCase() : '';
    return this.options.filter(option => option !== null && option !== '' ? option.toString().toLowerCase().indexOf(filterValue) === 0 : false);
    // }

  }



  dropdownIconClick(e) {
    if (!(this.autoCompleteInput.panelOpen && this.showAllSugetions)) {
      setTimeout(() => {
        this.dropdownValues = this.options;
        this.autoCompleteInput.openPanel();
        this.showAllSugetions = true;
      });
    }
  }

  onKeyupEnter(event) {
    this.KeyupEnter.emit(event);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
