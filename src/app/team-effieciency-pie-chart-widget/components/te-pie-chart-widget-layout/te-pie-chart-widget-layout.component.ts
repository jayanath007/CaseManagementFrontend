import { emit } from 'cluster';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridData } from '../../../case-task-core/models/interface';
import { TimeRecordedOption } from '../../../team-efficiency-core/models/enums';
import { AdgedDebChartData } from '../../models/interfce';

@Component({
  selector: 'dps-te-pie-chart-widget-layout',
  templateUrl: './te-pie-chart-widget-layout.component.html',
  styleUrls: ['./te-pie-chart-widget-layout.component.scss']
})
export class TEPieChartWidgetLayoutComponent implements OnInit {

  @Input() data: any;
  @Input() title: string;
  @Output() openTeamEf = new EventEmitter();
  @Output() removeWidget = new EventEmitter();
  @Output() refreshData = new EventEmitter();

  public chartHeight = 248;
  // timeRecordOption = TimeRecordedOption.HOURS;
  // public timeOption = TimeRecordedOption;
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
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      labels: {
        fontColor: '#144c7f'
      }
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 10
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
