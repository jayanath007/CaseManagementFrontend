import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dps-module-layout',
  templateUrl: './module-layout.component.html',
  styleUrls: ['./module-layout.component.scss']
})
export class ModuleLayoutComponent implements OnInit {
  @Input() layoutHeaderHeight: string;
  @Input() moduleColor: string;
  @Input() contentHeaderHeight: string;
  @Input() contentPadding: string;
  constructor() { }

  ngOnInit() {
  }

}
