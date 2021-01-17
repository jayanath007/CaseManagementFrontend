
import { map, buffer, takeUntil, debounceTime, tap, filter } from 'rxjs/operators';

import { fromEvent as observableFromEvent, Observable, Subject } from 'rxjs';
import { MatMenuTrigger } from '@angular/material';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ScreenListItemsChangeKind, TabChangeKind } from '../../../screen-desingner-core/actions/core';
import { ScreenContanerComponent } from '../../../screen-view-core/models/screen-contaner-component';



@Component({
  selector: 'dps-screen-view-container',
  templateUrl: './screen-view-container.component.html',
  styleUrls: ['./screen-view-container.component.scss']
})
export class ScreenViewContainerComponent implements OnInit, OnDestroy {
  isShown = false;
  // private mouseLocation: { left: number, top: number } = { left: 0; top: 0 };

  @Input()
  formView;

  @Input()
  screenDesingner;



  @Input()
  curentIndex;

  private unsubscribe: Subject<void> = new Subject();

  @Output()
  onLogicDodumentView = new EventEmitter<{ appId: number, fileName: string, templateType: string }>();
  @Output()
  onComponentChange = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();

  @Output()
  ondisplayTabOnRightBar = new EventEmitter();

  @Output()
  onAxisChange = new EventEmitter<{ value: { xChange: number, yChange: number } }>();

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  onItemChange(event) {
    this.onComponentChange.emit(event);
  }

  axisChange(event) {
    this.onAxisChange.emit(event);
  }


  prives() {

  }

  next() {

  }

  constructor() { }

  ngOnInit() {
    const mousedown$ = observableFromEvent(document, 'keydown').pipe(
      filter((event: any) => event.keyCode === 46)).pipe(
        tap((event: KeyboardEvent) => {
          console.log(event);
        }), takeUntil(this.unsubscribe));

    mousedown$.subscribe(() => {
      this.onComponentChange.emit({ kind: ScreenListItemsChangeKind.DeleteItem, row: null, value: '' });
    }, e => console.log(`error: ${e}`),
      () => console.log('complete!'));



    const click$ = observableFromEvent(document, 'mousedown').pipe(
      filter((e: any) => e.target.getAttribute('class') === 'screen-edit-overlay')).pipe(
        takeUntil(this.unsubscribe));
    // .do((e)=>{
    //   console.log(e);
    //   //(e: any) => (e.target.getAttribute('class') === 'screen-editor-main-wrapper')
    // })


    const clickEvent = click$.pipe(buffer(click$.pipe(debounceTime(250))), map(arr => arr.length)).pipe(
      filter(len => len === 2))
      .subscribe((e) => {
        this.ondisplayTabOnRightBar.emit();
      }, e => console.log(`error: ${e}`),
        () => console.log('complete!'));

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }




  displayTabOnRightBar() {

    this.ondisplayTabOnRightBar.emit();

  }

  logicDodumentViewOpen(event) {

    this.onLogicDodumentView.emit(event);


  }

  // contextmenuOpen(event) {
  //   event.preventDefault();
  //   this.contextMenu.openMenu();

  // }

  // get locationCss() {
  //   return {
  //     'position': 'fixed',
  //     'display': this.isShown ? 'block' : 'none',
  //     left: this.mouseLocation.left + 'px',
  //     top: this.mouseLocation.top + 'px',
  //   };
  // }

}
