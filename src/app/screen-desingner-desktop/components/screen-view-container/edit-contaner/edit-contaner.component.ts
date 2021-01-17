import { forEach } from '@angular/router/src/utils/collection';
import { ScreenContanerComponent } from '../../../../screen-view-core/models/screen-contaner-component';
import { Component, OnInit, Input, Output, OnDestroy, EventEmitter } from '@angular/core';
import { ScreenListItemsChangeKind } from '../../../../screen-desingner-core/actions/core';

@Component({
  selector: 'dps-edit-contaner',
  template: `
  <div (mousedown)="selectContanerElement($event)"  class="drag-container"
   [ngClass]="{ 'select-container': screenContanerComponent.isSelected}"  >
    <div  class="screen-edit-overlay" [style.height.px]="screenContanerComponent.containerHeight"
     (keydown)="onKeydown($event)" tabindex="1"></div>
        <span class="sequence">{{screenContanerComponent.sequence}}</span>
      <ng-content> </ng-content>

  </div>
  `,
  styleUrls: ['./edit-contaner.component.scss']
})
// <div  class="screen-edit-overlay" (keydown)="onKeydown($event)" tabindex="1"></div>
// <div class="cordinations">{{screenContanerComponent.isSelected}}</div>
// (mousedown)="selectContanerElement($event)"
export class EditContanerComponent implements OnInit, OnDestroy {
  timer: any;
  preventSimpleClick: boolean;
  delay: any;


  @Input()
  screenContanerComponent: ScreenContanerComponent;

  @Output()
  ondisplayTabOnRightBar = new EventEmitter();

  @Output()
  editorContanerEventOutput = new EventEmitter<{ kind: ScreenListItemsChangeKind, row: ScreenContanerComponent, value: any }>();

  onKeydown(event) {
    if (event.keyCode === 46) {
      this.editorContanerEventOutput.emit({ kind: ScreenListItemsChangeKind.DeleteItem, row: null, value: '' });
    }
  }


  constructor() { }


  selectContanerElement(e) {
    this.editorContanerEventOutput.emit({ kind: ScreenListItemsChangeKind.SelectItem, row: this.screenContanerComponent, value: e });
    console.log(`selectContanerElement`, e);

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // this.unsubscribe.next();
    // this.unsubscribe.complete();
  }
  // todo
  onComponentDoubleClick() {
    this.ondisplayTabOnRightBar.emit();
  }


  // selectContanerElement(e): void {
  //   this.timer = 0;
  //   this.preventSimpleClick = false;
  //   this.delay = 200;

  //   this.timer = setTimeout(() => {
  //     if (!this.preventSimpleClick) {
  //       this.editorContanerEventOutput.emit({ kind: ScreenListItemsChangeKind.SelectItem, row: this.screenContanerComponent, value: e });
  //       console.log(`selectContanerElement`, e);
  //     }
  //   }, this.delay);

  // }

  // onComponentDoubleClick(): void {
  //   this.preventSimpleClick = true;
  //   clearTimeout(this.timer);
  //   this.ondisplayTabOnRightBar.emit();
  // }



}
