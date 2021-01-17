import { Component, OnInit } from '@angular/core';
import { LocalStorageKey } from '../../../core';

@Component({
  selector: 'dps-document-open',
  templateUrl: './document-open.component.html',
  styleUrls: ['./document-open.component.scss']
})
export class DocumentOpenComponent implements OnInit {

  isOnline = localStorage.getItem(LocalStorageKey.DocumentOpenType) !== 'Descktop Office';

  constructor() { }

  ngOnInit() {
  }
  onChange(isOnline) {
    localStorage.setItem(LocalStorageKey.DocumentOpenType, isOnline ? 'Online Office' : 'Descktop Office');
    this.isOnline = isOnline;
  }
}
