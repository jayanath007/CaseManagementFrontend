
import { filter, takeUntil, take, tap, map, switchMap } from 'rxjs/operators';

import { fromEvent as observableFromEvent, Subject, Observable } from 'rxjs';
import { emit } from 'cluster';
import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';
import { Directive, ElementRef, OnDestroy, Output, EventEmitter, AfterViewInit, ViewChild, Renderer2 } from '@angular/core';

import { ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';
import { ChangeAxisKind, RectanglePositionAndSize } from '../../../../screen-desingner-core/models/screen-desingner-request';





@Directive({
  selector: '[dpsDragSelectComponentsDirective]'
})
export class DragSelectComponentsDirective implements OnDestroy, AfterViewInit {

  dragSelection$: Observable<any>;
  mouseMoveComplete$: Observable<any>;

  private unsubscribe: Subject<void> = new Subject();
  @ViewChild('dynamic-form-edit') wrapper: ElementRef;


  @Output()
  selectionChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: RectanglePositionAndSize }>();



  constructor(private elementRef: ElementRef, private renderer: Renderer2) {

  }

  mouseMoveUpdate = (e) => {

  }

  mouseMoveComplete = (e) => {
    const dragSelectContainer = this.elementRef.nativeElement.querySelector('.ghost-select');

    const width = +dragSelectContainer.style.width.split('px')[0];
    const height = +dragSelectContainer.style.height.split('px')[0];
    const left = +dragSelectContainer.style.left.split('px')[0];
    const top = +dragSelectContainer.style.top.split('px')[0];

    if (width > 0 || height > 0) {
      this.selectionChange.emit({
        kind: ScreenListItemsChangeKind.DragSelectionsUpdate,
        row: null, value: { width: width, height: height, left: left, top: top }
      });
    }

    this.setDefaultPosition();
    console.log(`mouseMoveComplete`, e);
  }


  getRelativeCoordinates(e) {

    var container = e.target;
    var offset = { left: 0, top: 0 }, ref;

    ref = container.offsetParent;

    offset.left = container.offsetLeft;
    offset.top = container.offsetTop;

    while (ref) {
      offset.left += ref.offsetLeft;
      offset.top += ref.offsetTop;
      ref = ref.offsetParent;
    }

    return offset;
  }

  setInitialDragSelectPosition(pageX, pageY) {
    const dragSelectContainer = this.elementRef.nativeElement.querySelector('.ghost-select');
    this.renderer.setStyle(dragSelectContainer, 'left', pageX + 'px');
    this.renderer.setStyle(dragSelectContainer, 'top', pageY + 'px');
  }

  setDefaultPosition() {
    const dragSelectContainer = this.elementRef.nativeElement.querySelector('.ghost-select');
    this.renderer.setStyle(dragSelectContainer, 'width', '0px');
    this.renderer.setStyle(dragSelectContainer, 'height', '0px');
    this.renderer.removeClass(dragSelectContainer, 'ghost-active');
  }

  updateDragSelectPosition(pageX, pageY, width, height, initialW, initialH) {
    const dragSelectContainer = this.elementRef.nativeElement.querySelector('.ghost-select');

    this.renderer.setStyle(dragSelectContainer, 'width', width + 'px');
    this.renderer.setStyle(dragSelectContainer, 'height', height + 'px');

    if (pageX <= initialW && pageY >= initialH) {

      this.renderer.setStyle(dragSelectContainer, 'left', pageX + 'px');

    } else if (pageY <= initialH && pageX >= initialW) {

      this.renderer.setStyle(dragSelectContainer, 'top', pageY + 'px');

    } else if (pageY < initialH && pageX < initialW) {

      this.renderer.setStyle(dragSelectContainer, 'left', pageX + 'px');
      this.renderer.setStyle(dragSelectContainer, 'top', pageY + 'px');

    }
  }


  ngAfterViewInit() {


    const mousedown$ = observableFromEvent(document, 'mousedown').pipe(
      tap((e) => {
        console.log(e);
      }),
      filter((e: any) => (e.target.getAttribute('class') === 'screen-editor-main-wrapper')),
      map((e: MouseEvent) => {

        const dragSelectContainer = this.elementRef.nativeElement.querySelector('.ghost-select');
        this.renderer.addClass(dragSelectContainer, 'ghost-active');
        const offset = this.getRelativeCoordinates(e);
        var pageX = e.pageX - offset.left;
        var pageY = e.pageY - offset.top;
        this.setInitialDragSelectPosition(pageX, pageY);

        return {
          initialW: pageX,
          initialH: pageY,
          offsetLeft: offset.left,
          offsetTop: offset.top,
        };

      }));

    const mouseup$ = observableFromEvent(document, 'mouseup').pipe(tap((e) => {

    }));

    const mousemove$ = observableFromEvent(document, 'mousemove').pipe(tap((e: MouseEvent) => {
      console.log('mousemove', e);
    }), map((e: MouseEvent) => {
      return {
        pageX: e.pageX,
        pageY: e.pageY,
      };
    }), takeUntil(mouseup$));



    this.dragSelection$ = mousedown$.pipe(switchMap((mousedownValue) => {
      return mousemove$.pipe(map((mousemove: MouseEvent) => {

        //  get Positions
        var pageX = mousemove.pageX - mousedownValue.offsetLeft;
        var pageY = mousemove.pageY - mousedownValue.offsetTop;

        //  get gost width hieght
        var width = Math.abs(mousedownValue.initialW - pageX);
        var height = Math.abs(mousedownValue.initialH - pageY);

        this.updateDragSelectPosition(pageX, pageY, width, height, mousedownValue.initialW, mousedownValue.initialH)
        return {
          pageX: pageX,
          pageY: pageY,
          width: width,
          height: height,
        };

      }), tap((e) => {
        console.log('mouseup', e);
      }));;
    }), takeUntil(this.unsubscribe));


    this.dragSelection$.subscribe(this.mouseMoveUpdate,
      e => console.log(`error: ${e}`),
      () => console.log('complete!'));


    this.mouseMoveComplete$ = mousedown$.pipe(switchMap((mousedownData) => {
      return mouseup$.pipe(tap((mouseupData: MouseEvent) => {

      }), take(1));
    }), takeUntil(this.unsubscribe));;

    this.mouseMoveComplete$.subscribe(this.mouseMoveComplete,
      e => console.log(`error: ${e}`),
      () => console.log('complete!'));

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}


