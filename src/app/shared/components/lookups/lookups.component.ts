import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { LookupsDialogInput, ConfirmDialogResultKind, ConfirmDialogResult, LoockupItem } from '../../models/dialog';
import { showConfirmDialog } from '../../../core/utility/DpsUtility';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'dps-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.scss']
})
export class LookupsComponent implements OnInit {

  lookups: LoockupItem[] = [];
  selectIndex: number;
  isDirty: boolean;
  inputCtrl = new FormControl();
  searchText = '';

  @Output() save = new EventEmitter<LoockupItem[]>();
  @Output() select = new EventEmitter<LoockupItem>();

  constructor(
    public dialogRef: MatDialogRef<LookupsComponent>, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: LookupsDialogInput) { }


  ngOnInit() {
    if (this.data && this.data.items) {
      if (this.data.items) {
        if (this.data.enableSearch) {
          this.filterList(this.data.searchText);
        } else {
          this.lookups = this.data.items;
        }
      }

    }
  }

  onClosePopup(): void {
    this.dialogRef.close();
  }

  onDeleteRow() {
    if (this.lookups.length - 1 === this.selectIndex) {
      this.selectIndex -= 1;
    }
    const msgTitle = 'Delete Rows';
    const msg = 'You have selected 1 row for delection. <br> Choose Yes to delete the row or No to exit';
    const warningDialog = showConfirmDialog(msgTitle, msg, this.dialog);
    warningDialog.afterClosed().subscribe((result: ConfirmDialogResult) => {
      if (result.kind === ConfirmDialogResultKind.Confirmed) {
        this.lookups.splice(this.selectIndex, 1);
      }
    });
  }

  onInputKeyDown(index: number, event: KeyboardEvent) {
    if ((event.keyCode === 13 || event.keyCode === 40) && !!this.lookups[index]) {
      // this.selectIndex++;
    } else if (event.keyCode === 38 && index !== 0) {
      // this.selectIndex--;
    } else {
      this.isDirty = true;
    }
    this.isDirty = true;

    // this.updateLokup(index, event);
  }



  getInputClass(index) {
    return `input-id-${index}`;
  }

  onSave() {
    // this.save.emit(this.lookups);
  }

  onSelect(index = this.selectIndex) {
    // this.select.emit(this.lookups[index]);
    if (this.isDirty) {
      const msgTitle = 'Save Changes';
      const msg = 'Do you want to save the current changes?';
      const warningDialog = showConfirmDialog(msgTitle, msg, this.dialog);
      warningDialog.afterClosed().subscribe((result: ConfirmDialogResult) => {
        if (result.kind === ConfirmDialogResultKind.Confirmed) {
          this.onSave();
        } else {
          this.dialogRef.close(this.lookups[index]);
        }
      });
    } else {
      this.dialogRef.close(this.lookups[index]);
    }
  }
  getKeyString(lookup: string): string {
    if (this.data.keyColumsEnable && !!lookup) {
      return lookup.substr(0, 2);
    }
    return '';
  }

  getLookupWord(lookup: string, index): string {
    if (this.data.keyColumsEnable && !!lookup && this.selectIndex !== index) {
      return lookup.replace(lookup.substr(0, 2), '');
    } else if (this.data.showCode) {
      return `${this.lookups[index].code} | ${this.lookups[index].name}`;
    }
    return lookup;
  }

  changeLockup(index: number, event) {
    // if (index === this.selectIndex) {
    //   this.lookups[index] = event.target.value;
    // }
    // this.lookups[this.lookups.length - 1] = '';

  }

  filterList(searchText) {
    this.searchText = searchText;
    if (this.data.enableSearch && this.searchText && this.data.items && this.data.items.length > 0) {
      const temSearchKey = this.searchText.toLocaleLowerCase();
      const filterList: LoockupItem[] = [];
      this.data.items.forEach(i => {
        if (i.code.toLowerCase().startsWith(temSearchKey)) {
          filterList.push(i);
        } else if (i.name.toLowerCase().includes(temSearchKey)) {
          filterList.push(i);
        }
      });
      this.lookups = this.data.editable ? filterList.concat({ code: 'new', name: '' }) : filterList;
    } else {
      this.lookups = this.data.editable ? this.data.items.concat({ code: 'new', name: '' }) : this.data.items;
    }

  }

}

