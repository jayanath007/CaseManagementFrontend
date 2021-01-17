import { Component, OnInit, Input } from '@angular/core';
import { OpertunityState } from './../../../opportunity-core/models/interfaces';

@Component({
  selector: 'dps-opportunities-stats',
  templateUrl: './opportunities-stats.component.html',
  styleUrls: ['./opportunities-stats.component.scss']
})
export class OpportunitiesStatsComponent implements OnInit {


  @Input() stats: OpertunityState;

  constructor() { }

  ngOnInit() {
  }

}
