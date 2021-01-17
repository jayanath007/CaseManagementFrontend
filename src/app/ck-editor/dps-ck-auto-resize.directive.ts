
import { Directive, OnInit, Input, EventEmitter, NgZone, OnChanges, HostListener, } from '@angular/core';
import { InstanceRef } from './instance-ref';




@Directive({
  selector: '[dpsCkAutoResize]'
})
export class DpsCkAutoResizeDirective implements OnInit, OnChanges {

  @Input() dpsCkAutoResize: number;
  @Input() ckContentPadding: number;

  ckEditor: any;

  container;
  // const getContentPadding = $parse(iAttrs.ckContentPadding);

  updateTimeOut: any;
  changeWatchTimeOut = null;


  constructor(private ref: InstanceRef, private zone: NgZone) {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.ckEditor) {
      this.updateSize(this.ckEditor);
    }
  }


  ngOnChanges() {
    if (this.ckEditor) {
      this.updateSize(this.ckEditor);
    }
  }

  ngOnInit(): void {
    const subscription = this.ref.ready().subscribe((editor) => {
      this.updateSizeAfterReady(editor);
      this.ckEditor = editor;
      subscription.unsubscribe();
    });
  }

  updateSizeAfterReady(editor) {
    this.updateSize(editor);
  }


  updateSize(editor) {
    // container = $(editor.container.$);
    if (!this.container) {
      this.container = editor.container.$;
    }
    if (this.container.hidden) {

      if (this.updateTimeOut) { clearTimeout(this.updateTimeOut); }

      // this.updateTimeOut = setTimeout(function () {
      //   this.updateSize(editor);
      // }, 1000);

      this.updateTimeOut = setTimeout(() => {
        this.updateSize(editor);
      }, 1000);
      return;
    }

    //  var baseParent = $(document); //container.offsetParent();  //container.parents(baseLineSelector);
    setTimeout(() => {
      const baseParent = window.innerHeight;
      const offSet = this.container.offsetTop;
      // var height = baseParent.innerHeight() - offSet;

      //  height = height - getContentPadding(scope)-21;
      // const toolBarHeight = this.container.offsetHeight - 244;
      const height = window.innerHeight - offSet - this.ckContentPadding - 21;
      editor.resize('100%', Math.max(Math.floor(height), 300), false);
    }, 10);

  }



}
