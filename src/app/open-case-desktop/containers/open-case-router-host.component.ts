import { getUser } from './../../auth/reducers/index';
import { getMatterShortCutListByToken } from './../../open-case-core/reducers/index';
import { getOpenCaseMenuItemMatterDataById } from './../../layout-desktop/reducers/index';
import { switchMap, map, filter, pairwise, startWith, take } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '../../core';
import { Store } from '@ngrx/store';


@Component({

  selector: 'dps-open-case-router-host',
  template: `<dps-open-case-home
   [inputData]="inputData$ | async"
   [token]="token$ | async"
   [user]="user$ | async"
  [matterShortCutList]="matterShortCutList$|async"></dps-open-case-home>`,
  styles: []
})
export class OpenCaseRouterHostComponent extends ComponentBase implements OnInit {

  // dialogRef: MatDialogRef<AddNotePopupComponent>;

  inputData$: any;
  token$: any;
  matterShortCutList$: any;
  user$: any;



  constructor(private route: ActivatedRoute, private store: Store<any>) {
    super();
  }

  ngOnInit() {


    this.user$ = this.store.select(getUser);
    this.token$ = this.route.params.pipe(map((item) => {
      return item.token;
    }));

    this.matterShortCutList$ = this.token$.pipe(switchMap((token) => {
      return this.store.select(getMatterShortCutListByToken(token));
    }));

    this.inputData$ = this.route.params.pipe(switchMap((value) => {
      return this.store.select(getOpenCaseMenuItemMatterDataById(value.token)).pipe(
        filter((data) => {
          return (data.length > 0);
        }),
        map((items) => {
          return items[0];
        }),
        startWith(null),
        pairwise(),
        filter((data) => {
          if (data[0] && data[1] &&
             JSON.stringify(data[0].matterData) === JSON.stringify(data[1].matterData)) {
            return false;
          }
          return true;
        }),
        map((data) => {
          return data[1];
        }),

      );
    }));
  }
}
