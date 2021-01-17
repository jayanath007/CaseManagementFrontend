import { Directive, Input, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { CommonOverlayLayoutComponent } from '../components/common-overlay-layout/common-overlay-layout.component';
import { OverlayConfig, PositionStrategy, ConnectionPositionPair, Overlay, RepositionScrollStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Directive({
  selector: '[dpsCommonOverlayTriggerFor]'
})
export class CommonOverlayTriggerForDirective implements OnDestroy {

  @Input() dpsCommonOverlayTriggerFor: CommonOverlayLayoutComponent;
  @Input() triggerWhen: 'click' | 'hover';

  constructor(private elementRef: ElementRef<HTMLElement>, public overlay: Overlay) {
  }

  ngOnDestroy() {
    this.closeOverlay();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.dpsCommonOverlayTriggerFor && this.triggerWhen === 'click') {
      this.dpsCommonOverlayTriggerFor.triggerWhen = this.triggerWhen;
      this.toggleOverlay();
      event.preventDefault();
      event.stopPropagation();
    }

  }

  @HostListener('mouseover', ['$event'])
  onMouseOver(event) {
    if (this.dpsCommonOverlayTriggerFor && this.triggerWhen === 'hover') {
      this.dpsCommonOverlayTriggerFor.triggerWhen = this.triggerWhen;
      this.showOverlay();
      event.preventDefault();
      event.stopPropagation();
    }

  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event) {
    if (this.dpsCommonOverlayTriggerFor && this.dpsCommonOverlayTriggerFor.disposeWhenMouseLeave) {
      this.dpsCommonOverlayTriggerFor.triggerWhen = this.triggerWhen;
      setTimeout(() => {
        if (!this.dpsCommonOverlayTriggerFor.isMouseOver) {
          this.closeOverlay();
        }
      }, 10);
      event.preventDefault();
      event.stopPropagation();
    }

  }

  public showOverlay() {
    if (this.dpsCommonOverlayTriggerFor) {
      if (!this.dpsCommonOverlayTriggerFor.overlayRef || !this.dpsCommonOverlayTriggerFor.overlayRef.hasAttached()) {

        this.dpsCommonOverlayTriggerFor.overlayRef = this.overlay
          .create(this.getOverlayConfig(this.dpsCommonOverlayTriggerFor.width,
            this.dpsCommonOverlayTriggerFor.height,
            this.dpsCommonOverlayTriggerFor.disposeWhenBackdropClick, this.dpsCommonOverlayTriggerFor.backdropClass || ''));

        this.dpsCommonOverlayTriggerFor.overlayRef
          .attach(new TemplatePortal(this.dpsCommonOverlayTriggerFor.commonOverlay, this.dpsCommonOverlayTriggerFor.viewContainerRef));
        this.dpsCommonOverlayTriggerFor.overlayRef.backdropClick().subscribe(() => {
          this.closeOverlay();
        });

      } else {
        this.dpsCommonOverlayTriggerFor.overlayRef.updatePosition();
      }
    }
  }


  public closeOverlay() {
    if (this.dpsCommonOverlayTriggerFor && this.dpsCommonOverlayTriggerFor.overlayRef) {
      this.dpsCommonOverlayTriggerFor.overlayRef.dispose();
    }
  }

  private toggleOverlay() {
    if (!this.dpsCommonOverlayTriggerFor.overlayRef || !this.dpsCommonOverlayTriggerFor.overlayRef.hasAttached()) {
      this.showOverlay();
    } else if (this.dpsCommonOverlayTriggerFor.overlayRef && this.dpsCommonOverlayTriggerFor.overlayRef.hasAttached()) {
      this.closeOverlay();
    }
  }

  private getOverlayConfig(width: string | number, height: string | number, hasBackdrop: boolean, backdropClass: string): OverlayConfig {
    return new OverlayConfig({
      width,
      height,
      hasBackdrop: hasBackdrop,
      backdropClass: backdropClass.split(' ').filter(val => val).concat(['cdk-overlay-transparent-backdrop']),
      positionStrategy: this.getOverlayPosition(),
      scrollStrategy: this.getScrollStrategy(),
      disposeOnNavigation: true,
    });
  }
  private getScrollStrategy(): RepositionScrollStrategy {
    const scrollStrategies = this.overlay.scrollStrategies.reposition();
    return scrollStrategies;
  }
  private getOverlayPosition(): PositionStrategy {
    return this.overlay.position()
      .flexibleConnectedTo(this.elementRef.nativeElement)
      .withPositions(this.getPositions())
      .withGrowAfterOpen(true)
      .withFlexibleDimensions(true)
      .withPush(false);
  }
  private getPositions(): ConnectionPositionPair[] {
    return [
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top'
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom'
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
      }
    ];
  }
}
