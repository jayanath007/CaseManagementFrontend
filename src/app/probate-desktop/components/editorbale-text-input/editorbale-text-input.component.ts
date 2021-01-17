import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'dps-editorbale-text-input',
  templateUrl: './editorbale-text-input.component.html',
  styleUrls: ['./editorbale-text-input.component.scss']
})
export class EditorbaleTextInputComponent implements OnInit {
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  value = 'Clear me';

  constructor() { }

  ngOnInit() {
  }

}
