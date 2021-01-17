
import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy } from '@angular/core';
import { ScreenDefinition, ScreenViewState } from '../../../screen-view-core';


@Component({
  selector: 'dps-screen-view-header',
  templateUrl: './screen-view-header.component.html',
  styleUrls: ['./screen-view-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenViewHeaderComponent implements OnInit {


  @Input() screenDefinition: ScreenDefinition;

  @Input() hasTabLogic: boolean;

  @Input() isMasterMatter: boolean;

  @Input() screenViewState: ScreenViewState;

  @Input() currentIndex: number;

  @Input() screenList: Array<number>;


  @Output() onClose = new EventEmitter();
  @Output() onNext = new EventEmitter();
  @Output() onPrev = new EventEmitter();
  @Output() onOk = new EventEmitter();
  @Output() onTabLogic = new EventEmitter();
  @Output() onEnableTabLogic = new EventEmitter<boolean>();
  @Output() onTabLogicAndPlotSync = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }
  setValues() {
    this.onClose.emit();
  }
  close() {
    this.onClose.emit();
  }
  ok() {
    this.onOk.emit();
  }

  prives() {
    this.onPrev.emit();
  }
  next() {
    this.onNext.emit();

  }
  runTabLogic() {
    if (this.screenViewState.isDisabaleTabLogic) {
      this.onTabLogic.emit();
    }
  }
  runTabLogicPlotSync() {
    if (this.screenViewState.isDisabaleTabLogic) {
      this.onTabLogicAndPlotSync.emit();
    }
  }
  runPlotSync() {
    this.onTabLogicAndPlotSync.emit();
  }
  onChange(checked) {
    this.onEnableTabLogic.emit(checked);
  }

}
