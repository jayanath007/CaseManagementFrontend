import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-organizer-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit {
  @Output() toggleSettingsNav = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
