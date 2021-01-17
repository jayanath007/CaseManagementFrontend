
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Group } from '../../../core/lib/microsoft-graph';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'dps-add-edit-group-content',
  templateUrl: './add-edit-group-content.component.html',
  styleUrls: ['./add-edit-group-content.component.scss']
})
export class AddEditGroupContentComponent implements OnInit, OnChanges {

  @Input() group: Group;
  @Input() isGroupSaved: Group;

  @Output() valueChange = new EventEmitter();
  @Output() close = new EventEmitter();

  nameInputCtrl = new FormControl();
  mailInputCtrl = new FormControl('', [Validators.required, validateAlphanumeric]);
  descriptionInputCtrl = new FormControl();
  mailNickname = '';
  showMailNickname = false;
  mailNicknameChanged = false;

  constructor() { }


  ngOnInit() {
    this.nameInputCtrl.valueChanges.pipe(
      debounceTime(200))
      .subscribe((value: string) => {
        this.valueChange.emit({ value, property: 'displayName' });
      });
    this.nameInputCtrl.valueChanges
      .subscribe((value: string) => {
        this.showMailNickname = true;
        if (!this.mailNicknameChanged) {
          this.mailNickname = value.replace(/\W/g, '');
        }
        if (!value && !this.mailNickname) {
          this.mailNicknameChanged = false;
        }
      });
    this.mailInputCtrl.valueChanges
      .subscribe((value: string) => {
        if (value !== this.nameInputCtrl.value.replace(/\W/g, '')) {
          this.mailNicknameChanged = true;
        } else if (!value && !this.nameInputCtrl.value) {
          this.mailNicknameChanged = false;
        }

      });
    this.descriptionInputCtrl.valueChanges.pipe(
      debounceTime(200))
      .subscribe((value: string) => {
        this.valueChange.emit({ value, property: 'description' });
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.isGroupSaved && !changes.isGroupSaved.firstChange && changes.isGroupSaved.currentValue === true) {
      this.close.emit();
    }

  }
  onVisibilityChange(event: MatSelectChange) {
    this.valueChange.emit({ value: event.value, property: 'visibility' });
  }
  onAllowExternalSendersChange(event: any) {
    this.valueChange.emit({ value: event.selected, property: 'allowExternalSenders' });
  }
  onMailEnabledChange(event: any) {
    this.valueChange.emit({ value: event.selected, property: 'mailEnabled' });
  }
  getErrorMessage() {
    return this.mailInputCtrl.hasError('required') ? `Please enter an address.` :
      this.mailInputCtrl.hasError('nonalphanumeric') ? `You've added characters that aren't allowed` :
        '';
  }

}
function validateAlphanumeric(control: AbstractControl) {
  if (control.value !== control.value.replace(/\W/g, '')) {
    return { nonalphanumeric: true };
  }
  return null;
}
