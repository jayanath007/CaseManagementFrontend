import { Component, OnInit, Inject } from '@angular/core';
import { Store } from '@ngrx/store';


import { of } from 'rxjs';

@Component({
  selector: 'dps-sticky-folder-state-manager',
  template: `
    <router-outlet name="inbox"></router-outlet>
    <router-outlet name="drafts"></router-outlet>
    <router-outlet name="common"></router-outlet>
    <router-outlet name="groups"></router-outlet>
  `,
  styles: []
})
export class StickyFolderStateManagerComponent implements OnInit {

  constructor(private store: Store<any>) {

  }

  ngOnInit() {

  }

}
