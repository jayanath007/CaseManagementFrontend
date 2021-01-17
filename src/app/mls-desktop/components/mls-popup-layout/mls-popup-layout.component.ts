import { MatterInfo } from './../../../add-note-core/models/interfaces';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dps-mls-popup-layout',
  templateUrl: './mls-popup-layout.component.html',
  styleUrls: ['./mls-popup-layout.component.scss']
})
export class MlsPopupLayoutComponent implements OnInit {

  constructor() { }

  @Input() matterInfo: MatterInfo;

  @Output() close = new EventEmitter();

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }

}
