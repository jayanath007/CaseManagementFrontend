import { DecimalPipe } from '@angular/common';
import { CurrencySymbolsPipe } from '../../../shared/pipes/currency-symbols.pipe';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData } from '../../../case-task-core/models/interface';
import { TimeRecordedOption } from '../../../team-efficiency-core/models/enums';
import { BarChartData } from '../../models/interfce';

@Component({
  selector: 'dps-te-time-recorded-widget-layout',
  templateUrl: './te-time-recorded-widget-layout.component.html',
  styleUrls: ['./te-time-recorded-widget-layout.component.scss']
})
export class TETimeRecordedWidgetLayoutComponent implements OnInit {

  constructor(private currencySymbols: CurrencySymbolsPipe, private decimalPipe: DecimalPipe) { }

  @Input() isLoading: boolean;
  @Input() data: BarChartData[];
  @Input() title; string;
  @Input() homeCurrency: string;
  @Output() openTeamEf = new EventEmitter();
  @Output() removeWidget = new EventEmitter();
  @Output() refreshData = new EventEmitter();

  public chartHeight = 230;
  timeRecordOption = TimeRecordedOption.CHARGEABLE;
  public timeOption = TimeRecordedOption;
  public lineChartColors: Array<any> = [
    {
      backgroundColor: '#8ebc00',
      borderColor: '#fff',
    },
    {
      backgroundColor: '#309b46',
      borderColor: '#fff',
    },
    {
      backgroundColor: '#4f9af6',
      borderColor: '#fff',
    }
  ];

  public chartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: label => this.homeCurrency && this.timeOption.VALUE === this.timeRecordOption ?
            this.currencySymbols.transform(this.homeCurrency) + ' ' + this.decimalPipe.transform(label, '1.2-2')
            : Math.floor(label) === label ? label : '',
          fontColor: '#144c7f'
        }
      }],
      xAxes: [{
        ticks: {
          fontColor: '#144c7f'
        }
      },
      ],
      color: '#144c7f'
    },
    legend: {
      labels: {
        fontColor: '#144c7f',
      }
    }
  };

  ngOnInit() {
  }

  goToTeamEfficiency() {
    this.openTeamEf.emit();
  }

  onRemove() {
    this.removeWidget.emit();
  }

  onRefreshData() {
    this.refreshData.emit();
  }

}
