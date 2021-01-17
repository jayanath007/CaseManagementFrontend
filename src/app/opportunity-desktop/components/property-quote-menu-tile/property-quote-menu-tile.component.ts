import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PropertyQuoteType } from '../../../opportunity-core/models/interfaces';
import { PropertyQuoteRequestKey } from '../../../opportunity-core/models/enums';

@Component({
  selector: 'dps-property-quote-menu-tile',
  templateUrl: './property-quote-menu-tile.component.html',
  styleUrls: ['./property-quote-menu-tile.component.scss']
})
export class PropertyQuoteMenuTileComponent implements OnInit {

  @Input() propertyQuoteType: PropertyQuoteType[];
  @Output() selectPropQuotetype = new EventEmitter<{ key: PropertyQuoteRequestKey, value: any }>();

  constructor() { }

  ngOnInit() {
  }

  onSelectPropertyQuoteType(item: PropertyQuoteType) {
    this.selectPropQuotetype.emit({ key: PropertyQuoteRequestKey.appId, value: item.appId });
  }

}
