
import { filter, scan, takeUntil, switchMap, tap, map } from 'rxjs/operators';

import { fromEvent as observableFromEvent, Subject, Observable } from 'rxjs';
import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';
import { Directive, HostListener, ElementRef, OnDestroy, AfterContentInit, Output, EventEmitter, Input } from '@angular/core';

import { ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';
import { ChangeAxisKind } from '../../../../screen-desingner-core/models/screen-desingner-request';

@Directive({
  selector: '[dpsFormContanerResizes]'
})
export class FormContanerResizesDirective implements OnDestroy, AfterContentInit {

  contanerMoveChanges$: Observable<any>;

  private unsubscribe: Subject<void> = new Subject();

  @Input()
  changeKind: ChangeAxisKind;

  @Output()
  axisChange = new EventEmitter<{ value: { xChange: number, yChange: number } }>();


  constructor(private elementRef: ElementRef) {

  }

  mouseMoveUpdate = (e) => {
    this.axisChange.emit({ value: e });
    console.log(`mouseMoveUpdate`, e);
  }

  ngAfterContentInit() {
    const mousedown$ = observableFromEvent(this.elementRef.nativeElement, 'mousedown').pipe(tap((e: MouseEvent) => {
      console.log(e);
    }), map((e: MouseEvent) => {
      return {
        startX: e.clientX,
        startY: e.clientY,
      };
    }));
    const mouseup$ = observableFromEvent(document, 'mouseup').pipe(tap((e: MouseEvent) => {
      console.log('mouseup', e);
    }));
    const mousemove$ = observableFromEvent(document, 'mousemove').pipe(map((e: MouseEvent) => {
      return {
        startX: e.clientX,
        startY: e.clientY,
        xChange: 0,
        yChange: 0,
      };
    }), takeUntil(mouseup$));

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
    }), map((data: any) => {
      return { xChange: data.xChange, yChange: data.yChange };
    }), filter((data) => !(data.xChange === 0 && data.yChange === 0)),
      map((data) => {
        if (this.changeKind === ChangeAxisKind.XAxis) {
          data.yChange = 0;
        } else if (this.changeKind === ChangeAxisKind.YAxis) {
          data.xChange = 0;
        }
        return data;
      }),
      takeUntil(this.unsubscribe));



    this.contanerMoveChanges$.subscribe(this.mouseMoveUpdate,
      e => console.log(`error: ${e}`),
      () => console.log('complete!'));

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}


