import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Theme } from '../../../dashboard-desktop/components/dashboard-layout/enum';
import { getTheme } from '../../reducers/right-sidenav';
import { Store } from '@ngrx/store';
import { ChangeThemeSidenav } from '../../actions/right-sidenav';

@Component({
  selector: 'dps-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss']
})
export class ThemeComponent implements OnInit {

  theme$: any;
  Theme = Theme;
  constructor(private store: Store<any>) { }


  ngOnInit() {
    this.theme$ = this.store.select(getTheme);
  }

  onThemeChange(event) {
    this.store.dispatch(new ChangeThemeSidenav(event.value));
  }
}
