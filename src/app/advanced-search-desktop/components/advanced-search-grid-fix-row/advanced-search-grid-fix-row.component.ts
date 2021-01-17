import { SearchColumnOption } from './../../../advanced-search-core/models/enums';
import { ColumnDef } from './../../../core/lib/grid-model';
import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'dps-advanced-search-grid-fix-row',
  templateUrl: './advanced-search-grid-fix-row.component.html',
  styleUrls: ['./advanced-search-grid-fix-row.component.scss']
})
export class AdvancedSearchGridFixRowComponent implements OnInit {
  @Input() gridDataList;
  @Input() columnDef: ColumnDef[];
  @Input() coloumnArray;
  @Input() gridRowData;
  @Input() isLoading: boolean;


  constructor() { }



  ngOnInit() {
  }



  getFxFlexProperty(key) {
    if (!this.columnDef) { return ''; }
    const col = this.columnDef.find(c => c.fieldName === key);
    return col.extras ? col.extras.fxFlex : '';
    // return this.columnDef[index] && this.columnDef[index].extras ? this.columnDef[index].extras.fxFlex : '';
  }
  //   getValueForColumn(columns: string, contactIem: any) {
  //    // let columns: string[];
  //      //  if (!contactField.includes(',')) {
  //          //  columns = [contactField];
  //       // } else {
  //          //  columns = contactField;
  //       // }

  //        let columnValue = '';
  //        for (const columnName of columns) {
  //            const str = this.getValueIgnoreCase(contactIem, columnName);
  //            if (str) {
  //               columnValue += str + ' ';
  //            }
  //        }
  //        return columnValue;
  // }


  // getValueIgnoreCase(obj: any, key: string) {
  //   const alllKeys = Object.keys(obj);
  //   for (const key1 of alllKeys) {
  //       if (key1.trim().toUpperCase() === key.trim().toUpperCase()) {
  //           return obj[key1];
  //       }
  //   }
  //   return null;
  // }


  // getValueIgnoreCase(rowData, key) {
  //   const dataValues = []; // For values

  //   const dataKeys = []; // For keys

  //   //   for(let key in rawData) {
  //   //     dataValues.push(rawData[key]);
  //   //     dataKeys.push(key);
  //   //  }

  //   // }
  //   for (let index = 0; index < rowData.length; index++) {
  //     dataValues.push(rowData[key]);
  //     dataKeys.push(key);

  //   }

  //   return dataValues;
  // }


  UpdateSearchHeaders(key) {
    let ColorCode: string;
    switch (key) {
      case SearchColumnOption.Custom:

        switch (key) {
          case 'MAT_Ref':  
          case 'MAT_Details':
          case 'SAL_Account_Name':
            ColorCode = 'headerColour';                                  // col.Header.Appearance.BackColor = headerColour;
            break;

          case 'ALL_APPS_HEADER':
            // if we're in All Apps, Application Vars column is always instring
            ColorCode = 'mInstringSearchColour';
            break;

          default:
            {
 // anything else - do we read from mSearchFields? or test to see if the colour is currently set to search, then just make sure it's correct instring or not?
     //Try the latter to start with, that then deals with the user having selected eg F/E, we should probably block that, but until we do...
              //OK, can't do that, because in grid InitializeLayout we start by clearing all the header colours to non-search.
              //So we need to use the search fields
              //if (col.Header.Appearance.BackColor != mHeaderColour)
              //    col.Header.Appearance.BackColor = headerColour;

              //this would be the other way of setting the header colour...
            //   if (searchField != null && mSearchFields.Contains(col.Key))
            //   ColorCoder = headerColour;
            // }
            break;

        }

        break;
    }

    break;
     case SearchColumnOption.All:
     switch (key)
      {
         case 'MAT_Fee_Earner':
         case 'MAT_Start_Date':
         case 'MAT_AppID':
         case 'MAT_BranchID':



         ColorCode = 'mHeaderColour';
             break;

         default:
         ColorCode = 'mInstringSearchColour';
             break;
     }

    break;
     case SearchColumnOption.Speed:
       switch (key)
     {
         case 'MAT_Ref':
         case 'MAT_Details':
         case 'SAL_Account_Name':
         ColorCode = 'mIndexSearchColour';
             break;

         default:
         ColorCode = 'mHeaderColour';
             break;


     }


    break;
     case SearchColumnOption.Date:
     switch (key)
     {
         case 'MAT_Start_Date':
         ColorCode = 'mIndexSearchColour';
             break;

         default:
         // MPP 25.10.18 now leave the rest as they were, see above.
                                    // col.Header.Appearance.BackColor = mHeaderColour

             break;


     }

    break;
 
     case SearchColumnOption.Client:
     switch (key)
     {
         case 'Client':
         ColorCode = 'mIndexSearchColour';
             break;

         default:
         ColorCode = 'mHeaderColour';
             break;


     }

    break;


  }


}



}
