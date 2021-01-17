
import {take, filter, scan, switchMap, takeUntil, map, tap} from 'rxjs/operators';

import {fromEvent as observableFromEvent,  Subject ,  Observable } from 'rxjs';
import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';
import { Directive, HostListener, ElementRef, OnDestroy, AfterContentInit, Output, EventEmitter, Input } from '@angular/core';

import { ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';





@Directive({
  selector: '[dpsContanerDraggable]'
})
export class ContanerDraggableDirective implements OnDestroy, AfterContentInit {

  contanerMoveChanges$: Observable<any>;
  mouseMoveComplete$: Observable<any>;

  private unsubscribe: Subject<void> = new Subject();


  @Input()
  screenContanerComponent: ScreenContanerComponent;

  @Output()
  editorContanerEventOutput = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();


  constructor(private elementRef: ElementRef) {

  }

  mouseMoveUpdate = (e) => {
    this.editorContanerEventOutput.emit({ kind: ScreenListItemsChangeKind.MoveItem, row: this.screenContanerComponent, value: e });
    console.log(`mouseMoveUpdate`, e);
  }
  mouseMoveComplete = (e) => {
    this.editorContanerEventOutput.emit({ kind: ScreenListItemsChangeKind.MoveComplete, row: this.screenContanerComponent, value: e });
    console.log(`mouseMoveComplete`, e);
  }

  ngAfterContentInit() {
    const mousedown$ = observableFromEvent(this.elementRef.nativeElement, 'mousedown').pipe(tap((e : MouseEvent) => {
      console.log(e);
    })).pipe(filter((e: any) => e.target.getAttribute('class') === 'screen-edit-overlay' ),map((e: MouseEvent) => {
      return {
        startX: e.clientX,
        startY: e.clientY,
        ctrlKey: e.ctrlKey,
      };
    }),);
    const mouseup$ = observableFromEvent(document, 'mouseup');
    const mousemove$ = observableFromEvent(document, 'mousemove').pipe(map((e: MouseEvent) => {
      return {
        startX: e.clientX,
        startY: e.clientY,
        xChange: 0,
        yChange: 0,
      };
    })).pipe(takeUntil(mouseup$));

    this.contanerMoveChanges$ = mousedown$.pipe(switchMap((value) => {
      const startValues = { startX: value.startX, startY: value.startY, xChange: 0, yChange: 0 };
      return mousemove$.pipe(scan((acc, curr) => {
        return {
          startX: curr.startX,
          startY: curr.startY,
          xChange: curr.startX - acc.startX,
          yChange: curr.startY - acc.startY,
        };
      }, startValues));
    }),map((data) => {
      return { xChange: data.xChange, yChange: data.yChange };
    }),filter((data) => !(data.xChange === 0 && data.yChange === 0)),
      takeUntil(this.unsubscribe),);



    this.mouseMoveComplete$ = mousedown$.pipe(switchMap((mousedownData) => {
      return mousemove$.pipe(switchMap((mousemoveData) => {
        return mouseup$.pipe(filter((mouseupData: MouseEvent) => {
          return !(mousedownData.startX === mousemoveData.startX && mousedownData.startY === mousemoveData.startY);
        }),take(1),);
      }));
    }),takeUntil(this.unsubscribe),);;

    this.contanerMoveChanges$.subscribe(this.mouseMoveUpdate,
      e => console.log(`error: ${e}`),
      () => console.log('complete!'));

    this.mouseMoveComplete$.subscribe(this.mouseMoveComplete,
      e => console.log(`error: ${e}`),
      () => console.log('complete!'));

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}


