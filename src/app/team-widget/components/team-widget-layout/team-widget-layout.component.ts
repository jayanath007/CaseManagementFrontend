import { Component, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';
import { AdgedDebChartData, CurrentActivitySum } from '../../../team-efficiency-core/models/interfaces';

@Component({
  selector: 'dps-team-widget-layout',
  templateUrl: './team-widget-layout.component.html',
  styleUrls: ['./team-widget-layout.component.scss']
})
export class TeamWidgetLayoutComponent implements OnChanges {

  constructor() { }

  @Input() eventYearSummery: CurrentActivitySum[];
  @Input() isLoading: boolean;
  @Output() remove = new EventEmitter();
  @Output() openModule = new EventEmitter();

  public holidayadgedDebData: AdgedDebChartData;

  public pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes.eventYearSummery) {
      this.holidayadgedDebData = null;
      if (!!this.eventYearSummery && this.eventYearSummery.length > 0) {
        const Holi = this.eventYearSummery.find(f => f.userMovementTypeId === 8);

        if (Holi) {
          this.holidayadgedDebData = {
            data: [{ amount: Holi.sumOfMovementCount, debtPeriod: 'Holiday' },
            { amount: Holi.maxCount - Holi.sumOfMovementCount <= 0 ? 0 : Holi.maxCount - Holi.sumOfMovementCount, debtPeriod: 'Remain' }],
            isLoading: false,
            title: 'Holiday'
          };

        } else {
          this.holidayadgedDebData = {
            data: [{ amount: 0, debtPeriod: 'Holiday' },
            { amount: 0, debtPeriod: 'Remain' }],
            isLoading: false,
            title: 'Holiday'
          };

        }
      }

    }
  }

  get sickCount(): number {
    if (!!this.eventYearSummery && this.eventYearSummery.length > 0) {

     const tra = this.eventYearSummery.find(i => i.userMovementTypeId === 7);

      if (tra) {

        return tra.sumOfMovementCount;
      } else {
      return  0;

      }
    }
    return 0;

  }

  get traningCount(): number {
    if (!!this.eventYearSummery && this.eventYearSummery.length > 0) {
      const sick = this.eventYearSummery.find(i => i.userMovementTypeId === 10);

      if (sick) {

        return sick.sumOfMovementCount;
      } else {
      return  0;

      }
    }
    return 0;
  }
  onRemove() {
    this.remove.emit();
  }
  onOpenModule() {
    this.openModule.emit();
  }

}
