import { Component, OnInit, Input } from '@angular/core';
import { TimesFinancialFigure } from '../../../open-case-core/models/interface';

@Component({
  selector: 'dps-times-financial-figures',
  templateUrl: './times-financial-figures.component.html',
  styleUrls: ['./times-financial-figures.component.scss']
})
export class TimesFinancialFiguresComponent implements OnInit {


  @Input() fdDetails: TimesFinancialFigure;
  @Input() homeCurrancy;

  constructor() { }

  ngOnInit() {

  }

}
