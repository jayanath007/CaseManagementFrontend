import { Component, Input, EventEmitter, Output, SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { AdgedDebChartData, CurrentActivitySum } from '../../../team-efficiency-core/models/interfaces';
import { UrlData, UrlType } from '../../models/interfaces';
import { SvgIcons } from '../../../shared/models/svg-icons.enum';

@Component({
  selector: 'dps-help-videos-widget-layout',
  templateUrl: './help-videos-widget-layout.component.html',
  styleUrls: ['./help-videos-widget-layout.component.scss']
})
export class HelpVideosWidgetLayoutComponent implements OnInit, OnChanges {


  @Input() selectedIndex: number;
  @Input() urlList: UrlData[];
  @Input() isLoading: boolean;
  @Output() remove = new EventEmitter();
  @Output() openModule = new EventEmitter();
  svgIcons = SvgIcons;


  public holidayadgedDebData: AdgedDebChartData;

  public pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  constructor() { }

  ngOnInit() {

    this.selectedIndex = 0;



  }

  linkIcon(linkType) {
    switch (linkType) {
      case UrlType.BBC:
        return this.svgIcons.IconBbcLogo;
      case UrlType.YouTube:
        return this.svgIcons.IconYouTubeLogo;
      case UrlType.WhuFc:
        return this.svgIcons.IconWestHamLogo;
      default:
        return this.svgIcons.IconHelpDefault;

    }
  }


  ngOnChanges(changes: SimpleChanges) {

  }

  previous() {

    ++this.selectedIndex;
  }

  next() {

    --this.selectedIndex;
  }


  // get sickCount(): number {
  //   if (!!this.eventYearSummery && this.eventYearSummery.length > 0) {

  //     const tra = this.eventYearSummery.find(i => i.userMovementTypeId === 7);

  //     if (tra) {

  //       return tra.sumOfMovementCount;
  //     } else {
  //       return 0;

  //     }
  //   }
  //   return 0;

  // }

  // get traningCount(): number {
  //   if (!!this.eventYearSummery && this.eventYearSummery.length > 0) {
  //     const sick = this.eventYearSummery.find(i => i.userMovementTypeId === 10);

  //     if (sick) {

  //       return sick.sumOfMovementCount;
  //     } else {
  //       return 0;

  //     }
  //   }
  //   return 0;
  // }
  onRemove() {
    this.remove.emit();
  }
  onOpenModule() {
    this.openModule.emit();
  }

}
