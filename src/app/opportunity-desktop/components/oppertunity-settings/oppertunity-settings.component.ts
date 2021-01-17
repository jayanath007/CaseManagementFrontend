import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dps-oppertunity-settings',
  templateUrl: './oppertunity-settings.component.html',
  styleUrls: ['./oppertunity-settings.component.scss']
})
export class OppertunitySettingsComponent implements OnChanges {

  constructor() { }

  @Input() dirty = false;
  @Input() file: File;
  @Input() previousEmailTemplete: string;
  @Input() loading: boolean;
  @Output() close = new EventEmitter();
  @Output() uploadEmailTemplete = new EventEmitter<File>();

  htmlContent: '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes.previousEmailTemplete) {
      setTimeout(() => this.setPreview(), 500);
    }
  }


  changeEmailTemplete(files: File[]) {
    if (!!files && files[0]) {
      this.dirty = true;
      this.file = files[0];
      this.setPreview();
    }
  }

  onSave(file) {
    this.uploadEmailTemplete.emit(file);
    this.setPreview();
  }

  setPreview() {
    if (!!this.file) {
      const reader = new FileReader();
      reader.readAsText(this.file, 'UTF-8');
      reader.onload = function (evt: any) {
        if (document.getElementById('templete_preview') && !!evt.target.result.toString()) {
          document.getElementById('templete_preview').innerHTML = evt.target.result.toString();
        }
      };
    } else {
      if (document.getElementById('templete_preview') && !!this.previousEmailTemplete) {
        document.getElementById('templete_preview').innerHTML = this.previousEmailTemplete;
      }
    }
  }



  onClose() {
    this.close.emit();
  }
}

