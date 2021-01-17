import {
  Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, AfterViewInit
} from '@angular/core';
import {
  CdkPortal
} from '@angular/cdk/portal';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ExceptionDialogData } from '../../../shared';

@Component({
  selector: 'dps-exception-indicator',
  templateUrl: './exception-indicator.component.html',
  styleUrls: ['./exception-indicator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionIndicatorComponent implements OnInit, AfterViewInit {

  @Input() exceptionList: ExceptionDialogData[];
  @Output() removeException = new EventEmitter<number>();
  @Output() closeException = new EventEmitter<number>();

  overlayRef: OverlayRef;
  @ViewChild('exceptionOverlay') notificationOverlay: CdkPortal;

  constructor(public overlay: Overlay) { }


  ngOnInit() {
    const config = new OverlayConfig();
    config.positionStrategy = this.overlay.position()
      .global()
      .right(`10px`)
      .bottom('40px').width('350px');
    this.overlayRef = this.overlay.create(config);
    this.overlayRef.attach(this.notificationOverlay);
  }
  ngAfterViewInit() {

    setTimeout(() => {
      if (this.overlayRef.overlayElement.parentElement.className === 'cdk-global-overlay-wrapper') {
        this.overlayRef.overlayElement.parentElement.className += ' dps-exception-overlay-wrapper';
      }
    }, 100);

  }
  onRemoveException(id: number) {
    this.removeException.emit(id);
  }

}
