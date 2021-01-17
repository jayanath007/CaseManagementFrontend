import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';

@Component({
  selector: 'dps-limit-bar',
  templateUrl: './limit-bar.component.html',
  styleUrls: ['./limit-bar.component.scss']
})
export class LimitBarComponent implements OnInit, OnChanges, AfterViewInit {

  constructor() { }

  @Input() limit: number;
  @Input() total: number;

  ngOnInit() {
    window.addEventListener('resize', (event) => {
      this.claculateElementPadding();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.limit) || (changes.total)) {
      this.claculateElementPadding();
    }
  }

  ngAfterViewInit() {
    this.claculateElementPadding();
  }

  claculateElementPadding() {
    const limitBar = document.getElementById('dps-bar-fill');
    if (!!limitBar) {
      // cal Limit Element padding
      const barWidth = limitBar.clientWidth;
      const limitPadding = (75 * barWidth) / 100;
      document.getElementById('bar-pointer-limit').style.left = `${limitPadding}px`;

      // cal Total Element Padding
      let barTotalPadding = (limitPadding * this.total) / this.limit;
      if (barTotalPadding > barWidth) {
        barTotalPadding = barWidth;
      }

      // const totalValue = document.getElementById('bar-pointer-total-value');
      if (this.limit < this.total) {
        barTotalPadding = limitPadding + (barWidth - limitPadding) / 2;
      }
      document.getElementById('bar-pointer-total').style.left = `${barTotalPadding}px`;

    }
  }

}
