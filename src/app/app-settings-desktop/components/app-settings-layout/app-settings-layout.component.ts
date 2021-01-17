import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'dps-app-settings-layout',
  templateUrl: './app-settings-layout.component.html',
  styleUrls: ['./app-settings-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppSettingsLayoutComponent implements OnInit {
  @Input() token: string;
  constructor() { }

  @Output() close = new EventEmitter();

  ngOnInit() {
  }

  onClose() {
    this.close.emit();
  }
}
