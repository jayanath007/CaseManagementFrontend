import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'dps-organizer-home',
  templateUrl: './organizer-home.component.html',
  styleUrls: ['./organizer-home.component.scss']
})
export class OrganizerHomeComponent implements OnInit {
  @ViewChild(MatSidenav) settingsSidenav: MatSidenav;
  constructor() { }

  ngOnInit() {
  }
  toggleSettingsNav() {
    this.settingsSidenav.toggle();
  }
  closeSettingsNav() {
    this.settingsSidenav.close();
  }
}
