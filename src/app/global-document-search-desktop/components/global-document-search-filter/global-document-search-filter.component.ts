
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilterType } from '../../../global-document-search-core/models/enum';
import { FilterViewModel, DropdownListData, UpdateCol } from '../../../global-document-search-core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'dps-global-document-search-filter',
  templateUrl: './global-document-search-filter.component.html',
  styleUrls: ['./global-document-search-filter.component.scss']
})
export class GlobalDocumentSearchFilterComponent implements OnInit {

  @Input() filterViewModel: FilterViewModel;
  @Input() feeEarnerList: DropdownListData[];
  @Input() appCodeList: DropdownListData[];
  @Input() filterExpanded: boolean;



  @Output() searchDoc = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  fontSize: number;
  fontSizeClassTag: string;
  buttonActiveClass: string;

  filterType = FilterType;
  // operators = this.filterViewModel.filterList[0].operatorType;
  @Output() fontSizeClassChangeValue = new EventEmitter<string>();
  @Output() removeFilterRow = new EventEmitter<any>();
  @Output() documentClear = new EventEmitter<any>();
  @Output() addFilterRow = new EventEmitter<any>();
  @Output() documentSearch = new EventEmitter<any>();
  @Output() filterItemChange = new EventEmitter<{ filterId: number, changeValue: any, changeCol: UpdateCol }>();
  panelOpenState = false;

  constructor(private datePipe: DatePipe) { }

  ngOnInit() {
    this.fontSize = 0;
    this.fontSizeClassTag = 'font-increment-';
    this.buttonActiveClass = '';
  }

  onDocumentSearch() {
    this.panelOpenState = true;
    // event.stopPropagation();
    // event.preventDefault();
    this.documentSearch.emit();


  }

  onDocumentClear(event) {
    event.stopPropagation();
    event.preventDefault();
    this.documentClear.emit();

  }


  onDocumentFilterClear($event) {

    alert($event.value);

  }

  onAddFilterRow() {
    this.addFilterRow.emit();
  }



  onRemoveFilterRow(event) {

    this.removeFilterRow.emit(event);

  }

  onFilterItemChange(event) {
    this.filterItemChange.emit(event);
  }


  // Font size
  onFontSizeMinusClick() {
    // event.stopPropagation();
    // event.preventDefault();
    if (this.fontSize > -3) {
      this.buttonActiveClass = 'active';
      this.fontSize -= this.fontSize !== 1 ? 1 : 2;
      // this.gridFontSize = (this.fontSizeClassTag + this.fontSize);
      this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onFontSizeResetClick() {
    // event.stopPropagation();
    // event.preventDefault();
    this.buttonActiveClass = '';
    this.fontSize = 0;
    // this.gridFontSize = (this.fontSizeClassTag + this.fontSize);
    this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
  }
  onFontSizePlusClick() {
    // event.stopPropagation();
    // event.preventDefault();
    if (this.fontSize < 4) {
      this.buttonActiveClass = 'active';
      this.fontSize += this.fontSize !== -1 ? 1 : 2;
      // this.gridFontSize = (this.fontSizeClassTag + this.fontSize);
      this.fontSizeClassChangeValue.emit(this.fontSizeClassTag + this.fontSize);
    }
  }
  onRefresh() {
    // event.stopPropagation();
    // event.preventDefault();
    this.refresh.emit();

  }




  filterCondition() {
    if (this.filterExpanded === true) {
      if (this.filterViewModel.filterList && this.filterViewModel.filterList.length > 0) {

        let qurystring = '';
        this.filterViewModel.filterList.forEach(row => {

          const filterval = row.filterType === FilterType.ToDate ? this.datePipe.transform(row.filterValue, 'dd/MM/yyyy h:mm a')
            : '\'' + row.filterValue + '\'';
          qurystring = qurystring + ' ' + this.type(row.filterType) + ' ' + this.operator(row.operator)
            + ' ' + filterval + ' ' + row.fieldOperator;

        });


        return qurystring;

      }
    } else {
      return '';
    }
  }

  type(type) {
    switch (type) {
      case 'FeeEarner':
        return 'Fee Earner';
      case 'DPSLastModified':
        return 'Date';
      case 'MatterCode':
        return 'App Type';
      case 'DocumentType':
        return 'Doc Type';
    }
  }

  operator(operate) {
    switch (operate) {
      case 'eq':
        return '=';
      case 'ne':
        return '≠';
      case 'gt':
        return '>';
      case 'lt':
        return '<';
      case 'ge':
        return '≥';
      case 'le':
        return '≤';
    }
  }
}
