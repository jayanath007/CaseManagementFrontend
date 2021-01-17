import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject ,  Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Directive({
  selector: '[dpsClick]'
})
export class DpsClickDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 200;
  @Output() dpsDblClick = new EventEmitter();
  @Output() dpsClick = new EventEmitter();
  private clicks = new Subject();
  private subscription: Subscription;
  private oneClick = false;
  private secondClick = false;

  constructor() { }

  ngOnInit() {
    this.subscription = this.clicks.pipe(
      debounceTime(this.debounceTime)
    ).subscribe(e => {
      if (this.oneClick && this.secondClick) {
        this.dpsDblClick.emit(e);
      } else {
        this.dpsClick.emit(e);
      }
      this.oneClick = false;
      this.secondClick = false;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('click', ['$event'])
  clickEvent(event) {
    this.secondClick = this.oneClick === true ? true : false;
    this.oneClick = true;
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}


