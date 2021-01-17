import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'dps-settings-snack-bar',
  templateUrl: './settings-snack-bar.component.html',
  styleUrls: ['./settings-snack-bar.component.scss']
})
export class SettingsSnackBarComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {

  }

}
