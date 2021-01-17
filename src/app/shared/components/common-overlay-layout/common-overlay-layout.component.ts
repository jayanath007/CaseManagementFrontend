import { Component, OnInit, ViewChild, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { uuid } from './../../../utils/uuid';

@Component({
  selector: 'dps-common-overlay-layout',
  templateUrl: './common-overlay-layout.component.html',
  styleUrls: ['./common-overlay-layout.component.scss']
})
export class CommonOverlayLayoutComponent implements OnInit {

  @Input() width: string | number;
  @Input() height: string | number;
  @Input() disposeWhenMouseLeave: boolean;
  @Input() disposeWhenBackdropClick: boolean;
  @Input() backdropClass: string;

  @ViewChild('commonOverlay') commonOverlay: TemplateRef<any>;

  public overlayRef: OverlayRef;
  public isMouseOver = false;
  public triggerWhen: 'click' | 'hover';
  public id = uuid();

  constructor( public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }
  onMouseOver(event) {
    this.isMouseOver = true;
  }

  onMouseLeave(event: MouseEvent) {

    const list = this.traverseChildren(document.getElementById(this.id));
    const e = event.toElement || event.relatedTarget;
    // tslint:disable-next-line: no-bitwise
    if (!!~list.indexOf(e)) {
      return;
    }
    this.isMouseOver = false;
    if (this.disposeWhenMouseLeave) {
      this.overlayRef.dispose();
    }
  }
  traverseChildren(elem) {
    const children = [];
    const q = [];
    q.push(elem);
    while (q.length > 0) {
      const elm = q.pop();
      children.push(elm);
      pushAll(elm.children);
    }
    function pushAll(elemArray) {
      for (let i = 0; i < elemArray.length; i++) {
        q.push(elemArray[i]);
      }

    }
    return children;
  }
}
