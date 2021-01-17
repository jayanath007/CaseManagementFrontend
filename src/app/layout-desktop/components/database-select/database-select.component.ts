import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../services/layout.service';
import { Store } from '@ngrx/store';
import { getDatabases } from '../../reducers';
import { DB_CACHE_KEY } from '../../../auth';
import { ConfirmDialogData, ConfirmDialogComponent, ConfirmDialogResultKind } from '../../../shared';
import { MatDialog } from '@angular/material';
import { GetDatabases } from '../../actions/right-sidenav';
import { Observable } from 'rxjs';

@Component({
  selector: 'dps-database-select',
  templateUrl: './database-select.component.html',
  styleUrls: ['./database-select.component.scss']
})
export class DatabaseSelectComponent implements OnInit {

  public databases$: Observable<any[]>;

  constructor(private store: Store<any>, private dialog: MatDialog) {
    this.databases$ = store.select(getDatabases);
  }

  ngOnInit() {
    this.store.dispatch(new GetDatabases());
  }

  switchDatabase(item) {
    if (!item.isSelected) {
      const dialogData: ConfirmDialogData = {
        content: {
          title: 'Confirm . . .',
          message: 'Switching databases will lost your all unsaved data. Are you sure you want to continue?',
          acceptLabel: 'Yes',
          rejectLabel: 'No'
        },
        contentParams: {},
        data: null
      };
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: dialogData,
        width: '350px',
        disableClose: true,
        panelClass: 'dps-notification',
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult.kind === ConfirmDialogResultKind.Confirmed) {
          localStorage.setItem(DB_CACHE_KEY, item.databaseId);
          document.location.href = '/';
        }
      });
    }
  }
}
