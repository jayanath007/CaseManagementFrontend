import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OptionDialogBoxMediator } from '../../../workflow-core/models/mediators';
import { OptionDialogResult, DialogResult } from '../../../workflow-core';

@Component({
  selector: 'dps-option-box',
  templateUrl: './option-box.component.html',
  styleUrls: ['./option-box.component.scss']
})
export class OptionBoxComponent implements OnInit, OnDestroy {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { mediator: OptionDialogBoxMediator },
    public dialogRef: MatDialogRef<OptionBoxComponent>) { }

  public dataList: OptionList[];
  public isCheckBox: boolean;
  public isSelectFirstRadio: boolean;
  private lcSubscription;
  caption;

  ngOnInit() {

    this.lcSubscription = this.data.mediator.lifecycle.subscribe(() => { }, () => {
      this.dialogRef.close();
    });

    this.data.mediator.ready().then(val => {
      this.dataList = this.buildOptionList(val.options, val.isSelectFirstRadio);
      this.isCheckBox = val.isCheckBox;
      this.isSelectFirstRadio = val.isSelectFirstRadio;
      this.caption = val.caption;
    });
  }

  private buildOptionList(optionValue: string[], isSelectFirstRadio): OptionList[] {
    const list: OptionList[] = [];
    optionValue.filter(item => item !== null && item.trim() !== '')
      .forEach((val, i) => {
        if (isSelectFirstRadio && i === 0) {
          list.push({ option: val, selected: true });
        } else {
          list.push({ option: val, selected: false });
        }
      });
    return list;
  }

  selectAllButton(): void {
    this.dataList.forEach(val => {
      val.selected = true;
    });
  }

  onCheckBoxClick(item: OptionList): void {
    this.dataList.forEach(dataItem => {
      if (!this.isCheckBox) {
        if (item.option === dataItem.option) {
          dataItem.selected = true;
        } else {
          dataItem.selected = false;
        }
      } else {
        if (item.option === dataItem.option) {
          dataItem.selected = !dataItem.selected;
        }
      }
    });
  }

  onAction() {
    const selected: number[] = [];
    this.dataList.forEach((dataItem, i) => {
      if (dataItem.selected) {
        selected.push(i);
      }
    });
    this.dialogRef.close({ dialogResult: DialogResult.Ok, checkedIndexes: selected });
  }

  onClose() {
    this.dialogRef.close({ dialogResult: DialogResult.Cancel, checkedIndexes: null });
  }

  ngOnDestroy(): void {
    this.data.mediator.destroy();
    this.lcSubscription.unsubscribe();
  }

}

export interface OptionList {
  option: string;
  selected: boolean;
}
