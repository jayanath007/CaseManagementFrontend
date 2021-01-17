import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dps-section-for-price',
  templateUrl: './section-for-price.component.html',
  styleUrls: ['./section-for-price.component.scss']
})
export class SectionForPriceComponent implements OnInit {

  constructor() { }

  @Input() currency: string;
  @Input() header: string;
  @Input() value: string;
  @Output() changeValue = new EventEmitter<string>();

  ngOnInit() {
  }
  
  onChangePrice(value) {
    this.changeValue.emit(value);
  }

}
