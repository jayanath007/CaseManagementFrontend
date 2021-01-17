
import { switchMap, map, share } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { interval, Observable } from 'rxjs';



@Component({
  selector: 'dps-token-expire-message',
  templateUrl: './token-expire-message.component.html',
  styleUrls: ['./token-expire-message.component.scss']
})
export class TokenExpireMessageComponent implements OnInit {

  timeLeft$;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { expireTs: Observable<number> },
    public dialogRef: MatDialogRef<TokenExpireMessageComponent>) {
    this.timeLeft$ = this.getTimeLeft().pipe(share());
  }

  ngOnInit() {

  }

  getTimeLeft() {
    return interval(1000).pipe(
      switchMap(() => {
        return this.data.expireTs;
      }),
      map((time) => {
        const secondsLeft = time - Math.round(new Date().getTime() / 1000.0);
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft - (m * 60);
        return { m: m, s: s };
      }));
  }

  onOk() {
    this.dialogRef.close(false);
  }

  onLogout() {
    this.dialogRef.close(true);
  }
}
