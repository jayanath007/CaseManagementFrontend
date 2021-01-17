import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'dps-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  constructor() { }

  @Input() pieChartDataset: any;
  @Input() chartHeight: number;
  @Input() chartOptions: any;
  @Input() borderColor: string;

  public pieChartLabels: string[] = [];
  public pieChartData: number[] = [];
  public pieChartType = 'doughnut';
  public colors: Array<any> = [{}];

  ngOnInit() {
  }

  get chartLabel() {
    const labelList: string[] = [];
    this.pieChartDataset.data.forEach(data => {
      labelList.push(data.debtPeriod);
    });
    return labelList;
  }

  get chartValue() {
    const valueList: number[] = [];
    this.pieChartDataset.data.forEach(data => {
      valueList.push(data.amount);
    });
    return [{
      data: valueList,
      backgroundColor: [
        '#8ebc00',
        '#309b46',
        '#4f9af6',
        '#f4a926',
        '#e0645a'
      ],
      borderColor: [
        this.borderColor,
        this.borderColor,
        this.borderColor,
        this.borderColor,
        this.borderColor,
      ],
      pointHoverBorderColor: [
        '#8ebc00',
        '#309b46',
        '#4f9af6',
        '#f4a926',
        '#e0645a',
      ],
      hoverBackgroundColor: [
        '#7ca204',
        '#1c8031',
        '#488bdc',
        '#d89215',
        '#ce584e',
      ]
    }];
  }

  chartHovered(event) {
    console.log(event);
  }

}
