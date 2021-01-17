import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CurrentLimits, UserInputData, LimitHistory } from '../../../price-cap-limits-core/models/interfaces';
import { UserInputDataEnum } from '../../../price-cap-limits-core/models/enum';
import { TableColumn, TableRow } from '../../../shared';


@Component({
  selector: 'dps-price-cap-limits-layout',
  templateUrl: './price-cap-limits-layout.component.html',
  styleUrls: ['./price-cap-limits-layout.component.scss']
})
export class PriceCapLimitsLayoutComponent implements OnInit, OnChanges {

  @Input() isLoading: boolean;
  @Input() currentLimit: CurrentLimits[];
  @Input() userInput: UserInputData;
  @Input() hitory: LimitHistory[];
  @Output() closePopup = new EventEmitter();
  @Output() changeUserInput = new EventEmitter<{ key: UserInputDataEnum, value: any }>();
  @Output() addToLimitHistory = new EventEmitter();
  @Output() deleteHistoryRow = new EventEmitter<LimitHistory>();

  inputKey = UserInputDataEnum;

  columns: TableColumn[] = [
    { name: 'Posted Date', propertyName: 'postedDate', width: '25%', isDate: true, dateFormat: 'dd/MM/yyyy' },
    { name: 'User', propertyName: 'user', width: '20%' },
    { name: 'Granted Date', propertyName: 'grantedDate', width: '20%', isDate: true, dateFormat: 'dd/MM/yyyy' },
    { name: 'Granted Limit Value', propertyName: 'grantedLimit', width: '25%', textAlign: 'right', },
    { name: '', propertyName: 'delete', width: '10%', textAlign: 'right', isButton: true }
  ];

  gridRows: TableRow<any>[] = [];

  selectedHistoryItem = 0;
  constructor(


  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes.hitory && !changes.hitory.isFirstChange())) {
      this.setTableRow();
    }
  }

  setTableRow() {
    const rows: TableRow<any>[] = [];
    if (this.hitory && this.hitory.length > 0) {
      this.hitory.forEach((r, i) => {
        const isSelected = this.selectedHistoryItem === i;
        rows.push({
          data: {
            postedDate: r.postedDate, user: r.user, grantedDate: r.generatedDate, grantedLimit: r.limitValue, delete: 'delete', index: i
          },
          selected: isSelected,
        });
      });
    }
    this.gridRows = rows;
  }

  onClosePopup() {
    this.closePopup.emit();
  }

  get selectedLimit(): CurrentLimits {
    return this.currentLimit ? this.currentLimit.find(l => l.limitType === this.userInput[UserInputDataEnum.limitedType]) : null;
  }

  onChangeUserInput(key: UserInputDataEnum, value: any) {
    this.changeUserInput.emit({ key: key, value: value });
  }

  onSelectHistoryItem(info: { row: any, event: MouseEvent }) {
    this.selectedHistoryItem = info.row.data.index;
    this.setTableRow();
  }

  btnExceedClick() {
    this.addToLimitHistory.emit();
  }

  onRowButtonClick(data: { event: MouseEvent, row: TableRow<any>, columns: TableColumn }) {
    if (data.columns.propertyName === 'delete') {
      const selectedItem = this.hitory.find((r, i) => i === data.row.data.index);
      this.deleteHistoryRow.emit(selectedItem);
    }
  }

}
