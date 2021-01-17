import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dps-settings-view',
  templateUrl: './settings-view.component.html',
  styleUrls: ['./settings-view.component.scss']
})
export class SettingsViewComponent implements OnInit {
  @Output() closeSettingsView = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
