import { Component, OnInit } from '@angular/core';
import { LayoutBaseClass } from '../../class/layout-base-class';

@Component({
  selector: 'dps-contacts-create-main-layout',
  templateUrl: './contacts-create-main-layout.component.html',
  styleUrls: ['./contacts-create-main-layout.component.scss']
})
export class ContactsCreateMainLayoutComponent extends LayoutBaseClass implements OnInit {

  constructor() { super(); }


  ngOnInit() {
  }


}
