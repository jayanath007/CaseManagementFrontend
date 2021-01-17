import { Component, OnInit, Input, EventEmitter , Output } from '@angular/core';


@Component({
  selector: 'dps-lookup-screen-content',
  templateUrl: './lookup-screen-content.component.html',
  styleUrls: ['./lookup-screen-content.component.scss']
})
export class LookupScreenContentComponent implements OnInit {

  @Output() popupClosed = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit() {
  }

  onClose() {
    this.popupClosed.emit('close');
  }
}


