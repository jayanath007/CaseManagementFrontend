import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';

@Component({
  selector: 'dps-matter-search-sidenav',
  templateUrl: './matter-search-sidenav.component.html',
  styleUrls: ['./matter-search-sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatterSearchSidenavComponent implements OnInit {
  // @Input() homeCurrancy;

  // @Input() searchText: string;
  // @Input() departmentList: Department[];
  // @Input() selectedDepartment;
  // @Input() isInactiveFeeEarner: boolean;
  // @Input() totalItems: Number;
  // @Input() isClosedMatters: boolean;
  // @Input() totalBillsOutstanding;
  // @Input() totalMatterCount;
  // @Input() activeView;

  // @ViewChild(MatRadioGroup) matRadioGroup: MatRadioGroup;


  // MatterViews = MatterViews;

  // @Output() viewChange = new EventEmitter();


  constructor() { }

  ngOnInit() {
    // this.matRadioGroup.value = MatterViews.Recent;

  }


  // onClosedMattersChange(value) {
  //   if (value) {
  //     this.viewChange.emit({ kind: ViewChangeKind.ClosedMatters, value: false });
  //   } else {
  //     this.viewChange.emit({ kind: ViewChangeKind.ClosedMatters, value: true });
  //   }
  // }

  // onInactiveFeeEarnersChange(value) {
  //   this.viewChange.emit({ kind: ViewChangeKind.InactiveFeeEarners, value: value });
  // }

  // onSearchTextChanged(value) {
  //   // if (!value) {
  //   //   this.matRadioGroup.value = MatterViews.Recent;
  //   // } else {
  //   //   this.matRadioGroup.value = null;
  //   // }
  //   this.viewChange.emit({ kind: ViewChangeKind.SearchText, value: value });
  // }

  // onDepartmentChange(value) {
  //   // this.matRadioGroup.value = (value !== null) ? (value !== -1) ? MatterViews.MyMatter
  //   //   : MatterViews.Recent : MatterViews.Recent;
  //   // if (value) {
  //   //   this.matRadioGroup.value = (value === -1) ? MatterViews.Recent : MatterViews.MyMatter;
  //   // } else {
  //   //   this.matRadioGroup.value = MatterViews.Recent;
  //   // }
  //   this.viewChange.emit({ kind: ViewChangeKind.Department, value: value });
  // }

  // changeMatterView(event: MatRadioChange) {
  //   if (event.value) {
  //     this.viewChange.emit({ kind: ViewChangeKind.MainView, value: event.value });
  //   }
  // }

  // openPopup() {
  //   const dialogData: MessageDialogData = {
  //     content: {
  //       message: 'Time Zone successfully updated'
  //     }
  //   };

  //   const dialogRef = this.dialog.open(MessageDialogComponent, {
  //     data: dialogData,
  //     width: '400px',
  //     disableClose: true,
  //     hasBackdrop: false,
  //     panelClass: 'dps-msg-dialog',
  //   });
  //   return dialogRef.afterClosed().map<any, boolean>(dialogResult => {
  //     return false;
  //   });
  // }



}

