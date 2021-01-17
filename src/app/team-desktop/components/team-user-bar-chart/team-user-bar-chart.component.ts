import { BaseChartDirective } from 'ng2-charts';
import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { BarChartData } from '../../../team-core';

@Component({
  selector: 'dps-team-user-bar-chart',
  templateUrl: './team-user-bar-chart.component.html',
  styleUrls: ['./team-user-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamUserBarChartComponent implements OnInit {


  @Input() isloading: boolean;
  @Input() lineChartColors: any;
  @Input() chartHeight: number;
  @Input() chartType = 'line';
  @Input() chartOptions: any;
  @ViewChild(BaseChartDirective) private _chart: BaseChartDirective;
  type = 'bar';
  public barChartLegend = true;
  barChartLabels: string[];
  showChart = false;

  _chartData: BarChartData[];
  get billeTimesData(): BarChartData[] {
    return this._chartData;
  }

  @Input('barChartDataset')
  set billeTimesData(value: BarChartData[]) {
    this._chartData = value;
    if (this.billeTimesData && !this.isloading) {
      this.updateChartData(this.billeTimesData);
    }
  }

  public barChartData: any[] = [
    { data: [], label: 'Current Year' },
    { data: [], label: 'Last Year' },
    { data: [], label: 'Target' }
  ];

  ngOnInit() {
   }

  updateChartData(chartData) {
    this.barChartLabels = [];
    const currentYearData: number[] = [];
    const lastYearData: number[] = [];
    const targetData: number[] = [];

    chartData.forEach((row) => {
      this.barChartLabels.push(row.month);
      currentYearData.push(row.currentYear);
      lastYearData.push(row.lastYear);
      targetData.push(row.target);
    });

    setTimeout(() => {
      const clone = JSON.parse(JSON.stringify(this.barChartData));
      clone[0].data = currentYearData;
      clone[1].data = lastYearData;
      clone[2].data = targetData;
      this.barChartData = clone;

      this._chart.ngOnChanges({
        datasets: {
          currentValue: this.barChartData,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false
        }
      });

    }, 100);
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
