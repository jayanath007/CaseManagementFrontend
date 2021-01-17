import { Component, OnInit, Input, Directive, HostBinding } from '@angular/core';

@Component({
  selector: 'dps-ledger-card-matter-balance-item',
  templateUrl: './ledger-card-matter-balance-item.component.html',
  styleUrls: ['./ledger-card-matter-balance-item.component.scss']
})
export class LedgerCardMatterBalanceItemComponent implements OnInit {

  constructor() { }

  @Input() displyName: string;
  @Input() value: string;

  ngOnInit() {
  }

}

