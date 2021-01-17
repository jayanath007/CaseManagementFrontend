import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { TimeZoneInformation, LocaleInfo } from '../../../core/lib/microsoft-graph';

@Component({
  selector: 'dps-initial-settings-layout',
  templateUrl: './initial-settings-layout.component.html',
  styleUrls: ['./initial-settings-layout.component.scss']
})
export class InitialSettingsLayoutComponent implements OnChanges {



  @Input() token: string;
  @Input() timeZones: TimeZoneInformation[];
  @Input() userTimeZone: string;
  @Input() languages: LocaleInfo[];
  @Input() userLanguage: LocaleInfo;
  @Input() isLoading: boolean;
  @Input() isUpdateFail: boolean;
  @Input() isUpdateSuccess: boolean;
  @Input() isUpdating: boolean;

  @Output() updateTimeZoneChange = new EventEmitter();
  @Output() updateLanguageChange = new EventEmitter();
  @Output() onSubmit = new EventEmitter();
  @Output() cancel = new EventEmitter();
  //  @Output() clear = new EventEmitter();

  saving = false;

  constructor(public snackBar: MatSnackBar) {

  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.isUpdateSuccess && changes.isUpdateSuccess) {
      setTimeout(() => {
        this.onClose();
      }, 100);

    }

    if (this.isUpdateFail && changes.isUpdateFail) {

    }
  }






  onTimeZoneChange(value) {
    console.log(value);
    this.updateTimeZoneChange.emit(value);
  }

  onLanguageChange(value) {
    console.log(value);
    this.updateLanguageChange.emit(value);
  }

  onSubmitBtnClick() {
    this.onSubmit.emit();
    this.saving = true;
  }

  onClose() {
    //  this.clear.emit();
    this.cancel.emit();
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }


}
