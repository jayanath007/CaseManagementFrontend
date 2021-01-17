import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dps-time-rate-calculation',
  templateUrl: './time-rate-calculation.component.html',
  styleUrls: ['./time-rate-calculation.component.scss']
})
export class TimeRateCalculationComponent implements OnInit {

  constructor() { }

  @Input() placeholder: string;

  ngOnInit() {
  }

}
